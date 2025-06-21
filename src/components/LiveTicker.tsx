
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

interface TickerItem {
  id: string;
  text: string;
  link: string;
  category: string;
  timestamp: string;
}

const LiveTicker = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [tickerItems] = useState<TickerItem[]>([
    {
      id: '1',
      text: 'Ghana\'s economy shows 3.2% growth in Q4 2024, exceeding expectations',
      link: '/news/ghana-economy-growth-q4-2024',
      category: 'Business',
      timestamp: new Date().toISOString()
    },
    {
      id: '2',
      text: 'President announces new infrastructure development plan for Northern regions',
      link: '/news/infrastructure-development-northern-regions',
      category: 'Politics',
      timestamp: new Date().toISOString()
    },
    {
      id: '3',
      text: 'Black Stars secure qualification for AFCON 2025 with 2-0 victory',
      link: '/news/black-stars-afcon-2025-qualification',
      category: 'Sports',
      timestamp: new Date().toISOString()
    },
    {
      id: '4',
      text: 'Accra to host West Africa Tech Summit 2025, bringing together 10,000+ participants',
      link: '/news/west-africa-tech-summit-2025',
      category: 'Technology',
      timestamp: new Date().toISOString()
    }
  ]);

  useEffect(() => {
    if (!isPlaying || tickerItems.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % tickerItems.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPlaying, tickerItems.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + tickerItems.length) % tickerItems.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % tickerItems.length);
  };

  if (tickerItems.length === 0) return null;

  const currentItem = tickerItems[currentIndex];

  return (
    <div className="bg-red-600 text-white py-2 px-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="bg-white text-red-600 px-2 py-1 text-xs font-bold rounded uppercase animate-pulse">
            LIVE
          </span>
          <span className="text-sm font-medium">BREAKING NEWS</span>
        </div>
        
        <div className="flex-1 mx-4 overflow-hidden">
          <div className="flex items-center justify-center">
            <a 
              href={currentItem.link}
              className="text-sm hover:underline transition-colors duration-200 text-center"
            >
              {currentItem.text}
            </a>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={goToPrevious}
            className="p-1 hover:bg-red-700 rounded transition-colors"
            aria-label="Previous news"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1 hover:bg-red-700 rounded transition-colors"
            aria-label={isPlaying ? "Pause ticker" : "Play ticker"}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          
          <button
            onClick={goToNext}
            className="p-1 hover:bg-red-700 rounded transition-colors"
            aria-label="Next news"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          
          <div className="text-xs ml-2">
            {currentIndex + 1}/{tickerItems.length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveTicker;
