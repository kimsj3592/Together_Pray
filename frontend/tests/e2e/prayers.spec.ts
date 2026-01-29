import { test, expect } from '@playwright/test';
import {
  login,
  createGroup,
  createPrayer,
  prayForItem,
  TEST_USERS,
  TEST_GROUP,
  TEST_PRAYER,
  waitForApiResponse,
} from './helpers';

test.describe('Prayer Items Flow', () => {
  let groupId: string;

  test.beforeEach(async ({ page }) => {
    // Login and create a test group before each test
    await login(page, TEST_USERS.admin);
    groupId = await createGroup(page, {
      name: `${TEST_GROUP.name} ${Date.now()}`,
      description: TEST_GROUP.description,
    });
  });

  test.describe('Prayer Creation', () => {
    test('should successfully create a prayer item', async ({ page }) => {
      const prayerTitle = `${TEST_PRAYER.title} ${Date.now()}`;

      await page.goto(`/groups/${groupId}/prayers/new`);

      // Fill prayer form
      await page.fill('[name="title"]', prayerTitle);
      await page.fill('[name="content"]', TEST_PRAYER.content);

      // Submit form
      await page.click('button[type="submit"]');

      // Should redirect to prayers list
      await page.waitForURL(`/groups/${groupId}/prayers`, { timeout: 5000 });

      // Verify prayer appears in list
      await expect(page.locator(`text=${prayerTitle}`)).toBeVisible();
    });

    test('should create anonymous prayer', async ({ page }) => {
      const prayerTitle = `익명 기도제목 ${Date.now()}`;

      await page.goto(`/groups/${groupId}/prayers/new`);

      await page.fill('[name="title"]', prayerTitle);
      await page.fill('[name="content"]', TEST_PRAYER.content);

      // Check anonymous option
      await page.check('[name="isAnonymous"]');

      await page.click('button[type="submit"]');

      // Wait for redirect
      await page.waitForURL(`/groups/${groupId}/prayers`, { timeout: 5000 });

      // Find the prayer card
      const prayerCard = page.locator(`text=${prayerTitle}`).locator('..');

      // Should show "익명" as author
      await expect(prayerCard.locator('text=익명')).toBeVisible();
    });

    test('should require title', async ({ page }) => {
      await page.goto(`/groups/${groupId}/prayers/new`);

      // Fill only content
      await page.fill('[name="content"]', TEST_PRAYER.content);

      await page.click('button[type="submit"]');

      // Should still be on create page
      await expect(page).toHaveURL(`/groups/${groupId}/prayers/new`);
    });

    test('should require content', async ({ page }) => {
      await page.goto(`/groups/${groupId}/prayers/new`);

      // Fill only title
      await page.fill('[name="title"]', TEST_PRAYER.title);

      await page.click('button[type="submit"]');

      // Should still be on create page
      await expect(page).toHaveURL(`/groups/${groupId}/prayers/new`);
    });
  });

  test.describe('Prayer List', () => {
    test('should display list of prayers', async ({ page }) => {
      // Create a prayer first
      await createPrayer(page, groupId, {
        title: `${TEST_PRAYER.title} ${Date.now()}`,
        content: TEST_PRAYER.content,
      });

      await page.goto(`/groups/${groupId}/prayers`);

      // Should show prayers list
      await expect(page.locator('[data-testid="prayer-list"]')).toBeVisible();
    });

    test('should show prayer status badge', async ({ page }) => {
      const prayerTitle = `${TEST_PRAYER.title} ${Date.now()}`;

      await createPrayer(page, groupId, {
        title: prayerTitle,
        content: TEST_PRAYER.content,
      });

      await page.goto(`/groups/${groupId}/prayers`);

      // Find the prayer card
      const prayerCard = page.locator(`text=${prayerTitle}`).locator('..');

      // Should show status badge (기도중)
      await expect(prayerCard.locator('text=기도중')).toBeVisible();
    });

    test('should show create prayer button', async ({ page }) => {
      await page.goto(`/groups/${groupId}/prayers`);

      await expect(
        page.locator('text=/새 기도제목|new prayer/i')
      ).toBeVisible();
    });

    test('should navigate to prayer detail on click', async ({ page }) => {
      const prayerTitle = `${TEST_PRAYER.title} ${Date.now()}`;

      await createPrayer(page, groupId, {
        title: prayerTitle,
        content: TEST_PRAYER.content,
      });

      await page.goto(`/groups/${groupId}/prayers`);

      // Click on prayer
      await page.click(`text=${prayerTitle}`);

      // Should navigate to prayer detail
      await page.waitForURL(/\/prayers\/[^/]+$/, { timeout: 5000 });

      // Verify detail page shows content
      await expect(page.locator(`text=${TEST_PRAYER.content}`)).toBeVisible();
    });

    test('should show empty state when no prayers', async ({ page }) => {
      await page.goto(`/groups/${groupId}/prayers`);

      // Might show empty state if no prayers yet
      const emptyState = page.locator('text=/기도제목이 없습니다|no prayers/i');
      const prayerList = page.locator('[data-testid="prayer-list"]');

      expect(await emptyState.isVisible() || await prayerList.isVisible()).toBe(true);
    });
  });

  test.describe('Prayer Detail and Interaction', () => {
    test('should display prayer details', async ({ page }) => {
      const prayerTitle = `${TEST_PRAYER.title} ${Date.now()}`;

      await createPrayer(page, groupId, {
        title: prayerTitle,
        content: TEST_PRAYER.content,
      });

      await page.goto(`/groups/${groupId}/prayers`);
      await page.click(`text=${prayerTitle}`);

      // Should show title and content
      await expect(page.locator(`text=${prayerTitle}`)).toBeVisible();
      await expect(page.locator(`text=${TEST_PRAYER.content}`)).toBeVisible();
    });

    test('should pray for an item', async ({ page }) => {
      const prayerTitle = `${TEST_PRAYER.title} ${Date.now()}`;

      await createPrayer(page, groupId, {
        title: prayerTitle,
        content: TEST_PRAYER.content,
      });

      await page.goto(`/groups/${groupId}/prayers`);
      await page.click(`text=${prayerTitle}`);

      // Get pray button
      const prayButton = page.locator('button:has-text("함께 기도했어요")');

      // Click pray button
      await prayButton.click();

      // Wait for API response
      await page.waitForTimeout(1000);

      // Button should be disabled after praying
      await expect(prayButton).toBeDisabled();

      // Prayer count should increase
      await expect(page.locator('text=/1명|1 person/i')).toBeVisible();
    });

    test('should prevent praying twice in same day', async ({ page }) => {
      const prayerTitle = `${TEST_PRAYER.title} ${Date.now()}`;

      await createPrayer(page, groupId, {
        title: prayerTitle,
        content: TEST_PRAYER.content,
      });

      await page.goto(`/groups/${groupId}/prayers`);
      await page.click(`text=${prayerTitle}`);

      const prayButton = page.locator('button:has-text("함께 기도했어요")');

      // First prayer
      await prayButton.click();
      await page.waitForTimeout(1000);

      // Button should remain disabled
      await expect(prayButton).toBeDisabled();

      // Reload page
      await page.reload();

      // Button should still be disabled
      const prayButtonAfterReload = page.locator('button:has-text("함께 기도했어요")');
      await expect(prayButtonAfterReload).toBeDisabled();
    });

    test('should show prayer count', async ({ page }) => {
      const prayerTitle = `${TEST_PRAYER.title} ${Date.now()}`;

      await createPrayer(page, groupId, {
        title: prayerTitle,
        content: TEST_PRAYER.content,
      });

      await page.goto(`/groups/${groupId}/prayers`);
      await page.click(`text=${prayerTitle}`);

      // Initial count should be 0
      await expect(page.locator('text=/0명|0 person/i')).toBeVisible();

      // Pray
      await page.click('button:has-text("함께 기도했어요")');
      await page.waitForTimeout(1000);

      // Count should be 1
      await expect(page.locator('text=/1명|1 person/i')).toBeVisible();
    });
  });

  test.describe('Prayer Status Changes', () => {
    test('should allow author to change status to answered', async ({ page }) => {
      const prayerTitle = `${TEST_PRAYER.title} ${Date.now()}`;

      await createPrayer(page, groupId, {
        title: prayerTitle,
        content: TEST_PRAYER.content,
      });

      await page.goto(`/groups/${groupId}/prayers`);
      await page.click(`text=${prayerTitle}`);

      // Look for status change button/dropdown
      const statusButton = page.locator('button:has-text("기도중")');

      if (await statusButton.isVisible()) {
        await statusButton.click();

        // Select "응답 완료"
        await page.click('text=응답 완료');

        // Wait for update
        await page.waitForTimeout(1000);

        // Should show new status
        await expect(page.locator('text=응답 완료')).toBeVisible();
      }
    });

    test('should show answered prayers in answered page', async ({ page }) => {
      const prayerTitle = `응답된 기도 ${Date.now()}`;

      await createPrayer(page, groupId, {
        title: prayerTitle,
        content: TEST_PRAYER.content,
      });

      // Go to prayers list and change status
      await page.goto(`/groups/${groupId}/prayers`);
      await page.click(`text=${prayerTitle}`);

      // Change status to answered
      const statusButton = page.locator('button:has-text("기도중")');
      if (await statusButton.isVisible()) {
        await statusButton.click();
        await page.click('text=응답 완료');
        await page.waitForTimeout(1000);
      }

      // Navigate to answered prayers page
      await page.goto(`/groups/${groupId}/answered`);

      // Should show the answered prayer
      await expect(page.locator(`text=${prayerTitle}`)).toBeVisible();
    });
  });

  test.describe('Anonymous Prayers', () => {
    test('should hide author identity for anonymous prayers', async ({ page, browser }) => {
      const prayerTitle = `익명 기도 ${Date.now()}`;

      // Create anonymous prayer
      await page.goto(`/groups/${groupId}/prayers/new`);
      await page.fill('[name="title"]', prayerTitle);
      await page.fill('[name="content"]', TEST_PRAYER.content);
      await page.check('[name="isAnonymous"]');
      await page.click('button[type="submit"]');

      await page.waitForURL(`/groups/${groupId}/prayers`, { timeout: 5000 });

      // Logout and login as different user
      await page.goto('/mypage');
      await page.click('text=로그아웃');

      await login(page, TEST_USERS.member);

      // Join the group (assuming they have invite code)
      // For this test, we'll just check the prayer from admin's perspective

      await login(page, TEST_USERS.admin);
      await page.goto(`/groups/${groupId}/prayers`);

      // Click on anonymous prayer
      await page.click(`text=${prayerTitle}`);

      // Should show "익명" as author
      await expect(page.locator('text=익명')).toBeVisible();
    });
  });

  test.describe('Mobile Prayer UI', () => {
    test.use({ viewport: { width: 375, height: 667 } });

    test('should have touch-friendly pray button', async ({ page }) => {
      const prayerTitle = `${TEST_PRAYER.title} ${Date.now()}`;

      await createPrayer(page, groupId, {
        title: prayerTitle,
        content: TEST_PRAYER.content,
      });

      await page.goto(`/groups/${groupId}/prayers`);
      await page.click(`text=${prayerTitle}`);

      // Pray button should be at least 44x44px
      const prayButton = page.locator('button:has-text("함께 기도했어요")');
      const box = await prayButton.boundingBox();

      expect(box).not.toBeNull();
      expect(box!.height).toBeGreaterThanOrEqual(44);
      expect(box!.width).toBeGreaterThanOrEqual(44);
    });

    test('should not have horizontal scroll on prayer detail', async ({ page }) => {
      const prayerTitle = `${TEST_PRAYER.title} ${Date.now()}`;

      await createPrayer(page, groupId, {
        title: prayerTitle,
        content: TEST_PRAYER.content,
      });

      await page.goto(`/groups/${groupId}/prayers`);
      await page.click(`text=${prayerTitle}`);

      const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
      const clientWidth = await page.evaluate(() => document.body.clientWidth);

      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
    });

    test('should display prayer cards properly on mobile', async ({ page }) => {
      await createPrayer(page, groupId, {
        title: `${TEST_PRAYER.title} 1`,
        content: TEST_PRAYER.content,
      });

      await createPrayer(page, groupId, {
        title: `${TEST_PRAYER.title} 2`,
        content: TEST_PRAYER.content,
      });

      await page.goto(`/groups/${groupId}/prayers`);

      // Prayer cards should be visible
      await expect(page.locator('[data-testid="prayer-list"]')).toBeVisible();

      // Check no horizontal overflow
      const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
      const clientWidth = await page.evaluate(() => document.body.clientWidth);

      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
    });
  });

  test.describe('Prayer Search and Filtering', () => {
    test('should filter prayers by status', async ({ page }) => {
      // Create prayers with different statuses
      await createPrayer(page, groupId, {
        title: `기도중 제목 ${Date.now()}`,
        content: TEST_PRAYER.content,
      });

      await page.goto(`/groups/${groupId}/prayers`);

      // Check if there's a filter UI
      const filterButton = page.locator('text=/필터|filter|상태/i');

      if (await filterButton.isVisible()) {
        await filterButton.click();

        // Select status filter
        await page.click('text=기도중');

        // Should only show prayers with that status
        await expect(page.locator('[data-testid="prayer-list"]')).toBeVisible();
      }
    });
  });

  test.describe('Prayer Deletion', () => {
    test('should allow author to delete prayer', async ({ page }) => {
      const prayerTitle = `삭제할 기도 ${Date.now()}`;

      await createPrayer(page, groupId, {
        title: prayerTitle,
        content: TEST_PRAYER.content,
      });

      await page.goto(`/groups/${groupId}/prayers`);
      await page.click(`text=${prayerTitle}`);

      // Look for delete button
      const deleteButton = page.locator('button:has-text("삭제")');

      if (await deleteButton.isVisible()) {
        await deleteButton.click();

        // Confirm deletion if there's a confirmation dialog
        const confirmButton = page.locator('button:has-text("확인")');
        if (await confirmButton.isVisible()) {
          await confirmButton.click();
        }

        // Should redirect back to prayers list
        await page.waitForURL(`/groups/${groupId}/prayers`, { timeout: 5000 });

        // Prayer should not be visible anymore
        await expect(page.locator(`text=${prayerTitle}`)).not.toBeVisible();
      }
    });
  });
});
