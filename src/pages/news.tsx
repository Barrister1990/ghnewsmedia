import Footer from '@/components/Footer';
import Header from '@/components/Header';
import ScrollToTop from '@/components/ScrollToTop';
import SEOHead from '@/components/SEO/SEOHead';
import { SITE_URL } from '@/config/site';
import { supabase } from '@/integrations/supabase/client';
import { MultiplexAd } from '@/components/AdSense';
import AdSlot from '@/components/site/AdSlot';
import MostPopular from '@/components/site/MostPopular';
import StoryCard from '@/components/site/StoryCard';
import { AD_SLOTS } from '@/config/adsense';
import { ARTICLE_CARD_COLUMNS, ArticleRow, fetchMostPopular, transformToNewsArticle } from '@/lib/articles';
import { NewsArticle } from '@/types/news';
import { GetServerSideProps } from 'next';
import React from 'react';

interface NewsHubProps {
  articles: NewsArticle[];
  mostPopular: NewsArticle[];
  error?: string;
}

const NewsHub: React.FC<NewsHubProps> = ({ articles, mostPopular, error }) => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Ghana News',
    url: `${SITE_URL}/news`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: articles.length,
      itemListElement: articles.slice(0, 12).map((article, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${SITE_URL}/${article.category.slug}/${article.slug}`,
        name: article.title,
      })),
    },
  };

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <SEOHead
          title="News"
          description="Latest headlines from Ghana and beyond."
          noindex
        />
        <Header />
        <main className="container mx-auto px-4 py-12 text-center">
          <p className="text-stone-600">{error}</p>
        </main>
        <Footer />
      </div>
    );
  }

  const [lead, ...rest] = articles;
  const sideStories = rest.slice(0, 3);
  const feed = rest.slice(3);

  return (
    <div className="gp-site min-h-screen bg-white">
      <SEOHead
        title="Ghana News Today - Latest Headlines"
        description="Breaking news and top stories across Ghana — politics, business, sports, tech, entertainment, and more."
        canonical={`${SITE_URL}/news`}
        structuredData={structuredData}
      />
      <Header />
      <main id="main-content" className="mx-auto max-w-[1280px] px-4">
        <AdSlot slot={AD_SLOTS.BANNER_TOP} shape="leaderboard" className="my-4" />

        <header className="mb-6 border-b-2 border-gp-ink pb-4 pt-4">
          <h1 className="flex items-center gap-3 text-[2rem] font-black leading-tight text-gp-ink sm:text-[2.75rem]">
            <span className="h-3 w-3 rounded-full bg-gp-live" aria-hidden />
            Latest News
          </h1>
          <p className="mt-2 text-base text-gp-muted">Breaking news and top stories from Ghana and beyond, as they happen.</p>
        </header>

        {lead && (
          <section aria-label="Top stories" className="mb-6 grid grid-cols-1 gap-6 border-b border-gp-line pb-6 lg:grid-cols-12 lg:gap-8">
            <StoryCard article={lead} variant="lead" preload showExcerpt showDate showCategory headingLevel="h2" className="lg:col-span-8" />
            <ul className="divide-y divide-gp-line self-start lg:col-span-4">
              {sideStories.map((article, i) => (
                <li key={article.id} className={i === 0 ? 'pb-4' : 'py-4'}>
                  <StoryCard article={article} variant={i === 0 ? 'card' : 'list'} showDate showCategory headingLevel="h2" />
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <section aria-label="All latest stories" className="lg:col-span-8">
            {feed.map((article, index) => (
              <React.Fragment key={article.id}>
                {index > 0 && index % 10 === 0 && (
                  <AdSlot slot={AD_SLOTS.HOMEPAGE_MIDDLE} shape="infeed" className="border-b border-gp-line py-5" />
                )}
                <StoryCard article={article} variant="feed" showCategory headingLevel="h2" />
              </React.Fragment>
            ))}
          </section>
          <aside className="lg:col-span-4">
            <div className="space-y-8 lg:sticky lg:top-24">
              <MostPopular articles={mostPopular} />
              <AdSlot slot={AD_SLOTS.SIDEBAR_TOP} shape="rectangle" />
            </div>
          </aside>
        </div>

        {articles.length >= 10 && <MultiplexAd adSlot={AD_SLOTS.MULTIPLEX_1} className="mt-10" />}
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<NewsHubProps> = async (context) => {
  try {
    const mostPopularPromise = fetchMostPopular(5);
    const { data: articlesData, error: articlesError } = await supabase
      .from('articles_with_details')
      .select(ARTICLE_CARD_COLUMNS)
      .eq('status', 'published')
      .not('content', 'is', null)
      .order('published_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false })
      .limit(60);

    if (articlesError) {
      console.error('Error fetching news hub articles:', articlesError);
      context.res.statusCode = 503;
      return {
        props: {
          articles: [],
          mostPopular: [],
          error: 'Failed to load articles.',
        },
      };
    }

    const transformedArticles = ((articlesData || []) as ArticleRow[])
      .filter((article) => article.id && article.title)
      .map(transformToNewsArticle)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    context.res.setHeader('Cache-Control', 'public, s-maxage=120, stale-while-revalidate=300');

    return {
      props: {
        articles: transformedArticles,
        mostPopular: await mostPopularPromise,
      },
    };
  } catch (e) {
    console.error('News hub error:', e);
    context.res.statusCode = 503;
    return {
      props: {
        articles: [],
        mostPopular: [],
        error: 'Something went wrong.',
      },
    };
  }
};

export default NewsHub;
