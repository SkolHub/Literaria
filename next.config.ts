import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
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
