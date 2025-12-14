
import { Category, NewsArticle } from '../types/news';

export class DynamicSitemapGenerator {
  private static instance: DynamicSitemapGenerator;
  private readonly baseUrl = 'https://ghnewsmedia.com';

  static getInstance(): DynamicSitemapGenerator {
    if (!DynamicSitemapGenerator.instance) {
      DynamicSitemapGenerator.instance = new DynamicSitemapGenerator();
    }
    return DynamicSitemapGenerator.instance;
  }

  generateComprehensiveSitemap(articles: NewsArticle[], categories: Category[]): string {
    const currentDate = new Date().toISOString();
    
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

    // Homepage - highest priority
    sitemap += this.generateUrlEntry('', '1.0', 'daily', currentDate);

    // Static pages
    const staticPages = [
      { url: '/about', priority: '0.8', changefreq: 'monthly' },
      { url: '/contact', priority: '0.8', changefreq: 'monthly' },
      { url: '/search', priority: '0.9', changefreq: 'weekly' }
    ];

    staticPages.forEach(page => {
      sitemap += this.generateUrlEntry(page.url, page.priority, page.changefreq, currentDate);
    });

    // Category pages - high priority
    categories.forEach(category => {
      sitemap += this.generateUrlEntry(
        `/${category.slug}`, 
        '0.9', 
        'daily', 
        currentDate
      );
    });

    // Article pages with news sitemap tags and image tags
    articles.forEach(article => {
      sitemap += this.generateArticleEntry(article);
    });

    sitemap += '</urlset>';
    return sitemap;
  }

  private generateUrlEntry(
    path: string, 
    priority: string, 
    changefreq: string, 
    lastmod: string
  ): string {
    return `  <url>
    <loc>${this.baseUrl}${path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>
`;
  }

  private generateArticleEntry(article: NewsArticle): string {
    const articleUrl = `${this.baseUrl}/${article.category.slug}/${article.slug}`;
    const imageUrl = this.getOptimizedImageUrl(article.featuredImage);
    
    // Determine if article is recent (within 48 hours)
    const isRecent = Date.now() - new Date(article.publishedAt).getTime() < 48 * 60 * 60 * 1000;
    const priority = isRecent ? '0.9' : '0.8';
    
    return `  <url>
    <loc>${articleUrl}</loc>
    <lastmod>${article.updatedAt}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priority}</priority>
    <news:news>
      <news:publication>
        <news:name>GhNewsMedia</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${article.publishedAt}</news:publication_date>
      <news:title>${this.escapeXml(article.title)}</news:title>
      <news:keywords>${article.tags.join(', ')}</news:keywords>
    </news:news>
    <image:image>
      <image:loc>${imageUrl}</image:loc>
      <image:title>${this.escapeXml(article.title)}</image:title>
      <image:caption>${this.escapeXml(article.excerpt || article.title)}</image:caption>
    </image:image>
  </url>
`;
  }

  private getOptimizedImageUrl(imageUrl?: string): string {
    if (!imageUrl) {
      return `${this.baseUrl}/og-default.jpg`;
    }
    
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    
    if (imageUrl.startsWith('/')) {
      return `${this.baseUrl}${imageUrl}`;
    }
    
    return `${this.baseUrl}/og-default.jpg`;
  }

  private escapeXml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  generateRSSFeed(articles: NewsArticle[]): string {
    const currentDate = new Date().toUTCString();
    
    let rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>GhNewsMedia - Ghana's Premier News Source</title>
    <link>${this.baseUrl}</link>
    <description>Breaking news, politics, business, sports and entertainment from Ghana</description>
    <language>en-gb</language>
    <lastBuildDate>${currentDate}</lastBuildDate>
    <ttl>30</ttl>
    <image>
      <url>${this.baseUrl}/logo.png</url>
      <title>GhNewsMedia</title>
      <link>${this.baseUrl}</link>
    </image>
`;

    // Add latest 50 articles to RSS feed
    articles.slice(0, 50).forEach(article => {
      const articleUrl = `${this.baseUrl}/${article.category.slug}/${article.slug}`;
      const imageUrl = this.getOptimizedImageUrl(article.featuredImage);
      
      rss += `    <item>
      <title>${this.escapeXml(article.title)}</title>
      <link>${articleUrl}</link>
      <description>${this.escapeXml(article.excerpt || '')}</description>
      <content:encoded><![CDATA[${article.content}]]></content:encoded>
      <pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate>
      <dc:creator>${this.escapeXml(article.author.name)}</dc:creator>
      <category>${this.escapeXml(article.category.name)}</category>
      <guid isPermaLink="true">${articleUrl}</guid>
      <enclosure url="${imageUrl}" type="image/jpeg"/>
    </item>
`;
    });

    rss += `  </channel>
</rss>`;
    
    return rss;
  }

  async notifySearchEngines(sitemapUrl: string): Promise<void> {
    const endpoints = [
      `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
      `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`
    ];

    const promises = endpoints.map(endpoint => 
      fetch(endpoint, { method: 'GET', mode: 'no-cors' })
        .catch(error => console.error(`Failed to notify ${endpoint}:`, error))
    );

    await Promise.allSettled(promises);
    console.log('Search engines notified of sitemap update');
  }
}

export const dynamicSitemapGenerator = DynamicSitemapGenerator.getInstance();
