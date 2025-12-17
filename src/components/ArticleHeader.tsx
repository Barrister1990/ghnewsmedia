
import React from 'react';
import { NewsArticle } from '../types/news';
import { getCategoryColor } from '../utils/categoryColors';

interface ArticleHeaderProps {
  article: NewsArticle;
}

const ArticleHeader: React.FC<ArticleHeaderProps> = ({ article }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateShort = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <header>
      {/* Category Badge - Pulse Style */}
      <div className="mb-3 sm:mb-4">
        <span
          className="inline-block px-2 py-1 rounded text-xs font-medium text-white"
          style={{ backgroundColor: getCategoryColor(article.category.name, article.category.color), fontSize: '12px' }}
        >
          {article.category.name}
        </span>
      </div>
      
      {/* Title - Pulse Style */}
      <h1 className="text-2xl sm:text-3xl lg:text-4xl" style={{ 
        color: '#111111', 
        fontSize: '24px', 
        fontWeight: 'bold',
        lineHeight: '1.3',
        marginBottom: '16px'
      }}>
        {article.title}
      </h1>

      {/* Author and Date - Pulse Style */}
      <div className="flex items-center gap-2 mb-4 text-sm sm:text-base" style={{ fontSize: '14px', color: '#6B7280' }}>
        <span style={{ fontWeight: '500', color: '#111111' }}>{article.author.name}</span>
        <span>{formatTime(article.publishedAt)}</span>
        <span>-</span>
        <span>{formatDateShort(article.publishedAt)}</span>
      </div>
    </header>
  );
};

export default ArticleHeader;
