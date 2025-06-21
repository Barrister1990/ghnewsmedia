
import { Calendar, Clock, User } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { NewsArticle } from '../../types/news';
import { getCategoryIcon } from '../../utils/categoryIcons';
import { formatDate } from './utils';

interface FeaturedCardProps {
  article: NewsArticle;
  className?: string;
}

const FeaturedCard: React.FC<FeaturedCardProps> = ({ article, className = '' }) => {
  return (
    <Link href={`/news/${article.slug}`} className="block">
      <article className={`news-card relative overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform duration-300 ${className}`}>
        <div className="relative h-80 md:h-96">
          <img
            src={article.featuredImage}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="flex items-center space-x-4 mb-3">
              <span
                className="px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1"
                style={{ backgroundColor: article.category.color }}
              >
                {getCategoryIcon(article.category.name, "w-3 h-3")}
                <span>{article.category.name}</span>
              </span>
              {article.trending && (
                <span className="bg-accent px-3 py-1 rounded-full text-xs font-medium">
                  🔥 Trending
                </span>
              )}
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-3 line-clamp-3">
              {article.title}
            </h2>
            <p className="text-gray-200 mb-4 line-clamp-2">
              {article.excerpt}
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-300">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-1" />
                {article.author.name}
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {formatDate(article.publishedAt)}
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {article.readTime} min read
              </div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default FeaturedCard;
