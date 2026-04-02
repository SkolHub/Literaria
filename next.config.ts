import type { NextConfig } from 'next';
import type { RemotePattern } from 'next/dist/shared/lib/image-config';

const r2PublicBaseUrl = process.env.R2_PUBLIC_BASE_URL;
const r2RemotePatterns: RemotePattern[] = (() => {
  if (!r2PublicBaseUrl) {
    return [];
  }

  const url = new URL(r2PublicBaseUrl);
  const pathname = url.pathname.replace(/\/+$/, '');
  const protocol = url.protocol === 'https:' ? 'https' : 'http';

  return [
    {
      protocol,
      hostname: url.hostname,
      port: url.port || undefined,
      pathname: pathname ? `${pathname}/**` : '/**'
    }
  ];
})();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: r2RemotePatterns
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
