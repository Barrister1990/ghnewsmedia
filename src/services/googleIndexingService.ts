// services/googleIndexingService.ts - Google Indexing API for immediate article indexing
import { NewsArticle } from '../types/news';

interface GoogleIndexingResponse {
  urlNotificationMetadata: {
    latestUpdate: {
      url: string;
      type: 'URL_UPDATED' | 'URL_DELETED';
    };
  };
}

class GoogleIndexingService {
  private static instance: GoogleIndexingService;
  private readonly baseUrl = 'https://ghnewsmedia.com';
  private readonly googleIndexingApiUrl = 'https://indexing.googleapis.com/v3/urlNotifications:publish';

  static getInstance(): GoogleIndexingService {
    if (!GoogleIndexingService.instance) {
      GoogleIndexingService.instance = new GoogleIndexingService();
    }
    return GoogleIndexingService.instance;
  }

  // Immediately notify Google about new articles
  async notifyGoogleOfNewArticle(article: NewsArticle): Promise<boolean> {
    try {
      const articleUrl = `${this.baseUrl}/news/${article.slug}`;
      
      // Method 1: Google Indexing API (requires service account)
      const indexingSuccess = await this.submitToGoogleIndexingAPI(articleUrl);
      
      // Method 2: Sitemap ping (fallback)
      if (!indexingSuccess) {
        await this.pingGoogleSitemap();
      }
      
      // Method 3: Direct URL submission via search console
      await this.submitToSearchConsole(articleUrl);
      
      console.log(`✅ Google indexing notification sent for: ${articleUrl}`);
      return true;
    } catch (error) {
      console.error('❌ Google indexing notification failed:', error);
      return false;
    }
  }

  // Submit to Google Indexing API (most effective method)
  private async submitToGoogleIndexingAPI(url: string): Promise<boolean> {
    try {
      // Note: In production, you'll need to set up Google Cloud service account
      // and get proper authentication tokens
      const response = await fetch(this.googleIndexingApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${accessToken}`, // Add in production
        },
        body: JSON.stringify({
          url: url,
          type: 'URL_UPDATED'
        })
      });

      if (response.ok) {
        const data: GoogleIndexingResponse = await response.json();
        console.log('Google Indexing API response:', data);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Google Indexing API error:', error);
      return false;
    }
  }

  // Ping Google sitemap (fallback method)
  private async pingGoogleSitemap(): Promise<void> {
    try {
      const sitemapUrl = `${this.baseUrl}/sitemap.xml`;
      const newsSitemapUrl = `${this.baseUrl}/news-sitemap.xml`;
      
      // Ping main sitemap
      await fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`, {
        method: 'GET',
        mode: 'no-cors'
      });
      
      // Ping news sitemap
      await fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(newsSitemapUrl)}`, {
        method: 'GET',
        mode: 'no-cors'
      });
      
      console.log('✅ Google sitemap ping sent');
    } catch (error) {
      console.error('❌ Google sitemap ping failed:', error);
    }
  }

  // Submit to Google Search Console (if configured)
  private async submitToSearchConsole(url: string): Promise<void> {
    try {
      // This would integrate with Google Search Console API
      // For now, we'll use the manual submission method
      console.log(`📝 Submit to Search Console: ${url}`);
      
      // In production, you can use the Search Console API to submit URLs
      // const searchConsoleApiUrl = 'https://searchconsole.googleapis.com/v1/urlInspection/index:inspect';
      
    } catch (error) {
      console.error('Search Console submission error:', error);
    }
  }

  // Batch submit multiple articles
  async batchSubmitArticles(articles: NewsArticle[]): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;

    for (const article of articles) {
      try {
        const result = await this.notifyGoogleOfNewArticle(article);
        if (result) {
          success++;
        } else {
          failed++;
        }
        
        // Add delay between submissions to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        failed++;
        console.error(`Failed to submit article ${article.slug}:`, error);
      }
    }

    return { success, failed };
  }

  // Get indexing status for a URL
  async getIndexingStatus(url: string): Promise<string> {
    try {
      // This would check the Google Indexing API for status
      // For now, return a placeholder
      return 'PENDING';
    } catch (error) {
      console.error('Error checking indexing status:', error);
      return 'UNKNOWN';
    }
  }
}

export default GoogleIndexingService;
