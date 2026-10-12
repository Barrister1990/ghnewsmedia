// pages/[category]/[slug].tsx - SEO-Optimized Article Page with Category-based URLs
import { SITE_URL } from '@/config/site';
import ArticleContent from '@/components/ArticleContent';
import ArticleHeader from '@/components/ArticleHeader';
import ArticleNotFound from '@/components/ArticleNotFound';
import ArticleTags from '@/components/ArticleTags';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import ReadAloud from '@/components/ReadAloud';
import ReadingProgress from '@/components/ReadingProgress';
import { MultiplexAd } from '@/components/AdSense';
import AdSlot from '@/components/site/AdSlot';
import ArticleActionBar from '@/components/site/ArticleActionBar';
import MostPopular from '@/components/site/MostPopular';
import SectionHeading from '@/components/site/SectionHeading';
import StoryCard from '@/components/site/StoryCard';
import { AD_SLOTS } from '@/config/adsense';
import ScrollToTop from '@/components/ScrollToTop';
import UnifiedArticleSEO from '@/components/SEO/UnifiedArticleSEO';
import ShareButtons from '@/components/ShareButtons';
import { UserAvatar } from '@/components/UserAvatar';
import { useViewTracking } from '@/hooks/useViewTracking';
import { ArticlePageProps, getArticlePageProps, getArticleStaticPaths } from '@/lib/articlePage';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import { ParsedUrlQuery } from 'querystring';

interface Params extends ParsedUrlQuery {
  category: string;
  slug: string;
}

const ArticlePage = ({ article, relatedArticles, mostPopular }: ArticlePageProps) => {
  useViewTracking(article?.slug || '');

  if (!article) {
    return <ArticleNotFound />;
  }

  const articleUrl = `${SITE_URL}/${article.category.slug}/${article.slug}`;
  const authorProfileUrl = article.author.id ? `/author/${article.author.id}` : '';
  const authorHasDetails = Boolean(article.author.bio || article.author.title || article.author.id);

  return (
    <div className="gp-site min-h-screen bg-white">
      <UnifiedArticleSEO article={article} />

      <ReadingProgress />
      <Header />

      <main id="main-content" className="mx-auto max-w-[1280px] px-4" aria-label={`Article: ${article.title}`}>
        <AdSlot slot={AD_SLOTS.BANNER_TOP} shape="leaderboard" className="my-4" />

        <div className="grid grid-cols-1 gap-10 pt-4 lg:grid-cols-12 lg:pt-6">
          <article className="min-w-0 lg:col-span-8">
            <nav aria-label="Breadcrumb" className="mb-3 text-xs text-gp-muted">
              <Link href="/" className="hover:underline">Home</Link>
              <span aria-hidden className="mx-1.5">/</span>
              <Link href={`/${article.category.slug}`} className="hover:underline">{article.category.name}</Link>
            </nav>

            <ArticleHeader article={article} />

            <div className="my-5 flex flex-wrap items-center justify-between gap-3">
              <ReadAloud articleTitle={article.title} articleContent={article.content} readTime={article.readTime} />
              <ShareButtons url={articleUrl} title={article.title} description={article.excerpt} />
            </div>

            <ArticleContent
              key={article.slug}
              content={article.content}
              featuredImage={article.featuredImage}
              featuredImageAlt={article.title}
              featuredImageCredit={article.featured_image_credit}
              inlineImageCredits={article.inline_image_credits}
              relatedArticles={relatedArticles}
            />

            {article.tags && article.tags.length > 0 && (
              <div className="mt-8">
                <ArticleTags tags={article.tags} />
              </div>
            )}

            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-gp-line pt-5">
              <p className="text-sm font-bold text-gp-ink">Share this story</p>
              <ShareButtons url={articleUrl} title={article.title} description={article.excerpt} />
            </div>

            {authorHasDetails && (
              <section aria-label="About the author" className="mt-8 flex items-start gap-4 border-t-2 border-gp-ink pt-5">
                <UserAvatar src={article.author.avatar} alt={article.author.name} className="h-16 w-16 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-bold text-gp-ink">
                    {authorProfileUrl ? (
                      <Link href={authorProfileUrl} className="hover:underline">{article.author.name}</Link>
                    ) : (
                      article.author.name
                    )}
                  </h2>
                  {article.author.title && <p className="text-sm font-medium text-gp-accent-dark">{article.author.title}</p>}
                  <p className="mt-2 text-sm leading-relaxed text-gp-muted">
                    {article.author.bio || `${article.author.name} is a journalist at Ghana Point covering ${article.category.name.toLowerCase()} and national developments in Ghana.`}
                  </p>
                  {authorProfileUrl && (
                    <Link href={authorProfileUrl} className="mt-2 inline-block text-sm font-bold text-gp-ink underline-offset-2 hover:underline">
                      More from {article.author.name}
                    </Link>
                  )}
                </div>
              </section>
            )}
          </article>

          <aside className="lg:col-span-4">
            <div className="space-y-8 lg:sticky lg:top-24">
              <AdSlot slot={AD_SLOTS.SIDEBAR_TOP} shape="rectangle" />
              <MostPopular articles={mostPopular} />
            </div>
          </aside>
        </div>

        {relatedArticles.length > 0 && (
          <section aria-label="Recommended stories" className="gp-cv mt-12">
            <SectionHeading title="Recommended stories" />
            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedArticles.map((related) => (
                <li key={related.id}>
                  <StoryCard article={related} variant="card" showCategory showDate />
                </li>
              ))}
            </ul>
          </section>
        )}

        <MultiplexAd adSlot={AD_SLOTS.MULTIPLEX_1} className="mt-12" />
      </main>

      <div className="gp-cv">
        <Footer />
      </div>
      <div className="hidden lg:block">
        <ScrollToTop />
      </div>
      <ArticleActionBar url={articleUrl} title={article.title} excerpt={article.excerpt} />
    </div>
  );
};

export const getStaticPaths = getArticleStaticPaths;

export const getStaticProps: GetStaticProps<ArticlePageProps, Params> = async ({ params }) => {
  if (!params?.category || !params.slug) {
    return { notFound: true };
  }
  return getArticlePageProps(params.category, params.slug);
};

export default ArticlePage;
