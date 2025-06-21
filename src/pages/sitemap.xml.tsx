// pages/sitemap.xml.tsx
import { fetchPublishedArticles } from '@/lib/articles';
import { GetServerSideProps } from 'next';

const Sitemap = () => null;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const { articles } = await fetchPublishedArticles();
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>https://ghnewsmedia.com</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
      </url>
      ${articles
        .map((article) => {
          return `
            <url>
              <loc>https://ghnewsmedia.com/news/${article.slug}</loc>
              <lastmod>${article.updatedAt}</lastmod>
              <changefreq>weekly</changefreq>
              <priority>0.8</priority>
            </url>
          `;
        })
        .join('')}
    </urlset>`;

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return { props: {} };
};

export default Sitemap;