import { NewsArticle } from '@/types/news';
import { Search } from 'lucide-react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import AdvancedSearchFilters from '../components/AdvancedSearchFilters';
import Footer from '../components/Footer';
import Header from '../components/Header';
import NewsCard from '../components/NewsCard';
import ScrollToTop from '../components/ScrollToTop';
import { usePublishedArticles } from '../hooks/usePublishedArticles';
interface SearchFilters {
  category: string;
  dateRange: string;
  author: string;
  sortBy: string;
  tags: string[];
}



const SearchPage: React.FC = () => {
  const router = useRouter();
  const { q } = router.query;
  
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filters, setFilters] = useState<SearchFilters>({
    category: '',
    dateRange: '',
    author: '',
    sortBy: 'newest',
    tags: []
  });
  
  const { articles, loading: articlesLoading } = usePublishedArticles();

  // Set initial query from URL params
  useEffect(() => {
    if (router.isReady && q && typeof q === 'string') {
      setQuery(q);
    }
  }, [router.isReady, q]);

  const applyFilters = (articlesToFilter: NewsArticle[], searchQuery: string, currentFilters: SearchFilters): NewsArticle[] => {
    let filtered = [...articlesToFilter];

    // Text search
    if (searchQuery.trim()) {
      const queryLower = searchQuery.toLowerCase();
      filtered = filtered.filter((article: NewsArticle) =>
        article.title.toLowerCase().includes(queryLower) ||
        article.excerpt.toLowerCase().includes(queryLower) ||
        article.content.toLowerCase().includes(queryLower) ||
        article.tags.some((tag: string) => tag.toLowerCase().includes(queryLower)) ||
        article.author.name.toLowerCase().includes(queryLower) ||
        article.category.name.toLowerCase().includes(queryLower)
      );
    }

    // Category filter
    if (currentFilters.category) {
      filtered = filtered.filter((article: NewsArticle) => 
        article.category.slug === currentFilters.category
      );
    }

    // Author filter
    if (currentFilters.author) {
      const authorQuery = currentFilters.author.toLowerCase();
      filtered = filtered.filter((article: NewsArticle) =>
        article.author.name.toLowerCase().includes(authorQuery)
      );
    }

    // Tags filter
    if (currentFilters.tags.length > 0) {
      filtered = filtered.filter((article: NewsArticle) =>
        currentFilters.tags.some(filterTag =>
          article.tags.some((articleTag: string) =>
            articleTag.toLowerCase().includes(filterTag.toLowerCase())
          )
        )
      );
    }

    // Date range filter
    if (currentFilters.dateRange) {
      const now = new Date();
      const filterDate = new Date();
      
      switch (currentFilters.dateRange) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          filterDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      if (currentFilters.dateRange !== '') {
        filtered = filtered.filter((article: NewsArticle) => 
          new Date(article.publishedAt) >= filterDate
        );
      }
    }

    // Sort results
    switch (currentFilters.sortBy) {
      case 'oldest':
        filtered.sort((a: NewsArticle, b: NewsArticle) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime());
        break;
      case 'most-read':
        filtered.sort((a: NewsArticle, b: NewsArticle) => (b.views || 0) - (a.views || 0));
        break;
      case 'trending':
        filtered.sort((a: NewsArticle, b: NewsArticle) => (b.trending ? 1 : 0) - (a.trending ? 1 : 0));
        break;
      default: // newest
        filtered.sort((a: NewsArticle, b: NewsArticle) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    }

    return filtered;
  };

  const handleSearch = (searchQuery: string, currentFilters: SearchFilters = filters) => {
    setQuery(searchQuery);
    setIsLoading(true);
    
    // Update URL params using Next.js router
    const queryParams = searchQuery.trim() ? { q: searchQuery } : {};
    router.push({
      pathname: '/search',
      query: queryParams
    }, undefined, { shallow: true });

    // Simulate loading delay
    setTimeout(() => {
      const filteredResults = applyFilters(articles as NewsArticle[], searchQuery, currentFilters);
      setResults(filteredResults);
      setIsLoading(false);
    }, 300);
  };

  const handleFiltersChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    handleSearch(query, newFilters);
  };

  // Handle initial search from URL params and articles loading
  useEffect(() => {
    if (!articlesLoading && articles && articles.length > 0) {
      const urlQuery = typeof q === 'string' ? q : '';
      if (urlQuery) {
        handleSearch(urlQuery);
      } else {
        const filteredResults = applyFilters(articles as NewsArticle[], '', filters);
        setResults(filteredResults);
      }
    }
  }, [articlesLoading, articles, q]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSearch(query);
  };

  const handlePopularSearchClick = (term: string) => {
    handleSearch(term);
  };

  if (articlesLoading) {
    return (
      <>
        <Head>
          <title>Search News - Loading | GH News</title>
          <meta name="description" content="Search for news articles on GH News" />
        </Head>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
            <div className="text-center mb-8 sm:mb-12">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">Search News</h1>
              <div className="animate-pulse">
                <div className="h-10 sm:h-12 bg-gray-200 rounded-xl max-w-2xl mx-auto mb-6 sm:mb-8"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-white rounded-xl shadow-sm p-3 sm:p-4">
                      <div className="h-40 sm:h-48 bg-gray-200 rounded mb-3 sm:mb-4"></div>
                      <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  const pageTitle = query ? `Search Results for "${query}" | GH News` : 'Search News | GH News';
  const pageDescription = query
    ? `Search results for "${query}" on GH News - Ghana's premier news platform`
    : 'Search for news articles, topics, and authors on GH News - Ghana\'s leading digital news platform';

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="robots" content="index, follow" />
        {query && <meta name="keywords" content={`${query}, Ghana news, search results`} />}
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
          {/* Search Header */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">Search News</h1>
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto relative">
              <input
                type="text"
                placeholder="Search articles, topics, authors..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 pl-10 sm:pl-12 text-base sm:text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
              />
              <Search className="absolute left-3 sm:left-4 top-3.5 sm:top-5 w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
              <button
                type="submit"
                className="absolute right-1.5 sm:right-2 top-1.5 sm:top-2 px-3 sm:px-6 py-1.5 sm:py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors text-sm sm:text-base"
              >
                <span className="hidden sm:inline">Search</span>
                <Search className="w-4 h-4 sm:hidden" />
              </button>
            </form>
          </div>
          
          {/* Advanced Filters */}
          <AdvancedSearchFilters 
            onFiltersChange={handleFiltersChange}
            className="mb-6 sm:mb-8"
          />
          
          {/* Search Results */}
          <section>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-2 sm:gap-4">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                {query ? `Search Results for "${query}"` : 'All Articles'}
              </h2>
              <span className="text-gray-600 text-sm sm:text-base">
                {isLoading ? 'Searching...' : `${results.length} ${results.length === 1 ? 'result' : 'results'}`}
              </span>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
                    <div className="h-40 sm:h-48 bg-gray-200"></div>
                    <div className="p-4 sm:p-6">
                      <div className="h-3 sm:h-4 bg-gray-200 rounded mb-2 sm:mb-3"></div>
                      <div className="h-4 sm:h-6 bg-gray-200 rounded mb-2 sm:mb-3"></div>
                      <div className="h-3 sm:h-4 bg-gray-200 rounded mb-3 sm:mb-4"></div>
                      <div className="flex justify-between">
                        <div className="h-3 sm:h-4 bg-gray-200 rounded w-20 sm:w-24"></div>
                        <div className="h-3 sm:h-4 bg-gray-200 rounded w-12 sm:w-16"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : results.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {results.map((article) => (
                  <NewsCard key={article.id} article={article} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12">
                <div className="text-4xl sm:text-6xl mb-4 sm:mb-6">🔍</div>
                <p className="text-gray-600 text-base sm:text-lg mb-3 sm:mb-4">
                  {query ? `No articles found for "${query}".` : 'No articles match your current filters.'}
                </p>
                <p className="text-gray-500 mb-6 sm:mb-8 text-sm sm:text-base">
                  Try adjusting your search terms or filters to find what you&quot;re looking for.
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  <span className="text-xs sm:text-sm text-gray-500 mr-2">Popular searches:</span>
                  {['politics', 'business', 'sports', 'technology'].map((term) => (
                    <button
                      key={term}
                      onClick={() => handlePopularSearchClick(term)}
                      className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs sm:text-sm hover:bg-gray-200 transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </section>
        </main>
        
        <Footer />
        <ScrollToTop />
      </div>
    </>
  );
};

export default SearchPage;