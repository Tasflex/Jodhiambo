import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [{ source: "/publications", destination: "/publications/research", permanent: false }];
  },
};

export default nextConfig;
