
import React, { useState, useEffect } from 'react';
import { useBreakingNews } from '../hooks/useBreakingNews';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const BreakingNews = () => {
  const { breakingNews, loading, error } = useBreakingNews();
  const [currentNews, setCurrentNews] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (breakingNews.length === 0 || !isAutoPlaying) return;
    
    const timer = setInterval(() => {
      setCurrentNews((prev) => (prev + 1) % breakingNews.length);
    }, 4000); // Changed to 4 seconds for better readability

    return () => clearInterval(timer);
  }, [breakingNews.length, isAutoPlaying]);

  const goToNext = () => {
    setCurrentNews((prev) => (prev + 1) % breakingNews.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000); // Resume auto-play after 10 seconds
  };

  const goToPrevious = () => {
    setCurrentNews((prev) => (prev - 1 + breakingNews.length) % breakingNews.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000); // Resume auto-play after 10 seconds
  };

  // Debug logging
  console.log('Breaking news data:', { breakingNews, loading, error, currentNews });

  if (loading) {
    return (
      <div className="bg-red-600 text-white py-2 sm:py-2.5 mb-3 sm:mb-4">
        <div className="container mx-auto px-3 sm:px-4 flex items-center">
          <span className="bg-white text-red-600 px-2 sm:px-3 py-0.5 sm:py-1 rounded font-bold text-xs sm:text-sm mr-3 sm:mr-4 animate-pulse flex-shrink-0">
            BREAKING
          </span>
          <div className="flex-1">
            <div className="h-3 sm:h-4 bg-red-700 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Breaking news error:', error);
    return null;
  }

  if (breakingNews.length === 0) {
    console.log('No breaking news articles found');
    return null;
  }

  const currentArticle = breakingNews[currentNews];

  return (
    <div className="bg-red-600 text-white py-2.5 sm:py-3 mb-3 sm:mb-4 relative overflow-hidden">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex items-center">
          <span className="bg-white text-red-600 px-2 sm:px-3 py-0.5 sm:py-1 rounded font-bold text-xs sm:text-sm mr-3 sm:mr-4 animate-pulse flex-shrink-0">
            BREAKING
          </span>
          
          <div className="flex-1 flex items-center justify-between">
            <div className="flex-1 overflow-hidden mr-3 sm:mr-4">
              <div className="relative">
                <a 
                  href={`/news/${currentArticle.slug}`}
                  className="block hover:text-red-200 transition-colors"
                >
                  <p className="text-xs sm:text-sm lg:text-base font-medium truncate animate-slide-in">
                    {currentArticle.title}
                  </p>
                </a>
              </div>
            </div>

            {/* Navigation controls */}
            {breakingNews.length > 1 && (
              <div className="flex items-center space-x-1.5 sm:space-x-2 flex-shrink-0">
                <button
                  onClick={goToPrevious}
                  className="p-0.5 sm:p-1 hover:bg-red-700 rounded transition-colors"
                  aria-label="Previous breaking news"
                >
                  <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
                
                <div className="flex space-x-0.5 sm:space-x-1">
                  {breakingNews.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentNews(index);
                        setIsAutoPlaying(false);
                        setTimeout(() => setIsAutoPlaying(true), 10000);
                      }}
                      className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-colors ${
                        index === currentNews ? 'bg-white' : 'bg-red-400'
                      }`}
                      aria-label={`Go to breaking news ${index + 1}`}
                    />
                  ))}
                </div>
                
                <button
                  onClick={goToNext}
                  className="p-0.5 sm:p-1 hover:bg-red-700 rounded transition-colors"
                  aria-label="Next breaking news"
                >
                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Article count indicator */}
        {breakingNews.length > 1 && (
          <div className="text-xs text-red-200 mt-1 sm:mt-1.5">
            {currentNews + 1} of {breakingNews.length} breaking stories
          </div>
        )}
      </div>

      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-red-700 to-red-600 opacity-20 animate-pulse"></div>
    </div>
  );
};

export default BreakingNews;
