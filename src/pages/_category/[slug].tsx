import React from 'react';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Pagination, { pageHref, parsePageParam } from '@/components/Pagination';
import ScrollToTop from '@/components/ScrollToTop';
import BreadcrumbSEO from '@/components/SEO/BreadcrumbSEO';
import SEOHead from '@/components/SEO/SEOHead';
import { MultiplexAd } from '@/components/AdSense';
import { AD_SLOTS } from '@/config/adsense';
import { SITE_URL } from '@/config/site';
import { supabase } from '@/integrations/supabase/client';
import { categorySectionHeading, categorySlugCandidates } from '@/lib/categorySlugAliases';
import { ARTICLE_CARD_COLUMNS, ArticleRow, fetchMostPopular, transformToNewsArticle } from '@/lib/articles';
import AdSlot from '@/components/site/AdSlot';
import MostPopular from '@/components/site/MostPopular';
import StoryCard from '@/components/site/StoryCard';
import { Category, NewsArticle } from '@/types/news';
import { generateMetaTitle, truncateDescription } from '@/utils/seo';
import { GetServerSideProps } from 'next';
import Link from 'next/link';

interface CategoryPageProps {
  category: Category | null;
  articles: NewsArticle[];
  totalArticles: number;
  error?: string;
  /** Public URL segment (e.g. `lifestyle` → may resolve DB slug `entertainment`). */
  urlSlug: string;
  currentPage: number;
  totalPages: number;
  mostPopular: NewsArticle[];
}

const ARTICLES_PER_PAGE = 30;

const CATEGORY_SEO_TITLE_BY_SLUG: Record<string, string> = {
  news: 'Ghana News Today - Latest Headlines | Ghana Point',
  sports: 'Ghana Sports News - Black Stars, Football Updates | Ghana Point',
  business: 'Ghana Business & Economy News | Ghana Point',
  entertainment: 'Ghana Entertainment News, Celebrities | Ghana Point',
  lifestyle: 'Ghana Lifestyle News | Ghana Point',
  tech: 'Ghana Tech News, Innovation & Digital | Ghana Point',
  technology: 'Ghana Tech News, Innovation & Digital | Ghana Point',
  politics: 'Ghana Politics News - Parliament, Government | Ghana Point',
  health: 'Ghana Health News | Ghana Point',
  feature: 'Featured Stories | Ghana Point',
  features: 'Featured Stories | Ghana Point',
  opinions: 'Opinion & Analysis | Ghana Point',
  opinion: 'Opinion & Analysis | Ghana Point',
};

