import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ChevronDown, Menu, Search, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';

const WHATSAPP_CHANNEL = 'https://whatsapp.com/channel/0029Vb66ViJK5cDJ8RjFSR2D';

interface NavLink {
  name: string;
  href: string;
}

interface NavItem extends NavLink {
  children?: NavLink[];
}

const NAV: NavItem[] = [
  {
    name: 'News',
    href: '/news',
    children: [
      { name: 'Latest News', href: '/news' },
      { name: 'Business', href: '/business' },
      { name: 'Tech', href: '/tech' },
      { name: 'Lifestyle', href: '/lifestyle' },
    ],
  },
  { name: 'Entertainment', href: '/entertainment' },
  { name: 'Sport', href: '/sports' },
  { name: 'Business', href: '/business' },
  { name: 'Opinion', href: '/opinions' },
  { name: 'Features', href: '/features' },
  {
    name: 'More',
    href: '/authors',
    children: [
      { name: 'Tech', href: '/tech' },
      { name: 'Lifestyle', href: '/lifestyle' },
      { name: 'Our Journalists', href: '/authors' },
      { name: 'About Us', href: '/about' },
      { name: 'Advertise', href: '/advertise' },
      { name: 'Contact', href: '/contact' },
    ],
  },
];

const DEFAULT_TRENDING: NavLink[] = [
  { name: 'Latest News', href: '/news' },
  { name: 'Black Stars', href: '/sports' },
  { name: 'Ghana Economy', href: '/business' },
  { name: 'Showbiz', href: '/entertainment' },
  { name: 'Opinion', href: '/opinions' },
];

interface HeaderProps {
  /** Topics for the "Trending" bar under the header. */
  trending?: NavLink[];
}

const isActive = (asPath: string, href: string) =>
  href === '/' ? asPath === '/' : asPath === href || asPath.startsWith(`${href}/`) || asPath.startsWith(`${href}?`);

const LiveLink = ({ compact = false }: { compact?: boolean }) => (
  <Link
    href="/news"
    className={`inline-flex items-center gap-1.5 rounded-full font-bold uppercase text-white bg-gp-live hover:bg-red-700 ${compact ? 'px-2.5 py-1 text-[11px]' : 'px-3 py-1.5 text-xs'}`}
  >
    <span className="relative flex h-2 w-2">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
    </span>
    Live
  </Link>
);

