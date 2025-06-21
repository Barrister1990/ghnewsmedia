
import { NewsArticle } from '../types/news';

class AdvancedSEOService {
  private static instance: AdvancedSEOService;
  private readonly baseUrl = 'https://ghnewsmedia.com';

  static getInstance(): AdvancedSEOService {
    if (!AdvancedSEOService.instance) {
      AdvancedSEOService.instance = new AdvancedSEOService();
    }
    return AdvancedSEOService.instance;
  }

  // Immediately notify search engines when new content is published
  async notifySearchEnginesOfNewArticle(article: NewsArticle): Promise<void> {
    const articleUrl = `${this.baseUrl}/news/${article.slug}`;
    
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

  private async submitToGoogleIndexing(url: string): Promise<void> {
    // In production, this would use Google Indexing API with proper authentication
    // For now, we'll use the sitemap ping method
    try {
      const pingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(this.baseUrl + '/sitemap.xml')}`;
      fetch(pingUrl, { method: 'GET', mode: 'no-cors' });
    } catch (error) {
      console.error('Google indexing notification failed:', error);
    }
  }

  private async submitToBingIndexing(url: string): Promise<void> {
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

  // Generate enhanced structured data for better search visibility
  generateAdvancedArticleSchema(article: NewsArticle) {
    const articleUrl = `${this.baseUrl}/news/${article.slug}`;
    const imageUrl = this.optimizeImageForSEO(article.featuredImage, article.title);
    
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
      "datePublished": article.publishedAt,
      "dateModified": article.updatedAt,
      "author": {
        "@type": "Person",
        "name": article.author.name,
        "url": `${this.baseUrl}/author/${article.author.id}`,
        "image": article.author.avatar
      },
      "publisher": {
        "@type": "NewsMediaOrganization",
        "name": "GhNewsMedia",
        "url": this.baseUrl,
        "logo": {
          "@type": "ImageObject",
          "url": `${this.baseUrl}/logo-structured-data.png`,
          "width": 600,
          "height": 60
        },
        "sameAs": [
          "https://twitter.com/GhNewsMedia",
          "https://facebook.com/GhNewsMedia",
          "https://linkedin.com/company/ghnewsmedia"
        ]
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": articleUrl
      },
      "articleSection": article.category.name,
      "keywords": article.tags.join(', '),
      "wordCount": this.getWordCount(article.content),
      "timeRequired": `PT${article.readTime}M`,
      "inLanguage": "en-GB",
      "isAccessibleForFree": true,
      "url": articleUrl,
      "thumbnailUrl": imageUrl,
      "speakable": {
        "@type": "SpeakableSpecification",
        "cssSelector": ["h1", ".article-content p"]
      }
    };
  }

  // Optimize images for social media and search
  optimizeImageForSEO(imageUrl: string, title: string): string {
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
    const articleUrl = `${this.baseUrl}/news/${article.slug}`;
    const optimizedImage = this.optimizeImageForSEO(article.featuredImage, article.title);
    const description = this.cleanDescription(article.excerpt || article.content);
    const title = article.title.length > 60 ? `${article.title.substring(0, 57)}...` : article.title;

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
      'og:site_name': 'GhNewsMedia',
      'og:locale': 'en_GB',
      
      // Article specific
      'article:published_time': article.publishedAt,
      'article:modified_time': article.updatedAt,
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
    const cleaned = text.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    return cleaned.length > 160 ? `${cleaned.substring(0, 157)}...` : cleaned;
  }

  private getWordCount(content: string): number {
    return content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  }

  // Generate comprehensive meta tags for search engines
  generateSearchMetaTags(article: NewsArticle) {
    const articleUrl = `${this.baseUrl}/news/${article.slug}`;
    const description = this.cleanDescription(article.excerpt || article.content);
    
    return {
      'title': `${article.title} | ${article.category.name} | GhNewsMedia`,
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
