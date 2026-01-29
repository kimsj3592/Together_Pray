import { test, expect } from '@playwright/test';
import { signUp, login, logout, TEST_USERS } from './helpers';

test.describe('Authentication Flow', () => {
  test.describe('Sign Up', () => {
    test('should successfully sign up a new user', async ({ page }) => {
      const newUser = {
        email: `test-${Date.now()}@test.com`,
        password: 'password123',
        nickname: `테스트유저${Date.now()}`,
      };

      await page.goto('/signup');

      // Fill signup form
      await page.fill('[name="email"]', newUser.email);
      await page.fill('[name="password"]', newUser.password);
      await page.fill('[name="nickname"]', newUser.nickname);

      // Submit form
      await page.click('button[type="submit"]');

      // Should redirect to groups page after successful signup
      await expect(page).toHaveURL('/groups', { timeout: 5000 });

      // Verify user is logged in (check for some authenticated UI element)
      await expect(page.locator('text=새 그룹 만들기')).toBeVisible();
    });

    test('should show error for duplicate email', async ({ page }) => {
      // Try to sign up with existing user email
      await page.goto('/signup');

      await page.fill('[name="email"]', TEST_USERS.admin.email);
      await page.fill('[name="password"]', 'password123');
      await page.fill('[name="nickname"]', 'Test User');

      await page.click('button[type="submit"]');

      // Should show error message
      await expect(page.locator('text=/이미 존재|already exists|duplicate/i')).toBeVisible();
    });

    test('should validate email format', async ({ page }) => {
      await page.goto('/signup');

      await page.fill('[name="email"]', 'invalid-email');
      await page.fill('[name="password"]', 'password123');
      await page.fill('[name="nickname"]', 'Test User');

      await page.click('button[type="submit"]');

      // Should show validation error or prevent submission
      const emailInput = page.locator('[name="email"]');
      const validationMessage = await emailInput.evaluate(
        (el: HTMLInputElement) => el.validationMessage
      );

      expect(validationMessage).toBeTruthy();
    });

    test('should require all fields', async ({ page }) => {
      await page.goto('/signup');

      // Try to submit without filling fields
      const submitButton = page.locator('button[type="submit"]');
      await submitButton.click();

      // Form should not submit - still on signup page
      await expect(page).toHaveURL('/signup');
    });
  });

  test.describe('Login', () => {
    test('should successfully login with valid credentials', async ({ page }) => {
      await page.goto('/login');

      await page.fill('[name="email"]', TEST_USERS.admin.email);
      await page.fill('[name="password"]', TEST_USERS.admin.password);

      await page.click('button[type="submit"]');

      // Should redirect to groups page
      await expect(page).toHaveURL('/groups', { timeout: 5000 });
    });

    test('should show error for invalid email', async ({ page }) => {
      await page.goto('/login');

      await page.fill('[name="email"]', 'nonexistent@test.com');
      await page.fill('[name="password"]', 'wrongpassword');

      await page.click('button[type="submit"]');

      // Should show error message
      await expect(
        page.locator('text=/잘못된|invalid|incorrect|not found/i')
      ).toBeVisible();
    });

    test('should show error for wrong password', async ({ page }) => {
      await page.goto('/login');

      await page.fill('[name="email"]', TEST_USERS.admin.email);
      await page.fill('[name="password"]', 'wrongpassword');

      await page.click('button[type="submit"]');

      // Should show error message
      await expect(
        page.locator('text=/잘못된|invalid|incorrect|wrong/i')
      ).toBeVisible();
    });

    test('should persist login after page reload', async ({ page }) => {
      await login(page, TEST_USERS.admin);

      // Reload the page
      await page.reload();

      // Should still be logged in
      await expect(page).toHaveURL('/groups');
      await expect(page.locator('text=새 그룹 만들기')).toBeVisible();
    });
  });

  test.describe('Logout', () => {
    test('should successfully logout', async ({ page }) => {
      // First login
      await login(page, TEST_USERS.admin);

      // Navigate to mypage
      await page.goto('/mypage');

      // Click logout button
      await page.click('text=로그아웃');

      // Should redirect to login page
      await expect(page).toHaveURL('/login', { timeout: 5000 });

      // Try to access protected route
      await page.goto('/groups');

      // Should redirect back to login
      await expect(page).toHaveURL('/login');
    });
  });

  test.describe('Protected Routes', () => {
    test('should redirect to login when accessing groups without auth', async ({
      page,
    }) => {
      await page.goto('/groups');

      // Should redirect to login page
      await expect(page).toHaveURL('/login', { timeout: 5000 });
    });

    test('should redirect to login when accessing mypage without auth', async ({
      page,
    }) => {
      await page.goto('/mypage');

      // Should redirect to login page
      await expect(page).toHaveURL('/login', { timeout: 5000 });
    });

    test('should allow access to login and signup without auth', async ({
      page,
    }) => {
      await page.goto('/login');
      await expect(page).toHaveURL('/login');

      await page.goto('/signup');
      await expect(page).toHaveURL('/signup');
    });
  });

  test.describe('Token Expiration', () => {
    test('should handle expired token gracefully', async ({ page }) => {
      await login(page, TEST_USERS.admin);

      // Manually set an expired token in localStorage
      await page.evaluate(() => {
        localStorage.setItem('token', 'expired.token.here');
      });

      // Try to access protected route
      await page.goto('/groups');

      // Should redirect to login or show error
      await page.waitForURL(/login/, { timeout: 5000 });
    });
  });
});
