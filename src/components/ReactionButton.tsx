
import React, { useState } from 'react';

interface ReactionButtonProps {
  emoji: string;
  label: string;
  count: number;
  isActive?: boolean;
  onClick: () => void;
}

const ReactionButton: React.FC<ReactionButtonProps> = ({
  emoji,
  label,
  count,
  isActive = false,
  onClick
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    setIsAnimating(true);
    onClick();
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <button
      onClick={handleClick}
      className={`
        flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200
        ${isActive 
          ? 'bg-accent text-white shadow-md' 
          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
        }
        ${isAnimating ? 'scale-110' : 'scale-100'}
      `}
    >
      <span className={`text-lg ${isAnimating ? 'animate-bounce' : ''}`}>
        {emoji}
      </span>
      <span className="text-sm font-medium">{count}</span>
      <span className="text-xs hidden sm:inline">{label}</span>
    </button>
  );
};

export default ReactionButton;
