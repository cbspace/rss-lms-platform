#!/bin/bash
set -e  # Exit immediately if any command fails

echo "⏳ Waiting for PostgreSQL to be available..."
/app/wait-for-it.sh postgres:5432 --timeout=30 --strict -- echo "✅ Postgres is up"

echo "🚀 Applying pending database migrations..."
npx prisma migrate deploy

echo "🔥 Starting API Server..."
exec "$@"
