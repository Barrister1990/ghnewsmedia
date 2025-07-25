import { supabase } from '@/integrations/supabase/client';
import { NewsArticle } from '@/types/news';
import { useEffect, useState } from 'react';

interface SupabaseArticle {
  id: string | null;
  title: string | null;
  slug: string | null;
  excerpt?: string | null;
  content: string | null;
  featured_image?: string | null;
  status: 'draft' | 'published' | 'archived' | null;
  featured: boolean | null;
  trending: boolean | null;
  views: number | null;
  published_at: string | null;
  created_at: string | null;
  updated_at: string | null;
  read_time: number | null;
  author_id: string | null;
  category_id: string | null;
  category_name: string | null;
  category_color: string | null;
  category_icon?: string | null;
  author_name: string | null;
  author_avatar?: string | null;
  tag_names?: string[] | null;
}

export const useBreakingNews = () => {
  const [breakingNews, setBreakingNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const transformToNewsArticle = (article: SupabaseArticle): NewsArticle => {
    return {
      id: article.id || '',
      title: article.title || 'Untitled',
      slug: article.slug || '',
      excerpt: article.excerpt || '',
      content: article.content || '',
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
        icon: article.category_icon || '📰',
        updated_at: article.updated_at || new Date().toISOString()
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

  const fetchBreakingNews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching breaking news articles...');
      
      // First, try to get articles tagged with "breaking news"
      const { data: articlesData, error: articlesError } = await supabase
        .from('articles_with_details')
        .select('*')
        .eq('status', 'published')
        .contains('tag_names', ['breaking news'])
        .order('published_at', { ascending: false, nullsFirst: false })
        .limit(10);

      if (articlesError) {
        console.error('Error fetching breaking news:', articlesError);
        throw articlesError;
      }

      console.log('Raw breaking news data:', articlesData);

      let breakingArticles = articlesData || [];
      
      // If no articles with "breaking news" tag, also try "breaking-news" and "BREAKING"
      if (breakingArticles.length === 0) {
        console.log('No articles found with "breaking news" tag, trying alternatives...');
        
        const { data: altData, error: altError } = await supabase
          .from('articles_with_details')
          .select('*')
          .eq('status', 'published')
          .or('tag_names.cs.{"breaking-news"},tag_names.cs.{"BREAKING"},tag_names.cs.{"Breaking"}')
          .order('published_at', { ascending: false, nullsFirst: false })
          .limit(10);

        if (!altError && altData) {
          breakingArticles = altData;
          console.log('Found articles with alternative breaking news tags:', altData);
        }
      }

      // If still no breaking news, get the most recent articles and mark them as breaking
      if (breakingArticles.length === 0) {
        console.log('No breaking news articles found, using most recent articles...');
        
        const { data: recentData, error: recentError } = await supabase
          .from('articles_with_details')
          .select('*')
          .eq('status', 'published')
          .order('published_at', { ascending: false, nullsFirst: false })
          .limit(3);

        if (!recentError && recentData && recentData.length > 0) {
          breakingArticles = recentData;
          console.log('Using most recent articles as breaking news:', recentData);
        }
      }

      const transformedArticles = breakingArticles.map(transformToNewsArticle);
      setBreakingNews(transformedArticles);
      console.log('Final breaking news articles:', transformedArticles);
      
    } catch (error) {
      console.error('Error in fetchBreakingNews:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch breaking news');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBreakingNews();
    
    // Set up periodic refresh every 5 minutes
    const interval = setInterval(fetchBreakingNews, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    breakingNews,
    loading,
    error,
    refetch: fetchBreakingNews
  };
};