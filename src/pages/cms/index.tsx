import CMSLayout from '@/components/cms/CMSLayout';
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
import { ArrowRight, CalendarCheck, Check, Eye, FileClock, Newspaper, Plus } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Stats {
  published: number;
  drafts: number;
  views: number;
  siteThisWeek: number;
}

type TopArticle = { id: string; title: string; slug: string; views: number };

const ARTICLE_FIELDS = 'id,title,slug,status,featured_image,category_name,author_name,updated_at';

const checklist = [
  'Headline under 110 characters that says what happened',
  'Featured image cropped to 1200×675 with a credit',
  'First paragraph answers who, what, where and when',
  'Category, tags and a meta description filled in',
];

const CMSDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<DashArticle[] | null>(null);
  const [top, setTop] = useState<TopArticle[] | null>(null);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    const weekAgo = new Date(Date.now() - 7 * 864e5).toISOString();
    const count = { count: 'exact' as const, head: true };

    Promise.all([
      supabase.from('articles').select('id', count).eq('author_id', user.id).eq('status', 'published'),
      supabase.from('articles').select('id', count).eq('author_id', user.id).eq('status', 'draft'),
      supabase
        .from('articles')
        .select('id,title,slug,views')
        .eq('author_id', user.id)
        .eq('status', 'published')
        .order('views', { ascending: false })
        .limit(1000),
      supabase.from('articles').select('id', count).eq('status', 'published').gte('published_at', weekAgo),
    ])
      .then(([published, drafts, mine, siteWeek]) => {
        if (cancelled) return;
        const rows = (mine.data ?? []) as TopArticle[];
        setStats({
          published: published.count ?? 0,
          drafts: drafts.count ?? 0,
          views: rows.reduce((sum, a) => sum + (a.views ?? 0), 0),
          siteThisWeek: siteWeek.count ?? 0,
        });
        setTop(rows.slice(0, 5));
      })
      .catch((error) => console.error('Error fetching dashboard stats:', error));

    supabase
      .from('articles_with_details')
      .select(ARTICLE_FIELDS)
      .eq('author_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(8)
      .then(({ data, error }) => {
        if (error) console.error('Error fetching recent articles:', error);
        if (!cancelled) setRecent((data as DashArticle[]) ?? []);
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <CMSLayout>
      <div className="space-y-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-dash-teal-dark">{today}</p>
            <h1 className="mt-2 text-4xl font-black leading-[1.02] sm:text-5xl">
              {greeting()}, {firstName(user?.user_metadata, user?.email)}.
            </h1>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-dash-muted">
              Pick up where you left off, or start the next big story.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/cms/articles/create" className={pillPrimary}>
              <Plus className="h-4 w-4" /> Write a story
            </Link>
            <Link href="/cms/articles" className={pillOutline}>
              My articles
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          <StatTile label="My published" value={stats?.published ?? null} hint="Live under your byline" icon={Newspaper} tone="mint" href="/cms/articles" />
          <StatTile label="My drafts" value={stats?.drafts ?? null} hint="Finish and publish" icon={FileClock} tone="lemon" href="/cms/articles" />
          <StatTile label="My views" value={stats?.views ?? null} hint="Across your stories" icon={Eye} tone="lilac" />
          <StatTile label="Site this week" value={stats?.siteThisWeek ?? null} hint="Stories published" icon={CalendarCheck} tone="sky" />
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <SectionCard
            title="Your recent work"
            className="xl:col-span-2"
            action={
              <Link href="/cms/articles" className="inline-flex items-center gap-1 text-sm font-bold text-dash-teal-dark hover:underline">
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            }
          >
            {recent === null ? (
              <ArticleListSkeleton />
            ) : recent.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-sm text-dash-muted">You haven&apos;t written anything yet.</p>
                <Link href="/cms/articles/create" className={`${pillPrimary} mt-4`}>
                  <Plus className="h-4 w-4" /> Write your first story
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-dash-line">
                {recent.map((a) => (
                  <ArticleRow key={a.id} article={a} editHref={`/cms/articles/edit/${a.id}`} />
                ))}
              </ul>
            )}
          </SectionCard>

          <div className="flex flex-col gap-6">
            <section className="rounded-3xl bg-dash-ink p-6 text-white">
              <h2 className="text-xl font-black">Your most read</h2>
              <p className="mt-1 text-xs text-white/55">All-time views on your published stories</p>
              <ol className="mt-5 space-y-4">
                {top === null ? (
                  Array.from({ length: 4 }).map((_, i) => <li key={i} className="h-10 rounded-xl bg-white/10" />)
                ) : top.length === 0 ? (
                  <li className="text-sm text-white/60">Publish a story to see it here.</li>
                ) : (
                  top.map((a, i) => (
                    <li key={a.id} className="flex items-start gap-4">
                      <span className="w-6 shrink-0 text-2xl font-black leading-none text-dash-teal">{i + 1}</span>
                      <div className="min-w-0 flex-1">
                        <Link href={`/news/${a.slug}`} target="_blank" className="line-clamp-2 text-sm font-bold leading-snug hover:underline">
                          {a.title}
                        </Link>
                        <p className="mt-1 text-xs text-white/50">{compact(a.views ?? 0)} views</p>
                      </div>
                    </li>
                  ))
                )}
              </ol>
            </section>

            <section className="rounded-3xl bg-dash-yellow p-6">
              <h2 className="text-xl font-black">Before you publish</h2>
              <ul className="mt-4 space-y-3">
                {checklist.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm font-medium">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-dash-ink">
                      <Check className="h-3 w-3 text-dash-yellow" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>
    </CMSLayout>
  );
};

export default CMSDashboard;
