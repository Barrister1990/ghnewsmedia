// pages/robots.txt.tsx
import { GetServerSideProps } from 'next';

const Robots = () => null;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const baseUrl = 'https://ghnewsmedia.com';
  
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
Disallow: /_next/
Disallow: /private/

# Sitemaps for better indexing and sitelinks
Sitemap: ${baseUrl}/sitemap.xml
Sitemap: ${baseUrl}/sitemap-index.xml
Sitemap: ${baseUrl}/news-sitemap.xml

# RSS Feed for news syndication
Sitemap: ${baseUrl}/rss.xml

# Crawl-delay for respectful crawling
Crawl-delay: 1`;

  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate');
  res.write(robotsTxt);
  res.end();

  return { props: {} };
};

export default Robots;