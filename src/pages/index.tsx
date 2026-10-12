import { GetStaticProps } from 'next';
import Link from 'next/link';
import React from 'react';
import { MultiplexAd } from '../components/AdSense';
import Footer from '../components/Footer';
import Header from '../components/Header';
import ScrollToTop from '../components/ScrollToTop';
import SEOHead from '../components/SEO/SEOHead';
import AdSlot from '../components/site/AdSlot';
import MostPopular from '../components/site/MostPopular';
import SectionHeading from '../components/site/SectionHeading';
import StoryCard, { storyHref } from '../components/site/StoryCard';
import TimeAgo from '../components/site/TimeAgo';
import { UserAvatar } from '../components/UserAvatar';
import { AD_SLOTS } from '../config/adsense';
import { DEFAULT_HOME_DESCRIPTION, DEFAULT_HOME_H1, DEFAULT_HOME_TITLE, SITE_URL } from '../config/site';
import { fetchLatestInCategories, fetchMostPopular, fetchPublishedArticles } from '../lib/articles';
import { NewsArticle } from '../types/news';
import { generateOrganizationStructuredData, generateWebSiteStructuredData } from '../utils/seo';

const HOMEPAGE_REVALIDATE_SECONDS = 60;
const FEED_LENGTH = 16;
const FEED_AD_EVERY = 6;
const SECTION_ORDER = ['sports', 'entertainment', 'business', 'features', 'tech', 'lifestyle'];

interface IndexProps {
  articles: NewsArticle[];
  mostPopular: NewsArticle[];
  opinions: NewsArticle[];
}

/** Takes stories from `pool` that are not already on the page, marking them as used. */
const take = (pool: NewsArticle[], used: Set<string>, count: number, predicate: (a: NewsArticle) => boolean = () => true) => {
  const picked: NewsArticle[] = [];
  for (const article of pool) {
    if (picked.length >= count) break;
    if (used.has(article.id) || !predicate(article)) continue;
    used.add(article.id);
    picked.push(article);
  }
  return picked;
};

/** Most-used tags across recent stories, each linking to its newest story. */
const trendingTopics = (articles: NewsArticle[]) => {
  const counts = new Map<string, { count: number; href: string; label: string }>();
  for (const article of articles) {
    for (const tag of article.tags) {
      const key = tag.trim().toLowerCase();
      if (!key) continue;
      const entry = counts.get(key);
      if (entry) entry.count += 1;
      else counts.set(key, { count: 1, href: storyHref(article), label: tag.trim() });
    }
  }
  return [...counts.values()]
    .filter((t) => t.count > 1)
    .sort((a, b) => b.count - a.count)
    .slice(0, 6)
    .map((t) => ({ name: t.label, href: t.href }));
};

const OpinionCard = ({ article }: { article: NewsArticle }) => (
  <article className="flex gap-3 border-b border-gp-line py-3 first:pt-0 last:border-b-0">
    <UserAvatar src={article.author.avatar} alt={article.author.name} className="h-14 w-14 shrink-0" />
    <div className="min-w-0">
      <p className="text-xs font-bold text-gp-muted">
        <span className="mr-1 text-lg leading-none text-gp-accent" aria-hidden>“</span>
        Opinion by {article.author.name}
      </p>
      <Link href={storyHref(article)} className="gp-headline-link">
        <h3 className="gp-headline mt-1 text-[0.98rem] font-bold leading-snug text-gp-ink">{article.title}</h3>
      </Link>
    </div>
  </article>
);

