// services/googleIndexingService.ts - Google Indexing API for immediate article indexing (Phase 5)
import { GoogleAuth } from 'google-auth-library';
import { NewsArticle } from '../types/news';

const INDEXING_SCOPE = 'https://www.googleapis.com/auth/indexing';

interface GoogleIndexingResponse {
  urlNotificationMetadata?: {
    latestUpdate?: {
      url: string;
      type: 'URL_UPDATED' | 'URL_DELETED';
    };
  };
}

class GoogleIndexingService {
  private static instance: GoogleIndexingService;
  private readonly baseUrl = 'https://ghnewsmedia.com';
  private readonly googleIndexingApiUrl = 'https://indexing.googleapis.com/v3/urlNotifications:publish';
  private authClient: GoogleAuth | null = null;

  static getInstance(): GoogleIndexingService {
    if (!GoogleIndexingService.instance) {
      GoogleIndexingService.instance = new GoogleIndexingService();
    }
    return GoogleIndexingService.instance;
  }

  /**
   * Get an access token for the Indexing API using service account credentials.
   * Requires GOOGLE_INDEXING_CREDENTIALS_JSON (raw JSON string) or GOOGLE_APPLICATION_CREDENTIALS (path to key file).
   * Returns null if credentials are not configured (safe for client/server).
   */
  private async getAccessToken(): Promise<string | null> {
    if (typeof process === 'undefined' || !process.env) {
      return null;
    }
    try {
      const credentialsJson = process.env.GOOGLE_INDEXING_CREDENTIALS_JSON;
      if (credentialsJson) {
        const credentials = JSON.parse(credentialsJson) as { client_email?: string; private_key?: string };
        if (!credentials.client_email || !credentials.private_key) {
          if (process.env.NODE_ENV === 'development') {
            console.warn('Google Indexing: GOOGLE_INDEXING_CREDENTIALS_JSON missing client_email or private_key');
          }
          return null;
        }
        if (!this.authClient) {
          this.authClient = new GoogleAuth({
            credentials: credentials as Record<string, unknown>,
            scopes: [INDEXING_SCOPE],
          });
        }
        const client = await this.authClient.getClient();
        const tokenResponse = await client.getAccessToken();
        return tokenResponse.token ?? null;
      }
      // Fallback: GOOGLE_APPLICATION_CREDENTIALS path (e.g. in GCP or local key file)
      const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
      if (keyPath) {
        if (!this.authClient) {
          this.authClient = new GoogleAuth({
            keyFile: keyPath,
            scopes: [INDEXING_SCOPE],
          });
        }
        const client = await this.authClient.getClient();
        const tokenResponse = await client.getAccessToken();
        return tokenResponse.token ?? null;
      }
      return null;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Google Indexing: getAccessToken failed', error);
      }
      return null;
    }
  }

  /**
   * Notify Google of a single URL (for use from API route; runs on server with credentials).
   */
  async notifyGoogleOfUrl(url: string): Promise<boolean> {
    try {
      const indexingSuccess = await this.submitToGoogleIndexingAPI(url);
      if (!indexingSuccess) {
        await this.pingGoogleSitemap();
      } else {
        await this.pingGoogleSitemap();
      }
      this.submitToSearchConsole(url);
      if (process.env.NODE_ENV === 'development') {
        console.log(`Google indexing notification sent for: ${url}`);
      }
      return true;
    } catch (error) {
      console.error('Google indexing notification failed:', error);
      await this.pingGoogleSitemap();
      return false;
    }
  }

  // Immediately notify Google about new articles (used from server-side API route with article payload)
  async notifyGoogleOfNewArticle(article: NewsArticle): Promise<boolean> {
    const articleUrl = `${this.baseUrl}/${article.category.slug}/${article.slug}`;
    return this.notifyGoogleOfUrl(articleUrl);
  }

  // Submit to Google Indexing API with Bearer token when credentials are present
  private async submitToGoogleIndexingAPI(url: string): Promise<boolean> {
    try {
      const accessToken = await this.getAccessToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      } else {
        return false;
      }

      const response = await fetch(this.googleIndexingApiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          url,
          type: 'URL_UPDATED',
        }),
      });

      if (response.ok) {
        const data = (await response.json()) as GoogleIndexingResponse;
        if (process.env.NODE_ENV === 'development' && data?.urlNotificationMetadata) {
          console.log('Google Indexing API response:', data.urlNotificationMetadata);
        }
        return true;
      }
      const errText = await response.text();
      if (process.env.NODE_ENV === 'development') {
        console.warn('Google Indexing API non-OK:', response.status, errText);
      }
      return false;
    } catch (error) {
      console.error('Google Indexing API error:', error);
      return false;
    }
  }

  // Ping Google sitemap (fallback / in addition to Indexing API)
  async pingGoogleSitemap(): Promise<void> {
    try {
      const sitemapUrl = `${this.baseUrl}/sitemap.xml`;
      const newsSitemapUrl = `${this.baseUrl}/news-sitemap.xml`;
      await fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`, {
        method: 'GET',
        mode: 'no-cors',
      });
      await fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(newsSitemapUrl)}`, {
        method: 'GET',
        mode: 'no-cors',
      });
    } catch (error) {
      console.error('Google sitemap ping failed:', error);
    }
  }

  private submitToSearchConsole(url: string): void {
    if (process.env.NODE_ENV === 'development') {
      console.log('Submit to Search Console (manual):', url);
    }
  }

  async batchSubmitArticles(articles: NewsArticle[]): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;
    for (const article of articles) {
      try {
        const result = await this.notifyGoogleOfNewArticle(article);
        if (result) success++;
        else failed++;
        await new Promise((r) => setTimeout(r, 1000));
      } catch (error) {
        failed++;
        console.error(`Failed to submit article ${article.slug}:`, error);
      }
    }
    return { success, failed };
  }

  async getIndexingStatus(_url: string): Promise<string> {
    return 'PENDING';
  }
}

export default GoogleIndexingService;
