// pages/sitemap.xml.tsx
import { fetchPublishedArticles } from '@/lib/articles';
import { fetchAllCategories } from '@/lib/categories';
import { GetServerSideProps } from 'next';

const Sitemap = () => null;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  try {
    // Fetch data from your database/API
    const { articles } = await fetchPublishedArticles();
    const { categories } = await fetchAllCategories();
    // const { authors } = await fetchAllAuthors(); // Uncomment if you have authors

    const baseUrl = 'https://ghnewsmedia.com';
    const currentDate = new Date().toISOString();

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  
  <!-- Homepage -->
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- Main sections for sitelinks - All main category pages -->
  ${categories
    .filter(cat => ['news', 'entertainment', 'sports', 'business', 'lifestyle', 'tech', 'features', 'opinions'].includes(cat.slug))
    .map((category) => {
      return `  <url>
    <loc>${baseUrl}/${category.slug}</loc>
    <lastmod>${category.updated_at || currentDate}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.9</priority>
  </url>`;
    })
    .join('\n')}
  
  <!-- Search page -->
  <url>
    <loc>${baseUrl}/search</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <!-- Static pages -->
  <url>
    <loc>${baseUrl}/about</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/contact</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/careers</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <!-- Category pages (all categories) -->
  ${categories
    .map((category) => {
      return `  <url>
    <loc>${baseUrl}/${category.slug}</loc>
    <lastmod>${category.updated_at || currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`;
    })
    .join('\n')}
  
  <!-- Author pages (uncomment if needed) -->
  ${/* authors
    .map((author) => {
      return `  <url>
    <loc>${baseUrl}/author/${author.slug || author.id}</loc>
    <lastmod>${author.updated_at || currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
    })
    .join('\n') || */ ''}
  
  <!-- News articles with Google News sitemap -->
  ${articles
    .map((article) => {
      // Check if article is recent (within 3 days for Google News)
      const isRecentNews = new Date(article.updatedAt || article.publishedAt) > 
        new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
      
      return `  <url>
    <loc>${baseUrl}/${article.category.slug}/${article.slug}</loc>
    <lastmod>${article.updatedAt || article.publishedAt}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    ${isRecentNews ? `<news:news>
      <news:publication>
        <news:name>GH News</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${article.updatedAt || article.publishedAt}</news:publication_date>
      <news:title>${escapeXml(article.title)}</news:title>
    </news:news>` : ''}
  </url>`;
    })
    .join('\n')}
    
</urlset>`;

    res.setHeader('Content-Type', 'text/xml');
    res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate');
    res.write(sitemap);
    res.end();

    return { props: {} };
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.statusCode = 500;
    res.end();
    return { props: {} };
  }
};

// Helper function to escape XML characters
function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, function (c) {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case "'": return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

export default Sitemap;