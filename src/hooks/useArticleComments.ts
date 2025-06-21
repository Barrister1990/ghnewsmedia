
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Comment {
  id: string;
  content: string;
  author_name: string;
  created_at: string;
  parent_id: string | null;
  replies_count: number;
}

export const useArticleComments = (articleId: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase.rpc('get_article_comments', {
        article_uuid: articleId
      });

      if (error) throw error;

      setComments(data || []);
      console.log('Fetched comments:', data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (content: string, authorName: string, parentId?: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('comments')
        .insert([{
          article_id: articleId,
          content,
          author_name: authorName,
          parent_id: parentId || null
        }]);

      if (error) throw error;

      toast.success('Comment added successfully!');
      console.log('Comment added, refreshing comments...');
      await fetchComments();
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (articleId) {
      fetchComments();
    }
  }, [articleId]);

  return {
    comments,
    loading,
    addComment,
    refetch: fetchComments
  };
};
