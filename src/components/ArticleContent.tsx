import Link from 'next/link';
import React from 'react';
import { InArticleAd } from '@/components/AdSense';
import { AD_SLOTS, ENABLE_ADSENSE } from '@/config/adsense';

// Declare Twitter and Instagram widgets global
declare global {
  interface Window {
    twttr?: {
      widgets: {
        load: () => void;
      };
    };
    instgrm?: {
      Embeds: {
        process: () => void;
      };
    };
  }
}

import { NewsArticle } from '@/types/news';

interface ArticleContentProps {
  content: string;
  featuredImage?: string;
  featuredImageCredit?: string;
  inlineImageCredits?: Record<string, string>;
  relatedArticles?: NewsArticle[];
}

const ArticleContent: React.FC<ArticleContentProps> = ({ 
  content, 
  featuredImage, 
  featuredImageCredit,
  inlineImageCredits = {},
  relatedArticles = []
}) => {
  const contentRef = React.useRef<HTMLDivElement>(null);
  // Function to inject READ MORE links into content by inserting HTML
  const injectReadMoreLinks = (htmlContent: string): string => {
    if (relatedArticles.length === 0) return htmlContent;
    
    // Count paragraphs in the content
    const paragraphMatches = htmlContent.match(/<p[^>]*>/gi);
    const paragraphCount = paragraphMatches ? paragraphMatches.length : 0;
    
    if (paragraphCount < 3) return htmlContent; // Need at least 3 paragraphs
    
    // Calculate insertion points (after 1/3 and 2/3 of content)
    const firstInsertPoint = Math.floor(paragraphCount / 3);
    const secondInsertPoint = Math.floor((paragraphCount * 2) / 3);
    const insertionPoints = [firstInsertPoint, secondInsertPoint].filter(idx => idx > 0 && idx < paragraphCount);
    
    // Get articles for READ MORE links (use up to 2)
    const articlesForReadMore = relatedArticles.slice(0, Math.min(2, insertionPoints.length));
    
    if (articlesForReadMore.length === 0) return htmlContent;
    
    // Split content by paragraph tags
    const parts = htmlContent.split(/(<\/p>)/);
    let paragraphIndex = 0;
    const result: string[] = [];
    
    for (let i = 0; i < parts.length; i++) {
      result.push(parts[i]);
      
      // Check if this is a closing paragraph tag
      if (parts[i] === '</p>') {
        paragraphIndex++;
        
        // Check if we should insert a READ MORE link after this paragraph
        const insertIndex = insertionPoints.indexOf(paragraphIndex);
        if (insertIndex !== -1 && insertIndex < articlesForReadMore.length) {
          const article = articlesForReadMore[insertIndex];
          const readMoreHtml = `<p style="margin: 20px 0; font-size: 18px; line-height: 1.7;"><a href="/${article.category.slug}/${article.slug}" style="color: #2563eb; text-decoration: none; font-size: 18px;"><strong style="color: #111111;">READ MORE:</strong> <span style="color: #2563eb;">${article.title}</span></a></p>`;
          result.push(readMoreHtml);
        }
      }
    }
    
    return result.join('');
  };
  // Function to render featured image with credit
  const renderFeaturedImage = () => {
    if (!featuredImage) return null;

    return (
      <div className="relative mb-8">
        <img
          src={featuredImage}
          alt="Featured"
          className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-lg shadow-lg"
        />
        {featuredImageCredit && (
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            {featuredImageCredit}
          </div>
        )}
      </div>
    );
  };

  // Function to render inline image with credit
  const renderInlineImage = (src: string, alt: string, credit?: string) => {
    const imageCredit = credit || inlineImageCredits[src];
    
    return (
      <div className="relative my-6">
        <img
          src={src}
          alt={alt}
          className="w-full max-w-full h-auto rounded-lg shadow-md"
        />
        {imageCredit && (
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            {imageCredit}
          </div>
        )}
      </div>
    );
  };

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

  // Server-side HTML processor: adds inline styles to paragraphs and other elements
  const processHTMLForSSR = (html: string): string => {
    let processed = html;
    
    // Add inline styles to paragraphs that don't already have style attributes
    processed = processed.replace(
      /<p([^>]*?)>/gi,
      (match, attrs) => {
        // Check if style attribute already exists
        if (attrs.includes('style=')) {
          // Add to existing style if it doesn't have our styles
          if (!attrs.includes('font-size') && !attrs.includes('fontSize')) {
            return match.replace(
              /style="([^"]*)"/i,
              (styleMatch, existingStyles) => {
                return `style="${existingStyles}; color: #111111; font-size: 18px; line-height: 1.7;"`;
              }
            );
          }
          return match;
        }
        // Add style attribute if it doesn't exist
        return `<p${attrs} style="color: #111111; font-size: 18px; line-height: 1.7; margin: 20px 0;">`;
      }
    );
    
    // Add styles to list items
    processed = processed.replace(
      /<li([^>]*?)>/gi,
      (match, attrs) => {
        if (attrs.includes('style=')) {
          if (!attrs.includes('font-size') && !attrs.includes('fontSize')) {
            return match.replace(
              /style="([^"]*)"/i,
              (styleMatch, existingStyles) => {
                return `style="${existingStyles}; font-size: 18px; line-height: 1.7; margin-bottom: 0.5rem;"`;
              }
            );
          }
          return match;
        }
        return `<li${attrs} style="font-size: 18px; line-height: 1.7; margin-bottom: 0.5rem;">`;
      }
    );
    
    // Add styles to links
    processed = processed.replace(
      /<a([^>]*?)>/gi,
      (match, attrs) => {
        if (attrs.includes('style=')) {
          if (!attrs.includes('font-size') && !attrs.includes('fontSize')) {
            return match.replace(
              /style="([^"]*)"/i,
              (styleMatch, existingStyles) => {
                return `style="${existingStyles}; font-size: 18px;"`;
              }
            );
          }
          return match;
        }
        // Don't add default styles to links that might have custom styling
        return match;
      }
    );
    
    return processed;
  };

  // Function to render Tiptap content using proper HTML parsing
  const renderTiptapContent = (content: string): React.ReactElement => {
    // Create a temporary div to parse the HTML safely (client-side)
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
      // Server-side rendering: process HTML to add inline styles and inject ads
      let processedContent = processHTMLForSSR(content);
      
      // Inject ad after 2nd paragraph for SSR (if enabled)
      // Note: Ad will be initialized via useEffect on client-side
      if (typeof window === 'undefined' && ENABLE_ADSENSE) {
        // Only inject in SSR - client-side will use React components
        const paragraphMatches = processedContent.match(/<p[^>]*>[\s\S]*?<\/p>/gi);
        if (paragraphMatches && paragraphMatches.length >= 2) {
          // Find the end of the 2nd paragraph
          const secondParagraphEnd = processedContent.indexOf(paragraphMatches[1]) + paragraphMatches[1].length;
          const adHtml = '<div class="adsense-in-article-wrapper" style="margin: 32px 0; text-align: center;"><ins class="adsbygoogle" style="display:block; text-align:center;" data-ad-layout="in-article" data-ad-format="fluid" data-ad-client="ca-pub-9758177091764288" data-ad-slot="5357563959"></ins></div>';
          processedContent = processedContent.slice(0, secondParagraphEnd) + adHtml + processedContent.slice(secondParagraphEnd);
        }
      }
      
      return (
        <div 
          className="prose prose-lg max-w-none" 
          style={{ color: '#111111', fontSize: '18px', lineHeight: '1.7' }}
          dangerouslySetInnerHTML={{ __html: processedContent }} 
        />
      );
    }

    // Track paragraph count for ad injection
    let paragraphCount = 0;
    let totalParagraphs = 0;

    // First pass: count total paragraphs to ensure we have enough content
    const countParagraphs = (node: Node): void => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element;
        const tagName = element.tagName.toLowerCase();
        if (tagName === 'p' && element.parentElement?.tagName.toLowerCase() !== 'li') {
          totalParagraphs++;
        }
        Array.from(element.childNodes).forEach(child => countParagraphs(child));
      }
    };
    Array.from(tempDiv.childNodes).forEach(child => countParagraphs(child));

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
            return <h1 className="font-bold my-6 leading-tight text-2xl sm:text-3xl lg:text-4xl" style={{ color: '#111111', fontSize: '24px', lineHeight: '1.3' }}>{children}</h1>;
          case 'h2':
            return <h2 className="font-bold my-6 leading-tight text-xl sm:text-2xl lg:text-3xl" style={{ color: '#111111', fontSize: '22px', lineHeight: '1.3' }}>{children}</h2>;
          case 'h3':
            return <h3 className="font-bold my-6 leading-tight text-lg sm:text-xl lg:text-2xl" style={{ color: '#111111', fontSize: '20px', lineHeight: '1.3' }}>{children}</h3>;
          case 'h4':
            return <h4 className="font-bold my-6 leading-tight text-base sm:text-lg lg:text-xl" style={{ color: '#111111', fontSize: '18px', lineHeight: '1.3' }}>{children}</h4>;
          case 'h5':
            return <h5 className="font-bold my-6 leading-tight text-base sm:text-lg" style={{ color: '#111111', fontSize: '18px', lineHeight: '1.3' }}>{children}</h5>;
          case 'h6':
            return <h6 className="font-bold my-6 leading-tight text-base sm:text-lg" style={{ color: '#111111', fontSize: '18px', lineHeight: '1.3' }}>{children}</h6>;
          
          case 'p':
            // Check if this paragraph is actually a list item in disguise
            if (element.parentElement?.tagName.toLowerCase() === 'li') {
              return <span className="leading-relaxed" style={{ color: '#111111', fontSize: '18px', lineHeight: '1.7' }}>{children}</span>;
            }
            
            // Check for "READ MORE" pattern in paragraph text
            const paragraphText = element.textContent || '';
            if (paragraphText.toLowerCase().includes('read more')) {
              // Look for links within this paragraph
              const links = element.querySelectorAll('a');
              if (links.length > 0) {
                const firstLink = links[0];
                const linkHref = firstLink.getAttribute('href') || '';
                const isInternalLink = linkHref.startsWith('/') || linkHref.includes('ghnewsmedia.com');
                
                if (isInternalLink) {
                  const linkText = firstLink.textContent || '';
                  const articleTitle = linkText.replace(/read more:?\s*/i, '').trim() || 'Continue reading';
                  
                  return (
                    <p style={{ margin: '20px 0', fontSize: '18px', lineHeight: '1.7' }}>
                      <Link 
                        href={linkHref}
                        style={{
                          color: '#2563eb',
                          fontWeight: 'normal',
                          textDecoration: 'none',
                          fontSize: '18px'
                        }}
                      >
                        <strong style={{ color: '#111111' }}>READ MORE:</strong> <span style={{ color: '#2563eb' }}>{articleTitle}</span>
                      </Link>
                    </p>
                  );
            }
              }
            }
            
            // Increment paragraph count (only for actual paragraphs, not list items)
            paragraphCount++;
            const paragraphElement = <p key={`p-${paragraphCount}`} className="my-5 leading-relaxed" style={{ color: '#111111', fontSize: '18px', lineHeight: '1.7' }}>{children}</p>;
            
            // Inject ad after 2nd paragraph (as recommended by Google)
            // Only inject if we have at least 3 paragraphs total to ensure enough content
            if (paragraphCount === 2 && totalParagraphs >= 3 && ENABLE_ADSENSE) {
              return (
                <React.Fragment key={`para-group-${paragraphCount}`}>
                  {paragraphElement}
                  <InArticleAd adSlot={AD_SLOTS.IN_ARTICLE_1} />
                </React.Fragment>
              );
            }
            
            return paragraphElement;
          
          case 'strong':
          case 'b':
            return <strong className="font-bold">{children}</strong>;
          
          case 'em':
          case 'i':
            return <em className="italic">{children}</em>;
          
          case 'u':
            return <u className="underline">{children}</u>;
          
          case 'code':
            return <code className="px-2 py-1 rounded text-sm font-mono" style={{ backgroundColor: '#F3F4F6', color: '#111111' }}>{children}</code>;
          
          case 'pre':
            return (
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-6">
                <code>{children}</code>
              </pre>
            );
          
          case 'blockquote':
            // Check if this is a Twitter or Instagram embed
            const blockquoteClass = element.getAttribute('class') || '';
            const blockquoteContent = element.innerHTML || '';
            const blockquoteText = element.textContent || '';
            
            // Detect Twitter embed by content patterns (even if class is missing)
            const isTwitterEmbed = blockquoteClass.includes('twitter-tweet') || 
              blockquoteContent.includes('pic.twitter.com') ||
              blockquoteContent.includes('twitter.com/') && blockquoteContent.includes('/status/') ||
              blockquoteText.match(/@\w+.*twitter\.com/);
            
            // Detect Instagram embed by content patterns (even if class is missing)
            const isInstagramEmbed = blockquoteClass.includes('instagram-media') ||
              blockquoteContent.includes('View this post on Instagram') ||
              blockquoteContent.includes('instagram.com/reel/') ||
              blockquoteContent.includes('instagram.com/p/') ||
              blockquoteContent.includes('instagram.com/tv/');
            
            // Twitter embed
            if (isTwitterEmbed) {
              // Get all attributes from the original blockquote
              const blockquoteProps: Record<string, string> = {};
              Array.from(element.attributes).forEach(attr => {
                blockquoteProps[attr.name] = attr.value;
              });
              
              // Extract tweet URL from content if not in attributes
              let tweetUrl = blockquoteProps['data-tweet-id'] || blockquoteProps['data-url'] || '';
              if (!tweetUrl) {
                // Try to extract from links in the content
                const urlMatch = blockquoteContent.match(/https?:\/\/(?:twitter\.com|x\.com)\/[^"'\s<>]+/);
                if (urlMatch) {
                  tweetUrl = urlMatch[0];
                  // Extract tweet ID from URL
                  const tweetIdMatch = tweetUrl.match(/\/status\/(\d+)/);
                  if (tweetIdMatch) {
                    blockquoteProps['data-tweet-id'] = tweetIdMatch[1];
                  }
                }
              }
              
              // Ensure class is set correctly
              const finalClass = blockquoteClass.includes('twitter-tweet') 
                ? blockquoteClass 
                : blockquoteClass 
                  ? `${blockquoteClass} twitter-tweet`
                  : 'twitter-tweet';
              
              // Remove class/className from props to avoid conflicts, we'll set it explicitly
              const { class: _, className: __, ...restProps } = blockquoteProps;
              
              // Render Twitter embed with original HTML and attributes
              return (
                <div className="my-6 sm:my-8" style={{ margin: '24px 0', width: '100%' }}>
                  <div 
                    className="twitter-embed-wrapper"
                    style={{ 
                      maxWidth: '100%',
                      width: '100%',
                      overflow: 'hidden',
                      margin: '0 auto',
                      padding: '0',
                      boxSizing: 'border-box'
                    }}
                  >
                    <blockquote 
                      {...restProps}
                      className={finalClass}
                      data-tweet-id={blockquoteProps['data-tweet-id'] || undefined}
                      style={{ margin: 0, width: '100%', maxWidth: '100%' }}
                      dangerouslySetInnerHTML={{ __html: element.innerHTML }}
                    />
                  </div>
                </div>
              );
            }
            
            // Instagram embed
            if (isInstagramEmbed) {
              // Get all attributes from the original blockquote
              const blockquoteProps: Record<string, string> = {};
              Array.from(element.attributes).forEach(attr => {
                blockquoteProps[attr.name] = attr.value;
              });
              
              // Extract Instagram URL from content if not in attributes
              let instagramUrl = blockquoteProps['data-instgrm-permalink'] || blockquoteProps['data-url'] || '';
              if (!instagramUrl) {
                // Try to extract from links in the content
                const urlMatch = blockquoteContent.match(/https?:\/\/www\.instagram\.com\/(?:reel|p|tv)\/[^"'\s<>?]+/);
                if (urlMatch) {
                  instagramUrl = urlMatch[0];
                  blockquoteProps['data-instgrm-permalink'] = instagramUrl;
                }
              }
              
              // Ensure class is set correctly
              const finalClass = blockquoteClass.includes('instagram-media') 
                ? blockquoteClass 
                : blockquoteClass 
                  ? `${blockquoteClass} instagram-media`
                  : 'instagram-media';
              
              // Remove class/className from props to avoid conflicts, we'll set it explicitly
              const { class: _, className: __, ...restProps } = blockquoteProps;
              
              // Render Instagram embed with original HTML and attributes
              return (
                <div className="my-6 sm:my-8" style={{ margin: '24px 0', width: '100%' }}>
                  <div 
                    className="instagram-embed-wrapper"
                    style={{ 
                      maxWidth: '100%',
                      width: '100%',
                      overflow: 'hidden',
                      margin: '0 auto',
                      display: 'flex',
                      justifyContent: 'center',
                      padding: '0'
                    }}
                  >
                    <blockquote 
                      {...restProps}
                      className={finalClass}
                      data-instgrm-permalink={blockquoteProps['data-instgrm-permalink'] || undefined}
                      data-instgrm-version="14"
                      style={{ margin: 0, maxWidth: '540px', width: '100%', minWidth: '326px' }}
                      dangerouslySetInnerHTML={{ __html: element.innerHTML }}
                    />
                  </div>
                </div>
              );
            }
            
            // Regular blockquote
            return (
              <blockquote className="border-l-4 border-blue-500 pl-6 py-4 my-6 bg-blue-50 rounded-r-lg">
                <p className="text-lg italic" style={{ color: '#111111' }}>{children}</p>
              </blockquote>
            );
          
          case 'ul':
            return (
              <ul 
                className="my-4 space-y-1"
                style={{ color: '#111111', listStyleType: 'disc', paddingLeft: '1.5rem' }}
              >
                {children}
              </ul>
            );
          
          case 'ol':
            return (
              <ol 
                className="my-4 space-y-1"
                style={{ color: '#111111', listStyleType: 'decimal', paddingLeft: '1.5rem' }}
              >
                {children}
              </ol>
            );
          
          case 'li':
            return (
              <li 
                className="text-base sm:text-lg leading-relaxed"
                style={{ display: 'list-item', marginBottom: '0.5rem', fontSize: '18px', lineHeight: '1.7' }}
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
            return <th className="px-4 py-3 text-left font-semibold border-r border-gray-200" style={{ color: '#111111' }}>{children}</th>;
          
          case 'td':
            return <td className="px-4 py-3 border-r border-gray-200" style={{ color: '#111111' }}>{children}</td>;
          
                    case 'img':
            const src = element.getAttribute('src') || '';
            const alt = element.getAttribute('alt') || '';
            const credit = element.getAttribute('data-credit') || '';
            return renderInlineImage(src, alt, credit);
          
          case 'a':
            const href = element.getAttribute('href') || '';
            const linkText = element.textContent || '';
            
            // Handle "READ MORE" links inside article content (Pulse.com.gh style)
            if (linkText.toLowerCase().includes('read more') || linkText.toLowerCase().includes('readmore')) {
              // Extract article slug from href if it's an internal link
              const isInternalLink = href.startsWith('/') || href.includes('ghnewsmedia.com');
              
              if (isInternalLink) {
                // Extract the article title from the link text (remove "READ MORE:" prefix)
                const articleTitle = linkText.replace(/read more:?\s*/i, '').trim() || 'Continue reading';
                
                return (
                  <p style={{ margin: '20px 0', fontSize: '18px', lineHeight: '1.7' }}>
                    <Link 
                      href={href}
                      style={{
                        color: '#2563eb',
                        fontWeight: 'normal',
                        textDecoration: 'none',
                        fontSize: '18px'
                      }}
                    >
                      <strong style={{ color: '#111111' }}>READ MORE:</strong> <span style={{ color: '#2563eb' }}>{articleTitle}</span>
                    </Link>
                  </p>
                );
              }
            }
            
            return (
              <a 
                href={href} 
                style={{
                  color: '#1A365D',
                  textDecoration: 'underline',
                  fontSize: '18px'
                }}
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
            
            // YouTube video
            if (iframeSrc.includes('youtube.com') || iframeSrc.includes('youtu.be')) {
              const videoId = iframeSrc.includes('youtube.com/embed/') 
                ? iframeSrc.split('youtube.com/embed/')[1]?.split('?')[0]
                : iframeSrc.includes('youtu.be/')
                ? iframeSrc.split('youtu.be/')[1]?.split('?')[0]
                : null;
              
              if (videoId) {
                return (
                  <div className="my-6 sm:my-8 article-embed-container" data-platform="video" style={{ margin: '24px 0' }}>
                      <iframe
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title={iframeTitle}
                      className="absolute top-0 left-0 w-full h-full"
                      style={{ border: 'none' }}
                        frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      loading="lazy"
                      />
                  </div>
                );
              }
            } 
            // Facebook embed
            else if (iframeSrc.includes('facebook.com')) {
              return (
                <div className="my-6 sm:my-8 article-embed-container" data-platform="facebook" style={{ margin: '24px 0' }}>
                  <iframe
                    src={iframeSrc}
                    title={iframeTitle}
                    className="w-full"
                    style={{ 
                      minHeight: '400px',
                      border: 'none',
                      overflow: 'hidden'
                    }}
                    scrolling="no"
                    frameBorder="0"
                    allow="encrypted-media"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
              );
            }
            // Twitter/X embed
            else if (iframeSrc.includes('twitter.com') || iframeSrc.includes('x.com')) {
              return (
                <div className="my-6 sm:my-8 article-embed-container" data-platform="twitter" style={{ margin: '24px 0' }}>
                  <iframe
                    src={iframeSrc}
                    title={iframeTitle}
                    className="w-full"
                    style={{ 
                      minHeight: '300px',
                      border: 'none',
                      overflow: 'hidden'
                    }}
                    scrolling="no"
                    frameBorder="0"
                    allow="encrypted-media"
                    loading="lazy"
                  />
                </div>
              );
            }
            // Instagram embed
            else if (iframeSrc.includes('instagram.com')) {
              return (
                <div className="my-6 sm:my-8 article-embed-container" data-platform="instagram" style={{ margin: '24px 0' }}>
                  <iframe
                    src={iframeSrc}
                    title={iframeTitle}
                    className="w-full"
                    style={{ 
                      minHeight: '500px',
                      border: 'none',
                      overflow: 'hidden'
                    }}
                    scrolling="no"
                    frameBorder="0"
                    allow="encrypted-media"
                    loading="lazy"
                  />
                </div>
              );
            }
              // Vimeo video
            else if (iframeSrc.includes('vimeo.com')) {
              const videoId = iframeSrc.includes('vimeo.com/') ? iframeSrc.split('vimeo.com/')[1]?.split('?')[0] : null;
              
              if (videoId) {
                return (
                  <div className="my-6 sm:my-8 article-embed-container" data-platform="video" style={{ margin: '24px 0' }}>
                      <iframe
                        src={`https://player.vimeo.com/video/${videoId}`}
                        title={iframeTitle}
                      className="absolute top-0 left-0 w-full h-full"
                      style={{ border: 'none' }}
                        frameBorder="0"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                      loading="lazy"
                      />
                  </div>
                );
              }
            }
            
            // Generic iframe with responsive wrapper
            return (
              <div className="my-6 sm:my-8 article-embed-container" data-platform="video" style={{ margin: '24px 0' }}>
                  <iframe
                    src={iframeSrc}
                    title={iframeTitle}
                  className="absolute top-0 left-0 w-full h-full"
                  style={{ border: 'none' }}
                    frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  loading="lazy"
                  />
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
            
            // Check for Twitter embed blockquotes in divs
            const twitterBlockquotes = element.querySelectorAll('blockquote.twitter-tweet');
            if (twitterBlockquotes.length > 0) {
              return (
                <div className="my-6 sm:my-8" style={{ margin: '24px 0' }}>
                  {Array.from(twitterBlockquotes).map((blockquote, index) => {
                    const blockquoteProps: Record<string, string> = {};
                    Array.from(blockquote.attributes).forEach(attr => {
                      blockquoteProps[attr.name] = attr.value;
                    });
                    return (
                      <div 
                        key={index}
                        className="twitter-embed-wrapper"
                        style={{ 
                          maxWidth: '100%',
                          width: '100%',
                          overflow: 'hidden',
                          margin: '0 auto',
                          padding: '0'
                        }}
                      >
                        <blockquote 
                          {...blockquoteProps}
                          className={blockquoteProps.class || blockquoteProps.className || 'twitter-tweet'}
                          style={{ margin: 0, width: '100%', maxWidth: '100%' }}
                          dangerouslySetInnerHTML={{ __html: blockquote.innerHTML }}
                        />
                      </div>
                    );
                  })}
                </div>
              );
            }
            
            // Check for Instagram embed blockquotes in divs
            const instagramBlockquotes = element.querySelectorAll('blockquote.instagram-media');
            if (instagramBlockquotes.length > 0) {
              return (
                <div className="my-6 sm:my-8" style={{ margin: '24px 0' }}>
                  {Array.from(instagramBlockquotes).map((blockquote, index) => {
                    const blockquoteProps: Record<string, string> = {};
                    Array.from(blockquote.attributes).forEach(attr => {
                      blockquoteProps[attr.name] = attr.value;
                    });
                    return (
                      <div 
                        key={index}
                        className="instagram-embed-wrapper"
                        style={{ 
                          maxWidth: '100%',
                          width: '100%',
                          overflow: 'hidden',
                          margin: '0 auto',
                          display: 'flex',
                          justifyContent: 'center',
                          padding: '0'
                        }}
                      >
                        <blockquote 
                          {...blockquoteProps}
                          className={blockquoteProps.class || blockquoteProps.className || 'instagram-media'}
                          style={{ margin: 0, maxWidth: '540px', width: '100%', minWidth: '326px' }}
                          dangerouslySetInnerHTML={{ __html: blockquote.innerHTML }}
                        />
                      </div>
                    );
                  })}
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
          
          case 'script':
            // Ignore script tags - we load them via useEffect
            // Twitter and Instagram widget scripts are handled separately
            // Return empty string to satisfy TypeScript return type
            return '';
          
          default:
            return <div className="my-4">{children}</div>;
        }
      }
      
      return '';
    };

    // Reset paragraph count before processing
    paragraphCount = 0;
    
    // Process all child nodes and inject ads
    const processedContent: (React.ReactElement | string)[] = [];
    Array.from(tempDiv.childNodes).forEach((node, index) => {
      const result = processNode(node);
      if (Array.isArray(result)) {
        processedContent.push(...result.map((item, i) => 
          React.isValidElement(item) ? <React.Fragment key={`${index}-${i}`}>{item}</React.Fragment> : item
        ));
      } else {
        processedContent.push(
          React.isValidElement(result) ? <React.Fragment key={index}>{result}</React.Fragment> : result
        );
      }
    });

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

    // Handle Twitter embeds before regular blockquotes
    processedContent = processedContent.replace(
      /<blockquote class="twitter-tweet"([^>]*)>([\s\S]*?)<\/blockquote>\s*<script[^>]*src="https:\/\/platform\.twitter\.com\/widgets\.js"[^>]*><\/script>/gi,
      (match, attributes, content) => {
        // Extract tweet URL from content
        const urlMatch = content.match(/href="(https?:\/\/(?:twitter\.com|x\.com)\/[^"]+)"/);
        if (urlMatch) {
          return `<div class="twitter-embed-wrapper" style="max-width: 100%; overflow: hidden; margin: 24px auto;"><blockquote class="twitter-tweet"${attributes}>${content}</blockquote></div>`;
        }
        return match;
      }
    );
    
    // Handle Instagram embeds before regular blockquotes
    processedContent = processedContent.replace(
      /<blockquote class="instagram-media"([^>]*)>([\s\S]*?)<\/blockquote>\s*<script[^>]*src="[^"]*instagram\.com\/embed\.js"[^>]*><\/script>/gi,
      (match, attributes, content) => {
        return `<div class="instagram-embed-wrapper" style="max-width: 100%; overflow: hidden; margin: 24px auto; display: flex; justify-content: center;"><blockquote class="instagram-media"${attributes} style="max-width: 540px; width: 100%; margin: 0;">${content}</blockquote></div>`;
      }
    );

    processedContent = processedContent.replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-gray-300 pl-4 italic my-4">$1</blockquote>');

    processedContent = processedContent.replace(/^\- (.*$)/gim, '<li>$1</li>');
    processedContent = processedContent.replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>');
    processedContent = processedContent.replace(/<\/ul>\s*<ul>/g, '');

    processedContent = processedContent.replace(/\n\n/g, '</p><p class="mb-4">');
    processedContent = processedContent.replace(/\n/g, '<br />');

    if (processedContent && !processedContent.startsWith('<')) {
      processedContent = '<p class="mb-4">' + processedContent + '</p>';
    }
    
    // Inject READ MORE links after markdown is converted to HTML
    if (relatedArticles.length > 0) {
      processedContent = injectReadMoreLinks(processedContent);
    }

    return (
      <div
        className="prose prose-base sm:prose-lg max-w-none mb-12"
        dangerouslySetInnerHTML={{ __html: processedContent }}
      />
    );
  };

  // Function to render content with READ MORE links injected
  const renderContent = (): React.ReactElement => {
    let processedContent = content;
    
    // Inject READ MORE links if we have related articles
    if (relatedArticles.length > 0) {
      processedContent = injectReadMoreLinks(content);
    }
    
    if (isTiptapContent(processedContent)) {
      return renderTiptapContent(processedContent);
    } else {
      return renderMarkdownContent(processedContent);
    }
  };

  // Initialize AdSense ads after render
  React.useEffect(() => {
    if (typeof window === 'undefined' || !contentRef.current || !ENABLE_ADSENSE) return;
    
    // Initialize AdSense ads (for both SSR injected ads and client-side rendered ads)
    const initializeAdSense = () => {
      try {
        const adContainers = contentRef.current?.querySelectorAll('.adsbygoogle:not([data-adsbygoogle-status])');
        if (adContainers && adContainers.length > 0) {
          if ((window as any).adsbygoogle) {
            adContainers.forEach(() => {
              ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
            });
          } else {
            // Retry if AdSense script hasn't loaded yet
            setTimeout(initializeAdSense, 1000);
          }
        }
      } catch (err) {
        console.error('Error initializing AdSense:', err);
      }
    };
    
    // Initialize after a short delay to ensure AdSense script is loaded
    const timer = setTimeout(initializeAdSense, 500);
    return () => clearTimeout(timer);
  }, [content]);

  // Add classes to blockquotes after render (runs first)
  React.useEffect(() => {
    if (typeof window === 'undefined' || !contentRef.current) return;
    
    const addClassesToBlockquotes = () => {
      const searchRoot = contentRef.current || document;
      const allBlockquotes = searchRoot.querySelectorAll('blockquote');
      
      // Process Twitter blockquotes
      allBlockquotes.forEach(bq => {
        const content = bq.innerHTML || '';
        const hasClass = bq.classList.contains('twitter-tweet');
        
        if (!hasClass && (content.includes('pic.twitter.com') || 
            (content.includes('twitter.com/') && content.includes('/status/')))) {
          bq.classList.add('twitter-tweet');
          // Extract and add data-tweet-id
          const urlMatch = content.match(/https?:\/\/(?:twitter\.com|x\.com)\/[^"'\s<>]+/);
          if (urlMatch) {
            const tweetIdMatch = urlMatch[0].match(/\/status\/(\d+)/);
            if (tweetIdMatch && !bq.getAttribute('data-tweet-id')) {
              bq.setAttribute('data-tweet-id', tweetIdMatch[1]);
            }
          }
        }
      });
      
      // Process Instagram blockquotes
      allBlockquotes.forEach(bq => {
        const content = bq.innerHTML || '';
        const hasClass = bq.classList.contains('instagram-media');
        
        if (!hasClass && (content.includes('View this post on Instagram') ||
            content.includes('instagram.com/reel/') ||
            content.includes('instagram.com/p/') ||
            content.includes('instagram.com/tv/'))) {
          bq.classList.add('instagram-media');
          // Extract and add data attributes
          const urlMatch = content.match(/https?:\/\/www\.instagram\.com\/(?:reel|p|tv)\/[^"'\s<>?]+/);
          if (urlMatch && !bq.getAttribute('data-instgrm-permalink')) {
            bq.setAttribute('data-instgrm-permalink', urlMatch[0]);
          }
          if (!bq.getAttribute('data-instgrm-version')) {
            bq.setAttribute('data-instgrm-version', '14');
          }
        }
      });
    };
    
    // Run after a short delay to ensure DOM is ready
    const timer = setTimeout(addClassesToBlockquotes, 100);
    
    return () => clearTimeout(timer);
  }, [content]);

  // Load Twitter and Instagram widgets scripts and initialize embeds
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Check if content contains Twitter or Instagram embeds
    // Check by class name or by content patterns
    const hasTwitterEmbed = content.includes('twitter-tweet') || 
      content.includes('blockquote class="twitter-tweet"') ||
      content.includes('pic.twitter.com') ||
      (content.includes('twitter.com/') && content.includes('/status/'));
    
    const hasInstagramEmbed = content.includes('instagram-media') || 
      content.includes('blockquote class="instagram-media"') ||
      content.includes('View this post on Instagram') ||
      content.includes('instagram.com/reel/') ||
      content.includes('instagram.com/p/') ||
      content.includes('instagram.com/tv/');
    
    if (!hasTwitterEmbed && !hasInstagramEmbed) return;
    
    // Wait for React to finish rendering the DOM
    const initializeWidgets = () => {
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        // Double check with a small delay to ensure blockquotes are in DOM
        setTimeout(() => {
          // Load Twitter widgets script
          if (hasTwitterEmbed) {
            const loadTwitterWidgets = () => {
              // Check if blockquotes are actually in the DOM (check within contentRef if available, otherwise document)
              const searchRoot = contentRef.current || document;
              // Find blockquotes by class OR by content pattern
              let twitterBlockquotes = searchRoot.querySelectorAll('blockquote.twitter-tweet');
              // If none found by class, try finding by content
              if (twitterBlockquotes.length === 0) {
                const allBlockquotes = searchRoot.querySelectorAll('blockquote');
                const detectedBlockquotes = Array.from(allBlockquotes).filter(bq => {
                  const content = bq.innerHTML || '';
                  return content.includes('pic.twitter.com') || 
                    (content.includes('twitter.com/') && content.includes('/status/'));
                });
                // Add class and data attributes to detected blockquotes
                detectedBlockquotes.forEach(bq => {
                  if (!bq.classList.contains('twitter-tweet')) {
                    bq.classList.add('twitter-tweet');
                    // Extract tweet ID from URL if available
                    const urlMatch = bq.innerHTML.match(/https?:\/\/(?:twitter\.com|x\.com)\/[^"'\s<>]+/);
                    if (urlMatch) {
                      const tweetIdMatch = urlMatch[0].match(/\/status\/(\d+)/);
                      if (tweetIdMatch && !bq.getAttribute('data-tweet-id')) {
                        bq.setAttribute('data-tweet-id', tweetIdMatch[1]);
                      }
                    }
                  }
                });
                // Re-query after adding classes
                if (detectedBlockquotes.length > 0) {
                  twitterBlockquotes = searchRoot.querySelectorAll('blockquote.twitter-tweet');
                }
              }
              
              if (twitterBlockquotes.length === 0) {
                // Retry if blockquotes aren't ready yet (max 10 retries = 2 seconds)
                const retryCount = (loadTwitterWidgets as any).retryCount || 0;
                if (retryCount < 10) {
                  (loadTwitterWidgets as any).retryCount = retryCount + 1;
                  setTimeout(loadTwitterWidgets, 200);
                }
                return;
              }
              
              // Reset retry count
              (loadTwitterWidgets as any).retryCount = 0;
              
              // Check if Twitter widgets script is already loaded
              const existingScript = document.querySelector('script[src*="platform.twitter.com/widgets.js"]');
              
              if (!existingScript) {
                // Load the script
                const script = document.createElement('script');
                script.src = 'https://platform.twitter.com/widgets.js';
                script.async = true;
                script.charset = 'utf-8';
                script.id = 'twitter-widgets';
                document.body.appendChild(script);
                
                // Initialize Twitter widgets after script loads
                script.onload = () => {
                  // Wait for the script to fully initialize and DOM to be ready
                  const initTwitter = () => {
                    if (window.twttr && window.twttr.widgets && window.twttr.widgets.load) {
                      // Check again that blockquotes exist (by class or content)
                      let blockquotes = searchRoot.querySelectorAll('blockquote.twitter-tweet');
                      if (blockquotes.length === 0) {
                        const allBlockquotes = searchRoot.querySelectorAll('blockquote');
                        const detectedBlockquotes = Array.from(allBlockquotes).filter(bq => {
                          const content = bq.innerHTML || '';
                          return content.includes('pic.twitter.com') || 
                            (content.includes('twitter.com/') && content.includes('/status/'));
                        });
                        // Add class to detected blockquotes
                        detectedBlockquotes.forEach(bq => {
                          if (!bq.classList.contains('twitter-tweet')) {
                            bq.classList.add('twitter-tweet');
                          }
                        });
                        // Update blockquotes to include detected ones
                        if (detectedBlockquotes.length > 0) {
                          blockquotes = searchRoot.querySelectorAll('blockquote.twitter-tweet');
                        }
                      }
                      if (blockquotes.length > 0) {
                        try {
                          window.twttr.widgets.load();
                        } catch (e) {
                          console.error('Error loading Twitter widgets:', e);
                        }
                      }
                    } else if (window.twttr) {
                      // Widgets API might not be ready yet, retry
                      setTimeout(initTwitter, 200);
                    }
                  };
                  setTimeout(initTwitter, 300);
                };
              } else {
                // Script already exists, reload widgets after DOM is ready
                const reloadTwitter = () => {
                  let blockquotes = searchRoot.querySelectorAll('blockquote.twitter-tweet');
                  if (blockquotes.length === 0) {
                    const allBlockquotes = searchRoot.querySelectorAll('blockquote');
                    const detectedBlockquotes = Array.from(allBlockquotes).filter(bq => {
                      const content = bq.innerHTML || '';
                      return content.includes('pic.twitter.com') || 
                        (content.includes('twitter.com/') && content.includes('/status/'));
                    });
                    // Add class and data attributes to detected blockquotes
                    detectedBlockquotes.forEach(bq => {
                      if (!bq.classList.contains('twitter-tweet')) {
                        bq.classList.add('twitter-tweet');
                        const urlMatch = bq.innerHTML.match(/https?:\/\/(?:twitter\.com|x\.com)\/[^"'\s<>]+/);
                        if (urlMatch) {
                          const tweetIdMatch = urlMatch[0].match(/\/status\/(\d+)/);
                          if (tweetIdMatch && !bq.getAttribute('data-tweet-id')) {
                            bq.setAttribute('data-tweet-id', tweetIdMatch[1]);
                          }
                        }
                      }
                    });
                    // Re-query after adding classes
                    if (detectedBlockquotes.length > 0) {
                      blockquotes = searchRoot.querySelectorAll('blockquote.twitter-tweet');
                    }
                  }
                  if (blockquotes.length > 0 && window.twttr && window.twttr.widgets && window.twttr.widgets.load) {
                    try {
                      // Force reload by calling load() multiple times
                      window.twttr.widgets.load();
                      // Also try after a short delay to ensure DOM is ready
                      setTimeout(() => {
                        if (window.twttr && window.twttr.widgets && window.twttr.widgets.load) {
                          window.twttr.widgets.load();
                        }
                      }, 500);
                    } catch (e) {
                      console.error('Error reloading Twitter widgets:', e);
                    }
                  } else if (blockquotes.length > 0) {
                    // Script not ready yet, retry
                    setTimeout(reloadTwitter, 200);
                  } else {
                    // Blockquotes not in DOM yet, retry
                    setTimeout(reloadTwitter, 200);
                  }
                };
                setTimeout(reloadTwitter, 500);
              }
            };
            
            loadTwitterWidgets();
            
            // Also try after a longer delay as fallback (ensure classes are added)
            setTimeout(() => {
              const searchRoot = contentRef.current || document;
              // First ensure classes are added
              const allBlockquotes = searchRoot.querySelectorAll('blockquote');
              allBlockquotes.forEach(bq => {
                const content = bq.innerHTML || '';
                if (!bq.classList.contains('twitter-tweet') && 
                    (content.includes('pic.twitter.com') || 
                     (content.includes('twitter.com/') && content.includes('/status/')))) {
                  bq.classList.add('twitter-tweet');
                  const urlMatch = content.match(/https?:\/\/(?:twitter\.com|x\.com)\/[^"'\s<>]+/);
                  if (urlMatch) {
                    const tweetIdMatch = urlMatch[0].match(/\/status\/(\d+)/);
                    if (tweetIdMatch && !bq.getAttribute('data-tweet-id')) {
                      bq.setAttribute('data-tweet-id', tweetIdMatch[1]);
                    }
                  }
                }
              });
              
              const blockquotes = searchRoot.querySelectorAll('blockquote.twitter-tweet');
              if (blockquotes.length > 0 && window.twttr && window.twttr.widgets && window.twttr.widgets.load) {
                try {
                  window.twttr.widgets.load();
                  // Try again after a short delay
                  setTimeout(() => {
                    if (window.twttr && window.twttr.widgets && window.twttr.widgets.load) {
                      window.twttr.widgets.load();
                    }
                  }, 1000);
                } catch (e) {
                  console.error('Error in Twitter widgets fallback:', e);
                }
              }
            }, 2000);
          }
          
          // Load Instagram embed script
          if (hasInstagramEmbed) {
            const loadInstagramWidgets = () => {
              // Check if blockquotes are actually in the DOM
              const searchRoot = contentRef.current || document;
              // Find blockquotes by class OR by content pattern
              let instagramBlockquotes = searchRoot.querySelectorAll('blockquote.instagram-media');
              // If none found by class, try finding by content
              if (instagramBlockquotes.length === 0) {
                const allBlockquotes = searchRoot.querySelectorAll('blockquote');
                const detectedBlockquotes = Array.from(allBlockquotes).filter(bq => {
                  const content = bq.innerHTML || '';
                  return content.includes('View this post on Instagram') ||
                    content.includes('instagram.com/reel/') ||
                    content.includes('instagram.com/p/') ||
                    content.includes('instagram.com/tv/');
                });
                // Add class and data attributes to detected blockquotes
                detectedBlockquotes.forEach(bq => {
                  if (!bq.classList.contains('instagram-media')) {
                    bq.classList.add('instagram-media');
                    // Extract Instagram URL from content
                    const urlMatch = bq.innerHTML.match(/https?:\/\/www\.instagram\.com\/(?:reel|p|tv)\/[^"'\s<>?]+/);
                    if (urlMatch && !bq.getAttribute('data-instgrm-permalink')) {
                      bq.setAttribute('data-instgrm-permalink', urlMatch[0]);
                    }
                    if (!bq.getAttribute('data-instgrm-version')) {
                      bq.setAttribute('data-instgrm-version', '14');
                    }
                  }
                });
                // Update instagramBlockquotes to include detected ones
                if (detectedBlockquotes.length > 0) {
                  instagramBlockquotes = searchRoot.querySelectorAll('blockquote.instagram-media');
                }
              }
              
              if (instagramBlockquotes.length === 0) {
                // Retry if blockquotes aren't ready yet (max 10 retries = 2 seconds)
                const retryCount = (loadInstagramWidgets as any).retryCount || 0;
                if (retryCount < 10) {
                  (loadInstagramWidgets as any).retryCount = retryCount + 1;
                  setTimeout(loadInstagramWidgets, 200);
                }
                return;
              }
              
              // Reset retry count
              (loadInstagramWidgets as any).retryCount = 0;
              
              // Check if Instagram embed script is already loaded
              const existingScript = document.querySelector('script[src*="instagram.com/embed.js"]');
              
              if (!existingScript) {
                // Load the script
                const script = document.createElement('script');
                script.src = 'https://www.instagram.com/embed.js';
                script.async = true;
                script.id = 'instagram-embed';
                document.body.appendChild(script);
                
                script.onload = () => {
                  const initInstagram = () => {
                    if (window.instgrm && window.instgrm.Embeds && window.instgrm.Embeds.process) {
                      // Check again that blockquotes exist
                      const blockquotes = searchRoot.querySelectorAll('blockquote.instagram-media');
                      if (blockquotes.length > 0) {
                        try {
                          window.instgrm.Embeds.process();
                        } catch (e) {
                          console.error('Error processing Instagram embeds:', e);
                        }
                      }
                    } else if (window.instgrm) {
                      // Embeds API might not be ready yet, retry
                      setTimeout(initInstagram, 200);
                    }
                  };
                  setTimeout(initInstagram, 300);
                };
              } else {
                // Script already exists, process embeds
                const processInstagram = () => {
                  let blockquotes = searchRoot.querySelectorAll('blockquote.instagram-media');
                  if (blockquotes.length === 0) {
                    const allBlockquotes = searchRoot.querySelectorAll('blockquote');
                    const detectedBlockquotes = Array.from(allBlockquotes).filter(bq => {
                      const content = bq.innerHTML || '';
                      return content.includes('View this post on Instagram') ||
                        content.includes('instagram.com/reel/') ||
                        content.includes('instagram.com/p/') ||
                        content.includes('instagram.com/tv/');
                    });
                    // Add class and data attributes to detected blockquotes
                    detectedBlockquotes.forEach(bq => {
                      if (!bq.classList.contains('instagram-media')) {
                        bq.classList.add('instagram-media');
                        const urlMatch = bq.innerHTML.match(/https?:\/\/www\.instagram\.com\/(?:reel|p|tv)\/[^"'\s<>?]+/);
                        if (urlMatch && !bq.getAttribute('data-instgrm-permalink')) {
                          bq.setAttribute('data-instgrm-permalink', urlMatch[0]);
                        }
                        if (!bq.getAttribute('data-instgrm-version')) {
                          bq.setAttribute('data-instgrm-version', '14');
                        }
                      }
                    });
                    // Re-query after adding classes
                    if (detectedBlockquotes.length > 0) {
                      blockquotes = searchRoot.querySelectorAll('blockquote.instagram-media');
                    }
                  }
                  if (blockquotes.length > 0 && window.instgrm && window.instgrm.Embeds && window.instgrm.Embeds.process) {
                    try {
                      // Force process by calling process() multiple times
                      window.instgrm.Embeds.process();
                      // Also try after a short delay to ensure DOM is ready
                      setTimeout(() => {
                        if (window.instgrm && window.instgrm.Embeds && window.instgrm.Embeds.process) {
                          window.instgrm.Embeds.process();
                        }
                      }, 500);
                    } catch (e) {
                      console.error('Error processing Instagram embeds:', e);
                    }
                  } else if (blockquotes.length > 0) {
                    // Script not ready yet, retry
                    setTimeout(processInstagram, 200);
                  } else {
                    // Blockquotes not in DOM yet, retry
                    setTimeout(processInstagram, 200);
                  }
                };
                setTimeout(processInstagram, 500);
              }
            };
            
            loadInstagramWidgets();
            
            // Also try after a longer delay as fallback (ensure classes are added)
            setTimeout(() => {
              const searchRoot = contentRef.current || document;
              // First ensure classes are added
              const allBlockquotes = searchRoot.querySelectorAll('blockquote');
              allBlockquotes.forEach(bq => {
                const content = bq.innerHTML || '';
                if (!bq.classList.contains('instagram-media') && 
                    (content.includes('View this post on Instagram') ||
                     content.includes('instagram.com/reel/') ||
                     content.includes('instagram.com/p/') ||
                     content.includes('instagram.com/tv/'))) {
                  bq.classList.add('instagram-media');
                  const urlMatch = content.match(/https?:\/\/www\.instagram\.com\/(?:reel|p|tv)\/[^"'\s<>?]+/);
                  if (urlMatch && !bq.getAttribute('data-instgrm-permalink')) {
                    bq.setAttribute('data-instgrm-permalink', urlMatch[0]);
                  }
                  if (!bq.getAttribute('data-instgrm-version')) {
                    bq.setAttribute('data-instgrm-version', '14');
                  }
                }
              });
              
              const blockquotes = searchRoot.querySelectorAll('blockquote.instagram-media');
              if (blockquotes.length > 0 && window.instgrm && window.instgrm.Embeds && window.instgrm.Embeds.process) {
                try {
                  window.instgrm.Embeds.process();
                  // Try again after a short delay
                  setTimeout(() => {
                    if (window.instgrm && window.instgrm.Embeds && window.instgrm.Embeds.process) {
                      window.instgrm.Embeds.process();
                    }
                  }, 1000);
                } catch (e) {
                  console.error('Error in Instagram embeds fallback:', e);
                }
              }
            }, 2000);
          }
        }, 100);
      });
    };
    
    // Initialize after a delay to ensure classes are added first (increased delay)
    const timer = setTimeout(initializeWidgets, 800);
    
    return () => {
      clearTimeout(timer);
    };
  }, [content]);

  return (
    <div ref={contentRef}>
      <style jsx global>{`
        /* Ensure paragraphs are properly styled on SSR */
        [data-article-content] p,
        [data-article-content] p:not([style*="font-size"]) {
          color: #111111 !important;
          font-size: 18px !important;
          line-height: 1.7 !important;
          margin: 20px 0 !important;
        }
        
        [data-article-content] li,
        [data-article-content] li:not([style*="font-size"]) {
          font-size: 18px !important;
          line-height: 1.7 !important;
          margin-bottom: 0.5rem !important;
        }
        
        [data-article-content] a:not([style*="font-size"]) {
          font-size: 18px !important;
        }
        
        /* Responsive iframe styles for all embeds */
        .article-embed-container {
          position: relative;
          width: 100%;
          overflow: hidden;
        }
        
        .article-embed-container iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: none;
        }
        
        /* Facebook embed responsive */
        .article-embed-container[data-platform="facebook"] {
          min-height: 400px;
          width: 100%;
          max-width: 100%;
        }
        
        @media (max-width: 640px) {
          .article-embed-container[data-platform="facebook"] {
            min-height: 300px;
            width: 100% !important;
            max-width: 100% !important;
          }
          
          .article-embed-container[data-platform="facebook"] iframe {
            width: 100% !important;
            max-width: 100% !important;
            min-width: 100% !important;
          }
        }
        
        /* Twitter embed responsive */
        .article-embed-container[data-platform="twitter"],
        .twitter-embed-wrapper {
          max-width: 100%;
          width: 100%;
          overflow: hidden;
          margin: 0 auto;
          box-sizing: border-box;
        }
        
        .twitter-embed-wrapper blockquote.twitter-tweet {
          margin: 0 !important;
          max-width: 100% !important;
          width: 100% !important;
          box-sizing: border-box;
        }
        
        /* Ensure Twitter widget-generated iframes are responsive */
        .twitter-embed-wrapper iframe,
        .twitter-embed-wrapper > div iframe {
          max-width: 100% !important;
          width: 100% !important;
        }
        
        /* Instagram embed responsive */
        .instagram-embed-wrapper {
          max-width: 100%;
          width: 100%;
          overflow: hidden;
          margin: 0 auto;
          display: flex;
          justify-content: center;
          box-sizing: border-box;
        }
        
        .instagram-embed-wrapper blockquote.instagram-media {
          margin: 0 !important;
          max-width: 540px !important;
          width: 100% !important;
          min-width: 326px !important;
          box-sizing: border-box;
        }
        
        /* Ensure Instagram widget-generated iframes are responsive */
        .instagram-embed-wrapper iframe,
        .instagram-embed-wrapper > div iframe {
          max-width: 100% !important;
          width: 100% !important;
        }
        
        @media (max-width: 640px) {
          .article-embed-container[data-platform="twitter"] {
            min-height: 250px;
          }
          
          .twitter-embed-wrapper {
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 auto !important;
            overflow-x: hidden !important;
          }
          
          .twitter-embed-wrapper blockquote.twitter-tweet {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            font-size: 14px !important;
          }
          
          /* Ensure Twitter widget iframe is responsive */
          .twitter-embed-wrapper iframe {
            max-width: 100% !important;
            width: 100% !important;
          }
          
          .instagram-embed-wrapper {
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 auto !important;
            display: flex !important;
            justify-content: center !important;
            overflow-x: hidden !important;
          }
          
          .instagram-embed-wrapper blockquote.instagram-media {
            min-width: 100% !important;
            max-width: 100% !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          
          /* Ensure Instagram widget iframe is responsive */
          .instagram-embed-wrapper iframe {
            max-width: 100% !important;
            width: 100% !important;
            min-width: 100% !important;
          }
        }
        
        /* Instagram embed responsive */
        .article-embed-container[data-platform="instagram"] {
          min-height: 500px;
        }
        
        @media (max-width: 640px) {
          .article-embed-container[data-platform="instagram"] {
            min-height: 400px;
          }
        }
        
        /* Video embed responsive (YouTube, Vimeo) */
        .article-embed-container[data-platform="video"] {
          position: relative;
          padding-bottom: 56.25%; /* 16:9 aspect ratio */
          height: 0;
        }
      `}</style>
      <div style={{ fontFamily: "'Inter', 'Source Sans 3', system-ui, sans-serif" }}>
        {/* Featured Image - Pulse Style */}
        {featuredImage && (
          <div className="mb-6 sm:mb-8">
            <img
              src={featuredImage}
              alt="Featured"
              className="w-full h-auto"
              style={{ maxHeight: '500px', objectFit: 'cover' }}
            />
            {featuredImageCredit && (
              <p style={{ 
                color: '#6B7280', 
                fontSize: '11px', 
                marginTop: '8px',
                textAlign: 'center',
                fontStyle: 'italic'
              }}>
                {featuredImageCredit}
              </p>
            )}
          </div>
        )}
      
        {/* Article Content - Pulse Style */}
        <div 
          data-article-content
          className="text-base sm:text-lg"
          style={{ 
            color: '#111111', 
            fontSize: '18px', 
            lineHeight: '1.7',
            wordWrap: 'break-word'
          }}
        >
      {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default ArticleContent;
