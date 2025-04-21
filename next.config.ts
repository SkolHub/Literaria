import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'firebasestorage.googleapis.com'
      }
    ]
  },
  async rewrites() {
    return [
      {
        source: '/sitemap-new.xml',
        destination: '/sitemap.xml'
      }
    ];
  }
};

export default nextConfig;
