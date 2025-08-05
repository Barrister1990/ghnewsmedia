import fs from 'fs/promises';
import { JWT } from 'google-auth-library';
import { google } from 'googleapis';
import path from 'path';
import { NewsArticle } from '../types/news';

interface SEOConfig {
  googleServiceAccountPath?: string;
  googleServiceAccountJson?: string; // New option for base64 JSON string
  bingApiKey?: string;
  enableIndexingAPI: boolean;
  enableSitemapPing: boolean;
  maxRetries: number;
  retryDelay: number;
}

interface IndexingResult {
  success: boolean;
  service: string;
  error?: string;
  response?: any;
}

class AdvancedSEOService {
  private static instance: AdvancedSEOService;
  private readonly baseUrl: string;
  private readonly config: SEOConfig;
  private jwtClient: JWT | null = null;
  private isJWTAuthenticated = false;

  constructor(baseUrl?: string, config?: Partial<SEOConfig>) {
    this.baseUrl = baseUrl || process.env.BASE_URL || 'https://ghnewsmedia.com';
    this.config = {
      googleServiceAccountPath: process.env.GOOGLE_SERVICE_ACCOUNT_PATH || 'google-service-account.json',
      googleServiceAccountJson: process.env.GOOGLE_SERVICE_ACCOUNT_JSON, // Base64 encoded JSON
      bingApiKey: process.env.BING_WEBMASTER_API_KEY,
      enableIndexingAPI: process.env.NODE_ENV === 'production',
      enableSitemapPing: true,
      maxRetries: 3,
      retryDelay: 2000,
      ...config
    };
  }

  static getInstance(baseUrl?: string, config?: Partial<SEOConfig>): AdvancedSEOService {
    if (!AdvancedSEOService.instance) {
      AdvancedSEOService.instance = new AdvancedSEOService(baseUrl, config);
    }
    return AdvancedSEOService.instance;
  }

  /**
   * Initialize JWT client for Google Indexing API
   */
  private async initializeJWTClient(): Promise<boolean> {
    if (this.isJWTAuthenticated && this.jwtClient) {
      return true;
    }

    try {
      let keyFile: any;

      // Method 1: Use base64 JSON from environment variable (recommended)
      if (this.config.googleServiceAccountJson) {
        try {
          // Decode base64 to get JSON string
          const jsonString = Buffer.from(this.config.googleServiceAccountJson, 'base64').toString('utf8');
          keyFile = JSON.parse(jsonString);
          console.log('✅ Using Google service account from environment variable');
          console.log(`   Project ID: ${keyFile.project_id}`);
          console.log(`   Client Email: ${keyFile.client_email}`);
        } catch (error) {
          console.error('❌ Failed to parse service account JSON from environment:', error);
          throw error;
        }
      }
      // Method 2: Use JSON file path (fallback)
      else if (this.config.googleServiceAccountPath) {
        const keyFilePath = path.resolve(this.config.googleServiceAccountPath);
        
        try {
          await fs.access(keyFilePath);
          const keyFileContent = await fs.readFile(keyFilePath, 'utf8');
          keyFile = JSON.parse(keyFileContent);
          console.log('✅ Using Google service account from file:', keyFilePath);
        } catch (error) {
          console.warn('⚠️ Google service account file not found:', keyFilePath);
          return false;
        }
      } else {
        console.warn('⚠️ No Google service account configuration found');
        return false;
      }

      // Validate required fields
      if (!keyFile.client_email || !keyFile.private_key) {
        throw new Error('Invalid service account: missing client_email or private_key');
      }

      this.jwtClient = new JWT({
        email: keyFile.client_email,
        key: keyFile.private_key,
        scopes: ['https://www.googleapis.com/auth/indexing'],
      });

      // Test authentication
      await this.jwtClient.authorize();
      this.isJWTAuthenticated = true;
      
      console.log('✅ Google Indexing API initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Google Indexing API:', error);
      this.jwtClient = null;
      this.isJWTAuthenticated = false;
      return false;
    }
  }

