import type { NextConfig } from "next";

const CSP_HEADER = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob: https://*.amazonaws.com https://*.r2.cloudflarestorage.com https://*.storageapi.dev https://t3.storageapi.dev https://res.cloudinary.com;
  font-src 'self' data:;
  connect-src 'self' https://*.amazonaws.com https://*.r2.cloudflarestorage.com https://*.storageapi.dev https://t3.storageapi.dev https://res.cloudinary.com https://api.cloudinary.com;
  frame-ancestors 'none';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
`
  .replace(/\s{2,}/g, " ")
  .trim();

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  cacheMaxMemorySize: 20 * 1024 * 1024, // 20MB cache cap for low RAM environments
  compress: false, // Offload compression to reverse proxy (Coolify/Traefik) to save Node.js CPU
  typescript: {
    // Disable typechecking during production build to save CPU/RAM and drastically reduce build time on low-resource servers.
    // Type safety is maintained via `npm run typecheck` locally.
    ignoreBuildErrors: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
    optimizePackageImports: [
      "lucide-react",
      "date-fns",
      "recharts",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-select",
      "@radix-ui/react-popover",
      "@radix-ui/react-tooltip",
      "decimal.js",
    ],
  },
  images: {
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7-day image cache to reduce repeated disk reads
    formats: ["image/webp"], // WebP only (avoids CPU-intensive AVIF compression)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "**.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "**.r2.cloudflarestorage.com",
      },
      {
        protocol: "https",
        hostname: "**.storageapi.dev",
      },
      {
        protocol: "https",
        hostname: "t3.storageapi.dev",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(terms|privacy)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, s-maxage=31536000, immutable",
          },
          {
            key: "CDN-Cache-Control",
            value: "public, max-age=31536000",
          },
          {
            key: "Cloudflare-CDN-Cache-Control",
            value: "public, max-age=31536000",
          },
        ],
      },
      {
        source: "/",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400",
          },
          {
            key: "CDN-Cache-Control",
            value: "public, max-age=86400",
          },
          {
            key: "Cloudflare-CDN-Cache-Control",
            value: "public, max-age=86400",
          },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=604800, s-maxage=2592000, immutable",
          },
          {
            key: "Cloudflare-CDN-Cache-Control",
            value: "public, max-age=2592000",
          },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: CSP_HEADER },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          ...(process.env.NODE_ENV === "production"
            ? [
                {
                  key: "Strict-Transport-Security",
                  value: "max-age=31536000; includeSubDomains",
                },
              ]
            : []),
        ],
      },
    ];
  },
};

export default nextConfig;
