import { NextSeo } from 'next-seo';
import { ROBOTS_PROPS } from 'next-seo.config';
import React from 'react';
import { DEFAULT_OG_IMAGE, SITE_DISPLAY_NAME, SITE_URL } from '@/config/site';

interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  tags?: string[];
  structuredData?: object;
  /** Keep the page out of the index (error states, thin utility pages). */
  noindex?: boolean;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  canonical,
  image,
  tags,
  structuredData,
  noindex = false,
}) => {
  const siteName = SITE_DISPLAY_NAME;
  // Remove any existing site name from title to avoid duplication
  const cleanTitle = title
    .replace(/\s*\|\s*(?:Ghana\s?Point|GhNewsMedia|GH News Media|GH News)\s*$/i, '')
    .trim();
  const fullTitle = cleanTitle.includes('|') ? cleanTitle : `${cleanTitle} | ${siteName}`;
  const canonicalUrl = canonical || SITE_URL;

  return (
    <>
      <NextSeo
        title={fullTitle}
        description={description}
        canonical={noindex ? undefined : canonicalUrl}
        noindex={noindex}
        robotsProps={noindex ? undefined : ROBOTS_PROPS}
        openGraph={{
          type: 'website',
          title: fullTitle,
          description,
          url: canonicalUrl,
          siteName,
          locale: 'en_GH',
          images: image
            ? [{ url: image, alt: title }]
            : [{ url: DEFAULT_OG_IMAGE.url, width: DEFAULT_OG_IMAGE.width, height: DEFAULT_OG_IMAGE.height, alt: siteName }],
        }}
        twitter={{
          handle: '@ghnewsmedia',
          site: '@ghnewsmedia',
          cardType: 'summary_large_image',
        }}
        additionalMetaTags={[
          {
            name: 'keywords',
            content: tags?.join(', ') || 'Ghana news, breaking news, politics, business, sports',
          },
        ]}
      />

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
