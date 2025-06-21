
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useViewTracking = (articleSlug: string) => {
  useEffect(() => {
    if (!articleSlug) return;

    const incrementView = async () => {
      try {
        await supabase.rpc('increment_article_views', {
          article_slug: articleSlug
        });
        console.log('Article view tracked for:', articleSlug);
      } catch (error) {
        console.error('Error tracking article view:', error);
      }
    };

    // Track view after a short delay to ensure the user is actually reading
    const timer = setTimeout(incrementView, 3000);

    return () => clearTimeout(timer);
  }, [articleSlug]);
};
