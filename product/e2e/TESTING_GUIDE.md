# E2E Testing Guide: Services vs Direct Database Access

## 🎯 The Golden Rule

> **Test through the same layers your application uses in production.**

If your application uses services, your tests should use services. Only bypass the services layer for test utilities.

## 🏗️ Architecture Layers

```
┌─────────────────────────────────────┐
│         UI (Next.js Pages)          │  ← Playwright tests this
├─────────────────────────────────────┤
│      API Routes (route.ts)          │  ← Calls services
├─────────────────────────────────────┤
│    Services Layer (@cms/services)   │  ← ✅ Tests should use this
├─────────────────────────────────────┤
│    Database (@cms/database/Prisma)  │  ← ⚠️ Only for utilities
└─────────────────────────────────────┘
```

## ✅ When to Use Services

### User Operations (Always Use Services)

```typescript
import { createTestUser } from '../utils/service-helpers';

// ✅ GOOD: Tests the real signup flow
test('should sign up user', async () => {
  const result = await createTestUser({
    email: 'test@example.com',
    password: 'Test123',
    siteName: 'Test',
    subdomain: 'test',
  });
  
  expect(result.user).toBeDefined();
  expect(result.accessToken).toBeTruthy();
});
```

**What this tests:**
- ✅ Password hashing (bcrypt)
- ✅ Email validation
- ✅ Subdomain validation
- ✅ JWT token generation
- ✅ Transaction handling
- ✅ Error messages
- ✅ Business logic

### Validation (Always Use Services)

```typescript
import { checkEmailAvailability } from '../utils/service-helpers';

// ✅ GOOD: Tests the real validation logic
test('should check email availability', async () => {
  const isAvailable = await checkEmailAvailability('test@example.com');
  expect(isAvailable).toBe(true);
});
```

**What this tests:**
- ✅ Email format validation
- ✅ Database uniqueness check
- ✅ Error handling

## ⚠️ When to Use Direct Prisma

### Test Cleanup (OK to use Prisma)

```typescript
import { prisma } from '../utils/database-helpers';

// ✅ GOOD: Cleanup is a test utility, not application logic
test.afterEach(async () => {
  await prisma.user.deleteMany({
    where: { email: { contains: 'test@' } }
  });
});
```

### Database Verification (OK to use Prisma)

```typescript
import { createTestUser } from '../utils/service-helpers';
import { prisma } from '../utils/database-helpers';

// ✅ GOOD: Create via service, verify via Prisma
test('should create user with correct role', async () => {
  const result = await createTestUser({ /* ... */ });
  
  // Verify in database
  const dbUser = await prisma.user.findFirst({
    where: { id: result.user.id }
  });
  
  expect(dbUser?.role).toBe('ADMIN');
});
```

### Testing Database Schema (OK to use Prisma)

```typescript
// ✅ GOOD: Testing the database itself
test('should have User table', async () => {
  const count = await prisma.user.count();
  expect(count).toBeGreaterThanOrEqual(0);
});
```

## ❌ Anti-Patterns

### ❌ BAD: Creating Users with Direct Prisma

```typescript
// ❌ BAD: Bypasses all business logic
test('should create user', async () => {
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      passwordHash: 'plaintext', // Not hashed!
      role: 'ADMIN',
      subscriptionId: 'some-id',
    }
  });
});
```

**Problems:**
- ❌ Password not hashed
- ❌ No email validation
- ❌ No JWT tokens generated
- ❌ No subscription validation
- ❌ Not testing real flow

### ❌ BAD: Validation with Direct Prisma

```typescript
// ❌ BAD: Bypasses validation logic
test('should check email exists', async () => {
  const user = await prisma.user.findFirst({
    where: { email: 'test@example.com' }
  });
  expect(user).toBeNull();
});
```

**Problems:**
- ❌ Not testing the validation service
- ❌ Missing email format validation
- ❌ Missing reserved email checks
- ❌ Not testing error messages

## 🎓 Real-World Examples

