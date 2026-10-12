/** @type {import('next').NextConfig} */

const NOINDEX_PATHS = [
  '/admin/:path*',
  '/cms/:path*',
  '/auth',
  '/email-verification',
  '/test-tiptap',
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'zodidixpxznfsopxdhyr.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
       {
        protocol: 'https',
        hostname: '**', // allow all HTTPS image sources
      },
    ],
  },
  eslint: {
  ignoreDuringBuilds: true,
},
  experimental: {
    allowedDevOrigins: ['http://192.168.0.179:3000'],
  },
  async headers() {
    return [
      ...NOINDEX_PATHS.map((source) => ({
        source,
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      })),
      {
        source: '/:feed(sitemap.xml|sitemap-index.xml|news-sitemap.xml|rss.xml)',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex' }],
      },
    ];
  },
  // Sitemap and RSS are served by pages/sitemap.xml.tsx and pages/rss.xml.tsx at /sitemap.xml and /rss.xml.
  // Do not rewrite to /api/* — no API routes exist for these; rewrites would cause 404s and break Google News.
};

module.exports = nextConfig;
