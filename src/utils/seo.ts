import {
  CONTACT_EMAIL,
  PUBLICATION_NAME,
  PUBLISHER_LOGO,
  SITE_ALTERNATE_NAMES,
  SITE_LANGUAGE,
  SITE_URL,
  SOCIAL_PROFILES,
} from '../config/site';

/** Author social handles may be stored as full URLs or bare usernames. */
export const profileUrl = (value: string, base: string) =>
  /^https?:\/\//i.test(value) ? value : `${base}${value.replace(/^@/, '')}`;

/** Publisher entity shared by the homepage Organization schema and every NewsArticle `publisher`. */
export const publisherSchema = () => ({
  "@type": "NewsMediaOrganization",
  "@id": `${SITE_URL}/#organization`,
  "name": PUBLICATION_NAME,
  "url": SITE_URL,
  "logo": {
    "@type": "ImageObject",
    "url": PUBLISHER_LOGO.url,
    "width": PUBLISHER_LOGO.width,
    "height": PUBLISHER_LOGO.height,
  },
  "sameAs": SOCIAL_PROFILES,
});

export const generateOrganizationStructuredData = () => ({
  "@context": "https://schema.org",
  ...publisherSchema(),
  "alternateName": SITE_ALTERNATE_NAMES,
  "description": "Ghana's digital news platform providing credible, timely coverage of politics, business, sports, entertainment and technology.",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "GH",
    "addressLocality": "Accra",
  },
  "contactPoint": [
    {
      "@type": "ContactPoint",
      "contactType": "Editorial",
      "email": CONTACT_EMAIL,
      "url": `${SITE_URL}/contact`,
    },
  ],
  "publishingPrinciples": `${SITE_URL}/editorial-policy`,
  "ethicsPolicy": `${SITE_URL}/editorial-policy#ethics`,
  "correctionsPolicy": `${SITE_URL}/editorial-policy#corrections`,
  "verificationFactCheckingPolicy": `${SITE_URL}/editorial-policy#fact-checking`,
  "actionableFeedbackPolicy": `${SITE_URL}/editorial-policy#feedback`,
  "ownershipFundingInfo": `${SITE_URL}/editorial-policy#ownership`,
  "masthead": `${SITE_URL}/authors`,
});

export const generateWebSiteStructuredData = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  "name": PUBLICATION_NAME,
  "alternateName": SITE_ALTERNATE_NAMES,
  "url": SITE_URL,
  "inLanguage": SITE_LANGUAGE,
  "publisher": { "@id": `${SITE_URL}/#organization` },
});

// Truncate description to 150-160 characters (920 pixels) for optimal display
export const truncateDescription = (text: string, maxLength: number = 155): string => {
  if (!text) return '';
  const cleaned = text.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  if (cleaned.length <= maxLength) return cleaned;
  // Try to truncate at word boundary
  const truncated = cleaned.substring(0, maxLength - 3);
  const lastSpace = truncated.lastIndexOf(' ');
  if (lastSpace > maxLength * 0.7) { // Only use word boundary if it's not too early
    return `${truncated.substring(0, lastSpace).trim()}...`;
  }
  return `${truncated.trim()}...`;
};

// Truncate title to 50-60 characters (580 pixels) for optimal Google display
export const truncateTitle = (title: string, maxLength: number = 55): string => {
  if (title.length <= maxLength) return title;
  // Try to truncate at word boundary
  const truncated = title.substring(0, maxLength - 3);
  const lastSpace = truncated.lastIndexOf(' ');
  if (lastSpace > maxLength * 0.7) { // Only use word boundary if it's not too early
    return `${truncated.substring(0, lastSpace)}...`;
  }
  return `${truncated.trim()}...`;
};

/** Short, unique link label for article cards (avoids overly long duplicate anchor text). */
export const articleLinkAriaLabel = (
  section: string,
  category: string,
  title: string,
  maxTitleLength = 72
): string => {
  const shortTitle = title.length > maxTitleLength
    ? `${title.slice(0, maxTitleLength - 1).trim()}…`
    : title;
  return `${section}: ${category} — ${shortTitle}`;
};

export const generateMetaTitle = (title: string, category?: string): string => {
  const siteName = 'Ghana Point';
  // Remove any existing site name or "|" suffix to avoid duplication
  const cleanTitle = title
    .replace(/\s*\|\s*(?:Ghana\s?Point|GhNewsMedia|GH News Media|GH News)\s*$/i, '')
    .trim();
  
  // Build title with proper truncation to stay within 50-60 characters (580 pixels)
  let fullTitle: string;
  if (category) {
    const categorySuffix = ` | ${category} | ${siteName}`;
    const reservedLength = categorySuffix.length;
    const maxTitleLength = 55 - reservedLength;
    const truncatedTitle = truncateTitle(cleanTitle, maxTitleLength);
    fullTitle = `${truncatedTitle}${categorySuffix}`;
  } else {
    const suffix = ` | ${siteName}`;
    const maxTitleLength = 55 - suffix.length;
    const truncatedTitle = truncateTitle(cleanTitle, maxTitleLength);
    fullTitle = `${truncatedTitle}${suffix}`;
  }
  
  // Final check: ensure total title doesn't exceed 60 characters
  if (fullTitle.length > 60) {
    // Fallback to shorter format
    const truncatedTitle = truncateTitle(cleanTitle, 40);
    return `${truncatedTitle} | ${siteName}`;
  }
  
  return fullTitle;
};
