import React from 'react';

interface ContentPreviewRendererProps {
  content: string;
}

const ContentPreviewRenderer: React.FC<ContentPreviewRendererProps> = ({ content }) => {
  // Function to extract YouTube video IDs from various YouTube URL formats
  const extractYouTubeId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/v\/([^&\n?#]+)/,
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  // Function to extract YouTube video ID from iframe HTML
  const extractYouTubeIdFromIframe = (iframeHtml: string): string | null => {
    const srcMatch = iframeHtml.match(/src=["']([^"']+)["']/);
    if (srcMatch) {
      return extractYouTubeId(srcMatch[1]);
    }
    return null;
  };

  // Function to render YouTube embeds
  const renderYouTubeEmbed = (url: string): JSX.Element => {
    const videoId = extractYouTubeId(url);
    if (!videoId) {
      return (
        <div className="bg-gray-100 p-4 rounded-lg border border-gray-200">
          <p className="text-gray-600 text-sm">Invalid YouTube URL: {url}</p>
        </div>
      );
    }

    return (
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video"
          className="absolute top-0 left-0 w-full h-full rounded-lg"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  };

  // Function to render Vimeo embeds
  const renderVimeoEmbed = (url: string): JSX.Element => {
    const vimeoId = url.match(/vimeo\.com\/(\d+)/)?.[1];
    if (!vimeoId) {
      return (
        <div className="bg-gray-100 p-4 rounded-lg border border-gray-200">
          <p className="text-gray-600 text-sm">Invalid Vimeo URL: {url}</p>
        </div>
      );
    }

    return (
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <iframe
          src={`https://player.vimeo.com/video/${vimeoId}`}
          title="Vimeo video"
          className="absolute top-0 left-0 w-full h-full rounded-lg"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  };

  // Function to render generic iframe embeds
  const renderIframeEmbed = (html: string): JSX.Element => {
    // Extract src from iframe
    const srcMatch = html.match(/src=["']([^"']+)["']/);
    const src = srcMatch ? srcMatch[1] : '';
    
    if (!src) {
      return (
        <div className="bg-gray-100 p-4 rounded-lg border border-gray-200">
          <p className="text-gray-600 text-sm">Invalid embed code</p>
        </div>
      );
    }

    // Check if it's a known platform and render appropriately
    if (src.includes('youtube.com') || src.includes('youtu.be')) {
      return renderYouTubeEmbed(src);
    }
    
    if (src.includes('vimeo.com')) {
      return renderVimeoEmbed(src);
    }

    // Extract width and height from iframe
    const widthMatch = html.match(/width=["']([^"']+)["']/);
    const heightMatch = html.match(/height=["']([^"']+)["']/);
    const width = widthMatch ? parseInt(widthMatch[1]) : 560;
    const height = heightMatch ? parseInt(heightMatch[1]) : 315;
    
    // Calculate aspect ratio
    const aspectRatio = (height / width) * 100;

    // Generic iframe render with proper dimensions
    return (
      <div className="my-4">
        <div className="relative w-full" style={{ paddingBottom: `${aspectRatio}%` }}>
          <iframe
            src={src}
            title="Embedded content"
            className="absolute top-0 left-0 w-full h-full rounded-lg border border-gray-200 shadow-sm"
            frameBorder="0"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
        <div className="mt-2 text-xs text-gray-500 text-center">
          Embedded content from: {new URL(src).hostname}
        </div>
      </div>
    );
  };

  // Function to render links with preview
  const renderLink = (href: string, text: string): JSX.Element => {
    return (
      <div className="inline-block">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline inline-flex items-center gap-1"
        >
          {text || href}
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
          </svg>
        </a>
      </div>
    );
  };

  // Function to render images with preview and credits
  const renderImage = (src: string, alt: string, credit?: string): JSX.Element => {
    return (
      <div className="my-4">
        <img
          src={src}
          alt={alt || 'Image'}
          className="max-w-full h-auto rounded-lg shadow-sm border border-gray-200"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            target.nextElementSibling?.classList.remove('hidden');
          }}
        />
        {/* Credit attribution */}
        {credit && (
          <div className="mt-2 text-xs text-gray-500 text-center italic">
            <span className="text-gray-600 font-medium">Credit: </span>
            {credit}
          </div>
        )}
        <div className="hidden mt-2 p-3 bg-gray-100 rounded-lg border border-gray-200">
          <p className="text-gray-600 text-sm">
            <strong>Image:</strong> {alt || 'No alt text'}
          </p>
          <p className="text-gray-500 text-xs break-all">{src}</p>
        </div>
      </div>
    );
  };

  // Function to render code blocks with syntax highlighting
  const renderCodeBlock = (code: string, language?: string): JSX.Element => {
    return (
      <div className="my-4">
        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
          <code className={`language-${language || 'text'}`}>{code}</code>
        </pre>
        {language && (
          <div className="mt-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {language}
          </div>
        )}
      </div>
    );
  };

  // Function to render tables with styling
  const renderTable = (tableHtml: string): JSX.Element => {
    return (
      <div className="my-4 overflow-x-auto">
        <div 
          className="border border-gray-200 rounded-lg"
          dangerouslySetInnerHTML={{ __html: tableHtml }}
        />
      </div>
    );
  };

  // Function to render blockquotes with styling
  const renderBlockquote = (content: string): JSX.Element => {
    return (
      <blockquote className="my-4 pl-4 border-l-4 border-gray-300 bg-gray-50 py-2 italic text-gray-700">
        {content}
      </blockquote>
    );
  };

  // Function to render lists with proper styling
  const renderList = (content: string, isOrdered: boolean): JSX.Element => {
    const ListTag = isOrdered ? 'ol' : 'ul';
    const items = content.match(/<li[^>]*>.*?<\/li>/gs) || [];
    
    return (
      <ListTag className={`my-4 ${isOrdered ? 'list-decimal' : 'list-disc'} pl-6`}>
        {items.map((item, index) => {
          const cleanItem = item.replace(/<li[^>]*>|<\/li>/g, '');
          return (
            <li key={index} className="mb-1">
              {cleanItem}
            </li>
          );
        })}
      </ListTag>
    );
  };

  // Function to render headings with proper styling
  const renderHeading = (content: string, level: number): JSX.Element => {
    const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
    const baseClasses = 'font-bold my-4';
    const levelClasses = {
      1: 'text-3xl text-gray-900',
      2: 'text-2xl text-gray-800',
      3: 'text-xl text-gray-700',
      4: 'text-lg text-gray-600',
      5: 'text-base text-gray-600',
      6: 'text-sm text-gray-600'
    };

    return (
      <HeadingTag className={`${baseClasses} ${levelClasses[level as keyof typeof levelClasses]}`}>
        {content}
      </HeadingTag>
    );
  };

  // Function to render the content with preview
  const renderContent = (): JSX.Element => {
    if (!content) {
      return (
        <div className="text-gray-500 text-center py-8">
          No content to preview
        </div>
      );
    }

    // Create a temporary div to parse the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;

    // Process each node
    const processNode = (node: Node): JSX.Element | string => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent || '';
      }

      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element;
        const tagName = element.tagName.toLowerCase();
        const textContent = element.textContent || '';

        switch (tagName) {
          case 'h1':
            return renderHeading(textContent, 1);
          case 'h2':
            return renderHeading(textContent, 2);
          case 'h3':
            return renderHeading(textContent, 3);
          case 'h4':
            return renderHeading(textContent, 4);
          case 'h5':
            return renderHeading(textContent, 5);
          case 'h6':
            return renderHeading(textContent, 6);
          case 'p':
            return <p className="my-3 leading-relaxed">{textContent}</p>;
          case 'strong':
          case 'b':
            return <strong className="font-bold">{textContent}</strong>;
          case 'em':
          case 'i':
            return <em className="italic">{textContent}</em>;
          case 'u':
            return <u className="underline">{textContent}</u>;
          case 'code':
            return <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">{textContent}</code>;
          case 'pre':
            return renderCodeBlock(textContent);
          case 'blockquote':
            return renderBlockquote(textContent);
          case 'ul':
            return renderList(element.outerHTML, false);
          case 'ol':
            return renderList(element.outerHTML, true);
          case 'table':
            return renderTable(element.outerHTML);
          case 'img':
            const src = element.getAttribute('src') || '';
            const alt = element.getAttribute('alt') || '';
            const credit = element.getAttribute('data-credit') || '';
            return renderImage(src, alt, credit);
          case 'a':
            const href = element.getAttribute('href') || '';
            return renderLink(href, textContent);
          case 'iframe':
            return renderIframeEmbed(element.outerHTML);
          case 'div':
            // Check if it contains iframe embeds
            const iframes = element.querySelectorAll('iframe');
            if (iframes.length > 0) {
              return (
                <div className="my-4 space-y-4">
                  {Array.from(iframes).map((iframe, index) => (
                    <div key={index}>
                      {renderIframeEmbed(iframe.outerHTML)}
                    </div>
                  ))}
                </div>
              );
            }
            
            // Check if it's a YouTube embed
            if (element.innerHTML.includes('youtube.com') || element.innerHTML.includes('youtu.be')) {
              const links = element.querySelectorAll('a');
              for (const link of links) {
                const href = link.getAttribute('href');
                if (href && (href.includes('youtube.com') || href.includes('youtu.be'))) {
                  return renderYouTubeEmbed(href);
                }
              }
            }
            // Check if it's a Vimeo embed
            if (element.innerHTML.includes('vimeo.com')) {
              const links = element.querySelectorAll('a');
              for (const link of links) {
                const href = link.getAttribute('href');
                if (href && href.includes('vimeo.com')) {
                  return renderVimeoEmbed(href);
                }
              }
            }
            // Generic div with content
            return <div className="my-2">{Array.from(element.childNodes).map((child, index) => 
              <React.Fragment key={index}>{processNode(child)}</React.Fragment>
            )}</div>;
          default:
            // For other tags, render children
            return (
              <div className="my-2">
                {Array.from(element.childNodes).map((child, index) => 
                  <React.Fragment key={index}>{processNode(child)}</React.Fragment>
                )}
              </div>
            );
        }
      }

      return '';
    };

    // Process all child nodes
    const processedContent = Array.from(tempDiv.childNodes).map((node, index) => 
      <React.Fragment key={index}>{processNode(node)}</React.Fragment>
    );

    return <div className="prose prose-lg max-w-none">{processedContent}</div>;
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 min-h-[400px]">
      {renderContent()}
    </div>
  );
};

export default ContentPreviewRenderer;
