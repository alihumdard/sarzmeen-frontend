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
  },
};

export default nextConfig;
