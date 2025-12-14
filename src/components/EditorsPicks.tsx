import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';
import { NewsArticle } from '../types/news';
import { getCategoryColor } from '../utils/categoryColors';

interface EditorsPicksProps {
  articles: NewsArticle[];
}

const EditorsPicks: React.FC<EditorsPicksProps> = ({ articles }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const featuredArticles = articles.filter(article => article.featured).slice(0, 5);

  if (featuredArticles.length === 0) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredArticles.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredArticles.length) % featuredArticles.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const currentArticle = featuredArticles[currentIndex];

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 
          className="font-bold"
          style={{ color: '#111111', fontSize: '18px' }}
        >
          Editor&apos;s Picks
        </h2>
        
        {/* Navigation Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={goToPrevious}
            className="p-1 rounded hover:bg-gray-100 transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft className="w-4 h-4" style={{ color: '#1A365D' }} />
          </button>
          
          {/* Dots Indicator */}
          <div className="flex gap-1">
            {featuredArticles.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex ? 'w-6' : ''
                }`}
                style={{ 
                  backgroundColor: index === currentIndex ? '#1A365D' : '#D1D5DB' 
                }}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          
          <button
            onClick={goToNext}
            className="p-1 rounded hover:bg-gray-100 transition-colors"
            aria-label="Next"
          >
            <ChevronRight className="w-4 h-4" style={{ color: '#1A365D' }} />
          </button>
        </div>
      </div>

      {/* Editor's Picks Cards - Horizontal Scroll (Pulse style) */}
      <div className="relative">
        {/* Scrollable Container */}
        <div 
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
          style={{ 
            scrollBehavior: 'smooth',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
          id="editors-picks-scroll"
        >
          {featuredArticles.map((article) => (
            <Link 
              key={article.id}
              href={`/${article.category.slug}/${article.slug}`}
              className="block group flex-shrink-0"
              style={{ width: 'calc(100% - 2rem)', minWidth: '280px' }}
            >
              <article className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 h-full">
                {/* Author Image - Square */}
                <div className="flex items-center gap-3 p-4">
                  <img
                    src={article.author.avatar}
                    alt={article.author.name}
                    className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    {/* Category */}
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
                    
                    {/* Author Name */}
                    <p 
                      className="font-semibold mb-1"
                      style={{ color: '#111111', fontSize: '13px' }}
                    >
                      {article.author.name}
                    </p>
                    
                    {/* Title - Smaller on mobile */}
                    <h3 
                      className="font-bold line-clamp-2 group-hover:underline transition-colors md:text-lg"
                      style={{ color: '#111111', fontSize: '16px', lineHeight: '1.3' }}
                    >
                      {article.title}
                    </h3>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>

      {/* Desktop: Show 3 columns, Mobile: Horizontal scroll */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        @media (min-width: 768px) {
          #editors-picks-scroll {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1rem;
            overflow-x: visible;
          }
          #editors-picks-scroll > * {
            width: 100% !important;
            min-width: auto !important;
          }
        }
      `}</style>
    </section>
  );
};

export default EditorsPicks;
