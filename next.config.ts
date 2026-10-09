import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output only for Docker builds (set NEXT_OUTPUT=standalone).
  // Vercel's build system doesn't need this, and `next start` doesn't work with it.
  ...(process.env.NEXT_OUTPUT === 'standalone' && {
    output: 'standalone' as const,
  }),

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'jkidtefistttcjegtopm.supabase.co',
        pathname: '/storage/v1/object/public/product-images/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
  },
};

export default nextConfig;