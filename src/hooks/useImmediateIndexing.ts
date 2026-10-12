// Publishing notifications go through /api/notify-indexing (server-side), which refreshes cached
// pages and pushes the RSS feed to the WebSub hub.
import { useCallback } from 'react';
import AdvancedSEOService from '../services/advancedSEOService';
import { NewsArticle } from '../types/news';

const NOTIFY_INDEXING_API = '/api/notify-indexing';
type IndexingSource = 'publish_event' | 'update_event' | 'status_change';
type IndexingInput = NewsArticle | { url?: string; category?: string; slug?: string; articleId?: string };

function isNewsArticleInput(input: IndexingInput): input is NewsArticle {
  return typeof (input as NewsArticle).publishedAt === 'string' && typeof (input as NewsArticle).slug === 'string' && typeof (input as NewsArticle).category !== 'string';
}

/** Fire-and-forget notification usable outside React components (e.g. data hooks). */
export async function notifyArticleChange(input: IndexingInput, source: IndexingSource = 'update_event') {
  const payload = isNewsArticleInput(input)
    ? { category: input.category.slug, slug: input.slug, source }
    : { ...input, source };
  try {
    const res = await fetch(NOTIFY_INDEXING_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { success: false, error: data?.error || res.statusText, timestamp: new Date().toISOString() };
    }
    return { success: true, timestamp: new Date().toISOString() };
  } catch (error) {
    console.error('Failed to notify search engines:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    };
  }
}

export const useImmediateIndexing = () => {
  const seoService = AdvancedSEOService.getInstance();

  const notifySearchEngines = useCallback(
    (input: IndexingInput, source: IndexingSource = 'update_event') => notifyArticleChange(input, source),
    []
  );

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
