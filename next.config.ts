import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  ...(process.env.NEXT_OUTPUT === 'standalone' && {
    output: 'standalone' as const,
  }),

  // ─────────────────────────────────────────────────────────────
  // Image optimization
  // ─────────────────────────────────────────────────────────────
  images: {
    // Modern formats first — Next.js auto-serves based on Accept header
    formats: ['image/avif', 'image/webp'],

    // Breakpoints for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    // Cache optimized images for 60 days
    minimumCacheTTL: 60 * 60 * 24 * 60,

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

  // ─────────────────────────────────────────────────────────────
  // Cache headers — immutable for static assets
  // Browser + CDN cache hero images for 1 year
  // ─────────────────────────────────────────────────────────────
  async headers() {
    return [
      {
        source: '/suits/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // Performance
  // ─────────────────────────────────────────────────────────────

  // Trim unnecessary client-side JS from React
  reactStrictMode: true,

  // Tree-shake icon library — only bundle icons actually used
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },

  // ─────────────────────────────────────────────────────────────
  // Production hygiene
  // ─────────────────────────────────────────────────────────────

  // Remove console logs in production (saves bytes)
  compiler: {
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? { exclude: ['error', 'warn'] }
        : false,
  },
};

export default nextConfig;