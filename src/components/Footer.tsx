import { CONTACT_EMAIL } from '@/config/site';
import { ChevronDown, Facebook, MessageCircle, Rss, Twitter, Youtube } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface FooterLink {
  href: string;
  label: string;
  external?: boolean;
}

const COLUMNS: { title: string; links: FooterLink[] }[] = [
  {
    title: 'About',
    links: [
      { href: '/about', label: 'About Us' },
      { href: '/authors', label: 'Our Journalists' },
      { href: '/editorial-policy', label: 'Editorial Policy' },
      { href: '/terms', label: 'Terms and Conditions' },
      { href: '/privacy', label: 'Privacy Policy' },
      { href: '/sitemap.xml', label: 'Sitemap' },
    ],
  },
  {
    title: 'Connect',
    links: [
      { href: '/contact', label: 'Contact Us' },
      { href: '/advertise', label: 'Advertise with us' },
      { href: `mailto:${CONTACT_EMAIL}?subject=News tip`, label: 'Submit a Tip', external: true },
      { href: '/rss.xml', label: 'RSS Feed' },
    ],
  },
  {
    title: 'Our Sections',
    links: [
      { href: '/news', label: 'News' },
      { href: '/entertainment', label: 'Entertainment' },
      { href: '/sports', label: 'Sport' },
      { href: '/business', label: 'Business' },
      { href: '/opinions', label: 'Opinion' },
    ],
  },
  {
    title: 'More',
    links: [
      { href: '/tech', label: 'Tech' },
      { href: '/lifestyle', label: 'Lifestyle' },
      { href: '/features', label: 'Features' },
      { href: '/search', label: 'Search' },
    ],
  },
];

const SOCIAL = [
  { href: 'https://www.facebook.com/profile.php?id=61577876216304&mibextid=ZbWKwL', label: 'Facebook', icon: Facebook },
  { href: 'https://x.com/ghnewsmedia?t=Fx80oa-73oEdgyznOxM_Yg&s=09', label: 'X (Twitter)', icon: Twitter },
  { href: 'https://youtube.com/@ghnewsmedia?si=X7l2KfRAkWHG2bAu', label: 'YouTube', icon: Youtube },
  { href: 'https://whatsapp.com/channel/0029Vb66ViJK5cDJ8RjFSR2D', label: 'WhatsApp', icon: MessageCircle },
  { href: '/rss.xml', label: 'RSS', icon: Rss },
];

const FooterColumn = ({ title, links }: { title: string; links: FooterLink[] }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-white/15 lg:border-0">
      <h2>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex w-full items-center justify-between py-4 text-left text-base font-bold text-white lg:pointer-events-none lg:py-0 lg:pb-4"
        >
          {title}
          <ChevronDown className={`h-5 w-5 transition-transform lg:hidden ${open ? 'rotate-180' : ''}`} aria-hidden />
          <span className="sr-only">{open ? 'Show less' : 'Show more'}</span>
        </button>
      </h2>
      <ul className={`${open ? 'block' : 'hidden'} space-y-3 pb-4 lg:block lg:pb-0`}>
        {links.map((link) => (
          <li key={link.label}>
            {link.external ? (
              <a href={link.href} className="text-sm text-white/75 hover:text-white hover:underline">{link.label}</a>
            ) : (
              <Link href={link.href} className="text-sm text-white/75 hover:text-white hover:underline">{link.label}</Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

const Footer = () => (
  <footer className="gp-site mt-12 bg-gp-dark text-white">
    <div className="mx-auto max-w-[1280px] px-4 pb-8 pt-6 lg:pt-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 lg:gap-8">
        {COLUMNS.map((column) => (
          <FooterColumn key={column.title} {...column} />
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-4 border-t border-white/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-bold">Follow Ghana Point:</p>
        <ul className="flex items-center gap-3">
          {SOCIAL.map(({ href, label, icon: Icon }) => (
            <li key={label}>
              <a
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 hover:bg-white hover:text-gp-ink"
              >
                <Icon className="h-4 w-4" />
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" aria-label="Ghana Point, link to home page" className="rounded bg-white px-3 py-2">
          <img src="/ghana-point-logo.svg" alt="Ghana Point" className="h-6 w-auto" />
        </Link>
        <p className="text-xs text-white/60">© {new Date().getFullYear()} Ghana Point. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
