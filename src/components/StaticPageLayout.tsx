import { NextSeo } from 'next-seo';
import { ROBOTS_PROPS } from 'next-seo.config';
import Link from 'next/link';
import { DEFAULT_OG_IMAGE } from '@/config/site';
import { useRouter } from 'next/router';
import React from 'react';

interface StaticPageLayoutProps {
  title: string;
  children: React.ReactNode;
  description?: string;
  canonical?: string;
}

const ABOUT_LINKS = [
  { href: '/about', label: 'About Us' },
  { href: '/authors', label: 'Our Journalists' },
  { href: '/contact', label: 'Contact Us' },
  { href: '/editorial-policy', label: 'Editorial Policy' },
  { href: '/advertise', label: 'Advertise with us' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms and Conditions' },
];

const StaticPageLayout: React.FC<StaticPageLayoutProps> = ({
  title,
  children,
  description,
  canonical
}) => {
  const { pathname } = useRouter();

  return (
    <>
      <NextSeo
        title={`${title} | Ghana Point`}
        description={description}
        canonical={canonical}
        robotsProps={ROBOTS_PROPS}
        openGraph={{
          title: `${title} | Ghana Point`,
          description: description,
          url: canonical,
          siteName: 'Ghana Point',
          type: 'website',
          images: [{ ...DEFAULT_OG_IMAGE, alt: 'Ghana Point' }],
        }}
        twitter={{
          cardType: 'summary_large_image',
        }}
      />
      <main id="main-content" className="gp-site mx-auto max-w-[1280px] px-4 pb-8">
        <nav aria-label="Breadcrumb" className="pt-6 text-xs text-gp-muted">
          <Link href="/" className="hover:underline">Home</Link>
          <span aria-hidden className="mx-1.5">/</span>
          <span>{title}</span>
        </nav>

        <header className="mb-8 mt-3 border-b-2 border-gp-ink pb-4">
          <h1 className="text-[2rem] font-black leading-tight text-gp-ink sm:text-[2.75rem]">{title}</h1>
          {description && <p className="mt-2 max-w-3xl text-lg leading-relaxed text-gp-muted">{description}</p>}
        </header>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <article className="prose prose-lg max-w-none text-gp-text lg:col-span-8 prose-headings:font-bold prose-headings:text-gp-ink prose-a:text-gp-ink prose-a:underline-offset-2">
            {children}
          </article>

          <aside className="lg:col-span-4">
            <nav aria-labelledby="about-links-heading" className="lg:sticky lg:top-24">
              <h2 id="about-links-heading" className="mb-2 border-b-2 border-gp-ink pb-1.5 text-xl font-bold text-gp-ink">
                About Ghana Point
              </h2>
              <ul>
                {ABOUT_LINKS.map((link) => (
                  <li key={link.href} className="border-b border-gp-line">
                    <Link
                      href={link.href}
                      aria-current={pathname === link.href ? 'page' : undefined}
                      className={`block py-3 text-[0.95rem] font-bold hover:underline ${pathname === link.href ? 'text-gp-accent-dark' : 'text-gp-ink'}`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        </div>
      </main>
    </>
  );
};

export default StaticPageLayout;
