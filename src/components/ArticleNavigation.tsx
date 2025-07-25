
import Link from 'next/link';
import React from 'react';
import { Author, Category } from '../types/news';

interface ArticleNavigationProps {
  category: Category;
  author: Author;
}

const ArticleNavigation: React.FC<ArticleNavigationProps> = ({ category, author }) => {
  return (
    <div className="bg-white rounded-xl p-6 mb-8 shadow-sm">
      <h3 className="font-semibold text-gray-900 mb-4">Explore More</h3>
      <div className="flex flex-wrap gap-4">
        <Link 
          href={`/category/${category.slug}`}
          className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
        >
          More {category.name} News
        </Link>
        <Link
          href={`/author/${author.id}`}
          className="inline-flex items-center px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-700 transition-colors text-sm"
        >
          More by {author.name}
        </Link>
        <Link 
          href="/search"
          className="inline-flex items-center px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors text-sm"
        >
          Search All News
        </Link>
      </div>
    </div>
  );
};

export default ArticleNavigation;
