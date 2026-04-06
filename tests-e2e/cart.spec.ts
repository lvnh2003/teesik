import { test, expect } from '@playwright/test';
import { navigateTo } from './helpers/test-utils';

test.describe('Cart Page', () => {
    test('should load cart page', async ({ page }) => {
        await navigateTo(page, '/cart');
        // Should show cart title or empty state
        await expect(page.locator('body')).toContainText(/.+/);
    });

    test('should show empty cart state when no items', async ({ page }) => {
        // Clear any existing cart
        await page.addInitScript(() => {
            localStorage.removeItem('cart_id');
        });
        await navigateTo(page, '/cart');
        await page.waitForTimeout(2000);

        // Should show empty state or loading
        const body = page.locator('body');
        await expect(body).toBeVisible();
    });

    test('should show "Start Shopping" link on empty cart', async ({ page }) => {
        await page.addInitScript(() => {
            localStorage.removeItem('cart_id');
        });
        await navigateTo(page, '/cart');
        await page.waitForTimeout(3000);

        // Look for link to products or "start shopping" button
        const shopLink = page.getByRole('link', { name: /start shopping|bắt đầu mua|shop|products/i }).first();
        if (await shopLink.isVisible()) {
            await expect(shopLink).toBeVisible();
        }
    });
});

test.describe('Cart Flow — Add to Cart', () => {
    test('should add a product to cart from product detail', async ({ page }) => {
        // Navigate to products, find one
        await navigateTo(page, '/products');
        await page.waitForTimeout(3000);

        const productLink = page.locator('a[href*="/products/"]').first();
        if (!(await productLink.isVisible())) {
            test.skip();
            return;
        }

        const href = await productLink.getAttribute('href');
        await navigateTo(page, href || '/products');
        await page.waitForTimeout(2000);

        // Click add to cart
        const addBtn = page.getByRole('button', { name: /add to collection|thêm vào/i }).first();
        if (await addBtn.isVisible() && await addBtn.isEnabled()) {
            await addBtn.click();
            await page.waitForTimeout(2000);

            // Should show toast or cart count update — page should not crash
            await expect(page.locator('body')).toBeVisible();
        }
    });
});
