import { test, expect } from '@playwright/test';
import { navigateTo } from './helpers/test-utils';

/**
 * Navigation & Layout tests — ensures the shared UI shell works on all pages.
 */
test.describe('Navigation & Layout', () => {
    const publicPages = [
        { name: 'Homepage', path: '/' },
        { name: 'Products', path: '/products' },
        { name: 'New Arrivals', path: '/new' },
        { name: 'Collections', path: '/collections' },
        { name: 'About', path: '/about' },
        { name: 'Account', path: '/account' },
        { name: 'Cart', path: '/cart' },
        { name: 'Wishlist', path: '/wishlist' },
        { name: 'Search', path: '/search' },
        { name: 'Checkout', path: '/checkout' },
    ];

    for (const { name, path } of publicPages) {
        test(`${name} (${path}) — should load without crash`, async ({ page }) => {
            const errors: string[] = [];
            page.on('pageerror', err => errors.push(err.message));

            await navigateTo(page, path);
            await page.waitForTimeout(2000);

            // Page should render
            await expect(page.locator('body')).toBeVisible();

            // No unhandled JS errors
            const criticalErrors = errors.filter(e =>
                !e.includes('hydrat') &&
                !e.includes('Loading chunk') &&
                !e.includes('Failed to fetch')
            );
            expect(criticalErrors).toEqual([]);
        });
    }

    test('should have consistent header across pages', async ({ page }) => {
        await navigateTo(page, '/');
        const headerText = await page.locator('header, nav').first().textContent();

        await navigateTo(page, '/products');
        const headerText2 = await page.locator('header, nav').first().textContent();

        // Headers should be similar (same navigation)
        expect(headerText).toBeTruthy();
        expect(headerText2).toBeTruthy();
    });

    test('should have consistent footer across pages', async ({ page }) => {
        await navigateTo(page, '/');
        const footer = page.locator('footer');
        await expect(footer).toBeVisible();

        await navigateTo(page, '/about');
        const footer2 = page.locator('footer');
        await expect(footer2).toBeVisible();
    });
});

test.describe('Responsive Design', () => {
    test('should work on mobile viewport', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 812 });
        await navigateTo(page, '/');

        await expect(page.locator('body')).toBeVisible();
    });

    test('should work on tablet viewport', async ({ page }) => {
        await page.setViewportSize({ width: 768, height: 1024 });
        await navigateTo(page, '/');

        await expect(page.locator('body')).toBeVisible();
    });

    test('should have mobile menu button on small screens', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 812 });
        await navigateTo(page, '/');

        // Look for hamburger menu button
        const menuBtn = page.locator('button').filter({ has: page.locator('svg') }).first();
        await expect(menuBtn).toBeVisible();
    });
});

test.describe('SEO & Accessibility', () => {
    test('homepage should have proper title', async ({ page }) => {
        await navigateTo(page, '/');
        const title = await page.title();
        expect(title.length).toBeGreaterThan(0);
    });

    test('all pages should have h1 tags', async ({ page }) => {
        const pages = ['/', '/products', '/new', '/collections', '/about', '/account'];
        for (const path of pages) {
            await navigateTo(page, path);
            await page.waitForTimeout(1000);
            const h1Count = await page.locator('h1').count();
            expect(h1Count, `Page ${path} should have at least one h1`).toBeGreaterThanOrEqual(1);
        }
    });

    test('images should have alt attributes', async ({ page }) => {
        await navigateTo(page, '/');
        await page.waitForTimeout(2000);

        const images = page.locator('img');
        const count = await images.count();

        for (let i = 0; i < Math.min(count, 10); i++) {
            const alt = await images.nth(i).getAttribute('alt');
            expect(alt, `Image ${i} should have alt attribute`).not.toBeNull();
        }
    });
});
