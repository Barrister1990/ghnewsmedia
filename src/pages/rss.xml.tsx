// pages/rss.xml.tsx - RSS Feed for news syndication and Google News
import { fetchPublishedArticles } from '@/lib/articles';
import { GetServerSideProps } from 'next';

const RSSFeed = () => null;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  try {
    const { articles } = await fetchPublishedArticles();
    const baseUrl = 'https://ghnewsmedia.com';
    const currentDate = new Date().toISOString();

    // Sort articles by publication date (newest first)
    const sortedArticles = articles.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

    const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:wfw="http://wellformedweb.org/CommentAPI/"
     xmlns:dc="http://purl.org/dc/elements/1.1/"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:sy="http://purl.org/rss/1.0/modules/syndication/"
     xmlns:slash="http://purl.org/rss/1.0/modules/slash/"
     xmlns:georss="http://www.georss.org/georss"
     xmlns:geo="http://www.w3.org/2003/01/geo/wgs84_pos#"
     xmlns:media="http://search.yahoo.com/mrss/">
  
  <channel>
    <title>GhNewsMedia - Ghana's Premier Digital News Platform</title>
    <link>${baseUrl}</link>
    <description>Stay informed with Ghana's leading digital news platform. Get breaking news, politics, business, sports, and entertainment updates from trusted journalists across Ghana.</description>
    <language>en-GB</language>
    <lastBuildDate>${currentDate}</lastBuildDate>
    <sy:updatePeriod>hourly</sy:updatePeriod>
    <sy:updateFrequency>1</sy:updateFrequency>
    <generator>GhNewsMedia RSS Generator</generator>
    <webMaster>editor@ghnewsmedia.com</webMaster>
    <managingEditor>editor@ghnewsmedia.com</managingEditor>
    <category>News</category>
    <category>Ghana</category>
    <category>Africa</category>
    
    <!-- Geographic information for better news categorization -->
    <georss:featureName>Ghana</georss:featureName>
    <geo:lat>5.5600</geo:lat>
    <geo:long>-0.2057</geo:long>
    
    <!-- Atom link for feed discovery -->
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
    
    ${sortedArticles
      .slice(0, 50) // Limit to 50 most recent articles
      .map((article) => {
        const publicationDate = new Date(article.publishedAt).toISOString();
        const articleUrl = `${baseUrl}/news/${article.slug}`;
        const imageUrl = article.featuredImage.startsWith('http') 
          ? article.featuredImage 
          : `${baseUrl}${article.featuredImage}`;
        
        // Clean content for RSS (remove HTML tags, limit length)
        const cleanContent = article.content
          .replace(/<[^>]*>/g, '')
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .substring(0, 500) + '...';
        
        return `    <item>
      <title>${article.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</title>
      <link>${articleUrl}</link>
      <guid isPermaLink="true">${articleUrl}</guid>
      <description><![CDATA[${article.excerpt || cleanContent}]]></description>
      <content:encoded><![CDATA[${article.content}]]></content:encoded>
      <pubDate>${publicationDate}</pubDate>
      <dc:creator>${article.author.name}</dc:creator>
      <dc:date>${publicationDate}</dc:date>
      <category>${article.category.name}</category>
      ${article.tags.map(tag => `<category>${tag}</category>`).join('\n      ')}
      
      <!-- Media content for rich RSS -->
      <media:content url="${imageUrl}" medium="image" width="1200" height="630" />
      <media:description type="plain">${article.title}</media:description>
      
      <!-- Geographic information -->
      <georss:featureName>Ghana</georss:featureName>
      <geo:lat>5.5600</geo:lat>
      <geo:long>-0.2057</geo:long>
      
      <!-- Article metadata -->
      <slash:comments>${article.comments?.length || 0}</slash:comments>
      <wfw:commentRss>${baseUrl}/api/comments/${article.id}/rss</wfw:commentRss>
    </item>`;
      })
      .join('\n')}
    
  </channel>
</rss>`;

    res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=3600'); // Cache for 30 minutes
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
