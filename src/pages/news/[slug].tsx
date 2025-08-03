// pages/news/[slug].tsx - SEO-Optimized Article Page
import ArticleContent from '@/components/ArticleContent';
import ArticleHeader from '@/components/ArticleHeader';
import ArticleNavigation from '@/components/ArticleNavigation';
import ArticleNotFound from '@/components/ArticleNotFound';
import ArticleReactions from '@/components/ArticleReactions';
import ArticleTags from '@/components/ArticleTags';
import AuthorBio from '@/components/AuthorBio';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import NewCommentSection from '@/components/NewCommentSection';
import ReadingProgress from '@/components/ReadingProgress';
import RelatedArticles from '@/components/RelatedArticles';
import ScrollToTop from '@/components/ScrollToTop';
import BreadcrumbSEO from '@/components/SEO/BreadcrumbSEO';
import EnhancedArticleSEO from '@/components/SEO/EnhancedArticleSEO';
import ShareButtons from '@/components/ShareButtons';
import { useArticleReactions } from '@/hooks/useArticleReactions';
import { useImmediateIndexing } from '@/hooks/useImmediateIndexing';
import { useViewTracking } from '@/hooks/useViewTracking';
import { fetchArticleBySlug, fetchPublishedArticles } from '@/lib/articles';
import { NewsArticle } from '@/types/news';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { useEffect } from 'react';

interface ArticlePageProps {
  article: NewsArticle | null;
  relatedArticles: NewsArticle[];
  error?: string;
}

interface Params extends ParsedUrlQuery {
  slug: string;
}

const ArticlePage = ({ article, relatedArticles, error }: ArticlePageProps) => {
  const { notifySearchEngines } = useImmediateIndexing();
  
  // Use our hooks with the server-side article data
  const { reactions, userReaction, loading: reactionsLoading, handleReaction } = useArticleReactions(article?.id || '');
  useViewTracking(article?.slug || '');

  useEffect(() => {
    if (article) {
      // Notify search engines about article view for immediate indexing
      const articleAge = Date.now() - new Date(article.publishedAt).getTime();
      const oneHourMs = 60 * 60 * 1000;
      
      // For recently published articles (within 1 hour), trigger immediate indexing
      if (articleAge < oneHourMs) {
        notifySearchEngines(article);
      }
    }
  }, [article, notifySearchEngines]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8" role="main" aria-labelledby="error-heading">
          <section className="text-center">
            <h1 id="error-heading" className="text-2xl font-bold text-red-600 mb-4">
              Error
            </h1>
            <p className="text-gray-600">{error}</p>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return <ArticleNotFound />;
  }

  const breadcrumbItems = [
    { name: 'Home', url: 'https://ghnewsmedia.com' },
    { name: article.category.name, url: `https://ghnewsmedia.com/category/${article.category.slug}` },
    { name: article.title }
  ];

  const articleUrl = `https://ghnewsmedia.com/news/${article.slug}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <EnhancedArticleSEO article={article} />

      <ReadingProgress />
      <Header />

      <main className="container mx-auto px-4 py-8" role="main" aria-label={`Article: ${article.title}`}>
        <article className="max-w-4xl mx-auto">
          <BreadcrumbSEO items={breadcrumbItems} />

          <ArticleHeader article={article} />
          <ArticleContent article={article} relatedArticles={relatedArticles} />
        </article>

        {/* Share buttons positioned after article content */}
        <div className="mb-8 flex justify-center">
          <ShareButtons
            url={articleUrl}
            title={article.title}
            description={article.excerpt}
            image={article.featuredImage}
            className="bg-white rounded-xl p-4 shadow-sm"
          />
        </div>

        <ArticleTags tags={article.tags || []} />

        <ArticleReactions
          reactions={reactions}
          userReaction={userReaction}
          loading={reactionsLoading}
          onReaction={handleReaction}
        />

        <AuthorBio author={article.author} />

        <ArticleNavigation category={article.category} author={article.author} />

        <RelatedArticles articles={relatedArticles} />

        {/* Comments Section - Now positioned after Related Articles */}
        <section className="mt-12" aria-label="Comments section">
          <NewCommentSection articleId={article.id} />
        </section>
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<ArticlePageProps, Params> = async (
  context: GetServerSidePropsContext<Params>
) => {
  const { slug } = context.params!;

  try {
    // Fetch the specific article by slug
    const { article, error: articleError } = await fetchArticleBySlug(slug);

    if (articleError || !article) {
      return {
        notFound: true, // This will show Next.js 404 page
      };
    }

    // Fetch all articles to get related ones
    const { articles } = await fetchPublishedArticles();

    // Enhanced related articles logic with fallback
    const getRelatedArticles = (currentArticle: NewsArticle, allArticles: NewsArticle[]) => {
      // First, try to get articles from the same category
      const sameCategoryArticles = allArticles
        .filter((a) => a.id !== currentArticle.id && a.category.id === currentArticle.category.id)
        .slice(0, 3);

      // If we have enough articles from the same category, return them
      if (sameCategoryArticles.length === 3) {
        return sameCategoryArticles;
      }

      // If we need more articles, add articles from other categories
      const otherCategoryArticles = allArticles
        .filter((a) => a.id !== currentArticle.id && a.category.id !== currentArticle.category.id)
        .slice(0, 3 - sameCategoryArticles.length);

      return [...sameCategoryArticles, ...otherCategoryArticles];
    };

    const relatedArticles = getRelatedArticles(article, articles);

    // Set cache headers for better performance
    context.res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600'); // Cache for 5 minutes, serve stale for 10 minutes

    // Set canonical URL header
    context.res.setHeader('Link', `<https://ghnewsmedia.com/news/${article.slug}>; rel="canonical"`);

    // Set last modified header for better caching
    if (article.updatedAt) {
      context.res.setHeader('Last-Modified', new Date(article.updatedAt).toUTCString());
    }

    return {
      props: {
        article,
        relatedArticles,
      },
    };
  } catch (error) {
    return {
      props: {
        article: null,
        relatedArticles: [],
        error: 'Failed to load article',
      },
    };
  }
};

export default ArticlePage;
