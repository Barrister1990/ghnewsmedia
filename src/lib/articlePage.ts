import type { GetStaticPaths, GetStaticPropsResult } from 'next';
import { fetchArticleBySlug, fetchMostPopular, fetchPublishedArticles, fetchRelatedArticles } from '@/lib/articles';
import { NewsArticle } from '@/types/news';

/** Seconds before a cached article page is regenerated in the background. */
export const ARTICLE_REVALIDATE_SECONDS = 60;

/** How many of the newest articles to pre-render at build time. */
const PRERENDERED_ARTICLE_COUNT = 30;

export interface ArticlePageProps {
  article: NewsArticle;
  relatedArticles: NewsArticle[];
  mostPopular: NewsArticle[];
}

/**
 * Pre-render the newest articles; everything else renders on first request and is then cached.
 * "news" articles are served by pages/news/[slug].tsx, and Next.js rejects duplicate paths.
 */
export const getArticleStaticPaths: GetStaticPaths = async () => {
  const { articles } = await fetchPublishedArticles({ limit: PRERENDERED_ARTICLE_COUNT });
  return {
    paths: articles
      .filter((article) => article.category.slug !== 'news')
      .map((article) => ({
        params: { category: article.category.slug, slug: article.slug },
      })),
    fallback: 'blocking',
  };
};

export async function getArticlePageProps(
  categorySlug: string,
  slug: string
): Promise<GetStaticPropsResult<ArticlePageProps>> {
  const { article, error } = await fetchArticleBySlug(slug);

  // Throwing keeps serving the last good cached page instead of caching an error.
  if (error) {
    throw new Error(`Failed to load article "${slug}": ${error}`);
  }

  if (!article) {
    return { notFound: true, revalidate: ARTICLE_REVALIDATE_SECONDS };
  }

  if (article.category.slug !== categorySlug) {
    return {
      redirect: {
        destination: `/${article.category.slug}/${article.slug}`,
        permanent: true,
      },
      revalidate: ARTICLE_REVALIDATE_SECONDS,
    };
  }

  const [relatedArticles, mostPopular] = await Promise.all([
    fetchRelatedArticles(article, 6),
    fetchMostPopular(5),
  ]);

  return {
    props: { article, relatedArticles, mostPopular: mostPopular.filter((a) => a.id !== article.id) },
    revalidate: ARTICLE_REVALIDATE_SECONDS,
  };
}
