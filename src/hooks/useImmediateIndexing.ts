// Phase 5: Notify indexing is done via API route (server-side) so Google Indexing API credentials stay secure.
// Do not import GoogleIndexingService here — it uses google-auth-library (Node-only) and would break the browser bundle.
import { useCallback } from 'react';
import AdvancedSEOService from '../services/advancedSEOService';
import { NewsArticle } from '../types/news';

const NOTIFY_INDEXING_API = '/api/notify-indexing';
type IndexingSource = 'publish_event' | 'update_event' | 'view_fallback';
type IndexingInput = NewsArticle | { url?: string; category?: string; slug?: string };

function isNewsArticleInput(input: IndexingInput): input is NewsArticle {
  return typeof (input as NewsArticle).publishedAt === 'string' && typeof (input as NewsArticle).slug === 'string' && typeof (input as NewsArticle).category !== 'string';
}

export const useImmediateIndexing = () => {
  const seoService = AdvancedSEOService.getInstance();

  const notifySearchEngines = useCallback(async (input: IndexingInput, source: IndexingSource = 'view_fallback') => {
    const payload = isNewsArticleInput(input)
      ? { category: input.category.slug, slug: input.slug, publishedAt: input.publishedAt, source }
      : { ...input, source };
    try {
      const res = await fetch(NOTIFY_INDEXING_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        return {
          success: false,
          googleIndexing: false,
          error: data?.error || res.statusText,
          timestamp: new Date().toISOString(),
        };
      }
      return {
        success: true,
        googleIndexing: data.googleIndexing === true,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Failed to notify search engines:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      };
    }
  }, []);

  const batchIndexArticles = useCallback(async (articles: NewsArticle[]) => {
    let success = 0;
    let failed = 0;
    for (const article of articles) {
      const result = await notifySearchEngines(article);
      if (result.success) success++;
      else failed++;
      await new Promise((r) => setTimeout(r, 1000));
    }
    return { success, failed };
  }, [notifySearchEngines]);

  const checkIndexingStatus = useCallback(async (_url: string) => {
    // Status is only available server-side via Indexing API; client returns placeholder.
    return 'PENDING';
  }, []);

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
