// pages/sitemap.xml.tsx
import { absoluteUrl, buildArticleUrl, SITE_URL } from '@/config/site';
import { fetchPublishedArticles, PLACEHOLDER_FEATURED_IMAGE } from '@/lib/articles';
import { fetchAllCategories } from '@/lib/categories';
import { escapeXml } from '@/utils/escapeXml';
import { GetServerSideProps } from 'next';

const Sitemap = () => null;

const IMPORTANT_SECTION_SLUGS = ['news', 'entertainment', 'sports', 'business', 'lifestyle', 'tech', 'features', 'opinions'];
const STATIC_PATHS = ['/about', '/contact', '/editorial-policy', '/advertise', '/privacy', '/terms'];

const iso = (date: string) => new Date(date).toISOString();

/** Google only trusts <lastmod> when it reflects a real content change, so omit it when unknown. */
const urlEntry = (loc: string, lastmod?: string, extra = '') => `  <url>
    <loc>${escapeXml(loc)}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}${extra}
  </url>`;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  try {
    const [{ articles, error }, { categories }] = await Promise.all([
      fetchPublishedArticles(),
      fetchAllCategories(),
    ]);
    if (error) throw new Error(error);

    const categoryMap = new Map(categories.map((category) => [category.slug, category]));
    const orderedCategorySlugs = [
      ...IMPORTANT_SECTION_SLUGS.filter((slug) => categoryMap.has(slug)),
      ...categories.map((category) => category.slug).filter((slug) => !IMPORTANT_SECTION_SLUGS.includes(slug)),
    ];

    // Articles are newest-first, so the first one seen per key is the latest.
    const categoryLastmod = new Map<string, string>();
    const authorLastmod = new Map<string, string>();
    for (const article of articles) {
      const published = iso(article.publishedAt);
      if (!categoryLastmod.has(article.category.slug)) categoryLastmod.set(article.category.slug, published);
      if (article.author.id && !authorLastmod.has(article.author.id)) authorLastmod.set(article.author.id, published);
    }
    const newest = articles[0] ? iso(articles[0].publishedAt) : undefined;

    const entries = [
      urlEntry(SITE_URL, newest),
      ...orderedCategorySlugs.map((slug) => urlEntry(`${SITE_URL}/${slug}`, categoryLastmod.get(slug))),
      urlEntry(`${SITE_URL}/authors`, newest),
      ...STATIC_PATHS.map((path) => urlEntry(`${SITE_URL}${path}`)),
      ...Array.from(authorLastmod).map(([authorId, lastmod]) => urlEntry(`${SITE_URL}/author/${authorId}`, lastmod)),
      ...articles.map((article) => {
        const image = article.featuredImage && article.featuredImage !== PLACEHOLDER_FEATURED_IMAGE
          ? `\n    <image:image>\n      <image:loc>${escapeXml(absoluteUrl(article.featuredImage))}</image:loc>\n    </image:image>`
          : '';
        return urlEntry(
          buildArticleUrl(article.category.slug, article.slug),
          iso(article.updatedAt || article.publishedAt),
          image
        );
      }),
    ];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries.join('\n')}
</urlset>`;

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
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
