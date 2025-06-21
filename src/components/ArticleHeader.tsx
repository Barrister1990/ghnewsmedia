
import React from 'react';
import { Clock, Eye, Calendar } from 'lucide-react';
import { NewsArticle } from '../types/news';
import ShareButtons from './ShareButtons';

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

  return (
    <header className="mb-8">
      <div className="flex items-center space-x-3 mb-4">
        <span
          className="px-3 py-1 rounded-full text-sm font-medium text-white"
          style={{ backgroundColor: article.category.color }}
        >
          {article.category.name}
        </span>
        {article.trending && (
          <span className="bg-accent text-white px-3 py-1 rounded-full text-sm font-medium">
            🔥 Trending
          </span>
        )}
      </div>
      
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
        {article.title}
      </h1>
      
      <p className="text-xl text-gray-600 mb-6 leading-relaxed">
        {article.excerpt}
      </p>
      
      {/* Author Info */}
      <div className="flex items-center space-x-4 mb-6">
        <img
          src={article.author.avatar}
          alt={article.author.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <h3 className="font-semibold text-gray-900">{article.author.name}</h3>
          <p className="text-sm text-gray-600">{article.author.title}</p>
        </div>
      </div>
      
      {/* Article Meta */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-1" />
          {formatDate(article.publishedAt)}
        </div>
        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-1" />
          {article.readTime} min read
        </div>
        <div className="flex items-center">
          <Eye className="w-4 h-4 mr-1" />
          {article.views.toLocaleString()} views
        </div>
      </div>
      
      {/* Share Buttons */}
      <ShareButtons
        url={`https://ghnewsmedia.com/news/${article.slug}`}
        title={article.title}
        className="mb-8"
      />
    </header>
  );
};

export default ArticleHeader;
