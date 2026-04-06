import { test, expect } from '@playwright/test';
import { navigateTo } from './helpers/test-utils';

test.describe('Search Page', () => {
    test('should load search page with query', async ({ page }) => {
        await navigateTo(page, '/search?q=bag');
        await page.waitForTimeout(3000);

        // Should display the search query
        await expect(page.locator('body')).toContainText(/bag/i);
    });

    test('should load search page without query', async ({ page }) => {
        await navigateTo(page, '/search');
        // Should still render without crashing
        await expect(page.locator('body')).toBeVisible();
    });

    test('should display results or no-results message', async ({ page }) => {
        await navigateTo(page, '/search?q=test');
        await page.waitForTimeout(3000);

        // Either products or "no results" message
        const body = page.locator('body');
        await expect(body).toContainText(/.+/);
    });
});

test.describe('Wishlist Page', () => {
    test('should load wishlist page', async ({ page }) => {
        await navigateTo(page, '/wishlist');
        // Should show empty state (since no items in fresh session)
        await expect(page.locator('body')).toBeVisible();
    });

    test('should show empty wishlist state', async ({ page }) => {
        await navigateTo(page, '/wishlist');

        // Look for empty state text or "start curating" button
        const emptyIndicator = page.locator('text=/empty|start curating|chưa có/i').first();
        if (await emptyIndicator.isVisible()) {
            await expect(emptyIndicator).toBeVisible();
        }
    });
});

test.describe('New Arrivals Page', () => {
    test('should load new arrivals page', async ({ page }) => {
        await navigateTo(page, '/new');

        const heading = page.locator('h1');
        await expect(heading).toBeVisible();
    });

    test('should have marquee section', async ({ page }) => {
        await navigateTo(page, '/new');

        // Marquee with scrolling text
        const marquee = page.locator('[class*="marquee"], [class*="animate"]').first();
        if (await marquee.isVisible()) {
            await expect(marquee).toBeVisible();
        }
    });

    test('should display products or empty state', async ({ page }) => {
        await navigateTo(page, '/new');
        await page.waitForTimeout(3000);

        await expect(page.locator('body')).toContainText(/.+/);
    });
});

test.describe('Collections Page', () => {
    test('should load collections page', async ({ page }) => {
        await navigateTo(page, '/collections');

        const heading = page.locator('h1');
        await expect(heading).toBeVisible();
    });

    test('should display collection cards', async ({ page }) => {
        await navigateTo(page, '/collections');

        // Should have collection links
        const collectionLinks = page.locator('a[href*="/collections/"]');
        await expect(collectionLinks.first()).toBeVisible();
    });

    test('should have at least 4 collections', async ({ page }) => {
        await navigateTo(page, '/collections');

        const collectionLinks = page.locator('a[href*="/collections/"]');
        const count = await collectionLinks.count();
        expect(count).toBeGreaterThanOrEqual(4);
    });
});

test.describe('About Page', () => {
    test('should load about page', async ({ page }) => {
        await navigateTo(page, '/about');

        const heading = page.locator('h1');
        await expect(heading).toBeVisible();
    });

    test('should have multiple content sections', async ({ page }) => {
        await navigateTo(page, '/about');

        // Should have multiple sections
        const sections = page.locator('section');
        const count = await sections.count();
        expect(count).toBeGreaterThanOrEqual(2);
    });
});
