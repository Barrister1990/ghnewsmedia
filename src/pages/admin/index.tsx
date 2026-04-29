
import AdminLayout from '@/components/admin/AdminLayout';
import { AnimatedLoading } from '@/components/admin/AnimatedLoading';
import { ADMIN_PANEL_CARD, AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import {
  FolderTree,
  Heart,
  MessageSquare,
  Newspaper,
  Plus,
  Sparkles,
  Tags,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface DashboardStats {
  totalArticles: number;
  publishedArticles: number;
  totalCategories: number;
  totalUsers: number;
  totalComments: number;
  totalReactions: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalArticles: 0,
    publishedArticles: 0,
    totalCategories: 0,
    totalUsers: 0,
    totalComments: 0,
    totalReactions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const [
        articlesResult,
        publishedResult,
        categoriesResult,
        usersResult,
        commentsResult,
        reactionsResult,
      ] = await Promise.all([
        supabase.from('articles').select('id', { count: 'exact' }),
        supabase.from('articles').select('id', { count: 'exact' }).eq('status', 'published'),
        supabase.from('categories').select('id', { count: 'exact' }),
        supabase.from('profiles').select('id', { count: 'exact' }),
        supabase.from('comments').select('id', { count: 'exact' }),
        supabase.from('reactions').select('id', { count: 'exact' }),
      ]);

      setStats({
        totalArticles: articlesResult.count || 0,
        publishedArticles: publishedResult.count || 0,
        totalCategories: categoriesResult.count || 0,
        totalUsers: usersResult.count || 0,
        totalComments: commentsResult.count || 0,
        totalReactions: reactionsResult.count || 0,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <AnimatedLoading />
      </AdminLayout>
    );
  }

  const statCards = [
    {
      title: 'Articles',
      value: stats.totalArticles,
      hint: `${stats.publishedArticles} published`,
      icon: Newspaper,
    },
    {
      title: 'Categories',
      value: stats.totalCategories,
      hint: 'Sections & routing',
      icon: FolderTree,
    },
    {
      title: 'People',
      value: stats.totalUsers,
      hint: 'Profiles',
      icon: Users,
    },
    {
      title: 'Comments',
      value: stats.totalComments,
      hint: 'Across articles',
      icon: MessageSquare,
    },
    {
      title: 'Reactions',
      value: stats.totalReactions,
      hint: 'Engagement',
      icon: Heart,
    },
  ];

  const quickLinks = [
    {
      label: 'New article',
      href: '/admin/articles/create',
      icon: Plus,
      primary: true,
    },
    {
      label: 'Categories',
      href: '/admin/categories',
      icon: FolderTree,
      primary: false,
    },
    {
      label: 'Comments',
      href: '/admin/comments',
      icon: MessageSquare,
      primary: false,
    },
    {
      label: 'Tags',
      href: '/admin/tags',
      icon: Tags,
      primary: false,
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8 pb-8">
        <AdminPageHeader
          title="Overview"
          description="Snapshots of volume across your newsroom. Numbers refresh when you load this page."
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <Card key={card.title} className={cn(ADMIN_PANEL_CARD)}>
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2 pt-6">
                  <CardTitle className="text-[13px] font-medium uppercase tracking-[0.06em] text-stone-500">
                    {card.title}
                  </CardTitle>
                  <span className="rounded-lg bg-stone-50 p-2 text-stone-700 ring-1 ring-stone-900/5">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                </CardHeader>
                <CardContent className="pb-6">
                  <div className="text-3xl font-semibold tabular-nums text-stone-900">{card.value}</div>
                  <p className="mt-1.5 text-xs text-stone-500">{card.hint}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <Card className={cn(ADMIN_PANEL_CARD)}>
            <CardHeader className="space-y-1 pb-2">
              <CardTitle className="text-lg">Welcome</CardTitle>
              <CardDescription>Start from the tasks you use most often.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3 rounded-xl border border-dashed border-stone-200/90 bg-stone-50/50 p-4 text-sm text-stone-600">
                <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-amber-600/90" aria-hidden />
                <p>
                  Use the sidebar to move between modules. On your phone, open the menu from the top bar to reach
                  the same links.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className={cn(ADMIN_PANEL_CARD)}>
            <CardHeader className="space-y-1 pb-2">
              <CardTitle className="text-lg">Shortcuts</CardTitle>
              <CardDescription>Jump to common admin actions.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2 sm:grid-cols-2">
              {quickLinks.map(({ label, href, icon: QIcon, primary }) => (
                <Button
                  key={href}
                  asChild
                  variant={primary ? 'default' : 'outline'}
                  className={cn(
                    'h-auto justify-start gap-3 rounded-xl border-stone-200 py-3 text-left font-medium',
                    !primary && 'bg-white hover:bg-stone-50'
                  )}
                >
                  <Link href={href}>
                    <QIcon className="h-4 w-4 shrink-0" />
                    {label}
                  </Link>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
