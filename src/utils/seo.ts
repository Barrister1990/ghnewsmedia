import SEOService from '../services/seoService';
import { NewsArticle } from '../types/news';

const seoService = SEOService.getInstance();

export const generateArticleStructuredData = (article: NewsArticle) => {
  return seoService.generateEnhancedStructuredData(article);
};

export const generateOrganizationStructuredData = () => {
  return seoService.generateOrganizationData();
};

export const generateWebSiteStructuredData = (categories?: Array<{name: string, slug: string}>) => {
  // Default main navigation items (matching Header.tsx menuItems)
  const defaultNavItems = [
    { name: 'News', slug: 'news' },
    { name: 'Entertainment', slug: 'entertainment' },
    { name: 'Sports', slug: 'sports' },
    { name: 'Business', slug: 'business' },
    { name: 'Lifestyle', slug: 'lifestyle' },
    { name: 'Tech', slug: 'tech' },
    { name: 'Features', slug: 'features' },
    { name: 'Opinions', slug: 'opinions' },
  ];

  // Use provided categories or default navigation
  const navItems = categories && categories.length > 0 
    ? categories.slice(0, 8) // Limit to 8 for sitelinks
    : defaultNavItems;

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "GH News",
    "alternateName": "Ghana's Digital News Platform",
    "url": "https://ghnewsmedia.com",
    "description": "Ghana's trusted source for breaking news, politics, business, sports, and entertainment.",
    "inLanguage": "en-GB",
    "potentialAction": [
      {
        "@type": "SearchAction",
        "target": "https://ghnewsmedia.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    ],
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": navItems.map((item, index) => ({
        "@type": "SiteNavigationElement",
        "position": index + 1,
        "name": item.name,
        "url": `https://ghnewsmedia.com/${item.slug}`
      }))
    }
  };
};

export const generateBreadcrumbStructuredData = (items: Array<{name: string, url?: string}>) => {
  return seoService.generateBreadcrumbData(items);
};

// Truncate description to 150-160 characters (920 pixels) for optimal display
export const truncateDescription = (text: string, maxLength: number = 155): string => {
  if (!text) return '';
  const cleaned = text.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  if (cleaned.length <= maxLength) return cleaned;
  // Try to truncate at word boundary
  const truncated = cleaned.substring(0, maxLength - 3);
  const lastSpace = truncated.lastIndexOf(' ');
  if (lastSpace > maxLength * 0.7) { // Only use word boundary if it's not too early
    return `${truncated.substring(0, lastSpace).trim()}...`;
  }
  return `${truncated.trim()}...`;
};

// Truncate title to 50-60 characters (580 pixels) for optimal Google display
export const truncateTitle = (title: string, maxLength: number = 55): string => {
  if (!title) return '';
  if (title.length <= maxLength) return title;
  // Try to truncate at word boundary
  const truncated = title.substring(0, maxLength - 3);
  const lastSpace = truncated.lastIndexOf(' ');
  if (lastSpace > maxLength * 0.7) { // Only use word boundary if it's not too early
    return `${truncated.substring(0, lastSpace)}...`;
  }
  return `${truncated.trim()}...`;
};

export const generateMetaTitle = (title: string, category?: string): string => {
  const siteName = 'GH News';
  // Remove any existing site name or "|" suffix to avoid duplication
  const cleanTitle = title.replace(/\s*\|\s*GhNewsMedia\s*$/i, '').replace(/\s*\|\s*GH News\s*$/i, '').trim();
  
  // Build title with proper truncation to stay within 50-60 characters (580 pixels)
  let fullTitle: string;
  if (category) {
    const categorySuffix = ` | ${category} | ${siteName}`;
    const reservedLength = categorySuffix.length;
    const maxTitleLength = 55 - reservedLength;
    const truncatedTitle = truncateTitle(cleanTitle, maxTitleLength);
    fullTitle = `${truncatedTitle}${categorySuffix}`;
  } else {
    const suffix = ` | ${siteName}`;
    const maxTitleLength = 55 - suffix.length;
    const truncatedTitle = truncateTitle(cleanTitle, maxTitleLength);
    fullTitle = `${truncatedTitle}${suffix}`;
  }
  
  // Final check: ensure total title doesn't exceed 60 characters
  if (fullTitle.length > 60) {
    // Fallback to shorter format
    const truncatedTitle = truncateTitle(cleanTitle, 40);
    return `${truncatedTitle} | ${siteName}`;
  }
  
  return fullTitle;
};

