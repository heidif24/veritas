import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  // better-sqlite3 is a native addon; keep it external so Vercel/serverless can load it
  serverExternalPackages: ["better-sqlite3"],
  // Do not fail the whole deploy on ambient type noise from role/sqlite shims
  typescript: {
    // Keep false once clean; temporary safety if native addon types lag
    ignoreBuildErrors: false,
  },
  eslint: {
    // ESLint failures should not block production ship while redesign lands
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
