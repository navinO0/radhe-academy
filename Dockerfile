# Base Alpine image with required native libraries and process init supervisor
FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat openssl dumb-init

# 1. Builder stage: install dependencies and compile application
FROM base AS builder
WORKDIR /app

# Install dependencies using BuildKit cache mount
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --prefer-offline --no-audit --no-fund

# Generate Prisma Client (cached unless schema.prisma changes)
COPY prisma ./prisma
RUN npx prisma generate

# Copy application source code
COPY . .

# Dummy build-time environment variables for Next.js compilation
ENV DATABASE_URL="postgresql://postgres:postgres@localhost:5432/dummy"
ENV BETTER_AUTH_SECRET="build-secret-12345678901234567890123456789012"
ENV BETTER_AUTH_URL="http://localhost:3000"
ENV NEXT_PUBLIC_APP_URL="http://localhost:3000"
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Compile seed script bundle and build Next.js standalone application
RUN npm run build

# 2. Production runner stage: minimal footprint, non-root user
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Install Prisma CLI globally in runner so all CLI engines, WASM, and dependencies are available
RUN npm install -g prisma@6.3.1

# Non-root user for security (UID 1001)
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Set correct permission for prerender cache
RUN mkdir -p .next/cache && chown -R nextjs:nodejs .next

# Copy static assets and standalone bundle
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy runtime Prisma client and seed dependencies from builder
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@paralleldrive ./node_modules/@paralleldrive

# Copy startup entrypoint script
COPY --chown=nextjs:nodejs docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

USER nextjs

EXPOSE 3000

# Docker health check against local endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:${PORT:-3000}/api/health || exit 1

# dumb-init forwards signals (SIGTERM/SIGINT) properly to the node process for graceful shutdown
ENTRYPOINT ["dumb-init", "--"]
CMD ["./docker-entrypoint.sh"]
