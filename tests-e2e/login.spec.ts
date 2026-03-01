import { test, expect } from '@playwright/test';
import { performLogin } from './helpers/auth';

test.describe('Customer Login flow', () => {
    test.beforeEach(async ({ page, context }) => {
        // Clear cookies to avoid hanging on AuthContext hydration
        await context.clearCookies();
        // Navigate to the user account page where the login forms are located
        await page.goto('/account');
    });

    test('should display login form', async ({ page }) => {
        // The account page uses tabs, with "Đăng Nhập" being the default for login
        await expect(page.getByRole('tab', { name: /đăng nhập/i })).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Đăng Nhập', exact: true })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Đăng Nhập', exact: true })).toBeVisible();
    });

    test('should show error on invalid credentials', async ({ page }) => {
        // We use the performLogin helper but provide wrong credentials
        await performLogin(page, 'wrong@example.com', 'wrongpassword');

        // The app expects some API response. As an e2e test against a live/dev server without mock,
        // it should surface an error notification.
        await expect(page.locator('.bg-red-50.border-red-200')).toBeVisible({ timeout: 10000 });
    });
});

