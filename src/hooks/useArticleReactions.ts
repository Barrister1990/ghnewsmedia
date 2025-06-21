
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Reactions {
  likes: number;
  hearts: number;
  laughs: number;
  angry: number;
}

export const useArticleReactions = (articleId: string) => {
  const [reactions, setReactions] = useState<Reactions>({ likes: 0, hearts: 0, laughs: 0, angry: 0 });
  const [userReaction, setUserReaction] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Generate a session ID for anonymous users
  const getSessionId = () => {
    let sessionId = localStorage.getItem('ghnews_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('ghnews_session_id', sessionId);
    }
    return sessionId;
  };

  const fetchReactions = async () => {
    try {
      const { data, error } = await supabase.rpc('get_article_reactions', {
        article_uuid: articleId
      });

      if (error) throw error;

      if (data && data.length > 0) {
        const reactionData = data[0];
        setReactions({
          likes: Number(reactionData.likes) || 0,
          hearts: Number(reactionData.hearts) || 0,
          laughs: Number(reactionData.laughs) || 0,
          angry: Number(reactionData.angry) || 0
        });
      }
    } catch (error) {
      console.error('Error fetching reactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserReaction = async () => {
    try {
      const sessionId = getSessionId();
      const { data, error } = await supabase
        .from('reactions')
        .select('type')
        .eq('article_id', articleId)
        .eq('session_id', sessionId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setUserReaction(data.type);
      }
    } catch (error) {
      console.error('Error fetching user reaction:', error);
    }
  };

  const addReaction = async (type: string) => {
    try {
      const sessionId = getSessionId();
      
      const { error } = await supabase
        .from('reactions')
        .insert([{
          article_id: articleId,
          type: type as 'like' | 'heart' | 'laugh' | 'angry',
          session_id: sessionId
        }]);

      if (error) throw error;

      setUserReaction(type);
      await fetchReactions();
      toast.success('Reaction added!');
    } catch (error) {
      console.error('Error adding reaction:', error);
      toast.error('Failed to add reaction');
    }
  };

  const removeReaction = async () => {
    try {
      const sessionId = getSessionId();
      
      const { error } = await supabase
        .from('reactions')
        .delete()
        .eq('article_id', articleId)
        .eq('session_id', sessionId);

      if (error) throw error;

      setUserReaction(null);
      await fetchReactions();
      toast.success('Reaction removed!');
    } catch (error) {
      console.error('Error removing reaction:', error);
      toast.error('Failed to remove reaction');
    }
  };

  const handleReaction = async (type: string) => {
    if (userReaction === type) {
      await removeReaction();
    } else {
      if (userReaction) {
        await removeReaction();
      }
      await addReaction(type);
    }
  };

  useEffect(() => {
    if (articleId) {
      fetchReactions();
      fetchUserReaction();
    }
  }, [articleId]);

  return {
    reactions,
    userReaction,
    loading,
    handleReaction
  };
};
