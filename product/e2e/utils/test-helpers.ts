import { Page, expect } from '@playwright/test';

export async function waitForPageLoad(page: Page, timeout = 5000) {
  await page.waitForLoadState('networkidle', { timeout });
}

export async function fillSignupForm(
  page: Page,
  data: {
    email: string;
    password: string;
    siteName: string;
    subdomain: string;
  }
) {
  await page.fill('input[name="email"], input[type="email"]', data.email);
  await page.fill('input[name="password"], input[type="password"]', data.password);
  await page.fill('input[name="siteName"]', data.siteName);
  await page.fill('input[name="subdomain"]', data.subdomain);
}

export async function expectSuccessMessage(page: Page, message?: string) {
  const successElement = page.locator('[role="alert"], .success, .alert-success').first();
  await expect(successElement).toBeVisible({ timeout: 10000 });
  
  if (message) {
    await expect(successElement).toContainText(message);
  }
}

export async function expectErrorMessage(page: Page, message?: string) {
  const errorElement = page.locator('[role="alert"], .error, .alert-error, .alert-danger').first();
  await expect(errorElement).toBeVisible({ timeout: 10000 });
  
  if (message) {
    await expect(errorElement).toContainText(message);
  }
}

export async function takeScreenshot(page: Page, name: string) {
  await page.screenshot({
    path: `./test-results/screenshots/${name}-${Date.now()}.png`,
    fullPage: true,
  });
}

export function generateRandomEmail(): string {
  return `test-${Date.now()}-${Math.random().toString(36).substring(7)}@example.com`;
}

export function generateRandomSubdomain(): string {
  return `test-${Date.now()}-${Math.random().toString(36).substring(7)}`.substring(0, 20);
}

