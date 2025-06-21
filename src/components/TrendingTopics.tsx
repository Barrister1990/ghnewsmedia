
import React from 'react';
import { TrendingUp, Hash } from 'lucide-react';

interface TrendingTopic {
  id: string;
  title: string;
  posts: number;
  category: string;
  trend: 'up' | 'down' | 'stable';
}

const TrendingTopics = () => {
  const topics: TrendingTopic[] = [
    { id: '1', title: 'Ghana Elections 2024', posts: 1245, category: 'Politics', trend: 'up' },
    { id: '2', title: 'Cocoa Price Surge', posts: 892, category: 'Business', trend: 'up' },
    { id: '3', title: 'AFCON Qualifiers', posts: 756, category: 'Sports', trend: 'stable' },
    { id: '4', title: 'Tech Innovation Hub', posts: 634, category: 'Technology', trend: 'up' },
    { id: '5', title: 'Climate Change Impact', posts: 567, category: 'Environment', trend: 'down' },
    { id: '6', title: 'Education Reform', posts: 445, category: 'Education', trend: 'stable' },
    { id: '7', title: 'Healthcare Initiatives', posts: 389, category: 'Health', trend: 'up' }
  ];

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return '📈';
    if (trend === 'down') return '📉';
    return '➡️';
  };

  const getTrendColor = (trend: string) => {
    if (trend === 'up') return 'text-green-500';
    if (trend === 'down') return 'text-red-500';
    return 'text-gray-500';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <div className="flex items-center space-x-2 mb-4">
        <TrendingUp className="w-5 h-5 text-primary" />
        <h3 className="font-bold text-lg text-gray-900">Trending Topics</h3>
      </div>
      
      <div className="space-y-3">
        {topics.map((topic, index) => (
          <div key={topic.id} className="flex items-center justify-between hover:bg-gray-50 p-2 rounded-lg transition-colors cursor-pointer">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-500 w-6 text-center">
                {index + 1}
              </span>
              <div>
                <div className="flex items-center space-x-2">
                  <Hash className="w-3 h-3 text-gray-400" />
                  <span className="font-medium text-gray-900 text-sm hover:text-primary transition-colors">
                    {topic.title}
                  </span>
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs text-gray-500">
                    {topic.posts.toLocaleString()} posts
                  </span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500">{topic.category}</span>
                </div>
              </div>
            </div>
            
            <div className={`flex items-center space-x-1 ${getTrendColor(topic.trend)}`}>
              <span className="text-sm">{getTrendIcon(topic.trend)}</span>
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-4 text-sm text-primary hover:text-primary-700 font-medium transition-colors">
        View All Trending Topics
      </button>
    </div>
  );
};

export default TrendingTopics;
