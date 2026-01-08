// components/SEO/EnhancedSEO.tsx
import { ArticleJsonLd, BreadcrumbJsonLd, NextSeo } from 'next-seo';
import { truncateDescription, truncateTitle } from '@/utils/seo';

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
  const siteName = 'GH News';
  const siteUrl = 'https://ghnewsmedia.com';
  // Remove any existing site name from title to avoid duplication
  const cleanTitle = title.replace(/\s*\|\s*GhNewsMedia\s*$/i, '').replace(/\s*\|\s*GH News\s*$/i, '').trim();
  
  // Build title with proper truncation to stay within 50-60 characters (580 pixels)
  let fullTitle: string;
  if (cleanTitle.includes('|')) {
    // If title already has separator, truncate the whole thing
    fullTitle = truncateTitle(cleanTitle, 55);
  } else {
    // Add site name and truncate to fit within limit
    const suffix = ` | ${siteName}`;
    const maxTitleLength = 55 - suffix.length;
    const truncatedTitle = truncateTitle(cleanTitle, maxTitleLength);
    fullTitle = `${truncatedTitle}${suffix}`;
  }
  
  // Ensure description is within 150-160 characters (920 pixels)
  const optimizedDescription = truncateDescription(description, 155);
  
  const canonicalUrl = canonical || siteUrl;
  const imageUrl = image || `${siteUrl}/og-image.jpg`;

  const openGraph = {
    type,
    url: canonicalUrl,
    title: fullTitle,
    description: optimizedDescription,
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
        description={optimizedDescription}
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
          authorName={author || 'GH News Editorial Team'}
          publisherName="GH News"
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
