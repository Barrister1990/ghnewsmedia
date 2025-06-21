
import AdminLayout from '@/components/admin/AdminLayout';
import { AnimatedLoading } from '@/components/admin/AnimatedLoading';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
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
    return <AnimatedLoading />;
  }

  const statCards = [
    {
      title: 'Total Articles',
      value: stats.totalArticles,
      description: `${stats.publishedArticles} published`,
      icon: '📝'
    },
    {
      title: 'Categories',
      value: stats.totalCategories,
      description: 'Content categories',
      icon: '📁'
    },
    {
      title: 'Users',
      value: stats.totalUsers,
      description: 'Registered users',
      icon: '👥'
    },
    {
      title: 'Comments',
      value: stats.totalComments,
      description: 'User comments',
      icon: '💬'
    },
    {
      title: 'Reactions',
      value: stats.totalReactions,
      description: 'User reactions',
      icon: '❤️'
    }
  ];

  return (
    <AdminLayout>
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 text-sm lg:text-base">Welcome to the GhNewsMedia admin dashboard</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-6">
        {statCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <span className="text-2xl">{card.icon}</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">
                {card.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest activities in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-2xl">📝</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">New article published</p>
                  <p className="text-xs text-gray-500">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-2xl">💬</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">New comment received</p>
                  <p className="text-xs text-gray-500">5 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-2xl">👥</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">New user registered</p>
                  <p className="text-xs text-gray-500">10 minutes ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Frequently used actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link href="/admin/articles/create" className="block">
                <button className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">➕</span>
                    <span className="font-medium">Create New Article</span>
                  </div>
                </button>
              </Link>
              <Link href="/admin/categories" className="block">
                <button className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">📁</span>
                    <span className="font-medium">Manage Categories</span>
                  </div>
                </button>
              </Link>
              <Link href="/admin/comments" className="block">
                <button className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">💬</span>
                    <span className="font-medium">Review Comments</span>
                  </div>
                </button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
