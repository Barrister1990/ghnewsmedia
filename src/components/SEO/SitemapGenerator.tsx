import React, { useEffect } from 'react';
import { usePublishedArticles } from '../../hooks/usePublishedArticles';
import { useSupabaseCategories } from '../../hooks/useSupabaseCategories';
import { dynamicSitemapGenerator } from '../../utils/dynamicSitemapGenerator';

const SitemapGenerator: React.FC = () => {
  const { articles, loading: articlesLoading } = usePublishedArticles();
  const { categories, loading: categoriesLoading } = useSupabaseCategories();

  useEffect(() => {
    if (!articlesLoading && !categoriesLoading && articles.length > 0) {
      // Generate comprehensive sitemap with news and image tags
      const sitemap = dynamicSitemapGenerator.generateComprehensiveSitemap(articles, categories);
      dynamicSitemapGenerator.generateRSSFeed(articles);

      // Notify search engines about updates
      const sitemapUrl = 'https://ghnewsmedia.com/sitemap.xml';
      dynamicSitemapGenerator.notifySearchEngines(sitemapUrl);
      if (process.env.NODE_ENV === 'development' && process.env.DEBUG_SEO === 'true') {
        console.log('SEO: Sitemap generated with', articles.length, 'articles');
      }
    }
  }, [articles, categories, articlesLoading, categoriesLoading]);

  // This component doesn't render anything visible
  return null;
};

export default SitemapGenerator;