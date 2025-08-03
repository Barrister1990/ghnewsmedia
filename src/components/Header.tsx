import { Facebook, Search, Twitter, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import AdminLink from '@/components/AdminLink';
import { useSupabaseCategories } from '../hooks/useSupabaseCategories';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const { categories } = useSupabaseCategories();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  const handleSearchIconClick = () => {
    if (isSearchOpen && searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    } else {
      setIsSearchOpen(!isSearchOpen);
    }
  };

  // Preload critical navigation links
  const handleLinkHover = (href: string) => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    document.head.appendChild(link);
  };


  // Group categories by main categories (you can customize this based on your data structure)
  const mainCategories = [
    { name: 'News', subcategories: categories.filter(cat => cat.name.toLowerCase().includes('news') || cat.slug.includes('news')) },
    { name: 'Sports', subcategories: categories.filter(cat => cat.name.toLowerCase().includes('sport') || cat.slug.includes('sport')) },
    { name: 'Entertainment', subcategories: categories.filter(cat => cat.name.toLowerCase().includes('entertainment') || cat.slug.includes('entertainment')) },
    { name: 'Lifestyle', subcategories: categories.filter(cat => cat.name.toLowerCase().includes('lifestyle') || cat.slug.includes('lifestyle')) },
    { name: 'Business', subcategories: categories.filter(cat => cat.name.toLowerCase().includes('business') || cat.slug.includes('business')) },
  ];

  // Add remaining categories that don't fit into main categories
  const usedCategoryIds = new Set();
  mainCategories.forEach(mainCat => {
    mainCat.subcategories.forEach(subCat => usedCategoryIds.add(subCat.id));
  });
  
  const remainingCategories = categories.filter(cat => !usedCategoryIds.has(cat.id));
  if (remainingCategories.length > 0) {
    mainCategories.push({ name: 'Other', subcategories: remainingCategories });
  }

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      {/* Top Bar - Hidden on mobile, visible on desktop */}
      <div className="bg-primary text-white py-2 hidden lg:block">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center space-x-4">
            <span>📍 Accra, Ghana</span>
            <span>📅 {new Date().toLocaleDateString('en-GB', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
            <span>🕐 {new Date().toLocaleTimeString('en-GB', { 
              hour: '2-digit', 
              minute: '2-digit'
            })}</span>
          </div>
          <div className="flex items-center space-x-3">
            <span>Follow Us:</span>
            <Facebook className="w-4 h-4 hover:text-accent cursor-pointer transition-colors" />
            <Twitter className="w-4 h-4 hover:text-accent cursor-pointer transition-colors" />
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 lg:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link 
              href="/" 
              className="flex items-center"
              onMouseEnter={() => handleLinkHover('/')}
            >
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gradient">
                GhNewsMedia
              </h1>
              <span className="ml-1 sm:ml-2 text-xs bg-accent text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full hidden sm:inline">
                TRUSTED NEWS
              </span>
            </Link>
          </div>

          {/* Desktop Navigation - Optimized without icons */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            <Link 
              href="/" 
              className="font-medium text-gray-800 hover:text-primary transition-colors"
              onMouseEnter={() => handleLinkHover('/')}
            >
              Home
            </Link>
            {categories.slice(0, 5).map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="font-medium text-gray-800 hover:text-primary transition-colors"
                onMouseEnter={() => handleLinkHover(`/category/${category.slug}`)}
              >
                {category.name}
              </Link>
            ))}
            <Link 
              href="/search" 
              className="font-medium text-gray-800 hover:text-primary transition-colors"
              onMouseEnter={() => handleLinkHover('/search')}
            >
              Search
            </Link>
            <Link 
              href="/about" 
              className="font-medium text-gray-800 hover:text-primary transition-colors"
              onMouseEnter={() => handleLinkHover('/about')}
            >
              About
            </Link>
          </nav>

          {/* Mobile Actions - Redesigned */}
          <div className="flex items-center space-x-1 lg:space-x-4">
            <div className="hidden lg:block">
              <AdminLink />
            </div>
            
            {/* Search Button - Mobile Optimized */}
            <button
              onClick={handleSearchIconClick}
              className="p-2.5 lg:p-2 hover:bg-gray-100 rounded-xl lg:rounded-lg transition-all duration-200 active:scale-95"
              title={isSearchOpen ? "Search" : "Open search"}
              aria-label={isSearchOpen ? "Search" : "Open search"}
            >
              <Search className="w-5 h-5 lg:w-5 lg:h-5 text-gray-600" />
            </button>
            
            {/* Mobile Menu Button - Modern Design */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2.5 hover:bg-gray-100 rounded-xl transition-all duration-200 active:scale-95 relative"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              <div className="relative w-5 h-5">
                <span className={`absolute left-0 top-1 w-5 h-0.5 bg-gray-700 transition-all duration-300 ${isMenuOpen ? 'rotate-45 top-2' : ''}`}></span>
                <span className={`absolute left-0 top-2 w-5 h-0.5 bg-gray-700 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`absolute left-0 top-3 w-5 h-0.5 bg-gray-700 transition-all duration-300 ${isMenuOpen ? '-rotate-45 top-2' : ''}`}></span>
              </div>
            </button>
          </div>
        </div>

        {/* Search Bar - Enhanced Mobile Design */}
        {isSearchOpen && (
          <div className="mt-4 animate-fade-in">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative bg-gray-50 rounded-2xl border-2 border-transparent focus-within:border-primary focus-within:bg-white transition-all duration-200">
                <input
                  type="text"
                  placeholder="Search news, topics, authors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-5 py-4 pl-12 pr-20 bg-transparent text-gray-800 placeholder-gray-500 rounded-2xl focus:outline-none text-base"
                  autoFocus
                  autoComplete="off"
                  spellCheck="false"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary-700 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!searchQuery.trim()}
                >
                  Go
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Menu - Simplified */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="lg:hidden fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40"
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Mobile Menu Panel - Simplified */}
          <div className="lg:hidden fixed inset-0 bg-white z-50 overflow-y-auto">
            {/* Menu Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">GhNewsMedia</h2>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Menu Content - Simplified */}
            <div className="pb-20">
              {/* Home Link */}
              <Link 
                href="/" 
                className="flex items-center px-4 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="text-lg font-medium text-gray-800">Home</span>
              </Link>

              {/* All Categories as Simple Links */}
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="flex items-center px-4 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="text-lg font-medium text-gray-800">{category.name}</span>
                </Link>
              ))}

              {/* Other Links */}
              <Link 
                href="/search" 
                className="flex items-center px-4 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="text-lg font-medium text-gray-800">Search</span>
              </Link>
              
              <Link 
                href="/about" 
                className="flex items-center px-4 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="text-lg font-medium text-gray-800">About</span>
              </Link>
              
              <Link 
                href="/contact" 
                className="flex items-center px-4 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="text-lg font-medium text-gray-800">Contact</span>
              </Link>

              {/* Admin Link - Mobile */}
              <div className="px-4 py-4 border-b border-gray-100">
                <AdminLink />
              </div>

              {/* Social Links */}
              <div className="px-4 py-6">
                <div className="flex items-center space-x-4">
                  <Facebook className="w-10 h-10 p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 cursor-pointer transition-colors" />
                  <Twitter className="w-10 h-10 p-2 bg-sky-50 text-sky-600 rounded-lg hover:bg-sky-100 cursor-pointer transition-colors" />
                </div>
              </div>

              {/* Website URL Footer */}
              <div className="px-4 py-4 text-center">
                <span className="text-sm text-gray-500">ghnewsmedia.com</span>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;