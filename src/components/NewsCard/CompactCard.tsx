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
        relative overflow-hidden rounded-2xl border border-gray-100 bg-white
        transition-all duration-300 ease-out
        hover:shadow-lg hover:shadow-gray-100/50 hover:border-gray-200
        hover:-translate-y-0.5 active:translate-y-0
        ${className}
      `}>
        <div className="flex gap-3 p-4 sm:gap-4 sm:p-5">
          {/* Image Container */}
          <div className="relative flex-shrink-0">
            <div className="relative overflow-hidden rounded-xl bg-gray-100">
              <img
                src={article.featuredImage}
                alt={article.title}
                className="
                  w-16 h-16 sm:w-20 sm:h-20 object-cover
                  transition-transform duration-300 ease-out
                  group-hover:scale-105
                "
              />
              {/* Subtle overlay on hover */}
              <div className="
                absolute inset-0 bg-black/0 transition-colors duration-300
                group-hover:bg-black/5
              " />
            </div>
          </div>

          {/* Content Container */}
          <div className="flex-1 min-w-0 flex flex-col justify-between">
            {/* Category Badge */}
            <div className="mb-2">
              <span
                className="
                  inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
                  text-xs font-medium text-white shadow-sm
                  transition-transform duration-200
                  group-hover:scale-105
                "
                style={{ backgroundColor: article.category.color }}
              >
                {getCategoryIcon(article.category.name, "w-3 h-3 flex-shrink-0")}
                <span className="truncate">{article.category.name}</span>
              </span>
            </div>

            {/* Title */}
            <h4 className="
              text-sm sm:text-base font-semibold leading-tight mb-2
              text-gray-900 line-clamp-2
              transition-colors duration-200
              group-hover:text-blue-600
            ">
              {article.title}
            </h4>

            {/* Meta Information */}
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-auto">
              <time dateTime={article.publishedAt} className="font-medium">
                {formatDate(article.publishedAt)}
              </time>
              <div className="w-1 h-1 bg-gray-300 rounded-full" />
              <span className="font-medium">{article.readTime} min read</span>
            </div>
          </div>

          {/* Subtle arrow indicator */}
          <div className="
            flex-shrink-0 self-start mt-1 opacity-0 transition-all duration-200
            group-hover:opacity-100 group-hover:translate-x-0.5
          ">
            <svg
              className="w-4 h-4 text-gray-400"
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

        {/* Subtle bottom border accent */}
        <div
          className="
            h-0.5 w-0 bg-gradient-to-r from-transparent via-current to-transparent
            transition-all duration-300 ease-out
            group-hover:w-full
          "
          style={{ color: article.category.color }}
        />
      </article>
    </Link>
  );
};

export default CompactCard;