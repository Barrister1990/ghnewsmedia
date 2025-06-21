
import AdminLayout from '@/components/admin/AdminLayout';
import { AnimatedLoading } from '@/components/admin/AnimatedLoading';
import ArticleFilters from '@/components/admin/ArticleFilters';
import ArticlesList from '@/components/admin/ArticlesList';
import { Button } from '@/components/ui/button';
import { useAllArticles } from '@/hooks/useAllArticles';
import { filterArticles } from '@/utils/articleFilters';
import { Plus, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const ArticlesManagement = () => {
  const router = useRouter()
  const { articles, loading, refetch } = useAllArticles();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredArticles = filterArticles(articles, searchTerm, statusFilter);

  const handleRefresh = () => {
    refetch();
  };

  if (loading) {
    return (
 <AdminLayout>
      <AnimatedLoading />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col space-y-4 lg:flex-row lg:justify-between lg:items-center lg:space-y-0">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Articles Management</h1>
          <p className="text-gray-600 text-sm lg:text-base">
            Manage all articles in the system ({articles.length} total)
          </p>
        </div>
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-3">
          <Button 
            onClick={handleRefresh}
            variant="outline"
            className="flex items-center justify-center space-x-2 w-full sm:w-auto"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </Button>
          <Button 
            onClick={() => router.push('/admin/articles/create')}
            className="flex items-center justify-center space-x-2 w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Article</span>
          </Button>
        </div>
      </div>

      <ArticleFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        totalArticles={filteredArticles.length}
      />

      <div className="bg-white rounded-lg shadow">
        <ArticlesList />
      </div>
    </div>
    </AdminLayout>
  );
};

export default ArticlesManagement;
