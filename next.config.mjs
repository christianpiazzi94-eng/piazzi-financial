// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: false,
  },
  // --- ADD THIS BLOCK ---
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/images/**', // Allow images from any Sanity project
      },
    ],
  },
  // ---------------------
};

export default nextConfig;