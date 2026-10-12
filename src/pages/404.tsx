import Footer from '@/components/Footer';
import Header from '@/components/Header';
import SEOHead from '@/components/SEO/SEOHead';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

const SECTIONS = [
  { href: '/news', label: 'Latest News' },
  { href: '/sports', label: 'Sport' },
  { href: '/business', label: 'Business' },
  { href: '/entertainment', label: 'Entertainment' },
  { href: '/opinions', label: 'Opinion' },
  { href: '/features', label: 'Features' },
];

const NotFound = () => {
  const router = useRouter();
  const [query, setQuery] = useState('');

  return (
    <div className="gp-site flex min-h-screen flex-col bg-white">
      <SEOHead
        title="Page Not Found"
        description="The page you're looking for could not be found. Browse our latest news and updates from Ghana or search for specific topics."
        noindex
      />

      <Header />

      <main id="main-content" className="mx-auto w-full max-w-[1280px] flex-1 px-4 py-12 sm:py-16">
        <p className="text-sm font-black uppercase tracking-wide text-gp-accent-dark">Error 404</p>
        <h1 className="mt-2 text-[2rem] font-black leading-tight text-gp-ink sm:text-[3rem]">This page could not be found</h1>
        <p className="mt-3 max-w-2xl text-lg leading-relaxed text-gp-muted">
          The story or page you are looking for may have been moved, deleted, or the link may be wrong. Try searching, or
          head to one of our sections.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`);
          }}
          className="mt-8 flex max-w-2xl items-center gap-3"
        >
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Ghana Point"
            aria-label="Search Ghana Point"
            className="w-full border-b-2 border-gp-ink bg-transparent py-2 text-lg outline-none"
          />
          <button type="submit" className="bg-gp-ink px-5 py-2.5 text-sm font-bold text-white">Search</button>
        </form>

        <nav aria-labelledby="sections-heading" className="mt-12 max-w-2xl">
          <h2 id="sections-heading" className="mb-2 border-b-2 border-gp-ink pb-1.5 text-xl font-bold text-gp-ink">
            Browse our sections
          </h2>
          <ul className="grid grid-cols-2 sm:grid-cols-3">
            {SECTIONS.map((s) => (
              <li key={s.href} className="border-b border-gp-line">
                <Link href={s.href} className="block py-3 font-bold text-gp-ink hover:underline">{s.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <Link href="/" className="mt-10 inline-block border-2 border-gp-ink px-8 py-2.5 text-sm font-bold hover:bg-gp-ink hover:text-white">
          Go to the home page
        </Link>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;
