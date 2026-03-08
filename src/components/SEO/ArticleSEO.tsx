import { ArticleJsonLd, NextSeo } from 'next-seo';
import React from 'react';
import { NewsArticle } from '../../types/news';

interface ArticleSEOProps {
  article: NewsArticle;
}

const ArticleSEO: React.FC<ArticleSEOProps> = ({ article }) => {
  const siteUrl = 'https://ghnewsmedia.com';
  const articleUrl = `${siteUrl}/${article.category.slug}/${article.slug}`;
  
  // Clean and optimize the title for social media
  const socialTitle = article.title.length > 60 
    ? `${article.title.substring(0, 57)}...` 
    : article.title;
  const pageTitle = `${article.title} | GhNewsMedia`;
  
  // Clean and optimize description from excerpt or content
  const cleanContent = article.content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  const description = article.excerpt 
    ? (article.excerpt.length > 160 ? `${article.excerpt.substring(0, 157)}...` : article.excerpt)
    : (cleanContent.length > 160 ? `${cleanContent.substring(0, 157)}...` : cleanContent);
  
  // Ensure featured image is optimized for social media
  const getFeaturedImage = () => {
    if (!article.featuredImage) {
      return `${siteUrl}/placeholder.svg`;
    }
    
    // If it's already a full URL, return as is
    if (article.featuredImage.startsWith('http')) {
      return article.featuredImage;
    }
    
    // If it's a relative URL, make it absolute
    if (article.featuredImage.startsWith('/')) {
      return `${siteUrl}${article.featuredImage}`;
    }
    
    // Default fallback
    return `${siteUrl}/placeholder.svg`;
  };
  
  const featuredImage = getFeaturedImage();
  
  // Generate keywords from article tags and category
  const keywords = [
    ...(article.tags || []),
    article.category.name,
    'Ghana news',
    'breaking news',
    article.author.name
  ].join(', ');

  return (
    <>
      <NextSeo
        title={pageTitle}
        description={description}
        canonical={articleUrl}
        openGraph={{
          type: 'article',
          title: socialTitle,
          description: description,
          url: articleUrl,
          siteName: 'GhNewsMedia',
          locale: 'en_GB',
          images: [
            {
              url: featuredImage,
              width: 1200,
              height: 630,
              alt: article.title,
              type: 'image/jpeg',
              secureUrl: featuredImage,
            },
          ],
          article: {
            publishedTime: new Date(article.publishedAt).toISOString(),
            modifiedTime: new Date(article.updatedAt || article.publishedAt).toISOString(),
            authors: [article.author.name],
            section: article.category.name,
            tags: article.tags || [],
          },
        }}
        twitter={{
          handle: '@GhNewsMedia',
          site: '@GhNewsMedia',
          cardType: 'summary_large_image',
        }}
        additionalMetaTags={[
          {
            name: 'keywords',
            content: keywords,
          },
          {
            name: 'author',
            content: article.author.name,
          },
          {
            name: 'news_keywords',
            content: (article.tags || []).join(', '),
          },
          {
            name: 'robots',
            content: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
          },
          {
            name: 'googlebot',
            content: 'index, follow',
          },
          // LinkedIn specific tags
          {
            property: 'linkedin:title',
            content: socialTitle,
          },
          {
            property: 'linkedin:description',
            content: description,
          },
          {
            property: 'linkedin:image',
            content: featuredImage,
          },
          // Additional Open Graph image properties
          {
            property: 'og:image:width',
            content: '1200',
          },
          {
            property: 'og:image:height',
            content: '630',
          },
          {
            property: 'og:image:alt',
            content: article.title,
          },
          {
            property: 'og:image:type',
            content: 'image/jpeg',
          },
          {
            property: 'og:image:secure_url',
            content: featuredImage,
          },
          // Article specific properties
          {
            property: 'article:publisher',
            content: siteUrl,
          },
          // Twitter additional properties
          {
            name: 'twitter:image:alt',
            content: article.title,
          },
          {
            name: 'twitter:creator',
            content: '@GhNewsMedia',
          },
          {
            name: 'twitter:url',
            content: articleUrl,
          },
        ]}
      />

      <ArticleJsonLd
        type="NewsArticle"
        url={articleUrl}
        title={article.title}
        description={description}
        images={[featuredImage]}
        datePublished={new Date(article.publishedAt).toISOString()}
        dateModified={new Date(article.updatedAt || article.publishedAt).toISOString()}
        authorName={article.author.name}
        publisherName="GhNewsMedia"
        publisherLogo={`${siteUrl}/logo.png`}
        isAccessibleForFree={true}
      />

      {/* Enhanced structured data for better social media understanding */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            "headline": article.title,
            "description": description,
            "image": {
              "@type": "ImageObject",
              "url": featuredImage,
              "width": 1200,
              "height": 630,
              "alt": article.title
            },
            "datePublished": new Date(article.publishedAt).toISOString(),
            "dateModified": new Date(article.updatedAt || article.publishedAt).toISOString(),
            "author": {
              "@type": "Person",
              "name": article.author.name,
              "url": `${siteUrl}/author/${article.author.id}`
            },
            "publisher": {
              "@type": "NewsMediaOrganization",
              "name": "GhNewsMedia",
              "logo": {
                "@type": "ImageObject",
                "url": `${siteUrl}/logo.png`,
                "width": 200,
                "height": 60
              },
              "url": siteUrl
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": articleUrl
            },
            "articleSection": article.category.name,
            "keywords": keywords,
            "wordCount": cleanContent.split(' ').length,
            "inLanguage": "en-GB",
            "url": articleUrl
          }),
        }}
      />
    </>
  );
};

export default ArticleSEO;