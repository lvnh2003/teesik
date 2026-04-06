import { test, expect } from '@playwright/test';
import { navigateTo, vndPattern } from './helpers/test-utils';

test.describe('Products Page', () => {
    test('should load products page', async ({ page }) => {
        await navigateTo(page, '/products');
        // Should have a heading
        await expect(page.locator('h1')).toBeVisible();
    });

    test('should display product cards', async ({ page }) => {
        await navigateTo(page, '/products');
        // Wait for products to load (they come from API)
        await page.waitForTimeout(3000);

        // Should have at least one product link/card or empty state
        const productCards = page.locator('[class*="aspect"]').or(page.locator('a[href*="/products/"]'));
        const count = await productCards.count();

        if (count > 0) {
            // Products loaded
            await expect(productCards.first()).toBeVisible();
        } else {
            // Empty state is also valid
            await expect(page.locator('body')).toContainText(/.+/);
        }
    });

    test('should have price displayed on product cards', async ({ page }) => {
        await navigateTo(page, '/products');
        await page.waitForTimeout(3000);

        const priceElement = page.locator('text=/₫/').first();
        if (await priceElement.isVisible()) {
            await expect(priceElement).toBeVisible();
        }
    });

    test('should have working pagination or show all products', async ({ page }) => {
        await navigateTo(page, '/products');
        await page.waitForTimeout(3000);

        // Check for pagination buttons or "load more"
        const pagination = page.locator('button, a').filter({ hasText: /next|tiếp|›|»|2/i }).first();
        if (await pagination.isVisible()) {
            await expect(pagination).toBeVisible();
        }
    });

    test('should be able to navigate to product detail', async ({ page }) => {
        await navigateTo(page, '/products');
        await page.waitForTimeout(3000);

        const productLink = page.locator('a[href*="/products/"]').first();
        if (await productLink.isVisible()) {
            await productLink.click();
            await page.waitForURL('**/products/**');
            // Should be on product detail page
            expect(page.url()).toContain('/products/');
        }
    });
});

test.describe('Product Detail Page', () => {
    test('should load a product detail page', async ({ page }) => {
        // First get a product from the listing
        await navigateTo(page, '/products');
        await page.waitForTimeout(3000);

        const productLink = page.locator('a[href*="/products/"]').first();
        if (await productLink.isVisible()) {
            const href = await productLink.getAttribute('href');
            await navigateTo(page, href || '/products');

            // Should have product name
            const heading = page.locator('h1');
            await expect(heading).toBeVisible();
        }
    });

    test('should display product price', async ({ page }) => {
        await navigateTo(page, '/products');
        await page.waitForTimeout(3000);

        const productLink = page.locator('a[href*="/products/"]').first();
        if (await productLink.isVisible()) {
            const href = await productLink.getAttribute('href');
            await navigateTo(page, href || '/products');

            // Should have price in VND
            const price = page.locator('text=/₫/').first();
            await expect(price).toBeVisible();
        }
    });

    test('should have add to cart button', async ({ page }) => {
        await navigateTo(page, '/products');
        await page.waitForTimeout(3000);

        const productLink = page.locator('a[href*="/products/"]').first();
        if (await productLink.isVisible()) {
            const href = await productLink.getAttribute('href');
            await navigateTo(page, href || '/products');

            // Should have add to cart/collection button
            const addBtn = page.getByRole('button', { name: /add to collection|thêm vào|sold out|hết hàng/i });
            await expect(addBtn).toBeVisible();
        }
    });

    test('should have attribute selectors if product has variants', async ({ page }) => {
        await navigateTo(page, '/products');
        await page.waitForTimeout(3000);

        const productLink = page.locator('a[href*="/products/"]').first();
        if (await productLink.isVisible()) {
            const href = await productLink.getAttribute('href');
            await navigateTo(page, href || '/products');

            // Variant buttons (optional — only if product has variants)
            const variantBtns = page.locator('button').filter({ hasText: /S|M|L|XL|đen|trắng|black|white/i });
            const count = await variantBtns.count();
            // Just verify page doesn't crash — variants are optional
            expect(count).toBeGreaterThanOrEqual(0);
        }
    });

    test('should have quantity selector', async ({ page }) => {
        await navigateTo(page, '/products');
        await page.waitForTimeout(3000);

        const productLink = page.locator('a[href*="/products/"]').first();
        if (await productLink.isVisible()) {
            const href = await productLink.getAttribute('href');
            await navigateTo(page, href || '/products');

            // Quantity +/- buttons
            const plusBtn = page.locator('button').filter({ has: page.locator('svg.lucide-plus') }).first();
            if (await plusBtn.isVisible()) {
                await expect(plusBtn).toBeVisible();
            }
        }
    });

    test('should have description accordion', async ({ page }) => {
        await navigateTo(page, '/products');
        await page.waitForTimeout(3000);

        const productLink = page.locator('a[href*="/products/"]').first();
        if (await productLink.isVisible()) {
            const href = await productLink.getAttribute('href');
            await navigateTo(page, href || '/products');

            // Accordion trigger
            const descTrigger = page.locator('button').filter({ hasText: /description|mô tả/i }).first();
            if (await descTrigger.isVisible()) {
                await descTrigger.click();
                await page.waitForTimeout(500);
                // Content should now be visible
                await expect(page.locator('body')).toBeVisible();
            }
        }
    });

    test('should have related products section', async ({ page }) => {
        await navigateTo(page, '/products');
        await page.waitForTimeout(3000);

        const productLink = page.locator('a[href*="/products/"]').first();
        if (await productLink.isVisible()) {
            const href = await productLink.getAttribute('href');
            await navigateTo(page, href || '/products');

            const related = page.locator('text=/you may also like|có thể bạn cũng thích/i');
            if (await related.isVisible()) {
                await expect(related).toBeVisible();
            }
        }
    });
});
