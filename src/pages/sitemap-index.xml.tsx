// pages/sitemap-index.xml.tsx - Sitemap Index for better sitelinks
import { fetchAllCategories } from '@/lib/categories';
import { GetServerSideProps } from 'next';

const SitemapIndex = () => null;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  try {
    const { categories } = await fetchAllCategories();
    const baseUrl = 'https://ghnewsmedia.com';
    const currentDate = new Date().toISOString();

    const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  
  <!-- Main sitemap -->
  <sitemap>
    <loc>${baseUrl}/sitemap.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  
  <!-- News sitemap for immediate indexing -->
  <sitemap>
    <loc>${baseUrl}/news-sitemap.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  
  <!-- Category sitemaps for better sitelinks -->
  ${categories
    .map((category) => {
      return `  <sitemap>
    <loc>${baseUrl}/category-sitemap-${category.slug}.xml</loc>
    <lastmod>${category.updated_at || currentDate}</lastmod>
  </sitemap>`;
    })
    .join('\n')}
  
  <!-- Static pages sitemap -->
  <sitemap>
    <loc>${baseUrl}/static-pages-sitemap.xml</loc>
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
