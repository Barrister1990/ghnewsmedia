
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';

interface SocialMediaAccount {
  id: string;
  platform: string;
  handle: string;
  followers_count: number;
  profile_url?: string;
}

interface SocialMediaPost {
  id: string;
  content: string;
  engagement: string | null;
  posted_at: string;
  account_id: string;
  account: {
    platform: string;
  };
}

interface SocialMediaStats {
  platform: string;
  handle: string;
  followers_count: number;
  recent_posts_count: number;
}

export const useSocialMediaData = () => {
  const [accounts, setAccounts] = useState<SocialMediaAccount[]>([]);
  const [posts, setPosts] = useState<SocialMediaPost[]>([]);
  const [stats, setStats] = useState<SocialMediaStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAccounts = async () => {
    try {
      const { data, error } = await supabase
        .from('social_media_accounts')
        .select('*')
        .order('followers_count', { ascending: false });

      if (error) throw error;
      setAccounts(data || []);
    } catch (err) {
      console.error('Error fetching social media accounts:', err);
      setError('Failed to load social media accounts');
    }
  };

  const fetchRecentPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('social_media_posts')
        .select(`
          *,
          account:social_media_accounts(platform)
        `)
        .order('posted_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setPosts(data || []);
    } catch (err) {
      console.error('Error fetching social media posts:', err);
      setError('Failed to load social media posts');
    }
  };

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase.rpc('get_social_media_stats');
      
      if (error) throw error;
      setStats(data || []);
    } catch (err) {
      console.error('Error fetching social media stats:', err);
      setError('Failed to load social media stats');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchAccounts(), fetchRecentPosts(), fetchStats()]);
      setLoading(false);
    };

    loadData();

    // Set up real-time subscriptions
    const accountsChannel = supabase
      .channel('social-media-accounts-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'social_media_accounts'
        },
        () => {
          console.log('Social media accounts updated, refreshing...');
          fetchAccounts();
          fetchStats();
        }
      )
      .subscribe();

    const postsChannel = supabase
      .channel('social-media-posts-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'social_media_posts'
        },
        () => {
          console.log('Social media posts updated, refreshing...');
          fetchRecentPosts();
          fetchStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(accountsChannel);
      supabase.removeChannel(postsChannel);
    };
  }, []);

  return {
    accounts,
    posts,
    stats,
    loading,
    error,
    refetch: async () => {
      setLoading(true);
      await Promise.all([fetchAccounts(), fetchRecentPosts(), fetchStats()]);
      setLoading(false);
    }
  };
};
