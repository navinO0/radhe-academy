#!/bin/sh
set -e

# Check and run database migrations and optional seeder on startup
if [ -n "$DATABASE_URL" ] && [ "$DATABASE_URL" != "postgresql://postgres:postgres@localhost:5432/dummy" ]; then
  echo "⏳ Checking database connection and applying migrations..."
  MAX_RETRIES=15
  RETRY_COUNT=0

  until prisma migrate deploy || [ $RETRY_COUNT -ge $MAX_RETRIES ]; do
    RETRY_COUNT=$((RETRY_COUNT + 1))
    echo "Database not ready (attempt $RETRY_COUNT/$MAX_RETRIES)... retrying in 3s"
    sleep 3
  done

  if [ $RETRY_COUNT -lt $MAX_RETRIES ]; then
    echo "✅ Database migrations applied successfully."

    # Seeder checks database state itself: runs if seed data is missing, skips if already seeded
    if [ "$SKIP_SEED" = "true" ]; then
      echo "ℹ️ Seeding skipped (SKIP_SEED=true)."
    else
      echo "🌱 Checking database seed state (auto-skips if already seeded)..."
      if [ -f "./prisma/seed.js" ]; then
        node ./prisma/seed.js || echo "⚠️ Seeding finished with warning."
      else
        echo "⚠️ ./prisma/seed.js not found. Skipping seed."
      fi
    fi
  else
    echo "⚠️ Warning: Database was not reachable after $MAX_RETRIES attempts. Starting server..."
  fi
fi

echo "🚀 Starting Next.js application on port ${PORT:-3000}..."
exec node server.js