### Example 1: Signup Flow

```typescript
import { createTestUser, verifyUserExists } from '../utils/service-helpers';
import { cleanupTestData } from '../utils/database-helpers';

test('should complete full signup flow', async () => {
  // 1. Create user via service (tests real flow)
  const result = await createTestUser({
    email: 'user@example.com',
    password: 'SecurePass123',
    siteName: 'My Site',
    subdomain: 'mysite',
  });
  
  // 2. Verify service returned correct data
  expect(result.user.email).toBe('user@example.com');
  expect(result.subscription.code).toBe('mysite');
  expect(result.accessToken).toBeTruthy();
  expect(result.redirectUrl).toContain('mysite.pulsex.com');
  
  // 3. Verify in database (optional additional check)
  const dbUser = await verifyUserExists('user@example.com');
  expect(dbUser?.role).toBe('ADMIN');
  expect(dbUser?.isActive).toBe(true);
  
  // 4. Cleanup (test utility)
  await cleanupTestData('user@example.com');
});
```

### Example 2: Duplicate Email Check

```typescript
import { createTestUser, checkEmailAvailability } from '../utils/service-helpers';

test('should reject duplicate emails', async () => {
  const email = 'duplicate@example.com';
  
  // 1. Create first user
  await createTestUser({
    email,
    password: 'Test123',
    siteName: 'First Site',
    subdomain: 'firstsite',
  });
  
  // 2. Check availability (should be false)
  const isAvailable = await checkEmailAvailability(email);
  expect(isAvailable).toBe(false);
  
  // 3. Try to create duplicate (should throw)
  await expect(async () => {
    await createTestUser({
      email,
      password: 'Test456',
      siteName: 'Second Site',
      subdomain: 'secondsite',
    });
  }).rejects.toThrow(/already registered/i);
});
```

### Example 3: UI + Services Integration

```typescript
import { verifyUserExists } from '../utils/service-helpers';

test('should sign up via UI and verify in database', async ({ page }) => {
  // 1. Fill form in UI (tests UI layer)
  await page.goto('/signup');
  await page.fill('input[name="email"]', 'ui@example.com');
  await page.fill('input[name="password"]', 'Test123');
  await page.fill('input[name="siteName"]', 'UI Test');
  await page.fill('input[name="subdomain"]', 'uitest');
  await page.click('button[type="submit"]');
  
  // 2. Wait for success
  await page.waitForTimeout(2000);
  
  // 3. Verify using service helper (reads from DB)
  const user = await verifyUserExists('ui@example.com');
  expect(user).not.toBeNull();
  expect(user?.subscription.code).toBe('uitest');
});
```

## 📋 Quick Reference

| Operation | Use | Don't Use |
|-----------|-----|-----------|
| Create user | `createTestUser()` | `prisma.user.create()` |
| Check email | `checkEmailAvailability()` | `prisma.user.findFirst()` |
| Check subdomain | `checkSubdomainAvailability()` | `prisma.subscription.findUnique()` |
| Login | `validateCredentials()` | Direct password check |
| Cleanup | `prisma.user.delete()` | ✅ OK for test utility |
| Verify data | `verifyUserExists()` | ✅ OK, but use helper |
| Test schema | `prisma.user.count()` | ✅ OK for database tests |

## 🚀 Benefits of Using Services

1. **Test Real Code** - You test what users experience
2. **Better Coverage** - Business logic, validation, error handling
3. **Catch Bugs Early** - Service changes are caught by tests
4. **Maintainable** - Tests update when services update
5. **Documentation** - Tests show how to use services correctly

## 🎯 Summary

- ✅ **DO** use services for all application operations
- ✅ **DO** use Prisma for test cleanup and verification
- ❌ **DON'T** use Prisma to bypass application logic
- ❌ **DON'T** duplicate business logic in tests

**Remember:** If your app uses services, your tests should too!

---

**Questions?** Check the [README.md](./README.md) or review the [service-helpers.ts](./utils/service-helpers.ts) file.

