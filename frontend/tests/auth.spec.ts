import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should allow user to login and see profile', async ({ page }) => {
    // 1. Перейти на главную
    await page.goto('/');
    
    // 2. Перейти на страницу входа
    await page.click('text=Войти');
    await expect(page).toHaveURL('/login');

    // 3. Заполнить форму (используем данные из seed_demo)
    await page.fill('input[type="email"]', 'admin@example.com');
    await page.fill('input[type="password"]', 'admin-password-change-me');
    await page.click('button[type="submit"]');

    // 4. Проверить редирект на главную или в профиль
    // После логина в HeaderNav должен появиться никнейм
    await expect(page.locator('.header__user')).toBeVisible();
    
    // 5. Перейти в профиль
    await page.click('.header__user');
    await expect(page).toHaveURL('/profile');
    await expect(page.locator('h1')).toHaveText('Мой профиль');
    await expect(page.locator('input[placeholder="Как вас называть?"]')).toHaveValue('Главный Админ');
  });

  test('should protect profile route', async ({ page }) => {
    await page.goto('/profile');
    await expect(page).toHaveURL(/\/login.*/);
  });
});

test.describe('Catalog Interaction', () => {
  test('should show photos from backend', async ({ page }) => {
    await page.goto('/catalog');
    // Ждем появления хотя бы одной карточки фото
    const photoCard = page.locator('.photo-card');
    await expect(photoCard.first()).toBeVisible();
    
    // Проверяем наличие заголовка
    const title = await photoCard.first().locator('.photo-card__title').textContent();
    expect(title?.length).toBeGreaterThan(0);
  });
});
