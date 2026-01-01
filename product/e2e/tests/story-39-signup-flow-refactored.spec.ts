import { test, expect } from '@playwright/test';
import { cleanupTestData, cleanupTestSubscription } from '../utils/database-helpers';
import { 
  createTestUser, 
  checkEmailAvailability, 
  checkSubdomainAvailability,
  verifyUserExists,
  verifySubscriptionExists
} from '../utils/service-helpers';
import { TEST_USERS, RESERVED_SUBDOMAINS } from '../fixtures/test-data';
import { generateRandomEmail, generateRandomSubdomain } from '../utils/test-helpers';

test.describe('Story 39: User Signup Flow (Using Services)', () => {
  const testUser = TEST_USERS.user1;

  test.afterEach(async () => {
    // Cleanup uses direct Prisma - this is test utility, not application logic
    await cleanupTestData(testUser.email);
    await cleanupTestSubscription(testUser.subdomain);
  });

  test('should successfully sign up a new user via UI', async ({ page }) => {
    await page.goto('/signup');
    
    const email = generateRandomEmail();
    const subdomain = generateRandomSubdomain();

    await page.fill('input[name="email"], input[type="email"]', email);
    await page.fill('input[name="password"], input[type="password"]', testUser.password);
    await page.fill('input[name="siteName"]', 'E2E Test Site');
    await page.fill('input[name="subdomain"]', subdomain);

    await page.click('button[type="submit"], button:has-text("Sign")');

    // Should redirect or show success
    await page.waitForTimeout(2000);

    // Verify using services (not direct Prisma)
    const user = await verifyUserExists(email);
    const subscription = await verifySubscriptionExists(subdomain);

    expect(user).not.toBeNull();
    expect(subscription).not.toBeNull();
    expect(user?.subscriptionId).toBe(subscription?.id);

    // Cleanup
    await cleanupTestData(email);
    await cleanupTestSubscription(subdomain);
  });

  test('should check email availability using service layer', async () => {
    const email = generateRandomEmail();
    
    // First check should return true (available)
    const isAvailable = await checkEmailAvailability(email);
    expect(isAvailable).toBe(true);

    // Create user using service (not direct Prisma)
    const subdomain = generateRandomSubdomain();
    await createTestUser({
      email,
      password: testUser.password,
      siteName: 'Test Site',
      subdomain,
    });

    // Second check should return false (not available)
    const isStillAvailable = await checkEmailAvailability(email);
    expect(isStillAvailable).toBe(false);

    // Cleanup
    await cleanupTestData(email);
    await cleanupTestSubscription(subdomain);
  });

  test('should check subdomain availability using service layer', async () => {
    const subdomain = generateRandomSubdomain();
    
    // First check should return true (available)
    const isAvailable = await checkSubdomainAvailability(subdomain);
    expect(isAvailable).toBe(true);

    // Create user using service (not direct Prisma)
    const email = generateRandomEmail();
    await createTestUser({
      email,
      password: testUser.password,
      siteName: 'Test Site',
      subdomain,
    });

    // Second check should return false (not available)
    const isStillAvailable = await checkSubdomainAvailability(subdomain);
    expect(isStillAvailable).toBe(false);

    // Cleanup
    await cleanupTestData(email);
    await cleanupTestSubscription(subdomain);
  });

  test('should reject reserved subdomains using service layer', async () => {
    for (const reservedSubdomain of RESERVED_SUBDOMAINS.slice(0, 3)) {
      const isAvailable = await checkSubdomainAvailability(reservedSubdomain);
      expect(isAvailable).toBe(false);
    }
  });

  test('should create user with proper validation via service layer', async () => {
    const email = generateRandomEmail();
    const subdomain = generateRandomSubdomain();

    // Use service to create user (this includes all validation, business logic, etc.)
    const result = await createTestUser({
      email,
      password: testUser.password,
      siteName: 'Service Test Site',
      subdomain,
    });

    // Verify the service returned expected data
    expect(result.user.email).toBe(email);
    expect(result.subscription.code).toBe(subdomain);
    expect(result.accessToken).toBeTruthy();
    expect(result.refreshToken).toBeTruthy();
    expect(result.redirectUrl).toContain(subdomain);

    // Verify in database (this is verification, not the main test)
    const dbUser = await verifyUserExists(email);
    const dbSubscription = await verifySubscriptionExists(subdomain);

    expect(dbUser).not.toBeNull();
    expect(dbSubscription).not.toBeNull();
    expect(dbUser?.role).toBe('ADMIN');
    expect(dbUser?.isActive).toBe(true);

    // Cleanup
    await cleanupTestData(email);
    await cleanupTestSubscription(subdomain);
  });

  test('should reject duplicate email via service layer', async () => {
    const email = generateRandomEmail();
    const subdomain1 = generateRandomSubdomain();
    const subdomain2 = generateRandomSubdomain();

    // Create first user
    await createTestUser({
      email,
      password: testUser.password,
      siteName: 'First Site',
      subdomain: subdomain1,
    });

    // Try to create second user with same email - should throw error
    await expect(async () => {
      await createTestUser({
        email, // Same email
        password: testUser.password,
        siteName: 'Second Site',
        subdomain: subdomain2, // Different subdomain
      });
    }).rejects.toThrow(/already registered|already exists/i);

    // Cleanup
    await cleanupTestData(email);
    await cleanupTestSubscription(subdomain1);
  });

  test('should reject duplicate subdomain via service layer', async () => {
    const email1 = generateRandomEmail();
    const email2 = generateRandomEmail();
    const subdomain = generateRandomSubdomain();

    // Create first user
    await createTestUser({
      email: email1,
      password: testUser.password,
      siteName: 'First Site',
      subdomain,
    });

    // Try to create second user with same subdomain - should throw error
    await expect(async () => {
      await createTestUser({
        email: email2, // Different email
        password: testUser.password,
        siteName: 'Second Site',
        subdomain, // Same subdomain
      });
    }).rejects.toThrow(/already taken|not available/i);

    // Cleanup
    await cleanupTestData(email1);
    await cleanupTestData(email2);
    await cleanupTestSubscription(subdomain);
  });
});

