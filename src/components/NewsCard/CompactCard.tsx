import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { NewsArticle } from '../../types/news';
import { getCategoryIcon } from '../../utils/categoryIcons';
import { formatDate } from './utils';

interface CompactCardProps {
  article: NewsArticle;
  className?: string;
}

const CompactCard: React.FC<CompactCardProps> = ({ article, className = '' }) => {
  return (
    <Link href={`/news/${article.slug}`} className="block group">
      <article className={`
        relative overflow-hidden rounded-lg border border-gray-100 bg-white
        transition-all duration-300 ease-out
        hover:shadow-md hover:border-gray-200
        active:scale-[0.98]
        sm:rounded-xl sm:hover:shadow-lg sm:hover:-translate-y-0.5
        ${className}
      `}>
        <div className="flex gap-3 p-3 sm:gap-4 sm:p-4 md:p-5">
          {/* Image Container - Mobile First */}
          <div className="relative flex-shrink-0">
            <div className="relative overflow-hidden rounded-md bg-gray-100 sm:rounded-lg">
              <Image
                src={article.featuredImage}
                alt={article.title}
                width={60}
                height={60}
                className="
                  w-[60px] h-[60px] object-cover
                  transition-transform duration-300 ease-out
                  group-hover:scale-105
                  sm:w-[72px] sm:h-[72px]
                  md:w-20 md:h-20
                "
                sizes="(max-width: 640px) 60px, (max-width: 768px) 72px, 80px"
                priority={false}
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              />
              {/* Subtle overlay on hover */}
              <div className="
                absolute inset-0 bg-black/0 transition-colors duration-300
                group-hover:bg-black/5
              " />
            </div>
          </div>

          {/* Content Container - Mobile First */}
          <div className="flex-1 min-w-0 flex flex-col justify-between">
            {/* Category Badge - Smaller on mobile */}
            <div className="mb-1.5 sm:mb-2">
              <span
                className="
                  inline-flex items-center gap-1 px-2 py-0.5 rounded-full
                  text-[10px] font-medium text-white shadow-sm
                  transition-transform duration-200
                  group-hover:scale-105
                  sm:text-xs sm:gap-1.5 sm:px-2.5 sm:py-1
                "
                style={{ backgroundColor: article.category.color }}
              >
                {getCategoryIcon(article.category.name, "w-2.5 h-2.5 flex-shrink-0 sm:w-3 sm:h-3")}
                <span className="truncate max-w-[80px] sm:max-w-none">{article.category.name}</span>
              </span>
            </div>

            {/* Title - Mobile optimized */}
            <h4 className="
              text-sm font-semibold leading-[1.3] mb-1.5
              text-gray-900 line-clamp-2
              transition-colors duration-200
              group-hover:text-blue-600
              sm:text-base sm:leading-tight sm:mb-2
              md:text-lg
            ">
              {article.title}
            </h4>

            {/* Meta Information - Simplified for mobile */}
            <div className="flex items-center gap-1.5 text-[10px] text-gray-500 mt-auto sm:gap-2 sm:text-xs">
              <time dateTime={article.publishedAt} className="font-medium">
                {formatDate(article.publishedAt)}
              </time>
              <div className="w-0.5 h-0.5 bg-gray-300 rounded-full sm:w-1 sm:h-1" />
              <span className="font-medium">{article.readTime}m</span>
            </div>
          </div>

          {/* Arrow indicator - Hidden on mobile, shown on larger screens */}
          <div className="
            hidden flex-shrink-0 self-start mt-1 opacity-0 transition-all duration-200
            group-hover:opacity-100 group-hover:translate-x-0.5
            sm:flex
          ">
            <svg
              className="w-3.5 h-3.5 text-gray-400 sm:w-4 sm:h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>

        {/* Bottom border accent - Thinner on mobile */}
        <div
          className="
            h-0.5 w-0 bg-gradient-to-r from-transparent via-current to-transparent
            transition-all duration-300 ease-out
            group-hover:w-full
            sm:h-1
          "
          style={{ color: article.category.color }}
        />
      </article>
    </Link>
  );
};

export default CompactCard;