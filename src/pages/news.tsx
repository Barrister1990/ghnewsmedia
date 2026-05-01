import Footer from '@/components/Footer';
import Header from '@/components/Header';
import ScrollToTop from '@/components/ScrollToTop';
import SEOHead from '@/components/SEO/SEOHead';
import { supabase } from '@/integrations/supabase/client';
import { transformToNewsArticle } from '@/lib/articles';
import { NewsArticle } from '@/types/news';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface NewsHubProps {
  articles: NewsArticle[];
  error?: string;
}

const SITE_URL = 'https://ghnewsmedia.com';

function articleImageSrc(path: string): string {
  if (!path) return '/images/placeholder.jpg';
  if (path.startsWith('http')) return path;
  return `https://zodidixpxznfsopxdhyr.supabase.co/storage/v1/object/public/article-images/${path}`;
}

const NewsHub: React.FC<NewsHubProps> = ({ articles, error }) => {
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
          canonical={`${SITE_URL}/news`}
        />
        <Header />
        <main className="container mx-auto px-4 py-12 text-center">
          <p className="text-stone-600">{error}</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Ghana News Today - Latest Headlines"
        description="Breaking news and top stories across Ghana — politics, business, sports, tech, entertainment, and more."
        canonical={`${SITE_URL}/news`}
        structuredData={structuredData}
      />
      <Header />
      <main className="container mx-auto max-w-4xl px-3 py-6 sm:px-4 sm:py-8">
        <h1 className="mb-2 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">News</h1>
        <p className="mb-8 text-sm text-stone-600">Latest headlines across all sections.</p>
        <div className="divide-y divide-stone-200">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/${article.category.slug}/${article.slug}`}
              className="flex gap-4 py-4 transition-colors first:pt-0 hover:bg-stone-50/80 sm:rounded-lg sm:px-2"
            >
              <div className="relative h-24 w-28 shrink-0 overflow-hidden rounded-md bg-stone-100 sm:h-28 sm:w-36">
                <Image
                  src={articleImageSrc(article.featuredImage)}
                  alt={article.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 112px, 144px"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-stone-500">{article.category.name}</p>
                <h2 className="mt-1 font-semibold leading-snug text-stone-900">{article.title}</h2>
                <p className="mt-1 line-clamp-2 text-sm text-stone-600">{article.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<NewsHubProps> = async (context) => {
  try {
    const { data: articlesData, error: articlesError } = await supabase
      .from('articles_with_details')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false })
      .limit(60);

    if (articlesError) {
      console.error('Error fetching news hub articles:', articlesError);
      return {
        props: {
          articles: [],
          error: 'Failed to load articles.',
        },
      };
    }

    const transformedArticles = (articlesData || [])
      .filter((article) => article.id && article.title && article.content)
      .map(transformToNewsArticle)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    context.res.setHeader('Cache-Control', 'public, s-maxage=120, stale-while-revalidate=300');

    return {
      props: {
        articles: transformedArticles,
      },
    };
  } catch (e) {
    console.error('News hub error:', e);
    return {
      props: {
        articles: [],
        error: 'Something went wrong.',
      },
    };
  }
};

export default NewsHub;
