// pages/sitemap-index.xml.tsx - Sitemap Index (Phase 1: only list existing sitemaps)
import { GetServerSideProps } from 'next';

const SitemapIndex = () => null;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  try {
    const baseUrl = 'https://ghnewsmedia.com';
    const currentDate = new Date().toISOString();

    // Only list sitemaps that exist. Add category-sitemap-*.xml and static-pages-sitemap.xml
    // when corresponding routes are implemented (see docs/SEO-IMPLEMENTATION-PLAN.md).
    const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/news-sitemap.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
</sitemapindex>`;

    res.setHeader('Content-Type', 'text/xml');
    res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate');
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
