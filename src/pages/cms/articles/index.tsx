import { AnimatedLoading } from '@/components/admin/AnimatedLoading';
import ArticleFilters from '@/components/admin/ArticleFilters';
import CMSArticlesList from '@/components/cms/CMSArticlesList';
import CMSLayout from '@/components/cms/CMSLayout';
import { PANEL_CARD, PanelPageHeader } from '@/components/shell/PanelChrome';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAllArticles } from '@/hooks/useAllArticles';
import { filterArticles } from '@/utils/articleFilters';
import { Plus, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/router';
import { useState } from 'react';

const CMSArticlesManagement = () => {
  const router = useRouter();
  const { articles, loading, refetch } = useAllArticles();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [trendingFilter, setTrendingFilter] = useState<boolean | null>(null);

  const filteredArticles = filterArticles(articles, searchTerm, statusFilter, trendingFilter);

  const handleRefresh = () => {
    refetch();
  };

  if (loading) {
    return (
      <CMSLayout>
        <AnimatedLoading />
      </CMSLayout>
    );
  }

  return (
    <CMSLayout>
      <div className="space-y-8">
        <PanelPageHeader
          title="Articles"
          description={`Manage your drafts and submissions (${articles.length} total)`}
          actions={
            <>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-stone-200 bg-white text-stone-800 hover:bg-stone-50"
                onClick={handleRefresh}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Button type="button" size="sm" className="shadow-sm" onClick={() => router.push('/cms/articles/create')}>
                <Plus className="mr-2 h-4 w-4" />
                Create article
              </Button>
            </>
          }
        />

        <ArticleFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          trendingFilter={trendingFilter}
          setTrendingFilter={setTrendingFilter}
          totalArticles={filteredArticles.length}
        />

        <div className={cn(PANEL_CARD, 'overflow-hidden')}>
          <CMSArticlesList articles={filteredArticles} loading={loading} />
        </div>
      </div>
    </CMSLayout>
  );
};

export default CMSArticlesManagement;
