import { Calendar, Clock, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { NewsArticle } from '../../types/news';
import { getCategoryIcon } from '../../utils/categoryIcons';
import { getFullImageUrl } from '../../utils/helpers';
import { formatDate } from './utils';

interface FeaturedCardProps {
  article: NewsArticle;
  className?: string;
}

const FeaturedCard: React.FC<FeaturedCardProps> = ({ article, className = '' }) => {
  return (
    <Link href={`/news/${article.slug}`} className="block">
      <article className={`
        news-card relative overflow-hidden cursor-pointer rounded-lg
        transition-all duration-300 ease-out
        hover:shadow-xl active:scale-[0.98]
        sm:rounded-xl sm:hover:scale-[1.02]
        ${className}
      `}>
        <div className="relative h-64 sm:h-72 md:h-80 lg:h-96">
          <Image
            src={getFullImageUrl(article.featuredImage)}
            alt={article.title}
            fill
            className="
              object-cover
              transition-transform duration-700 ease-out
              group-hover:scale-105
            "
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={true}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          />
          
          {/* Mobile-optimized gradient overlay */}
          <div className="
            absolute inset-0 
            bg-gradient-to-t from-black/90 via-black/50 to-black/20
            sm:from-black/80 sm:via-black/40 sm:to-transparent
          " />
          
          {/* Content overlay - Mobile first */}
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white sm:p-5 md:p-6">
            {/* Badges - Mobile optimized */}
            <div className="flex items-center gap-2 mb-2 sm:gap-3 sm:mb-3">
              <span
                className="
                  px-2 py-1 rounded-full text-[10px] font-medium flex items-center gap-1
                  backdrop-blur-sm bg-opacity-95
                  sm:px-2.5 sm:py-1 sm:text-xs sm:gap-1.5
                  md:px-3
                "
                style={{ backgroundColor: article.category.color }}
              >
                {getCategoryIcon(article.category.name, "w-2.5 h-2.5 sm:w-3 sm:h-3")}
                <span className="max-w-[60px] truncate sm:max-w-none">{article.category.name}</span>
              </span>
              
              {article.trending && (
                <span className="
                  bg-gradient-to-r from-orange-500 to-red-500 
                  px-2 py-1 rounded-full text-[10px] font-medium
                  backdrop-blur-sm bg-opacity-95
                  sm:px-2.5 sm:py-1 sm:text-xs
                  md:px-3
                ">
                  <span className="sm:hidden">🔥</span>
                  <span className="hidden sm:inline">🔥 Trending</span>
                </span>
              )}
            </div>
            
            {/* Title - Mobile first typography */}
            <h2 className="
              text-lg font-bold mb-2 line-clamp-2 leading-tight
              sm:text-xl sm:mb-3 sm:line-clamp-3
              md:text-2xl lg:text-3xl
            ">
              {article.title}
            </h2>
            
            {/* Excerpt - Hidden on very small screens */}
            <p className="
              text-gray-200 mb-3 line-clamp-1 text-sm leading-relaxed
              sm:line-clamp-2 sm:mb-4 sm:text-base
            ">
              {article.excerpt}
            </p>
            
            {/* Meta information - Mobile simplified */}
            <div className="flex items-center gap-3 text-xs text-gray-300 sm:gap-4 sm:text-sm">
              {/* Author - Always visible */}
              <div className="flex items-center gap-1 min-w-0">
                <User className="w-3 h-3 flex-shrink-0 sm:w-4 sm:h-4" />
                <span className="truncate max-w-[80px] sm:max-w-none">{article.author.name}</span>
              </div>
              
              {/* Date - Hidden on very small screens */}
              <div className="hidden items-center gap-1 xs:flex sm:gap-1">
                <Calendar className="w-3 h-3 flex-shrink-0 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">{formatDate(article.publishedAt)}</span>
                <span className="sm:hidden">{formatDate(article.publishedAt)}</span>
              </div>
              
              {/* Read time - Always visible but simplified */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <Clock className="w-3 h-3 flex-shrink-0 sm:w-4 sm:h-4" />
                <span className="sm:hidden">{article.readTime}m</span>
                <span className="hidden sm:inline">{article.readTime} min read</span>
              </div>
            </div>
          </div>
          
          {/* Subtle top gradient for better text readability on mobile */}
          <div className="
            absolute top-0 left-0 right-0 h-16 
            bg-gradient-to-b from-black/30 to-transparent
            sm:from-black/20 sm:h-20
          " />
        </div>
      </article>
    </Link>
  );
};

export default FeaturedCard;
