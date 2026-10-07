import type { NextConfig } from "next";

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.fishbase.se",
      },
    ],
  },
};
export default nextConfig;
