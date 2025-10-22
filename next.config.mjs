// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  // This block will disable the strict link checking
  experimental: {
    typedRoutes: false,
  },
};

export default nextConfig;