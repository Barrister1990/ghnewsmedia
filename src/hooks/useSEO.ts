import { Category, NewsArticle } from '@/types/news';
import { useCallback, useEffect, useState } from 'react';
import { SITE_URL } from '../config/site';
import SEOService from '../services/seoService';
import { usePublishedArticles } from './usePublishedArticles';
import { useSupabaseCategories } from './useSupabaseCategories';

// Define proper types for your data structures




interface BreadcrumbItem {
  name: string;
  url: string;
}

export const useSEO = () => {
  const { articles } = usePublishedArticles();
  const { categories } = useSupabaseCategories();
  const [seoService] = useState(() => SEOService.getInstance());
  
  const updateDocumentMeta = useCallback(() => {
    // Ensure canonical always uses the www domain (never bare ghnewsmedia.com).
    const existingCanonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    const normalizedHref = window.location.href.replace(
      /^https:\/\/ghnewsmedia\.com/i,
      SITE_URL
    );
    if (existingCanonical) {
      existingCanonical.href = normalizedHref;
    } else {
      const canonical = document.createElement('link');
      canonical.rel = 'canonical';
      canonical.href = normalizedHref;
      document.head.appendChild(canonical);
    }

    // Add RSS feed link
    if (!document.querySelector('link[type="application/rss+xml"]')) {
      const rssLink = document.createElement('link');
      rssLink.rel = 'alternate';
      rssLink.type = 'application/rss+xml';
      rssLink.title = 'GH News Media RSS Feed';
      rssLink.href = `${SITE_URL}/rss.xml`;
      document.head.appendChild(rssLink);
    }

    // Add JSON-LD for organization
    if (!document.querySelector('script[data-type="organization"]')) {
      const orgScript = document.createElement('script');
      orgScript.type = 'application/ld+json';
      orgScript.setAttribute('data-type', 'organization');
      orgScript.textContent = JSON.stringify(seoService.generateOrganizationData());
      document.head.appendChild(orgScript);
    }
  }, [seoService]);
  
  // Generate and update sitemap when articles change
  useEffect(() => {
    if (articles.length > 0 && categories.length > 0) {
      const sitemap = seoService.generateSitemap(articles, categories);
      const rssContent = seoService.generateRSSFeed(articles);
      
      // Update document meta for better crawling
      updateDocumentMeta();
      
      // In a real application, you would save these to your server
      console.log('Generated sitemap:', sitemap.substring(0, 200) + '...');
      console.log('Generated RSS feed:', rssContent.substring(0, 200) + '...');
      
      // Notify search engines of updates
      const sitemapUrl = `${SITE_URL}/sitemap.xml`;
      seoService.notifySearchEngines(sitemapUrl);
    }
  }, [articles, categories, seoService, updateDocumentMeta]);

  return {
    generateSitemap: (articlesData: NewsArticle[], categoriesData: Category[]) => 
      seoService.generateSitemap(articlesData, categoriesData),
    generateRSSFeed: (articlesData: NewsArticle[]) => 
      seoService.generateRSSFeed(articlesData),
    generateArticleStructuredData: (article: NewsArticle) => 
      seoService.generateEnhancedStructuredData(article),
    generateBreadcrumbData: (items: BreadcrumbItem[]) => 
      seoService.generateBreadcrumbData(items),
    notifySearchEngines: (sitemapUrl: string) => 
      seoService.notifySearchEngines(sitemapUrl)
  };
};