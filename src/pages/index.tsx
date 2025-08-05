import { GetServerSideProps } from 'next';
import { useState } from 'react';
import BreakingNews from '../components/BreakingNews';
import Footer from '../components/Footer';
import Header from '../components/Header';
import MostReadSection from '../components/MostReadSection';
import NewsCard from '../components/NewsCard';
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
  const articlesPerPage = 6;
  
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
        
        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-8">
            {/* Featured Articles */}
            {featuredArticles.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Stories</h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    {featuredArticles[0] && (
                      <NewsCard article={featuredArticles[0]} variant="featured" />
                    )}
                  </div>
                  <div className="space-y-6">
                    {featuredArticles.slice(1, 3).map((article) => (
                      <NewsCard
                        key={article.id}
                        article={article}
                        variant="horizontal"
                      />
                    ))}
                  </div>
                </div>
              </section>
            )}
            
            {/* Latest News */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Latest News</h2>
              {currentArticles.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                    {currentArticles.map((article) => (
                      <NewsCard key={article.id} article={article} />
                    ))}
                  </div>
                  
                  {totalPages > 1 && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
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

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-8">
            <TrendingTopics />
            <MostReadSection />
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Follow Us</h2>
              <SocialMediaFeed />
            </section>
          </aside>
        </div>
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
