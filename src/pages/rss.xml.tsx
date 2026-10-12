// pages/rss.xml.tsx - RSS Feed for news syndication and Google News
import { absoluteUrl, buildArticleUrl, PUBLICATION_NAME, PUBLISHER_LOGO, SITE_LANGUAGE, SITE_URL } from '@/config/site';
import { fetchPublishedArticles, PLACEHOLDER_FEATURED_IMAGE } from '@/lib/articles';
import { WEBSUB_HUB_URL } from '@/lib/websub';
import { escapeXml } from '@/utils/escapeXml';
import { GetServerSideProps } from 'next';

const RSSFeed = () => null;

/** A literal "]]>" inside article HTML would end the CDATA section early. */
const cdata = (text: string) => `<![CDATA[${text.replace(/]]>/g, ']]]]><![CDATA[>')}]]>`;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  try {
    const { articles, error } = await fetchPublishedArticles({ columns: '*', limit: 50 });
    if (error) throw new Error(error);
    const currentDate = new Date().toUTCString();

    const items = articles.map((article) => {
      const publicationDate = new Date(article.publishedAt).toUTCString();
      const articleUrl = buildArticleUrl(article.category.slug, article.slug);
      const hasImage = Boolean(article.featuredImage) && article.featuredImage !== PLACEHOLDER_FEATURED_IMAGE;
      const imageUrl = hasImage ? absoluteUrl(article.featuredImage) : '';

      const cleanContent = article.content
        .replace(/<[^>]*>/g, '')
        .substring(0, 500) + '...';
      const mediaBlock = hasImage
        ? `\n      <media:content url="${escapeXml(imageUrl)}" medium="image" />\n      <media:description type="plain">${escapeXml(article.title)}</media:description>`
        : '';

      const tagCategories = (article.tags || [])
        .map((tag) => `      <category>${escapeXml(tag)}</category>`)
        .join('\n');

      return `    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${escapeXml(articleUrl)}</link>
      <guid isPermaLink="true">${escapeXml(articleUrl)}</guid>
      <description>${cdata(article.excerpt || cleanContent)}</description>
      <content:encoded>${cdata(article.content)}</content:encoded>
      <pubDate>${publicationDate}</pubDate>
      <dc:creator>${escapeXml(article.author.name)}</dc:creator>
      <dc:date>${new Date(article.publishedAt).toISOString()}</dc:date>
      <category>${escapeXml(article.category.name)}</category>
${tagCategories}${mediaBlock}
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
    <atom:link href="${WEBSUB_HUB_URL}" rel="hub" />
    <image>
      <url>${PUBLISHER_LOGO.url}</url>
      <title>${escapeXml(PUBLICATION_NAME)}</title>
      <link>${SITE_URL}</link>
    </image>
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
