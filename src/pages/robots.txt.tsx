// pages/robots.txt.tsx
import { SITE_URL } from '@/config/site';
import { GetServerSideProps } from 'next';

const Robots = () => null;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const robotsTxt = `User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: facebookexternalhit
Allow: /

User-agent: *
Allow: /

# Block access to admin and private areas
Disallow: /admin/
Disallow: /cms/
Disallow: /api/
Disallow: /private/

# Sitemaps for better indexing
Sitemap: ${SITE_URL}/sitemap.xml
Sitemap: ${SITE_URL}/sitemap-index.xml
Sitemap: ${SITE_URL}/news-sitemap.xml`;

  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate');
  res.write(robotsTxt);
  res.end();

  return { props: {} };
};

export default Robots;
