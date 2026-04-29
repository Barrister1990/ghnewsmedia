
import { ADMIN_PANEL_CARD } from '@/components/admin/AdminPageHeader';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Filter, Search } from 'lucide-react';
import React from 'react';

interface ArticleFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  trendingFilter: boolean | null;
  setTrendingFilter: (trending: boolean | null) => void;
  totalArticles?: number;
}

const ArticleFilters: React.FC<ArticleFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  trendingFilter,
  setTrendingFilter,
  totalArticles,
}) => {
  return (
    <div className={cn(ADMIN_PANEL_CARD, 'p-4 sm:p-5')}>
      <div className="mb-4 flex items-center gap-2 text-sm font-medium text-stone-800">
        <Filter className="h-4 w-4 text-stone-500" aria-hidden />
        Filters
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-end lg:gap-4">
        <div className="min-w-0 flex-1 lg:min-w-[240px]">
          <label htmlFor="search" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-stone-500">
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" aria-hidden />
            <Input
              id="search"
              type="text"
              placeholder="Title or author…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-stone-200 bg-white pl-10 focus-visible:ring-stone-400"
            />
          </div>
        </div>

        <div className="w-full lg:w-[180px] xl:w-[200px]">
          <label htmlFor="status" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-stone-500">
            Status
          </label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger id="status" className="border-stone-200 bg-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="border-stone-200 bg-white">
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full lg:w-[180px] xl:w-[200px]">
          <label htmlFor="trending" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-stone-500">
            Spotlight
          </label>
          <Select
            value={trendingFilter === null ? 'all' : String(trendingFilter)}
            onValueChange={(value) => {
              if (value === 'all') {
                setTrendingFilter(null);
              } else {
                setTrendingFilter(value === 'true');
              }
            }}
          >
            <SelectTrigger id="trending" className="border-stone-200 bg-white">
              <SelectValue placeholder="Trending" />
            </SelectTrigger>
            <SelectContent className="border-stone-200 bg-white">
              <SelectItem value="all">Any</SelectItem>
              <SelectItem value="true">Trending only</SelectItem>
              <SelectItem value="false">Not trending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {totalArticles !== undefined && (
        <div className="mt-4 border-t border-stone-100 pt-3 text-sm text-stone-600">
          Showing{' '}
          <span className="font-semibold text-stone-900">{totalArticles}</span> matching article
          {totalArticles !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
};

export default ArticleFilters;
