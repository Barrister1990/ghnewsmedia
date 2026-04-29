import { AnimatedLoading } from '@/components/admin/AnimatedLoading';
import CMSLayout from '@/components/cms/CMSLayout';
import { PANEL_CARD, PanelPageHeader } from '@/components/shell/PanelChrome';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import {
  FolderTree,
  Heart,
  MessageSquare,
  Newspaper,
  Plus,
  TrendingUp,
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

const CMSDashboard = () => {
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
      <CMSLayout>
        <AnimatedLoading />
      </CMSLayout>
    );
  }

  const statCards = [
    {
      title: 'Total articles',
      value: stats.totalArticles,
      description: `${stats.publishedArticles} published`,
      icon: Newspaper,
    },
    {
      title: 'Categories',
      value: stats.totalCategories,
      description: 'Content categories',
      icon: FolderTree,
    },
    {
      title: 'Users',
      value: stats.totalUsers,
      description: 'Registered users',
      icon: Users,
    },
    {
      title: 'Comments',
      value: stats.totalComments,
      description: 'User comments',
      icon: MessageSquare,
    },
    {
      title: 'Reactions',
      value: stats.totalReactions,
      description: 'User reactions',
      icon: Heart,
    },
  ];

  return (
    <CMSLayout>
      <div className="space-y-8">
        <PanelPageHeader
          title="CMS overview"
          description="Your editor snapshot of activity across the site."
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 xl:gap-6">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <Card key={card.title} className={cn(PANEL_CARD)}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-stone-800">{card.title}</CardTitle>
                  <Icon className="h-5 w-5 text-stone-400" aria-hidden />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold tabular-nums text-stone-900">{card.value}</div>
                  <p className="text-xs text-stone-500">{card.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <Card className={cn(PANEL_CARD)}>
            <CardHeader>
              <CardTitle className="text-stone-900">Recent activity</CardTitle>
              <CardDescription>Illustrative items for the workspace</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-stone-200 bg-stone-50">
                    <Newspaper className="h-4 w-4 text-stone-600" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-stone-900">New article created</p>
                    <p className="text-xs text-stone-500">2 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-stone-200 bg-stone-50">
                    <MessageSquare className="h-4 w-4 text-stone-600" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-stone-900">New comment received</p>
                    <p className="text-xs text-stone-500">5 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-stone-200 bg-stone-50">
                    <Users className="h-4 w-4 text-stone-600" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-stone-900">New user registered</p>
                    <p className="text-xs text-stone-500">10 minutes ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={cn(PANEL_CARD)}>
            <CardHeader>
              <CardTitle className="text-stone-900">Quick actions</CardTitle>
              <CardDescription>Jump to common editor tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="h-auto w-full justify-start border-stone-200 bg-white py-3 text-left font-medium text-stone-800 hover:bg-stone-50"
                  asChild
                >
                  <Link href="/cms/articles/create" className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-stone-200 bg-stone-50">
                      <Plus className="h-4 w-4 text-stone-700" />
                    </span>
                    Create new article
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto w-full justify-start border-stone-200 bg-white py-3 text-left font-medium text-stone-800 hover:bg-stone-50"
                  asChild
                >
                  <Link href="/cms/articles" className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-stone-200 bg-stone-50">
                      <TrendingUp className="h-4 w-4 text-stone-700" />
                    </span>
                    Manage articles
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </CMSLayout>
  );
};

export default CMSDashboard;
