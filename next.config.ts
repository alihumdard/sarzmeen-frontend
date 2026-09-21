import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  images: {
    /*
     * Next.js 16 caches optimized images for 4 hours by default, so replacing
     * a file under public/images keeps serving the old one during development.
     * Disable the cache locally; production keeps the durable default.
     */
    minimumCacheTTL: isDev ? 0 : 14400,
    /*
     * i.pravatar.cc — placeholder profile photos for mock agent/agency data
     * (src/data/agents.ts). Remove once real agency logos come from the API.
     */
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
