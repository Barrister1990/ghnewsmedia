import { Facebook, Menu, Search, Twitter, X } from 'lucide-react';
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

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
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
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
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

          {/* Search and Mobile Menu */}
          <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
            <AdminLink />
            <button
              onClick={handleSearchIconClick}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title={isSearchOpen ? "Search" : "Open search"}
              aria-label={isSearchOpen ? "Search" : "Open search"}
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
          </div>
        </div>

        {/* Search Bar - Optimized with better UX */}
        {isSearchOpen && (
          <div className="mt-3 sm:mt-4 animate-fade-in">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search news, topics, authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-8 sm:pl-10 pr-16 sm:pr-20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base"
                autoFocus
                autoComplete="off"
                spellCheck="false"
              />
              <Search className="absolute left-2.5 sm:left-3 top-3 sm:top-3.5 w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 pointer-events-none" />
              <button
                type="submit"
                className="absolute right-1.5 sm:right-2 top-1.5 sm:top-1.5 px-2.5 sm:px-4 py-1 sm:py-1.5 bg-primary text-white text-xs sm:text-sm rounded-md hover:bg-primary-700 transition-colors"
                disabled={!searchQuery.trim()}
              >
                Search
              </button>
            </form>
          </div>
        )}

        {/* Mobile Menu - Optimized without icons for faster rendering */}
        {isMenuOpen && (
          <div className="lg:hidden mt-3 sm:mt-4 pb-3 sm:pb-4 border-t border-gray-100 animate-fade-in">
            <nav className="flex flex-col space-y-2 sm:space-y-3 pt-3 sm:pt-4">
              <Link 
                href="/" 
                className="font-medium text-gray-800 hover:text-primary transition-colors py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="font-medium text-gray-800 hover:text-primary transition-colors py-1"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
              <Link 
                href="/search" 
                className="font-medium text-gray-800 hover:text-primary transition-colors flex items-center py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                <Search className="mr-2 w-4 h-4" />
                Search
              </Link>
              <Link 
                href="/about" 
                className="font-medium text-gray-800 hover:text-primary transition-colors py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                href="/contact" 
                className="font-medium text-gray-800 hover:text-primary transition-colors py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;