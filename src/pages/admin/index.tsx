import AdminLayout from '@/components/admin/AdminLayout';
import {
  ArticleListSkeleton,
  ArticleRow,
  compact,
  type DashArticle,
  firstName,
  greeting,
  pillOutline,
  pillPrimary,
  SectionCard,
  StatTile,
} from '@/components/shell/DashWidgets';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import {
  ArrowRight,
  CalendarCheck,
  FileClock,
  FolderTree,
  MessageSquareWarning,
  Newspaper,
  Plus,
  Share2,
  Tags,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Stats {
  published: number;
  drafts: number;
  thisWeek: number;
  pendingComments: number;
  categories: number;
  people: number;
}

type TopArticle = { id: string | null; title: string | null; slug: string | null; views: number | null };

const ARTICLE_FIELDS = 'id,title,slug,status,featured_image,category_name,author_name,updated_at';

const quickActions = [
  { label: 'Categories', href: '/admin/categories', icon: FolderTree },
  { label: 'Tags', href: '/admin/tags', icon: Tags },
  { label: 'Comments', href: '/admin/comments', icon: MessageSquareWarning },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Social', href: '/admin/social-media', icon: Share2 },
];

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<DashArticle[] | null>(null);
  const [top, setTop] = useState<TopArticle[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    const weekAgo = new Date(Date.now() - 7 * 864e5).toISOString();
    const count = { count: 'exact' as const, head: true };

    Promise.all([
      supabase.from('articles').select('id', count).eq('status', 'published'),
      supabase.from('articles').select('id', count).eq('status', 'draft'),
      supabase.from('articles').select('id', count).eq('status', 'published').gte('published_at', weekAgo),
      supabase.from('comments').select('id', count).eq('approved', false),
      supabase.from('categories').select('id', count),
      supabase.from('profiles').select('id', count),
    ])
      .then(([published, drafts, thisWeek, pending, categories, people]) => {
        if (cancelled) return;
        setStats({
          published: published.count ?? 0,
          drafts: drafts.count ?? 0,
          thisWeek: thisWeek.count ?? 0,
          pendingComments: pending.count ?? 0,
          categories: categories.count ?? 0,
          people: people.count ?? 0,
        });
      })
      .catch((error) => console.error('Error fetching dashboard stats:', error));

    supabase
      .from('articles_with_details')
      .select(ARTICLE_FIELDS)
      .order('updated_at', { ascending: false })
      .limit(8)
      .then(({ data, error }) => {
        if (error) console.error('Error fetching recent articles:', error);
        if (!cancelled) setRecent((data as DashArticle[]) ?? []);
      });

    supabase
      .from('articles')
      .select('id,title,slug,views')
      .eq('status', 'published')
      .order('views', { ascending: false })
      .limit(5)
      .then(({ data, error }) => {
        if (error) console.error('Error fetching top articles:', error);
        if (!cancelled) setTop(data ?? []);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-dash-teal-dark">{today}</p>
            <h1 className="mt-2 text-4xl font-black leading-[1.02] sm:text-5xl">
              {greeting()}, {firstName(user?.user_metadata, user?.email)}.
            </h1>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-dash-muted">
              Here&apos;s what&apos;s happening across the Ghana Point newsroom today.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/articles/create" className={pillPrimary}>
              <Plus className="h-4 w-4" /> New article
            </Link>
            <Link href="/admin/articles" className={pillOutline}>
              All articles
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
          <StatTile label="Published" value={stats?.published ?? null} hint="Live on the site" icon={Newspaper} tone="mint" href="/admin/articles" />
          <StatTile label="Drafts" value={stats?.drafts ?? null} hint="Waiting to publish" icon={FileClock} tone="lemon" href="/admin/articles" />
          <StatTile label="This week" value={stats?.thisWeek ?? null} hint="Published in 7 days" icon={CalendarCheck} tone="sky" />
          <StatTile label="Comments" value={stats?.pendingComments ?? null} hint="Awaiting moderation" icon={MessageSquareWarning} tone="rose" href="/admin/comments" />
          <StatTile label="Categories" value={stats?.categories ?? null} hint="Site sections" icon={FolderTree} tone="lilac" href="/admin/categories" />
          <StatTile label="People" value={stats?.people ?? null} hint="Staff profiles" icon={Users} tone="peach" href="/admin/users" />
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <SectionCard
            title="Latest activity"
            className="xl:col-span-2"
            action={
              <Link href="/admin/articles" className="inline-flex items-center gap-1 text-sm font-bold text-dash-teal-dark hover:underline">
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            }
          >
            {recent === null ? (
              <ArticleListSkeleton />
            ) : recent.length === 0 ? (
              <p className="py-10 text-center text-sm text-dash-muted">No articles yet. Write the first one.</p>
            ) : (
              <ul className="divide-y divide-dash-line">
                {recent.map((a) => (
                  <ArticleRow key={a.id} article={a} editHref={`/admin/articles/edit/${a.id}`} />
                ))}
              </ul>
            )}
          </SectionCard>

          <div className="flex flex-col gap-6">
            <section className="rounded-3xl bg-dash-ink p-6 text-white">
              <h2 className="text-xl font-black">Most read</h2>
              <p className="mt-1 text-xs text-white/55">All-time views on published stories</p>
              <ol className="mt-5 space-y-4">
                {top === null
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <li key={i} className="h-10 rounded-xl bg-white/10" />
                    ))
                  : top.map((a, i) => (
                      <li key={a.id} className="flex items-start gap-4">
                        <span className="w-6 shrink-0 text-2xl font-black leading-none text-dash-teal">{i + 1}</span>
                        <div className="min-w-0 flex-1">
                          <Link
                            href={`/news/${a.slug}`}
                            target="_blank"
                            className="line-clamp-2 text-sm font-bold leading-snug hover:underline"
                          >
                            {a.title}
                          </Link>
                          <p className="mt-1 text-xs text-white/50">{compact(a.views ?? 0)} views</p>
                        </div>
                      </li>
                    ))}
              </ol>
            </section>

            <section className="rounded-3xl bg-dash-yellow p-6">
              <h2 className="text-xl font-black">Quick actions</h2>
              <p className="mt-1 text-sm text-dash-ink/70">Jump straight into the tools you use most.</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {quickActions.map(({ label, href, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold transition-colors hover:bg-dash-ink hover:text-white"
                  >
                    <Icon className="h-4 w-4" /> {label}
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
