# 🧪 Local Testing Guide

## Prerequisites

Make sure Docker services are running:
```bash
cd /Users/kassemshehady/Documents/typscripts/2026/product
docker-compose up -d
```

Check services are healthy:
```bash
docker-compose ps
```

## 1. Start the Marketing Site (PulseX.com)

```bash
cd /Users/kassemshehady/Documents/typscripts/2026/product/apps/pulsex-site
DATABASE_URL='postgresql://cms_user:cms_password@localhost:5432/cms_db?schema=public' pnpm dev
```

**Access at:** http://localhost:3003

### What to Test:
- ✅ Homepage loads
- ✅ Responsive design (mobile/tablet/desktop)
- ✅ Signup form (email, password, website name - NO subdomain field)
- ✅ Email validation
- ✅ Signup flow redirects to admin panel

## 2. Start the Admin Panel (NEW!)

```bash
cd /Users/kassemshehady/Documents/typscripts/2026/product/apps/admin-panel
pnpm install  # First time only
DATABASE_URL='postgresql://cms_user:cms_password@localhost:5432/cms_db?schema=public' pnpm dev
```

**Access at:** http://localhost:3000

### What to Test:
- ✅ Dashboard loads after signup
- ✅ All menu items are accessible
- ✅ Can navigate to post types, posts, media, settings
- ✅ Authentication is working

## 3. Start the Project Manager Dashboard

```bash
cd /Users/kassemshehady/Documents/typscripts/2026/manager
pnpm dev
```

**Access at:** http://localhost:3002

### What to Test:
- ✅ View all epics and stories
- ✅ Filter by status (pending/in-progress/done)
- ✅ Check story details
- ✅ Track progress

## 4. Run E2E Tests

### All Tests
```bash
cd /Users/kassemshehady/Documents/typscripts/2026/product/e2e
pnpm test
```

### Specific Test Suites
```bash
# Database tests only
pnpm test story-1-database-setup

# Marketing site tests only
pnpm test story-38-marketing-site

# Signup flow tests only
pnpm test story-39-signup-flow
```

### Run in UI Mode (Interactive)
```bash
pnpm test:ui
```

### Run in Headed Mode (See Browser)
```bash
pnpm test:headed
```

## 5. API Endpoints to Test

### Check Email Availability
```bash
curl -X POST http://localhost:3003/api/auth/check-email \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

### Signup (Create Account)
```bash
curl -X POST http://localhost:3003/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email":"newuser@example.com",
    "password":"Test123456",
    "siteName":"My Test Site"
  }'
```

**Note:** Subdomain is now auto-generated! No need to provide it.

## 6. Database Access

### Using Prisma Studio (GUI)
```bash
cd /Users/kassemshehady/Documents/typscripts/2026/product/packages/database
DATABASE_URL='postgresql://cms_user:cms_password@localhost:5432/cms_db?schema=public' npx prisma studio
```

**Access at:** http://localhost:5555

### Using psql (CLI)
```bash
PGPASSWORD=cms_password psql -h localhost -U cms_user -d cms_db

# Example queries:
SELECT email, role, "isActive" FROM users;
SELECT code, name, master FROM subscriptions;
SELECT name, slug FROM post_types;
```

## 7. View Test Reports

After running tests:
```bash
cd /Users/kassemshehady/Documents/typscripts/2026/product/e2e
pnpm report
```

## Current Test Status

✅ **All core tests should pass!**
- Database schema and migrations
- Seed data (admin user, post types, taxonomies, etc.)
- API endpoints (email checks)
- Duplicate email validation
- Service layer functionality
- Signup flow (simplified - no subdomain selection)

## Recent Changes

### ✨ Simplified Signup Flow
- **Removed:** Subdomain selection field
- **Added:** Auto-generation of subdomains (based on email + timestamp)
- **Redirect:** After signup, users go to admin panel at `http://localhost:3000`
- **New App:** Admin panel created at `/product/apps/admin-panel`

### Known Issues

None! The simplified flow should work smoothly.

## Quick Commands Reference

```bash
# Reset database
cd /Users/kassemshehady/Documents/typscripts/2026/product/packages/database
DATABASE_URL='postgresql://cms_user:cms_password@localhost:5432/cms_db?schema=public' npx prisma db push --force-reset

# Re-seed database
DATABASE_URL='postgresql://cms_user:cms_password@localhost:5432/cms_db?schema=public' pnpm db:seed

# Check Docker services
docker-compose ps
docker-compose logs postgres
docker-compose logs redis
docker-compose logs elasticsearch

# Stop all Docker services
docker-compose down
```

## Testing Checklist

- [ ] Docker services running (postgres, redis, elasticsearch)
- [ ] Database seeded with initial data
- [ ] Marketing site accessible at localhost:3003
- [ ] Admin panel accessible at localhost:3000 (NEW!)
- [ ] Manager dashboard accessible at localhost:3002
- [ ] Can signup new user via UI (only email, password, siteName)
- [ ] Signup redirects to admin panel at localhost:3000
- [ ] No subdomain field in signup form
- [ ] API endpoints respond correctly
- [ ] E2E tests passing
- [ ] No console errors in browser

## Need Help?

1. **Database connection issues**: Check Docker is running
2. **Port conflicts**: Make sure no other apps use 3002, 3003, 5432, 6379, 9200
3. **Module not found**: Run `pnpm install` in the affected package
4. **Prisma errors**: Regenerate client with `pnpm --filter @cms/database prisma:generate`

