import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  // better-sqlite3 is a native addon; keep it external so Vercel/serverless can load it
  serverExternalPackages: ["better-sqlite3"],
  typescript: {
    // Prefer fixing types; if a deploy is blocked only by ambient TS noise, flip to true temporarily
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  headers: async () => [
    {
      source: "/:path*",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        { key: "X-DNS-Prefetch-Control", value: "off" },
      ],
    },
  ],
};

export default nextConfig;
