import { Clock, Eye, TrendingUp, User } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { NewsArticle } from '../../types/news';
import { getCategoryIcon } from '../../utils/categoryIcons';

interface DefaultCardProps {
  article: NewsArticle;
  className?: string;
}

const DefaultCard: React.FC<DefaultCardProps> = ({ article, className = '' }) => {
  return (
    <Link href={`/news/${article.slug}`} className="block group">
      <article className={`
        relative overflow-hidden rounded-2xl bg-white border border-gray-100
        transition-all duration-300 ease-out
        hover:shadow-xl hover:shadow-gray-100/50 hover:border-gray-200
        hover:-translate-y-1 active:translate-y-0
        ${className}
      `}>
        {/* Image Container */}
        <div className="relative overflow-hidden bg-gray-100">
          <img
            src={article.featuredImage}
            alt={article.title}
            className="
              w-full h-48 sm:h-52 md:h-56 object-cover
              transition-transform duration-700 ease-out
              group-hover:scale-105
            "
          />
          
          {/* Image Overlay */}
          <div className="
            absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent
            opacity-0 transition-opacity duration-300
            group-hover:opacity-100
          " />

          {/* Trending Badge */}
          {article.trending && (
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
              <div className="
                flex items-center gap-1.5 px-3 py-1.5 rounded-full
                bg-gradient-to-r from-orange-500 to-red-500
                text-white text-xs font-semibold shadow-lg
                transition-transform duration-200
                group-hover:scale-105
                backdrop-blur-sm bg-opacity-95
              ">
                <TrendingUp className="w-3 h-3" />
                <span>Trending</span>
              </div>
            </div>
          )}

          {/* Category Badge Overlay */}
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4">
            <span
              className="
                inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                text-xs font-semibold text-white shadow-lg
                transition-all duration-200
                group-hover:scale-105 group-hover:shadow-xl
                backdrop-blur-sm bg-opacity-95
              "
              style={{ backgroundColor: article.category.color }}
            >
              {getCategoryIcon(article.category.name, "w-3 h-3 flex-shrink-0")}
              <span>{article.category.name}</span>
            </span>
          </div>
        </div>

        {/* Content Container */}
        <div className="p-4 sm:p-5 md:p-6">
          {/* Title */}
          <h3 className="
            text-lg sm:text-xl font-bold mb-3 leading-tight
            text-gray-900 line-clamp-2
            transition-colors duration-200
            group-hover:text-blue-600
          ">
            {article.title}
          </h3>

          {/* Excerpt */}
          <p className="
            text-sm sm:text-base text-gray-600 mb-4 leading-relaxed
            line-clamp-2 sm:line-clamp-3
            transition-colors duration-200
            group-hover:text-gray-700
          ">
            {article.excerpt}
          </p>

          {/* Meta Information */}
          <div className="flex items-center justify-between gap-4">
            {/* Author and Read Time */}
            <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500 min-w-0">
              <div className="flex items-center gap-1.5 min-w-0">
                <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 text-gray-400" />
                <span className="font-medium truncate">{article.author.name}</span>
              </div>
              
              <div className="w-1 h-1 bg-gray-300 rounded-full flex-shrink-0" />
              
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
                <span className="font-medium">{article.readTime} min</span>
              </div>
            </div>

            {/* Views */}
            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-500 flex-shrink-0">
              <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
              <span className="font-medium">
                {article.views > 999 
                  ? `${(article.views / 1000).toFixed(1)}k` 
                  : article.views.toLocaleString()
                }
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Accent Line */}
        <div
          className="
            h-1 w-0 bg-gradient-to-r from-transparent via-current to-transparent
            transition-all duration-500 ease-out
            group-hover:w-full
          "
          style={{ color: article.category.color }}
        />

        {/* Subtle Corner Highlight */}
        <div className="
          absolute top-0 right-0 w-0 h-0 transition-all duration-300
          group-hover:w-8 group-hover:h-8
          bg-gradient-to-bl from-white/20 to-transparent
        " />
      </article>
    </Link>
  );
};

export default DefaultCard;