import Link from 'next/link';
import React from 'react';
import { NewsArticle } from '../types/news';

interface TrendingSidebarProps {
  articles: NewsArticle[];
}

const TrendingSidebar: React.FC<TrendingSidebarProps> = ({ articles }) => {
  const trendingArticles = articles.filter(article => article.trending).slice(0, 10);

  if (trendingArticles.length === 0) return null;

  return (
    <section className="mb-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 
          className="font-bold"
          style={{ color: '#111111', fontSize: '18px' }}
        >
          Trending
        </h2>
        <Link 
          href="/trending"
          className="text-xs font-medium hover:underline"
          style={{ color: '#1A365D', fontSize: '12px' }}
        >
          View All
        </Link>
      </div>

      {/* Trending List - 2 columns on desktop, 1 on mobile */}
      <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm">
        <ul className="space-y-2 md:grid md:grid-cols-2 md:gap-x-4 md:gap-y-2 md:space-y-0">
          {trendingArticles.map((article, index) => (
            <li key={article.id}>
              <Link 
                href={`/${article.category.slug}/${article.slug}`}
                className="block group"
              >
                <div className="flex gap-2 sm:gap-3">
                  {/* Number/Bullet - Red circular (Pulse style, but using our blue) */}
                  <span 
                    className="flex-shrink-0 font-bold"
                    style={{ color: '#1A365D', fontSize: '18px' }}
                  >
                    {index + 1}
                  </span>
                  
                  {/* Title */}
                  <h3 
                    className="font-semibold line-clamp-2 group-hover:underline transition-colors flex-1"
                    style={{ color: '#111111', fontSize: '13px', lineHeight: '1.4' }}
                  >
                    {article.title}
                  </h3>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default TrendingSidebar;
