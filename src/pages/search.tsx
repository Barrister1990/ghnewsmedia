import SEOHead from '@/components/SEO/SEOHead';
import { NewsArticle } from '@/types/news';
import { Search } from 'lucide-react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import AdvancedSearchFilters from '../components/AdvancedSearchFilters';
import Footer from '../components/Footer';
import Header from '../components/Header';
import ScrollToTop from '../components/ScrollToTop';
import StoryCard from '../components/site/StoryCard';
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

  const pageTitle = query ? `Search Results for "${query}" | Ghana Point` : 'Search News | Ghana Point';
  const pageDescription = query
    ? `Search results for "${query}" on Ghana Point - Ghana's premier news platform`
    : 'Search for news articles, topics, and authors on Ghana Point - Ghana\'s leading digital news platform';
  const busy = articlesLoading || isLoading;

  return (
    <>
      <SEOHead title={pageTitle} description={pageDescription} noindex />

      <div className="gp-site min-h-screen bg-white">
        <Header />

        <main id="main-content" className="mx-auto max-w-[1280px] px-4 pb-8">
          <header className="mb-6 mt-6 border-b-2 border-gp-ink pb-6">
            <h1 className="text-[2rem] font-black leading-tight text-gp-ink sm:text-[2.75rem]">Search</h1>
            <form onSubmit={handleSubmit} className="mt-4 flex max-w-3xl items-center gap-3" role="search">
              <div className="flex flex-1 items-center gap-2 border-b-2 border-gp-ink">
                <Search className="h-5 w-5 shrink-0 text-gp-muted" aria-hidden />
                <input
                  type="search"
                  placeholder="Search articles, topics, authors..."
                  aria-label="Search Ghana Point"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full bg-transparent py-2 text-lg outline-none"
                />
              </div>
              <button type="submit" className="bg-gp-ink px-6 py-2.5 text-sm font-bold text-white hover:bg-gp-text">
                Search
              </button>
            </form>
          </header>

          <AdvancedSearchFilters onFiltersChange={handleFiltersChange} className="mb-6" />

          <section aria-live="polite" className="max-w-4xl">
            <div className="flex items-end justify-between border-b border-gp-line pb-2">
              <h2 className="text-xl font-bold text-gp-ink">
                {query ? `Results for "${query}"` : 'All Articles'}
              </h2>
              <span className="text-sm text-gp-muted">
                {busy ? 'Searching...' : `${results.length} ${results.length === 1 ? 'result' : 'results'}`}
              </span>
            </div>

            {busy ? (
              <ul aria-hidden>
                {[...Array(5)].map((_, i) => (
                  <li key={i} className="flex animate-pulse gap-6 border-b border-gp-line py-5">
                    <div className="flex-1 space-y-3">
                      <div className="h-3 w-20 bg-gp-surface" />
                      <div className="h-5 w-3/4 bg-gp-surface" />
                      <div className="h-4 w-1/2 bg-gp-surface" />
                    </div>
                    <div className="aspect-video w-32 bg-gp-surface sm:w-56" />
                  </li>
                ))}
              </ul>
            ) : results.length > 0 ? (
              results.map((article) => (
                <StoryCard key={article.id} article={article} variant="feed" showCategory headingLevel="h3" />
              ))
            ) : (
              <div className="py-12">
                <p className="text-lg font-bold text-gp-ink">
                  {query ? `No articles found for "${query}".` : 'No articles match your current filters.'}
                </p>
                <p className="mt-2 text-gp-muted">Try different words or adjust the filters.</p>
                <div className="mt-6 flex flex-wrap items-center gap-2">
                  <span className="text-sm text-gp-muted">Popular searches:</span>
                  {['politics', 'business', 'sports', 'technology'].map((term) => (
                    <button
                      key={term}
                      onClick={() => handlePopularSearchClick(term)}
                      className="border border-gp-ink px-3 py-1 text-sm font-bold hover:bg-gp-ink hover:text-white"
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