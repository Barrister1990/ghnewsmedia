import { NewsArticle } from '../types/news';

class AdvancedSEOService {
  private static instance: AdvancedSEOService;
  private readonly baseUrl = 'https://ghnewsmedia.com';
  private readonly siteName = 'GH News Media';

  static getInstance(): AdvancedSEOService {
    if (!AdvancedSEOService.instance) {
      AdvancedSEOService.instance = new AdvancedSEOService();
    }
    return AdvancedSEOService.instance;
  }

  // Immediately notify search engines when new content is published
  async notifySearchEnginesOfNewArticle(article: NewsArticle): Promise<void> {
    const articleUrl = `${this.baseUrl}/${article.category.slug}/${article.slug}`;
    
    try {
      // Google Indexing API (requires authentication in production)
      await this.submitToGoogleIndexing(articleUrl);
      
      // Bing URL Submission API
      await this.submitToBingIndexing(articleUrl);
      
      // Update sitemap and notify search engines
      await this.updateSitemapAndNotify();
      
      console.log(`Successfully notified search engines about new article: ${articleUrl}`);
    } catch (error) {
      console.error('Error notifying search engines:', error);
    }
  }

  private async submitToGoogleIndexing(_url: string): Promise<void> {
    // In production, this would use Google Indexing API with proper authentication
    // For now, we'll use the sitemap ping method
    try {
      const pingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(this.baseUrl + '/sitemap.xml')}`;
      fetch(pingUrl, { method: 'GET', mode: 'no-cors' });
    } catch (error) {
      console.error('Google indexing notification failed:', error);
    }
  }

  private async submitToBingIndexing(_url: string): Promise<void> {
    // Bing ping endpoint
    try {
      const pingUrl = `https://www.bing.com/ping?sitemap=${encodeURIComponent(this.baseUrl + '/sitemap.xml')}`;
      fetch(pingUrl, { method: 'GET', mode: 'no-cors' });
    } catch (error) {
      console.error('Bing indexing notification failed:', error);
    }
  }

  private async updateSitemapAndNotify(): Promise<void> {
    // This would trigger sitemap regeneration in production
    console.log('Sitemap update triggered');
  }

  // Generate enhanced structured data for better search visibility (single NewsArticle per page).
  // Dates in ISO 8601 for Google News. Speakable matches ArticleContent wrapper: [data-article-content].
  generateAdvancedArticleSchema(article: NewsArticle) {
    const articleUrl = `${this.baseUrl}/${article.category.slug}/${article.slug}`;
    const imageUrl = this.optimizeImageForSEO(article.featuredImage, article.title);
    const datePublished = new Date(article.publishedAt).toISOString();
    const dateModified = new Date(article.updatedAt || article.publishedAt).toISOString();

    const authorSchema: Record<string, string> = {
      "@type": "Person",
      "name": article.author.name,
      "image": article.author.avatar
    };

    if (article.author.id) {
      authorSchema.url = `${this.baseUrl}/author/${article.author.id}`;
    }

    return {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "@id": articleUrl,
      "headline": article.title,
      "alternativeHeadline": article.excerpt,
      "description": this.cleanDescription(article.excerpt || article.content),
      "image": {
        "@type": "ImageObject",
        "url": imageUrl,
        "width": 1200,
        "height": 630,
        "caption": article.title
      },
      "datePublished": datePublished,
      "dateModified": dateModified,
      "author": authorSchema,
      "publisher": {
        "@type": "NewsMediaOrganization",
        "name": this.siteName,
        "url": this.baseUrl,
        "logo": {
          "@type": "ImageObject",
          "url": `${this.baseUrl}/logo.png`,
          "width": 600,
          "height": 60
        },
        "sameAs": [
          "https://twitter.com/ghnewsmedia",
          "https://facebook.com/ghnewsmedia",
          "https://instagram.com/ghnewsmedia",
          "https://linkedin.com/company/ghnewsmedia"
        ]
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": articleUrl
      },
      "articleSection": article.category.name,
      "keywords": (article.tags || []).join(', '),
      "wordCount": this.getWordCount(article.content),
      "timeRequired": `PT${Math.max(1, article.readTime || 1)}M`,
      "inLanguage": "en-GB",
      "isAccessibleForFree": true,
      "url": articleUrl,
      "thumbnailUrl": imageUrl,
      "speakable": {
        "@type": "SpeakableSpecification",
        "cssSelector": ["h1", "[data-article-content] p"]
      },
      "contentLocation": {
        "@type": "Place",
        "name": "Ghana",
        "addressCountry": "GH"
      }
    };
  }

  // Optimize images for social media and search
  optimizeImageForSEO(imageUrl: string, _title: string): string {
    if (!imageUrl) {
      return `${this.baseUrl}/og-default.jpg`;
    }
    
    // If it's already a full URL, return as is
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    
    // If it's a relative URL, make it absolute
    if (imageUrl.startsWith('/')) {
      return `${this.baseUrl}${imageUrl}`;
    }
    
    // Add optimization parameters for better social media display
    if (imageUrl.includes('supabase') || imageUrl.includes('unsplash')) {
      return `${imageUrl}?w=1200&h=630&fit=crop&q=90&fm=jpg`;
    }
    
    return imageUrl;
  }

  // Generate social media meta tags optimized for each platform
  generateSocialMediaTags(article: NewsArticle) {
    const articleUrl = `${this.baseUrl}/${article.category.slug}/${article.slug}`;
    const optimizedImage = this.optimizeImageForSEO(article.featuredImage, article.title);
    const description = this.cleanDescription(article.excerpt || article.content);
    // Truncate title to 50-60 characters (580 pixels) for optimal display
    const title = this.truncateTitle(article.title, 55);

    return {
      // Open Graph (Facebook, LinkedIn, WhatsApp)
      'og:type': 'article',
      'og:title': title,
      'og:description': description,
      'og:image': optimizedImage,
      'og:image:width': '1200',
      'og:image:height': '630',
      'og:image:alt': article.title,
      'og:image:type': 'image/jpeg',
      'og:image:secure_url': optimizedImage,
      'og:url': articleUrl,
      'og:site_name': this.siteName,
      'og:locale': 'en_GB',
      
      // Article specific (ISO 8601 for Google News)
      'article:published_time': new Date(article.publishedAt).toISOString(),
      'article:modified_time': new Date(article.updatedAt || article.publishedAt).toISOString(),
      'article:author': article.author.name,
      'article:section': article.category.name,
      'article:publisher': this.baseUrl,
      'article:tag': article.tags.join(', '),
      
      // Twitter Cards
      'twitter:card': 'summary_large_image',
      'twitter:title': title,
      'twitter:description': description,
      'twitter:image': optimizedImage,
      'twitter:image:alt': article.title,
      'twitter:site': '@GhNewsMedia',
      'twitter:creator': '@GhNewsMedia',
      'twitter:url': articleUrl,
      
      // LinkedIn specific
      'linkedin:title': title,
      'linkedin:description': description,
      'linkedin:image': optimizedImage
    };
  }

  private cleanDescription(text: string): string {
    // Remove HTML tags and clean up the description
    // Target: 150-160 characters (920 pixels) for optimal display
    const cleaned = text.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    const maxLength = 155; // Slightly under 160 to account for ellipsis and ensure no truncation
    return cleaned.length > maxLength ? `${cleaned.substring(0, maxLength - 3).trim()}...` : cleaned;
  }
  
  // Truncate title to 50-60 characters (580 pixels) for optimal Google display
  private truncateTitle(title: string, maxLength: number = 55): string {
    if (title.length <= maxLength) return title;
    // Try to truncate at word boundary
    const truncated = title.substring(0, maxLength - 3);
    const lastSpace = truncated.lastIndexOf(' ');
    if (lastSpace > maxLength * 0.7) { // Only use word boundary if it's not too early
      return `${truncated.substring(0, lastSpace)}...`;
    }
    return `${truncated.trim()}...`;
  }

  private getWordCount(content: string): number {
    return content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  }

  // Generate comprehensive meta tags for search engines
  generateSearchMetaTags(article: NewsArticle) {
    const articleUrl = `${this.baseUrl}/${article.category.slug}/${article.slug}`;
    const description = this.cleanDescription(article.excerpt || article.content);
    
    // Article template from SEO roadmap: [Article Headline] | GH News Media
    const siteSuffix = ` | ${this.siteName}`;
    const maxTitleLength = Math.max(20, 60 - siteSuffix.length);
    const truncatedTitle = this.truncateTitle(article.title, maxTitleLength);
    const finalTitle = `${truncatedTitle}${siteSuffix}`;
    
    return {
      'title': finalTitle,
      'description': description,
      'keywords': [...article.tags, article.category.name, 'Ghana news', 'breaking news'].join(', '),
      'canonical': articleUrl,
      'robots': 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
      'googlebot': 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
      'news_keywords': article.tags.join(', '),
      'article:author': article.author.name,
      'geo.region': 'GH',
      'geo.country': 'Ghana',
      'language': 'en-GB',
      'content-language': 'en-GB'
    };
  }
}

export default AdvancedSEOService;