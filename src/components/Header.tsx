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
    { name: 'Politics', href: '/politics' },
    { name: 'Entertainment', href: '/entertainment' },
    { name: 'Sports', href: '/sports' },
    { name: 'Business', href: '/business' },
    { name: 'Technology', href: '/technology' },
    { name: 'Authors', href: '/authors' },
    { name: 'Contact', href: '/contact' },
  ];


  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
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
          <nav className="hidden lg:flex items-center space-x-1">
            {menuItems.slice(0, 8).map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  (item.href === '/' && router.pathname === '/') || (item.href !== '/' && router.asPath.startsWith(item.href))
                    ? 'bg-stone-900 text-white'
                    : 'text-stone-700 hover:bg-stone-100 hover:text-stone-900'
                }`}
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
              className="hidden lg:flex rounded-md p-2 transition-colors hover:bg-stone-100"
              aria-label="Search"
            >
              <Search className="h-5 w-5 text-stone-800" />
            </button>
            
            {/* Mobile Menu Button - Simple */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden rounded-md p-2 hover:bg-stone-100"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              <Menu className="h-6 w-6 text-stone-800" />
            </button>
          </div>
        </div>

        {/* Search Bar - BBC Style */}
        {isSearchOpen && (
          <div className="border-t border-stone-200 py-3">
            <form onSubmit={handleSearch} className="container mx-auto px-4">
              <div className="relative max-w-2xl mx-auto">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-md border border-stone-300 px-4 py-2 text-sm focus:border-stone-500 focus:outline-none"
                  autoFocus
                  autoComplete="off"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1"
                  aria-label="Search"
                >
                  <Search className="h-5 w-5 text-stone-800" />
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
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Mobile Menu Panel */}
          <div className="fixed inset-y-0 right-0 z-50 w-72 overflow-y-auto border-l border-stone-200 bg-white shadow-xl lg:hidden">
            {/* Menu Header */}
            <div className="flex items-center justify-between border-b border-stone-200 p-4">
              <h2 className="text-lg font-bold text-stone-900">
                Menu
              </h2>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="rounded p-2 transition-colors hover:bg-stone-100"
              >
                <X className="h-5 w-5 text-stone-800" />
              </button>
            </div>

            {/* Menu Content - Simple List */}
            <div className="py-2">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-4 py-3 text-sm transition-colors ${
                    (item.href === '/' && router.pathname === '/') || (item.href !== '/' && router.asPath.startsWith(item.href))
                      ? 'bg-stone-900 text-white'
                      : 'text-stone-800 hover:bg-stone-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link 
                href="/search" 
                className="block px-4 py-3 text-sm text-stone-800 transition-colors hover:bg-stone-50"
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