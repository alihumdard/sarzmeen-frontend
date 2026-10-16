import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  images: {
    minimumCacheTTL: isDev ? 0 : 14400,
    unoptimized: isDev,
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
      // The API port moves between environments, so allow both local ports.
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/storage/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8001",
        pathname: "/storage/**",
      },
    ],
  },
};

export default nextConfig;
