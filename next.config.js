// @ts-check

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  experimental: {
    optimizePackageImports: ["db"],
    typedRoutes: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "uploadthing-prod.s3.us-west-2.amazonaws.com",
        port: "",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/img/:path*",
        destination:
          "https://uploadthing-prod.s3.us-west-2.amazonaws.com/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
