import { NewsArticle } from '@/types/news';
import { Clock, Eye, Sparkles, TrendingUp, X } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

interface RandomArticleSuggestionsProps {
  articles: NewsArticle[];
  currentArticleId: string;
  currentCategoryId: string;
}

const RandomArticleSuggestions: React.FC<RandomArticleSuggestionsProps> = ({
  articles,
  currentArticleId,
  currentCategoryId
}) => {
  const [suggestions, setSuggestions] = useState<NewsArticle[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [showCount, setShowCount] = useState(0);

  useEffect(() => {
    // Generate random suggestions when component mounts
    generateRandomSuggestions();
  }, [articles, currentArticleId]);

  useEffect(() => {
    // Show suggestions progressively as user scrolls
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollProgress = scrollY / (documentHeight - windowHeight);

      // Show first suggestion at 20% scroll
      if (scrollProgress > 0.2 && showCount === 0) {
        setShowCount(1);
        setIsVisible(true);
      }
      // Show second suggestion at 40% scroll
      else if (scrollProgress > 0.4 && showCount === 1) {
        setShowCount(2);
      }
      // Show third suggestion at 60% scroll
      else if (scrollProgress > 0.6 && showCount === 2) {
        setShowCount(3);
      }
      // Hide suggestions when user scrolls back to top
      else if (scrollProgress < 0.1) {
        setIsVisible(false);
        setShowCount(0);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showCount]);

  const generateRandomSuggestions = () => {
    // Filter out current article
    const availableArticles = articles.filter(article => 
      article.id !== currentArticleId
    );

    // Priority 1: Same category articles
    const sameCategoryArticles = availableArticles.filter(article => 
      article.category.id === currentCategoryId
    );

    // Priority 2: Articles with similar tags (if current article has tags)
    const currentArticle = articles.find(article => article.id === currentArticleId);
    const currentTags = currentArticle?.tags || [];
    
    const similarTagArticles = availableArticles.filter(article => 
      article.category.id !== currentCategoryId && // Not same category
      article.tags && 
      article.tags.some(tag => currentTags.includes(tag))
    );

    // Priority 3: Random articles from other categories
    const otherCategoryArticles = availableArticles.filter(article => 
      article.category.id !== currentCategoryId &&
      (!article.tags || !article.tags.some(tag => currentTags.includes(tag)))
    );

    // Build suggestions with priority order
    let suggestions: NewsArticle[] = [];
    
    // Add same category articles first (up to 2)
    if (sameCategoryArticles.length > 0) {
      const shuffledSameCategory = [...sameCategoryArticles].sort(() => 0.5 - Math.random());
      suggestions.push(...shuffledSameCategory.slice(0, 2));
    }

    // Add similar tag articles (up to 1)
    if (similarTagArticles.length > 0 && suggestions.length < 3) {
      const shuffledSimilarTags = [...similarTagArticles].sort(() => 0.5 - Math.random());
      const remainingSlots = 3 - suggestions.length;
      suggestions.push(...shuffledSimilarTags.slice(0, remainingSlots));
    }

    // Fill remaining slots with random articles from other categories
    if (suggestions.length < 3) {
      const shuffledOtherCategories = [...otherCategoryArticles].sort(() => 0.5 - Math.random());
      const remainingSlots = 3 - suggestions.length;
      suggestions.push(...shuffledOtherCategories.slice(0, remainingSlots));
    }

    // Shuffle the final suggestions for variety
    const finalSuggestions = suggestions.sort(() => 0.5 - Math.random());
    
    // Debug logging (remove in production)
    console.log('📚 Article Suggestions Generated:', {
      currentCategory: currentCategoryId,
      currentTags: currentArticle?.tags || [],
      sameCategoryCount: sameCategoryArticles.length,
      similarTagCount: similarTagArticles.length,
      otherCategoryCount: otherCategoryArticles.length,
      finalSuggestions: finalSuggestions.map(s => ({
        title: s.title,
        category: s.category.name,
        tags: s.tags,
        type: getSuggestionType(s, 0).type
      }))
    });
    
    setSuggestions(finalSuggestions);
  };

  const handleDismiss = (index: number) => {
    setSuggestions(prev => prev.filter((_, i) => i !== index));
    setShowCount(prev => Math.max(0, prev - 1));
  };

  const getSuggestionType = (article: NewsArticle, index: number) => {
    // Check if it's the same category
    if (article.category.id === currentCategoryId) {
      return { type: 'Related', color: 'bg-blue-500', icon: TrendingUp };
    }
    
    // Check if it has similar tags
    const currentArticle = articles.find(a => a.id === currentArticleId);
    const currentTags = currentArticle?.tags || [];
    const hasSimilarTags = article.tags && article.tags.some(tag => currentTags.includes(tag));
    
    if (hasSimilarTags) {
      return { type: 'Similar', color: 'bg-purple-500', icon: Sparkles };
    }
    
    // Check if it's trending or featured
    if (article.trending) {
      return { type: 'Trending', color: 'bg-orange-500', icon: TrendingUp };
    }
    
    if (article.featured) {
      return { type: 'Featured', color: 'bg-green-500', icon: Sparkles };
    }
    
    // Default to popular
    return { type: 'Popular', color: 'bg-indigo-500', icon: Sparkles };
  };

  if (!isVisible || suggestions.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40 space-y-3 max-w-sm">
      {suggestions.slice(0, showCount).map((article, index) => {
        const suggestionType = getSuggestionType(article, index);
        const IconComponent = suggestionType.icon;
        
        return (
          <div
            key={`${article.id}-${index}`}
            className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden transform transition-all duration-500 animate-in slide-in-from-right-5"
            style={{
              animationDelay: `${index * 200}ms`,
              animationFillMode: 'both'
            }}
          >
            {/* Header */}
            <div className={`${suggestionType.color} text-white px-4 py-2 flex items-center justify-between`}>
              <div className="flex items-center space-x-2">
                <IconComponent className="w-4 h-4" />
                <span className="text-sm font-semibold">{suggestionType.type}</span>
              </div>
              <button
                onClick={() => handleDismiss(index)}
                className="text-white/80 hover:text-white transition-colors"
                aria-label="Dismiss suggestion"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
              <Link href={`/${article.category.slug}/${article.slug}`} className="block group">
                <h4 className="font-bold text-gray-900 text-sm leading-tight mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {article.title}
                </h4>
                
                {article.excerpt && (
                  <p className="text-gray-600 text-xs mb-3 line-clamp-2">
                    {article.excerpt}
                  </p>
                )}

                {/* Meta Info */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{article.readTime}m</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="w-3 h-3" />
                      <span>{article.views.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  {/* Category Badge */}
                  <span 
                    className="px-2 py-1 rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: article.category.color }}
                  >
                    {article.category.name}
                  </span>
                </div>
              </Link>
            </div>

            {/* Call to Action */}
            <div className="px-4 pb-4">
              <Link
                href={`/${article.category.slug}/${article.slug}`}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xs font-semibold py-2 px-4 rounded-lg transition-all duration-200 hover:scale-105 text-center block"
              >
                Read More →
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RandomArticleSuggestions;
