/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ["db"],
  },
};

module.exports = nextConfig;
