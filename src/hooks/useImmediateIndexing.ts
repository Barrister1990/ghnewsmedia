
import { useCallback } from 'react';
import AdvancedSEOService from '../services/advancedSEOService';
import GoogleIndexingService from '../services/googleIndexingService';
import { NewsArticle } from '../types/news';

export const useImmediateIndexing = () => {
  const seoService = AdvancedSEOService.getInstance();
  const googleIndexingService = GoogleIndexingService.getInstance();

  const notifySearchEngines = useCallback(async (article: NewsArticle) => {
    try {
      console.log(`🚀 Starting immediate indexing for: ${article.slug}`);
      
      // 1. Immediately notify Google via Indexing API
      const googleSuccess = await googleIndexingService.notifyGoogleOfNewArticle(article);
      
      // 2. Notify other search engines via SEO service
      await seoService.notifySearchEnginesOfNewArticle(article);
      
      // 3. Log results for monitoring
      if (googleSuccess) {
        console.log(`✅ Google immediate indexing initiated for: ${article.slug}`);
      } else {
        console.log(`⚠️ Google immediate indexing failed, using fallback methods for: ${article.slug}`);
      }
      
      return { 
        success: true, 
        googleIndexing: googleSuccess,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Failed to notify search engines:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      };
    }
  }, [seoService, googleIndexingService]);

  const batchIndexArticles = useCallback(async (articles: NewsArticle[]) => {
    try {
      console.log(`🚀 Starting batch indexing for ${articles.length} articles`);
      
      const results = await googleIndexingService.batchSubmitArticles(articles);
      
      console.log(`✅ Batch indexing completed: ${results.success} success, ${results.failed} failed`);
      
      return results;
    } catch (error) {
      console.error('❌ Batch indexing failed:', error);
      return { success: 0, failed: articles.length };
    }
  }, [googleIndexingService]);

  const checkIndexingStatus = useCallback(async (url: string) => {
    try {
      const status = await googleIndexingService.getIndexingStatus(url);
      return status;
    } catch (error) {
      console.error('❌ Failed to check indexing status:', error);
      return 'UNKNOWN';
    }
  }, [googleIndexingService]);

  const generateOptimizedMetaTags = useCallback((article: NewsArticle) => {
    return {
      searchTags: seoService.generateSearchMetaTags(article),
      socialTags: seoService.generateSocialMediaTags(article),
      structuredData: seoService.generateAdvancedArticleSchema(article)
    };
  }, [seoService]);

  return {
    notifySearchEngines,
    batchIndexArticles,
    checkIndexingStatus,
    generateOptimizedMetaTags
  };
};
