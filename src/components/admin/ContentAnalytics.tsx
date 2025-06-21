
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart, 
  Clock, 
  Eye, 
  Target, 
  TrendingUp, 
  Users, 
  FileText,
  AlertTriangle
} from 'lucide-react';

interface ContentAnalyticsProps {
  content: string;
  title: string;
  category: string;
}

interface ReadabilityMetrics {
  fleschScore: number;
  avgSentenceLength: number;
  avgWordsPerSentence: number;
  difficultWords: number;
  readingLevel: string;
  readingTime: number;
}

interface ContentMetrics {
  wordCount: number;
  paragraphCount: number;
  sentenceCount: number;
  headingCount: number;
  imageCount: number;
  linkCount: number;
  readability: ReadabilityMetrics;
  sentiment: 'positive' | 'negative' | 'neutral';
  contentScore: number;
}

const ContentAnalytics: React.FC<ContentAnalyticsProps> = ({
  content,
  title,
  category
}) => {
  const [metrics, setMetrics] = useState<ContentMetrics | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (content) {
      analyzeContent();
    }
  }, [content]);

  const analyzeContent = () => {
    setIsAnalyzing(true);
    
    // Basic content analysis
    const words = content.split(/\s+/).filter(word => word.length > 0);
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    const headings = (content.match(/#{1,6}\s/g) || []).length;
    const images = (content.match(/!\[.*?\]\(.*?\)/g) || []).length;
    const links = (content.match(/\[.*?\]\(.*?\)/g) || []).length;

    // Readability analysis (simplified Flesch Reading Ease)
    const avgSentenceLength = words.length / sentences.length || 0;
    const avgSyllables = calculateAvgSyllables(words);
    const fleschScore = 206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllables);
    
    const readingLevel = getReadingLevel(fleschScore);
    const readingTime = Math.ceil(words.length / 200); // 200 WPM average

    // Content scoring
    const contentScore = calculateContentScore({
      wordCount: words.length,
      headingCount: headings,
      paragraphCount: paragraphs.length,
      fleschScore,
      imageCount: images,
      linkCount: links
    });

    const analyzedMetrics: ContentMetrics = {
      wordCount: words.length,
      paragraphCount: paragraphs.length,
      sentenceCount: sentences.length,
      headingCount: headings,
      imageCount: images,
      linkCount: links,
      readability: {
        fleschScore: Math.round(fleschScore),
        avgSentenceLength: Math.round(avgSentenceLength * 10) / 10,
        avgWordsPerSentence: Math.round(avgSentenceLength * 10) / 10,
        difficultWords: countDifficultWords(words),
        readingLevel,
        readingTime
      },
      sentiment: analyzeSentiment(content),
      contentScore
    };

    setMetrics(analyzedMetrics);
    setIsAnalyzing(false);
  };

  const calculateAvgSyllables = (words: string[]): number => {
    const syllableCount = words.reduce((total, word) => {
      return total + countSyllables(word);
    }, 0);
    return syllableCount / words.length || 0;
  };

  const countSyllables = (word: string): number => {
    word = word.toLowerCase();
    if (word.length <= 3) return 1;
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    const matches = word.match(/[aeiouy]{1,2}/g);
    return matches ? matches.length : 1;
  };

  const getReadingLevel = (score: number): string => {
    if (score >= 90) return 'Very Easy';
    if (score >= 80) return 'Easy';
    if (score >= 70) return 'Fairly Easy';
    if (score >= 60) return 'Standard';
    if (score >= 50) return 'Fairly Difficult';
    if (score >= 30) return 'Difficult';
    return 'Very Difficult';
  };

  const countDifficultWords = (words: string[]): number => {
    const difficultWords = words.filter(word => {
      return word.length > 6 && countSyllables(word) > 2;
    });
    return difficultWords.length;
  };

  const analyzeSentiment = (text: string): 'positive' | 'negative' | 'neutral' => {
    // Simplified sentiment analysis
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'success', 'win', 'victory', 'achievement'];
    const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'disaster', 'crisis', 'problem', 'issue', 'concern', 'worry'];
    
    const words = text.toLowerCase().split(/\s+/);
    const positiveCount = words.filter(word => positiveWords.includes(word)).length;
    const negativeCount = words.filter(word => negativeWords.includes(word)).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  };

  const calculateContentScore = (data: any): number => {
    let score = 0;
    
    // Word count (optimal: 1000-2000 words)
    if (data.wordCount >= 1000 && data.wordCount <= 2000) score += 25;
    else if (data.wordCount >= 500) score += 15;
    else if (data.wordCount >= 300) score += 10;
    
    // Heading structure
    if (data.headingCount >= 3) score += 20;
    else if (data.headingCount >= 1) score += 10;
    
    // Readability
    if (data.fleschScore >= 60 && data.fleschScore <= 80) score += 20;
    else if (data.fleschScore >= 50) score += 15;
    
    // Media elements
    if (data.imageCount >= 2) score += 15;
    else if (data.imageCount >= 1) score += 10;
    
    // Internal/external links
    if (data.linkCount >= 3) score += 10;
    else if (data.linkCount >= 1) score += 5;
    
    // Paragraph structure
    if (data.paragraphCount >= 5) score += 10;
    
    return Math.min(score, 100);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getReadabilityColor = (level: string) => {
    if (['Very Easy', 'Easy', 'Fairly Easy'].includes(level)) return 'text-green-600';
    if (['Standard', 'Fairly Difficult'].includes(level)) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!metrics && !isAnalyzing) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-gray-500 text-center">Start writing to see content analytics</p>
        </CardContent>
      </Card>
    );
  }

  if (isAnalyzing) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center space-x-2">
            <BarChart className="w-4 h-4 animate-spin" />
            <span>Analyzing content...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Content Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <Target className="w-4 h-4" />
              <span>Content Score</span>
            </span>
            <span className={`text-2xl font-bold ${getScoreColor(metrics!.contentScore)}`}>
              {metrics!.contentScore}%
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={metrics!.contentScore} className="mb-2" />
          <p className="text-sm text-gray-600">
            Based on word count, structure, readability, and media elements
          </p>
        </CardContent>
      </Card>

      {/* Basic Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>Content Metrics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Words:</span>
                <span className="font-medium">{metrics!.wordCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Sentences:</span>
                <span className="font-medium">{metrics!.sentenceCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Paragraphs:</span>
                <span className="font-medium">{metrics!.paragraphCount}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Headings:</span>
                <span className="font-medium">{metrics!.headingCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Images:</span>
                <span className="font-medium">{metrics!.imageCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Links:</span>
                <span className="font-medium">{metrics!.linkCount}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Readability */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Eye className="w-4 h-4" />
            <span>Readability</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Reading Level:</span>
              <Badge 
                variant="secondary" 
                className={getReadabilityColor(metrics!.readability.readingLevel)}
              >
                {metrics!.readability.readingLevel}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Flesch Score:</span>
              <span className="font-medium">{metrics!.readability.fleschScore}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Avg Sentence Length:</span>
              <span className="font-medium">{metrics!.readability.avgSentenceLength} words</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Reading Time:</span>
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span className="font-medium">{metrics!.readability.readingTime} min</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sentiment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>Content Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Sentiment:</span>
            <Badge 
              variant="secondary"
              className={
                metrics!.sentiment === 'positive' ? 'text-green-600' :
                metrics!.sentiment === 'negative' ? 'text-red-600' : 'text-gray-600'
              }
            >
              {metrics!.sentiment.charAt(0).toUpperCase() + metrics!.sentiment.slice(1)}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4" />
            <span>Recommendations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            {metrics!.wordCount < 300 && (
              <p className="text-amber-600">• Consider adding more content (minimum 300 words recommended)</p>
            )}
            {metrics!.headingCount === 0 && (
              <p className="text-amber-600">• Add headings to improve content structure</p>
            )}
            {metrics!.imageCount === 0 && (
              <p className="text-amber-600">• Add images to make content more engaging</p>
            )}
            {metrics!.readability.fleschScore < 50 && (
              <p className="text-amber-600">• Consider simplifying language for better readability</p>
            )}
            {metrics!.linkCount === 0 && (
              <p className="text-amber-600">• Add relevant links to improve SEO and user experience</p>
            )}
            {metrics!.contentScore >= 80 && (
              <p className="text-green-600">• Excellent content quality! Ready for publication.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentAnalytics;
