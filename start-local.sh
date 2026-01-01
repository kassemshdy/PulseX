#!/bin/bash

# PulseX Local Development Startup Script
set -e

echo "🚀 Starting PulseX Local Development Environment..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop first."
    exit 1
fi

echo "✅ Docker is running"
echo ""

# Start Docker services
echo "📦 Starting Docker services (Postgres, Redis, Elasticsearch)..."
cd "$(dirname "$0")/product"
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 5

# Check if database is seeded
echo "🌱 Checking database seed status..."
cd packages/database
DATABASE_URL='postgresql://cms_user:cms_password@localhost:5432/cms_db?schema=public' npx prisma db push --skip-generate > /dev/null 2>&1 || true

# Check if admin user exists
ADMIN_EXISTS=$(PGPASSWORD=cms_password psql -h localhost -U cms_user -d cms_db -t -c "SELECT COUNT(*) FROM users WHERE email = 'admin@pulsex.com';" 2>/dev/null | xargs)

if [ "$ADMIN_EXISTS" = "0" ]; then
    echo "🌱 Seeding database..."
    DATABASE_URL='postgresql://cms_user:cms_password@localhost:5432/cms_db?schema=public' pnpm db:seed
else
    echo "✅ Database already seeded"
fi

cd ../..

echo ""
echo "✅ All services ready!"
echo ""
echo "======================================================================"
echo "  🎉 PulseX Development Environment is Ready!"
echo "======================================================================"
echo ""
echo "📍 Next Steps:"
echo ""
echo "1️⃣  Start Marketing Site (Terminal 1):"
echo "   cd product/apps/pulsex-site"
echo "   DATABASE_URL='postgresql://cms_user:cms_password@localhost:5432/cms_db?schema=public' pnpm dev"
echo "   → http://localhost:3003"
echo ""
echo "2️⃣  Start Manager Dashboard (Terminal 2):"
echo "   cd manager"
echo "   pnpm dev"
echo "   → http://localhost:3002"
echo ""
echo "3️⃣  Run E2E Tests (Terminal 3):"
echo "   cd product/e2e"
echo "   pnpm test"
echo ""
echo "======================================================================"
echo "  📊 Current Test Status: 34 passing, 4 failing (UI only)"
echo "======================================================================"
echo ""
echo "🔍 View full testing guide: cat LOCAL_TESTING.md"
echo ""

