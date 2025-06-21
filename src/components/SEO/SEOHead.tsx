import { ArticleJsonLd, NextSeo } from 'next-seo';
import React from 'react';

interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
  structuredData?: object;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  canonical,
  image,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  section,
  tags,
  structuredData
}) => {
  const siteName = 'GhNewsMedia';
  const siteUrl = 'https://ghnewsmedia.com';
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;
  const canonicalUrl = canonical || siteUrl;
  const imageUrl = image || `${siteUrl}/placeholder.svg`;

  return (
    <>
      <NextSeo
        title={fullTitle}
        description={description}
        canonical={canonicalUrl}
        openGraph={{
          type: type,
          title: fullTitle,
          description: description,
          url: canonicalUrl,
          siteName: siteName,
          locale: 'en_GB',
          images: [
            {
              url: imageUrl,
              alt: title,
            },
          ],
          ...(type === 'article' && {
            article: {
              publishedTime: publishedTime,
              modifiedTime: modifiedTime,
              authors: author ? [author] : undefined,
              section: section,
              tags: tags,
            },
          }),
        }}
        twitter={{
          handle: '@GhNewsMedia',
          site: '@GhNewsMedia',
          cardType: 'summary_large_image',
        }}
        additionalMetaTags={[
          {
            name: 'keywords',
            content: tags?.join(', ') || 'Ghana news, breaking news, politics, business, sports',
          },
          {
            name: 'robots',
            content: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
          },
          {
            name: 'googlebot',
            content: 'index, follow',
          },
          {
            name: 'bingbot',
            content: 'index, follow',
          },
        ]}
        additionalLinkTags={[
          {
            rel: 'canonical',
            href: canonicalUrl,
          },
        ]}
      />

      {/* Article Structured Data */}
      {type === 'article' && publishedTime && (
        <ArticleJsonLd
          url={canonicalUrl}
          title={title}
          description={description}
          images={[imageUrl]}
          datePublished={publishedTime}
          dateModified={modifiedTime || publishedTime}
          authorName={author || 'GhNewsMedia'}
          publisherName={siteName}
          publisherLogo={`${siteUrl}/logo.png`}
        />
      )}

      {/* Custom Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      )}
    </>
  );
};

export default SEOHead;