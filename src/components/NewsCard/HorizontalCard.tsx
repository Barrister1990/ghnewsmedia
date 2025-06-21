
import { Clock, Eye, User } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { NewsArticle } from '../../types/news';
import { getCategoryIcon } from '../../utils/categoryIcons';

interface HorizontalCardProps {
  article: NewsArticle;
  className?: string;
}

const HorizontalCard: React.FC<HorizontalCardProps> = ({ article, className = '' }) => {
  return (
    <Link href={`/news/${article.slug}`} className="block">
      <article className={`news-card flex flex-col md:flex-row cursor-pointer hover:shadow-lg transition-shadow duration-300 ${className}`}>
        <div className="md:w-1/3">
          <img
            src={article.featuredImage}
            alt={article.title}
            className="w-full h-48 md:h-full object-cover"
          />
        </div>
        <div className="md:w-2/3 p-6">
          <div className="flex items-center space-x-3 mb-3">
            <span
              className="px-3 py-1 rounded-full text-xs font-medium text-white flex items-center space-x-1"
              style={{ backgroundColor: article.category.color }}
            >
              {getCategoryIcon(article.category.name, "w-3 h-3")}
              <span>{article.category.name}</span>
            </span>
            {article.trending && (
              <span className="bg-accent text-white px-2 py-1 rounded-full text-xs">
                Trending
              </span>
            )}
          </div>
          <h3 className="text-xl font-bold mb-3 line-clamp-2 hover:text-primary transition-colors">
            {article.title}
          </h3>
          <p className="text-gray-600 mb-4 line-clamp-3">
            {article.excerpt}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-1" />
                {article.author.name}
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {article.readTime} min
              </div>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Eye className="w-4 h-4 mr-1" />
              {article.views.toLocaleString()}
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default HorizontalCard;
