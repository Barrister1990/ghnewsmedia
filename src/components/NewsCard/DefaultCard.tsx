import { Clock, Eye, TrendingUp, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { NewsArticle } from '../../types/news';
import { getCategoryIcon } from '../../utils/categoryIcons';
import { getCategoryColor } from '../../utils/categoryColors';
import { getFullImageUrl } from '../../utils/helpers';

interface DefaultCardProps {
  article: NewsArticle;
  className?: string;
}

const DefaultCard: React.FC<DefaultCardProps> = ({ article, className = '' }) => {
  return (
    <Link href={`/${article.category.slug}/${article.slug}`} className="block group">
      <article className={`
        relative overflow-hidden rounded-lg bg-white border border-gray-100
        transition-all duration-300 ease-out
        hover:shadow-lg hover:border-gray-200
        active:scale-[0.98]
        sm:rounded-xl sm:hover:shadow-xl sm:hover:-translate-y-1
        ${className}
      `}>
        {/* Image Container - Mobile First */}
        <div className="relative overflow-hidden bg-gray-100">
          <Image
            src={getFullImageUrl(article.featuredImage)}
            alt={article.title}
            width={400}
            height={200}
            className="
              w-full h-full object-cover
              transition-transform duration-700 ease-out
              group-hover:scale-105
              sm:h-48 md:h-52 lg:h-56
            "
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            priority={false}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          />
          
          {/* Image Overlay - Subtle on mobile */}
          <div className="
            absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent
            opacity-0 transition-opacity duration-300
            group-hover:opacity-100
            sm:from-black/20
          " />

          {/* Trending Badge - Smaller on mobile */}
          {article.trending && (
            <div className="absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4">
              <div className="
                flex items-center gap-1 px-2 py-1 rounded-full
                text-white text-xs font-semibold shadow-md
                transition-transform duration-200
                group-hover:scale-105
                sm:gap-1.5 sm:px-2.5 sm:py-1.5 sm:text-xs sm:shadow-lg
              " style={{ backgroundColor: '#C53030', fontSize: '12px' }}>
                <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                <span className="hidden sm:inline">Trending</span>
                <span className="sm:hidden">Hot</span>
              </div>
            </div>
          )}

          {/* Category Badge Overlay - Mobile optimized */}
          <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 md:bottom-4 md:left-4">
            <span
              className="
                inline-flex items-center gap-1 px-2 py-1 rounded-full
                text-[10px] font-semibold text-white shadow-md
                transition-all duration-200
                group-hover:scale-105 group-hover:shadow-lg
                backdrop-blur-sm bg-opacity-95
                sm:gap-1.5 sm:px-2.5 sm:py-1.5 sm:text-xs sm:shadow-lg
              "
              style={{ backgroundColor: getCategoryColor(article.category.name, article.category.color), fontSize: '12px' }}
            >
              {getCategoryIcon(article.category.name, "w-2.5 h-2.5 flex-shrink-0 sm:w-3 sm:h-3")}
              <span className="max-w-[60px] truncate sm:max-w-none">{article.category.name}</span>
            </span>
          </div>
        </div>

        {/* Content Container - Mobile First */}
        <div className="p-3 sm:p-4 md:p-5 lg:p-6">
          {/* Title - Mobile optimized */}
          <h3 className="
            font-bold mb-2 leading-tight
            line-clamp-2
            transition-colors duration-200
            sm:mb-3 md:text-lg
          " style={{ color: '#111111', fontSize: '16px', lineHeight: '1.3' }}>
            {article.title}
          </h3>

          {/* Excerpt - Responsive line clamping */}
          <p className="
            mb-3 leading-relaxed
            line-clamp-2
            transition-colors duration-200
            sm:mb-4 sm:line-clamp-3
          " style={{ color: '#111111', fontSize: '13px', lineHeight: '1.6' }}>
            {article.excerpt}
          </p>

          {/* Meta Information - Mobile simplified */}
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            {/* Author and Read Time - Compact on mobile */}
            <div className="flex items-center gap-2 text-xs min-w-0 sm:gap-3" style={{ color: '#6B7280', fontSize: '11px' }}>
              <div className="flex items-center gap-1 min-w-0 sm:gap-1.5">
                <User className="w-3 h-3 flex-shrink-0 text-gray-400 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                <span className="font-medium truncate max-w-[80px] sm:max-w-none">{article.author.name}</span>
              </div>
              
              <div className="w-0.5 h-0.5 bg-gray-300 rounded-full flex-shrink-0 sm:w-1 sm:h-1" />
              
              <div className="flex items-center gap-1 flex-shrink-0 sm:gap-1.5">
                <Clock className="w-3 h-3 text-gray-400 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                <span className="font-medium">{article.readTime}m</span>
              </div>
            </div>

            {/* Views - Simplified on mobile */}
            <div className="flex items-center gap-1 text-xs flex-shrink-0 sm:gap-1.5" style={{ color: '#6B7280', fontSize: '11px' }}>
              <Eye className="w-3 h-3 text-gray-400 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
              <span className="font-medium">
                {article.views > 999 
                  ? `${(article.views / 1000).toFixed(1)}k` 
                  : article.views.toLocaleString()
                }
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Accent Line - Thinner on mobile */}
        <div
          className="
            h-0.5 w-0
            transition-all duration-500 ease-out
            group-hover:w-full
            sm:h-1
          "
          style={{ backgroundColor: getCategoryColor(article.category.name, article.category.color) }}
        />
      </article>
    </Link>
  );
};

export default DefaultCard;
