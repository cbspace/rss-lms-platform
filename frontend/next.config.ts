import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone', // Enables lightweight production bundle
  allowedDevOrigins: ["10.0.0.100"],

  async rewrites() {
    // Only apply rewrite proxying in dev, or when cloudflare bypassed. Fallback to localhost for dev
    const apiUrl = process.env.API_URL || 'http://localhost:4080';

    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
