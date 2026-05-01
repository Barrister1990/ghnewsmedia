/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
  // Sitemap and RSS are served by pages/sitemap.xml.tsx and pages/rss.xml.tsx at /sitemap.xml and /rss.xml.
  // Do not rewrite to /api/* — no API routes exist for these; rewrites would cause 404s and break Google News.
  // async rewrites() { ... } removed per SEO audit (docs/SEO-AUDIT-GOOGLE-NEWS-DISCOVER.md)
};

module.exports = nextConfig;
