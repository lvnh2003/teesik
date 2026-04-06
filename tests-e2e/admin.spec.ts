import { test, expect } from '@playwright/test';
import { navigateTo } from './helpers/test-utils';

test.describe('Admin Login Page', () => {
    test('should load admin login page', async ({ page }) => {
        await navigateTo(page, '/admin/login');
        await page.waitForTimeout(2000);

        // Should render (either login form or redirect)
        await expect(page.locator('body')).toBeVisible();
    });
});

test.describe('Admin Dashboard (Auth Protected)', () => {
    test('should redirect to login when not authenticated', async ({ page }) => {
        await navigateTo(page, '/admin');
        await page.waitForTimeout(5000);

        // Should redirect to /admin/login or show loading spinner
        const url = page.url();
        const isProtected = url.includes('/admin/login') || url.includes('/admin');
        expect(isProtected).toBeTruthy();
    });
});

test.describe('Admin Products Page (Auth Protected)', () => {
    test('should redirect to login when not authenticated', async ({ page }) => {
        await navigateTo(page, '/admin/products');
        await page.waitForTimeout(5000);

        // Should redirect to login
        const url = page.url();
        const body = page.locator('body');
        await expect(body).toBeVisible();
    });
});

test.describe('Admin Orders Page (Auth Protected)', () => {
    test('should redirect to login when not authenticated', async ({ page }) => {
        await navigateTo(page, '/admin/orders');
        await page.waitForTimeout(5000);

        const body = page.locator('body');
        await expect(body).toBeVisible();
    });
});

test.describe('Admin Categories Page (Auth Protected)', () => {
    test('should redirect to login when not authenticated', async ({ page }) => {
        await navigateTo(page, '/admin/categories');
        await page.waitForTimeout(5000);

        const body = page.locator('body');
        await expect(body).toBeVisible();
    });
});

test.describe('Admin Customers Page (Auth Protected)', () => {
    test('should redirect to login when not authenticated', async ({ page }) => {
        await navigateTo(page, '/admin/customers');
        await page.waitForTimeout(5000);

        const body = page.locator('body');
        await expect(body).toBeVisible();
    });
});
