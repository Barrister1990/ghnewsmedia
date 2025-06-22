import { NextSeo } from 'next-seo';
import Head from 'next/head';
import React from 'react';
import AdvancedSEOService from '../../services/advancedSEOService';
import { NewsArticle } from '../../types/news';

interface EnhancedArticleSEOProps {
  article: NewsArticle;
}

const EnhancedArticleSEO: React.FC<EnhancedArticleSEOProps> = ({ article }) => {
  const seoService = AdvancedSEOService.getInstance();
  
  // Generate all SEO data
  const metaTags = seoService.generateSearchMetaTags(article);
  const socialTags = seoService.generateSocialMediaTags(article);
  const structuredData = seoService.generateAdvancedArticleSchema(article);

  return (
    <>
      <NextSeo
        title={metaTags.title}
        description={metaTags.description}
        canonical={metaTags.canonical}
        openGraph={{
          type: socialTags['og:type'] as 'article',
          title: socialTags['og:title'],
          description: socialTags['og:description'],
          url: socialTags['og:url'],
          siteName: socialTags['og:site_name'],
          locale: socialTags['og:locale'],
          images: [
            {
              url: socialTags['og:image'],
              width: parseInt(socialTags['og:image:width']),
              height: parseInt(socialTags['og:image:height']),
              alt: socialTags['og:image:alt'],
              type: socialTags['og:image:type'],
              secureUrl: socialTags['og:image:secure_url'],
            },
          ],
          article: {
            publishedTime: socialTags['article:published_time'],
            modifiedTime: socialTags['article:modified_time'],
            authors: [socialTags['article:author']],
            section: socialTags['article:section'],
            tags: article.tags || [],
          },
        }}
        twitter={{
          handle: socialTags['twitter:creator'],
          site: socialTags['twitter:site'],
          cardType: socialTags['twitter:card'] as 'summary_large_image',
        }}
        additionalMetaTags={[
          {
            name: 'keywords',
            content: metaTags.keywords,
          },
          {
            name: 'author',
            content: metaTags['article:author'],
          },
          {
            name: 'robots',
            content: metaTags.robots,
          },
          {
            name: 'googlebot',
            content: metaTags.googlebot,
          },
          {
            name: 'bingbot',
            content: 'index, follow',
          },
          {
            name: 'geo.region',
            content: metaTags['geo.region'],
          },
          {
            name: 'geo.country',
            content: metaTags['geo.country'],
          },
          {
            name: 'language',
            content: metaTags.language,
          },
          {
            name: 'content-language',
            content: metaTags['content-language'],
          },
          {
            name: 'news_keywords',
            content: metaTags.news_keywords,
          },
          {
            property: 'article:publisher',
            content: 'https://ghnewsmedia.com',
          },
          {
            name: 'twitter:image:alt',
            content: socialTags['twitter:image:alt'],
          },
          {
            name: 'twitter:url',
            content: socialTags['twitter:url'],
          },
          {
            property: 'linkedin:title',
            content: socialTags['linkedin:title'],
          },
          {
            property: 'linkedin:description',
            content: socialTags['linkedin:description'],
          },
          {
            property: 'linkedin:image',
            content: socialTags['linkedin:image'],
          },
        ]}
        additionalLinkTags={[
          {
            rel: 'icon',
            type: 'image/x-icon',
            href: '/favicon.ico',
          },
          {
            rel: 'apple-touch-icon',
            sizes: '180x180',
            href: '/apple-touch-icon.png',
          },
          {
            rel: 'icon',
            type: 'image/png',
            sizes: '32x32',
            href: '/favicon-32x32.png',
          },
          {
            rel: 'icon',
            type: 'image/png',
            sizes: '16x16',
            href: '/favicon-16x16.png',
          },
          {
            rel: 'dns-prefetch',
            href: '//www.google-analytics.com',
          },
          {
            rel: 'dns-prefetch',
            href: '//fonts.googleapis.com',
          },
          {
            rel: 'dns-prefetch',
            href: '//cdn.jsdelivr.net',
          },
          {
            rel: 'preconnect',
            href: 'https://fonts.googleapis.com',
          },
          {
            rel: 'preconnect',
            href: 'https://fonts.gstatic.com',
            crossOrigin: 'anonymous',
          },
        ]}
      />

      <Head>
        {/* Enhanced Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        
        {/* Critical CSS for above-the-fold content */}
        <style type="text/css">
          {`
            .article-header { font-display: swap; }
            .featured-image { object-fit: cover; width: 100%; height: auto; }
          `}
        </style>
      </Head>
    </>
  );
};

export default EnhancedArticleSEO;