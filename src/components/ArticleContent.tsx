import React, { useEffect } from 'react';
import { NewsArticle } from '../types/news';

interface ArticleContentProps {
  article: NewsArticle;
}

const ArticleContent: React.FC<ArticleContentProps> = ({ article }) => {
  useEffect(() => {
    // Load Instagram embed script if Instagram content is present
    if (article.content.includes('instagram-media') || article.content.includes('instagram.com/p/')) {
      const script = document.createElement('script');
      script.src = '//www.instagram.com/embed.js';
      script.async = true;
      document.body.appendChild(script);
      
      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }

    // Load Twitter/X embed script if Twitter content is present
    if (article.content.includes('twitter.com') || article.content.includes('x.com')) {
      const script = document.createElement('script');
      script.src = 'https://platform.twitter.com/widgets.js';
      script.async = true;
      document.body.appendChild(script);
      
      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }
  }, [article.content]);

  const renderContent = (content: string) => {
    // Split content by double newlines to preserve paragraph structure
    const blocks = content.split('\n\n');
    
    return blocks.map((block, index) => {
      const trimmedBlock = block.trim();
      if (!trimmedBlock) return null;

      // Handle video embeds (HTML content) - YouTube, Facebook, Instagram, etc.
      if (trimmedBlock.includes('<iframe') || 
          trimmedBlock.includes('<div class="video-embed') ||
          trimmedBlock.includes('<blockquote class="instagram-media') ||
          trimmedBlock.includes('<blockquote class="twitter-tweet')) {
        return (
          <div 
            key={index} 
            className="my-8 flex justify-center"
            dangerouslySetInnerHTML={{ __html: trimmedBlock }} 
          />
        );
      }

      // Handle direct YouTube URLs
      if (trimmedBlock.match(/https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)/)) {
        const videoId = extractYouTubeId(trimmedBlock);
        if (videoId) {
          return (
            <div key={index} className="my-8 flex justify-center">
              <div className="youtube-embed">
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full max-w-4xl aspect-video rounded-lg shadow-lg"
                />
              </div>
            </div>
          );
        }
      }

      // Handle images with markdown syntax - including complex URLs with parameters
      if (trimmedBlock.match(/!\[([^\]]*)\]\(([^)]+)\)/)) {
        const match = trimmedBlock.match(/!\[([^\]]*)\]\(([^)]+)\)/);
        if (match) {
          const [, alt, src] = match;
          return (
            <div key={index} className="my-8">
              <img
                src={src}
                alt={alt}
                className="w-full h-auto rounded-lg shadow-lg mx-auto max-w-full"
                style={{ maxHeight: '600px', objectFit: 'contain' }}
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
                }}
              />
              {alt && (
                <p className="text-sm text-gray-600 text-center mt-3 italic px-4">
                  {alt}
                </p>
              )}
            </div>
          );
        }
      }

      // Handle headers (h1, h2, h3, h4, h5, h6)
      const headerMatch = trimmedBlock.match(/^(#+)\s+(.+)$/);
      if (headerMatch) {
        const [, hashes, text] = headerMatch;
        const level = hashes.length;
        
        const headerClasses = {
          1: 'text-4xl font-bold mt-12 mb-6 text-gray-900',
          2: 'text-3xl font-bold mt-10 mb-5 text-gray-900',
          3: 'text-2xl font-bold mt-8 mb-4 text-gray-900',
          4: 'text-xl font-bold mt-6 mb-3 text-gray-900',
          5: 'text-lg font-bold mt-6 mb-3 text-gray-900',
          6: 'text-base font-bold mt-6 mb-3 text-gray-900'
        };

        const HeaderTag = `h${Math.min(level, 6)}` as keyof JSX.IntrinsicElements;
        
        return React.createElement(
          HeaderTag,
          {
            key: index,
            className: headerClasses[Math.min(level, 6) as keyof typeof headerClasses]
          },
          text
        );
      }

      // Handle blockquotes
      if (trimmedBlock.startsWith('> ')) {
        const lines = trimmedBlock.split('\n');
        const quoteContent = lines
          .map(line => line.replace(/^>\s?/, ''))
          .join('\n');
        
        return (
          <blockquote key={index} className="border-l-4 border-blue-500 pl-6 py-4 italic text-gray-700 bg-gray-50 rounded-r-lg my-6">
            <div dangerouslySetInnerHTML={{ __html: processTextFormatting(quoteContent) }} />
          </blockquote>
        );
      }

      // Handle unordered lists
      if (trimmedBlock.includes('\n- ') || trimmedBlock.startsWith('- ')) {
        const items = trimmedBlock.split('\n').filter(item => item.trim().startsWith('- '));
        return (
          <ul key={index} className="list-disc pl-6 mb-6 space-y-2">
            {items.map((item, itemIndex) => (
              <li 
                key={itemIndex} 
                className="text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ 
                  __html: processTextFormatting(item.replace(/^- /, ''))
                }}
              />
            ))}
          </ul>
        );
      }

      // Handle ordered lists
      if (trimmedBlock.match(/^\d+\./m)) {
        const items = trimmedBlock.split('\n').filter(item => item.trim().match(/^\d+\./));
        return (
          <ol key={index} className="list-decimal pl-6 mb-6 space-y-2">
            {items.map((item, itemIndex) => (
              <li 
                key={itemIndex} 
                className="text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ 
                  __html: processTextFormatting(item.replace(/^\d+\.\s*/, ''))
                }}
              />
            ))}
          </ol>
        );
      }

      // Handle code blocks
      if (trimmedBlock.startsWith('```')) {
        const lines = trimmedBlock.split('\n');
        const language = lines[0].replace('```', '').trim();
        const code = lines.slice(1, -1).join('\n');
        
        return (
          <div key={index} className="my-6">
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <code className={`language-${language}`}>
                {code}
              </code>
            </pre>
          </div>
        );
      }

      // Handle inline code
      if (trimmedBlock.includes('`') && !trimmedBlock.startsWith('```')) {
        return (
          <p 
            key={index} 
            className="text-gray-700 leading-relaxed mb-4"
            dangerouslySetInnerHTML={{ 
              __html: processTextFormatting(trimmedBlock)
                .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono">$1</code>')
            }}
          />
        );
      }

      // Handle horizontal rules
      if (trimmedBlock.match(/^---+$/) || trimmedBlock.match(/^\*\*\*+$/) || trimmedBlock.match(/^___+$/)) {
        return <hr key={index} className="my-8 border-gray-300" />;
      }

      // Handle tables (basic markdown table support)
      if (trimmedBlock.includes('|') && trimmedBlock.includes('\n')) {
        const lines = trimmedBlock.split('\n').filter(line => line.trim());
        if (lines.length >= 2 && lines[1].includes('---')) {
          const headers = lines[0].split('|').map(h => h.trim()).filter(h => h);
          const rows = lines.slice(2).map(line => 
            line.split('|').map(cell => cell.trim()).filter(cell => cell)
          );

          return (
            <div key={index} className="my-6 overflow-x-auto">
              <table className="min-w-full border border-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    {headers.map((header, i) => (
                      <th key={i} className="border border-gray-300 px-4 py-2 text-left font-semibold">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      {row.map((cell, j) => (
                        <td key={j} className="border border-gray-300 px-4 py-2">
                          <span dangerouslySetInnerHTML={{ __html: processTextFormatting(cell) }} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
      }

      // Regular paragraph - handle multiple lines within the block
      return (
        <div key={index} className="mb-4">
          {trimmedBlock.split('\n').map((line, lineIndex) => (
            <p 
              key={lineIndex}
              className="text-gray-700 leading-relaxed mb-2 last:mb-0"
              dangerouslySetInnerHTML={{ __html: processTextFormatting(line) }}
            />
          ))}
        </div>
      );
    }).filter(Boolean);
  };

  // Enhanced text formatting function to handle all possible markup
  const processTextFormatting = (text: string) => {
    return text
      // Handle existing HTML tags first (preserve them)
      .replace(/<(strong|b)>(.*?)<\/(strong|b)>/g, '<strong>$2</strong>')
      .replace(/<(em|i)>(.*?)<\/(em|i)>/g, '<em>$2</em>')
      .replace(/<u>(.*?)<\/u>/g, '<u>$1</u>')
      .replace(/<s>(.*?)<\/s>/g, '<s>$1</s>')
      .replace(/<mark>(.*?)<\/mark>/g, '<mark class="bg-yellow-200 px-1">$1</mark>')
      
      // Handle markdown formatting (only if not already HTML)
      .replace(/(?<!<[^>]*)\*\*([^*]+)\*\*(?![^<]*>)/g, '<strong>$1</strong>')
      .replace(/(?<!<[^>]*)\*([^*]+)\*(?![^<]*>)/g, '<em>$1</em>')
      .replace(/(?<!<[^>]*)\~\~([^~]+)\~\~(?![^<]*>)/g, '<s>$1</s>')
      .replace(/(?<!<[^>]*)\=\=([^=]+)\=\=(?![^<]*>)/g, '<mark class="bg-yellow-200 px-1">$1</mark>')
      
      // Handle links - support both markdown and HTML
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200" target="_blank" rel="noopener noreferrer">$1</a>')
      
      // Handle line breaks within text
      .replace(/\n/g, '<br />');
  };

  // Helper function to extract YouTube video ID
  const extractYouTubeId = (url: string): string | null => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  return (
    <>
      {/* Featured Image */}
      {article.featuredImage && (
        <div className="mb-8">
          <img
            src={article.featuredImage}
            alt={article.title}
            className="w-full h-96 object-cover rounded-xl shadow-lg"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
            }}
          />
        </div>
      )}
      
      {/* Article Content */}
      <div className="prose prose-lg max-w-none mb-12">
        {renderContent(article.content)}
      </div>

      {/* Enhanced styles for all embed types */}
      <style>{`
        .video-embed {
          margin: 2rem 0;
          display: flex;
          justify-content: center;
        }
        
        .video-embed iframe {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .youtube-embed {
          width: 100%;
          max-width: 900px;
        }

        .youtube-embed iframe {
          aspect-ratio: 16/9;
          width: 100%;
        }

        .facebook-embed iframe {
          width: 100%;
          max-width: 560px;
        }

        .instagram-embed {
          display: flex;
          justify-content: center;
          margin: 2rem 0;
        }

        .instagram-media {
          max-width: 540px !important;
          width: 100% !important;
          margin: 0 auto !important;
        }

        .twitter-tweet {
          margin: 2rem auto !important;
          max-width: 550px !important;
        }

        /* Code block styling */
        pre code {
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 0.875rem;
          line-height: 1.5;
        }

        /* Table responsive styling */
        table {
          border-collapse: collapse;
          margin: 1.5rem 0;
        }

        /* Link styling */
        a {
          text-decoration: none;
          border-bottom: 1px solid transparent;
        }

        a:hover {
          border-bottom-color: currentColor;
        }

        /* Responsive design */
        @media (max-width: 768px) {
          .video-embed iframe {
            width: 100%;
            height: auto;
          }
          
          .youtube-embed iframe {
            height: 200px;
          }
          
          .facebook-embed iframe {
            height: 200px;
          }

          .prose {
            font-size: 1rem;
          }

          .prose h1 {
            font-size: 2rem;
          }

          .prose h2 {
            font-size: 1.75rem;
          }

          .prose h3 {
            font-size: 1.5rem;
          }

          table {
            font-size: 0.875rem;
          }

          th, td {
            padding: 0.5rem !important;
          }
        }

        @media (max-width: 480px) {
          .prose h1 {
            font-size: 1.75rem;
          }

          .prose h2 {
            font-size: 1.5rem;
          }

          .prose h3 {
            font-size: 1.25rem;
          }
        }
      `}</style>
    </>
  );
};

export default ArticleContent;