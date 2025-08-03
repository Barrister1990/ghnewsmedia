import { NextSeo } from 'next-seo';
import Head from 'next/head';
import React from 'react';

interface WebsiteSEOProps {
  title?: string;
  description?: string;
  path?: string;
}

const WebsiteSEO: React.FC<WebsiteSEOProps> = ({ 
  title = "GhNewsMedia - Ghana's Premier Digital News Platform",
  description = "Stay informed with Ghana's leading digital news platform. Get breaking news, politics, business, sports, and entertainment updates from trusted sources.",
  path = ""
}) => {
  const siteUrl = 'https://ghnewsmedia.com';
  const pageUrl = `${siteUrl}${path}`;
  const logoUrl = `${siteUrl}/logo.png`;
  const ogImageUrl = `${siteUrl}/og-image.jpg`;

  const websiteStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "GhNewsMedia",
    "alternateName": "Ghana News Media",
    "url": siteUrl,
    "description": description,
    "inLanguage": "en-GB",
    "potentialAction": [
      {
        "@type": "SearchAction",
        "target": `${siteUrl}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    ]
  };

  const organizationStructuredData = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    "name": "GhNewsMedia",
    "alternateName": "Ghana News Media",
    "url": siteUrl,
    "logo": logoUrl,
    "description": description,
    "foundingDate": "2025",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "GH",
      "addressLocality": "Accra"
    },
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "contactType": "Editorial",
        "email": "ghnewsmedia7@gmail.com"
      }
    ],
"sameAs": [
  "https://x.com/ghnewsmedia?t=Fx80oa-73oEdgyznOxM_Yg&s=09",
  "https://www.facebook.com/profile.php?id=61577876216304&mibextid=ZbWKwL",
  "https://www.instagram.com/ghnewsmedia",
  "https://youtube.com/@ghnewsmedia?si=X7l2KfRAkWHG2bAu",
  "https://whatsapp.com/channel/0029Vb66ViJK5cDJ8RjFSR2D"
]

  };

  // Debug logging for development
  console.log('SEO Debug - Website Page:', {
    title: title,
    canonical: pageUrl,
    path: path
  });

  return (
    <>
      <NextSeo
        title={title}
        description={description}
        canonical={pageUrl}
        openGraph={{
          type: 'website',
          url: pageUrl,
          title: title,
          description: description,
          images: [
            {
              url: ogImageUrl,
              width: 1200,
              height: 630,
              alt: 'GhNewsMedia - Ghana\'s Premier News Source',
            },
          ],
          siteName: 'GhNewsMedia',
          locale: 'en_GB',
        }}
        twitter={{
          handle: '@GhNewsMedia',
          site: '@GhNewsMedia',
          cardType: 'summary_large_image',
        }}
        additionalMetaTags={[
          {
            name: 'keywords',
            content: 'Ghana news, breaking news, politics, business, sports, entertainment, Accra, Kumasi, Cape Coast'
          },
          {
            name: 'robots',
            content: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'
          },
          {
            name: 'geo.region',
            content: 'GH'
          },
          {
            name: 'geo.country',
            content: 'Ghana'
          },
          {
            name: 'language',
            content: 'en-GB'
          }
        ]}
        additionalLinkTags={[
          {
            rel: 'alternate',
            type: 'application/rss+xml',
            href: `${siteUrl}/rss.xml`
          }
        ]}
      />
      
      <Head>
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteStructuredData)
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationStructuredData)
          }}
        />
      </Head>
    </>
  );
};

export default WebsiteSEO;