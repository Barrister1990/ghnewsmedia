import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { SITE_DOMAIN } from './config/site';

/** Hosts that must 301 to the canonical apex (ghanapoint.com). */
const REDIRECT_HOSTS = new Set([`www.${SITE_DOMAIN}`]);

export function middleware(request: NextRequest) {
  const host = (request.headers.get('host') ?? '').toLowerCase().split(':')[0];
  const { pathname } = request.nextUrl;

  // Canonical host is apex. Vercel Domains must also redirect www → apex, or you get a loop.
  if (REDIRECT_HOSTS.has(host)) {
    const url = request.nextUrl.clone();
    url.host = SITE_DOMAIN;
    url.port = '';
    url.protocol = 'https:';
    return NextResponse.redirect(url, 301);
  }

  // /_category/* is only an internal rewrite target; visited directly it would duplicate /<slug>.
  if (pathname.startsWith('/_category/')) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/_category/, '');
    return NextResponse.redirect(url, 301);
  }

  // Static pages that should not be rewritten to category routes
  const staticPages = [
    '/privacy',
    '/terms',
    '/about',
    '/contact',
    '/advertise',
    '/editorial-policy',
    '/authors',
    '/news',
    '/search',
    '/404',
    '/email-verification',
    '/robots.txt',
    '/sitemap.xml',
    '/sitemap-index.xml',
    '/news-sitemap.xml',
    '/rss.xml',
  ];

  // Skip middleware for static files, API routes, Next.js internals, and static pages
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/auth') ||
    pathname.startsWith('/cms') ||
    pathname.includes('.') ||
    pathname === '/' ||
    staticPages.includes(pathname) ||
    pathname.startsWith('/search')
  ) {
    return NextResponse.next();
  }

  // Check if path is a single segment (potential category)
  const pathSegments = pathname.split('/').filter(Boolean);

  // If it's a single segment, rewrite to internal category route
  if (pathSegments.length === 1) {
    const categorySlug = pathSegments[0];
    // Rewrite to internal route that won't conflict with [category]/[slug].tsx.
    // Clone the URL so query params (e.g. ?page=2) survive the rewrite.
    const url = request.nextUrl.clone();
    url.pathname = `/_category/${categorySlug}`;
    return NextResponse.rewrite(url);
  }

  // Two segments - definitely an article (category/article-slug)
  if (pathSegments.length === 2) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
