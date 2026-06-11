// pages/news-sitemap.xml.tsx - Google News Sitemap for immediate indexing
import { buildArticleUrl, PUBLICATION_NAME } from '@/config/site';
import { fetchPublishedArticles } from '@/lib/articles';
import { escapeXml } from '@/utils/escapeXml';
import { GetServerSideProps } from 'next';

const NewsSitemap = () => null;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  try {
    const { articles } = await fetchPublishedArticles();

    // Google News sitemap - only recent articles (within 48 hours / 2 days)
    const recentArticles = articles.filter(article => {
      const articleDate = new Date(article.publishedAt);
      const hoursDiff = (Date.now() - articleDate.getTime()) / (1000 * 60 * 60);
      return hoursDiff <= 48;
    }).sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    const newsSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  ${recentArticles
    .map((article) => {
      const publicationDate = new Date(article.publishedAt).toISOString();
      const title = escapeXml(article.title);
      const keywords = (article.tags || []).filter(Boolean);
      const keywordsBlock = keywords.length > 0
        ? `\n      <news:keywords>${escapeXml(keywords.join(', '))}</news:keywords>`
        : '';

      return `  <url>
    <loc>${buildArticleUrl(article.category.slug, article.slug)}</loc>
    <news:news>
      <news:publication>
        <news:name>${PUBLICATION_NAME}</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${publicationDate}</news:publication_date>
      <news:title>${title}</news:title>${keywordsBlock}
    </news:news>
  </url>`;
    })
    .join('\n')}
</urlset>`;

    res.setHeader('Content-Type', 'text/xml');
    res.setHeader('Cache-Control', 'public, s-maxage=120, stale-while-revalidate=120');
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
