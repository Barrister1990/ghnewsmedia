import { absoluteUrl, DEFAULT_OG_IMAGE, PLACEHOLDER_FEATURED_IMAGE, SITE_DISPLAY_NAME, SITE_LANGUAGE, SITE_URL } from '../config/site';
import { NewsArticle } from '../types/news';
import { profileUrl, publisherSchema } from '../utils/seo';

/** Longest "<headline> | Ghana Point" we still suffix; past this the brand would push the headline out. */
const MAX_SUFFIXED_TITLE = 70;

class AdvancedSEOService {
  private static instance: AdvancedSEOService;
  private readonly baseUrl = SITE_URL;
  private readonly siteName = SITE_DISPLAY_NAME;

  static getInstance(): AdvancedSEOService {
    if (!AdvancedSEOService.instance) {
      AdvancedSEOService.instance = new AdvancedSEOService();
    }
    return AdvancedSEOService.instance;
  }

  private articleUrl(article: NewsArticle) {
    return `${this.baseUrl}/${article.category.slug}/${article.slug}`;
  }

  /** Single NewsArticle per page. Dates are ISO 8601 with timezone; speakable matches [data-article-content]. */
  generateAdvancedArticleSchema(article: NewsArticle) {
    const articleUrl = this.articleUrl(article);
    const imageUrl = this.optimizeImageForSEO(article.featuredImage);
    const datePublished = new Date(article.publishedAt).toISOString();
    const dateModified = new Date(article.updatedAt || article.publishedAt).toISOString();

    const authorSchema: Record<string, unknown> = {
      "@type": "Person",
      name: article.author.name,
    };
    if (article.author.id) {
      authorSchema.url = `${this.baseUrl}/author/${article.author.id}`;
    }
    if (article.author.title?.trim()) {
      authorSchema.jobTitle = article.author.title.trim();
    }
    const social = article.author.social || {};
    const authorSameAs = [
      social.twitter && profileUrl(social.twitter, 'https://x.com/'),
      social.facebook && profileUrl(social.facebook, 'https://facebook.com/'),
      social.linkedin && profileUrl(social.linkedin, 'https://linkedin.com/in/'),
    ].filter(Boolean);
    if (authorSameAs.length > 0) {
      authorSchema.sameAs = authorSameAs;
    }

    return {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "@id": `${articleUrl}#article`,
      "headline": article.title,
      "description": this.cleanDescription(article.excerpt || article.content),
      "image": [imageUrl],
      "datePublished": datePublished,
      "dateModified": dateModified,
      "author": [authorSchema],
      "publisher": publisherSchema(),
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": articleUrl
      },
      "articleSection": article.category.name,
      "isPartOf": {
        "@type": "WebSite",
        "@id": `${this.baseUrl}/#website`,
        "name": this.siteName,
        "url": this.baseUrl
      },
      "keywords": (article.tags || []).join(', '),
      "wordCount": this.getWordCount(article.content),
      "inLanguage": SITE_LANGUAGE,
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

  /** Absolute image URL on the canonical host, falling back to the site share image. */
  optimizeImageForSEO(imageUrl: string): string {
    if (!imageUrl || imageUrl === PLACEHOLDER_FEATURED_IMAGE) {
      return DEFAULT_OG_IMAGE.url;
    }
    return absoluteUrl(imageUrl);
  }

  // Generate social media meta tags optimized for each platform
  generateSocialMediaTags(article: NewsArticle) {
    const articleUrl = this.articleUrl(article);
    const optimizedImage = this.optimizeImageForSEO(article.featuredImage);
    const description = this.cleanDescription(article.excerpt || article.content);

    return {
      // Open Graph (Facebook, LinkedIn, WhatsApp)
      'og:type': 'article',
      'og:title': article.title,
      'og:description': description,
      'og:image': optimizedImage,
      'og:image:alt': article.title,
      'og:url': articleUrl,
      'og:site_name': this.siteName,
      'og:locale': 'en_GH',
      
      // Article specific (ISO 8601 for Google News)
      'article:published_time': new Date(article.publishedAt).toISOString(),
      'article:modified_time': new Date(article.updatedAt || article.publishedAt).toISOString(),
      'article:author': article.author.name,
      'article:section': article.category.name,
      
      // Twitter Cards
      'twitter:card': 'summary_large_image',
      'twitter:title': article.title,
      'twitter:description': description,
      'twitter:image': optimizedImage,
      'twitter:image:alt': article.title,
      'twitter:site': '@ghnewsmedia',
      'twitter:creator': '@ghnewsmedia',
    };
  }

  private cleanDescription(text: string): string {
    // Remove HTML tags and clean up the description
    // Target: 150-160 characters (920 pixels) for optimal display
    const cleaned = text.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    const maxLength = 155; // Slightly under 160 to account for ellipsis and ensure no truncation
    return cleaned.length > maxLength ? `${cleaned.substring(0, maxLength - 3).trim()}...` : cleaned;
  }

  private getWordCount(content: string): number {
    return content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length;
  }

  // Generate comprehensive meta tags for search engines
  generateSearchMetaTags(article: NewsArticle) {
    const suffixed = `${article.title} | ${this.siteName}`;

    return {
      // Keep the full headline so the <title> matches the visible H1; Google trims for display itself.
      'title': suffixed.length <= MAX_SUFFIXED_TITLE ? suffixed : article.title,
      'description': this.cleanDescription(article.excerpt || article.content),
      'keywords': [...article.tags, article.category.name, 'Ghana news'].join(', '),
      'canonical': this.articleUrl(article),
      'news_keywords': article.tags.join(', '),
      'article:author': article.author.name,
    };
  }
}

export default AdvancedSEOService;
