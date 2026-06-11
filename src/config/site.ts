/** Canonical site URL — must match the domain verified in Search Console (www). */
export const SITE_URL = 'https://www.ghnewsmedia.com';

/** Primary language for HTML lang, meta tags, and structured data. */
export const SITE_LANGUAGE = 'en-GH';

/** Google News / Publisher Center publication name — must match exactly. */
export const PUBLICATION_NAME = 'GH News Media';

/** Display name used in page titles, RSS branding, and user-facing copy. */
export const SITE_DISPLAY_NAME = 'GH News Media';

/** Default homepage SEO title — aligned with visible H1 and intro copy. */
export const DEFAULT_HOME_TITLE = 'Latest Ghana News Today, Sports & Business | GhNewsMedia';

/** Default homepage meta description. */
export const DEFAULT_HOME_DESCRIPTION =
  'Get the latest Ghana news today — sports, business, politics, and entertainment. GhNewsMedia delivers trusted breaking news 24/7 from Accra and across Ghana.';

/** Visible homepage H1 (matches title keywords for relevance). */
export const DEFAULT_HOME_H1 = 'Latest Ghana News Today, Sports & Business';

/** Build a canonical article URL on the verified www domain. */
export function buildArticleUrl(categorySlug: string, articleSlug: string): string {
  return `${SITE_URL}/${categorySlug}/${articleSlug}`;
}

/** Normalize any ghnewsmedia URL to the verified www canonical host. */
export function normalizeToSiteUrl(url: string): string {
  return url.replace(/^https?:\/\/ghnewsmedia\.com/i, SITE_URL);
}
