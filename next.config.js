/** @type {import('next').NextConfig} */
const nextConfig = {
  
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: '**.heygen.com' },
      { protocol: 'https', hostname: '**.unsplash.com' },
      { protocol: 'https', hostname: '**.googleapis.com' },
    ],
  },
  experimental: {
    serverActions: { bodySizeLimit: '10mb' },
  },
  webpack: (config, { isServer, dev }) => {
    if (!dev && !isServer) {
      config.devtool = false;
    }
    return config;
  },
};

module.exports = nextConfig;
