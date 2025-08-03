import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { NewsArticle } from '../../types/news';
import { getFullImageUrl } from '../../utils/helpers';

interface SimplifiedCardProps {
  article: NewsArticle;
  className?: string;
}

const SimplifiedCard: React.FC<SimplifiedCardProps> = ({ article, className = '' }) => {
  return (
    <Link href={`/news/${article.slug}`} className="block group">
      <article className={`overflow-hidden rounded-lg ${className}`}>
        <div className="relative overflow-hidden bg-gray-100">
          <Image
            src={getFullImageUrl(article.featuredImage)}
            alt={article.title}
            width={400}
            height={200}
            className="w-full h-32 object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
          />
        </div>
        <div className="p-3">
          <h3 className="text-base font-bold mb-2 leading-tight text-gray-900 line-clamp-2 group-hover:text-blue-600">
            {article.title}
          </h3>
          <p className="text-sm text-gray-500">
            {format(new Date(article.publishedAt), 'MMMM d, yyyy')}
          </p>
        </div>
      </article>
    </Link>
  );
};

export default SimplifiedCard;
