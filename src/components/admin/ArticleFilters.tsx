
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
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
  totalArticles
}) => {
  return (
    <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm">
      <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4 lg:items-end">
        <div className="flex-1">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            Search Articles
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              id="search"
              type="text"
              placeholder="Search by title or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="lg:w-48">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
            Status Filter
          </label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Articles</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="lg:w-48">
          <label htmlFor="trending" className="block text-sm font-medium text-gray-700 mb-2">
            Trending Filter
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
            <SelectTrigger>
              <SelectValue placeholder="Select trending status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="true">Trending</SelectItem>
              <SelectItem value="false">Not Trending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {totalArticles !== undefined && (
        <div className="mt-4 text-sm text-gray-600">
          Showing {totalArticles} article{totalArticles !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
};

export default ArticleFilters;
