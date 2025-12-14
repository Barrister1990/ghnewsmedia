import { AlertTriangle, ChevronLeft, ChevronRight, Clock, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useBreakingNews } from '../hooks/useBreakingNews';

const BreakingNews = () => {
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
      <div className="text-white py-3 sm:py-4 mb-4 relative overflow-hidden" style={{ backgroundColor: '#C53030' }}>
        <div className="container mx-auto px-4 flex items-center">
          <div className="flex items-center space-x-3 mr-4">
            <div className="bg-white px-3 py-1.5 rounded-full font-bold text-xs sm:text-sm flex items-center space-x-2" style={{ color: '#C53030', fontSize: '12px' }}>
              <AlertTriangle className="w-4 h-4" />
              <span>BREAKING</span>
            </div>
            <div className="hidden sm:flex items-center space-x-2 text-xs text-white/90" style={{ fontSize: '11px' }}>
              <Clock className="w-3 h-3" />
              <span>Loading latest news...</span>
            </div>
          </div>
          <div className="flex-1">
            <div className="h-4 rounded animate-pulse" style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}></div>
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
    <div className="text-white py-3 sm:py-4 mb-4 relative overflow-hidden shadow-lg" style={{ backgroundColor: '#C53030' }}>
      {/* Mobile: Scrolling Ticker */}
      <div className="md:hidden">
        <div className="flex items-center">
          {/* Breaking Badge - Fixed */}
          <div className="flex-shrink-0 bg-white px-3 py-1.5 rounded-r-full font-bold text-xs flex items-center space-x-2 shadow-lg z-10" style={{ color: '#C53030', fontSize: '12px' }}>
            <AlertTriangle className="w-4 h-4" />
            <span>BREAKING</span>
          </div>
          
          {/* Scrolling News Ticker */}
          <div className="flex-1 overflow-hidden relative">
            <div className="breaking-news-ticker">
              <div className="breaking-news-content">
                {/* Duplicate content for seamless loop */}
                {[...breakingNews, ...breakingNews].map((article, index) => (
                  <Link
                    key={`${article.id}-${index}`}
                    href={`/${article.category.slug}/${article.slug}`}
                    className="inline-block mr-8 whitespace-nowrap hover:text-red-100 transition-colors"
                  >
                    <span className="text-sm font-semibold" style={{ fontSize: '13px' }}>
                      {article.title}
                    </span>
                    <span className="mx-4 text-red-200">•</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop: Original Layout */}
      <div className="hidden md:block">
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex items-center justify-between">
          {/* Breaking News Badge and Content */}
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            <div className="flex items-center space-x-3 flex-shrink-0">
                <div className="bg-white px-3 py-1.5 rounded-full font-bold text-xs sm:text-sm flex items-center space-x-2 shadow-lg" style={{ color: '#C53030', fontSize: '12px' }}>
                <AlertTriangle className="w-4 h-4" />
                <span>BREAKING</span>
              </div>
              
                {/* Location and Time */}
                <div className="flex items-center space-x-3 text-xs text-white/90" style={{ fontSize: '11px' }}>
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
                  <Link 
                    href={`/${currentArticle.category.slug}/${currentArticle.slug}`}
                  className="block hover:text-red-100 transition-colors duration-200 group"
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-xs sm:text-sm font-medium text-red-100 bg-red-800 px-2 py-1 rounded-full">
                      #{currentNews + 1}
                    </span>
                      <p className="text-sm font-semibold truncate group-hover:underline" style={{ fontSize: '13px' }}>
                      {currentArticle.title}
                    </p>
                  </div>
                  </Link>
                </div>
            </div>
          </div>

          {/* Navigation Controls */}
          {breakingNews.length > 1 && (
            <div className="flex items-center space-x-2 flex-shrink-0">
              {/* Progress Indicators */}
                <div className="flex items-center space-x-1 mr-3">
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
      </div>
      
      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/30"></div>

      {/* CSS for scrolling ticker */}
      <style jsx>{`
        .breaking-news-ticker {
          overflow: hidden;
          width: 100%;
        }
        
        .breaking-news-content {
          display: inline-flex;
          animation: scroll 60s linear infinite;
          white-space: nowrap;
        }
        
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .breaking-news-content:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default BreakingNews;
