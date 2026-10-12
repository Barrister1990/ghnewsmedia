import Footer from '@/components/Footer';
import Header from '@/components/Header';
import ScrollToTop from '@/components/ScrollToTop';
import SEOHead from '@/components/SEO/SEOHead';
import { UserAvatar } from '@/components/UserAvatar';
import { SITE_URL } from '@/config/site';
import { supabase } from '@/integrations/supabase/client';
import { fetchPublishedArticles } from '@/lib/articles';
import { GetStaticProps } from 'next';
import Link from 'next/link';

const AUTHORS_REVALIDATE_SECONDS = 600;

interface AuthorListItem {
  id: string;
  name: string;
  bio: string;
  avatar: string;
  title: string;
  articleCount: number;
}

interface AuthorsPageProps {
  authors: AuthorListItem[];
}

const AuthorsPage = ({ authors }: AuthorsPageProps) => {
  return (
    <div className="gp-site min-h-screen bg-white">
      <SEOHead
        title="Our Journalists | Ghana Point"
        description="Meet the Ghana Point journalists and editors. Explore verified author profiles and read all articles by our newsroom team."
        canonical={`${SITE_URL}/authors`}
        tags={['Ghana Point journalists', 'Ghana news authors', 'reporters', 'editors', 'newsroom']}
      />
      <Header />

      <main id="main-content" className="gp-site mx-auto max-w-[1280px] px-4 pb-8">
        <nav aria-label="Breadcrumb" className="pt-6 text-xs text-gp-muted">
          <Link href="/" className="hover:underline">Home</Link>
          <span aria-hidden className="mx-1.5">/</span>
          <span>Our Journalists</span>
        </nav>
        <header className="mb-8 mt-3 border-b-2 border-gp-ink pb-4">
          <h1 className="text-[2rem] font-black leading-tight text-gp-ink sm:text-[2.75rem]">Our Journalists</h1>
          <p className="mt-2 max-w-3xl text-lg leading-relaxed text-gp-muted">
            Meet the writers behind Ghana Point coverage across politics, business, sports, entertainment, and more.
          </p>
        </header>

        {authors.length > 0 ? (
          <ul className="grid grid-cols-1 gap-x-8 md:grid-cols-2">
            {authors.map((author) => (
              <li key={author.id} className="border-b border-gp-line py-6">
                <article className="flex items-start gap-4">
                  <UserAvatar src={author.avatar} alt={author.name} className="h-20 w-20 flex-shrink-0" size={80} />
                  <div className="min-w-0">
                    <h2 className="text-xl font-bold text-gp-ink">
                      <Link href={`/author/${author.id}`} className="hover:underline">{author.name}</Link>
                    </h2>
                    <p className="mt-0.5 text-sm font-bold uppercase tracking-wide text-gp-accent-dark">{author.title || 'Journalist'}</p>
                    <p className="mt-2 text-[0.95rem] leading-relaxed text-gp-muted">
                      {author.bio || `${author.name} contributes reporting and analysis for Ghana Point.`}
                    </p>
                    <p className="mt-2 text-xs font-bold text-gp-ink">
                      {author.articleCount} published article{author.articleCount === 1 ? '' : 's'}
                    </p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        ) : (
          <p className="py-16 text-center text-gp-muted">No author profiles available yet.</p>
        )}
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export const getStaticProps: GetStaticProps<AuthorsPageProps> = async () => {
  const { articles, error } = await fetchPublishedArticles({
    columns: 'id,title,author_id,author_name,author_avatar',
  });
  if (error) throw new Error(error);

  const articleCounts = new Map<string, number>();
  const articleMetadata = new Map<string, { name: string; avatar: string }>();

  articles.forEach(({ author }) => {
    if (!author.id) return;
    articleCounts.set(author.id, (articleCounts.get(author.id) || 0) + 1);
    if (!articleMetadata.has(author.id)) {
      articleMetadata.set(author.id, { name: author.name, avatar: author.avatar });
    }
  });

  const authorIds = Array.from(articleCounts.keys());
  if (authorIds.length === 0) {
    return { props: { authors: [] }, revalidate: AUTHORS_REVALIDATE_SECONDS };
  }

  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, name, bio, avatar, title')
    .in('id', authorIds);
  if (profilesError) throw profilesError;

  const profileById = new Map((profiles || []).map((profile) => [profile.id, profile]));

  const authors: AuthorListItem[] = authorIds
    .map((authorId) => {
      const profile = profileById.get(authorId);
      const fallback = articleMetadata.get(authorId);
      return {
        id: authorId,
        name: profile?.name || fallback?.name || 'Ghana Point Author',
        bio: profile?.bio || '',
        avatar: profile?.avatar || fallback?.avatar || '',
        title: profile?.title || '',
        articleCount: articleCounts.get(authorId) || 0,
      };
    })
    .sort((a, b) => b.articleCount - a.articleCount || a.name.localeCompare(b.name));

  return {
    props: {
      authors,
    },
    revalidate: AUTHORS_REVALIDATE_SECONDS,
  };
};

export default AuthorsPage;
