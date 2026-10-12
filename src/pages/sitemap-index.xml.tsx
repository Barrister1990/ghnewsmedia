// pages/sitemap-index.xml.tsx - Sitemap Index
import { SITE_URL } from '@/config/site';
import { GetServerSideProps } from 'next';

const SitemapIndex = () => null;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  // <lastmod> is optional here; a fake "now" on every request would only teach Google to ignore it.
  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${SITE_URL}/sitemap.xml</loc>
  </sitemap>
  <sitemap>
    <loc>${SITE_URL}/news-sitemap.xml</loc>
  </sitemap>
</sitemapindex>`;

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=600');
  res.write(sitemapIndex);
  res.end();

  return { props: {} };
};

export default SitemapIndex;
