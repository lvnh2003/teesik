import { test, expect } from '@playwright/test';
import { performLogin } from './helpers/auth';

test.describe('Customer Login flow', () => {
  test.beforeEach(async ({ page, context }) => {
    // Clear cookies to avoid hanging on AuthContext hydration
    await context.clearCookies();
    // Navigate to the user account page where login is located
    await page.goto('/account');
  });
  test('test', async ({ page }) => {
    await performLogin(page);

    await page.getByRole('button', { name: 'Xem Chi Tiết' }).click();
    await page.getByRole('link', { name: 'MỚI', exact: true }).click();
    await page.getByRole('heading', { name: 'Hàng Mới Về' }).click();
    await expect(page.getByRole('heading', { name: 'Hàng Mới Về' })).toBeVisible();
    await expect(page.getByRole('banner')).toMatchAriaSnapshot(`
    - link "TEESIK":
      - /url: /
    - navigation:
      - link "MỚI":
        - /url: /new
      - link "Sản phẩm":
        - /url: /products
        - text: ""
        - img
      - link "BỘ SƯU TẬP":
        - /url: /collections
      - link "VỀ CHÚNG TÔI":
        - /url: /about
    - button "Tiếng Việt":
      - img
      - text: ""
      - img
    - button "Search":
      - img
      - text: ""
    - button "Account":
      - img
      - text: ""
    - link "Wishlist":
      - /url: /wishlist
      - button "Wishlist":
        - img
        - text: ""
    - link "Cart":
      - /url: /cart
      - button "Cart":
        - img
        - text: ""
    `);
    await page.getByRole('button', { name: 'Xem Toàn Bộ Bộ Sưu Tập' }).click();
    await page.getByRole('banner').getByRole('link', { name: 'TEESIK' }).click();
  });
});
