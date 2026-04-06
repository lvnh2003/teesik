import { test, expect, Page } from '@playwright/test';

/**
 * Shared helpers for Teesik E2E tests.
 */

/** Wait for Next.js hydration to complete */
export async function waitForHydration(page: Page) {
    await page.waitForLoadState('networkidle');
    // Wait for Next.js to finish hydrating
    await page.waitForTimeout(500);
}

/** Navigate and wait for page to be ready */
export async function navigateTo(page: Page, path: string) {
    await page.goto(path, { waitUntil: 'domcontentloaded' });
    await waitForHydration(page);
}

/** Format VND price for assertion matching */
export function vndPattern() {
    // Matches patterns like "500.000 ₫" or "1.500.000 ₫"
    return /[\d.]+\s*₫/;
}

/** Login helper — sets auth cookie directly for speed */
export async function loginAsUser(page: Page, email: string, password: string) {
    await navigateTo(page, '/account');

    await page.getByPlaceholder('your@email.com').first().fill(email);
    await page.getByPlaceholder('••••••••').first().fill(password);
    await page.getByRole('button', { name: /đăng nhập/i }).click();

    // Wait for redirect
    await page.waitForURL('**/*', { timeout: 10_000 });
}

/** Check page does not have console errors (filters known noise) */
export function collectConsoleErrors(page: Page): string[] {
    const errors: string[] = [];
    page.on('console', msg => {
        if (msg.type() === 'error') {
            const text = msg.text();
            // Filter known noise
            if (text.includes('favicon') || text.includes('hot-update') || text.includes('404')) return;
            errors.push(text);
        }
    });
    return errors;
}
