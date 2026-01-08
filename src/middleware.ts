import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Static pages that should not be rewritten to category routes
  const staticPages = [
    '/privacy',
    '/terms',
    '/about',
    '/contact',
    '/advertise',
    '/search',
    '/404',
    '/email-verification',
    '/robots.txt',
    '/sitemap.xml',
    '/sitemap-index.xml',
    '/news-sitemap.xml',
    '/rss.xml'
  ];
  
  // Skip middleware for static files, API routes, Next.js internals, and static pages
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/_category') ||
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
  // e.g., /news, /sports, /business
  const pathSegments = pathname.split('/').filter(Boolean);
  
  // If it's a single segment, rewrite to internal category route
  if (pathSegments.length === 1) {
    const categorySlug = pathSegments[0];
    // Rewrite to internal route that won't conflict with [category]/[slug].tsx
    return NextResponse.rewrite(new URL(`/_category/${categorySlug}`, request.url));
  }
  
  // Two segments - definitely an article (category/article-slug)
  // Let the [category]/[slug].tsx route handle it
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
