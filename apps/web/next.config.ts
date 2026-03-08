import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['design-system', 'meme-engine', 'rewards'],
  experimental: {
    // Enable server actions
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
