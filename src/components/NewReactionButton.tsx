
import React, { useState } from 'react';

interface NewReactionButtonProps {
  emoji: string;
  label: string;
  count: number;
  isActive?: boolean;
  onClick: () => void;
}

const NewReactionButton: React.FC<NewReactionButtonProps> = ({
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
        flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 border
        ${isActive 
          ? 'bg-primary text-white border-primary shadow-md' 
          : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-200 hover:border-primary'
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

export default NewReactionButton;
