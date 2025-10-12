/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    config.stats = 'errors-only';
    return config;
  },
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [],
  },
  experimental: {
    optimizePackageImports: ['@clerk/nextjs', 'framer-motion', 'convex/react'],
  },
  async redirects() {
    return [
      {
        source: '/postscript-journaling',
        destination: '/ps-journaling',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
