
import Link from 'next/link';
import React from 'react';
import { NewsArticle } from '../types/news';
import NewsCard from './NewsCard';

interface RelatedArticlesProps {
  articles: NewsArticle[];
}

const RelatedArticles: React.FC<RelatedArticlesProps> = ({ articles }) => {
  if (articles.length === 0) {
    return null;
  }

  return (
    <section className="mt-12">
      <Link href="/news" passHref>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 cursor-pointer hover:text-blue-600 transition-colors">
          You might like {'>'}
        </h2>
      </Link>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {articles.map((article) => (
          <NewsCard key={article.id} article={article} variant="simplified" />
        ))}
      </div>
    </section>
  );
};

export default RelatedArticles;
