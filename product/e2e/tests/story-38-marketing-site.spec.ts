import { test, expect } from '@playwright/test';

test.describe('Story 38: PulseX.com Marketing Site', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load homepage successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/PulseX/i);
    await expect(page).toHaveURL('/');
  });

  test('should display hero section with main heading', async ({ page }) => {
    const heroSection = page.locator('section, div').filter({ hasText: /build.*cms|create.*website|powerful.*platform/i }).first();
    await expect(heroSection).toBeVisible();

    // Check for main heading
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();
    await expect(heading).toContainText(/.+/); // Has some text
  });

  test('should display call-to-action buttons', async ({ page }) => {
    const ctaButtons = page.locator('a, button').filter({ hasText: /sign up|get started|try|start/i });
    await expect(ctaButtons.first()).toBeVisible();
  });

  test('should display features section', async ({ page }) => {
    // Look for features section
    const featuresSection = page.locator('section, div').filter({ hasText: /features|capabilities|what.*offer/i }).first();
    
    // Count feature items (should have multiple features)
    const featureItems = page.locator('div, article').filter({ has: page.locator('h2, h3, h4') });
    const count = await featureItems.count();
    
    expect(count).toBeGreaterThanOrEqual(3); // At least 3 features
  });

  test('should display pricing section', async ({ page }) => {
    const pricingSection = page.locator('section, div').filter({ hasText: /pricing|plans|choose.*plan/i }).first();
    
    // Look for pricing cards or plans
    const pricingCards = page.locator('div, article').filter({ has: page.locator('h2, h3, h4') }).filter({ hasText: /free|pro|enterprise|starter|basic/i });
    const count = await pricingCards.count();
    
    expect(count).toBeGreaterThanOrEqual(1); // At least 1 pricing plan
  });

  test('should display footer with links', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();

    // Footer should have some navigation links
    const footerLinks = footer.locator('a');
    const linkCount = await footerLinks.count();
    expect(linkCount).toBeGreaterThan(0);
  });

  test('should have navigation to signup page', async ({ page }) => {
    const signupLink = page.locator('a').filter({ hasText: /sign up|get started|register/i }).first();
    await expect(signupLink).toBeVisible();
    
    await signupLink.click();
    await page.waitForURL(/.*\/(signup|register|get-started).*/i, { timeout: 5000 });
  });

  test('should have navigation to login page', async ({ page }) => {
    const loginLink = page.locator('a').filter({ hasText: /log in|sign in|login/i }).first();
    await expect(loginLink).toBeVisible();
    
    await loginLink.click();
    await page.waitForURL(/.*\/login.*/i, { timeout: 5000 });
  });

  test('should be responsive on mobile', async ({ page, context }) => {
    await context.setViewportSize({ width: 375, height: 667 }); // iPhone SE size
    await page.goto('/');

    // Hero should still be visible on mobile
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();

    // Navigation should exist (may be hamburger menu)
    const nav = page.locator('nav, header');
    await expect(nav.first()).toBeVisible();
  });

  test('should be responsive on tablet', async ({ page, context }) => {
    await context.setViewportSize({ width: 768, height: 1024 }); // iPad size
    await page.goto('/');

    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();
  });

  test('should load in under 3 seconds', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(3000);
  });

  test('should have SEO meta tags', async ({ page }) => {
    await page.goto('/');

    // Check for meta description
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveCount(1);

    // Check for title
    await expect(page).toHaveTitle(/.+/); // Has a title
  });

  test('should have accessible navigation', async ({ page }) => {
    await page.goto('/');

    // Navigation should be accessible
    const nav = page.locator('nav, [role="navigation"]');
    await expect(nav.first()).toBeVisible();
  });
});

