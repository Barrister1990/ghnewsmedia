/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'your-supabase-url.supabase.co'],
  },
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap.xml',
      },
      {
        source: '/rss.xml',
        destination: '/api/rss.xml',
      },
    ];
  },
};

module.exports = nextConfig;