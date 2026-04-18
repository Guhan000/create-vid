import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/dashboard/create/moving-ai-video",
        destination: "/dashboard/create/faceless",
        permanent: false,
      },
      {
        source: "/dashboard/create/ugc",
        destination: "/dashboard/create/faceless",
        permanent: false,
      },
      {
        source: "/dashboard/create/stick",
        destination: "/dashboard/create/faceless",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
