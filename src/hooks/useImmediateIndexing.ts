
import { useCallback } from 'react';
import AdvancedSEOService from '../services/advancedSEOService';
import { NewsArticle } from '../types/news';

export const useImmediateIndexing = () => {
  const seoService = AdvancedSEOService.getInstance();

  const notifySearchEngines = useCallback(async (article: NewsArticle) => {
    try {
      // Immediately notify search engines about the new article
      await seoService.notifySearchEnginesOfNewArticle(article);
      
      // Log for monitoring
      console.log(`SEO: Immediate indexing initiated for article: ${article.slug}`);
      
      return { success: true };
    } catch (error) {
      console.error('Failed to notify search engines:', error);
      return { success: false, error };
    }
  }, [seoService]);

  const generateOptimizedMetaTags = useCallback((article: NewsArticle) => {
    return {
      searchTags: seoService.generateSearchMetaTags(article),
      socialTags: seoService.generateSocialMediaTags(article),
      structuredData: seoService.generateAdvancedArticleSchema(article)
    };
  }, [seoService]);

  return {
    notifySearchEngines,
    generateOptimizedMetaTags
  };
};