export const generateMetaDescription = (excerpt: string, category?: string): string => {
  // Base description should be 150-160 characters max
  const baseDescription = truncateDescription(excerpt, 155);
  
  // If adding category info would exceed limit, just return base description
  if (category) {
    const categorySuffix = ` | Latest ${category} news from Ghana's trusted source.`;
    const combined = `${baseDescription}${categorySuffix}`;
    if (combined.length <= 160) {
      return combined;
    }
  }
  
  // Return base description if adding suffix would exceed limit
  return baseDescription;
};

// Enhanced image optimization for social media sharing
export const optimizeImageForSEO = (imageUrl: string, _title: string): string => {
  if (!imageUrl) {
    return 'https://ghnewsmedia.com/og-image.jpg';
  }
  
  // If it's already a full URL, return as is
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  // If it's a relative URL, make it absolute
  if (imageUrl.startsWith('/')) {
    return `https://ghnewsmedia.com${imageUrl}`;
  }
  
  // Add optimization parameters for better social media display
  if (imageUrl.includes('supabase') || imageUrl.includes('unsplash')) {
    return `${imageUrl}?w=1200&h=630&fit=crop&q=85`;
  }
  
  return imageUrl;
};

export const generateArticleSchema = (article: NewsArticle) => {
  return generateArticleStructuredData(article);
};

// Helper function to generate article URL with category
export const getArticleUrl = (article: { slug: string; category: { slug: string } }): string => {
  return `https://ghnewsmedia.com/${article.category.slug}/${article.slug}`;
};

// Helper function to generate article URL path (without domain)
export const getArticlePath = (article: { slug: string; category: { slug: string } }): string => {
  return `/${article.category.slug}/${article.slug}`;
};

export const notifySearchEnginesOfNewContent = async (articleSlug: string, categorySlug: string) => {
  const articleUrl = `https://ghnewsmedia.com/${categorySlug}/${articleSlug}`;
  const sitemapUrl = 'https://ghnewsmedia.com/sitemap.xml';
  
  try {
    await seoService.notifySearchEngines(sitemapUrl);
    console.log(`Search engines notified of new article: ${articleUrl}`);
  } catch (error) {
    console.error('Failed to notify search engines:', error);
  }
};

// Generate social media preview tags specifically for WhatsApp and other messaging apps
export const generateSocialPreviewTags = (article: NewsArticle) => {
  const siteUrl = 'https://ghnewsmedia.com';
  const articleUrl = getArticleUrl(article);
  const optimizedImage = optimizeImageForSEO(article.featuredImage, article.title);
  const description = truncateDescription(article.excerpt || article.content.replace(/<[^>]*>/g, ''));

  return {
    // Primary Open Graph tags
    'og:type': 'article',
    'og:title': article.title,
    'og:description': description,
    'og:image': optimizedImage,
    'og:image:width': '1200',
    'og:image:height': '630',
    'og:image:alt': article.title,
    'og:url': articleUrl,
    'og:site_name': 'GH News',
    
    // Twitter Cards
    'twitter:card': 'summary_large_image',
    'twitter:title': article.title,
    'twitter:description': description,
    'twitter:image': optimizedImage,
    
    // WhatsApp specific (uses Open Graph)
    'og:image:type': 'image/jpeg',
    'og:image:secure_url': optimizedImage,
    
    // Article specific
    'article:published_time': article.publishedAt,
    'article:author': article.author.name,
    'article:section': article.category.name,
    'article:tag': article.tags.join(', ')
  };
};