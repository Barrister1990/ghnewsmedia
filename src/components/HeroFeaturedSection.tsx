import Link from 'next/link';
import React from 'react';
import { NewsArticle } from '../types/news';
import { getCategoryColor } from '../utils/categoryColors';

interface HeroFeaturedSectionProps {
  articles: NewsArticle[];
}

const HeroFeaturedSection: React.FC<HeroFeaturedSectionProps> = ({ articles }) => {
  if (articles.length === 0) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const heroArticle = articles[0];
  const sideArticles = articles.slice(1, 4);

  return (
    <section className="mb-8">
      {/* Mobile: All articles in vertical list */}
      <div className="md:hidden space-y-3">
        {[heroArticle, ...sideArticles].map((article) => (
          article && (
            <Link 
              key={article.id}
              href={`/${article.category.slug}/${article.slug}`}
              className="block group"
            >
              <article className="flex gap-3 bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                {/* Small Square Thumbnail */}
                <div className="relative w-24 h-20 flex-shrink-0 overflow-hidden rounded">
                  <img
                    src={article.featuredImage}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0 py-2">
                  {/* Category Badge */}
                  <span 
                    className="inline-block px-2 py-0.5 rounded text-xs font-semibold text-white mb-1"
                    style={{ backgroundColor: getCategoryColor(article.category.name, article.category.color), fontSize: '12px' }}
                  >
                    {article.category.name}
                  </span>
                  
                  {/* Date */}
                  <p 
                    className="text-xs mb-1"
                    style={{ color: '#6B7280', fontSize: '11px' }}
                  >
                    {formatDate(article.publishedAt)}
                  </p>
                  
                  {/* Title - Smaller on mobile */}
                  <h3 
                    className="font-bold line-clamp-2 group-hover:underline transition-colors"
                    style={{ color: '#111111', fontSize: '16px', lineHeight: '1.3' }}
                  >
                    {article.title}
                  </h3>
                </div>
              </article>
            </Link>
          )
        ))}
      </div>

      {/* Desktop: Hero + Side Articles Layout */}
      <div className="hidden md:grid md:grid-cols-4 gap-4">
        {/* Hero Article - Large (66% width on desktop) */}
        {heroArticle && (
          <Link 
            href={`/${heroArticle.category.slug}/${heroArticle.slug}`}
            className="md:col-span-2 block group"
          >
            <article className="relative h-80 overflow-hidden rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
              <img
                src={heroArticle.featuredImage}
                alt={heroArticle.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              
              {/* Dark Overlay - Bottom only (Pulse style) - No gradient */}
              <div className="absolute bottom-0 left-0 right-0 h-40 bg-black/80"></div>
              
              {/* Category Badge - Top Left */}
              <div className="absolute top-3 left-3 z-10">
                <span 
                  className="inline-block px-2 py-1 rounded text-xs font-semibold text-white"
                    style={{ backgroundColor: getCategoryColor(heroArticle.category.name, heroArticle.category.color), fontSize: '12px' }}
                >
                  {heroArticle.category.name}
                </span>
              </div>
              
              {/* Date - Top Right */}
              <div className="absolute top-3 right-3 z-10">
                <span 
                  className="text-xs text-white/90"
                  style={{ fontSize: '11px' }}
                >
                  {formatDate(heroArticle.publishedAt)}
                </span>
              </div>
              
              {/* Title - Bottom Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 z-10">
                <h2 
                  className="font-bold text-white mb-2 line-clamp-3"
                  style={{ fontSize: '18px', lineHeight: '1.3' }}
                >
                  {heroArticle.title}
                </h2>
              </div>
            </article>
          </Link>
        )}
        
        {/* Side Articles - Right Column (33% width on desktop) */}
        <div className="md:col-span-2 space-y-4">
          {sideArticles.map((article) => (
            <Link 
              key={article.id}
              href={`/${article.category.slug}/${article.slug}`}
              className="block group"
            >
              <article className="flex gap-3 bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                {/* Small Square Thumbnail */}
                <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded">
                  <img
                    src={article.featuredImage}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0 py-2">
                  {/* Category Badge */}
                  <span 
                    className="inline-block px-2 py-0.5 rounded text-xs font-semibold text-white mb-1"
                    style={{ backgroundColor: getCategoryColor(article.category.name, article.category.color), fontSize: '12px' }}
                  >
                    {article.category.name}
                  </span>
                  
                  {/* Date */}
                  <p 
                    className="text-xs mb-1"
                    style={{ color: '#6B7280', fontSize: '11px' }}
                  >
                    {formatDate(article.publishedAt)}
                  </p>
                  
                  {/* Title */}
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
      </div>
    </section>
  );
};

export default HeroFeaturedSection;
