import React from 'react';
import { NewsArticle } from '../types/news';

interface ArticleContentProps {
  article: NewsArticle;
  relatedArticles: NewsArticle[];
}

const ArticleContent: React.FC<ArticleContentProps> = ({ article, relatedArticles }) => {
  // Function to detect if content is Tiptap HTML or markdown
  const isTiptapContent = (content: string): boolean => {
    // Check for Tiptap-specific HTML patterns
    return content.includes('<div class="ProseMirror') || 
           content.includes('data-credit') ||
           content.includes('class="my-4"') ||
           (content.includes('<iframe') && content.includes('class="absolute')) ||
           content.includes('class="mt-2 text-xs text-gray-500 text-center italic"') ||
           // Check for common HTML patterns that indicate Tiptap content
           content.includes('<p><strong>') ||
           content.includes('<p><em>') ||
           content.includes('<p><u>') ||
           content.includes('<p><code>') ||
           content.includes('<p><a href=') ||
           content.includes('<h1>') ||
           content.includes('<h2>') ||
           content.includes('<h3>') ||
           content.includes('<ul>') ||
           content.includes('<ol>') ||
           content.includes('<blockquote>') ||
           content.includes('<table>') ||
           content.includes('<img') ||
           content.includes('<iframe') ||
           // Additional patterns for better detection
           content.includes('</p>') ||
           content.includes('</strong>') ||
           content.includes('</em>') ||
           content.includes('</u>') ||
           content.includes('</code>') ||
           content.includes('</a>') ||
           content.includes('</h1>') ||
           content.includes('</h2>') ||
           content.includes('</h3>') ||
           content.includes('</ul>') ||
           content.includes('</ol>') ||
           content.includes('</blockquote>') ||
           content.includes('</table>');
  };

  // Function to render Tiptap content using proper HTML parsing
  const renderTiptapContent = (content: string): React.ReactElement => {
    // Create a temporary div to parse the HTML safely
    const createTempDiv = () => {
      if (typeof document !== 'undefined') {
        const div = document.createElement('div');
        div.innerHTML = content;
        return div;
      }
      return null;
    };

    const tempDiv = createTempDiv();
    if (!tempDiv) {
      // Fallback for server-side rendering
      return <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: content }} />;
    }

    // Function to process nodes recursively
    const processNode = (node: Node): React.ReactElement | string | (React.ReactElement | string)[] => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent || '';
      }

      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element;
        const tagName = element.tagName.toLowerCase();
        const children = Array.from(element.childNodes).map(child => processNode(child));

        // Handle special cases for Tiptap content
        switch (tagName) {
          case 'h1':
            return <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold my-6 leading-tight text-gray-900">{children}</h1>;
          case 'h2':
            return <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold my-6 leading-tight text-gray-900">{children}</h2>;
          case 'h3':
            return <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold my-6 leading-tight text-gray-900">{children}</h3>;
          case 'h4':
            return <h4 className="text-lg sm:text-xl lg:text-2xl font-bold my-6 leading-tight text-gray-900">{children}</h4>;
          case 'h5':
            return <h5 className="text-base sm:text-lg lg:text-xl font-bold my-6 leading-tight text-gray-900">{children}</h5>;
          case 'h6':
            return <h6 className="text-sm sm:text-base lg:text-lg font-bold my-6 leading-tight text-gray-900">{children}</h6>;
          
          case 'p':
            // Check if this paragraph is actually a list item in disguise
            if (element.parentElement?.tagName.toLowerCase() === 'li') {
              return <span className="leading-relaxed text-gray-800 text-base sm:text-lg">{children}</span>;
            }
            return <p className="my-4 leading-relaxed text-gray-800 text-base sm:text-lg">{children}</p>;
          
          case 'strong':
          case 'b':
            return <strong className="font-bold">{children}</strong>;
          
          case 'em':
          case 'i':
            return <em className="italic">{children}</em>;
          
          case 'u':
            return <u className="underline">{children}</u>;
          
          case 'code':
            return <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">{children}</code>;
          
          case 'pre':
            return (
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-6">
                <code>{children}</code>
              </pre>
            );
          
          case 'blockquote':
            return (
              <blockquote className="border-l-4 border-blue-500 pl-6 py-4 my-6 bg-blue-50 rounded-r-lg">
                <p className="text-lg italic text-gray-700">{children}</p>
              </blockquote>
            );
          
          case 'ul':
            return (
              <ul 
                className="my-4 space-y-1 text-gray-800"
                style={{ listStyleType: 'disc', paddingLeft: '1.5rem' }}
              >
                {children}
              </ul>
            );
          
          case 'ol':
            return (
              <ol 
                className="my-4 space-y-1 text-gray-800"
                style={{ listStyleType: 'decimal', paddingLeft: '1.5rem' }}
              >
                {children}
              </ol>
            );
          
          case 'li':
            return (
              <li 
                className="text-base sm:text-lg leading-relaxed"
                style={{ display: 'list-item', marginBottom: '0.25rem' }}
              >
                {children}
              </li>
            );
          
          case 'table':
            return (
              <div className="overflow-x-auto my-6">
                <table className="min-w-full border border-gray-300 rounded-lg">
                  {children}
                </table>
              </div>
            );
          
          case 'thead':
            return <thead className="bg-gray-50">{children}</thead>;
          
          case 'tbody':
            return <tbody>{children}</tbody>;
          
          case 'tr':
            return <tr className="border-b border-gray-200">{children}</tr>;
          
          case 'th':
            return <th className="px-4 py-3 text-left font-semibold text-gray-900 border-r border-gray-200">{children}</th>;
          
          case 'td':
            return <td className="px-4 py-3 text-gray-800 border-r border-gray-200">{children}</td>;
          
          case 'img':
            const src = element.getAttribute('src') || '';
            const alt = element.getAttribute('alt') || '';
            const credit = element.getAttribute('data-credit') || '';
            
            return (
              <div className="my-6">
                <div className="relative w-full overflow-hidden rounded-xl shadow-lg">
                  <img
                    src={src}
                    alt={alt}
                    className="w-full h-auto object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1649972904349-6e-44c42644a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
                    }}
                  />
                </div>
                {credit && (
                  <p className="text-xs text-gray-500 mt-2 text-center italic">
                    Image credit: {credit}
                  </p>
                )}
              </div>
            );
          
          case 'a':
            const href = element.getAttribute('href') || '';
            return (
              <a 
                href={href} 
                className="text-blue-600 hover:text-blue-800 underline hover:no-underline transition-colors duration-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                {children}
              </a>
            );
          
          case 'iframe':
            const iframeSrc = element.getAttribute('src') || '';
            const iframeTitle = element.getAttribute('title') || 'Embedded content';
            const iframeWidth = element.getAttribute('width') || '560';
            const iframeHeight = element.getAttribute('height') || '315';
            
            if (iframeSrc.includes('youtube.com') || iframeSrc.includes('youtu.be')) {
              // YouTube video
              const videoId = iframeSrc.includes('youtube.com/embed/') 
                ? iframeSrc.split('youtube.com/embed/')[1]?.split('?')[0]
                : iframeSrc.includes('youtu.be/')
                ? iframeSrc.split('youtu.be/')[1]?.split('?')[0]
                : null;
              
              if (videoId) {
                return (
                  <div className="my-6">
                    <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                      <iframe
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title={iframeTitle}
                        width={iframeWidth}
                        height={iframeHeight}
                        className="absolute inset-0 w-full h-full rounded-xl"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      Source: YouTube
                    </p>
                  </div>
                );
              }
            } else if (iframeSrc.includes('vimeo.com')) {
              // Vimeo video
              const videoId = iframeSrc.includes('vimeo.com/') ? iframeSrc.split('vimeo.com/')[1]?.split('?')[0] : null;
              
              if (videoId) {
                return (
                  <div className="my-6">
                    <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                      <iframe
                        src={`https://player.vimeo.com/video/${videoId}`}
                        title={iframeTitle}
                        width={iframeWidth}
                        height={iframeHeight}
                        className="absolute inset-0 w-full h-full rounded-xl"
                        frameBorder="0"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      Source: Vimeo
                    </p>
                  </div>
                );
              }
            }
            
            // Generic iframe
            return (
              <div className="my-6">
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    src={iframeSrc}
                    title={iframeTitle}
                    width={iframeWidth}
                    height={iframeHeight}
                    className="absolute inset-0 w-full h-full rounded-xl border border-gray-200"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Embedded content from: {new URL(iframeSrc).hostname}
                </p>
              </div>
            );
          
          case 'div':
            // Handle divs that might contain iframes or other content
            const iframes = element.querySelectorAll('iframe');
            if (iframes.length > 0) {
              return (
                <div className="my-6 space-y-6">
                  {Array.from(iframes).map((iframe, index) => (
                    <div key={index}>
                      {processNode(iframe)}
                    </div>
                  ))}
                </div>
              );
            }
            
            // Check for YouTube/Vimeo links in divs
            if (element.innerHTML.includes('youtube.com') || element.innerHTML.includes('youtu.be')) {
              const links = element.querySelectorAll('a');
              for (const link of links) {
                const href = link.getAttribute('href');
                if (href && (href.includes('youtube.com') || href.includes('youtu.be'))) {
                  return processNode(link);
                }
              }
            }
            
            if (element.innerHTML.includes('vimeo.com')) {
              const links = element.querySelectorAll('a');
              for (const link of links) {
                const href = link.getAttribute('href');
                if (href && href.includes('vimeo.com')) {
                  return processNode(link);
                }
              }
            }
            
            // Default div handling
            return <div className="my-4">{children}</div>;
          
          default:
            return <div className="my-4">{children}</div>;
        }
      }
      
      return '';
    };

    // Process all child nodes
    const processedContent = Array.from(tempDiv.childNodes).map((node, index) => 
      <React.Fragment key={index}>{processNode(node)}</React.Fragment>
    );

    // If the processed content seems empty or malformed, fall back to direct HTML rendering
    if (processedContent.length === 0 || processedContent.every(item => 
      typeof item === 'string' && (item as string).trim() === ''
    )) {
      return <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: content }} />;
    }

    return <div className="prose prose-lg max-w-none">{processedContent}</div>;
  };

  // Function to render markdown content (legacy support)
  const renderMarkdownContent = (text: string): React.ReactElement => {
    let processedContent = text;

    // Process markdown patterns
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

    processedContent = processedContent.replace(/^\- (.*$)/gim, '<li>$1</li>');
    processedContent = processedContent.replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>');
    processedContent = processedContent.replace(/<\/ul>\s*<ul>/g, '');

    processedContent = processedContent.replace(/\n\n/g, '</p><p class="mb-4">');
    processedContent = processedContent.replace(/\n/g, '<br />');

    if (processedContent && !processedContent.startsWith('<')) {
      processedContent = '<p class="mb-4">' + processedContent + '</p>';
    }

    return (
      <div
        className="prose prose-base sm:prose-lg max-w-none mb-12"
        dangerouslySetInnerHTML={{ __html: processedContent }}
      />
    );
  };

  // Function to inject related article links
  const injectRelatedLinks = (content: React.ReactElement): React.ReactElement => {
    if (relatedArticles.length < 2) {
      return content;
    }

    // Shuffle the related articles to get a random selection
    const shuffledArticles = [...relatedArticles].sort(() => 0.5 - Math.random());
    const articlesToInject = shuffledArticles.slice(0, 2);

    const createRelatedLink = (article: NewsArticle) => (
      <div key={article.id} className="my-8 p-6 border-l-4 border-blue-500 bg-gradient-to-r from-blue-50 to-blue-100 rounded-r-xl shadow-sm">
        <p className="font-bold text-blue-800 text-sm uppercase tracking-wide mb-2">📖 READ ALSO</p>
        <a 
          href={`/news/${article.slug}`} 
          className="text-lg font-semibold text-blue-700 hover:text-blue-900 transition-colors duration-200 block"
        >
          {article.title}
        </a>
        {article.excerpt && (
          <p className="text-blue-600 text-sm mt-2 line-clamp-2">{article.excerpt}</p>
        )}
      </div>
    );

    // For Tiptap content, we'll inject the links at strategic points
    // This is a simplified approach - in a real implementation, you might want to
    // parse the content and inject at paragraph boundaries
    return (
      <div>
        {content}
        {createRelatedLink(articlesToInject[0])}
        {createRelatedLink(articlesToInject[1])}
      </div>
    );
  };

  // Determine content type and render accordingly
  const renderContent = (): React.ReactElement => {
    if (isTiptapContent(article.content)) {
      const tiptapContent = renderTiptapContent(article.content);
      return injectRelatedLinks(tiptapContent);
    } else {
      const markdownContent = renderMarkdownContent(article.content);
      return injectRelatedLinks(markdownContent);
    }
  };

  return (
    <>
      {/* Featured Image */}
      {article.featuredImage && (
        <div className="mb-6 sm:mb-8">
          <div className="relative w-full h-48 sm:h-64 md:h-80 lg:h-96 xl:h-[500px] overflow-hidden rounded-xl sm:rounded-2xl shadow-lg">
            <img
              src={article.featuredImage}
              alt={article.title}
              className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1649972904349-6e-44c42644a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </div>
          {article.featured_image_credit && (
            <p className="text-xs text-gray-500 mt-2 text-center">Image credit: {article.featured_image_credit}</p>
          )}
        </div>
      )}
      
      {/* Article Content */}
      {renderContent()}
    </>
  );
};

export default ArticleContent;
