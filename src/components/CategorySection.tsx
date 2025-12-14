import Link from 'next/link';
import React from 'react';
import { NewsArticle } from '../types/news';
import { getCategoryColor } from '../utils/categoryColors';

interface CategorySectionProps {
  title: string;
  articles: NewsArticle[];
  categorySlug?: string;
  showViewAll?: boolean;
}

const CategorySection: React.FC<CategorySectionProps> = ({ 
  title, 
  articles, 
  categorySlug,
  showViewAll = true 
}) => {
  if (articles.length === 0) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Ensure exactly 6 articles for mobile, 8 for desktop (2 primary + 6 secondary)
  const mobileArticles = articles.slice(0, 6); // 6 articles for mobile
  const primaryArticles = articles.slice(0, 2); // 2 primary for desktop
  const secondaryArticles = articles.slice(2, 8); // 6 secondary for desktop

  return (
    <section className="mb-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold" style={{ color: '#111111', fontSize: '18px' }}>
          {title}
        </h2>
        {showViewAll && categorySlug && (
          <Link 
            href={`/${categorySlug}`}
            className="text-xs font-medium hover:underline"
            style={{ color: '#1A365D', fontSize: '12px' }}
          >
            View All
          </Link>
        )}
      </div>

      {/* Mobile: Show exactly 6 articles as horizontal cards */}
      {mobileArticles.length > 0 && (
        <div className="md:hidden space-y-3">
          {mobileArticles.map((article) => (
            <Link 
              key={article.id} 
              href={`/${article.category.slug}/${article.slug}`}
              className="block group"
            >
              <article className="flex gap-3 bg-white rounded-lg overflow-hidden hover:shadow-sm transition-shadow duration-200">
                {/* Image - Smaller on mobile */}
                <div className="relative w-24 h-20 flex-shrink-0 overflow-hidden rounded">
                  <img
                    src={article.featuredImage}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0 py-2">
                  <span 
                    className="inline-block px-2 py-0.5 rounded text-xs font-semibold text-white mb-1"
                    style={{ backgroundColor: getCategoryColor(article.category.name, article.category.color), fontSize: '12px' }}
                  >
                    {article.category.name}
                  </span>
                  <h3 
                    className="font-bold mb-1 line-clamp-2 group-hover:underline transition-colors"
                    style={{ color: '#111111', fontSize: '16px', lineHeight: '1.3' }}
                  >
                    {article.title}
                  </h3>
                  <p 
                    className="text-xs"
                    style={{ color: '#6B7280', fontSize: '11px' }}
                  >
                    {formatDate(article.publishedAt)}
                  </p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}

      {/* Desktop: Primary Articles - 2 large articles side-by-side */}
      {primaryArticles.length > 0 && (
        <div className="hidden md:grid md:grid-cols-2 gap-4 mb-4">
          {primaryArticles.map((article) => (
            <Link 
              key={article.id} 
              href={`/${article.category.slug}/${article.slug}`}
              className="block group"
            >
              <article className="bg-white rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200">
                {/* Landscape Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={article.featuredImage}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20"></div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-2 left-2">
                    <span 
                      className="inline-block px-2 py-1 rounded text-xs font-semibold text-white"
                      style={{ backgroundColor: getCategoryColor(article.category.name, article.category.color), fontSize: '12px' }}
                    >
                      {article.category.name}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-3">
                  <p 
                    className="text-xs mb-2"
                    style={{ color: '#6B7280', fontSize: '11px' }}
                  >
                    {formatDate(article.publishedAt)}
                  </p>
                  <h3 
                    className="font-bold line-clamp-2 group-hover:underline transition-colors"
                    style={{ color: '#111111', fontSize: '18px', lineHeight: '1.3' }}
                  >
                    {article.title}
                  </h3>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}

      {/* Desktop: Secondary Articles - 3-column grid */}
      {secondaryArticles.length > 0 && (
        <div className="hidden md:grid md:grid-cols-3 md:gap-4">
          {secondaryArticles.map((article) => (
            <Link 
              key={article.id} 
              href={`/${article.category.slug}/${article.slug}`}
              className="block group"
            >
              {/* Desktop: Square thumbnail card layout */}
              <article className="bg-white rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200">
                {/* Square Image */}
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={article.featuredImage}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20"></div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-2 left-2">
                    <span 
                      className="inline-block px-2 py-1 rounded text-xs font-semibold text-white"
                      style={{ backgroundColor: getCategoryColor(article.category.name, article.category.color), fontSize: '12px' }}
                    >
                      {article.category.name}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-3">
                  <p 
                    className="text-xs mb-2"
                    style={{ color: '#6B7280', fontSize: '11px' }}
                  >
                    {formatDate(article.publishedAt)}
                  </p>
                  <h3 
                    className="font-bold line-clamp-2 group-hover:underline transition-colors"
                    style={{ color: '#111111', fontSize: '18px', lineHeight: '1.3' }}
                  >
                    {article.title}
                  </h3>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default CategorySection;
