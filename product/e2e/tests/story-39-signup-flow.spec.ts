import { test, expect } from '@playwright/test';
import { cleanupTestData, cleanupTestSubscription } from '../utils/database-helpers';
import { TEST_USERS, RESERVED_SUBDOMAINS, INVALID_EMAILS, INVALID_PASSWORDS, INVALID_SUBDOMAINS } from '../fixtures/test-data';
import { generateRandomEmail, generateRandomSubdomain } from '../utils/test-helpers';

test.describe('Story 39: User Signup Flow', () => {
  const testUser = TEST_USERS.user1;

  test.beforeEach(async ({ page }) => {
    await page.goto('/signup');
  });

  test.afterEach(async () => {
    // Cleanup test data after each test
    await cleanupTestData(testUser.email);
    await cleanupTestSubscription(testUser.subdomain);
  });

  test('should display signup form with all required fields', async ({ page }) => {
    await expect(page.locator('input[name="email"], input[type="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"], input[type="password"]')).toBeVisible();
    await expect(page.locator('input[name="siteName"]')).toBeVisible();
    await expect(page.locator('input[name="subdomain"]')).toBeVisible();
    await expect(page.locator('button[type="submit"], button').filter({ hasText: /sign up|create|register/i })).toBeVisible();
  });

  test('should successfully sign up a new user', async ({ page }) => {
    const email = generateRandomEmail();
    const subdomain = generateRandomSubdomain();

    await page.fill('input[name="email"], input[type="email"]', email);
    await page.fill('input[name="password"], input[type="password"]', testUser.password);
    await page.fill('input[name="siteName"]', 'E2E Test Site');
    await page.fill('input[name="subdomain"]', subdomain);

    await page.click('button[type="submit"], button:has-text("Sign")');

    // Should redirect or show success
    await page.waitForTimeout(2000);

    // Check for success indicators (redirect, success message, or new URL)
    const currentUrl = page.url();
    const hasSuccessMessage = await page.locator('text=/success|welcome|created/i').isVisible().catch(() => false);
    const hasRedirected = currentUrl !== 'http://localhost:3003/signup';

    expect(hasSuccessMessage || hasRedirected).toBe(true);

    // Cleanup
    await cleanupTestData(email);
    await cleanupTestSubscription(subdomain);
  });

  test('should validate email format in real-time', async ({ page }) => {
    const emailInput = page.locator('input[name="email"], input[type="email"]');
    
    await emailInput.fill('invalid-email');
    await emailInput.blur();

    // Check for error message or invalid state
    await page.waitForTimeout(500);
    
    const hasError = await page.locator('text=/invalid.*email|valid.*email/i').isVisible().catch(() => false);
    const hasInvalidAttribute = await emailInput.evaluate(el => (el as HTMLInputElement).validity.valid === false);

    expect(hasError || hasInvalidAttribute).toBe(true);
  });

  test('should validate subdomain availability in real-time', async ({ page }) => {
    const subdomainInput = page.locator('input[name="subdomain"]');
    
    await subdomainInput.fill('testsite123');
    await subdomainInput.blur();

    // Wait for API call
    await page.waitForTimeout(1000);

    // Should show available or unavailable status
    const hasAvailabilityIndicator = await page.locator('text=/available|taken|check/i').isVisible().catch(() => false);
    expect(hasAvailabilityIndicator).toBe(true);
  });

  test('should block reserved subdomains', async ({ page }) => {
    const subdomainInput = page.locator('input[name="subdomain"]');
    
    // Try a reserved subdomain
    await subdomainInput.fill(RESERVED_SUBDOMAINS[0]); // 'www'
    await subdomainInput.blur();

    await page.waitForTimeout(1000);

    // Should show error
    const hasError = await page.locator('text=/reserved|cannot.*use|not.*available/i').isVisible().catch(() => false);
    expect(hasError).toBe(true);
  });

  test('should validate password strength', async ({ page }) => {
    const passwordInput = page.locator('input[name="password"], input[type="password"]');
    
    // Try weak password
    await passwordInput.fill('weak');
    await passwordInput.blur();

    await page.waitForTimeout(500);

    // Should show password strength indicator or error
    const hasStrengthIndicator = await page.locator('text=/weak|strong|strength|8.*character/i').isVisible().catch(() => false);
    expect(hasStrengthIndicator).toBe(true);
  });

  test('should reject duplicate email', async ({ page }) => {
    // First, create a user
    const email = generateRandomEmail();
    const subdomain1 = generateRandomSubdomain();

    await page.fill('input[name="email"], input[type="email"]', email);
    await page.fill('input[name="password"], input[type="password"]', testUser.password);
    await page.fill('input[name="siteName"]', 'First Site');
    await page.fill('input[name="subdomain"]', subdomain1);
    await page.click('button[type="submit"], button:has-text("Sign")');

    await page.waitForTimeout(2000);

    // Try to sign up again with same email
    await page.goto('/signup');
    const subdomain2 = generateRandomSubdomain();

    await page.fill('input[name="email"], input[type="email"]', email);
    await page.fill('input[name="password"], input[type="password"]', testUser.password);
    await page.fill('input[name="siteName"]', 'Second Site');
    await page.fill('input[name="subdomain"]', subdomain2);
    await page.click('button[type="submit"], button:has-text("Sign")');

    await page.waitForTimeout(2000);

    // Should show error
    const hasError = await page.locator('text=/already.*registered|email.*exists|already.*use/i').isVisible().catch(() => false);
    expect(hasError).toBe(true);

    // Cleanup
    await cleanupTestData(email);
    await cleanupTestSubscription(subdomain1);
    await cleanupTestSubscription(subdomain2);
  });

  test('should reject duplicate subdomain', async ({ page }) => {
    // First, create a user
    const email1 = generateRandomEmail();
    const subdomain = generateRandomSubdomain();

    await page.fill('input[name="email"], input[type="email"]', email1);
    await page.fill('input[name="password"], input[type="password"]', testUser.password);
    await page.fill('input[name="siteName"]', 'First Site');
    await page.fill('input[name="subdomain"]', subdomain);
    await page.click('button[type="submit"], button:has-text("Sign")');

    await page.waitForTimeout(2000);

    // Try to sign up with different email but same subdomain
    await page.goto('/signup');
    const email2 = generateRandomEmail();

    await page.fill('input[name="email"], input[type="email"]', email2);
    await page.fill('input[name="password"], input[type="password"]', testUser.password);
    await page.fill('input[name="siteName"]', 'Second Site');
    await page.fill('input[name="subdomain"]', subdomain);
    await page.click('button[type="submit"], button:has-text("Sign")');

    await page.waitForTimeout(2000);

    // Should show error
    const hasError = await page.locator('text=/already.*taken|subdomain.*use|not.*available/i').isVisible().catch(() => false);
    expect(hasError).toBe(true);

    // Cleanup
    await cleanupTestData(email1);
    await cleanupTestData(email2);
    await cleanupTestSubscription(subdomain);
  });

  test('should validate subdomain format (alphanumeric and hyphens only)', async ({ page }) => {
    const subdomainInput = page.locator('input[name="subdomain"]');
    
    // Try invalid subdomain with underscore
    await subdomainInput.fill('test_site');
    await subdomainInput.blur();

    await page.waitForTimeout(500);

    // Should show format error
    const hasError = await page.locator('text=/alphanumeric|characters.*only|invalid.*format/i').isVisible().catch(() => false);
    expect(hasError).toBe(true);
  });

  test('should enforce minimum subdomain length (3 characters)', async ({ page }) => {
    const subdomainInput = page.locator('input[name="subdomain"]');
    
    await subdomainInput.fill('ab');
    await subdomainInput.blur();

    await page.waitForTimeout(500);

    // Should show length error
    const hasError = await page.locator('text=/3.*character|too.*short|minimum/i').isVisible().catch(() => false);
    expect(hasError).toBe(true);
  });

  test('should enforce maximum subdomain length (20 characters)', async ({ page }) => {
    const subdomainInput = page.locator('input[name="subdomain"]');
    
    await subdomainInput.fill('thissubdomainiswaytoolong123');
    await subdomainInput.blur();

    await page.waitForTimeout(500);

    // Should show length error
    const hasError = await page.locator('text=/20.*character|too.*long|maximum/i').isVisible().catch(() => false);
    expect(hasError).toBe(true);
  });

  test('should create user and subscription in database', async ({ page }) => {
    const email = generateRandomEmail();
    const subdomain = generateRandomSubdomain();

    await page.fill('input[name="email"], input[type="email"]', email);
    await page.fill('input[name="password"], input[type="password"]', testUser.password);
    await page.fill('input[name="siteName"]', 'Database Test Site');
    await page.fill('input[name="subdomain"]', subdomain);
    await page.click('button[type="submit"], button:has-text("Sign")');

    await page.waitForTimeout(3000);

    // Verify in database
    const { prisma } = await import('../utils/database-helpers');
    const user = await prisma.user.findFirst({ where: { email } });
    const subscription = await prisma.subscription.findUnique({ where: { code: subdomain } });

    expect(user).not.toBeNull();
    expect(subscription).not.toBeNull();
    expect(user?.subscriptionId).toBe(subscription?.id);

    // Cleanup
    await cleanupTestData(email);
    await cleanupTestSubscription(subdomain);
  });
});

