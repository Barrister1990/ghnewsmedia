// pages/news-sitemap.xml.tsx - Google News sitemap (articles from the last two days only)
import { buildArticleUrl, PUBLICATION_NAME } from '@/config/site';
import { fetchPublishedArticles } from '@/lib/articles';
import { escapeXml } from '@/utils/escapeXml';
import { GetServerSideProps } from 'next';

const NewsSitemap = () => null;

/** Google allows at most 1,000 <news:news> entries per news sitemap. */
const MAX_NEWS_ENTRIES = 1000;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  try {
    const { articles: recentArticles, error } = await fetchPublishedArticles({
      publishedSince: new Date(Date.now() - 48 * 60 * 60 * 1000),
      limit: MAX_NEWS_ENTRIES,
    });
    if (error) throw new Error(error);

    const publicationName = escapeXml(PUBLICATION_NAME);
    const entries = recentArticles.map((article) => `  <url>
    <loc>${escapeXml(buildArticleUrl(article.category.slug, article.slug))}</loc>
    <news:news>
      <news:publication>
        <news:name>${publicationName}</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${new Date(article.publishedAt).toISOString()}</news:publication_date>
      <news:title>${escapeXml(article.title)}</news:title>
    </news:news>
  </url>`);

    const newsSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${entries.join('\n')}
</urlset>`;

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
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
