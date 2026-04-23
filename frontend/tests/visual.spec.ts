import { test, expect } from '@playwright/test';

test.describe('Visual Regression', () => {
  test('home page should look correct', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.home-state--loading')).toBeHidden({ timeout: 20000 });
    await expect(page).toHaveScreenshot('home-page.png', {
      maxDiffPixelRatio: 0.1,
    });
  });

  test('catalog page should look correct', async ({ page }) => {
    await page.goto('/catalog/photos');
    await expect(page.locator('.photo-grid')).toBeVisible({ timeout: 20000 });
    await expect(
      page
        .locator('.photo-card')
        .or(page.getByText('Фотографии не найдены'))
    ).toBeVisible({ timeout: 20000 });
    await expect(page).toHaveScreenshot('catalog-page.png', {
      maxDiffPixelRatio: 0.1,
    });
  });
});
