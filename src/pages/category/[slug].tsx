
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import NewsCard from '@/components/NewsCard';
import ScrollToTop from '@/components/ScrollToTop';
import BreadcrumbSEO from '@/components/SEO/BreadcrumbSEO';
import SEOHead from '@/components/SEO/SEOHead';
import { usePublishedArticles } from '@/hooks/usePublishedArticles';
import { useSupabaseCategories } from '@/hooks/useSupabaseCategories';
import { getCategoryIcon } from '@/utils/categoryIcons';
import { generateMetaTitle, truncateDescription } from '@/utils/seo';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const CategoryPage = () => {
    const router = useRouter();
  const { slug } = router.query;
  const { articles, loading: articlesLoading } = usePublishedArticles();
  const { categories, loading: categoriesLoading } = useSupabaseCategories();
  const [category, setCategory] = useState(null);
  const [categoryArticles, setCategoryArticles] = useState([]);

  useEffect(() => {
    if (!categoriesLoading && !articlesLoading && categories.length > 0 && articles.length > 0) {
      const foundCategory = categories.find(c => c.slug === slug);
      if (foundCategory) {
        setCategory(foundCategory);
        const filteredArticles = articles.filter(article => article.category.slug === slug);
        setCategoryArticles(filteredArticles);
      }
    }
  }, [categories, articles, categoriesLoading, articlesLoading, slug]);

  if (categoriesLoading || articlesLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
          <div className="text-center mb-8 sm:mb-12 animate-pulse">
            <div className="h-8 sm:h-10 lg:h-12 bg-gray-200 rounded w-1/2 mx-auto mb-3 sm:mb-4"></div>
            <div className="h-4 sm:h-5 lg:h-6 bg-gray-200 rounded w-1/3 mx-auto mb-6 sm:mb-8"></div>
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
        </main>
        <Footer />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <SEOHead
          title="Category Not Found - GhNewsMedia"
          description="The category you're looking for could not be found. Browse our news categories and latest updates from Ghana."
          canonical="https://ghnewsmedia.com/404"
        />
        <div className="text-center px-4">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Category Not Found</h1>
          <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">Sorry, the category you're looking for doesn't exist.</p>
          <a href="/" className="bg-primary text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-primary-700 transition-colors text-sm sm:text-base">
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
      "numberOfItems": categoryArticles.length,
      "itemListElement": categoryArticles.slice(0, 10).map((article, index) => ({
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
              {categoryArticles.length} articles
            </span>
          </div>
          
          {categoryArticles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {categoryArticles.map((article) => (
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

export default CategoryPage;
