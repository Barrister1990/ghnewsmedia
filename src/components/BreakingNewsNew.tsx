import { AlertTriangle, ChevronLeft, ChevronRight, Clock, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useBreakingNews } from '../hooks/useBreakingNews';

const BreakingNewsNew = () => {
  const { breakingNews, loading, error } = useBreakingNews();
  const [currentNews, setCurrentNews] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (breakingNews.length === 0 || !isAutoPlaying) return;
    
    const timer = setInterval(() => {
      setCurrentNews((prev) => (prev + 1) % breakingNews.length);
    }, 5000); // 5 seconds for better readability

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
      <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-600 text-white py-3 sm:py-4 mb-4 relative overflow-hidden">
        <div className="container mx-auto px-4 flex items-center">
          <div className="flex items-center space-x-3 mr-4">
            <div className="bg-white text-red-600 px-3 py-1.5 rounded-full font-bold text-xs sm:text-sm flex items-center space-x-2 animate-pulse">
              <AlertTriangle className="w-4 h-4" />
              <span>BREAKING</span>
            </div>
            <div className="hidden sm:flex items-center space-x-2 text-xs text-red-100">
              <Clock className="w-3 h-3" />
              <span>Loading latest news...</span>
            </div>
          </div>
          <div className="flex-1">
            <div className="h-4 bg-red-500 rounded animate-pulse"></div>
          </div>
        </div>
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
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
    <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-600 text-white py-3 sm:py-4 mb-4 relative overflow-hidden shadow-lg">
      {/* Animated background pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex items-center justify-between">
          {/* Breaking News Badge and Content */}
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            <div className="flex items-center space-x-3 flex-shrink-0">
              <div className="bg-white text-red-600 px-3 py-1.5 rounded-full font-bold text-xs sm:text-sm flex items-center space-x-2 shadow-lg animate-pulse">
                <AlertTriangle className="w-4 h-4" />
                <span>BREAKING</span>
              </div>
              
              {/* Location and Time - Mobile Optimized */}
              <div className="hidden sm:flex items-center space-x-3 text-xs text-red-100">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-3 h-3" />
                  <span>Accra, Ghana</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{new Date().toLocaleTimeString('en-GB', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}</span>
                </div>
              </div>
            </div>
            
            {/* News Content */}
            <div className="flex-1 overflow-hidden mr-4">
              <div className="relative">
                <a 
                  href={`/${currentArticle.category.slug}/${currentArticle.slug}`}
                  className="block hover:text-red-100 transition-colors duration-200 group"
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-xs sm:text-sm font-medium text-red-100 bg-red-800 px-2 py-1 rounded-full">
                      #{currentNews + 1}
                    </span>
                    <p className="text-sm sm:text-base font-semibold truncate group-hover:underline">
                      {currentArticle.title}
                    </p>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          {breakingNews.length > 1 && (
            <div className="flex items-center space-x-2 flex-shrink-0">
              {/* Progress Indicators */}
              <div className="hidden sm:flex items-center space-x-1 mr-3">
                {breakingNews.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentNews(index);
                      setIsAutoPlaying(false);
                      setTimeout(() => setIsAutoPlaying(true), 10000);
                    }}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      index === currentNews 
                        ? 'bg-white scale-125' 
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                    aria-label={`Go to breaking news ${index + 1}`}
                  />
                ))}
              </div>
              
              {/* Navigation Buttons */}
              <div className="flex items-center space-x-1">
                <button
                  onClick={goToPrevious}
                  className="p-1.5 hover:bg-red-700 rounded-lg transition-all duration-200 hover:scale-110 group"
                  aria-label="Previous breaking news"
                >
                  <ChevronLeft className="w-4 h-4 group-hover:text-red-100" />
                </button>
                
                <button
                  onClick={goToNext}
                  className="p-1.5 hover:bg-red-700 rounded-lg transition-all duration-200 hover:scale-110 group"
                  aria-label="Next breaking news"
                >
                  <ChevronRight className="w-4 h-4 group-hover:text-red-100" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
    </div>
  );
};

export default BreakingNewsNew;
