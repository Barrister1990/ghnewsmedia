import Footer from '@/components/Footer';
import Header from '@/components/Header';
import ScrollToTop from '@/components/ScrollToTop';
import SEOHead from '@/components/SEO/SEOHead';
import { UserAvatar } from '@/components/UserAvatar';
import { supabase } from '@/integrations/supabase/client';
import { GetServerSideProps } from 'next';
import Link from 'next/link';

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
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title="Our Journalists | GH News Media"
        description="Meet the GH News Media journalists and editors. Explore verified author profiles and read all articles by our newsroom team."
        canonical="https://ghnewsmedia.com/authors"
        tags={['GH News Media journalists', 'Ghana news authors', 'reporters', 'editors', 'newsroom']}
      />
      <Header />

      <main className="container mx-auto px-4 py-8 sm:py-10">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Our Journalists</h1>
          <p className="text-gray-600 mb-8 sm:mb-10">
            Meet the writers behind GH News Media coverage across politics, business, sports, entertainment, and more.
          </p>

          {authors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              {authors.map((author) => (
                <article key={author.id} className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6">
                  <div className="flex items-start gap-4">
                    <UserAvatar src={author.avatar} alt={author.name} className="h-16 w-16 flex-shrink-0" />
                    <div className="min-w-0">
                      <h2 className="text-xl font-semibold text-gray-900">
                        <Link href={`/author/${author.id}`} className="hover:text-primary transition-colors">
                          {author.name}
                        </Link>
                      </h2>
                      <p className="text-primary font-medium text-sm sm:text-base mt-1">
                        {author.title || 'Journalist'}
                      </p>
                      <p className="text-gray-600 text-sm sm:text-base mt-2 leading-relaxed">
                        {author.bio || `${author.name} contributes reporting and analysis for GH News Media.`}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500 mt-3">
                        {author.articleCount} published article{author.articleCount === 1 ? '' : 's'}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-600">
              No author profiles available yet.
            </div>
          )}
        </div>
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<AuthorsPageProps> = async () => {
  const { data: publishedArticles } = await supabase
    .from('articles_with_details')
    .select('author_id, author_name, author_avatar')
    .eq('status', 'published');

  const articleCounts = new Map<string, number>();
  const articleMetadata = new Map<string, { name: string; avatar: string }>();

  (publishedArticles || []).forEach((article: any) => {
    if (!article.author_id) return;
    articleCounts.set(article.author_id, (articleCounts.get(article.author_id) || 0) + 1);
    articleMetadata.set(article.author_id, {
      name: article.author_name || 'GH News Media Author',
      avatar: article.author_avatar || '',
    });
  });

  const authorIds = Array.from(articleCounts.keys());
  if (authorIds.length === 0) {
    return { props: { authors: [] } };
  }

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, name, bio, avatar, title')
    .in('id', authorIds);

  const profileById = new Map((profiles || []).map((profile: any) => [profile.id, profile]));

  const authors: AuthorListItem[] = authorIds
    .map((authorId) => {
      const profile = profileById.get(authorId);
      const fallback = articleMetadata.get(authorId);
      return {
        id: authorId,
        name: profile?.name || fallback?.name || 'GH News Media Author',
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
  };
};

export default AuthorsPage;
