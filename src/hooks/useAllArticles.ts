
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featured_image?: string;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  trending: boolean;
  views: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  author_id: string;
  category_id: string;
  meta_title?: string;
  meta_description?: string;
  keywords?: string[];
  category: {
    id: string;
    name: string;
    color: string;
    slug: string;
    description?: string;
    icon?: string;
  } | null;
  author: {
    id: string;
    name: string;
    bio?: string;
    avatar?: string;
    title?: string;
  } | null;
}

export const useAllArticles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch articles from the articles_with_details view
      const { data: articlesData, error: articlesError } = await supabase
        .from('articles_with_details')
        .select('*')
        .order('created_at', { ascending: false });

      if (articlesError) {
        console.error('Error fetching articles:', articlesError);
        throw articlesError;
      }

      // Transform the data to match our interface
      const transformedArticles = (articlesData || []).map(article => ({
        id: article.id || '',
        title: article.title || '',
        slug: article.slug || '',
        excerpt: article.excerpt,
        content: article.content || '',
        featured_image: article.featured_image,
        status: article.status || 'draft',
        featured: article.featured || false,
        trending: article.trending || false,
        views: article.views || 0,
        published_at: article.published_at,
        created_at: article.created_at || '',
        updated_at: article.updated_at || '',
        author_id: article.author_id || '',
        category_id: article.category_id || '',
        meta_title: article.meta_title,
        meta_description: article.meta_description,
        keywords: article.keywords,
        category: article.category_id ? {
          id: article.category_id,
          name: article.category_name || 'Unknown',
          color: article.category_color || '#3B82F6',
          slug: article.category_id,
          description: undefined,
          icon: article.category_icon
        } : null,
        author: article.author_id ? {
          id: article.author_id,
          name: article.author_name || 'Unknown Author',
          bio: undefined,
          avatar: article.author_avatar,
          title: undefined
        } : null
      }));

      setArticles(transformedArticles);
      console.log('Fetched articles:', transformedArticles);
      
    } catch (error) {
      console.error('Error in fetchArticles:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch articles');
      toast.error('Failed to fetch articles');
    } finally {
      setLoading(false);
    }
  };

  const deleteArticle = async (articleId: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', articleId);

      if (error) throw error;
      
      toast.success('Article deleted successfully');
      fetchArticles(); // Refresh the list
    } catch (error) {
      console.error('Error deleting article:', error);
      toast.error('Failed to delete article');
    }
  };

  const updateArticleStatus = async (articleId: string, newStatus: 'draft' | 'published' | 'archived') => {
    try {
      const { error } = await supabase
        .from('articles')
        .update({ 
          status: newStatus,
          published_at: newStatus === 'published' ? new Date().toISOString() : null
        })
        .eq('id', articleId);

      if (error) throw error;
      
      toast.success(`Article ${newStatus} successfully`);
      fetchArticles(); // Refresh the list
    } catch (error) {
      console.error('Error updating article status:', error);
      toast.error('Failed to update article status');
    }
  };

  const toggleFeatured = async (articleId: string, currentFeatured: boolean) => {
    try {
      const { error } = await supabase
        .from('articles')
        .update({ featured: !currentFeatured })
        .eq('id', articleId);

      if (error) throw error;
      
      toast.success(`Article ${!currentFeatured ? 'featured' : 'unfeatured'} successfully`);
      fetchArticles(); // Refresh the list
    } catch (error) {
      console.error('Error toggling featured status:', error);
      toast.error('Failed to update featured status');
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  return {
    articles,
    loading,
    error,
    deleteArticle,
    updateArticleStatus,
    toggleFeatured,
    refetch: fetchArticles
  };
};
