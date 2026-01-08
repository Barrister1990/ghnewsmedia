// pages/[category]/[slug].tsx - SEO-Optimized Article Page with Category-based URLs
import ArticleContent from '@/components/ArticleContent';
import ArticleHeader from '@/components/ArticleHeader';
import ArticleNotFound from '@/components/ArticleNotFound';
import ArticleTags from '@/components/ArticleTags';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import ReadAloud from '@/components/ReadAloud';
import ReadingProgress from '@/components/ReadingProgress';
import RelatedArticles from '@/components/RelatedArticles';
import ScrollToTop from '@/components/ScrollToTop';
import EnhancedArticleSEO from '@/components/SEO/EnhancedArticleSEO';
import GoogleNewsSEO from '@/components/SEO/GoogleNewsSEO';
import ShareButtons from '@/components/ShareButtons';
import { useArticleReactions } from '@/hooks/useArticleReactions';
import { useImmediateIndexing } from '@/hooks/useImmediateIndexing';
import { useViewTracking } from '@/hooks/useViewTracking';
import { fetchArticleBySlug, fetchPublishedArticles } from '@/lib/articles';
import { Category, NewsArticle } from '@/types/news';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Link from 'next/link';
import { ParsedUrlQuery } from 'querystring';
import { useEffect } from 'react';

interface ArticlePageProps {
  article: NewsArticle | null;
  relatedArticles: NewsArticle[];
  allArticles: NewsArticle[];
  error?: string;
  // For category pages
  category?: Category | null;
  categoryArticles?: NewsArticle[];
  totalArticles?: number;
  isCategoryPage?: boolean;
}

interface Params extends ParsedUrlQuery {
  category: string;
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
    { name: article.category.name, url: `https://ghnewsmedia.com/${article.category.slug}` },
    { name: article.title }
  ];

  const articleUrl = `https://ghnewsmedia.com/${article.category.slug}/${article.slug}`;

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', 'Source Sans 3', system-ui, sans-serif" }}>
      <EnhancedArticleSEO article={article} />
      <GoogleNewsSEO article={article} />

      <ReadingProgress />
      <Header />

      <main className="container mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8" role="main" aria-label={`Article: ${article.title}`}>
        <article className="max-w-3xl mx-auto">
          {/* Breadcrumb - Pulse Style */}
          <div className="mb-4 sm:mb-6">
            <nav style={{ fontSize: '12px', color: '#6B7280' }}>
              <span>
                <Link href="/" style={{ color: '#6B7280', textDecoration: 'none' }}>Home</Link>
              </span>
              <span style={{ margin: '0 8px' }}>/</span>
              <span>
                <Link href={`/${article.category.slug}`} style={{ color: '#6B7280', textDecoration: 'none' }}>
                  {article.category.name}
                </Link>
              </span>
            </nav>
          </div>

          {/* Article Header - Pulse Style */}
          <div className="mb-6 sm:mb-8">
            <ArticleHeader article={article} />
          </div>

          {/* Read Aloud Feature */}
          <div className="mb-4 sm:mb-6">
            <ReadAloud 
              articleTitle={article.title}
              articleContent={article.content}
            />
          </div>

          {/* Article Content - Pulse Style */}
          <div className="mb-8 sm:mb-12">
            <ArticleContent 
              content={article.content}
              featuredImage={article.featuredImage}
              featuredImageCredit={article.featured_image_credit}
              inlineImageCredits={article.inline_image_credits}
              relatedArticles={relatedArticles}
            />
          </div>
        </article>

        {/* Share Buttons - Pulse Style */}
        <div className="mb-6 sm:mb-8 flex justify-center">
          <div className="w-full max-w-3xl">
            <ShareButtons
              url={articleUrl}
              title={article.title}
              description={article.excerpt}
              image={article.featuredImage}
            />
          </div>
        </div>

        {/* Article Tags - Pulse Style */}
        {article.tags && article.tags.length > 0 && (
          <div className="mb-6 sm:mb-8 max-w-3xl mx-auto">
            <ArticleTags tags={article.tags} />
          </div>
        )}

        {/* Related Articles - Pulse Style */}
        <div className="mb-8 sm:mb-12 max-w-3xl mx-auto">
          <RelatedArticles articles={relatedArticles} />
        </div>
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<ArticlePageProps, Params> = async (
  context: GetServerSidePropsContext<Params>
) => {
  const { category, slug } = context.params!;

  // Ensure both category and slug are present (this route should only match two-segment paths)
  if (!category || !slug) {
    return {
      notFound: true,
    };
  }

  try {
    // Fetch the specific article by slug
    const { article, error: articleError } = await fetchArticleBySlug(slug);

    if (articleError || !article) {
      return {
        notFound: true, // This will show Next.js 404 page
      };
    }

    // Verify that the category in the URL matches the article's category
    // If not, redirect to the correct URL
    if (article.category.slug !== category) {
      return {
        redirect: {
          destination: `/${article.category.slug}/${article.slug}`,
          permanent: true, // 301 redirect for SEO
        },
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
    context.res.setHeader('Link', `<https://ghnewsmedia.com/${article.category.slug}/${article.slug}>; rel="canonical"`);

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
