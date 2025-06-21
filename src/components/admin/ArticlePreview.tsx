
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User } from 'lucide-react';
import { getCategoryIcon } from '@/utils/categoryIcons';

interface ArticlePreviewProps {
  title: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  category?: { name: string; color: string };
  author?: string;
  readTime?: number;
}

const ArticlePreview: React.FC<ArticlePreviewProps> = ({
  title,
  excerpt,
  content,
  featuredImage,
  category,
  author = 'Author Name',
  readTime = 5
}) => {
  const renderContent = (text: string) => {
    // Convert markdown and HTML to properly formatted content for preview
    let processedContent = text;

    // Handle video embeds
    processedContent = processedContent.replace(
      /<div class="video-embed[\s\S]*?<\/div>/g,
      '<div class="video-placeholder bg-gray-200 p-8 text-center rounded-lg my-4"><p class="text-gray-600">📺 Video Embed</p></div>'
    );

    // Handle images
    processedContent = processedContent.replace(
      /!\[([^\]]*)\]\(([^)]+)\)/g,
      '<img src="$2" alt="$1" class="w-full h-auto rounded-lg my-4" />'
    );

    // Handle headers
    processedContent = processedContent.replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold mt-6 mb-3">$1</h3>');
    processedContent = processedContent.replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-8 mb-4">$1</h2>');
    processedContent = processedContent.replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-8 mb-4">$1</h1>');

    // Handle existing HTML formatting
    processedContent = processedContent.replace(/<strong>(.*?)<\/strong>/g, '<strong class="font-bold">$1</strong>');
    processedContent = processedContent.replace(/<em>(.*?)<\/em>/g, '<em class="italic">$1</em>');
    processedContent = processedContent.replace(/<b>(.*?)<\/b>/g, '<strong class="font-bold">$1</strong>');
    processedContent = processedContent.replace(/<i>(.*?)<\/i>/g, '<em class="italic">$1</em>');

    // Handle markdown formatting
    processedContent = processedContent.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>');
    processedContent = processedContent.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');

    // Handle links
    processedContent = processedContent.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:underline">$1</a>');

    // Handle blockquotes
    processedContent = processedContent.replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-gray-300 pl-4 italic my-4">$1</blockquote>');

    // Handle unordered lists
    processedContent = processedContent.replace(/^\- (.*$)/gim, '<li class="ml-4">• $1</li>');

    // Handle line breaks
    processedContent = processedContent.replace(/\n\n/g, '</p><p class="mb-4">');
    processedContent = processedContent.replace(/\n/g, '<br />');

    // Wrap in paragraphs if not already wrapped
    if (processedContent && !processedContent.startsWith('<')) {
      processedContent = '<p class="mb-4">' + processedContent + '</p>';
    }

    return processedContent;
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="space-y-4">
          {/* Article Meta */}
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            {category && (
              <Badge 
                style={{ backgroundColor: category.color }} 
                className="text-white flex items-center space-x-1"
              >
                <span style={{ color: 'white' }}>
                  {getCategoryIcon(category.name, "w-3 h-3")}
                </span>
                <span>{category.name}</span>
              </Badge>
            )}
            <div className="flex items-center space-x-1">
              <User className="w-4 h-4" />
              <span>{author}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{readTime} min read</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{new Date().toLocaleDateString()}</span>
            </div>
          </div>

          {/* Title */}
          <CardTitle className="text-3xl font-bold leading-tight">
            {title || 'Article Title'}
          </CardTitle>

          {/* Excerpt */}
          {excerpt && (
            <p className="text-lg text-gray-600 leading-relaxed">
              {excerpt}
            </p>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Featured Image */}
        {featuredImage && (
          <div className="w-full">
            <img
              src={featuredImage}
              alt="Featured"
              className="w-full h-64 object-cover rounded-lg"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
              }}
            />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          {content ? (
            <div 
              dangerouslySetInnerHTML={{ __html: renderContent(content) }}
              className="text-gray-700 leading-relaxed"
            />
          ) : (
            <p className="text-gray-500 italic">Start writing your article content...</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ArticlePreview;
