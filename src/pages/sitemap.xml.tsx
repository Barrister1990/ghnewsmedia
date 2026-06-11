// pages/sitemap.xml.tsx
import { SITE_URL } from '@/config/site';
import { fetchPublishedArticles } from '@/lib/articles';
import { fetchAllCategories } from '@/lib/categories';
import { GetServerSideProps } from 'next';

const Sitemap = () => null;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  try {
    const { articles } = await fetchPublishedArticles();
    const { categories } = await fetchAllCategories();

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
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  
  <!-- Homepage -->
  <url>
    <loc>${SITE_URL}</loc>
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
    <loc>${SITE_URL}/${category.slug}</loc>
    <lastmod>${category.updated_at || currentDate}</lastmod>
    <changefreq>${isPrioritySection ? 'hourly' : 'daily'}</changefreq>
    <priority>${isPrioritySection ? '0.9' : '0.8'}</priority>
  </url>`;
    })
    .join('\n')}
  
  <!-- Static pages -->
  <url>
    <loc>${SITE_URL}/about</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${SITE_URL}/contact</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${SITE_URL}/privacy</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${SITE_URL}/terms</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${SITE_URL}/advertise</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${SITE_URL}/authors</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>
  
  <!-- Article pages (news metadata lives in news-sitemap.xml only) -->
  ${articles
    .map((article) => {
      const lastmod = new Date(article.updatedAt || article.publishedAt).toISOString();
      return `  <url>
    <loc>${SITE_URL}/${article.category.slug}/${article.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
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

export default Sitemap;
