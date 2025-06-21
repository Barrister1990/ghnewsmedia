
import React from 'react';
import NewReactionButton from './NewReactionButton';

interface Reactions {
  likes: number;
  hearts: number;
  laughs: number;
  angry: number;
}

interface ArticleReactionsProps {
  reactions: Reactions;
  userReaction: string | null;
  loading: boolean;
  onReaction: (type: string) => void;
}

const ArticleReactions: React.FC<ArticleReactionsProps> = ({
  reactions,
  userReaction,
  loading,
  onReaction
}) => {
  return (
    <div className="mb-12">
      <h3 className="font-semibold text-gray-900 mb-4">How do you feel about this article?</h3>
      {loading ? (
        <div className="flex flex-wrap gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          <NewReactionButton
            emoji="👍"
            label="Like"
            count={reactions.likes}
            isActive={userReaction === 'like'}
            onClick={() => onReaction('like')}
          />
          <NewReactionButton
            emoji="❤️"
            label="Love"
            count={reactions.hearts}
            isActive={userReaction === 'heart'}
            onClick={() => onReaction('heart')}
          />
          <NewReactionButton
            emoji="😂"
            label="Laugh"
            count={reactions.laughs}
            isActive={userReaction === 'laugh'}
            onClick={() => onReaction('laugh')}
          />
          <NewReactionButton
            emoji="😡"
            label="Angry"
            count={reactions.angry}
            isActive={userReaction === 'angry'}
            onClick={() => onReaction('angry')}
          />
        </div>
      )}
    </div>
  );
};

export default ArticleReactions;
