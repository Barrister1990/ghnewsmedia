// /news/[slug] takes precedence over /[category]/[slug] for the "news" segment,
// so it must render the same article page and redirect other categories.
import { ArticlePageProps, getArticlePageProps } from '@/lib/articlePage';
import { GetStaticPaths, GetStaticProps } from 'next';
import { ParsedUrlQuery } from 'querystring';
import ArticlePage from '../[category]/[slug]';

interface Params extends ParsedUrlQuery {
  slug: string;
}

export const getStaticPaths: GetStaticPaths<Params> = async () => ({
  paths: [],
  fallback: 'blocking',
});

export const getStaticProps: GetStaticProps<ArticlePageProps, Params> = async ({ params }) => {
  if (!params?.slug) {
    return { notFound: true };
  }
  return getArticlePageProps('news', params.slug);
};

export default ArticlePage;
