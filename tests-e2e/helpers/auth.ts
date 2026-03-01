import { Page, expect } from '@playwright/test';

/**
 * Mocks the required authenticated endpoints to prevent the test from hanging
 * and to provide predictable user data.
 */
export async function mockUserEndpoints(page: Page) {
    await page.route('*/**/api/me', route => route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ message: "Unauthenticated" }),
    }));

    await page.route('*/**/api/login/**', route => route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
            token: "mock-test-token",
            user: { id: 1, name: "Test User", email: "user@teesik.com" }
        }),
    }));
}

/**
 * Performs a login action using the frontend form.
 * Assumes the page has already navigated to a route containing the login form (e.g. `/account`)
 */
export async function performLogin(page: Page, email = 'user@teesik.com', password = 'password') {
    // 1. Wait for login form to be visible (it may be disabled briefly during hydration)
    const emailInput = page.getByPlaceholder('your@email.com').first();
    await expect(emailInput).toBeVisible({ timeout: 15000 });

    // 2. Fill in the credentials forcefully in case of hydration delays bridging Radix UI
    await emailInput.fill(email, { force: true });
    await page.getByPlaceholder('••••••••').first().fill(password, { force: true });

    // 3. Submit
    await page.getByRole('button', { name: 'Đăng Nhập', exact: true }).click();

    // Wait a short moment for State/API to update (or API mock to respond)
    await page.waitForTimeout(2000);
}
