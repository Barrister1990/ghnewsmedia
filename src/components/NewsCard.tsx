
import React from 'react';
import { NewsArticle } from '../types/news';
import CompactCard from './NewsCard/CompactCard';
import DefaultCard from './NewsCard/DefaultCard';
import FeaturedCard from './NewsCard/FeaturedCard';
import HorizontalCard from './NewsCard/HorizontalCard';
import SimplifiedCard from './NewsCard/SimplifiedCard';

interface NewsCardProps {
  article: NewsArticle;
  variant?: 'default' | 'featured' | 'horizontal' | 'compact' | 'simplified';
  className?: string;
}

const NewsCard: React.FC<NewsCardProps> = ({ article, variant = 'default', className = '' }) => {
  switch (variant) {
    case 'featured':
      return <FeaturedCard article={article} className={className} />;
    case 'horizontal':
      return <HorizontalCard article={article} className={className} />;
    case 'compact':
      return <CompactCard article={article} className={className} />;
    case 'simplified':
      return <SimplifiedCard article={article} className={className} />;
    default:
      return <DefaultCard article={article} className={className} />;
  }
};

export default NewsCard;
