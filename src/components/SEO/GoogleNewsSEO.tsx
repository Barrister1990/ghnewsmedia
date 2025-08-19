// components/SEO/GoogleNewsSEO.tsx - Google News specific SEO optimization
import Head from 'next/head';
import React from 'react';
import { NewsArticle } from '../../types/news';

interface GoogleNewsSEOProps {
  article: NewsArticle;
}

const GoogleNewsSEO: React.FC<GoogleNewsSEOProps> = ({ article }) => {
  const articleUrl = `https://ghnewsmedia.com/news/${article.slug}`;
  const publicationDate = new Date(article.publishedAt).toISOString();
  
  // Google News specific meta tags
  const googleNewsMetaTags = [
    // Article publication time (critical for Google News)
    { property: 'article:published_time', content: publicationDate },
    { property: 'article:modified_time', content: article.updatedAt },
    
    // News specific tags
    { name: 'news_keywords', content: article.tags.join(', ') },
    { name: 'article:section', content: article.category.name },
    { name: 'article:tag', content: article.tags.join(', ') },
    
    // Geographic and language tags
    { name: 'geo.region', content: 'GH' },
    { name: 'geo.country', content: 'Ghana' },
    { name: 'language', content: 'en-GB' },
    { name: 'content-language', content: 'en-GB' },
    
    // News organization tags
    { property: 'article:publisher', content: 'https://ghnewsmedia.com' },
    { name: 'publisher', content: 'GhNewsMedia' },
    
    // Google News specific
    { name: 'googlebot-news', content: 'noarchive' },
    { name: 'robots', content: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1' },
    
    // Social media for news sharing
    { property: 'og:type', content: 'article' },
    { property: 'og:site_name', content: 'GhNewsMedia' },
    { property: 'og:locale', content: 'en_GB' },
    
    // Twitter Cards for news
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:site', content: '@ghnewsmedia' },
    { name: 'twitter:creator', content: '@ghnewsmedia' },
  ];

  // Enhanced structured data for Google News
  const googleNewsStructuredData = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "@id": articleUrl,
    "headline": article.title,
    "description": article.excerpt,
    "image": {
      "@type": "ImageObject",
      "url": article.featuredImage.startsWith('http') ? article.featuredImage : `https://ghnewsmedia.com${article.featuredImage}`,
      "width": 1200,
      "height": 630,
      "caption": article.title
    },
    "datePublished": publicationDate,
    "dateModified": article.updatedAt,
    "author": {
      "@type": "Person",
      "name": article.author.name,
      "url": `https://ghnewsmedia.com/author/${article.author.id}`,
      "image": article.author.avatar
    },
    "publisher": {
      "@type": "NewsMediaOrganization",
      "name": "GhNewsMedia",
      "url": "https://ghnewsmedia.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://ghnewsmedia.com/logo.png",
        "width": 600,
        "height": 60
      },
      "sameAs": [
        "https://twitter.com/ghnewsmedia",
        "https://facebook.com/ghnewsmedia",
        "https://instagram.com/ghnewsmedia"
      ]
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": articleUrl
    },
    "articleSection": article.category.name,
    "keywords": article.tags.join(', '),
    "wordCount": article.content.split(' ').length,
    "timeRequired": `PT${article.readTime}M`,
    "inLanguage": "en-GB",
    "isAccessibleForFree": true,
    "url": articleUrl,
    "thumbnailUrl": article.featuredImage.startsWith('http') ? article.featuredImage : `https://ghnewsmedia.com${article.featuredImage}`,
    
    // Google News specific properties
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": ["h1", ".article-content p"]
    },
    
    // News article specific
    "newsCategory": article.category.name,
    "newsKeywords": article.tags.join(', '),
    
    // Geographic information
    "contentLocation": {
      "@type": "Place",
      "name": "Ghana",
      "addressCountry": "GH"
    }
  };

  return (
    <Head>
      {/* Google News specific meta tags */}
      {googleNewsMetaTags.map((tag, index) => (
        <meta key={index} {...tag} />
      ))}
      
      {/* Enhanced structured data for Google News */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(googleNewsStructuredData),
        }}
      />
      
      {/* Google News specific link tags */}
      <link rel="canonical" href={articleUrl} />
      <link rel="alternate" type="application/rss+xml" title="GhNewsMedia RSS Feed" href="https://ghnewsmedia.com/rss.xml" />
      
      {/* Preload critical resources for faster loading */}
      <link rel="preload" href={article.featuredImage.startsWith('http') ? article.featuredImage : `https://ghnewsmedia.com${article.featuredImage}`} as="image" />
      
      {/* DNS prefetch for external resources */}
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      
      {/* Critical CSS for above-the-fold content */}
      <style type="text/css">
        {`
          .article-header { font-display: swap; }
          .featured-image { object-fit: cover; width: 100%; height: auto; }
          .article-content { font-display: swap; }
        `}
      </style>
    </Head>
  );
};

export default GoogleNewsSEO;