  /**
   * Retry logic for API calls
   */
  private async retryOperation<T>(
    operation: () => Promise<T>,
    maxRetries: number = this.config.maxRetries,
    delay: number = this.config.retryDelay
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === maxRetries) {
          throw lastError;
        }

        console.warn(`⚠️ Attempt ${attempt} failed, retrying in ${delay}ms:`, error);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 1.5; // Exponential backoff
      }
    }

    throw lastError!;
  }

  /**
   * Main method to notify search engines about new articles
   */
  async notifySearchEnginesOfNewArticle(article: NewsArticle): Promise<IndexingResult[]> {
    const articleUrl = `${this.baseUrl}/news/${article.slug}`;
    const results: IndexingResult[] = [];
    
    console.log(`🚀 Notifying search engines about: ${articleUrl}`);

    // Parallel execution for better performance
    const promises = [
      this.submitToGoogleIndexing(articleUrl),
      this.submitToBingIndexing(articleUrl),
      this.updateSitemapAndNotify().then(() => ({ success: true, service: 'Sitemap' })).catch(error => ({ success: false, service: 'Sitemap', error: error.message }))
    ];

    const [googleResult, bingResult, sitemapResult] = await Promise.allSettled(promises);

    // Process Google result
    if (googleResult.status === 'fulfilled') {
      results.push(googleResult.value);
    } else {
      results.push({
        success: false,
        service: 'Google',
        error: googleResult.reason?.message || 'Unknown error'
      });
    }

    // Process Bing result
    if (bingResult.status === 'fulfilled') {
      results.push(bingResult.value);
    } else {
      results.push({
        success: false,
        service: 'Bing',
        error: bingResult.reason?.message || 'Unknown error'
      });
    }

    // Process sitemap result
    if (sitemapResult.status === 'fulfilled') {
      results.push(sitemapResult.value);
    } else {
      results.push({
        success: false,
        service: 'Sitemap',
        error: sitemapResult.reason?.message || 'Unknown error'
      });
    }

    const successCount = results.filter(r => r.success).length;
    console.log(`✅ Successfully notified ${successCount}/${results.length} search engines`);

    return results;
  }

  /**
   * Submit URL to Google Indexing API with proper error handling
   */
  private async submitToGoogleIndexing(url: string): Promise<IndexingResult> {
    if (!this.config.enableIndexingAPI) {
      console.log('ℹ️ Google Indexing API disabled, skipping');
      return { success: false, service: 'Google', error: 'API disabled' };
    }

    try {
      const isInitialized = await this.initializeJWTClient();
      
      if (!isInitialized || !this.jwtClient) {
        if (this.config.enableSitemapPing) {
          return await this.fallbackToGoogleSitemapPing();
        }
        throw new Error('JWT client initialization failed and sitemap ping disabled');
      }

      const indexing = google.indexing({
        version: 'v3',
        auth: this.jwtClient,
      });

      const response = await this.retryOperation(async () => {
        return await indexing.urlNotifications.publish({
          requestBody: {
            url,
            type: 'URL_UPDATED',
          },
        });
      });

      console.log('✅ Google Indexing API success:', {
        url,
        status: response.status,
        // Fixed: Use optional chaining and safe property access
        responseData: response.data
      });

      // Also submit sitemap update
      setTimeout(async () => {
        try {
          await indexing.urlNotifications.publish({
            requestBody: {
              url: `${this.baseUrl}/sitemap.xml`,
              type: 'URL_UPDATED',
            },
          });
          console.log('✅ Sitemap updated via Google Indexing API');
        } catch (error) {
          console.error('❌ Sitemap update via API failed:', error);
        }
      }, 1000);

      return {
        success: true,
        service: 'Google Indexing API',
        response: response.data
      };

    } catch (error) {
      console.error('❌ Google Indexing API error:', error);
      
      // Fallback to sitemap ping if enabled
      if (this.config.enableSitemapPing) {
        return await this.fallbackToGoogleSitemapPing();
      }

      return {
        success: false,
        service: 'Google',
        error: (error as Error).message
      };
    }
  }

  /**
   * Fallback to Google sitemap ping
   */
  private async fallbackToGoogleSitemapPing(): Promise<IndexingResult> {
    try {
      const pingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(this.baseUrl + '/sitemap.xml')}`;
      
      const response = await this.retryOperation(async () => {
        return await fetch(pingUrl, {
          method: 'GET',
          headers: {
            'User-Agent': 'GhNewsMedia-SitemapPing/2.0',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
          }
        });
      });

      if (response.ok) {
        console.log('✅ Google sitemap ping successful');
        return { success: true, service: 'Google Sitemap Ping' };
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('❌ Google sitemap ping failed:', error);
      return {
        success: false,
        service: 'Google Sitemap Ping',
        error: (error as Error).message
      };
    }
  }

  /**
   * Submit URL to Bing with API or sitemap fallback
   */
  private async submitToBingIndexing(url: string): Promise<IndexingResult> {
    try {
      // Try Bing Webmaster API first if API key is available
      if (this.config.bingApiKey) {
        const response = await this.retryOperation(async () => {
          return await fetch('https://ssl.bing.com/webmaster/api.svc/json/SubmitUrl', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.config.bingApiKey}`,
              'User-Agent': 'GhNewsMedia-BingAPI/2.0'
            },
            body: JSON.stringify({
              siteUrl: this.baseUrl,
              url: url
            })
          });
        });

        if (response.ok) {
          const data = await response.json();
          console.log('✅ Bing Webmaster API success:', data);
          return {
            success: true,
            service: 'Bing Webmaster API',
            response: data
          };
        } else {
          const errorText = await response.text();
          throw new Error(`Bing API error ${response.status}: ${errorText}`);
        }
      }

      // Fallback to Bing sitemap ping
      if (this.config.enableSitemapPing) {
        const pingUrl = `https://www.bing.com/ping?sitemap=${encodeURIComponent(this.baseUrl + '/sitemap.xml')}`;
        
        const response = await this.retryOperation(async () => {
          return await fetch(pingUrl, {
            method: 'GET',
            headers: {
              'User-Agent': 'GhNewsMedia-SitemapPing/2.0',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
            }
          });
        });

        if (response.ok) {
          console.log('✅ Bing sitemap ping successful');
          return { success: true, service: 'Bing Sitemap Ping' };
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      }

      return {
        success: false,
        service: 'Bing',
        error: 'No API key provided and sitemap ping disabled'
      };

    } catch (error) {
      console.error('❌ Bing indexing failed:', error);
      return {
        success: false,
        service: 'Bing',
        error: (error as Error).message
      };
    }
  }

  /**
   * Update sitemap and notify additional search engines
   */
  private async updateSitemapAndNotify(): Promise<void> {
    console.log('🔄 Triggering sitemap update and additional notifications');
    
    try {
      // Notify additional search engines
      const additionalEngines = [
        { name: 'Yandex', url: 'https://webmaster.yandex.com/ping?sitemap=' },
        { name: 'IndexNow', url: 'https://api.indexnow.org/indexnow' },
      ];

      const sitemapUrl = encodeURIComponent(`${this.baseUrl}/sitemap.xml`);

      for (const engine of additionalEngines) {
        try {
          if (engine.name === 'IndexNow') {
            await this.submitToIndexNow();
          } else {
            const response = await fetch(`${engine.url}${sitemapUrl}`, {
              method: 'GET',
              headers: {
                'User-Agent': 'GhNewsMedia-SitemapPing/2.0'
              }
            });

            if (response.ok) {
              console.log(`✅ ${engine.name} ping successful`);
            } else {
              console.warn(`⚠️ ${engine.name} ping failed: ${response.status}`);
            }
          }
        } catch (error) {
          console.warn(`⚠️ ${engine.name} notification failed:`, error);
        }
      }

      // Trigger sitemap regeneration webhook if configured
      const sitemapWebhook = process.env.SITEMAP_WEBHOOK_URL;
      if (sitemapWebhook) {
        try {
          await fetch(sitemapWebhook, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.SITEMAP_WEBHOOK_TOKEN || ''}`
            },
            body: JSON.stringify({
              action: 'regenerate',
              timestamp: new Date().toISOString()
            })
          });
          console.log('✅ Sitemap regeneration webhook triggered');
        } catch (error) {
          console.error('❌ Sitemap webhook failed:', error);
        }
      }

    } catch (error) {
      console.error('❌ Error in sitemap update process:', error);
      throw error;
    }
  }

  /**
   * Submit to IndexNow for instant indexing
   */
  private async submitToIndexNow(): Promise<void> {
    const indexNowKey = process.env.INDEXNOW_API_KEY;
    if (!indexNowKey) {
      console.log('ℹ️ IndexNow API key not configured, skipping');
      return;
    }

    try {
      const response = await fetch('https://api.indexnow.org/indexnow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'GhNewsMedia-IndexNow/2.0'
        },
        body: JSON.stringify({
          host: new URL(this.baseUrl).hostname,
          key: indexNowKey,
          urlList: [`${this.baseUrl}/sitemap.xml`]
        })
      });

      if (response.ok) {
        console.log('✅ IndexNow submission successful');
      } else {
        throw new Error(`IndexNow error: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ IndexNow submission failed:', error);
    }
  }

  /**
   * Generate enhanced structured data for better search visibility
   */
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

  /**
   * Optimize images for social media and search with production-ready logic
   */
  optimizeImageForSEO(imageUrl: string, title: string): string {
    if (!imageUrl) {
      return `${this.baseUrl}/images/og-default.jpg`;
    }
  
    let absoluteUrl: string;
  
    // Handle different URL formats
    if (imageUrl.startsWith('http')) {
      absoluteUrl = imageUrl;
    } else if (imageUrl.startsWith('//')) {
      absoluteUrl = `https:${imageUrl}`;
    } else {
      absoluteUrl = `${this.baseUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
    }
  
    try {
      const url = new URL(absoluteUrl);
      
      // Add optimization parameters for known services
      if (url.hostname.includes('supabase') || url.hostname.includes('unsplash') || url.hostname.includes('cloudinary')) {
        if (!url.searchParams.has('w')) {
          url.searchParams.set('w', '1200');
          url.searchParams.set('h', '630');
          url.searchParams.set('fit', 'crop');
          url.searchParams.set('q', '90');
          url.searchParams.set('fm', 'jpg');
        }
      }
      
      return url.toString();
    } catch (error) {
      console.error('❌ Error optimizing image URL:', error);
      return absoluteUrl;
    }
  }

  /**
   * Generate social media meta tags optimized for each platform
   */
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

  /**
   * Clean and optimize description text
   */
  private cleanDescription(text: string): string {
    if (!text) return '';
    
    // Remove HTML tags and normalize whitespace
    const cleaned = text
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s.,!?-]/g, '')
      .trim();
    
    return cleaned.length > 160 ? `${cleaned.substring(0, 157)}...` : cleaned;
  }

  /**
   * Calculate word count from content
   */
  private getWordCount(content: string): number {
    if (!content) return 0;
    
    return content
      .replace(/<[^>]*>/g, '')
      .split(/\s+/)
      .filter(word => word.length > 0)
      .length;
  }

  /**
   * Generate comprehensive meta tags for search engines
   */
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
      'content-language': 'en-GB',
      'viewport': 'width=device-width, initial-scale=1.0'
    };
  }

  /**
   * Health check method for monitoring
   */
  async healthCheck(): Promise<{ status: string; services: Record<string, boolean> }> {
    const services = {
      googleIndexingAPI: false,
      bingAPI: false,
      sitemapPing: true
    };

    // Check Google Indexing API
    try {
      services.googleIndexingAPI = await this.initializeJWTClient();
    } catch (error) {
      console.error('Google API health check failed:', error);
    }

    // Check Bing API
    if (this.config.bingApiKey) {
      try {
        const response = await fetch('https://ssl.bing.com/webmaster/api.svc/json/GetUrlsInfo', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.config.bingApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ siteUrl: this.baseUrl, urls: [this.baseUrl] })
        });
        services.bingAPI = response.ok;
      } catch (error) {
        console.error('Bing API health check failed:', error);
      }
    }

    const allHealthy = Object.values(services).some(status => status);
    
    return {
      status: allHealthy ? 'healthy' : 'degraded',
      services
    };
  }
}

export default AdvancedSEOService;