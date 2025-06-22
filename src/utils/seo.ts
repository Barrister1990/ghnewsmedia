import SEOService from '../services/seoService';
import { NewsArticle } from '../types/news';

const seoService = SEOService.getInstance();

export const generateArticleStructuredData = (article: NewsArticle) => {
  return seoService.generateEnhancedStructuredData(article);
};

export const generateOrganizationStructuredData = () => {
  return seoService.generateOrganizationData();
};

export const generateWebSiteStructuredData = () => {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "GhNewsMedia",
    "alternateName": "Ghana News Media",
    "url": "https://ghnewsmedia.com",
    "description": "Ghana's trusted source for breaking news, politics, business, sports, and entertainment.",
    "inLanguage": "en-GB",
    "potentialAction": [
      {
        "@type": "SearchAction",
        "target": "https://ghnewsmedia.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      },
      {
        "@type": "ReadAction",
        "target": "https://ghnewsmedia.com/news/{article_slug}",
        "object": {
          "@type": "NewsArticle"
        }
      }
    ],
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": [
        {
          "@type": "SiteNavigationElement",
          "name": "Politics",
          "url": "https://ghnewsmedia.com/category/politics"
        },
        {
          "@type": "SiteNavigationElement", 
          "name": "Business",
          "url": "https://ghnewsmedia.com/category/business"
        },
        {
          "@type": "SiteNavigationElement",
          "name": "Sports", 
          "url": "https://ghnewsmedia.com/category/sports"
        }
      ]
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
  const siteName = 'GhNewsMedia';
  if (category) {
    return `${title} - ${category} News | ${siteName}`;
  }
  return `${title} | ${siteName} - Ghana's Premier News Source`;
};

export const generateMetaDescription = (excerpt: string, category?: string): string => {
  const baseDescription = truncateDescription(excerpt);
  if (category) {
    return `${baseDescription} | Latest ${category} news from Ghana's trusted source.`;
  }
  return `${baseDescription} | GhNewsMedia - Your trusted source for Ghana news.`;
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

export const notifySearchEnginesOfNewContent = async (articleSlug: string) => {
  const articleUrl = `https://ghnewsmedia.com/news/${articleSlug}`;
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
  const articleUrl = `${siteUrl}/news/${article.slug}`;
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
    'og:site_name': 'GhNewsMedia',
    
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