
import { Category, NewsArticle } from '../types/news';

class SEOService {
  private static instance: SEOService;
  private siteUrl = 'https://ghnewsmedia.com';

  static getInstance(): SEOService {
    if (!SEOService.instance) {
      SEOService.instance = new SEOService();
    }
    return SEOService.instance;
  }

  // Generate comprehensive sitemap
  generateSitemap(articles: NewsArticle[], categories: Category[]): string {
    const currentDate = new Date().toISOString();
    
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

    // Homepage - highest priority
    sitemap += `  <url>
    <loc>${this.siteUrl}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>1.0</priority>
  </url>
`;

    // Static pages
    const staticPages = [
      { path: '/search', priority: '0.9', changefreq: 'daily' },
      { path: '/about', priority: '0.7', changefreq: 'monthly' },
      { path: '/contact', priority: '0.7', changefreq: 'monthly' }
    ];

    staticPages.forEach(page => {
      sitemap += `  <url>
    <loc>${this.siteUrl}${page.path}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
    });

    // Category pages
    categories.forEach(category => {
      sitemap += `  <url>
    <loc>${this.siteUrl}/${category.slug}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
`;
    });

    // Article pages with news sitemap and image tags
    articles.forEach(article => {
      sitemap += `  <url>
    <loc>${this.siteUrl}/${article.category.slug}/${article.slug}</loc>
    <lastmod>${article.updatedAt}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
    <news:news>
      <news:publication>
        <news:name>GH News</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${article.publishedAt}</news:publication_date>
      <news:title><![CDATA[${article.title}]]></news:title>
      <news:keywords>${article.tags.join(', ')}</news:keywords>
    </news:news>`;

      if (article.featuredImage) {
        sitemap += `
    <image:image>
      <image:loc>${article.featuredImage}</image:loc>
      <image:title><![CDATA[${article.title}]]></image:title>
      <image:caption><![CDATA[${article.excerpt}]]></image:caption>
    </image:image>`;
      }

      sitemap += `
  </url>
`;
    });

    sitemap += '</urlset>';
    return sitemap;
  }

  // Generate RSS feed for better content discovery
  generateRSSFeed(articles: NewsArticle[]): string {
    const currentDate = new Date().toUTCString();
    const latestArticles = articles.slice(0, 20); // Latest 20 articles

    let rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>GH News - Ghana's Digital News Platform</title>
    <link>${this.siteUrl}</link>
    <description>Stay informed with Ghana's leading digital news platform. Breaking news, politics, business, sports, and entertainment.</description>
    <language>en-gb</language>
    <lastBuildDate>${currentDate}</lastBuildDate>
    <generator>GH News RSS Generator</generator>
    <image>
      <url>${this.siteUrl}/logo.png</url>
      <title>GH News</title>
      <link>${this.siteUrl}</link>
    </image>
`;

    latestArticles.forEach(article => {
      rss += `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${this.siteUrl}/${article.category.slug}/${article.slug}</link>
      <description><![CDATA[${article.excerpt}]]></description>
      <content:encoded><![CDATA[${article.content}]]></content:encoded>
      <pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate>
      <dc:creator>${article.author.name}</dc:creator>
      <category>${article.category.name}</category>
      <guid isPermaLink="true">${this.siteUrl}/${article.category.slug}/${article.slug}</guid>
      ${article.featuredImage ? `<enclosure url="${article.featuredImage}" type="image/jpeg" />` : ''}
    </item>`;
    });

    rss += `
  </channel>
</rss>`;
    return rss;
  }

  // Ping search engines when new content is published
  async notifySearchEngines(sitemapUrl: string): Promise<void> {
    const pingUrls = [
      `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
      `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
      `https://search.yahoo.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`
    ];

    const pingPromises = pingUrls.map(async (url) => {
      try {
        await fetch(url, { method: 'GET', mode: 'no-cors' });
        console.log(`Successfully pinged: ${url}`);
      } catch (error) {
        console.warn(`Failed to ping ${url}:`, error);
      }
    });

    await Promise.allSettled(pingPromises);
  }

  // Generate enhanced structured data for better understanding
  generateEnhancedStructuredData(article: NewsArticle) {
    return {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "headline": article.title,
      "description": article.excerpt,
      "image": {
        "@type": "ImageObject",
        "url": article.featuredImage,
        "width": 1200,
        "height": 630
      },
      "datePublished": article.publishedAt,
      "dateModified": article.updatedAt,
      "author": {
        "@type": "Person",
        "name": article.author.name,
        "url": `${this.siteUrl}/author/${article.author.id}`,
        "jobTitle": "Journalist"
      },
      "publisher": {
        "@type": "NewsMediaOrganization",
        "name": "GH News",
        "logo": {
          "@type": "ImageObject",
          "url": `${this.siteUrl}/logo.png`,
          "width": 200,
          "height": 60
        },
        "url": this.siteUrl
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `${this.siteUrl}/${article.category.slug}/${article.slug}`
      },
      "articleSection": article.category.name,
      "keywords": article.tags,
      "wordCount": article.content.split(' ').length,
      "timeRequired": `PT${article.readTime}M`,
      "inLanguage": "en-GB",
      "isAccessibleForFree": true,
      "url": `${this.siteUrl}/${article.category.slug}/${article.slug}`,
      "speakable": {
        "@type": "SpeakableSpecification",
        "cssSelector": ["h1", ".article-content p"]
      }
    };
  }

  // Generate breadcrumb structured data
  generateBreadcrumbData(items: Array<{name: string, url?: string}>) {
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        ...(item.url && { "item": item.url })
      }))
    };
  }

  // Generate organization structured data with enhanced information
  generateOrganizationData() {
    return {
      "@context": "https://schema.org",
      "@type": "NewsMediaOrganization",
      "name": "GH News",
      "alternateName": "Ghana's Digital News Platform",
      "url": this.siteUrl,
      "logo": `${this.siteUrl}/logo.png`,
      "description": "Ghana's premier digital news platform providing credible, timely news coverage across politics, business, sports, entertainment, and technology.",
      "foundingDate": "2024",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "GH",
        "addressLocality": "Accra"
      },
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "contactType": "Editorial",
          "email": "editorial@ghnewsmedia.com"
        },
        {
          "@type": "ContactPoint",
          "contactType": "News Tips",
          "email": "tips@ghnewsmedia.com"
        }
      ],
      "sameAs": [
        "https://facebook.com/ghnewsmedia",
        "https://twitter.com/ghnewsmedia",
        "https://instagram.com/ghnewsmedia",
        "https://linkedin.com/company/ghnewsmedia"
      ],
      "publishingPrinciples": `${this.siteUrl}/editorial-guidelines`,
      "diversityPolicy": `${this.siteUrl}/diversity-policy`,
      "ethicsPolicy": `${this.siteUrl}/ethics-policy`
    };
  }
}

export default SEOService;
