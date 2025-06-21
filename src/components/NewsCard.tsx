
import React from 'react';
import { NewsArticle } from '../types/news';
import FeaturedCard from './NewsCard/FeaturedCard';
import HorizontalCard from './NewsCard/HorizontalCard';
import CompactCard from './NewsCard/CompactCard';
import DefaultCard from './NewsCard/DefaultCard';

interface NewsCardProps {
  article: NewsArticle;
  variant?: 'default' | 'featured' | 'horizontal' | 'compact';
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
    default:
      return <DefaultCard article={article} className={className} />;
  }
};

export default NewsCard;
