#!/bin/sh
set -e

# Check and run database migrations and seeder on startup
if [ -n "$DATABASE_URL" ] && [ "$DATABASE_URL" != "postgresql://postgres:postgres@localhost:5432/dummy" ]; then
  echo "⏳ Checking database connection and applying migrations..."
  MAX_RETRIES=15
  RETRY_COUNT=0

  until prisma migrate deploy || node ./node_modules/prisma/build/index.js migrate deploy || [ $RETRY_COUNT -ge $MAX_RETRIES ]; do
    RETRY_COUNT=$((RETRY_COUNT + 1))
    echo "Database not ready (attempt $RETRY_COUNT/$MAX_RETRIES)... retrying in 3s"
    sleep 3
  done

  if [ $RETRY_COUNT -lt $MAX_RETRIES ]; then
    echo "✅ Database migrations applied successfully."
    echo "🌱 Running database seeder..."
    if [ -f "./prisma/seed.js" ]; then
      node ./prisma/seed.js || echo "⚠️ Seeding finished with warning."
    fi
  else
    echo "⚠️ Warning: Database was not reachable after $MAX_RETRIES attempts. Starting server..."
  fi
fi

echo "🚀 Starting Next.js application on port ${PORT:-3005}..."
exec node server.js
