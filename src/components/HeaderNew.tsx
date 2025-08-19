import { Calendar, Clock, Facebook, MapPin, Menu, Search, Twitter, X, Youtube } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import { useSupabaseCategories } from '../hooks/useSupabaseCategories';

const HeaderNew = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const router = useRouter();
  const { categories } = useSupabaseCategories();

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

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
      bgColor: 'bg-gray-900',
      textColor: 'text-white',
      hoverBg: 'hover:bg-gray-800'
    },
    { 
      name: 'Facebook', 
      icon: Facebook, 
      url: 'https://www.facebook.com/profile.php?id=61577876216304&mibextid=ZbWKwL',
      bgColor: 'bg-blue-600',
      textColor: 'text-white',
      hoverBg: 'hover:bg-blue-700'
    },
    { 
      name: 'YouTube', 
      icon: Youtube, 
      url: 'https://youtube.com/@ghnewsmedia?si=X7l2KfRAkWHG2bAu',
      bgColor: 'bg-red-600',
      textColor: 'text-white',
      hoverBg: 'hover:bg-red-700'
    }
  ];

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      {/* Top Bar - Enhanced with better styling */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-3 hidden lg:block">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-red-400" />
              <span className="font-medium">📍 Accra, Ghana</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-blue-400" />
              <span className="font-medium">
                {currentTime.toLocaleDateString('en-GB', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-green-400" />
              <span className="font-medium">
                {currentTime.toLocaleTimeString('en-GB', { 
                  hour: '2-digit', 
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-300 font-medium">Follow Us:</span>
            {socialLinks.map((social) => {
              const IconComponent = social.icon;
              return (
                <a 
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Follow us on ${social.name}`}
                  className={`w-8 h-8 ${social.bgColor} ${social.textColor} ${social.hoverBg} rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110`}
                >
                  <IconComponent className="w-4 h-4" />
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Header - Modern Design */}
      <div className="container mx-auto px-4 py-4 lg:py-6">
        <div className="flex items-center justify-between">
          {/* Logo - Enhanced Design */}
          <div className="flex items-center">
            <Link 
              href="/" 
              className="flex items-center group"
              onMouseEnter={() => handleLinkHover('/')}
            >
              <div className="relative">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-red-600 via-blue-600 to-green-600 bg-clip-text text-transparent">
                  GhNewsMedia
                </h1>
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-red-600 to-blue-600 group-hover:w-full transition-all duration-300"></div>
              </div>
              <span className="ml-3 bg-gradient-to-r from-red-600 to-blue-600 text-white text-xs px-3 py-1.5 rounded-full font-bold hidden sm:inline-block shadow-lg">
                TRUSTED NEWS
              </span>
            </Link>
          </div>

          {/* Desktop Navigation - Modern Styling */}
          <nav className="hidden lg:flex items-center space-x-8">
            {menuItems.slice(0, 6).map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="relative font-medium text-gray-700 hover:text-red-600 transition-colors duration-200 group"
                onMouseEnter={() => handleLinkHover(item.href)}
              >
                {item.name}
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 group-hover:w-full transition-all duration-300"></div>
              </Link>
            ))}
            <Link 
              href="/search" 
              className="relative font-medium text-gray-700 hover:text-red-600 transition-colors duration-200 group"
              onMouseEnter={() => handleLinkHover('/search')}
            >
              Search
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 group-hover:w-full transition-all duration-300"></div>
            </Link>
          </nav>

          {/* Mobile Actions - Enhanced */}
          <div className="flex items-center space-x-3">
            {/* Search Button */}
            <button
              onClick={handleSearchIconClick}
              className="p-3 hover:bg-gray-100 rounded-full transition-all duration-200 active:scale-95 group"
              title={isSearchOpen ? "Search" : "Open search"}
              aria-label={isSearchOpen ? "Search" : "Open search"}
            >
              <Search className="w-5 h-5 text-gray-600 group-hover:text-red-600 transition-colors" />
            </button>
            
            {/* Mobile Menu Button - Modern Design */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-3 hover:bg-gray-100 rounded-full transition-all duration-200 active:scale-95"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Search Bar - Enhanced Design */}
        {isSearchOpen && (
          <div className="mt-4 animate-fade-in">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative bg-gray-50 rounded-2xl border-2 border-transparent focus-within:border-red-500 focus-within:bg-white transition-all duration-300 shadow-lg">
                <input
                  type="text"
                  placeholder="Search news, topics, authors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 pl-14 pr-24 bg-transparent text-gray-800 placeholder-gray-500 rounded-2xl focus:outline-none text-base font-medium"
                  autoFocus
                  autoComplete="off"
                  spellCheck="false"
                />
                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2.5 bg-gradient-to-r from-red-600 to-blue-600 text-white text-sm font-semibold rounded-xl hover:from-red-700 hover:to-blue-700 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  disabled={!searchQuery.trim()}
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Menu - Enhanced Design */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Mobile Menu Panel */}
          <div className="lg:hidden fixed inset-0 bg-white z-50 overflow-y-auto">
            {/* Menu Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center space-x-3">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">
                  GhNewsMedia
                </h2>
                <span className="bg-gradient-to-r from-red-600 to-blue-600 text-white text-xs px-2 py-1 rounded-full font-bold">
                  TRUSTED NEWS
                </span>
              </div>
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
                  className="flex items-center px-6 py-4 border-b border-gray-100 hover:bg-gradient-to-r hover:from-red-50 hover:to-blue-50 transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="text-lg font-medium text-gray-800">{item.name}</span>
                </Link>
              ))}

              {/* Other Links */}
              <Link 
                href="/search" 
                className="flex items-center px-6 py-4 border-b border-gray-100 hover:bg-gradient-to-r hover:from-red-50 hover:to-blue-50 transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="text-lg font-medium text-gray-800">Search</span>
              </Link>
              
              <Link 
                href="/about" 
                className="flex items-center px-6 py-4 border-b border-gray-100 hover:bg-gradient-to-r hover:from-red-50 hover:to-blue-50 transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="text-lg font-medium text-gray-800">About</span>
              </Link>
              
              <Link 
                href="/contact" 
                className="flex items-center px-6 py-4 border-b border-gray-100 hover:bg-gradient-to-r hover:from-red-50 hover:to-blue-50 transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="text-lg font-medium text-gray-800">Contact</span>
              </Link>

              {/* Social Links */}
              <div className="px-6 py-8 bg-gradient-to-br from-gray-50 to-white">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Follow Us</h3>
                <div className="flex items-center space-x-4 mb-6">
                  {socialLinks.map((social) => {
                    const IconComponent = social.icon;
                    return (
                      <a
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-14 h-14 ${social.bgColor} ${social.textColor} ${social.hoverBg} rounded-xl cursor-pointer transition-all duration-200 flex items-center justify-center hover:scale-110 shadow-lg`}
                        aria-label={`Visit our ${social.name} page`}
                      >
                        <IconComponent className="w-7 h-7" />
                      </a>
                    );
                  })}
                </div>
                
                {/* WhatsApp Channel Link */}
                <div className="mb-6">
                  <a
                    href="https://whatsapp.com/channel/0029Vb66ViJK5cDJ8RjFSR2D"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 bg-green-500 text-white text-base font-semibold rounded-xl hover:bg-green-600 transition-all duration-200 shadow-lg w-full justify-center"
                  >
                    📱 Join WhatsApp Channel
                  </a>
                </div>

                {/* Newsletter Signup */}
                <div className="bg-white p-4 rounded-xl border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-3">Stay Updated</h4>
                  <div className="flex space-x-2">
                    <input
                      type="email"
                      placeholder="Your email"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                    <button className="px-4 py-2 bg-gradient-to-r from-red-600 to-blue-600 text-white font-medium rounded-lg hover:from-red-700 hover:to-blue-700 transition-all duration-200">
                      Subscribe
                    </button>
                  </div>
                </div>
              </div>

              {/* Website URL Footer */}
              <div className="px-6 py-6 text-center border-t border-gray-100 bg-gray-50">
                <span className="text-sm text-gray-600 font-medium">ghnewsmedia.com</span>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default HeaderNew;
