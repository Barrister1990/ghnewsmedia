// components/SEO/EnhancedSEO.tsx
import { ArticleJsonLd, BreadcrumbJsonLd, NextSeo } from 'next-seo';

interface EnhancedSEOProps {
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
  breadcrumbData?: object[];
  noindex?: boolean;
  language?: string;
}

const EnhancedSEO: React.FC<EnhancedSEOProps> = ({
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
  structuredData,
  breadcrumbData,
  noindex = false,
  language = 'en-GB'
}) => {
  const siteName = 'GhNewsMedia';
  const siteUrl = 'https://ghnewsmedia.com';
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;
  const canonicalUrl = canonical || siteUrl;
  const imageUrl = image || `${siteUrl}/og-image.jpg`;

  const openGraph = {
    type,
    url: canonicalUrl,
    title: fullTitle,
    description,
    site_name: siteName,
    images: [
      {
        url: imageUrl,
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
    ...(type === 'article' && {
      article: {
        publishedTime,
        modifiedTime,
        authors: author ? [author] : [],
        section,
        tags,
      },
    }),
  };

  const twitter = {
    handle: '@GhNewsMedia',
    site: '@GhNewsMedia',
    cardType: 'summary_large_image',
  };

  return (
    <>
      <NextSeo
        title={fullTitle}
        description={description}
        canonical={canonicalUrl}
        noindex={noindex}
        openGraph={openGraph}
        twitter={twitter}
        additionalMetaTags={[
          { name: 'keywords', content: tags?.join(', ') || 'Ghana news, breaking news, politics, business, sports' },
          { name: 'language', content: language },
          { name: 'content-language', content: language },
          { name: 'geo.region', content: 'GH' },
          { name: 'geo.country', content: 'Ghana' },
          { name: 'article:publisher', content: siteUrl },
        ]}
        additionalLinkTags={[
          {
            rel: 'alternate',
            type: 'application/rss+xml',
            href: `${siteUrl}/rss.xml`,
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
          {
            rel: 'dns-prefetch',
            href: '//www.google-analytics.com',
          },
        ]}
      />

      {type === 'article' && publishedTime && (
        <ArticleJsonLd
          url={canonicalUrl}
          title={title}
          images={[imageUrl]}
          datePublished={publishedTime}
          dateModified={modifiedTime}
          authorName={author || 'GhNewsMedia Editorial Team'}
          publisherName={siteName}
          publisherLogo={`${siteUrl}/logo.png`}
          description={description}
        />
      )}

      {breadcrumbData && (
        <BreadcrumbJsonLd
          itemListElements={breadcrumbData}
        />
      )}

      {structuredData && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      )}
    </>
  );
};

export default EnhancedSEO;
