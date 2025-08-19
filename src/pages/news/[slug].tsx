// pages/news/[slug].tsx - SEO-Optimized Article Page with Mobile-First Design
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
import RandomArticleSuggestions from '@/components/RandomArticleSuggestions';
import ReadingProgress from '@/components/ReadingProgress';
import RelatedArticles from '@/components/RelatedArticles';
import ScrollToTop from '@/components/ScrollToTop';
import BreadcrumbSEO from '@/components/SEO/BreadcrumbSEO';
import EnhancedArticleSEO from '@/components/SEO/EnhancedArticleSEO';
import GoogleNewsSEO from '@/components/SEO/GoogleNewsSEO';
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
  allArticles: NewsArticle[];
  error?: string;
}

interface Params extends ParsedUrlQuery {
  slug: string;
}

const ArticlePage = ({ article, relatedArticles, allArticles, error }: ArticlePageProps) => {
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Header />
        <main className="container mx-auto px-4 py-8 sm:py-12" role="main" aria-labelledby="error-heading">
          <section className="text-center max-w-md mx-auto">
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-200">
              <h1 id="error-heading" className="text-2xl sm:text-3xl font-bold text-red-600 mb-4">
                Error
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">{error}</p>
            </div>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <EnhancedArticleSEO article={article} />
      <GoogleNewsSEO article={article} />

      <ReadingProgress />
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12" role="main" aria-label={`Article: ${article.title}`}>
        <article className="max-w-4xl mx-auto">
          {/* Enhanced Breadcrumb with Mobile-First Design */}
          <div className="mb-6 sm:mb-8">
            <BreadcrumbSEO items={breadcrumbItems} />
          </div>

          {/* Article Header with Enhanced Mobile Design */}
          <div className="mb-8 sm:mb-12">
            <ArticleHeader article={article} />
          </div>

          {/* Article Content with Mobile-First Layout */}
          <div className="mb-12 sm:mb-16">
            <ArticleContent 
              content={article.content}
              featuredImage={article.featuredImage}
              featuredImageCredit={article.featured_image_credit}
              inlineImageCredits={article.inline_image_credits}
            />
          </div>
        </article>

        {/* Enhanced Share Buttons with Mobile-First Design */}
        <div className="mb-8 sm:mb-12 flex justify-center">
          <div className="w-full max-w-2xl">
            <ShareButtons
              url={articleUrl}
              title={article.title}
              description={article.excerpt}
              image={article.featuredImage}
              className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200"
            />
          </div>
        </div>

        {/* Article Tags with Enhanced Mobile Design */}
        <div className="mb-8 sm:mb-12">
          <ArticleTags tags={article.tags || []} />
        </div>

        {/* Article Reactions with Mobile-First Design */}
        <div className="mb-8 sm:mb-12">
          <ArticleReactions
            reactions={reactions}
            userReaction={userReaction}
            loading={reactionsLoading}
            onReaction={handleReaction}
          />
        </div>

        {/* Author Bio with Enhanced Mobile Design */}
        <div className="mb-8 sm:mb-12">
          <AuthorBio author={article.author} />
        </div>

        {/* Article Navigation with Mobile-First Design */}
        <div className="mb-8 sm:mb-12">
          <ArticleNavigation category={article.category} author={article.author} />
        </div>

        {/* Related Articles with Enhanced Mobile Design */}
        <div className="mb-12 sm:mb-16">
          <RelatedArticles articles={relatedArticles} />
        </div>

        {/* Comments Section with Mobile-First Design */}
        <section className="mt-12 sm:mt-16" aria-label="Comments section">
          <div className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg border border-gray-200">
            <NewCommentSection articleId={article.id} />
          </div>
        </section>
      </main>

      {/* Random Article Suggestions */}
      <RandomArticleSuggestions
        articles={allArticles}
        currentArticleId={article.id}
        currentCategoryId={article.category.id}
      />
      
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
        allArticles: articles,
      },
    };
  } catch (error) {
    return {
      props: {
        article: null,
        relatedArticles: [],
        allArticles: [],
        error: 'Failed to load article',
      },
    };
  }
};

export default ArticlePage;
