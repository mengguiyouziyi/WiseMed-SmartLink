/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/auth/:path*',
        destination: 'http://localhost:8001/:path*',
      },
      {
        source: '/api/infer/:path*',
        destination: 'http://localhost:8002/:path*',
      },
      {
        source: '/api/pacs/:path*',
        destination: 'http://localhost:8003/:path*',
      },
      {
        source: '/api/translate/:path*',
        destination: 'http://localhost:8004/:path*',
      },
    ]
  },
};

export default nextConfig;
