import type { NextConfig } from "next";

const CSP_HEADER = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob: https://*.amazonaws.com https://*.r2.cloudflarestorage.com;
  font-src 'self' data:;
  connect-src 'self' https://*.amazonaws.com https://*.r2.cloudflarestorage.com;
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
  },
  images: {
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7-day image cache to reduce repeated disk reads
    formats: ["image/webp"], // WebP only (avoids CPU-intensive AVIF compression)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "**.r2.cloudflarestorage.com",
      },
    ],
  },
  async headers() {
    return [
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
