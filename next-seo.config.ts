// next-seo.config.ts
import type { DefaultSeoProps } from 'next-seo';
import { DEFAULT_HOME_DESCRIPTION, DEFAULT_HOME_TITLE, DEFAULT_OG_IMAGE, SITE_DISPLAY_NAME } from './src/config/site';

/**
 * Appended to every page's robots meta. max-image-preview:large is what makes pages eligible
 * for large images in Discover and Top stories. Every NextSeo on the site must pass this, because
 * a page-level NextSeo replaces the default robots tag rather than extending it.
 */
export const ROBOTS_PROPS = {
  maxSnippet: -1,
  maxImagePreview: 'large' as const,
  maxVideoPreview: -1,
};

const SEO: DefaultSeoProps = {
  title: DEFAULT_HOME_TITLE,
  titleTemplate: '%s',
  defaultTitle: DEFAULT_HOME_TITLE,
  description: DEFAULT_HOME_DESCRIPTION,
  // No default canonical/og:url: pages that don't set one must not all claim to be the homepage.
  robotsProps: ROBOTS_PROPS,
  openGraph: {
    type: 'website',
    locale: 'en_GH',
    siteName: SITE_DISPLAY_NAME,
    images: [
      {
        url: DEFAULT_OG_IMAGE.url,
        width: DEFAULT_OG_IMAGE.width,
        height: DEFAULT_OG_IMAGE.height,
        alt: SITE_DISPLAY_NAME,
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
