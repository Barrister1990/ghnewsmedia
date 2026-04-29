
import AdminLayout from '@/components/admin/AdminLayout';
import { AnimatedLoading } from '@/components/admin/AnimatedLoading';
import { ADMIN_PANEL_CARD, AdminPageHeader } from '@/components/admin/AdminPageHeader';
import ArticleCards from '@/components/admin/ArticleCards';
import ArticleFilters from '@/components/admin/ArticleFilters';
import ArticleTable from '@/components/admin/ArticleTable';
import { Button } from '@/components/ui/button';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { useAllArticles } from '@/hooks/useAllArticles';
import { filterArticles } from '@/utils/articleFilters';
import { cn } from '@/lib/utils';
import { LayoutGrid, List, Plus, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

const ArticlesManagement = () => {
  const router = useRouter();
  const { articles, loading, refetch, toggleTrending, deleteArticle, updateArticleStatus, toggleFeatured } = useAllArticles();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [trendingFilter, setTrendingFilter] = useState<boolean | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'card'>('list');
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 10;

  const filteredArticles = useMemo(() => {
    return filterArticles(articles, searchTerm, statusFilter, trendingFilter);
  }, [articles, searchTerm, statusFilter, trendingFilter]);

  const paginatedArticles = useMemo(() => {
    const startIndex = (currentPage - 1) * articlesPerPage;
    return filteredArticles.slice(startIndex, startIndex + articlesPerPage);
  }, [filteredArticles, currentPage, articlesPerPage]);

  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);

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
      <div className="space-y-6 pb-4 lg:space-y-8">
        <AdminPageHeader
          title="Articles"
          description={`Manage drafts and published pieces (${articles.length} total).`}
          actions={
            <>
              <Button
                onClick={handleRefresh}
                variant="outline"
                className="w-full gap-2 border-stone-200 bg-white sm:w-auto"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
              <Button onClick={() => router.push('/admin/articles/create')} className="w-full gap-2 sm:w-auto">
                <Plus className="h-4 w-4" />
                New article
              </Button>
            </>
          }
        />

        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1">
            <ArticleFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              trendingFilter={trendingFilter}
              setTrendingFilter={setTrendingFilter}
              totalArticles={filteredArticles.length}
            />
          </div>
          <div className="flex shrink-0 justify-end gap-1 rounded-2xl border border-stone-200 bg-white p-1 shadow-sm lg:self-start">
            <Button
              type="button"
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              className="rounded-xl"
              onClick={() => setViewMode('list')}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant={viewMode === 'card' ? 'secondary' : 'ghost'}
              size="icon"
              className="rounded-xl"
              onClick={() => setViewMode('card')}
              aria-label="Card view"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className={cn(ADMIN_PANEL_CARD, 'overflow-hidden')}>
          {viewMode === 'list' ? (
            <ArticleTable
              articles={paginatedArticles}
              onUpdateStatus={updateArticleStatus}
              onToggleFeatured={toggleFeatured}
              onToggleTrending={toggleTrending}
              onDelete={deleteArticle}
            />
          ) : (
            <ArticleCards
              articles={paginatedArticles}
              onUpdateStatus={updateArticleStatus}
              onToggleFeatured={toggleFeatured}
              onToggleTrending={toggleTrending}
              onDelete={deleteArticle}
            />
          )}
        </div>

        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage((prev) => Math.max(prev - 1, 1));
                  }}
                />
              </PaginationItem>
              {[...Array(totalPages)].map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    href="#"
                    isActive={currentPage === i + 1}
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(i + 1);
                    }}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </AdminLayout>
  );
};

export default ArticlesManagement;
