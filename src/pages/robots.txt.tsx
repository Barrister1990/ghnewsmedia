// pages/robots.txt.tsx
import { SITE_URL } from '@/config/site';
import { GetServerSideProps } from 'next';

const Robots = () => null;

// One "*" group only: a crawler obeys just the most specific group that names it,
// so a separate "User-agent: Googlebot" group would silently drop these Disallow rules.
// Private pages (cms, admin, auth) stay crawlable and are kept out of the index by the
// X-Robots-Tag header in next.config.ts; blocking them here would hide that noindex.
export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const robotsTxt = `User-agent: *
Allow: /
Disallow: /api/

Sitemap: ${SITE_URL}/sitemap-index.xml
Sitemap: ${SITE_URL}/sitemap.xml
Sitemap: ${SITE_URL}/news-sitemap.xml
`;

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate');
  res.write(robotsTxt);
  res.end();

  return { props: {} };
};

export default Robots;
