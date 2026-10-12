/**
 * Single SEO component per article page. Outputs one NewsArticle JSON-LD and all meta/link tags.
 */
import { NextSeo } from 'next-seo';
import Head from 'next/head';
import React from 'react';
import { ROBOTS_PROPS } from 'next-seo.config';
import AdvancedSEOService from '../../services/advancedSEOService';
import { NewsArticle } from '../../types/news';

import { SITE_URL } from '@/config/site';

interface UnifiedArticleSEOProps {
  article: NewsArticle;
}

const UnifiedArticleSEO: React.FC<UnifiedArticleSEOProps> = ({ article }) => {
  const seoService = AdvancedSEOService.getInstance();
  const metaTags = seoService.generateSearchMetaTags(article);
  const socialTags = seoService.generateSocialMediaTags(article);
  const structuredData = seoService.generateAdvancedArticleSchema(article);

  return (
    <>
      <NextSeo
        title={metaTags.title}
        description={metaTags.description}
        canonical={metaTags.canonical}
        robotsProps={ROBOTS_PROPS}
        openGraph={{
          type: 'article',
          title: socialTags['og:title'],
          description: socialTags['og:description'],
          url: socialTags['og:url'],
          siteName: socialTags['og:site_name'],
          locale: socialTags['og:locale'],
          images: [{ url: socialTags['og:image'], alt: socialTags['og:image:alt'] }],
          article: {
            publishedTime: socialTags['article:published_time'],
            modifiedTime: socialTags['article:modified_time'],
            authors: article.author.id ? [`${SITE_URL}/author/${article.author.id}`] : [socialTags['article:author']],
            section: socialTags['article:section'],
            tags: article.tags || [],
          },
        }}
        twitter={{
          handle: socialTags['twitter:creator'],
          site: socialTags['twitter:site'],
          cardType: socialTags['twitter:card'],
        }}
        additionalMetaTags={[
          { name: 'keywords', content: metaTags.keywords },
          { name: 'news_keywords', content: metaTags.news_keywords },
          { name: 'author', content: metaTags['article:author'] },
          { name: 'twitter:image:alt', content: socialTags['twitter:image:alt'] },
        ]}
        additionalLinkTags={[
          { rel: 'alternate', type: 'application/rss+xml', href: `${SITE_URL}/rss.xml` },
        ]}
      />
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
    </>
  );
};

export default UnifiedArticleSEO;
