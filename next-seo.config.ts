// src/next-seo.config.ts
import { DEFAULT_HOME_DESCRIPTION, DEFAULT_HOME_TITLE, SITE_DISPLAY_NAME, SITE_URL } from './src/config/site';

const SEO = {
  title: DEFAULT_HOME_TITLE,
  titleTemplate: '%s',
  defaultTitle: DEFAULT_HOME_TITLE,
  description: DEFAULT_HOME_DESCRIPTION,
  canonical: SITE_URL,
  openGraph: {
    type: 'website',
    locale: 'en_GH',
    url: SITE_URL,
    siteName: SITE_DISPLAY_NAME,
    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: DEFAULT_HOME_TITLE,
      },
    ],
  },
  twitter: {
    handle: '@ghnewsmedia',
    site: '@ghnewsmedia',
    cardType: 'summary_large_image',
  },
};

export default SEO;
