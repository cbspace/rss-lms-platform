import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone', // <-- REQUIRED for standalone folder generation
  allowedDevOrigins: ["10.0.0.100"],
};

export default nextConfig;
