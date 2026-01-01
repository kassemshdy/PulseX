# E2E Testing with Playwright

This folder contains end-to-end tests for the PulseX CMS platform using Playwright.

## 🎯 Testing Philosophy

### Two Types of Test Access:

#### 1. **Services Layer** (Preferred for Application Logic)
Use services from `@cms/services` for testing real application flows:
- ✅ User signup and authentication
- ✅ Email/subdomain validation
- ✅ Content creation and management
- ✅ All business logic operations

**Why?** Tests the actual code paths users experience, including validation, error handling, and business logic.

#### 2. **Direct Prisma** (Only for Test Utilities)
Use direct Prisma access only for:
- 🧹 Test cleanup (deleting test data)
- ✅ Database verification (checking records exist)
- 🔍 Testing database schema itself (migrations, seed data)

**Why?** These are test utilities, not application operations.

## 📁 Structure

```
e2e/
├── fixtures/          # Test data and constants
│   └── test-data.ts   # Test users, invalid data sets
├── utils/             # Test utilities
│   ├── database-helpers.ts  # Prisma utilities (cleanup, verification)
│   ├── service-helpers.ts   # Services layer helpers (preferred)
│   └── test-helpers.ts      # UI interaction helpers
├── tests/             # Test suites
│   ├── story-1-database-setup.spec.ts      # Database schema tests
│   ├── story-38-marketing-site.spec.ts     # Marketing site UI tests
│   └── story-39-signup-flow.spec.ts        # Signup flow tests (uses services)
├── package.json
├── playwright.config.ts
└── tsconfig.json
```

## 🚀 Running Tests

### Prerequisites

1. **Start Docker services** (PostgreSQL, Redis, Elasticsearch):
```bash
cd ../
docker-compose up -d postgres redis elasticsearch
```

2. **Generate Prisma Client**:
```bash
pnpm prisma:generate
```

### Run All Tests

```bash
pnpm test
```

### Run Specific Test Suite

```bash
pnpm test story-39-signup-flow
```

### Run in Headed Mode (See Browser)

```bash
pnpm test:headed
```

### Run in UI Mode (Interactive)

```bash
pnpm test:ui
```

### Debug Tests

```bash
pnpm test:debug
```

### View Test Report

```bash
pnpm report
```

## 📝 Writing Tests

### ✅ GOOD: Using Services Layer

```typescript
import { createTestUser, checkEmailAvailability } from '../utils/service-helpers';

test('should create user via service', async () => {
  // Uses the real AuthService.signup() method
  const result = await createTestUser({
    email: 'test@example.com',
    password: 'Test123',
    siteName: 'Test Site',
    subdomain: 'testsite',
  });
  
  expect(result.user.email).toBe('test@example.com');
  expect(result.accessToken).toBeTruthy();
});
```

### ❌ BAD: Direct Prisma for Application Logic

```typescript
import { prisma } from '../utils/database-helpers';

test('should create user', async () => {
  // BAD: Bypasses validation, password hashing, JWT generation, etc.
  const user = await prisma.user.create({
    data: { email: 'test@example.com', passwordHash: 'plaintext' }
  });
});
```

### ✅ GOOD: Direct Prisma for Verification

```typescript
import { prisma } from '../utils/database-helpers';
import { createTestUser } from '../utils/service-helpers';

test('should create user with correct role', async () => {
  // Create using service (real flow)
  const result = await createTestUser({ /* ... */ });
  
  // Verify using Prisma (checking database state)
  const dbUser = await prisma.user.findFirst({
    where: { email: result.user.email }
  });
  
  expect(dbUser?.role).toBe('ADMIN');
});
```

## 🧪 Test Suites

### Story 1: Database Setup (12 tests)
Tests database schema, migrations, and seed data using direct Prisma.

**Why Prisma here?** We're testing the database itself, not application logic.

### Story 38: Marketing Site (13 tests)
Tests the marketing homepage UI using Playwright browser automation.

### Story 39: Signup Flow (7+ tests)
Tests user signup using **services layer** + UI tests.

**Examples:**
- ✅ Create user via `authService.signup()`
- ✅ Check email via `authService.checkEmailAvailability()`
- ✅ Check subdomain via `subscriptionService.checkSubdomainAvailability()`

## 🔧 Configuration

### Environment Variables

Tests use these environment variables (set in `playwright.config.ts`):

```bash
DATABASE_URL=postgresql://cms_user:cms_password@localhost:5432/cms_db?schema=public
JWT_ACCESS_SECRET=test-access-secret
JWT_REFRESH_SECRET=test-refresh-secret
```

### Playwright Config

- **Workers**: 1 (sequential tests for database consistency)
- **Retries**: 0 locally, 2 in CI
- **Base URL**: http://localhost:3003
- **Timeout**: 30s per test

## 🐛 Troubleshooting

### Error: Cannot find module '.prisma/client'

**Solution:**
```bash
pnpm prisma:generate
```

### Error: Database connection failed

**Solution:**
```bash
# Start PostgreSQL
cd ..
docker-compose up -d postgres

# Run migrations
cd packages/database
pnpm prisma migrate dev
```

### Error: Port 3003 already in use

**Solution:**
```bash
# Find and kill the process
lsof -ti:3003 | xargs kill -9
```

### Tests are failing locally but pass in CI

**Solution:**
- Clear `.next` folder: `rm -rf apps/pulsex-site/.next`
- Regenerate Prisma: `pnpm prisma:generate`
- Restart Docker services
- Clean test results: `rm -rf test-results playwright-report`

## 📊 Test Coverage

Current test coverage:

- **Database Schema**: 12 tests ✅
- **Marketing Site**: 13 tests ✅
- **Signup Flow**: 7+ tests ✅
- **Total**: 32+ tests

## 🎯 Best Practices

1. **Use Services for Application Logic** - Always test through the services layer
2. **Use Prisma for Verification Only** - Check database state after service operations
3. **Clean Up After Tests** - Use `afterEach` to delete test data
4. **Random Test Data** - Use `generateRandomEmail()` and `generateRandomSubdomain()`
5. **Wait for UI Changes** - Use `waitForTimeout()` or `waitForSelector()`
6. **Test Error Cases** - Verify validation works (duplicate emails, invalid formats)
7. **Keep Tests Independent** - Each test should run in isolation

## 📚 Further Reading

- [Playwright Documentation](https://playwright.dev)
- [Testing Best Practices](https://playwright.dev/docs/best-practices)
- [Test Fixtures](https://playwright.dev/docs/test-fixtures)

## 🤝 Contributing

When adding new tests:

1. Use services layer for application operations
2. Use Prisma only for cleanup and verification
3. Add test data to `fixtures/test-data.ts`
4. Update this README with new test suites
5. Ensure tests pass both locally and in CI

---

**Happy Testing! 🧪**

