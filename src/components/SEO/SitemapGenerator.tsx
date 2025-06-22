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

      // In production, these would be saved to your server/CDN
      console.log('SEO: Enhanced sitemap generated with', articles.length, 'articles');
      console.log('SEO: RSS feed generated with latest articles');
      
      // Notify search engines about updates
      const sitemapUrl = 'https://ghnewsmedia.com/sitemap.xml';
      dynamicSitemapGenerator.notifySearchEngines(sitemapUrl);
      
      // Log sitemap sample for debugging
      console.log('Sitemap sample:', sitemap.substring(0, 500) + '...');
    }
  }, [articles, categories, articlesLoading, categoriesLoading]);

  // This component doesn't render anything visible
  return null;
};

export default SitemapGenerator;