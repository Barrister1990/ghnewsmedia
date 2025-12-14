import Footer from '@/components/Footer';
import Header from '@/components/Header';
import ScrollToTop from '@/components/ScrollToTop';
import BreadcrumbSEO from '@/components/SEO/BreadcrumbSEO';
import SEOHead from '@/components/SEO/SEOHead';
import { supabase } from '@/integrations/supabase/client';
import { transformToNewsArticle } from '@/lib/articles';
import { Category, NewsArticle } from '@/types/news';
import { getCategoryColor } from '@/utils/categoryColors';
import { generateMetaTitle, truncateDescription } from '@/utils/seo';
import { formatDistanceToNow } from 'date-fns';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';

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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <SEOHead
          title="Error"
          description="An error occurred while loading the category page."
          canonical="https://ghnewsmedia.com"
        />
        <div className="text-center px-4">
          <h1 style={{ color: '#111111', fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>
            Something went wrong
          </h1>
          <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '24px' }}>
            {error}
          </p>
          <Link
            href="/" 
            style={{ 
              backgroundColor: '#1A365D', 
              color: '#FFFFFF', 
              padding: '12px 24px', 
              borderRadius: '4px',
              fontSize: '14px',
              display: 'inline-block',
              textDecoration: 'none'
            }}
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  // Handle category not found
  if (!category) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <SEOHead
          title="Category Not Found"
          description="The category you're looking for could not be found. Browse our news categories and latest updates from Ghana."
          canonical="https://ghnewsmedia.com/404"
        />
        <div className="text-center px-4">
          <h1 style={{ color: '#111111', fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>
            Category Not Found
          </h1>
          <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '24px' }}>
            Sorry, the category you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/" 
            style={{ 
              backgroundColor: '#1A365D', 
              color: '#FFFFFF', 
              padding: '12px 24px', 
              borderRadius: '4px',
              fontSize: '14px',
              display: 'inline-block',
              textDecoration: 'none'
            }}
          >
            Go Home
          </Link>
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
    "name": `${category.name} News`,
    "description": category.description,
    "url": `https://ghnewsmedia.com/${category.slug}`,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": totalArticles,
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
  };

  const getFullImageUrl = (imagePath: string | null | undefined): string => {
    if (!imagePath) return '/images/placeholder.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    return `https://zodidixpxznfsopxdhyr.supabase.co/storage/v1/object/public/article-images/${imagePath}`;
  };

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title={generateMetaTitle(`${category.name} News`, 'Category')}
        description={truncateDescription(`${category.description} Stay updated with the latest ${category.name.toLowerCase()} news from Ghana.`)}
        canonical={`https://ghnewsmedia.com/${category.slug}`}
        tags={[`${category.name} news`, 'Ghana news', category.name.toLowerCase(), 'breaking news']}
        structuredData={categoryStructuredData}
      />
      
      <Header />
      
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8" style={{ fontFamily: "'Inter', 'Source Sans 3', system-ui, sans-serif" }}>
        <BreadcrumbSEO items={breadcrumbItems} />
        
        {/* Category Header - Clean and Minimal */}
        <div className="mb-6 sm:mb-8 md:mb-10">
          <div className="mb-3 sm:mb-4">
            <span 
              className="inline-block px-2 py-1 rounded text-xs font-medium"
              style={{ 
                backgroundColor: getCategoryColor(category.name, category.color),
                color: '#FFFFFF',
                fontSize: '12px'
              }}
            >
              {category.name.toUpperCase()}
            </span>
          </div>
          <h1 style={{ 
            color: '#111111', 
            fontSize: '24px', 
            fontWeight: 'bold',
            lineHeight: '1.3',
            marginBottom: '8px'
          }}>
            {category.name}
          </h1>
          {category.description && (
            <p style={{ 
              color: '#6B7280', 
              fontSize: '14px',
              lineHeight: '1.5'
            }}>
              {category.description}
            </p>
          )}
        </div>
        
        {/* Articles List - Clean Card Layout */}
        <section>
          {articles.length > 0 ? (
            <div className="space-y-4 sm:space-y-6">
              {articles.map((article) => {
                const publishedDate = new Date(article.publishedAt);
                const timeAgo = formatDistanceToNow(publishedDate, { addSuffix: true });
                
                return (
                  <Link 
                    key={article.id} 
                    href={`/${article.category.slug}/${article.slug}`}
                    style={{ textDecoration: 'none', display: 'block' }}
                  >
                    <article className="bg-white border-b border-gray-200 pb-4 sm:pb-6">
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        {/* Image */}
                        <div className="relative w-full sm:w-32 md:w-40 lg:w-48 h-48 sm:h-32 md:h-40 lg:h-48 flex-shrink-0">
                          <Image
                            src={getFullImageUrl(article.featuredImage)}
                            alt={article.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 128px, (max-width: 1024px) 160px, 192px"
                          />
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            {/* Category Badge */}
                            <div className="mb-2">
                              <span 
                                className="inline-block px-2 py-0.5 rounded text-xs font-medium"
                                style={{ 
                                  backgroundColor: getCategoryColor(article.category.name, article.category.color),
                                  color: '#FFFFFF',
                                  fontSize: '12px'
                                }}
                              >
                                {article.category.name}
                              </span>
                            </div>
                            
                            {/* Title */}
                            <h2 style={{ 
                              color: '#111111', 
                              fontSize: '16px',
                              fontWeight: 'bold',
                              lineHeight: '1.3',
                              marginBottom: '8px'
                            }}>
                              {article.title}
                            </h2>
                            
                            {/* Excerpt */}
                            {article.excerpt && (
                              <p style={{ 
                                color: '#6B7280', 
                                fontSize: '13px',
                                lineHeight: '1.5',
                                marginBottom: '8px',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden'
                              }}>
                                {article.excerpt}
                              </p>
                            )}
                          </div>
                          
                          {/* Meta Info */}
                          <div className="flex items-center gap-3 text-xs" style={{ color: '#6B7280' }}>
                            <span style={{ fontSize: '11px' }}>
                              {timeAgo}
                            </span>
                            {article.author && (
                              <>
                                <span>•</span>
                                <span style={{ fontSize: '11px' }}>
                                  {article.author.name}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 sm:py-16">
              <p style={{ color: '#6B7280', fontSize: '14px' }}>
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
      // No category found - return 404
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
      .eq('category_id', categoryData.id)
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
