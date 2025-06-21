
import React from 'react';
import { Tag } from 'lucide-react';

interface ArticleTagsProps {
  tags: string[];
}

const ArticleTags: React.FC<ArticleTagsProps> = ({ tags }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center mb-3">
        <Tag className="w-4 h-4 mr-2 text-gray-600" />
        <span className="font-medium text-gray-700">Tags:</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors cursor-pointer"
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ArticleTags;
