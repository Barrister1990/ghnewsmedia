import { Menu, Search, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';


const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

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

  // Define menu items in the requested order
  const menuItems = [
    { name: 'Home', href: '/' },
    { name: 'News', href: '/news' },
    { name: 'Entertainment', href: '/entertainment' },
    { name: 'Sports', href: '/sports' },
    { name: 'Business', href: '/business' },
    { name: 'Lifestyle', href: '/lifestyle' },
    { name: 'Tech', href: '/tech' },
    { name: 'Features', href: '/features' },
    { name: 'Opinions', href: '/opinions' },
  ];


  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      {/* Main Header - BBC Style */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo - BBC Style (No text, just logo) */}
          <div className="flex items-center">
            <Link 
              href="/" 
              className="flex items-center"
              onMouseEnter={() => handleLinkHover('/')}
            >
              <img
                src="/gh-news-media-logo.svg"
                alt="GhNewsMedia"
                className="h-8 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Desktop Navigation - BBC Style */}
          <nav className="hidden lg:flex items-center space-x-6">
            {menuItems.slice(0, 8).map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="font-medium transition-colors duration-200 hover:underline"
                style={{ color: '#111111', fontSize: '14px' }}
                onMouseEnter={() => handleLinkHover(item.href)}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Side - Search (Desktop) / Menu (Mobile) */}
          <div className="flex items-center space-x-2">
            {/* Desktop Search */}
            <button
              onClick={handleSearchIconClick}
              className="hidden lg:flex p-2 hover:bg-gray-100 rounded transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" style={{ color: '#111111' }} />
            </button>
            
            {/* Mobile Menu Button - Simple */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              <Menu className="w-6 h-6" style={{ color: '#111111' }} />
            </button>
          </div>
        </div>

        {/* Search Bar - BBC Style */}
        {isSearchOpen && (
          <div className="border-t border-gray-200 py-3">
            <form onSubmit={handleSearch} className="container mx-auto px-4">
              <div className="relative max-w-2xl mx-auto">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-500"
                  style={{ fontSize: '14px' }}
                  autoFocus
                  autoComplete="off"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5" style={{ color: '#111111' }} />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Menu - BBC Style (Simple) */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Mobile Menu Panel */}
          <div className="lg:hidden fixed inset-y-0 right-0 w-64 bg-white z-50 overflow-y-auto shadow-lg">
            {/* Menu Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-bold" style={{ color: '#111111' }}>
                Menu
              </h2>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
              >
                <X className="w-5 h-5" style={{ color: '#111111' }} />
              </button>
            </div>

            {/* Menu Content - Simple List */}
            <div className="py-2">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-4 py-3 hover:bg-gray-50 transition-colors"
                  style={{ color: '#111111', fontSize: '14px' }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link 
                href="/search" 
                className="block px-4 py-3 hover:bg-gray-50 transition-colors"
                style={{ color: '#111111', fontSize: '14px' }}
                onClick={() => setIsMenuOpen(false)}
              >
                Search
              </Link>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;