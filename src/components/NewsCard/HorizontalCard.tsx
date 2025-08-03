import { Clock, Eye, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { NewsArticle } from '../../types/news';
import { getCategoryIcon } from '../../utils/categoryIcons';
import { getFullImageUrl } from '../../utils/helpers';

interface HorizontalCardProps {
  article: NewsArticle;
  className?: string;
}

const HorizontalCard: React.FC<HorizontalCardProps> = ({ article, className = '' }) => {
  return (
    <Link href={`/news/${article.slug}`} className="block group">
      <article className={`
        news-card overflow-hidden rounded-lg border border-gray-100 bg-white
        transition-all duration-300 ease-out
        hover:shadow-lg hover:border-gray-200
        active:scale-[0.98]
        sm:rounded-xl sm:hover:shadow-xl sm:hover:-translate-y-0.5
        ${className}
      `}>
        {/* Mobile: Vertical layout, Desktop: Horizontal layout */}
        <div className="flex flex-col sm:flex-row">
          {/* Image Container - Mobile first */}
          <div className="relative sm:w-1/3 lg:w-2/5">
            <div className="relative overflow-hidden bg-gray-100">
              <Image
                src={getFullImageUrl(article.featuredImage)}
                alt={article.title}
                width={400}
                height={200}
                className="
                  w-full h-44 object-cover
                  transition-transform duration-700 ease-out
                  group-hover:scale-105
                  sm:h-32 md:h-36 lg:h-40
                "
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 40vw"
                priority={false}
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              />
              
              {/* Image overlay on hover */}
              <div className="
                absolute inset-0 bg-black/0 transition-colors duration-300
                group-hover:bg-black/5
              " />
            </div>
            
            {/* Trending badge overlay - Mobile positioned */}
            {article.trending && (
              <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                <span className="
                  bg-gradient-to-r from-orange-500 to-red-500 text-white 
                  px-2 py-1 rounded-full text-[10px] font-medium
                  backdrop-blur-sm bg-opacity-95 shadow-md
                  transition-transform duration-200
                  group-hover:scale-105
                  sm:px-2.5 sm:text-xs
                ">
                  <span className="sm:hidden">🔥</span>
                  <span className="hidden sm:inline">🔥 Trending</span>
                </span>
              </div>
            )}
          </div>
          
          {/* Content Container - Mobile first */}
          <div className="flex-1 p-3 sm:p-4 md:p-5 lg:p-6">
            {/* Category Badge - Mobile optimized */}
            <div className="mb-2 sm:mb-3">
              <span
                className="
                  inline-flex items-center gap-1 px-2 py-1 rounded-full
                  text-[10px] font-medium text-white shadow-sm
                  transition-transform duration-200
                  group-hover:scale-105
                  sm:gap-1.5 sm:px-2.5 sm:text-xs
                  md:px-3
                "
                style={{ backgroundColor: article.category.color }}
              >
                {getCategoryIcon(article.category.name, "w-2.5 h-2.5 flex-shrink-0 sm:w-3 sm:h-3")}
                <span className="max-w-[70px] truncate sm:max-w-none">{article.category.name}</span>
              </span>
            </div>
            
            {/* Title - Mobile first typography */}
            <h3 className="
              text-base font-bold mb-2 line-clamp-2 leading-tight
              text-gray-900 transition-colors duration-200
              group-hover:text-blue-600
              sm:text-lg sm:mb-3
              md:text-xl
            ">
              {article.title}
            </h3>
            
            {/* Excerpt - Responsive line clamping */}
            <p className="
              text-sm text-gray-600 mb-3 leading-relaxed
              line-clamp-2
              transition-colors duration-200
              group-hover:text-gray-700
              sm:text-base sm:mb-4 sm:line-clamp-3
            ">
              {article.excerpt}
            </p>
            
            {/* Meta Information - Mobile simplified layout */}
            <div className="flex items-center justify-between gap-2">
              {/* Author and Read Time - Compact on mobile */}
              <div className="flex items-center gap-2 text-xs text-gray-500 min-w-0 sm:gap-3 sm:text-sm">
                <div className="flex items-center gap-1 min-w-0">
                  <User className="w-3 h-3 flex-shrink-0 text-gray-400 sm:w-4 sm:h-4" />
                  <span className="font-medium truncate max-w-[60px] sm:max-w-[100px] md:max-w-none">
                    {article.author.name}
                  </span>
                </div>
                
                <div className="w-0.5 h-0.5 bg-gray-300 rounded-full flex-shrink-0 sm:w-1 sm:h-1" />
                
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Clock className="w-3 h-3 text-gray-400 sm:w-4 sm:h-4" />
                  <span className="font-medium">{article.readTime}m</span>
                </div>
              </div>
              
              {/* Views - Simplified on mobile */}
              <div className="flex items-center gap-1 text-xs text-gray-500 flex-shrink-0 sm:text-sm">
                <Eye className="w-3 h-3 text-gray-400 sm:w-4 sm:h-4" />
                <span className="font-medium">
                  {article.views > 999 
                    ? `${(article.views / 1000).toFixed(1)}k` 
                    : article.views.toLocaleString()
                  }
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom accent line */}
        <div
          className="
            h-0.5 w-0 bg-gradient-to-r from-transparent via-current to-transparent
            transition-all duration-500 ease-out
            group-hover:w-full
            sm:h-1
          "
          style={{ color: article.category.color }}
        />
      </article>
    </Link>
  );
};

export default HorizontalCard;
