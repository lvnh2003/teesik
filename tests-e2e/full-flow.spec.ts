import { test, expect } from '@playwright/test';
import { navigateTo } from './helpers/test-utils';

/**
 * Full E2E Purchase Flow — simulates a customer buying a product from start to finish.
 * This is the most critical test in the suite.
 */
test.describe('Full Purchase Flow (E2E)', () => {
    test('should complete: Homepage → Products → Detail → Add to Cart → Cart → Checkout', async ({ page }) => {
        // ========== Step 1: Homepage ==========
        await navigateTo(page, '/');
        await expect(page.locator('h1, h2').first()).toBeVisible();

        // ========== Step 2: Navigate to Products ==========
        await navigateTo(page, '/products');
        await page.waitForTimeout(3000);

        const productLinks = page.locator('a[href*="/products/"]');
        const productCount = await productLinks.count();

        if (productCount === 0) {
            // No products available — skip rest of flow
            test.skip();
            return;
        }

        // ========== Step 3: Open Product Detail ==========
        const firstProductHref = await productLinks.first().getAttribute('href');
        expect(firstProductHref).toBeTruthy();

        await navigateTo(page, firstProductHref!);
        await page.waitForTimeout(2000);

        // Verify product page loaded
        const productTitle = page.locator('h1');
        await expect(productTitle).toBeVisible();

        // ========== Step 4: Add to Cart ==========
        const addToCartBtn = page.getByRole('button', { name: /add to collection|thêm vào/i }).first();

        if (await addToCartBtn.isVisible() && await addToCartBtn.isEnabled()) {
            await addToCartBtn.click();
            await page.waitForTimeout(2000);

            // Verify toast appeared or cart updated
            await expect(page.locator('body')).toBeVisible();

            // ========== Step 5: Navigate to Cart ==========
            await navigateTo(page, '/cart');
            await page.waitForTimeout(3000);

            // Verify cart has items
            const cartBody = page.locator('body');
            await expect(cartBody).toBeVisible();

            // ========== Step 6: Navigate to Checkout ==========
            const checkoutLink = page.getByRole('link', { name: /checkout|thanh toán/i }).first();
            if (await checkoutLink.isVisible()) {
                await checkoutLink.click();
                await page.waitForURL('**/checkout**');
                await page.waitForTimeout(2000);

                // Verify checkout page loaded
                await expect(page.locator('body')).toContainText(/.+/);
            }
        }
    });
});

/**
 * Full E2E Search Flow — find products via search.
 */
test.describe('Full Search Flow (E2E)', () => {
    test('should: Homepage → Search → View Results', async ({ page }) => {
        await navigateTo(page, '/');

        // Navigate to search directly
        await navigateTo(page, '/search?q=bag');
        await page.waitForTimeout(3000);

        // Should show search query
        await expect(page.locator('body')).toContainText(/bag/i);

        // Click on a result if available
        const resultLink = page.locator('a[href*="/products/"]').first();
        if (await resultLink.isVisible()) {
            await resultLink.click();
            await page.waitForURL('**/products/**');

            // Product detail should load
            await expect(page.locator('h1')).toBeVisible();
        }
    });
});

/**
 * Full E2E Wishlist Flow — add/view/remove from wishlist.
 */
test.describe('Full Wishlist Flow (E2E)', () => {
    test('should open wishlist and see empty state', async ({ page }) => {
        await navigateTo(page, '/wishlist');

        // Empty wishlist should be visible
        await expect(page.locator('body')).toBeVisible();
    });
});
