
import AdminLayout from '@/components/admin/AdminLayout';
import { AnimatedLoading } from '@/components/admin/AnimatedLoading';
import ArticleCards from '@/components/admin/ArticleCards';
import ArticleFilters from '@/components/admin/ArticleFilters';
import ArticleTable from '@/components/admin/ArticleTable';
import { Button } from '@/components/ui/button';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { useAllArticles } from '@/hooks/useAllArticles';
import { filterArticles } from '@/utils/articleFilters';
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

        <div className="flex justify-between items-center">
          <ArticleFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            trendingFilter={trendingFilter}
            setTrendingFilter={setTrendingFilter}
            totalArticles={filteredArticles.length}
          />
          <div className="flex space-x-2">
            <Button variant={viewMode === 'list' ? 'secondary' : 'outline'} size="icon" onClick={() => setViewMode('list')}>
              <List className="h-4 w-4" />
            </Button>
            <Button variant={viewMode === 'card' ? 'secondary' : 'outline'} size="icon" onClick={() => setViewMode('card')}>
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
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
