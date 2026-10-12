/** Bare canonical domain (no protocol, no www). */
export const SITE_DOMAIN = 'ghanapoint.com';

/** Canonical site URL — must match the domain verified in Search Console. */
export const SITE_URL = `https://${SITE_DOMAIN}`;

/** Previous domain, kept so stored links and legacy URLs can be normalized. */
export const LEGACY_DOMAIN = 'ghnewsmedia.com';

/** Primary language for HTML lang, meta tags, and structured data. */
export const SITE_LANGUAGE = 'en-GH';

/** Google News / Publisher Center publication name — must match exactly. */
export const PUBLICATION_NAME = 'Ghana Point';

/** Display name used in page titles, RSS branding, and user-facing copy. */
export const SITE_DISPLAY_NAME = 'Ghana Point';

/** Structured-data alternate names. */
export const SITE_ALTERNATE_NAMES = ['GhanaPoint'];

/** Default homepage SEO title — aligned with visible H1 and intro copy. */
export const DEFAULT_HOME_TITLE = 'Latest Ghana News Today, Sports & Business | Ghana Point';

/** Default homepage meta description. */
export const DEFAULT_HOME_DESCRIPTION =
  'Get the latest Ghana news today — sports, business, politics, and entertainment. Ghana Point delivers trusted breaking news 24/7 from Accra and across Ghana.';

/** Visible homepage H1 (matches title keywords for relevance). */
export const DEFAULT_HOME_H1 = 'Latest Ghana News Today, Sports & Business';

/** Build a canonical article URL on the canonical domain. */
export function buildArticleUrl(categorySlug: string, articleSlug: string): string {
  return `${SITE_URL}/${categorySlug}/${articleSlug}`;
}

const NON_CANONICAL_ORIGIN = /^https?:\/\/(?:www\.)?(?:ghnewsmedia\.com|ghanapoint\.com)/i;

/** Normalize legacy-domain and www URLs to the canonical host. */
export function normalizeToSiteUrl(url: string): string {
  return url.replace(NON_CANONICAL_ORIGIN, SITE_URL);
}

/** Absolute URL on the canonical host for a path or a (possibly legacy/www) URL. */
export function absoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return normalizeToSiteUrl(pathOrUrl);
  return `${SITE_URL}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`;
}

/** Publisher logo for structured data and Publisher Center (square PNG, 600x600). */
export const PUBLISHER_LOGO = { url: `${SITE_URL}/logo.png`, width: 600, height: 600 };

/** Stand-in image for articles saved without one; never advertise it to search engines. */
export const PLACEHOLDER_FEATURED_IMAGE =
  'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=400&fit=crop';

/** Default share image for pages without their own (1200x630). */
export const DEFAULT_OG_IMAGE = { url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 };

/** Official social profiles — used for Organization `sameAs`; keep in sync with the footer. */
export const SOCIAL_PROFILES = [
  'https://www.facebook.com/profile.php?id=61577876216304',
  'https://x.com/ghnewsmedia',
  'https://www.youtube.com/@ghnewsmedia',
  'https://whatsapp.com/channel/0029Vb66ViJK5cDJ8RjFSR2D',
];

/** Public contact address shown on the About/Contact pages. */
export const CONTACT_EMAIL = 'ghnewsmedia7@gmail.com';

/** True if the URL points at this site (current or legacy domain). */
export function isSiteUrl(url: string): boolean {
  return NON_CANONICAL_ORIGIN.test(url);
}
