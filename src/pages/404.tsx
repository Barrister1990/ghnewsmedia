
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import SEOHead from '@/components/SEO/SEOHead';
import { ArrowLeft, Home, Search } from 'lucide-react';
import Link from 'next/link';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SEOHead
        title="Page Not Found - GhNewsMedia"
        description="The page you're looking for could not be found. Browse our latest news and updates from Ghana or search for specific topics."
        canonical="https://ghnewsmedia.com/404"
      />
      
      <Header />
      
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-2xl">
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-gray-200 mb-4">404</h1>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Page Not Found
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved, 
              deleted, or you entered the wrong URL.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              <Home className="w-5 h-5 mr-2" />
              Go Home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Go Back
            </button>
            <Link
              href="/search"
              className="inline-flex items-center px-6 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors"
            >
              <Search className="w-5 h-5 mr-2" />
              Search
            </Link>
          </div>

          <div className="mt-12 p-6 bg-white rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Sections</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/category/politics" className="text-primary hover:text-primary-700 font-medium">
                Politics
              </Link>
              <Link href="/cLinktegory/business" className="text-primary hover:text-primary-700 font-medium">
                Business
              </Link>
              <Link href="/category/sports" className="text-primary hover:text-primary-700 font-medium">
                Sports
              </Link>
              <Link href="/category/technology" className="text-primary hover:text-primary-700 font-medium">
                Technology
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
