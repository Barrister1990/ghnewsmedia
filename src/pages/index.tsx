import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useState } from 'react';
import BreakingNews from '../components/BreakingNews';
import Footer from '../components/Footer';
import Header from '../components/Header';
import MostReadSection from '../components/MostReadSection';
import Pagination from '../components/Pagination';
import ReadingProgress from '../components/ReadingProgress';
import ScrollToTop from '../components/ScrollToTop';
import EnhancedSEOHead from '../components/SEO/EnhancedSEOHead';
import SitemapGenerator from '../components/SEO/SitemapGenerator';
import SocialMediaFeed from '../components/SocialMediaFeed';
import TrendingCarousel from '../components/TrendingCarousel';
import TrendingTopics from '../components/TrendingTopics';
import { supabase } from '../integrations/supabase/client';
import { transformToNewsArticle } from '../lib/articles';
import { NewsArticle } from '../types/news';
import { generateOrganizationStructuredData, generateWebSiteStructuredData } from '../utils/seo';

interface IndexProps {
  articles: NewsArticle[];
  error?: string;
}

const Index: React.FC<IndexProps> = ({ articles, error }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 12; // Number of articles per page
  
  const featuredArticles = articles.filter(article => article.featured);
  const latestArticles = articles.filter(article => !article.featured);
  
  // Pagination logic
  const totalPages = Math.ceil(latestArticles.length / articlesPerPage);
  const startIndex = (currentPage - 1) * articlesPerPage;
  const currentArticles = latestArticles.slice(startIndex, startIndex + articlesPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const combinedStructuredData = [
    generateOrganizationStructuredData(),
    generateWebSiteStructuredData(),
    // Add homepage-specific structured data
    {
      "@context": "https://schema.org",
      "@type": "NewsMediaOrganization",
      "name": "GhNewsMedia",
      "url": "https://ghnewsmedia.com",
      "logo": "https://ghnewsmedia.com/logo.jpg",
      "sameAs": [
        "https://twitter.com/ghnewsmedia",
        "https://facebook.com/ghnewsmedia",
        "https://instagram.com/ghnewsmedia"
      ],
      "mainEntity": {
        "@type": "ItemList",
        "numberOfItems": articles.length,
        "itemListElement": articles.slice(0, 10).map((article, index) => ({
          "@type": "NewsArticle",
          "position": index + 1,
          "headline": article.title,
          "url": `https://ghnewsmedia.com/news/${article.slug}`,
          "datePublished": article.publishedAt,
          "author": {
            "@type": "Person",
            "name": article.author.name
          }
        }))
      }
    }
  ];

  const seoTitle = "GhNewsMedia - Ghana's Premier Digital News Platform";
  const seoDescription = "Stay informed with Ghana's leading digital news platform. Get breaking news, politics, business, sports, and entertainment updates from trusted journalists across Ghana. Real-time coverage of Accra and beyond.";

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <EnhancedSEOHead
          title={seoTitle}
          description={seoDescription}
          canonical="https://ghnewsmedia.com"
          type="website"
          tags={['Ghana news', 'breaking news', 'politics', 'business', 'sports', 'entertainment']}
          structuredData={combinedStructuredData}
        />
        
        <ReadingProgress />
        <Header />
        
        <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
          <div className="text-center py-8 sm:py-12">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Unable to Load Articles</h2>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 px-4">We&apos;re experiencing some technical difficulties. Please try again later.</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-primary text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-primary-700 transition-colors text-sm sm:text-base"
            >
              Refresh Page
            </button>
          </div>
        </main>
        
        <Footer />
        <ScrollToTop />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <EnhancedSEOHead
        title={seoTitle}
        description={seoDescription}
        canonical="https://ghnewsmedia.com"
        type="website"
        tags={['Ghana news', 'breaking news', 'politics', 'business', 'sports', 'entertainment', 'Accra news', 'Ghana politics', 'West Africa news', 'Ghana economy', 'Ghana elections']}
        structuredData={combinedStructuredData}
        language="en-GB"
      />
      
      <SitemapGenerator />
      <ReadingProgress />
      
      <Header />
      
      {/* Breaking News - displayed below the header */}
      <BreakingNews />
      
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Trending Carousel - positioned right after breaking news */}
        {articles.some(article => article.trending) && <TrendingCarousel />}
        
        {/* BBC-Inspired News Layout */}
        <div className="space-y-8">
          {/* Featured Stories - BBC Hero Section */}
          {featuredArticles.length > 0 && (
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 border-b-4 border-red-600 pb-2">
                  Featured Stories
                </h2>
                <div className="hidden sm:block w-16 h-1 bg-red-600"></div>
              </div>
              
              {/* Hero Article - Large Featured */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8">
                  {featuredArticles[0] && (
                    <Link href={`/news/${featuredArticles[0].slug}`} className="block group">
                      <div className="relative overflow-hidden rounded-lg bg-white shadow-sm hover:shadow-lg transition-all duration-300">
                        <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden">
                          <img
                            src={featuredArticles[0].featuredImage}
                            alt={featuredArticles[0].title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                          
                          {/* Category Badge */}
                          <div className="absolute top-4 left-4">
                            <span 
                              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white shadow-lg"
                              style={{ backgroundColor: featuredArticles[0].category.color }}
                            >
                              {featuredArticles[0].category.name}
                            </span>
                          </div>
                          
                          {/* Content Overlay */}
                          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2 line-clamp-3">
                              {featuredArticles[0].title}
                            </h3>
                            <p className="text-sm sm:text-base text-gray-200 mb-3 line-clamp-2">
                              {featuredArticles[0].excerpt}
                            </p>
                            <div className="flex items-center gap-4 text-xs sm:text-sm text-gray-300">
                              <span>{featuredArticles[0].author.name}</span>
                              <span>•</span>
                              <span>{featuredArticles[0].readTime}m read</span>
                              <span>•</span>
                              <span>{featuredArticles[0].views} views</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )}
                </div>
                
                {/* Side Featured Articles */}
                <div className="lg:col-span-4 space-y-4">
                  {featuredArticles.slice(1, 4).map((article, index) => (
                    <Link key={article.id} href={`/news/${article.slug}`} className="block group">
                      <div className="relative overflow-hidden rounded-lg bg-white shadow-sm hover:shadow-lg transition-all duration-300">
                        <div className="flex gap-3">
                          <div className="relative w-24 h-20 sm:w-28 sm:h-24 overflow-hidden rounded-l-lg">
                            <img
                              src={article.featuredImage}
                              alt={article.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="flex-1 p-3 sm:p-4">
                            <span 
                              className="inline-block px-2 py-1 rounded text-xs font-semibold text-white mb-2"
                              style={{ backgroundColor: article.category.color }}
                            >
                              {article.category.name}
                            </span>
                            <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                              {article.title}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span>{article.readTime}m</span>
                              <span>•</span>
                              <span>{article.views} views</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}
          
          {/* Latest News - BBC Grid Layout */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 border-b-4 border-blue-600 pb-2">
                Latest News
              </h2>
              <div className="hidden sm:block w-16 h-1 bg-blue-600"></div>
            </div>
            
            {currentArticles.length > 0 ? (
              <>
                {/* BBC-Style News Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {currentArticles.map((article) => (
                    <Link key={article.id} href={`/news/${article.slug}`} className="block group">
                      <div className="relative overflow-hidden rounded-lg bg-white shadow-sm hover:shadow-lg transition-all duration-300">
                        {/* Image */}
                        <div className="relative h-40 sm:h-48 overflow-hidden">
                          <img
                            src={article.featuredImage}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                          
                          {/* Category Badge */}
                          <div className="absolute top-3 left-3">
                            <span 
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold text-white shadow-md"
                              style={{ backgroundColor: article.category.color }}
                            >
                              {article.category.name}
                            </span>
                          </div>
                          
                          {/* Trending Badge */}
                          {article.trending && (
                            <div className="absolute top-3 right-3">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-orange-500 text-white shadow-md">
                                🔥 Trending
                              </span>
                            </div>
                          )}
                        </div>
                        
                        {/* Content */}
                        <div className="p-3 sm:p-4">
                          <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                            {article.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2">
                            {article.excerpt}
                          </p>
                          
                          {/* Meta Info */}
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center gap-2">
                              <span>{article.readTime}m</span>
                              <span>•</span>
                              <span>{article.views} views</span>
                            </div>
                            <span className="text-xs font-medium">{article.author.name}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-gray-600 mb-4">No articles published yet.</p>
                <p className="text-gray-500">Check back soon for the latest news and updates!</p>
              </div>
            )}
          </section>
        </div>
        
        {/* Sidebar - Mobile Optimized */}
        <aside className="mt-8 lg:mt-12 space-y-6">
          <TrendingTopics />
          <MostReadSection />
          <section className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 border-b-2 border-green-600 pb-2">
              Follow Us
            </h2>
            <SocialMediaFeed />
          </section>
        </aside>
      </main>
      
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<IndexProps> = async (context) => {
  try {
    // Fetch published articles from Supabase
    const { data: articlesData, error: articlesError } = await supabase
      .from('articles_with_details')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false })
      .limit(50); // Limit for homepage performance

    if (articlesError) {
      console.error('Error fetching articles:', articlesError);
      return {
        props: {
          articles: [],
          error: 'Failed to load articles'
        }
      };
    }

    // Transform articles, handling potential null values
const transformedArticles = (articlesData || [])
  .filter(article => article.id && article.title && article.content) // Filter out incomplete articles
  .map(transformToNewsArticle)
  .sort((a, b) => {
    const dateA = new Date(a.publishedAt).getTime();
    const dateB = new Date(b.publishedAt).getTime();
    return dateB - dateA; // Descending: latest first
  });


    // Set cache headers for better performance
    // Homepage should be cached more aggressively since it's the main entry point
    context.res.setHeader(
      'Cache-Control',
      'public, s-maxage=180, stale-while-revalidate=360'
    );

    return {
      props: { 
        articles: transformedArticles,
      },
    };

  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    
    return {
      props: {
        articles: [],
        error: 'An unexpected error occurred while loading articles'
      }
    };
  }
};

export default Index;
