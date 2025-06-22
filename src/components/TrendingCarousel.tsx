// components/TrendingCarousel.tsx - Updated for SEO
import { NewsArticle } from '@/types/news';
import { ChevronLeft, ChevronRight, Clock, Eye, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePublishedArticles } from '../hooks/usePublishedArticles';

interface TrendingCarouselProps {
  initialArticles?: NewsArticle[]; // Accept server-side articles
}

const TrendingCarousel = ({ initialArticles }: TrendingCarouselProps) => {
  // Pass initial articles to avoid duplicate fetching
  const { articles, loading } = usePublishedArticles(initialArticles);
  const trendingArticles = articles.filter(article => article.trending).slice(0, 5);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (trendingArticles.length === 0 || !isAutoPlaying) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % trendingArticles.length);
    }, 5000); // Auto-advance every 5 seconds

    return () => clearInterval(timer);
  }, [trendingArticles.length, isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000); // Resume auto-play after 10 seconds
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % trendingArticles.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + trendingArticles.length) % trendingArticles.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  // Only show loading if we don't have initial articles
  if (loading && !initialArticles) {
    return (
      <section className="mb-8 sm:mb-10 lg:mb-12">
        <div className="flex items-center mb-4 sm:mb-6">
          <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-accent mr-2" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Trending Now</h2>
        </div>
        <div className="relative bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
          <div className="h-64 sm:h-80 lg:h-96 bg-gray-200"></div>
        </div>
      </section>
    );
  }

  if (trendingArticles.length === 0) {
    return null;
  }

  const currentArticle = trendingArticles[currentSlide];

  return (
    <section className="mb-8 sm:mb-10 lg:mb-12">
      <div className="flex items-center mb-4 sm:mb-6">
        <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-accent mr-2" />
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Trending Now</h2>
        <span className="ml-2 sm:ml-3 bg-accent text-white text-xs px-2 py-1 rounded-full">
          {trendingArticles.length}
        </span>
      </div>
      
      <div className="relative bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Main Slideshow */}
        <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden">
          <Link href={`/news/${currentArticle.slug}`} className="block h-full group">
            <div className="relative h-full">
              <img
                src={currentArticle.featuredImage}
                alt={currentArticle.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              
              {/* Content Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8 text-white">
                <div className="flex flex-wrap items-center gap-2 mb-2 sm:mb-3">
                  <span className="bg-accent text-white text-xs px-2 sm:px-3 py-1 rounded-full font-medium">
                    #{currentSlide + 1} Trending
                  </span>
                  <span 
                    className="px-2 sm:px-3 py-1 rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: currentArticle.category.color }}
                  >
                    {currentArticle.category.name}
                  </span>
                </div>
                
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 sm:mb-3 line-clamp-2 group-hover:text-accent transition-colors">
                  {currentArticle.title}
                </h3>
                
                <p className="text-gray-200 text-sm mb-3 sm:mb-4 line-clamp-2 max-w-2xl hidden sm:block">
                  {currentArticle.excerpt}
                </p>
                
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-gray-300">
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {currentArticle.readTime} min
                  </div>
                  <div className="flex items-center">
                    <Eye className="w-3 h-3 mr-1" />
                    {currentArticle.views.toLocaleString()}
                  </div>
                  <span className="hidden sm:inline">
                    {new Date(currentArticle.publishedAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Navigation Controls */}
        {trendingArticles.length > 1 && (
          <>
            {/* Previous/Next Buttons */}
            <button
              onClick={goToPrevious}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors z-10"
              aria-label="Previous trending article"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            
            <button
              onClick={goToNext}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors z-10"
              aria-label="Next trending article"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Slide Indicators */}
            <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex space-x-1.5 sm:space-x-2 z-10">
              {trendingArticles.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'bg-white scale-110' 
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
              <div 
                className="h-full bg-accent transition-all duration-300"
                style={{ width: `${((currentSlide + 1) / trendingArticles.length) * 100}%` }}
              />
            </div>
          </>
        )}
      </div>

      {/* Article Counter */}
      {trendingArticles.length > 1 && (
        <div className="text-center mt-3 sm:mt-4 text-sm text-gray-600">
          Article {currentSlide + 1} of {trendingArticles.length}
        </div>
      )}

      {/* Hidden content for SEO - All trending articles */}
      <div className="sr-only">
        {trendingArticles.map((article) => (
          <article key={article.id}>
            <h3>{article.title}</h3>
            <p>{article.excerpt}</p>
            <div>Category: {article.category.name}</div>
            <div>Published: {new Date(article.publishedAt).toLocaleDateString()}</div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default TrendingCarousel;
