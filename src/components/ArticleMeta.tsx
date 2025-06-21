
import React from 'react';
import { Tag } from 'lucide-react';
import { NewsArticle } from '../types/news';
import ReactionButton from './ReactionButton';

interface ArticleMetaProps {
  article: NewsArticle;
  reactions: {
    likes: number;
    hearts: number;
    laughs: number;
    angry: number;
  };
  userReaction: string | null;
  onReaction: (type: string) => void;
}

const ArticleMeta: React.FC<ArticleMetaProps> = ({ 
  article, 
  reactions, 
  userReaction, 
  onReaction 
}) => {
  return (
    <>
      {/* Tags */}
      <div className="mb-8">
        <div className="flex items-center mb-3">
          <Tag className="w-4 h-4 mr-2 text-gray-600" />
          <span className="font-medium text-gray-700">Tags:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors cursor-pointer"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
      
      {/* Reactions */}
      <div className="mb-12">
        <h3 className="font-semibold text-gray-900 mb-4">How do you feel about this article?</h3>
        <div className="flex flex-wrap gap-3">
          <ReactionButton
            emoji="👍"
            label="Like"
            count={reactions.likes}
            isActive={userReaction === 'likes'}
            onClick={() => onReaction('likes')}
          />
          <ReactionButton
            emoji="❤️"
            label="Love"
            count={reactions.hearts}
            isActive={userReaction === 'hearts'}
            onClick={() => onReaction('hearts')}
          />
          <ReactionButton
            emoji="😂"
            label="Laugh"
            count={reactions.laughs}
            isActive={userReaction === 'laughs'}
            onClick={() => onReaction('laughs')}
          />
          <ReactionButton
            emoji="😡"
            label="Angry"
            count={reactions.angry}
            isActive={userReaction === 'angry'}
            onClick={() => onReaction('angry')}
          />
        </div>
      </div>
      
      {/* Author Bio */}
      <div className="bg-white rounded-xl p-6 mb-12 shadow-sm">
        <div className="flex items-start space-x-4">
          <img
            src={article.author.avatar}
            alt={article.author.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {article.author.name}
            </h3>
            <p className="text-accent font-medium mb-2">{article.author.title}</p>
            <p className="text-gray-600 mb-3">{article.author.bio}</p>
            <div className="flex space-x-3">
              {article.author.social.twitter && (
                <a
                  href={`https://twitter.com/${article.author.social.twitter.replace('@', '')}`}
                  className="text-blue-500 hover:text-blue-600 text-sm"
                >
                  Twitter
                </a>
              )}
              {article.author.social.facebook && (
                <a
                  href={`https://facebook.com/${article.author.social.facebook}`}
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  Facebook
                </a>
              )}
              {article.author.social.linkedin && (
                <a
                  href={`https://linkedin.com/in/${article.author.social.linkedin}`}
                  className="text-blue-700 hover:text-blue-800 text-sm"
                >
                  LinkedIn
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ArticleMeta;
