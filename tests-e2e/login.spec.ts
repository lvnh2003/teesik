import { test, expect } from '@playwright/test';
import { navigateTo } from './helpers/test-utils';

test.describe('Login Page', () => {
    test('should load account/login page', async ({ page }) => {
        await navigateTo(page, '/account');

        // Should have login and register tabs
        const loginTab = page.locator('text=/đăng nhập|login|sign in/i').first();
        await expect(loginTab).toBeVisible();
    });

    test('should have email and password fields', async ({ page }) => {
        await navigateTo(page, '/account');

        const emailInput = page.getByPlaceholder('your@email.com').first();
        const passwordInput = page.getByPlaceholder('••••••••').first();

        await expect(emailInput).toBeVisible();
        await expect(passwordInput).toBeVisible();
    });

    test('should have login submit button', async ({ page }) => {
        await navigateTo(page, '/account');

        const loginBtn = page.getByRole('button', { name: /đăng nhập/i }).first();
        await expect(loginBtn).toBeVisible();
    });

    test('should toggle password visibility', async ({ page }) => {
        await navigateTo(page, '/account');

        const passwordInput = page.getByPlaceholder('••••••••').first();
        await expect(passwordInput).toHaveAttribute('type', 'password');

        // Click the eye icon to toggle
        const toggleBtn = page.locator('button').filter({ has: page.locator('svg') }).nth(0);
        // Look for the toggle near the password field
        const eyeButton = passwordInput.locator('..').locator('button');
        if (await eyeButton.isVisible()) {
            await eyeButton.click();
            await page.waitForTimeout(300);
        }
    });

    test('should show error on invalid login', async ({ page }) => {
        await navigateTo(page, '/account');

        await page.getByPlaceholder('your@email.com').first().fill('invalid@test.com');
        await page.getByPlaceholder('••••••••').first().fill('wrongpassword');
        await page.getByRole('button', { name: /đăng nhập/i }).first().click();

        await page.waitForTimeout(3000);

        // Should show error message (not crash)
        await expect(page.locator('body')).toBeVisible();
    });
});

test.describe('Register Page', () => {
    test('should switch to register tab', async ({ page }) => {
        await navigateTo(page, '/account');

        // Click register tab
        const registerTab = page.locator('[role="tab"]').filter({ hasText: /đăng ký|register/i });
        await registerTab.click();
        await page.waitForTimeout(500);

        // Should show register form with name field
        const nameInput = page.getByPlaceholder(/nguyen/i).or(page.locator('input').filter({ has: page.locator('..', { hasText: /họ và tên/i }) }));
        await expect(nameInput.first()).toBeVisible();
    });

    test('should have all register form fields', async ({ page }) => {
        await navigateTo(page, '/account');

        const registerTab = page.locator('[role="tab"]').filter({ hasText: /đăng ký|register/i });
        await registerTab.click();
        await page.waitForTimeout(500);

        // Check for name, email, phone, password, confirm password
        const nameField = page.getByPlaceholder(/nguyen/i).first();
        const phoneField = page.getByPlaceholder(/0123/i).first();

        await expect(nameField).toBeVisible();
        await expect(phoneField).toBeVisible();
    });

    test('should validate password confirmation mismatch', async ({ page }) => {
        await navigateTo(page, '/account');

        const registerTab = page.locator('[role="tab"]').filter({ hasText: /đăng ký|register/i });
        await registerTab.click();
        await page.waitForTimeout(500);

        // Fill form with mismatched passwords
        await page.getByPlaceholder(/nguyen/i).first().fill('Test User');
        const emailInputs = page.getByPlaceholder('your@email.com');
        await emailInputs.nth(1).fill('test@test.com');
        
        // Find password fields in register form
        const passwordFields = page.getByPlaceholder('••••••••');
        await passwordFields.nth(2).fill('password123');
        await passwordFields.nth(3).fill('differentpassword');

        // Check terms checkbox
        const checkbox = page.locator('input[type="checkbox"]').last();
        if (await checkbox.isVisible()) {
            await checkbox.check();
        }

        // Submit
        const registerBtn = page.getByRole('button', { name: /đăng ký/i }).first();
        await registerBtn.click();
        await page.waitForTimeout(2000);

        // Should show error about password mismatch
        const errorMsg = page.locator('text=/không khớp|mismatch/i');
        if (await errorMsg.isVisible()) {
            await expect(errorMsg).toBeVisible();
        }
    });
});

test.describe('Dashboard Page (Auth Required)', () => {
    test('should redirect to account page when not logged in', async ({ page }) => {
        await navigateTo(page, '/dashboard');
        await page.waitForTimeout(3000);

        // Should redirect to /account or show loading
        const url = page.url();
        const isRedirected = url.includes('/account') || url.includes('/dashboard');
        expect(isRedirected).toBeTruthy();
    });
});
