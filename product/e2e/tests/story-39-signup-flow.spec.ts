import { test, expect } from '@playwright/test';
import { cleanupTestData } from '../utils/database-helpers';
import { 
  createTestUser, 
  checkEmailAvailability,
  verifyUserExists
} from '../utils/service-helpers';
import { TEST_USERS } from '../fixtures/test-data';
import { generateRandomEmail } from '../utils/test-helpers';

test.describe('Story 39: User Signup Flow (Using Services)', () => {
  const testUser = TEST_USERS.user1;

  test.afterEach(async () => {
    // Cleanup uses direct Prisma - this is test utility, not application logic
    await cleanupTestData(testUser.email);
  });

  test('should successfully sign up a new user via UI', async ({ page }) => {
    await page.goto('/signup');
    
    const email = generateRandomEmail();

    await page.fill('input[name="email"], input[type="email"]', email);
    await page.fill('input[name="password"], input[type="password"]', testUser.password);
    await page.fill('input[name="siteName"]', 'E2E Test Site');

    await page.click('button[type="submit"], button:has-text("Sign")');

    // Should redirect to admin panel
    await page.waitForURL('http://localhost:3000', { timeout: 10000 });

    // Verify using services (not direct Prisma)
    const user = await verifyUserExists(email);

    expect(user).not.toBeNull();

    // Cleanup
    await cleanupTestData(email);
  });

  test('should check email availability using service layer', async () => {
    const email = generateRandomEmail();
    
    // First check should return true (available)
    const isAvailable = await checkEmailAvailability(email);
    expect(isAvailable).toBe(true);

    // Create user using service (not direct Prisma)
    await createTestUser({
      email,
      password: testUser.password,
      siteName: 'Test Site',
    });

    // Second check should return false (not available)
    const isStillAvailable = await checkEmailAvailability(email);
    expect(isStillAvailable).toBe(false);

    // Cleanup
    await cleanupTestData(email);
  });

  test('should create user with proper validation via service layer', async () => {
    const email = generateRandomEmail();

    // Use service to create user (this includes all validation, business logic, etc.)
    const result = await createTestUser({
      email,
      password: testUser.password,
      siteName: 'Service Test Site',
    });

    // Verify the service returned expected data
    expect(result.user.email).toBe(email);
    expect(result.subscription.code).toBeTruthy(); // Auto-generated
    expect(result.accessToken).toBeTruthy();
    expect(result.refreshToken).toBeTruthy();
    expect(result.redirectUrl).toBe('http://localhost:3000');

    // Verify in database (this is verification, not the main test)
    const dbUser = await verifyUserExists(email);

    expect(dbUser).not.toBeNull();
    expect(dbUser?.role).toBe('ADMIN');
    expect(dbUser?.isActive).toBe(true);

    // Cleanup
    await cleanupTestData(email);
  });

  test('should reject duplicate email via service layer', async () => {
    const email = generateRandomEmail();

    // Create first user
    await createTestUser({
      email,
      password: testUser.password,
      siteName: 'First Site',
    });

    // Try to create second user with same email - should throw error
    await expect(async () => {
      await createTestUser({
        email, // Same email
        password: testUser.password,
        siteName: 'Second Site',
      });
    }).rejects.toThrow(/already registered|already exists/i);

    // Cleanup
    await cleanupTestData(email);
  });
});

