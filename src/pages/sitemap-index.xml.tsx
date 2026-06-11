// pages/sitemap-index.xml.tsx - Sitemap Index
import { SITE_URL } from '@/config/site';
import { GetServerSideProps } from 'next';

const SitemapIndex = () => null;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  try {
    const currentDate = new Date().toISOString();

    const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${SITE_URL}/sitemap.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${SITE_URL}/news-sitemap.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
</sitemapindex>`;

    res.setHeader('Content-Type', 'text/xml');
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=120');
    res.write(sitemapIndex);
    res.end();

    return { props: {} };
  } catch (error) {
    console.error('Error generating sitemap index:', error);
    res.statusCode = 500;
    res.end();
    return { props: {} };
  }
};

export default SitemapIndex;
