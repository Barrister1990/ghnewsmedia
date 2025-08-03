import { Facebook, Search, Twitter, X, Youtube } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

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

  // Define menu items in the requested order
  const menuItems = [
    { name: 'Home', href: '/' },
    { name: 'News', href: '/category/news' },
    { name: 'Entertainment', href: '/category/entertainment' },
    { name: 'Sports', href: '/category/sports' },
    { name: 'Business', href: '/category/business' },
    { name: 'Lifestyle', href: '/category/lifestyle' },
    { name: 'Tech', href: '/category/tech' },
    { name: 'Features', href: '/category/features' },
    { name: 'Opinions', href: '/category/opinions' },
  ];

  // Social media links
  const socialLinks = [
    { 
      name: 'X (Twitter)', 
      icon: Twitter, 
      url: 'https://x.com/ghnewsmedia?t=Fx80oa-73oEdgyznOxM_Yg&s=09',
      bgColor: 'bg-gray-50',
      textColor: 'text-gray-700',
      hoverBg: 'hover:bg-gray-100'
    },
    { 
      name: 'Facebook', 
      icon: Facebook, 
      url: 'https://www.facebook.com/profile.php?id=61577876216304&mibextid=ZbWKwL',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      hoverBg: 'hover:bg-blue-100'
    },
    { 
      name: 'YouTube', 
      icon: Youtube, 
      url: 'https://youtube.com/@ghnewsmedia?si=X7l2KfRAkWHG2bAu',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
      hoverBg: 'hover:bg-red-100'
    }
  ];

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
            <a 
              href="https://www.facebook.com/profile.php?id=61577876216304&mibextid=ZbWKwL"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on Facebook"
            >
              <Facebook className="w-4 h-4 hover:text-accent cursor-pointer transition-colors" />
            </a>
            <a 
              href="https://x.com/ghnewsmedia?t=Fx80oa-73oEdgyznOxM_Yg&s=09"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on X (Twitter)"
            >
              <Twitter className="w-4 h-4 hover:text-accent cursor-pointer transition-colors" />
            </a>
            <a 
              href="https://youtube.com/@ghnewsmedia?si=X7l2KfRAkWHG2bAu"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Subscribe to our YouTube channel"
            >
              <Youtube className="w-4 h-4 hover:text-accent cursor-pointer transition-colors" />
            </a>
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

          {/* Desktop Navigation - Updated menu items */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {menuItems.slice(0, 6).map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="font-medium text-gray-800 hover:text-primary transition-colors"
                onMouseEnter={() => handleLinkHover(item.href)}
              >
                {item.name}
              </Link>
            ))}
            <Link 
              href="/search" 
              className="font-medium text-gray-800 hover:text-primary transition-colors"
              onMouseEnter={() => handleLinkHover('/search')}
            >
              Search
            </Link>
           
          </nav>

          {/* Mobile Actions */}
          <div className="flex items-center space-x-1 lg:space-x-4">
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

      {/* Mobile Menu - Updated with new menu structure */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="lg:hidden fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40"
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Mobile Menu Panel */}
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

            {/* Menu Content */}
            <div className="pb-20">
              {/* Main Menu Items */}
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center px-4 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="text-lg font-medium text-gray-800">{item.name}</span>
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

              {/* Social Links */}
              <div className="px-4 py-6">
                <h3 className="text-sm font-semibold text-gray-600 mb-3">Follow Us</h3>
                <div className="flex items-center space-x-3">
                  {socialLinks.map((social) => {
                    const IconComponent = social.icon;
                    return (
                      <a
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-12 h-12 p-2.5 ${social.bgColor} ${social.textColor} rounded-lg ${social.hoverBg} cursor-pointer transition-colors flex items-center justify-center`}
                        aria-label={`Visit our ${social.name} page`}
                      >
                        <IconComponent className="w-6 h-6" />
                      </a>
                    );
                  })}
                </div>
                
                {/* WhatsApp Channel Link */}
                <div className="mt-4">
                  <a
                    href="https://whatsapp.com/channel/0029Vb66ViJK5cDJ8RjFSR2D"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors"
                  >
                    📱 Join WhatsApp Channel
                  </a>
                </div>
              </div>

              {/* Website URL Footer */}
              <div className="px-4 py-4 text-center border-t border-gray-100">
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