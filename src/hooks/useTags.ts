
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Tag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export const useTags = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTags = async () => {
    try {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTags(data || []);
    } catch (error) {
      console.error('Error fetching tags:', error);
      toast.error('Failed to fetch tags');
    } finally {
      setLoading(false);
    }
  };

  const createTag = async (tagData: Omit<Tag, 'id' | 'created_at'>) => {
    try {
      const { error } = await supabase
        .from('tags')
        .insert(tagData);

      if (error) throw error;
      
      toast.success('Tag created successfully');
      fetchTags();
    } catch (error) {
      console.error('Error creating tag:', error);
      toast.error('Failed to create tag');
    }
  };

  const updateTag = async (id: string, tagData: Partial<Tag>) => {
    try {
      const { error } = await supabase
        .from('tags')
        .update(tagData)
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Tag updated successfully');
      fetchTags();
    } catch (error) {
      console.error('Error updating tag:', error);
      toast.error('Failed to update tag');
    }
  };

  const deleteTag = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tag?')) return;

    try {
      const { error } = await supabase
        .from('tags')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Tag deleted successfully');
      fetchTags();
    } catch (error) {
      console.error('Error deleting tag:', error);
      toast.error('Failed to delete tag');
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  return {
    tags,
    loading,
    createTag,
    updateTag,
    deleteTag,
    refetch: fetchTags
  };
};
