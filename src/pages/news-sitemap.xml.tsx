// pages/news-sitemap.xml.tsx - Google News Sitemap for immediate indexing
import { fetchPublishedArticles } from '@/lib/articles';
import { GetServerSideProps } from 'next';

const NewsSitemap = () => null;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  try {
    const { articles } = await fetchPublishedArticles();
    const baseUrl = 'https://ghnewsmedia.com';
    const currentDate = new Date().toISOString();

    // Google News sitemap - only recent articles (within 48 hours)
    const recentArticles = articles.filter(article => {
      const articleDate = new Date(article.publishedAt);
      const hoursDiff = (Date.now() - articleDate.getTime()) / (1000 * 60 * 60);
      return hoursDiff <= 48; // Only articles published in last 48 hours
    });

    const newsSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  ${recentArticles
    .map((article) => {
      const publicationDate = new Date(article.publishedAt).toISOString();
      const title = article.title.replace(/[<>&'"]/g, function (c) {
        switch (c) {
          case '<': return '&lt;';
          case '>': return '&gt;';
          case '&': return '&amp;';
          case "'": return '&apos;';
          case '"': return '&quot;';
          default: return c;
        }
      });
      
      return `  <url>
    <loc>${baseUrl}/news/${article.slug}</loc>
    <news:news>
      <news:publication>
        <news:name>GhNewsMedia</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${publicationDate}</news:publication_date>
      <news:title>${title}</news:title>
      <news:keywords>${article.tags.join(', ')}</news:keywords>
      <news:stock_tickers>${article.category.name}</news:stock_tickers>
    </news:news>
  </url>`;
    })
    .join('\n')}
</urlset>`;

    res.setHeader('Content-Type', 'text/xml');
    res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=3600'); // Cache for 30 minutes
    res.write(newsSitemap);
    res.end();

    return { props: {} };
  } catch (error) {
    console.error('Error generating news sitemap:', error);
    res.statusCode = 500;
    res.end();
    return { props: {} };
  }
};

export default NewsSitemap;
