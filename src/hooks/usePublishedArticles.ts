import { supabase } from '@/integrations/supabase/client';
import { NewsArticle } from '@/types/news';
import { useEffect, useState } from 'react';

export const usePublishedArticles = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const transformToNewsArticle = (article: any): NewsArticle => {
    // Skip articles with null essential fields
    if (!article.id || !article.title || !article.content) {
      throw new Error('Article missing essential fields');
    }

    return {
      id: article.id,
      title: article.title,
      slug: article.slug || '',
      excerpt: article.excerpt || '',
      content: article.content,
      featuredImage: article.featured_image || 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=400&fit=crop',
      author: {
        id: article.author_id || '',
        name: article.author_name || 'Unknown Author',
        bio: '',
        avatar: article.author_avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        title: '',
        social: {}
      },
      category: {
        id: article.category_id || '',
        name: article.category_name || 'General',
        slug: article.category_name?.toLowerCase().replace(/\s+/g, '-') || 'general',
        description: '',
        color: article.category_color || '#3B82F6',
        icon: article.category_icon || '📰'
      },
      tags: article.tag_names || [],
      publishedAt: article.published_at || article.created_at || new Date().toISOString(),
      updatedAt: article.updated_at || new Date().toISOString(),
      readTime: article.read_time || 5,
      views: article.views || 0,
      reactions: {
        likes: 0,
        hearts: 0,
        laughs: 0,
        angry: 0
      },
      comments: [],
      featured: article.featured || false,
      trending: article.trending || false
    };
  };

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
    fetchPublishedArticles();
  }, []);

  return {
    articles,
    loading,
    error,
    refetch: fetchPublishedArticles
  };
};