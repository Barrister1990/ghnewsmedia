
import { Clock, Eye, TrendingUp, User } from 'lucide-react';
import Link from 'next/link';
import { usePublishedArticles } from '../hooks/usePublishedArticles';

const MostReadSection = () => {
  const { articles } = usePublishedArticles();
  
  // Sort articles by views and take top 5
  const mostReadArticles = articles
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  if (!mostReadArticles || mostReadArticles.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Section Header */}
      <div className="bg-gradient-to-r from-red-600 to-blue-600 px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Most Read</h3>
            <p className="text-red-100 text-sm">Trending stories this week</p>
          </div>
        </div>
      </div>

      {/* Articles List */}
      <div className="p-4">
        <div className="space-y-4">
          {mostReadArticles.map((article, index) => (
            <Link
              key={article.id}
              href={`/news/${article.slug}`}
              className="group block"
            >
              <div className="flex items-start space-x-4 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:shadow-md">
                {/* Ranking Number */}
                <div className="flex-shrink-0">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white
                    ${index === 0 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : 
                      index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-500' :
                      index === 2 ? 'bg-gradient-to-r from-amber-600 to-yellow-600' :
                      'bg-gradient-to-r from-blue-500 to-blue-600'
                    }
                    shadow-lg
                  `}>
                    {index + 1}
                  </div>
                </div>

                {/* Article Content */}
                <div className="flex-1 min-w-0">
                  {/* Title */}
                  <h4 className="text-sm sm:text-base font-semibold text-gray-900 group-hover:text-red-600 transition-colors duration-200 line-clamp-2 leading-tight mb-2">
                    {article.title}
                  </h4>

                  {/* Meta Information */}
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    {/* Category */}
                    <div className="flex items-center space-x-1">
                      <span 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: article.category.color }}
                      ></span>
                      <span className="font-medium">{article.category.name}</span>
                    </div>

                    {/* Views */}
                    <div className="flex items-center space-x-1">
                      <Eye className="w-3 h-3" />
                      <span>{article.views.toLocaleString()}</span>
                    </div>

                    {/* Read Time */}
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{article.readTime}m</span>
                    </div>

                    {/* Author */}
                    <div className="flex items-center space-x-1">
                      <User className="w-3 h-3" />
                      <span className="truncate max-w-20">{article.author.name}</span>
                    </div>
                  </div>
                </div>

                {/* Featured Image */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-gray-200">
                    <img
                      src={article.featuredImage}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-6 text-center">
          <Link
            href="/most-read"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 font-semibold rounded-xl transition-all duration-200 hover:shadow-md hover:scale-105"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            View All Trending Stories
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MostReadSection;
