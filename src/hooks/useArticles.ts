
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
  author_id: string;
  meta_title?: string;
  meta_description?: string;
  keywords?: string[];
  category: {
    name: string;
    color: string;
  } | null;
  profiles: {
    name: string;
  } | null;
}

export const useArticles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select(`
          *,
          categories!articles_category_id_fkey(name, color),
          profiles!articles_author_id_fkey(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match our interface
      const transformedData = (data || []).map(item => ({
        ...item,
        category: item.categories ? (Array.isArray(item.categories) ? item.categories[0] : item.categories) : null,
        profiles: item.profiles ? (Array.isArray(item.profiles) ? item.profiles[0] : item.profiles) : null
      }));
      
      setArticles(transformedData);
    } catch (error) {
      console.error('Error fetching articles:', error);
      toast.error('Failed to fetch articles');
    } finally {
      setLoading(false);
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
      fetchArticles();
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
      fetchArticles();
    } catch (error) {
      console.error('Error toggling featured status:', error);
      toast.error('Failed to update featured status');
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
      fetchArticles();
    } catch (error) {
      console.error('Error deleting article:', error);
      toast.error('Failed to delete article');
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  return {
    articles,
    loading,
    updateArticleStatus,
    toggleFeatured,
    deleteArticle,
    refetch: fetchArticles
  };
};
