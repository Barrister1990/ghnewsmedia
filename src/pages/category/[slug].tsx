import Footer from '@/components/Footer';
import Header from '@/components/Header';
import NewsCard from '@/components/NewsCard';
import ScrollToTop from '@/components/ScrollToTop';
import BreadcrumbSEO from '@/components/SEO/BreadcrumbSEO';
import SEOHead from '@/components/SEO/SEOHead';
import { supabase } from '@/integrations/supabase/client';
import { transformToNewsArticle } from '@/lib/articles';
import { Category, NewsArticle } from '@/types/news';
import { getCategoryIcon } from '@/utils/categoryIcons';
import { generateMetaTitle, truncateDescription } from '@/utils/seo';
import { GetServerSideProps } from 'next';

interface CategoryPageProps {
  category: Category | null;
  articles: NewsArticle[];
  totalArticles: number;
  error?: string;
}

const CategoryPage: React.FC<CategoryPageProps> = ({ 
  category, 
  articles, 
  totalArticles, 
  error 
}) => {
  // Handle error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <SEOHead
          title="Error - GhNewsMedia"
          description="An error occurred while loading the category page."
          canonical="https://ghnewsmedia.com"
        />
        <div className="text-center px-4">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Something went wrong
          </h1>
          <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
            {error}
          </p>
          <a 
            href="/" 
            className="bg-primary text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-primary-700 transition-colors text-sm sm:text-base"
          >
            Go Home
          </a>
        </div>
      </div>
    );
  }

  // Handle category not found
  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <SEOHead
          title="Category Not Found - GhNewsMedia"
          description="The category you're looking for could not be found. Browse our news categories and latest updates from Ghana."
          canonical="https://ghnewsmedia.com/404"
        />
        <div className="text-center px-4">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Category Not Found
          </h1>
          <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
            Sorry, the category you're looking for doesn't exist.
          </p>
          <a 
            href="/" 
            className="bg-primary text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-primary-700 transition-colors text-sm sm:text-base"
          >
            Go Home
          </a>
        </div>
      </div>
    );
  }

  const breadcrumbItems = [
    { name: 'Home', url: 'https://ghnewsmedia.com' },
    { name: category.name }
  ];

  const categoryStructuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${category.name} News - GhNewsMedia`,
    "description": category.description,
    "url": `https://ghnewsmedia.com/category/${category.slug}`,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": totalArticles,
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
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title={generateMetaTitle(`${category.name} News`, 'Category')}
        description={truncateDescription(`${category.description} Stay updated with the latest ${category.name.toLowerCase()} news from Ghana.`)}
        canonical={`https://ghnewsmedia.com/category/${category.slug}`}
        tags={[`${category.name} news`, 'Ghana news', category.name.toLowerCase(), 'breaking news']}
        structuredData={categoryStructuredData}
      />
      
      <Header />
      
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <BreadcrumbSEO items={breadcrumbItems} />
        
        {/* Category Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div style={{ color: category.color }}>
              {getCategoryIcon(category.name, "w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16")}
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold" style={{ color: category.color }}>
              {category.name}
            </h1>
          </div>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            {category.description}
          </p>
        </div>
        
        {/* Articles Grid */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-2 sm:gap-4">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
              Latest {category.name} News
            </h2>
            <span className="text-gray-600 text-sm sm:text-base">
              {totalArticles} articles
            </span>
          </div>
          
          {articles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {articles.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12">
              <p className="text-gray-600 text-base sm:text-lg">
                No articles found in this category yet.
              </p>
            </div>
          )}
        </section>
      </main>
      
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<CategoryPageProps> = async (context) => {
  const { slug } = context.query;
  
  // Ensure slug is a string
  if (!slug || typeof slug !== 'string') {
    return {
      notFound: true,
    };
  }

  try {
    // Fetch category data
    const { data: categoryData, error: categoryError } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .single();

    if (categoryError || !categoryData) {
      return {
        notFound: true,
      };
    }

    // Transform category data
    const category: Category = {
      id: categoryData.id,
      name: categoryData.name,
      slug: categoryData.slug,
      description: categoryData.description || '',
      color: categoryData.color,
      icon: categoryData.icon || '📰',
      updated_at: categoryData.updated_at
    };

    // Fetch articles for this category
    const { data: articlesData, error: articlesError } = await supabase
      .from('articles_with_details')
      .select('*')
      .eq('status', 'published')
      .eq('category_id', categoryData.id) // Assuming your view has category_slug
      .order('published_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false });

    if (articlesError) {
      console.error('Error fetching articles:', articlesError);
      return {
        props: {
          category,
          articles: [],
          totalArticles: 0,
          error: 'Failed to load articles'
        }
      };
    }

    // Transform articles
    const transformedArticles = (articlesData || [])
      .filter(article => article.id && article.title && article.content)
      .map(transformToNewsArticle);

    // Set cache headers for better performance
    context.res.setHeader(
      'Cache-Control',
      'public, s-maxage=300, stale-while-revalidate=600'
    );

    return {
      props: {
        category,
        articles: transformedArticles,
        totalArticles: transformedArticles.length,
      },
    };

  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    
    return {
      props: {
        category: null,
        articles: [],
        totalArticles: 0,
        error: 'An unexpected error occurred'
      }
    };
  }
};

export default CategoryPage;