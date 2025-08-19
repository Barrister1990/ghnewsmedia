import { ExternalLink, Facebook, Heart, MessageCircle, TrendingUp, Twitter, Users, Youtube } from 'lucide-react';

const SocialMediaFeed = () => {
  // Mock social media posts data
  const socialPosts = [
    {
      id: '1',
      platform: 'facebook' as const,
      content: 'Breaking news from Ghana! Stay tuned for the latest updates on politics, business, and sports.',
      author: 'GhNewsMedia',
      timestamp: '2 hours ago',
      engagement: {
        likes: 245,
        shares: 89,
        comments: 34
      },
      url: 'https://www.facebook.com/profile.php?id=61577876216304&mibextid=ZbWKwL',
      image: '/api/placeholder/400/300'
    },
    {
      id: '2',
      platform: 'twitter' as const,
      content: '🚨 BREAKING: Major developments in Ghana\'s tech sector. Innovation is driving the future! #GhanaTech #Innovation',
      author: 'GhNewsMedia',
      timestamp: '4 hours ago',
      engagement: {
        likes: 189,
        shares: 67,
        comments: 23
      },
      url: 'https://x.com/ghnewsmedia?t=Fx80oa-73oEdgyznOxM_Yg&s=09'
    },
    {
      id: '3',
      platform: 'youtube' as const,
      content: 'New video: Exclusive interview with Ghana\'s leading business figures. Learn about the future of entrepreneurship in Africa.',
      author: 'GhNewsMedia',
      timestamp: '1 day ago',
      engagement: {
        likes: 456,
        shares: 123,
        comments: 78,
        views: 15420
      },
      url: 'https://youtube.com/@ghnewsmedia?si=X7l2KfRAkWHG2bAu',
      image: '/api/placeholder/400/300'
    },
    {
      id: '4',
      platform: 'whatsapp' as const,
      content: 'Join our WhatsApp channel for instant news updates! Be the first to know about breaking stories in Ghana.',
      author: 'GhNewsMedia',
      timestamp: '2 days ago',
      engagement: {
        likes: 89,
        shares: 45,
        comments: 12
      },
      url: 'https://whatsapp.com/channel/0029Vb66ViJK5cDJ8RjFSR2D'
    }
  ];

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return <Facebook className="w-4 h-4" />;
      case 'twitter':
        return <Twitter className="w-4 h-4" />;
      case 'youtube':
        return <Youtube className="w-4 h-4" />;
      case 'whatsapp':
        return <MessageCircle className="w-4 h-4" />;
      default:
        return <ExternalLink className="w-4 h-4" />;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return 'bg-blue-600';
      case 'twitter':
        return 'bg-gray-900';
      case 'youtube':
        return 'bg-red-600';
      case 'whatsapp':
        return 'bg-green-600';
      default:
        return 'bg-gray-600';
    }
  };

  const getPlatformName = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return 'Facebook';
      case 'twitter':
        return 'X (Twitter)';
      case 'youtube':
        return 'YouTube';
      case 'whatsapp':
        return 'WhatsApp';
      default:
        return 'Social Media';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Section Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Social Feed</h3>
            <p className="text-blue-100 text-sm">Latest from our social channels</p>
          </div>
        </div>
      </div>

      {/* Social Posts */}
      <div className="p-4">
        <div className="space-y-4">
          {socialPosts.map((post) => (
            <div key={post.id} className="group">
              <a
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:shadow-md border border-transparent hover:border-gray-200"
              >
                {/* Post Header */}
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`w-8 h-8 ${getPlatformColor(post.platform)} rounded-lg flex items-center justify-center text-white`}>
                    {getPlatformIcon(post.platform)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                        {post.author}
                      </h4>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-500">{post.timestamp}</span>
                    </div>
                    <p className="text-xs text-gray-600">{getPlatformName(post.platform)}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors duration-200" />
                </div>

                {/* Post Content */}
                <div className="mb-3">
                  <p className="text-sm text-gray-700 line-clamp-3 leading-relaxed group-hover:text-gray-900 transition-colors duration-200">
                    {post.content}
                  </p>
                </div>

                {/* Post Image (if available) */}
                {post.image && (
                  <div className="mb-3">
                    <div className="w-full h-32 rounded-lg overflow-hidden bg-gray-200">
                      <img
                        src={post.image}
                        alt="Social media post"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </div>
                )}

                {/* Engagement Metrics */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-4">
                    {/* Likes */}
                    <div className="flex items-center space-x-1">
                      <Heart className="w-3 h-3 text-red-500" />
                      <span>{post.engagement.likes.toLocaleString()}</span>
                    </div>

                    {/* Comments */}
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="w-3 h-3 text-blue-500" />
                      <span>{post.engagement.comments.toLocaleString()}</span>
                    </div>

                    {/* Shares */}
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-3 h-3 text-green-500" />
                      <span>{post.engagement.shares.toLocaleString()}</span>
                    </div>

                    {/* Views (for YouTube) */}
                    {post.engagement.views && (
                      <div className="flex items-center space-x-1">
                        <Users className="w-3 h-3 text-purple-500" />
                        <span>{post.engagement.views.toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  {/* Platform Badge */}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getPlatformColor(post.platform)}`}>
                    {getPlatformName(post.platform)}
                  </span>
                </div>
              </a>
            </div>
          ))}
        </div>

        {/* Follow Us Section */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-3 text-center">Follow Us</h4>
          <div className="flex items-center justify-center space-x-4">
            <a
              href="https://www.facebook.com/profile.php?id=61577876216304&mibextid=ZbWKwL"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg"
            >
              <Facebook className="w-6 h-6" />
            </a>
            <a
              href="https://x.com/ghnewsmedia?t=Fx80oa-73oEdgyznOxM_Yg&s=09"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-gray-900 hover:bg-gray-800 text-white rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg"
            >
              <Twitter className="w-6 h-6" />
            </a>
            <a
              href="https://youtube.com/@ghnewsmedia?si=X7l2KfRAkWHG2bAu"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-red-600 hover:bg-red-700 text-white rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg"
            >
              <Youtube className="w-6 h-6" />
            </a>
            <a
              href="https://whatsapp.com/channel/0029Vb66ViJK5cDJ8RjFSR2D"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-green-600 hover:bg-green-700 text-white rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg"
            >
              <MessageCircle className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaFeed;
