import { ArrowRight, Flame, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useSupabaseCategories } from '../hooks/useSupabaseCategories';

const TrendingTopics = () => {
  const { categories, loading } = useSupabaseCategories();

  // Show loading state
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-red-600 px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Trending Topics</h3>
              <p className="text-orange-100 text-sm">What's hot right now</p>
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center space-x-4 p-3 rounded-xl">
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Create trending topics from Supabase categories
  const trendingTopics = categories.map((category, index) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    trending: index < 3, // First 3 are trending
    category: {
      name: category.name,
      color: category.color,
      icon: category.icon
    }
  }));

  if (!trendingTopics || trendingTopics.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Section Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Flame className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Trending Topics</h3>
            <p className="text-orange-100 text-sm">What's hot right now</p>
          </div>
        </div>
      </div>

      {/* Topics List */}
      <div className="p-4">
        <div className="space-y-3">
          {trendingTopics.map((topic, index) => (
            <Link
              key={topic.id}
              href={`/${topic.slug}`}
              className="group block"
            >
              <div className="flex items-center space-x-4 p-3 rounded-xl hover:bg-orange-50 transition-all duration-200 hover:shadow-md border border-transparent hover:border-orange-200">
                {/* Ranking Number */}
                <div className="flex-shrink-0">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white
                    ${index === 0 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : 
                      index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-500' :
                      index === 2 ? 'bg-gradient-to-r from-amber-600 to-yellow-600' :
                      'bg-gradient-to-r from-orange-500 to-red-500'
                    }
                    shadow-lg
                  `}>
                    {index + 1}
                  </div>
                </div>

                {/* Topic Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    {/* Category Icon */}
                    <span className="text-lg">{topic.category.icon}</span>
                    
                    {/* Topic Name */}
                    <h4 className="text-sm sm:text-base font-semibold text-gray-900 group-hover:text-orange-600 transition-colors duration-200 truncate">
                      #{topic.name}
                    </h4>
                    
                    {/* Trending Badge */}
                    {topic.trending && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700">
                        <Flame className="w-3 h-3 mr-1" />
                        Hot
                      </span>
                    )}
                  </div>

                  {/* Meta Information */}
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    {/* Category */}
                    <div className="flex items-center space-x-1">
                      <span 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: topic.category.color }}
                      ></span>
                      <span className="font-medium">{topic.category.name}</span>
                    </div>



                    {/* Trending Indicator */}
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-3 h-3" />
                      <span className="text-orange-600 font-medium">Trending</span>
                    </div>
                  </div>
                </div>

                {/* Arrow Icon */}
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-orange-100 group-hover:bg-orange-200 rounded-lg flex items-center justify-center transition-all duration-200 group-hover:scale-110">
                    <ArrowRight className="w-4 h-4 text-orange-600 group-hover:text-orange-700" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-6 text-center">
          <Link
            href="/categories"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-100 to-red-100 hover:from-orange-200 hover:to-red-200 text-orange-700 font-semibold rounded-xl transition-all duration-200 hover:shadow-md hover:scale-105"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Explore All Categories
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TrendingTopics;
