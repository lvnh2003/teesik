import { test, expect } from '@playwright/test';
import { navigateTo, waitForHydration } from './helpers/test-utils';

test.describe('Homepage', () => {
    test.beforeEach(async ({ page }) => {
        await navigateTo(page, '/');
    });

    test('should load homepage successfully', async ({ page }) => {
        await expect(page).toHaveTitle(/teesik/i);
    });

    test('should render hero section', async ({ page }) => {
        // Hero typography
        const hero = page.locator('h1, h2').first();
        await expect(hero).toBeVisible();
    });

    test('should render main navigation', async ({ page }) => {
        const nav = page.locator('nav, header').first();
        await expect(nav).toBeVisible();
    });

    test('should have working navigation links', async ({ page }) => {
        // Products link
        const productsLink = page.getByRole('link', { name: /products|sản phẩm|collection/i }).first();
        await expect(productsLink).toBeVisible();
    });

    test('should render footer', async ({ page }) => {
        const footer = page.locator('footer');
        await expect(footer).toBeVisible();
    });

    test('should have newsletter section', async ({ page }) => {
        const emailInput = page.getByPlaceholder(/email/i).first();
        await expect(emailInput).toBeVisible();
    });

    test('should be able to switch language', async ({ page }) => {
        // Look for language switcher button
        const langButton = page.locator('button').filter({ hasText: /vi|en|🇻🇳|🇺🇸/i }).first();
        if (await langButton.isVisible()) {
            await langButton.click();
            await page.waitForTimeout(500);
            // Page should still be functional after switch
            await expect(page.locator('body')).toBeVisible();
        }
    });
});
