#!/bin/sh
set -e

echo "========================================================"
echo "🚀 Initializing Raadhe Academy Container"
echo "========================================================"

# Log environment variables detection (count and key names, masking secrets)
TOTAL_ENV_COUNT=$(env | wc -l | tr -d ' ')
echo "📋 Environment detected: $TOTAL_ENV_COUNT environment variables loaded"
echo "   NODE_ENV:             ${NODE_ENV:-production (default)}"
echo "   PORT:                 ${PORT:-3000}"
echo "   HOSTNAME:             ${HOSTNAME:-0.0.0.0}"
echo "   DATABASE_URL:         $([ -n "$DATABASE_URL" ] && echo '[CONFIGURED]' || echo '[MISSING]')"
echo "   BETTER_AUTH_SECRET:   $([ -n "$BETTER_AUTH_SECRET" ] && echo '[CONFIGURED]' || echo '[MISSING]')"
echo "   BETTER_AUTH_URL:      ${BETTER_AUTH_URL:-[NOT SET]}"
echo "   NEXT_PUBLIC_APP_URL:  ${NEXT_PUBLIC_APP_URL:-[NOT SET]}"
echo "   ORGANIZATION_NAME:    ${ORGANIZATION_NAME:-Radhe Vastraz Academy (default)}"
echo "   ACADEMY_TIMEZONE:     ${ACADEMY_TIMEZONE:-Asia/Kolkata (default)}"
echo "--------------------------------------------------------"

# List loaded keys alphabetically (sanitized, excluding secret values)
LOADED_KEYS=$(env | cut -d= -f1 | sort | tr '\n' ' ')
echo "🔑 Loaded Environment Keys: $LOADED_KEYS"
echo "========================================================"

# Support explicit subcommands (e.g., `docker run <image> migrate`)
case "$1" in
  migrate)
    echo "🔄 Running database migrations only..."
    exec prisma migrate deploy
    ;;
  seed)
    echo "🌱 Running database seeder only..."
    exec node ./prisma/seed.js
    ;;
esac

# 1. Run database migrations automatically on boot
if [ "$SKIP_MIGRATE" != "true" ] && [ -n "$DATABASE_URL" ] && [ "$DATABASE_URL" != "postgresql://postgres:postgres@localhost:5432/dummy" ]; then
  echo "⏳ Starting database migrations (prisma migrate deploy)..."
  MAX_RETRIES=15
  RETRY_COUNT=0

  until prisma migrate deploy || [ $RETRY_COUNT -ge $MAX_RETRIES ]; do
    RETRY_COUNT=$((RETRY_COUNT + 1))
    echo "⚠️ Database not ready yet (attempt $RETRY_COUNT/$MAX_RETRIES)... retrying in 3s"
    sleep 3
  done

  if [ $RETRY_COUNT -lt $MAX_RETRIES ]; then
    echo "✅ Database migrations applied successfully."
  else
    echo "❌ Error: Database migration failed after $MAX_RETRIES attempts. Starting server anyway..."
  fi
else
  echo "ℹ️ Database migration skipped (SKIP_MIGRATE=true or DATABASE_URL not set)."
fi

# 2. Run database seeder automatically on boot
if [ "$SKIP_SEED" != "true" ] && [ -f "./prisma/seed.js" ] && [ -n "$DATABASE_URL" ] && [ "$DATABASE_URL" != "postgresql://postgres:postgres@localhost:5432/dummy" ]; then
  echo "🌱 Starting database seeder (prisma/seed.js)..."
  node ./prisma/seed.js || echo "⚠️ Database seeder finished with warnings."
else
  echo "ℹ️ Database seeding skipped (SKIP_SEED=true or seed.js not found)."
fi

echo "--------------------------------------------------------"
echo "🌐 Starting Next.js application server on ${HOSTNAME:-0.0.0.0}:${PORT:-3000}..."
echo "========================================================"
exec node server.js "$@"
