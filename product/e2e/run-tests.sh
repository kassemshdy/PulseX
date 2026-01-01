#!/bin/bash

# E2E Test Runner Script
# This script sets up and runs all E2E tests

set -e  # Exit on error

echo "🚀 Starting E2E Test Setup..."
echo ""

# Navigate to e2e directory
cd "$(dirname "$0")"

echo "📁 Current directory: $(pwd)"
echo ""

# Rename test file if needed
if [ -f "tests/story-39-signup-flow-refactored.spec.ts" ]; then
  echo "📝 Renaming refactored test file..."
  mv tests/story-39-signup-flow-refactored.spec.ts tests/story-39-signup-flow.spec.ts
  echo "✅ Test file renamed"
else
  echo "✅ Test file already renamed"
fi
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install
echo "✅ Dependencies installed"
echo ""

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
pnpm prisma:generate
echo "✅ Prisma Client generated"
echo ""

# Run tests
echo "🧪 Running E2E tests..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

DATABASE_URL="postgresql://cms_user:cms_password@localhost:5432/cms_db?schema=public" pnpm test

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Tests completed!"
echo ""
echo "📊 To view the HTML report, run:"
echo "   pnpm report"

