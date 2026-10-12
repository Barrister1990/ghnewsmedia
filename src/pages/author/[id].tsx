import Footer from '@/components/Footer';
import { UserAvatar } from '@/components/UserAvatar';
import Header from '@/components/Header';
import Pagination, { pageHref, parsePageParam } from '@/components/Pagination';
import ScrollToTop from '@/components/ScrollToTop';
import StoryCard from '@/components/site/StoryCard';
import BreadcrumbSEO from '@/components/SEO/BreadcrumbSEO';
import SEOHead from '@/components/SEO/SEOHead';
import { PUBLICATION_NAME, SITE_URL } from '@/config/site';
import { supabase } from '@/integrations/supabase/client';
import { ARTICLE_CARD_COLUMNS, ArticleRow, transformToNewsArticle } from '@/lib/articles';
import { Author, NewsArticle } from '@/types/news';
import { generateMetaTitle, profileUrl, truncateDescription } from '@/utils/seo';
import { Facebook, Linkedin, Twitter } from 'lucide-react';
import { GetServerSideProps } from 'next';

const ARTICLES_PER_PAGE = 30;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface AuthorPageProps {
  author: Author;
  articles: NewsArticle[];
  totalArticles: number;
  currentPage: number;
  totalPages: number;
}

const AuthorPage = ({ author, articles, totalArticles, currentPage, totalPages }: AuthorPageProps) => {
  const basePath = `/author/${author.id}`;
  const canonicalUrl = `${SITE_URL}${pageHref(basePath, currentPage)}`;

  const breadcrumbItems = [
    { name: 'Home', url: SITE_URL },
    { name: 'Authors', url: `${SITE_URL}/authors` },
    { name: author.name }
  ];

  const authorStructuredData = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "url": canonicalUrl,
    "mainEntity": {
      "@type": "Person",
      "name": author.name,
      "jobTitle": author.title,
      "description": author.bio,
      ...(author.avatar?.trim() ? { image: author.avatar } : {}),
      "url": `${SITE_URL}${basePath}`,
      "worksFor": {
        "@type": "NewsMediaOrganization",
        "@id": `${SITE_URL}/#organization`,
        "name": PUBLICATION_NAME,
        "url": SITE_URL
      },
      "sameAs": [
        ...(author.social.twitter ? [profileUrl(author.social.twitter, 'https://x.com/')] : []),
        ...(author.social.facebook ? [profileUrl(author.social.facebook, 'https://facebook.com/')] : []),
        ...(author.social.linkedin ? [profileUrl(author.social.linkedin, 'https://linkedin.com/in/')] : [])
      ]
    }
  };

  const pagePrefix = currentPage > 1 ? `Page ${currentPage} of ${totalPages}: ` : '';
  const title = currentPage > 1
    ? generateMetaTitle(`${author.name} – Articles Page ${currentPage}`)
    : generateMetaTitle(`${author.name} - ${author.title}`);

  return (
    <div className="gp-site min-h-screen bg-white">
      <SEOHead
        title={title}
        description={truncateDescription(`${pagePrefix}Read articles by ${author.name}, ${author.title} at ${PUBLICATION_NAME}. ${author.bio}`)}
        canonical={canonicalUrl}
        image={author.avatar}
        tags={[author.name, 'journalist', 'Ghana news', 'author', author.title]}
        structuredData={authorStructuredData}
      />
      
      <Header />
      
      <main id="main-content" className="gp-site mx-auto max-w-[1280px] px-4 pb-8">
        <div className="pt-6">
          <BreadcrumbSEO items={breadcrumbItems} />
        </div>

        <header className="mt-3 flex flex-col gap-5 border-b-2 border-gp-ink pb-6 sm:flex-row sm:items-start">
          <UserAvatar src={author.avatar} alt={author.name} className="h-28 w-28 flex-shrink-0" size={112} />
          <div className="min-w-0 flex-1">
            <h1 className="text-[2rem] font-black leading-tight text-gp-ink sm:text-[2.75rem]">{author.name}</h1>
            <p className="mt-1 text-sm font-bold uppercase tracking-wide text-gp-accent-dark">{author.title}</p>
            <p className="mt-3 max-w-3xl text-base leading-relaxed text-gp-muted">{author.bio}</p>
            {(author.social.twitter || author.social.facebook || author.social.linkedin) && (
              <ul className="mt-4 flex items-center gap-2">
                {author.social.twitter && (
                  <li>
                    <a href={`https://twitter.com/${author.social.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer" aria-label={`${author.name} on X`} className="flex h-9 w-9 items-center justify-center rounded-full border border-gp-ink hover:bg-gp-ink hover:text-white">
                      <Twitter className="h-4 w-4" />
                    </a>
                  </li>
                )}
                {author.social.facebook && (
                  <li>
                    <a href={`https://facebook.com/${author.social.facebook}`} target="_blank" rel="noopener noreferrer" aria-label={`${author.name} on Facebook`} className="flex h-9 w-9 items-center justify-center rounded-full border border-gp-ink hover:bg-gp-ink hover:text-white">
                      <Facebook className="h-4 w-4" />
                    </a>
                  </li>
                )}
                {author.social.linkedin && (
                  <li>
                    <a href={`https://linkedin.com/in/${author.social.linkedin}`} target="_blank" rel="noopener noreferrer" aria-label={`${author.name} on LinkedIn`} className="flex h-9 w-9 items-center justify-center rounded-full border border-gp-ink hover:bg-gp-ink hover:text-white">
                      <Linkedin className="h-4 w-4" />
                    </a>
                  </li>
                )}
              </ul>
            )}
          </div>
        </header>

        <section aria-labelledby="author-articles-heading" className="mt-6">
          <div className="flex items-end justify-between">
            <h2 id="author-articles-heading" className="text-xl font-bold text-gp-ink sm:text-2xl">Articles by {author.name}</h2>
            <span className="text-sm text-gp-muted">{totalArticles} articles</span>
          </div>

          {articles.length > 0 ? (
            <div className="max-w-4xl">
              {articles.map((article, index) => (
                <StoryCard key={article.id} article={article} variant="feed" showCategory preload={index === 0} headingLevel="h3" />
              ))}
            </div>
          ) : (
            <p className="py-12 text-center text-gp-muted">No articles found by this author yet.</p>
          )}
          <Pagination basePath={basePath} currentPage={currentPage} totalPages={totalPages} />
        </section>
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<AuthorPageProps> = async ({ params, query, res }) => {
  const authorId = String(params?.id ?? '');
  if (!UUID_PATTERN.test(authorId)) {
    return { notFound: true };
  }

  const currentPage = parsePageParam(query.page);
  if (currentPage === null) {
    return { redirect: { destination: `/author/${authorId}`, permanent: true } };
  }

  const offset = (currentPage - 1) * ARTICLES_PER_PAGE;
  const [profileResult, articlesResult] = await Promise.all([
    supabase
      .from('profiles')
      .select('id, name, bio, avatar, title, twitter, facebook, linkedin')
      .eq('id', authorId)
      .maybeSingle(),
    supabase
      .from('articles_with_details')
      .select(ARTICLE_CARD_COLUMNS, { count: 'exact' })
      .eq('author_id', authorId)
      .eq('status', 'published')
      .not('content', 'is', null)
      .order('published_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false })
      .order('id', { ascending: true })
      .range(offset, offset + ARTICLES_PER_PAGE - 1),
  ]);

  if (profileResult.error) throw profileResult.error;
  if (!profileResult.data) {
    return { notFound: true };
  }

  const totalArticles = articlesResult.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalArticles / ARTICLES_PER_PAGE));

  // PGRST103: requested range starts past the last row.
  if (articlesResult.error?.code === 'PGRST103' || (!articlesResult.error && currentPage > totalPages)) {
    return { notFound: true };
  }
  if (articlesResult.error) throw articlesResult.error;

  const profile = profileResult.data;
  const author: Author = {
    id: profile.id,
    name: profile.name || `${PUBLICATION_NAME} Author`,
    bio: profile.bio || 'No biography available.',
    avatar: profile.avatar ?? '',
    title: profile.title || 'Journalist',
    social: {
      ...(profile.twitter ? { twitter: profile.twitter } : {}),
      ...(profile.facebook ? { facebook: profile.facebook } : {}),
      ...(profile.linkedin ? { linkedin: profile.linkedin } : {}),
    },
  };

  const articles = ((articlesResult.data || []) as ArticleRow[])
    .filter((article) => article.id && article.title)
    .map(transformToNewsArticle);

  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');

  return {
    props: { author, articles, totalArticles, currentPage, totalPages },
  };
};

export default AuthorPage;
