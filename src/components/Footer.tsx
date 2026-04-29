import { Facebook, Mail, MapPin, MessageCircle, Phone, Twitter, Youtube } from 'lucide-react';
import Link from 'next/link';

const socialLinks = [
  {
    href: 'https://www.facebook.com/profile.php?id=61577876216304&mibextid=ZbWKwL',
    label: 'Follow us on Facebook',
    icon: Facebook,
  },
  {
    href: 'https://x.com/ghnewsmedia?t=Fx80oa-73oEdgyznOxM_Yg&s=09',
    label: 'Follow us on X',
    icon: Twitter,
  },
  {
    href: 'https://youtube.com/@ghnewsmedia?si=X7l2KfRAkWHG2bAu',
    label: 'Subscribe on YouTube',
    icon: Youtube,
  },
  {
    href: 'https://whatsapp.com/channel/0029Vb66ViJK5cDJ8RjFSR2D',
    label: 'Join our WhatsApp channel',
    icon: MessageCircle,
  },
];

const companyLinks = [
  { href: '/about', label: 'About Us' },
  { href: '/authors', label: 'Our Journalists' },
  { href: '/advertise', label: 'Advertise With Us' },
  { href: '/contact', label: 'Contact' },
];

const sectionLinks = [
  { href: '/business', label: 'Business' },
  { href: '/sports', label: 'Sports' },
  { href: '/tech', label: 'Tech' },
  { href: '/entertainment', label: 'Lifestyle' },
];

const policyLinks = [
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Service' },
];

const Footer = () => {
  return (
    <footer className="mt-14 border-t border-stone-800 bg-[#111827] text-stone-300">
      <div className="container mx-auto px-4 py-10 sm:py-12 lg:py-14">
        <div className="mb-10 grid grid-cols-1 gap-8 border-b border-white/10 pb-10 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">GhNewsMedia</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-[28px]">
              Trusted reporting for Ghana and beyond.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-stone-400">
              In-depth political, business, sports, and culture coverage from a newsroom focused on accuracy,
              speed, and editorial integrity.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-2.5">
              {socialLinks.map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/[0.03] text-stone-200 transition hover:border-white/35 hover:bg-white/[0.08] hover:text-white"
                >
                  <Icon className="h-[18px] w-[18px]" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 lg:col-span-7">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">Sections</p>
              <ul className="mt-4 space-y-2.5">
                {sectionLinks.map((section) => (
                  <li key={section.href}>
                    <Link
                      href={section.href}
                      className="text-sm text-stone-300 transition hover:text-white"
                    >
                      {section.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">Company</p>
              <ul className="mt-4 space-y-2.5">
                {companyLinks.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-sm text-stone-300 transition hover:text-white">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">Newsroom Contact</p>
              <ul className="mt-4 space-y-3">
                <li className="flex items-start gap-2.5 text-sm text-stone-300">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-stone-500" />
                  <span>Accra, Ghana</span>
                </li>
                <li className="flex items-start gap-2.5 text-sm text-stone-300">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-stone-500" />
                  <a href="tel:+233500651988" className="transition hover:text-white">
                    +233 (0) 50 065 1988
                  </a>
                </li>
                <li className="flex items-start gap-2.5 text-sm text-stone-300">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-stone-500" />
                  <a href="mailto:ghnewsmedia7@gmail.com" className="transition hover:text-white">
                    ghnewsmedia7@gmail.com
                  </a>
                </li>
                <li className="pt-1">
                  <a
                    href="https://whatsapp.com/channel/0029Vb66ViJK5cDJ8RjFSR2D"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-emerald-200 transition hover:border-emerald-300/50 hover:bg-emerald-400/20"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    WhatsApp updates
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 text-xs text-stone-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} GhNewsMedia. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            {policyLinks.map((item) => (
              <Link key={item.href} href={item.href} className="transition hover:text-stone-300">
                {item.label}
              </Link>
            ))}
            <span className="hidden text-stone-700 sm:inline">•</span>
            <span className="text-stone-500">Ghana&apos;s premier digital news platform</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;