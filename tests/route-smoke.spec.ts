import { test, expect } from '@playwright/test';

// Test credentials
const TEST_USER_EMAIL = process.env.TEST_USER_EMAIL;
const TEST_USER_PASSWORD = process.env.TEST_USER_PASSWORD;

// Validate required environment variables
if (!TEST_USER_EMAIL || !TEST_USER_PASSWORD) {
  test.skip(true, 'TEST_USER_EMAIL and TEST_USER_PASSWORD environment variables must be set for smoke tests');
}

test.describe('Route Smoke Tests', () => {
  test.describe('Protected Routes', () => {
    test.beforeEach(async ({ page }) => {
      if (!TEST_USER_EMAIL || !TEST_USER_PASSWORD) {
        test.skip();
      }
      // Sign in before each test
      await page.goto('/login');
      await page.getByLabel('Email').fill(TEST_USER_EMAIL!);
      await page.getByLabel('Password').fill(TEST_USER_PASSWORD!);
      await page.getByRole('button', { name: /Sign In|Sign in/i }).click();
      await expect(page).toHaveURL('/dashboard');
    });

    test('should navigate to Dashboard and load successfully', async ({ page }) => {
      await page.goto('/dashboard');
      await expect(page).toHaveURL('/dashboard');
      
      // Verify page loads without errors
      await expect(page.locator('body')).toBeVisible();
      
      // Check for common dashboard elements
      const hasContent = await page.locator('h1, h2, [data-testid]').first().isVisible().catch(() => false);
      expect(hasContent).toBeTruthy();
    });

    test('should navigate to Settings and load successfully', async ({ page }) => {
      await page.goto('/settings');
      await expect(page).toHaveURL('/settings');
      
      // Verify page loads without errors
      await expect(page.locator('body')).toBeVisible();
      
      // Check for settings page content
      await expect(page.getByRole('heading', { name: /Settings/i })).toBeVisible();
    });
  });

  test.describe('Public Routes', () => {
    test('should load login page successfully', async ({ page }) => {
      await page.goto('/login');
      await expect(page).toHaveURL('/login');
      
      // Verify page loads without errors
      await expect(page.locator('body')).toBeVisible();
      
      // Check for login form
      await expect(page.getByRole('heading', { name: /Welcome back|Sign In/i })).toBeVisible();
      await expect(page.getByLabel('Email')).toBeVisible();
      await expect(page.getByLabel('Password')).toBeVisible();
    });

    test('should load signup page successfully', async ({ page }) => {
      await page.goto('/signup');
      await expect(page).toHaveURL('/signup');
      
      // Verify page loads without errors
      await expect(page.locator('body')).toBeVisible();
      
      // Check for signup form
      await expect(page.getByRole('heading', { name: /Create|Sign Up/i })).toBeVisible();
      await expect(page.getByLabel('Email')).toBeVisible();
      await expect(page.getByLabel('Password')).toBeVisible();
    });
  });

  test.describe('404 Page Behavior', () => {
    test('should display 404 page for invalid routes', async ({ page }) => {
      await page.goto('/this-page-does-not-exist-12345');
      
      // Verify 404 page is displayed
      await expect(page.getByText('404', { exact: false })).toBeVisible();
      await expect(page.getByText(/Page not found|doesn't exist/i)).toBeVisible();
      
      // Verify 404 page has navigation options
      await expect(page.getByRole('link', { name: /Dashboard|Go to Dashboard/i })).toBeVisible();
    });

    test('should allow navigation from 404 page', async ({ page }) => {
      await page.goto('/this-page-does-not-exist-67890');
      
      // Click link to dashboard from 404 page
      const dashboardLink = page.getByRole('link', { name: /Dashboard|Go to Dashboard/i });
      if (await dashboardLink.isVisible().catch(() => false)) {
        await dashboardLink.click();
        await expect(page).toHaveURL(/\/(dashboard|login)/);
      }
    });
  });

  test.describe('Redirects', () => {
    test('should redirect root path to login when not authenticated', async ({ page }) => {
      // Make sure we're signed out - use POST request (signout route only accepts POST)
      await page.goto('/');
      await page.request.post('/auth/signout');
      await page.waitForLoadState('networkidle');
      
      // Navigate to root again to trigger redirect
      await page.goto('/');
      await expect(page).toHaveURL('/login');
    });

    test('should redirect authenticated users from login to dashboard', async ({ page }) => {
      if (!TEST_USER_EMAIL || !TEST_USER_PASSWORD) {
        test.skip();
      }
      // Sign in first
      await page.goto('/login');
      await page.getByLabel('Email').fill(TEST_USER_EMAIL!);
      await page.getByLabel('Password').fill(TEST_USER_PASSWORD!);
      await page.getByRole('button', { name: /Sign In|Sign in/i }).click();
      await expect(page).toHaveURL('/dashboard');
      
      // Try to access login page again
      await page.goto('/login');
      await expect(page).toHaveURL('/dashboard');
    });
  });

  test.describe('Route Accessibility', () => {
    test('should protect dashboard route when not authenticated', async ({ page }) => {
      // Make sure we're signed out - use POST request (signout route only accepts POST)
      await page.goto('/');
      await page.request.post('/auth/signout');
      await page.waitForLoadState('networkidle');
      
      // Try to access protected route
      await page.goto('/dashboard');
      await expect(page).toHaveURL('/login');
    });

    test('should protect settings route when not authenticated', async ({ page }) => {
      // Make sure we're signed out - use POST request (signout route only accepts POST)
      await page.goto('/');
      await page.request.post('/auth/signout');
      await page.waitForLoadState('networkidle');
      
      // Try to access protected route
      await page.goto('/settings');
      await expect(page).toHaveURL('/login');
    });
  });
});

