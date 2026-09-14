FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat openssl

# 1. Install dependencies based on package-lock.json
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# 2. Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json ./
COPY prisma ./prisma

# Generate Prisma client and compile seeder (cached as long as schema and dependencies do not change)
RUN npx prisma generate
RUN npm run build:seed

# Copy remaining source code
COPY . .

# Build-time environment variables for Next.js build
ENV DATABASE_URL="postgresql://postgres:postgres@localhost:5432/dummy"
ENV BETTER_AUTH_SECRET="build-secret-12345678901234567890123456789012"
ENV BETTER_AUTH_URL="http://localhost:3005"
ENV NEXT_PUBLIC_APP_URL="http://localhost:3005"
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Next.js standalone build
RUN npm run build

# 3. Production runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3005
ENV HOSTNAME="0.0.0.0"
# Resource-constrained home server tuning:
# Cap V8 heap to prevent OOM kills & HDD swap thrashing, optimize for memory footprint
ENV NODE_OPTIONS="--max-old-space-size=384 --optimize-for-size"
ENV UV_THREADPOOL_SIZE=4

# Non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Set correct permission for prerender cache
RUN mkdir -p .next/cache && chown -R nextjs:nodejs .next

# Copy static assets and standalone output
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy pre-installed Prisma CLI and runtime dependencies from builder (no global npm install needed)
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder /app/node_modules/.bin/prisma ./node_modules/.bin/prisma
COPY --from=builder /app/node_modules/@paralleldrive ./node_modules/@paralleldrive

# Ensure prisma binary is directly on PATH
ENV PATH="/app/node_modules/.bin:$PATH"

# Copy startup entrypoint script
COPY --chown=nextjs:nodejs docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

USER nextjs

EXPOSE 3005

# Docker & Coolify health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3005/api/health || exit 1

CMD ["./docker-entrypoint.sh"]
