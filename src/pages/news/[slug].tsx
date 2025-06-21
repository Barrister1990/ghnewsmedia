
import ArticleContent from '@/components/ArticleContent';
import ArticleHeader from '@/components/ArticleHeader';
import ArticleNavigation from '@/components/ArticleNavigation';
import ArticleNotFound from '@/components/ArticleNotFound';
import ArticlePageSkeleton from '@/components/ArticlePageSkeleton';
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
import { usePublishedArticles } from '@/hooks/usePublishedArticles';
import { useViewTracking } from '@/hooks/useViewTracking';
import { NewsArticle } from '@/types/news';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const ArticlePage = () => {
  const router = useRouter();
  const { slug } = router.query;
  const { articles, loading } = usePublishedArticles();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const { notifySearchEngines } = useImmediateIndexing();

  // Use our hooks
  const { reactions, userReaction, loading: reactionsLoading, handleReaction } = useArticleReactions(article?.id || '');
  useViewTracking(article?.slug || '');

  useEffect(() => {
    if (!loading && articles.length > 0 && slug) {
      const foundArticle = articles.find(a => a.slug === slug);
      if (foundArticle) {
        setArticle(foundArticle);
        
        // Notify search engines about article view for immediate indexing
        const articleAge = Date.now() - new Date(foundArticle.publishedAt).getTime();
        const oneHourMs = 60 * 60 * 1000;
        
        // For recently published articles (within 1 hour), trigger immediate indexing
        if (articleAge < oneHourMs) {
          notifySearchEngines(foundArticle);
        }
      }
    }
  }, [articles, loading, slug, notifySearchEngines]);

  if (loading) {
    return <ArticlePageSkeleton />;
  }

  if (!article) {
    return <ArticleNotFound />;
  }

  // Enhanced related articles logic with fallback
  const getRelatedArticles = () => {
    // First, try to get articles from the same category
    const sameCategoryArticles = articles
      .filter(a => a.id !== article.id && a.category.id === article.category.id)
      .slice(0, 3);

    // If we have enough articles from the same category, return them
    if (sameCategoryArticles.length === 3) {
      return sameCategoryArticles;
    }

    // If we need more articles, add articles from other categories
    const otherCategoryArticles = articles
      .filter(a => a.id !== article.id && a.category.id !== article.category.id)
      .slice(0, 3 - sameCategoryArticles.length);

    return [...sameCategoryArticles, ...otherCategoryArticles];
  };

  const relatedArticles = getRelatedArticles();

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
      
      <article className="container mx-auto px-4 py-8 max-w-4xl">
        <BreadcrumbSEO items={breadcrumbItems} />
        
        <ArticleHeader article={article} />
        <ArticleContent article={article} />
        
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
        <div className="mt-12">
          <NewCommentSection articleId={article.id} />
        </div>
      </article>
      
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default ArticlePage;
