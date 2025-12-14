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

export const truncateDescription = (text: string, maxLength: number = 160): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3).trim() + '...';
};

export const generateMetaTitle = (title: string, category?: string): string => {
  const siteName = 'GH News';
  // Remove any existing site name or "|" suffix to avoid duplication
  const cleanTitle = title.replace(/\s*\|\s*GhNewsMedia\s*$/i, '').replace(/\s*\|\s*GH News\s*$/i, '').trim();
  if (category) {
    return `${cleanTitle} | ${siteName}`;
  }
  return `${cleanTitle} | ${siteName}`;
};

export const generateMetaDescription = (excerpt: string, category?: string): string => {
  const baseDescription = truncateDescription(excerpt);
  if (category) {
    return `${baseDescription} | Latest ${category} news from Ghana's trusted source.`;
  }
  return `${baseDescription} | GH News - Your trusted source for Ghana news.`;
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