const DesktopDropdown = ({ item, active }: { item: NavItem; active: boolean }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  return (
    <li ref={ref} className="relative" onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={() => setOpen(true)}
        className={`flex h-16 items-center gap-1 border-b-[3px] px-3 text-[0.95rem] font-bold ${active ? 'border-gp-accent' : 'border-transparent hover:border-gp-ink'}`}
      >
        {item.name}
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <ul className="absolute left-0 top-full z-50 min-w-[200px] border border-gp-line bg-white py-2 shadow-lg">
          {item.children!.map((child) => (
            <li key={child.name}>
              <Link href={child.href} className="block px-4 py-2 text-sm font-medium text-gp-ink hover:bg-gp-surface hover:underline">
                {child.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

const Header = ({ trending = DEFAULT_TRENDING }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  }, [router.asPath]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
    setSearchQuery('');
  };

  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-[60] focus:bg-white focus:px-3 focus:py-2">
        Skip to content
      </a>
      <header className="gp-site sticky top-0 z-50 border-b border-gp-line bg-white">
        <div className="mx-auto flex h-14 max-w-[1280px] items-center gap-3 px-4 lg:h-16">
          {/* Mobile menu */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <button type="button" className="-ml-1 p-1 lg:hidden" aria-label="Show navigation menu">
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="gp-site w-full max-w-full overflow-y-auto border-0 bg-white p-0 sm:max-w-sm [&>button]:hidden">
              <div className="flex h-14 items-center justify-between border-b border-gp-line px-4">
                <SheetTitle className="sr-only">Navigation menu</SheetTitle>
                <img src="/ghana-point-logo.svg" alt="Ghana Point" className="h-7 w-auto" />
                <button type="button" onClick={() => setIsMenuOpen(false)} aria-label="Close navigation menu" className="p-1">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <form onSubmit={handleSearch} className="border-b border-gp-line p-4">
                <label className="flex items-center gap-2 border border-gp-ink px-3 py-2">
                  <Search className="h-4 w-4 shrink-0" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Ghana Point"
                    className="w-full bg-transparent text-sm outline-none"
                  />
                </label>
              </form>
              <nav aria-label="Mobile navigation">
                <ul>
                  {NAV.map((item) => (
                    <li key={item.name} className="border-b border-gp-line">
                      {item.children ? (
                        <>
                          <button
                            type="button"
                            aria-expanded={expanded === item.name}
                            onClick={() => setExpanded(expanded === item.name ? null : item.name)}
                            className="flex w-full items-center justify-between px-4 py-3.5 text-left text-base font-bold"
                          >
                            {item.name}
                            <ChevronDown className={`h-5 w-5 transition-transform ${expanded === item.name ? 'rotate-180' : ''}`} />
                          </button>
                          {expanded === item.name && (
                            <ul className="bg-gp-surface pb-2">
                              {item.children.map((child) => (
                                <li key={child.name}>
                                  <Link href={child.href} className="block px-6 py-2.5 text-[0.95rem] font-medium">
                                    {child.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </>
                      ) : (
                        <Link
                          href={item.href}
                          className={`block px-4 py-3.5 text-base font-bold ${isActive(router.asPath, item.href) ? 'text-gp-accent-dark' : ''}`}
                        >
                          {item.name}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="p-4">
                <a href={WHATSAPP_CHANNEL} target="_blank" rel="noopener noreferrer" className="block bg-gp-ink py-3 text-center text-sm font-bold text-white">
                  Get updates on WhatsApp
                </a>
              </div>
            </SheetContent>
          </Sheet>

          <Link href="/" className="shrink-0" aria-label="Ghana Point, link to home page">
            <img src="/ghana-point-logo.svg" alt="Ghana Point" width={150} height={32} className="h-7 w-auto lg:h-8" />
          </Link>

          {/* Desktop navigation */}
          <nav aria-label="Main navigation" className="hidden flex-1 justify-center lg:flex">
            <ul className="flex items-center">
              {NAV.map((item) => {
                const active = isActive(router.asPath, item.href) || Boolean(item.children?.some((c) => isActive(router.asPath, c.href)));
                return item.children ? (
                  <DesktopDropdown key={item.name} item={item} active={active} />
                ) : (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex h-16 items-center border-b-[3px] px-3 text-[0.95rem] font-bold ${active ? 'border-gp-accent' : 'border-transparent hover:border-gp-ink'}`}
                    >
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-2 sm:gap-3 lg:ml-0">
            <LiveLink compact />
            <button
              type="button"
              onClick={() => setIsSearchOpen((v) => !v)}
              className="p-1.5"
              aria-label={isSearchOpen ? 'Close search' : 'Click here to search'}
              aria-expanded={isSearchOpen}
            >
              {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </button>
            <a
              href={WHATSAPP_CHANNEL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden bg-gp-ink px-4 py-2 text-sm font-bold text-white hover:bg-gp-text sm:inline-block"
            >
              Get updates
            </a>
          </div>
        </div>

        {isSearchOpen && (
          <div className="border-t border-gp-line bg-white">
            <form onSubmit={handleSearch} className="mx-auto flex max-w-[1280px] items-center gap-3 px-4 py-4">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Ghana Point"
                className="w-full border-b-2 border-gp-ink bg-transparent py-2 text-lg outline-none"
                autoFocus
              />
              <button type="submit" className="bg-gp-ink px-5 py-2.5 text-sm font-bold text-white">
                Search
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Trending bar */}
      {trending.length > 0 && (
        <div className="gp-site border-b border-gp-line bg-white">
          <div className="gp-no-scrollbar mx-auto flex max-w-[1280px] items-center gap-4 overflow-x-auto px-4 py-2.5 text-sm">
            <span className="shrink-0 font-black text-gp-ink">Trending</span>
            <ul className="flex items-center">
              {trending.map((topic, i) => (
                <li key={`${topic.href}-${topic.name}`} className="flex shrink-0 items-center">
                  {i > 0 && <span aria-hidden className="mx-3 h-3.5 w-px bg-gp-line" />}
                  <Link href={topic.href} className="whitespace-nowrap font-medium text-gp-text hover:underline">
                    {topic.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
