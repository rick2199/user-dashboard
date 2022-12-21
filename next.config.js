/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/newsletter/:path*",
        destination: `${process.env.NEXT_PUBLIC_BLOG_URL_URL}/api/newsletter/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
