// pages/rss.xml.tsx - RSS Feed for news syndication and Google News
import { buildArticleUrl, PUBLICATION_NAME, SITE_LANGUAGE, SITE_URL } from '@/config/site';
import { fetchPublishedArticles } from '@/lib/articles';
import { escapeXml } from '@/utils/escapeXml';
import { GetServerSideProps } from 'next';

const RSSFeed = () => null;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  try {
    const { articles } = await fetchPublishedArticles();
    const currentDate = new Date().toUTCString();

    const sortedArticles = articles.sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

    const items = sortedArticles.slice(0, 50).map((article) => {
      const publicationDate = new Date(article.publishedAt).toUTCString();
      const articleUrl = buildArticleUrl(article.category.slug, article.slug);
      const imageUrl = article.featuredImage.startsWith('http')
        ? article.featuredImage
        : `${SITE_URL}${article.featuredImage.startsWith('/') ? '' : '/'}${article.featuredImage}`;

      const cleanContent = article.content
        .replace(/<[^>]*>/g, '')
        .substring(0, 500) + '...';

      const tagCategories = (article.tags || [])
        .map((tag) => `      <category>${escapeXml(tag)}</category>`)
        .join('\n');

      return `    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${articleUrl}</link>
      <guid isPermaLink="true">${articleUrl}</guid>
      <description><![CDATA[${article.excerpt || cleanContent}]]></description>
      <content:encoded><![CDATA[${article.content}]]></content:encoded>
      <pubDate>${publicationDate}</pubDate>
      <dc:creator>${escapeXml(article.author.name)}</dc:creator>
      <dc:date>${new Date(article.publishedAt).toISOString()}</dc:date>
      <category>${escapeXml(article.category.name)}</category>
${tagCategories}
      <media:content url="${escapeXml(imageUrl)}" medium="image" width="1200" height="630" />
      <media:description type="plain">${escapeXml(article.title)}</media:description>
      <georss:featureName>Ghana</georss:featureName>
      <geo:lat>5.5600</geo:lat>
      <geo:long>-0.2057</geo:long>
    </item>`;
    }).join('\n');

    const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:dc="http://purl.org/dc/elements/1.1/"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:sy="http://purl.org/rss/1.0/modules/syndication/"
     xmlns:georss="http://www.georss.org/georss"
     xmlns:geo="http://www.w3.org/2003/01/geo/wgs84_pos#"
     xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>${escapeXml(PUBLICATION_NAME)}</title>
    <link>${SITE_URL}</link>
    <description>Latest Ghana news today — sports, business, politics, and breaking news from Accra and across Ghana.</description>
    <language>${SITE_LANGUAGE}</language>
    <lastBuildDate>${currentDate}</lastBuildDate>
    <sy:updatePeriod>hourly</sy:updatePeriod>
    <sy:updateFrequency>1</sy:updateFrequency>
    <generator>${escapeXml(PUBLICATION_NAME)} RSS Generator</generator>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

    res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=120');
    res.write(rssFeed);
    res.end();

    return { props: {} };
  } catch (error) {
    console.error('Error generating RSS feed:', error);
    res.statusCode = 500;
    res.end();
    return { props: {} };
  }
};

export default RSSFeed;
