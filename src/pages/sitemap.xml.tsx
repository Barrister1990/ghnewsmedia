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
    const importantSectionSlugs = ['news', 'entertainment', 'sports', 'business', 'lifestyle', 'tech', 'features', 'opinions'];
    const categoryMap = new Map(categories.map((category) => [category.slug, category]));
    const orderedCategorySlugs = [
      ...importantSectionSlugs.filter((slug) => categoryMap.has(slug)),
      ...categories
        .map((category) => category.slug)
        .filter((slug) => !importantSectionSlugs.includes(slug)),
    ];

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
  
  <!-- Category pages -->
  ${orderedCategorySlugs
    .map((slug) => {
      const category = categoryMap.get(slug);
      if (!category) {
        return '';
      }
      const isPrioritySection = importantSectionSlugs.includes(slug);
      return `  <url>
    <loc>${baseUrl}/${category.slug}</loc>
    <lastmod>${category.updated_at || currentDate}</lastmod>
    <changefreq>${isPrioritySection ? 'hourly' : 'daily'}</changefreq>
    <priority>${isPrioritySection ? '0.9' : '0.8'}</priority>
  </url>`;
    })
    .join('\n')}
  
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
    <loc>${baseUrl}/privacy</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/terms</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/advertise</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <!-- Author pages -->
  <url>
    <loc>${baseUrl}/authors</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>
  <!-- Author detail pages (uncomment if needed) -->
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
      
      const lastmod = new Date(article.updatedAt || article.publishedAt).toISOString();
      const pubDate = new Date(article.publishedAt).toISOString();
      return `  <url>
    <loc>${baseUrl}/${article.category.slug}/${article.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    ${isRecentNews ? `<news:news>
      <news:publication>
        <news:name>GH News</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title>${escapeXml(article.title)}</news:title>
    </news:news>` : ''}
  </url>`;
    })
    .join('\n')}
    
</urlset>`;

    res.setHeader('Content-Type', 'text/xml');
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=120');
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