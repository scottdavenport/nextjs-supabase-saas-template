import { test, expect } from '@playwright/test';

// Test credentials from environment
const TEST_USER_EMAIL = process.env.TEST_USER_EMAIL;
const TEST_USER_PASSWORD = process.env.TEST_USER_PASSWORD;
const TEST_USER_NAME = process.env.TEST_USER_NAME || 'Test User';

// Validate required environment variables
if (!TEST_USER_EMAIL || !TEST_USER_PASSWORD) {
  test.skip(true, 'TEST_USER_EMAIL and TEST_USER_PASSWORD environment variables must be set for auth setup tests');
}

test.describe('Authentication Setup', () => {
  test('should create test account if it does not exist', async ({ page }) => {
    if (!TEST_USER_EMAIL || !TEST_USER_PASSWORD) {
      test.skip();
    }

    // Try to sign in first
    await page.goto('/login');
    await page.getByLabel('Email').fill(TEST_USER_EMAIL!);
    await page.getByLabel('Password').fill(TEST_USER_PASSWORD!);
    await page.getByRole('button', { name: /Sign In|Sign in/i }).click();
    
    // Wait a moment for the response
    await page.waitForTimeout(2000);
    
    // Check if we're still on login page (account doesn't exist)
    const currentUrl = page.url();
    if (currentUrl.includes('/login')) {
      console.log('Test account does not exist, creating it...');
      
      // Go to signup page
      await page.goto('/signup');
      
      // Fill signup form - check for Display Name or Full Name field
      const nameField = page.getByLabel(/Display Name|Full Name/i);
      if (await nameField.isVisible().catch(() => false)) {
        await nameField.fill(TEST_USER_NAME);
      }
      await page.getByLabel('Email').fill(TEST_USER_EMAIL!);
      await page.getByLabel('Password').fill(TEST_USER_PASSWORD!);
      await page.getByRole('button', { name: /Create Account|Sign Up/i }).click();
      
      // Wait for signup to complete
      await page.waitForTimeout(3000);
    } else {
      console.log('Test account already exists and signed in successfully');
    }
    
    // Verify we can access dashboard
    await page.goto('/dashboard');
    await expect(page).toHaveURL('/dashboard');
    
    // Verify dashboard loads
    await expect(page.locator('body')).toBeVisible();
  });
});

