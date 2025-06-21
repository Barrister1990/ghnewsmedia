
import React from 'react';
import { Eye, Clock } from 'lucide-react';
import { usePublishedArticles } from '../hooks/usePublishedArticles';

const MostReadSection = () => {
  const { articles } = usePublishedArticles();
  
  // Sort articles by views and take top 5
  const mostReadArticles = articles
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <div className="flex items-center space-x-2 mb-4">
        <Eye className="w-5 h-5 text-primary" />
        <h3 className="font-bold text-lg text-gray-900">Most Read</h3>
      </div>
      
      <div className="space-y-4">
        {mostReadArticles.map((article, index) => (
          <div key={article.id} className="flex space-x-3 hover:bg-gray-50 p-2 rounded-lg transition-colors cursor-pointer">
            <span className="text-2xl font-bold text-gray-300 w-8 text-center">
              {index + 1}
            </span>
            
            <div className="flex-1">
              <a 
                href={`/news/${article.slug}`}
                className="font-medium text-gray-900 hover:text-primary transition-colors line-clamp-2 text-sm leading-snug"
              >
                {article.title}
              </a>
              
              <div className="flex items-center space-x-3 mt-2 text-xs text-gray-500">
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  {article.category.name}
                </span>
                <div className="flex items-center space-x-1">
                  <Eye className="w-3 h-3" />
                  <span>{article.views.toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{article.readTime} min read</span>
                </div>
              </div>
            </div>
            
            {article.featuredImage && (
              <img 
                src={article.featuredImage} 
                alt={article.title}
                className="w-16 h-16 object-cover rounded-lg"
              />
            )}
          </div>
        ))}
      </div>
      
      <button className="w-full mt-4 text-sm text-primary hover:text-primary-700 font-medium transition-colors">
        View All Popular Articles
      </button>
    </div>
  );
};

export default MostReadSection;
