import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    authInterrupts: true,
    staleTimes: {
      dynamic: 60,
    },
  },
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ieiwv1cxjljz3qrz.public.blob.vercel-storage.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/seed/**",
      },
    ],
  },
};

export default nextConfig;
