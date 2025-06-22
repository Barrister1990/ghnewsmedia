import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';
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

// Interface for raw Supabase data
interface SupabaseArticleData {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image: string | null;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  trending: boolean;
  views: number;
  published_at: string | null;
  created_at: string;
  author_id: string;
  category_id: string;
  meta_title: string | null;
  meta_description: string | null;
  keywords: string[] | null;
  categories: {
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
      // Try different approaches to get the related data
      let data, error;
      
      // First, try with the foreign key constraint names you used
      ({ data, error } = await supabase
        .from('articles')
        .select(`
          *,
          categories!articles_category_id_fkey(name, color),
          profiles!articles_author_id_fkey(name)
        `)
        .order('created_at', { ascending: false }));

      // If that fails, try with simpler foreign key references
      if (error && error.message.includes('could not find the relation')) {
        console.log('Trying alternative foreign key references...');
        ({ data, error } = await supabase
          .from('articles')
          .select(`
            *,
            categories(name, color),
            profiles(name)
          `)
          .order('created_at', { ascending: false }));
      }

      // If still failing, try without foreign key names
      if (error && error.message.includes('could not find the relation')) {
        console.log('Trying without explicit foreign key references...');
        ({ data, error } = await supabase
          .from('articles')
          .select(`
            *,
            category_id,
            author_id
          `)
          .order('created_at', { ascending: false }));
      }

      if (error) throw error;
      
      // Transform the data to match our interface
      const transformedData: Article[] = (data as unknown as SupabaseArticleData[] || []).map(item => ({
        id: item.id,
        title: item.title,
        slug: item.slug,
        excerpt: item.excerpt || undefined,
        content: item.content,
        featured_image: item.featured_image || undefined,
        status: item.status,
        featured: item.featured,
        trending: item.trending,
        views: item.views,
        published_at: item.published_at,
        created_at: item.created_at,
        author_id: item.author_id,
        meta_title: item.meta_title || undefined,
        meta_description: item.meta_description || undefined,
        keywords: item.keywords || undefined,
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