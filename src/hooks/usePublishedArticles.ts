import { supabase } from '@/integrations/supabase/client';
import { transformToNewsArticle } from '@/lib/articles';
import { NewsArticle } from '@/types/news';
import { useEffect, useState } from 'react';

export const usePublishedArticles = (initialArticles?: NewsArticle[]) => {
  const [articles, setArticles] = useState<NewsArticle[]>(initialArticles || []);
  const [loading, setLoading] = useState(!initialArticles);
  const [error, setError] = useState<string | null>(null);

  const fetchPublishedArticles = async () => {
    try {
      setLoading(true);
      setError(null);
            
      const { data: articlesData, error: articlesError } = await supabase
        .from('articles_with_details')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false });

      if (articlesError) {
        console.error('Error fetching articles:', articlesError);
        throw articlesError;
      }

      // Filter and transform articles, handling potential null values
      const transformedArticles = (articlesData || [])
        .filter(article => article.id && article.title && article.content) // Filter out incomplete articles
        .map(transformToNewsArticle);
            
      setArticles(transformedArticles);
      console.log('Fetched published articles:', transformedArticles);
          
    } catch (error) {
      console.error('Error in fetchPublishedArticles:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch articles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch if we don't have initial articles
    if (!initialArticles) {
      fetchPublishedArticles();
    }
  }, [initialArticles]);

  return {
    articles,
    loading,
    error,
    refetch: fetchPublishedArticles
  };
};