const Index: React.FC<IndexProps> = ({ articles, mostPopular, opinions }) => {
  const used = new Set<string>();
  const byFeaturedFirst = [...articles].sort((a, b) => Number(b.featured) - Number(a.featured));

  const [lead] = take(byFeaturedFirst, used, 1);
  const secondary = take(byFeaturedFirst, used, 4);
  const updates = take(articles, used, 5);
  const mustRead = take(articles, used, 3, (a) => a.trending || a.featured);
  if (mustRead.length < 3) mustRead.push(...take(articles, used, 3 - mustRead.length));
  const moreHeadlines = take(articles, used, 3);
  const opinionPicks = opinions.filter((a) => !used.has(a.id)).slice(0, 3);
  opinionPicks.forEach((a) => used.add(a.id));
  const band = take(articles, used, 4, (a) => a.trending || a.featured);
  if (band.length < 4) band.push(...take(articles, used, 4 - band.length));
  const topIds = new Set(used);
  const feed = take(articles, used, FEED_LENGTH);

  // Prefer stories not already in the feed; fall back to feed stories for thin sections.
  const sections = SECTION_ORDER.map((slug) => {
    const inSection = articles.filter((a) => a.category.slug === slug && !topIds.has(a.id));
    const stories = [
      ...inSection.filter((a) => !used.has(a.id)),
      ...inSection.filter((a) => used.has(a.id)),
    ].slice(0, 4);
    return { slug, name: stories[0]?.category.name ?? slug, stories };
  }).filter((s) => s.stories.length >= 3);

  const combinedStructuredData = [
    generateOrganizationStructuredData(),
    generateWebSiteStructuredData(),
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": articles.slice(0, 10).map((article, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `${SITE_URL}${storyHref(article)}`,
        "name": article.title,
      })),
    },
  ];

  return (
    <div className="gp-site min-h-screen bg-white">
      <SEOHead
        title={DEFAULT_HOME_TITLE}
        description={DEFAULT_HOME_DESCRIPTION}
        canonical={SITE_URL}
        tags={['Ghana news', 'breaking news', 'politics', 'business', 'sports', 'entertainment', 'Accra news', 'Ghana politics', 'Ghana economy']}
        structuredData={combinedStructuredData}
      />

      <Header trending={trendingTopics(articles)} />

      <main id="main-content" className="mx-auto max-w-[1280px] px-4">
        <h1 className="sr-only">{DEFAULT_HOME_H1}</h1>

        <AdSlot slot={AD_SLOTS.BANNER_TOP} shape="leaderboard" className="my-4" />

        {/* Featured content */}
        {lead && (
          <section aria-label="Featured content" className="grid grid-cols-1 gap-6 pt-4 lg:grid-cols-12 lg:gap-8 lg:pt-6">
            <div className="lg:col-span-7">
              <StoryCard article={lead} variant="lead" preload showExcerpt showCategory headingLevel="h2" />

              {updates.length > 0 && (
                <div className="mt-5 border-t border-gp-line pt-4">
                  <p className="mb-2 flex items-center gap-2 text-sm font-black uppercase tracking-wide text-gp-ink">
                    <span className="h-2.5 w-2.5 rounded-full bg-gp-live" aria-hidden />
                    Latest updates
                  </p>
                  <ul className="border-l-2 border-gp-line pl-4">
                    {updates.map((article) => (
                      <li key={article.id} className="relative pb-3 last:pb-0">
                        <span className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-gp-live" aria-hidden />
                        <TimeAgo date={article.publishedAt} className="block text-xs font-bold text-gp-live" />
                        <Link href={storyHref(article)} className="text-[0.95rem] font-bold leading-snug text-gp-ink hover:underline">
                          {article.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="lg:col-span-5">
              <ul className="divide-y divide-gp-line border-t border-gp-line lg:border-t-0">
                {secondary.map((article, i) => (
                  <li key={article.id} className={`py-4 ${i === 0 ? 'lg:pt-0' : ''}`}>
                    {i === 0 ? (
                      <StoryCard article={article} variant="card" showExcerpt showCategory className="hidden sm:block" />
                    ) : null}
                    <StoryCard article={article} variant="list" showDate showCategory className={i === 0 ? 'sm:hidden' : ''} />
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Must Read / More Headlines / Opinion */}
        <section aria-label="Top stories" className="mt-8 grid grid-cols-1 gap-8 border-t border-gp-line pt-6 md:grid-cols-3">
          {mustRead.length > 0 && (
            <div>
              <SectionHeading title="Must Read" />
              <StoryCard article={mustRead[0]} variant="card" showCategory />
              <ul className="mt-3 divide-y divide-gp-line">
                {mustRead.slice(1).map((article) => (
                  <li key={article.id} className="py-3">
                    <StoryCard article={article} variant="list" />
                  </li>
                ))}
              </ul>
            </div>
          )}
          {moreHeadlines.length > 0 && (
            <div>
              <SectionHeading title="More Headlines" href="/news" />
              <StoryCard article={moreHeadlines[0]} variant="card" showCategory />
              <ul className="mt-3 divide-y divide-gp-line">
                {moreHeadlines.slice(1).map((article) => (
                  <li key={article.id} className="py-3">
                    <StoryCard article={article} variant="list" />
                  </li>
                ))}
              </ul>
            </div>
          )}
          {opinionPicks.length > 0 && (
            <div>
              <SectionHeading title="Opinion" href="/opinions" />
              {opinionPicks.map((article) => (
                <OpinionCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Dark featured band */}
      {band.length > 0 && (
        <section aria-label="Featured" className="mt-10 bg-gp-dark py-8">
          <div className="mx-auto max-w-[1280px] px-4">
            <SectionHeading title="Featured" dark />
            <ul className="gp-no-scrollbar -mx-4 flex snap-x gap-4 overflow-x-auto px-4 md:mx-0 md:grid md:grid-cols-4 md:overflow-visible md:px-0">
              {band.map((article) => (
                <li key={article.id} className="w-[72%] shrink-0 snap-start sm:w-[45%] md:w-auto">
                  <StoryCard article={article} variant="overlay" showDate />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <div className="mx-auto max-w-[1280px] px-4">
        {/* Content feed + Most popular rail */}
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
          <section aria-labelledby="content-feed-heading" className="lg:col-span-8">
            <h2 id="content-feed-heading" className="sr-only">Content Feed</h2>
            <SectionHeading title="Latest News" href="/news" as="h3" className="mb-0" />
            {feed.map((article, index) => (
              <React.Fragment key={article.id}>
                <StoryCard article={article} variant="feed" showCategory />
                {(index + 1) % FEED_AD_EVERY === 0 && index < feed.length - 1 && (
                  <AdSlot slot={AD_SLOTS.HOMEPAGE_MIDDLE} shape="infeed" className="border-b border-gp-line py-5" />
                )}
              </React.Fragment>
            ))}
            <div className="mt-6 text-center">
              <Link href="/news" className="inline-block border-2 border-gp-ink px-8 py-2.5 text-sm font-bold hover:bg-gp-ink hover:text-white">
                Show more
              </Link>
            </div>
          </section>

          <aside className="lg:col-span-4">
            <div className="space-y-8 lg:sticky lg:top-24">
              <MostPopular articles={mostPopular} />
              <AdSlot slot={AD_SLOTS.SIDEBAR_TOP} shape="rectangle" />
            </div>
          </aside>
        </div>

        {/* Section blocks */}
        {sections.map((section) => (
          <section key={section.slug} aria-label={section.name} className="mt-12">
            <SectionHeading title={section.name} href={`/${section.slug}`} />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
              <StoryCard article={section.stories[0]} variant="card" showExcerpt className="md:col-span-2" />
              <ul className="self-start divide-y divide-gp-line md:col-span-2">
                {section.stories.slice(1).map((article) => (
                  <li key={article.id} className="py-4 first:pt-0">
                    <StoryCard article={article} variant="list" showDate />
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ))}

        {articles.length >= 10 && <MultiplexAd adSlot={AD_SLOTS.MULTIPLEX_1} className="mt-12" />}
      </div>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export const getStaticProps: GetStaticProps<IndexProps> = async () => {
  const [{ articles, error }, mostPopular, opinions] = await Promise.all([
    fetchPublishedArticles({ limit: 50 }),
    fetchMostPopular(10),
    fetchLatestInCategories(['opinions'], 3),
  ]);

  // Throwing keeps serving the last good cached homepage instead of caching an error.
  if (error) {
    throw new Error(`Failed to load homepage articles: ${error}`);
  }

  return {
    props: { articles, mostPopular, opinions },
    revalidate: HOMEPAGE_REVALIDATE_SECONDS,
  };
};

export default Index;
