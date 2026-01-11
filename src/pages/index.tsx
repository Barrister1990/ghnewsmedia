import { GetServerSideProps } from 'next';
import React from 'react';
import BreakingNews from '../components/BreakingNews';
import CategorySection from '../components/CategorySection';
import EditorsPicks from '../components/EditorsPicks';
import Footer from '../components/Footer';
import Header from '../components/Header';
import HeroFeaturedSection from '../components/HeroFeaturedSection';
import LatestNews from '../components/LatestNews';
import ReadingProgress from '../components/ReadingProgress';
import ScrollToTop from '../components/ScrollToTop';
import EnhancedSEOHead from '../components/SEO/EnhancedSEOHead';
import SitemapGenerator from '../components/SEO/SitemapGenerator';
import TrendingCarousel from '../components/TrendingCarousel';
import TrendingSection from '../components/TrendingSidebar';
import { MultiplexAd } from '../components/AdSense';
import { AD_SLOTS } from '../config/adsense';
import { supabase } from '../integrations/supabase/client';
import { transformToNewsArticle } from '../lib/articles';
import { NewsArticle } from '../types/news';
import { generateOrganizationStructuredData, generateWebSiteStructuredData } from '../utils/seo';

interface IndexProps {
  articles: NewsArticle[];
  error?: string;
}

const Index: React.FC<IndexProps> = ({ articles, error }) => {
  // Organize articles by category for Pulse.com.gh style layout
  const featuredArticles = articles.filter(article => article.featured);
  const latestArticles = articles.filter(article => !article.featured);
  
  // Group articles by category
  const articlesByCategory = articles.reduce((acc, article) => {
    const categoryName = article.category.name;
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(article);
    return acc;
  }, {} as Record<string, NewsArticle[]>);

  // Get top articles for featured section
  const topFeatured = featuredArticles.length > 0 
    ? featuredArticles.slice(0, 4)
    : latestArticles.slice(0, 4);
  
  // Get all unique categories dynamically (sorted by article count, then alphabetically)
  const allCategories = Object.entries(articlesByCategory)
    .map(([name, categoryArticles]) => ({
      name,
      slug: categoryArticles[0]?.category.slug || name.toLowerCase().replace(/\s+/g, '-'),
      articles: categoryArticles,
      count: categoryArticles.length
    }))
    .sort((a, b) => {
      // Sort by count first (descending), then by name
      if (b.count !== a.count) {
        return b.count - a.count;
      }
      return a.name.localeCompare(b.name);
    })
    .filter(cat => cat.count > 0); // Only show categories with articles

  // Get categories for navigation structured data (top 8 categories with articles)
  const navCategories = allCategories.slice(0, 8).map(cat => ({
    name: cat.name,
    slug: cat.slug
  }));

  const combinedStructuredData = [
    generateOrganizationStructuredData(),
    generateWebSiteStructuredData(navCategories),
    // Add homepage-specific structured data
    {
      "@context": "https://schema.org",
      "@type": "NewsMediaOrganization",
      "name": "GH News",
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
          "url": `https://ghnewsmedia.com/${article.category.slug}/${article.slug}`,
          "datePublished": article.publishedAt,
          "author": {
            "@type": "Person",
            "name": article.author.name
          }
        }))
      }
    }
  ];

  const seoTitle = "Ghana's Digital News Platform";
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFFFF' }}>
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
      
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-7xl">
          {/* Main Content Area - Full width (Pulse style) */}
          <div>
            {/* Mobile Hero: Trending Carousel */}
            <div className="md:hidden mb-8">
              <TrendingCarousel initialArticles={articles} />
            </div>
            
            {/* Desktop Hero: Featured Section - Pulse.com.gh Style */}
            <div className="hidden md:block">
              <HeroFeaturedSection articles={topFeatured} />
            </div>

            {/* Multiplex Ad #1 - After Hero Section (Top of content) */}
            <MultiplexAd adSlot={AD_SLOTS.MULTIPLEX_1} />

            {/* Editor's Picks */}
            <EditorsPicks articles={featuredArticles.length > 0 ? featuredArticles : latestArticles.slice(0, 5)} />

            {/* Latest News - Newest articles sorted by date */}
            <LatestNews articles={articles} />

            {/* Multiplex Ad #2 - After Latest News (Middle of content) */}
            <MultiplexAd adSlot={AD_SLOTS.MULTIPLEX_1} />

            {/* Category Sections - Dynamically display all categories */}
            {allCategories.map((category, index) => {
              // Show Trending section after first category (Entertainment typically)
              if (index === 1) {
                return (
                  <React.Fragment key={`category-${category.slug}`}>
                    <CategorySection 
                      title={category.name}
                      articles={category.articles}
                      categorySlug={category.slug}
                    />
                    {/* Trending Section - Full width (Pulse style) */}
                    <TrendingSection articles={articles} />
                  </React.Fragment>
                );
              }
              
              // Add ad only after the 3rd category (one ad max in category section)
              // This ensures we stay within Google's 3 display ad limit per page
              const showAd = index === 2;
              
              return (
                <React.Fragment key={category.slug}>
                  {showAd && <MultiplexAd adSlot={AD_SLOTS.MULTIPLEX_1} />}
                  <CategorySection 
                    title={category.name}
                    articles={category.articles}
                    categorySlug={category.slug}
                  />
                </React.Fragment>
              );
            })}

            {/* Trending Section - If no categories, show it at the end */}
            {allCategories.length <= 1 && (
              <TrendingSection articles={articles} />
            )}
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