const CategoryPage: React.FC<CategoryPageProps> = ({
  category,
  articles,
  totalArticles,
  error,
  urlSlug,
  currentPage,
  totalPages,
  mostPopular,
}) => {
  const canShowCategoryAds = articles.length >= 8;
  // Handle error state
  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <SEOHead
          title="Error"
          description="An error occurred while loading the category page."
          noindex
        />
        <div className="text-center px-4">
          <h1 style={{ color: '#111111', fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>
            Something went wrong
          </h1>
          <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '24px' }}>
            {error}
          </p>
          <Link
            href="/" 
            style={{ 
              backgroundColor: '#1A365D', 
              color: '#FFFFFF', 
              padding: '12px 24px', 
              borderRadius: '4px',
              fontSize: '14px',
              display: 'inline-block',
              textDecoration: 'none'
            }}
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  // Handle category not found
  if (!category) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <SEOHead
          title="Category Not Found"
          description="The category you're looking for could not be found. Browse our news categories and latest updates from Ghana."
          noindex
        />
        <div className="text-center px-4">
          <h1 style={{ color: '#111111', fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>
            Category Not Found
          </h1>
          <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '24px' }}>
            Sorry, the category you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/" 
            style={{ 
              backgroundColor: '#1A365D', 
              color: '#FFFFFF', 
              padding: '12px 24px', 
              borderRadius: '4px',
              fontSize: '14px',
              display: 'inline-block',
              textDecoration: 'none'
            }}
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const sectionHeading = categorySectionHeading(urlSlug, category.name);

  const breadcrumbItems = [
    { name: 'Home', url: SITE_URL },
    { name: sectionHeading },
  ];

  const canonicalUrl = `${SITE_URL}${pageHref(`/${urlSlug}`, currentPage)}`;

  const categoryStructuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${category.name} News`,
    "description": category.description,
    "url": canonicalUrl,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": totalArticles,
      "itemListElement": articles.slice(0, 10).map((article, index) => ({
        "@type": "NewsArticle",
        "position": (currentPage - 1) * ARTICLES_PER_PAGE + index + 1,
        "headline": article.title,
        "url": `${SITE_URL}/${article.category.slug}/${article.slug}`,
        "datePublished": new Date(article.publishedAt).toISOString(),
        "author": {
          "@type": "Person",
          "name": article.author.name
        }
      }))
    }
  };

  // Later pages get a short, unique title so the page number survives truncation.
  const categorySeoTitle =
    currentPage > 1
      ? generateMetaTitle(`${sectionHeading} News – Page ${currentPage}`)
      : CATEGORY_SEO_TITLE_BY_SLUG[urlSlug.toLowerCase()] ||
        CATEGORY_SEO_TITLE_BY_SLUG[category.slug] ||
        generateMetaTitle(`${sectionHeading} News`, 'Category');

  const pagePrefix = currentPage > 1 ? `Page ${currentPage} of ${totalPages}: ` : '';

  const [lead, ...rest] = articles;
  const showLeadBlock = currentPage === 1 && articles.length >= 4;
  const sideStories = showLeadBlock ? rest.slice(0, 3) : [];
  const feed = showLeadBlock ? rest.slice(3) : articles;

  return (
    <div className="gp-site min-h-screen bg-white">
      <SEOHead
        title={categorySeoTitle}
        description={truncateDescription(`${pagePrefix}${category.description} Stay updated with the latest ${category.name.toLowerCase()} news from Ghana.`)}
        canonical={canonicalUrl}
        tags={[`${category.name} news`, 'Ghana news', category.name.toLowerCase(), 'breaking news']}
        structuredData={categoryStructuredData}
      />

      <Header />

      <main id="main-content" className="mx-auto max-w-[1280px] px-4 pb-4">
        <AdSlot slot={AD_SLOTS.BANNER_TOP} shape="leaderboard" className="my-4" />

        <div className="pt-4">
          <BreadcrumbSEO items={breadcrumbItems} />
        </div>

        <header className="mb-6 border-b-2 border-gp-ink pb-4">
          <h1 className="text-[2rem] font-black leading-tight text-gp-ink sm:text-[2.75rem]">
            {sectionHeading}
            {currentPage > 1 && <span className="ml-3 align-middle text-base font-bold text-gp-muted">Page {currentPage}</span>}
          </h1>
          {category.description && currentPage === 1 && (
            <p className="mt-2 max-w-3xl text-base leading-relaxed text-gp-muted">{category.description}</p>
          )}
        </header>

        {articles.length === 0 ? (
          <p className="py-16 text-center text-gp-muted">No articles found in this category yet. Check back soon.</p>
        ) : (
          <>
            {showLeadBlock && (
              <section aria-label={`Top ${sectionHeading} stories`} className="mb-6 grid grid-cols-1 gap-6 border-b border-gp-line pb-6 lg:grid-cols-12 lg:gap-8">
                <StoryCard article={lead} variant="lead" preload showExcerpt showDate headingLevel="h2" className="lg:col-span-8" />
                <ul className="divide-y divide-gp-line self-start lg:col-span-4">
                  {sideStories.map((article, i) => (
                    <li key={article.id} className={i === 0 ? 'pb-4' : 'py-4'}>
                      <StoryCard article={article} variant={i === 0 ? 'card' : 'list'} showDate headingLevel="h2" />
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              <section aria-label={`Latest ${sectionHeading} news`} className="lg:col-span-8">
                {feed.map((article, index) => (
                  <React.Fragment key={article.id}>
                    {canShowCategoryAds && index === 7 && <MultiplexAd adSlot={AD_SLOTS.MULTIPLEX_1} />}
                    {index > 0 && index % 10 === 0 && (
                      <AdSlot slot={AD_SLOTS.HOMEPAGE_MIDDLE} shape="infeed" className="border-b border-gp-line py-5" />
                    )}
                    <StoryCard article={article} variant="feed" preload={!showLeadBlock && index === 0} headingLevel="h2" />
                  </React.Fragment>
                ))}
                <Pagination basePath={`/${urlSlug}`} currentPage={currentPage} totalPages={totalPages} />
              </section>

              <aside className="lg:col-span-4">
                <div className="space-y-8 lg:sticky lg:top-24">
                  <MostPopular articles={mostPopular} />
                  <AdSlot slot={AD_SLOTS.SIDEBAR_TOP} shape="rectangle" />
                </div>
              </aside>
            </div>

            {canShowCategoryAds && <MultiplexAd adSlot={AD_SLOTS.MULTIPLEX_1} className="mt-10" />}
          </>
        )}
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<CategoryPageProps> = async (context) => {
  const { slug, page: pageParam } = context.query;
  
  // Ensure slug is a string
  if (!slug || typeof slug !== 'string') {
    return {
      notFound: true,
    };
  }

  // Only "?page=N" with N >= 2 is a distinct URL; anything else collapses to the base page.
  const currentPage = parsePageParam(pageParam);
  if (currentPage === null) {
    return {
      redirect: { destination: `/${slug}`, permanent: true },
    };
  }

  try {
    let categoryData: Record<string, unknown> | null = null;

    for (const candidateSlug of categorySlugCandidates(slug)) {
      const { data, error } = await supabase.from('categories').select('*').eq('slug', candidateSlug).maybeSingle();

      if (!error && data) {
        categoryData = data as Record<string, unknown>;
        break;
      }
    }

    if (!categoryData) {
      return {
        notFound: true,
      };
    }

    // One URL per section: aliases and odd casing (/feature, /Sports) 301 to the real slug.
    const canonicalSlug = String(categoryData.slug);
    if (canonicalSlug !== slug) {
      return {
        redirect: { destination: pageHref(`/${canonicalSlug}`, currentPage), permanent: true },
      };
    }

    // Transform category data
    const categoryId = String(categoryData.id);

    const category: Category = {
      id: categoryId,
      name: String(categoryData.name),
      slug: String(categoryData.slug),
      description: String(categoryData.description || ''),
      color: String(categoryData.color),
      icon: String(categoryData.icon || '📰'),
      updated_at: String(categoryData.updated_at ?? ''),
    };

    // Fetch one page of articles for this category, plus the total count
    const offset = (currentPage - 1) * ARTICLES_PER_PAGE;
    const mostPopularPromise = fetchMostPopular(5);
    const { data: articlesData, error: articlesError, count } = await supabase
      .from('articles_with_details')
      .select(ARTICLE_CARD_COLUMNS, { count: 'exact' })
      .eq('status', 'published')
      .eq('category_id', categoryId)
      .not('content', 'is', null)
      .order('published_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false })
      .order('id', { ascending: true })
      .range(offset, offset + ARTICLES_PER_PAGE - 1);

    const totalArticles = count ?? 0;
    const totalPages = Math.max(1, Math.ceil(totalArticles / ARTICLES_PER_PAGE));

    // PGRST103: requested range starts past the last row.
    if (articlesError?.code === 'PGRST103' || (!articlesError && currentPage > totalPages)) {
      return {
        notFound: true,
      };
    }

    if (articlesError) {
      console.error('Error fetching articles:', articlesError);
      context.res.statusCode = 503;
      return {
        props: {
          category,
          articles: [],
          totalArticles: 0,
          error: 'Failed to load articles',
          urlSlug: slug,
          currentPage,
          totalPages: 1,
          mostPopular: [],
        },
      };
    }

    // Transform articles
    const transformedArticles = ((articlesData || []) as ArticleRow[])
      .filter(article => article.id && article.title)
      .map(transformToNewsArticle);

    // Set cache headers for better performance
    context.res.setHeader(
      'Cache-Control',
      'public, s-maxage=300, stale-while-revalidate=600'
    );

    const mostPopular = await mostPopularPromise;

    return {
      props: {
        category,
        articles: transformedArticles,
        totalArticles,
        urlSlug: slug,
        currentPage,
        totalPages,
        mostPopular,
      },
    };

  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    context.res.statusCode = 503;
    return {
      props: {
        category: null,
        articles: [],
        totalArticles: 0,
        error: 'An unexpected error occurred',
        urlSlug: slug,
        currentPage,
        totalPages: 1,
          mostPopular: [],
      }
    };
  }
};

export default CategoryPage;
