import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Menu, Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';


const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [router.asPath]);

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
    { name: 'Lifestyle', href: '/entertainment' },
    { name: 'Sports', href: '/sports' },
    { name: 'Business', href: '/business' },
    { name: 'Tech', href: '/tech' },
    { name: 'Authors', href: '/authors' },
    { name: 'Contact', href: '/contact' },
  ];


  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-white">
      <div className="border-b border-stone-200 bg-stone-50/80">
        <div className="container mx-auto flex h-9 items-center justify-between px-4">
          <p className="text-[11px] uppercase tracking-[0.14em] text-stone-600">GhNewsMedia</p>
          <Link href="/authors" className="text-[11px] font-medium text-stone-600 hover:text-stone-900">
            Journalists
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
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
            
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                >
                  <Menu className="h-6 w-6 text-stone-800" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[86vw] max-w-[320px] border-stone-200 bg-white p-0">
                <SheetHeader className="border-b border-stone-200 px-4 pb-4 pt-6 text-left">
                  <SheetTitle className="text-base font-semibold text-stone-900">Menu</SheetTitle>
                </SheetHeader>
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
              </SheetContent>
            </Sheet>
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
    </header>
  );
};

export default Header;