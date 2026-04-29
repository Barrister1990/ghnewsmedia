import Link from 'next/link';
import React from 'react';
import { NewsArticle } from '../types/news';
import { getCategoryColor } from '../utils/categoryColors';

interface LatestNewsProps {
  articles: NewsArticle[];
}

const LatestNews: React.FC<LatestNewsProps> = ({ articles }) => {
  if (articles.length === 0) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Sort by published date (newest first) and take top 12
  const latestArticles = [...articles]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 12);

  return (
    <section className="mb-10">
      {/* Section Header */}
      <div className="mb-5 flex items-center justify-between border-b border-stone-200 pb-3">
        <div className="flex items-center gap-2">
          <h2 className="font-bold" style={{ color: '#111111', fontSize: '18px' }}>
            Latest News
          </h2>
          <span className="rounded-full border border-stone-300 px-2 py-1 text-[11px] font-semibold text-stone-600">
            Updated
          </span>
        </div>
        <Link 
          href="/search"
          className="text-xs font-medium hover:underline"
          style={{ color: '#1A365D', fontSize: '12px' }}
        >
          View All
        </Link>
      </div>

      {/* Mobile: Vertical list of 6 articles */}
      <div className="md:hidden space-y-3">
        {latestArticles.slice(0, 6).map((article) => (
          <Link 
            key={article.id}
            href={`/${article.category.slug}/${article.slug}`}
            className="block group"
          >
            <article className="flex gap-3 bg-white rounded-lg overflow-hidden hover:shadow-sm transition-shadow duration-200">
              {/* Image */}
              <div className="relative w-24 h-20 flex-shrink-0 overflow-hidden rounded">
                <img
                  src={article.featuredImage}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0 py-2">
                <div className="flex items-center gap-2 mb-1">
                  <span 
                    className="inline-block px-2 py-0.5 rounded text-xs font-semibold text-white"
                    style={{ backgroundColor: getCategoryColor(article.category.name, article.category.color), fontSize: '12px' }}
                  >
                    {article.category.name}
                  </span>
                  <span 
                    className="text-xs"
                    style={{ color: '#6B7280', fontSize: '11px' }}
                  >
                    {formatDate(article.publishedAt)}
                  </span>
                </div>
                <h3 
                  className="font-bold line-clamp-2 group-hover:underline transition-colors"
                  style={{ color: '#111111', fontSize: '16px', lineHeight: '1.3' }}
                >
                  {article.title}
                </h3>
              </div>
            </article>
          </Link>
        ))}
      </div>

      {/* Desktop: Grid layout - 4 columns */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {latestArticles.map((article) => (
          <Link 
            key={article.id}
            href={`/${article.category.slug}/${article.slug}`}
            className="block group"
          >
            <article className="h-full overflow-hidden rounded-lg border border-stone-200/80 bg-white transition-shadow duration-200 hover:shadow-md">
              {/* Image */}
              <div className="relative h-40 overflow-hidden">
                <img
                  src={article.featuredImage}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20"></div>
                
                {/* Category Badge */}
                <div className="absolute top-2 left-2">
                  <span 
                    className="inline-block px-2 py-1 rounded text-xs font-semibold text-white"
                    style={{ backgroundColor: article.category.color, fontSize: '12px' }}
                  >
                    {article.category.name}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-3">
                <p 
                  className="text-xs mb-2"
                  style={{ color: '#6B7280', fontSize: '11px' }}
                >
                  {formatDate(article.publishedAt)}
                </p>
                <h3 
                  className="font-bold line-clamp-2 group-hover:underline transition-colors"
                  style={{ color: '#111111', fontSize: '18px', lineHeight: '1.3' }}
                >
                  {article.title}
                </h3>
                <p className="mt-1 text-[11px] text-gray-500">{article.readTime} min read</p>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default LatestNews;
