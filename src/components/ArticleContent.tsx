import React from 'react';
import { NewsArticle } from '../types/news';

interface ArticleContentProps {
  article: NewsArticle;
  relatedArticles: NewsArticle[];
}

const ArticleContent: React.FC<ArticleContentProps> = ({ article, relatedArticles }) => {
  const renderContent = (text: string) => {
    let processedContent = text;

    processedContent = processedContent.replace(
      /<div class="video-embed[\s\S]*?<\/div>/g,
      '<div class="video-placeholder bg-gray-200 p-8 text-center rounded-lg my-4"><p class="text-gray-600">📺 Video Embed</p></div>'
    );

    processedContent = processedContent.replace(
      /!\[([^\]]*)\]\(([^)]+)\)/g,
      '<img src="$2" alt="$1" class="w-full h-auto rounded-lg my-4" />'
    );

    processedContent = processedContent.replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold mt-6 mb-3">$1</h3>');
    processedContent = processedContent.replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-8 mb-4">$1</h2>');
    processedContent = processedContent.replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-8 mb-4">$1</h1>');

    processedContent = processedContent.replace(/<strong>(.*?)<\/strong>/g, '<strong class="font-bold">$1</strong>');
    processedContent = processedContent.replace(/<em>(.*?)<\/em>/g, '<em class="italic">$1</em>');
    processedContent = processedContent.replace(/<b>(.*?)<\/b>/g, '<strong class="font-bold">$1</strong>');
    processedContent = processedContent.replace(/<i>(.*?)<\/i>/g, '<em class="italic">$1</em>');

    processedContent = processedContent.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>');
    processedContent = processedContent.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');

    processedContent = processedContent.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:underline">$1</a>');

    processedContent = processedContent.replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-gray-300 pl-4 italic my-4">$1</blockquote>');

    processedContent = processedContent.replace(/^\- (.*$)/gim, '<li class="ml-4">• $1</li>');

    processedContent = processedContent.replace(/\n\n/g, '</p><p class="mb-4">');
    processedContent = processedContent.replace(/\n/g, '<br />');

    if (processedContent && !processedContent.startsWith('<')) {
      processedContent = '<p class="mb-4">' + processedContent + '</p>';
    }

    return processedContent;
  };

  const injectRelatedLinks = (content: string) => {
    if (relatedArticles.length === 0) {
      return content;
    }

    const paragraphs = content.split('</p><p class="mb-4">');
    const injectionPoint = Math.floor(paragraphs.length / 2);

    if (paragraphs.length > 2) {
      const relatedArticle = relatedArticles[0];
      const relatedLink = `
<div class="my-8 p-4 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg">
  <p class="font-bold text-blue-800">READ ALSO</p>
  <a href="/news/${relatedArticle.slug}" class="text-lg font-semibold text-blue-600 hover:underline">${relatedArticle.title}</a>
</div>
`;
      paragraphs.splice(injectionPoint, 0, relatedLink);
    }

    return paragraphs.join('</p><p class="mb-4">');
  };

  const formattedContent = renderContent(article.content);
  const contentWithRelatedLinks = injectRelatedLinks(formattedContent);

  return (
    <>
      {/* Featured Image */}
      {article.featuredImage && (
        <div className="mb-6 sm:mb-8">
          <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px] overflow-hidden rounded-lg shadow-lg">
            <img
              src={article.featuredImage}
              alt={article.title}
              className="absolute inset-0 w-full h-full object-cover object-center"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1649972904349-6e-44c42644a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
              }}
            />
          </div>
        </div>
      )}
      
      {/* Article Content */}
      <div
        className="prose prose-base sm:prose-lg max-w-none mb-12"
        dangerouslySetInnerHTML={{ __html: contentWithRelatedLinks }}
      />

      <style jsx global>{`
        .prose iframe {
          width: 100%;
          max-width: 100%;
          aspect-ratio: 16 / 9;
        }
      `}</style>
    </>
  );
};

export default ArticleContent;
