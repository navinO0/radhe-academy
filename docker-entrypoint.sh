#!/bin/sh
set -e

# Support explicit subcommands
case "$1" in
  migrate)
    echo "🔄 Running database migrations..."
    exec prisma migrate deploy
    ;;
  seed)
    echo "🌱 Running database seeder..."
    exec node ./prisma/seed.js
    ;;
esac

# Default startup flow
# Only run migrations on container boot if explicitly requested via AUTO_MIGRATE=true
# (Best practice: decouple migration from web server startup)
if [ "$AUTO_MIGRATE" = "true" ] && [ -n "$DATABASE_URL" ]; then
  echo "⏳ AUTO_MIGRATE=true detected. Applying database migrations..."
  MAX_RETRIES=15
  RETRY_COUNT=0

  until prisma migrate deploy || [ $RETRY_COUNT -ge $MAX_RETRIES ]; do
    RETRY_COUNT=$((RETRY_COUNT + 1))
    echo "Database not ready (attempt $RETRY_COUNT/$MAX_RETRIES)... retrying in 3s"
    sleep 3
  done

  if [ $RETRY_COUNT -lt $MAX_RETRIES ]; then
    echo "✅ Database migrations applied successfully."
  else
    echo "⚠️ Warning: Database migration failed after $MAX_RETRIES attempts. Starting server anyway..."
  fi
fi

# Optional auto-seeding if enabled
if [ "$AUTO_SEED" = "true" ] && [ -f "./prisma/seed.js" ]; then
  echo "🌱 AUTO_SEED=true detected. Running idempotent seeder..."
  node ./prisma/seed.js || echo "⚠️ Seeding completed with warnings."
fi

echo "🚀 Starting Raadhe Academy on 0.0.0.0:${PORT:-3000}..."
exec node server.js "$@"
