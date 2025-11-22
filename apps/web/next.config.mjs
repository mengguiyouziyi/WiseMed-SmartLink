/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/auth/:path*',
        destination: 'http://auth-service:8000/:path*',
      },
      {
        source: '/api/infer/:path*',
        destination: 'http://ai-infer-service:8000/:path*',
      },
      {
        source: '/api/clinic/:path*',
        destination: 'http://asr-tts-nmt-service:8000/:path*',
      },
      {
        source: '/api/translate/:path*',
        destination: 'http://translation-service:8000/:path*',
      },
      {
        source: '/api/imaging/:path*',
        destination: 'http://pacs-gw-service:8000/:path*',
      },
    ]
  },
};

export default nextConfig;
