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
  // Keep vanity section URLs while preserving existing category routes.
  async rewrites() {
    return [
      {
        source: '/lifestyle',
        destination: '/entertainment',
      },
    ];
  },
};

module.exports = nextConfig;
