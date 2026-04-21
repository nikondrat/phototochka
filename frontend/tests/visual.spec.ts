import { test, expect } from '@playwright/test';

test.describe('Visual Regression', () => {
  test('home page should look correct', async ({ page }) => {
    await page.goto('/');
    // Ждем загрузки контента
    await page.waitForSelector('.hero');
    await expect(page).toHaveScreenshot('home-page.png', {
      maxDiffPixelRatio: 0.1,
    });
  });

  test('catalog page should look correct', async ({ page }) => {
    await page.goto('/catalog/photos');
    await page.waitForSelector('.photo-grid');
    // Ждем пока загрузятся карточки
    await page.waitForSelector('.photo-card');
    await expect(page).toHaveScreenshot('catalog-page.png', {
      maxDiffPixelRatio: 0.1,
    });
  });
});
