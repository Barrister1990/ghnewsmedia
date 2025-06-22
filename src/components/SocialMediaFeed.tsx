
import { formatDistanceToNow } from 'date-fns';
import { Facebook, Instagram, RefreshCw, Twitter, Youtube } from 'lucide-react';
import { useSocialMediaData } from '../hooks/useSocialMediaData';

const SocialMediaFeed = () => {
  const { accounts, posts, loading, error, refetch } = useSocialMediaData();

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook': return Facebook;
      case 'twitter': return Twitter;
      case 'instagram': return Instagram;
      case 'youtube': return Youtube;
      default: return Twitter;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook': return 'bg-blue-600';
      case 'twitter': return 'bg-sky-500';
      case 'instagram': return 'bg-pink-600';
      case 'youtube': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const formatFollowers = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(0)}K`;
    }
    return count.toString();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <h3 className="font-bold text-lg text-gray-900 mb-4">Follow Us</h3>
        <div className="animate-pulse space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 bg-gray-200 rounded-lg mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-12 mx-auto mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-16 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg text-gray-900">Follow Us</h3>
          <button
            onClick={refetch}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        <div className="text-center py-4">
          <p className="text-red-600 text-sm mb-2">Failed to load social media data</p>
          <button
            onClick={refetch}
            className="text-primary hover:text-primary-700 text-sm font-medium"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg text-gray-900">Follow Us</h3>
        <button
          onClick={refetch}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
          title="Refresh"
        >
          <RefreshCw className="w-4 h-4 text-gray-500" />
        </button>
      </div>
      
      {/* Social Media Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {accounts.map((account) => {
          const Icon = getPlatformIcon(account.platform);
          const colorClass = getPlatformColor(account.platform);
          
          return (
            <div key={account.id} className="text-center">
              <div className={`${colorClass} text-white p-3 rounded-lg mx-auto w-fit mb-2`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="font-semibold text-sm">{formatFollowers(account.followers_count)}</div>
              <div className="text-xs text-gray-500">{account.platform}</div>
            </div>
          );
        })}
      </div>

      {/* Recent Posts */}
      {posts.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 text-sm">Recent Posts</h4>
          {posts.map((post) => (
            <div key={post.id} className="border-l-2 border-primary pl-3 py-2">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-xs font-medium text-primary">
                  {post.account?.platform || 'Unknown'}
                </span>
                <span className="text-xs text-gray-500">•</span>
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(post.posted_at), { addSuffix: true })}
                </span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed mb-2">{post.content}</p>
              {post.engagement && (
                <div className="text-xs text-gray-500">{post.engagement}</div>
              )}
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex justify-center space-x-3">
          {accounts.map((account) => {
            const Icon = getPlatformIcon(account.platform);
            const colorClass = getPlatformColor(account.platform);
            
            return (
              <button
                key={account.id}
                className={`${colorClass} text-white p-2 rounded-full hover:opacity-90 transition-opacity`}
                title={`Follow us on ${account.platform} (${account.handle})`}
              >
                <Icon className="w-4 h-4" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SocialMediaFeed;
