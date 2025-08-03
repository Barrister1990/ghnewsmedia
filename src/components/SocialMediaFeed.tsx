import { Facebook, Instagram, RefreshCw, Twitter, Youtube } from 'lucide-react';
import Link from 'next/link';
import { useSocialMediaData } from '../hooks/useSocialMediaData';
import { Skeleton } from './ui/skeleton';

const SocialMediaFeed = () => {
  const { accounts, loading, error, refetch } = useSocialMediaData();

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook': return Facebook;
      case 'twitter': return Twitter;
      case 'instagram': return Instagram;
      case 'youtube': return Youtube;
      default: return Twitter;
    }
  };

  const getPlatformColors = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook': return 'bg-blue-600 hover:bg-blue-700';
      case 'twitter': return 'bg-sky-500 hover:bg-sky-600';
      case 'instagram': return 'bg-pink-600 hover:bg-pink-700';
      case 'youtube': return 'bg-red-600 hover:bg-red-700';
      default: return 'bg-gray-600 hover:bg-gray-700';
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
      <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-bold text-xl text-gray-900 mb-4">Follow Us</h3>
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-4 rounded-lg bg-gray-50">
              <Skeleton className="h-8 w-8 rounded-lg mb-3" />
              <Skeleton className="h-5 w-12 mb-1" />
              <Skeleton className="h-3 w-16" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-xl text-gray-900">Follow Us</h3>
          <button onClick={refetch} className="p-1 hover:bg-gray-100 rounded-full transition-colors" title="Refresh">
            <RefreshCw className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        <div className="text-center py-6">
          <p className="text-red-600 text-sm mb-3">Failed to load social media data</p>
          <button onClick={refetch} className="text-primary hover:text-primary-700 text-sm font-medium">
            Try again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-xl text-gray-900">Follow Us</h3>
        <button onClick={refetch} className="p-1 hover:bg-gray-100 rounded-full transition-colors" title="Refresh">
          <RefreshCw className="w-4 h-4 text-gray-500" />
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {accounts.map((account) => {
          const Icon = getPlatformIcon(account.platform);
          const colorClass = getPlatformColors(account.platform);
          
          const content = (
            <div className={`p-4 rounded-lg text-white ${!account.profile_url && 'cursor-default'}`}>
              <Icon className="w-7 h-7 mb-3" />
              <div className="font-bold text-xl">{formatFollowers(account.followers_count)}</div>
              <div className="text-sm opacity-90">Followers</div>
            </div>
          );

          if (account.profile_url) {
            return (
             <Link
  href={account.profile_url}
  key={account.id}
  target="_blank"
  rel="noopener noreferrer"
  className={`block transition-colors ${colorClass}`}
>
  {content}
</Link>

            );
          }

          return (
            <div key={account.id} className={`block transition-colors ${colorClass}`}>
              {content}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default SocialMediaFeed;
