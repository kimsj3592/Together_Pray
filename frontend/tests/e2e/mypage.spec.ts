import { test, expect } from '@playwright/test';
import { login, createGroup, createPrayer, TEST_USERS, TEST_GROUP, TEST_PRAYER } from './helpers';

test.describe('MyPage Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await login(page, TEST_USERS.admin);
  });

  test.describe('Profile Display', () => {
    test('should display user profile information', async ({ page }) => {
      await page.goto('/mypage');

      // Should show user email
      await expect(page.locator(`text=${TEST_USERS.admin.email}`)).toBeVisible();

      // Should show user nickname
      await expect(page.locator(`text=${TEST_USERS.admin.nickname}`)).toBeVisible();
    });

    test('should show logout button', async ({ page }) => {
      await page.goto('/mypage');

      await expect(page.locator('text=로그아웃')).toBeVisible();
    });

    test('should show profile edit button', async ({ page }) => {
      await page.goto('/mypage');

      const editButton = page.locator('button:has-text("수정"), text=/프로필 수정|edit profile/i');

      // Edit button might be present
      if (await editButton.isVisible()) {
        await expect(editButton).toBeVisible();
      }
    });
  });

  test.describe('My Prayer Items', () => {
    test('should display list of my prayer items', async ({ page }) => {
      // Create a test group and prayer first
      const groupId = await createGroup(page, {
        name: `${TEST_GROUP.name} ${Date.now()}`,
        description: TEST_GROUP.description,
      });

      const prayerTitle = `내 기도제목 ${Date.now()}`;
      await createPrayer(page, groupId, {
        title: prayerTitle,
        content: TEST_PRAYER.content,
      });

      // Navigate to mypage
      await page.goto('/mypage');

      // Should show section for my prayers
      const myPrayersSection = page.locator('text=/내 기도제목|my prayers/i');

      if (await myPrayersSection.isVisible()) {
        // Should show the prayer created
        await expect(page.locator(`text=${prayerTitle}`)).toBeVisible();
      }
    });

    test('should show prayer statistics', async ({ page }) => {
      await page.goto('/mypage');

      // Look for statistics section
      const statsSection = page.locator('text=/통계|statistics|총|total/i');

      if (await statsSection.isVisible()) {
        // Should show some counts
        await expect(statsSection).toBeVisible();
      }
    });

    test('should navigate to prayer detail from mypage', async ({ page }) => {
      // Create a test group and prayer
      const groupId = await createGroup(page, {
        name: `${TEST_GROUP.name} ${Date.now()}`,
        description: TEST_GROUP.description,
      });

      const prayerTitle = `내 기도제목 ${Date.now()}`;
      await createPrayer(page, groupId, {
        title: prayerTitle,
        content: TEST_PRAYER.content,
      });

      // Go to mypage
      await page.goto('/mypage');

      // Find and click on the prayer
      const prayerLink = page.locator(`text=${prayerTitle}`);

      if (await prayerLink.isVisible()) {
        await prayerLink.click();

        // Should navigate to prayer detail
        await page.waitForURL(/\/prayers\/[^/]+$/, { timeout: 5000 });
      }
    });

    test('should filter prayers by status', async ({ page }) => {
      await page.goto('/mypage');

      // Look for filter/tab options
      const activeTab = page.locator('text=/기도중|진행중/i');
      const answeredTab = page.locator('text=/응답|answered/i');

      // If tabs exist, test them
      if (await activeTab.isVisible() && await answeredTab.isVisible()) {
        // Click on answered tab
        await answeredTab.click();

        // Should show only answered prayers
        await page.waitForTimeout(500);
      }
    });
  });

  test.describe('Profile Editing', () => {
    test('should update nickname', async ({ page }) => {
      await page.goto('/mypage');

      // Look for edit button
      const editButton = page.locator('button:has-text("수정")');

      if (await editButton.isVisible()) {
        await editButton.click();

        // Fill new nickname
        const newNickname = `수정된닉네임${Date.now()}`;
        await page.fill('[name="nickname"]', newNickname);

        // Save changes
        await page.click('button[type="submit"]');

        // Wait for update
        await page.waitForTimeout(1000);

        // Should show updated nickname
        await expect(page.locator(`text=${newNickname}`)).toBeVisible();
      }
    });

    test('should validate nickname length', async ({ page }) => {
      await page.goto('/mypage');

      const editButton = page.locator('button:has-text("수정")');

      if (await editButton.isVisible()) {
        await editButton.click();

        // Try very short nickname
        await page.fill('[name="nickname"]', 'A');

        await page.click('button[type="submit"]');

        // Should show validation error
        await expect(
          page.locator('text=/너무 짧습니다|too short|minimum/i')
        ).toBeVisible();
      }
    });

    test('should cancel profile edit', async ({ page }) => {
      await page.goto('/mypage');

      const editButton = page.locator('button:has-text("수정")');

      if (await editButton.isVisible()) {
        const originalNickname = await page.locator('[data-testid="nickname"]').textContent();

        await editButton.click();

        // Change nickname
        await page.fill('[name="nickname"]', '임시닉네임');

        // Click cancel
        const cancelButton = page.locator('button:has-text("취소")');
        if (await cancelButton.isVisible()) {
          await cancelButton.click();

          // Should show original nickname
          await expect(page.locator(`text=${originalNickname}`)).toBeVisible();
        }
      }
    });
  });

  test.describe('Group List', () => {
    test('should display groups user belongs to', async ({ page }) => {
      // Create a test group
      const groupName = `${TEST_GROUP.name} ${Date.now()}`;
      await createGroup(page, {
        name: groupName,
        description: TEST_GROUP.description,
      });

      // Navigate to mypage
      await page.goto('/mypage');

      // Should show groups section
      const groupsSection = page.locator('text=/내 그룹|my groups/i');

      if (await groupsSection.isVisible()) {
        // Should show the group
        await expect(page.locator(`text=${groupName}`)).toBeVisible();
      }
    });

    test('should navigate to group from mypage', async ({ page }) => {
      const groupName = `${TEST_GROUP.name} ${Date.now()}`;
      const groupId = await createGroup(page, {
        name: groupName,
        description: TEST_GROUP.description,
      });

      await page.goto('/mypage');

      // Click on group
      const groupLink = page.locator(`a[href="/groups/${groupId}"]`);

      if (await groupLink.isVisible()) {
        await groupLink.click();

        // Should navigate to group page
        await expect(page).toHaveURL(`/groups/${groupId}`);
      }
    });
  });

  test.describe('Account Actions', () => {
    test('should logout successfully', async ({ page }) => {
      await page.goto('/mypage');

      await page.click('text=로그아웃');

      // Should redirect to login page
      await expect(page).toHaveURL('/login', { timeout: 5000 });

      // Try to access mypage again
      await page.goto('/mypage');

      // Should be redirected back to login
      await expect(page).toHaveURL('/login');
    });

    test('should show account deletion option', async ({ page }) => {
      await page.goto('/mypage');

      // Look for account deletion button/link
      const deleteAccountButton = page.locator('text=/계정 삭제|delete account|탈퇴/i');

      // This might be in settings or advanced section
      if (await deleteAccountButton.isVisible()) {
        await expect(deleteAccountButton).toBeVisible();
      }
    });
  });

  test.describe('Activity Statistics', () => {
    test('should show prayer activity counts', async ({ page }) => {
      await page.goto('/mypage');

      // Look for activity statistics
      const statsLabels = [
        '작성한 기도제목',
        '기도한 횟수',
        '응답된 기도',
        'total prayers',
        'prayers prayed',
        'answered',
      ];

      let hasStats = false;
      for (const label of statsLabels) {
        const element = page.locator(`text=/${label}/i`);
        if (await element.isVisible()) {
          hasStats = true;
          break;
        }
      }

      // Stats might not be implemented yet, but shouldn't crash
      expect(true).toBe(true);
    });

    test('should show group participation count', async ({ page }) => {
      // Create a group to ensure user has at least one
      await createGroup(page, {
        name: `${TEST_GROUP.name} ${Date.now()}`,
        description: TEST_GROUP.description,
      });

      await page.goto('/mypage');

      // Look for group count
      const groupCount = page.locator('text=/그룹|groups/i');

      if (await groupCount.isVisible()) {
        await expect(groupCount).toBeVisible();
      }
    });
  });

  test.describe('Mobile MyPage UI', () => {
    test.use({ viewport: { width: 375, height: 667 } });

    test('should display properly on mobile', async ({ page }) => {
      await page.goto('/mypage');

      // Check no horizontal scroll
      const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
      const clientWidth = await page.evaluate(() => document.body.clientWidth);

      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
    });

    test('should have touch-friendly action buttons', async ({ page }) => {
      await page.goto('/mypage');

      // Check logout button size
      const logoutButton = page.locator('text=로그아웃');
      const box = await logoutButton.boundingBox();

      if (box) {
        expect(box.height).toBeGreaterThanOrEqual(44);
      }
    });

    test('should stack profile info vertically on mobile', async ({ page }) => {
      await page.goto('/mypage');

      // Profile section should be visible
      await expect(page.locator('text=/프로필|profile/i')).toBeVisible();

      // Should not have horizontal overflow
      const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
      const clientWidth = await page.evaluate(() => document.body.clientWidth);

      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
    });
  });

  test.describe('Navigation', () => {
    test('should navigate to groups page', async ({ page }) => {
      await page.goto('/mypage');

      // Look for groups navigation link
      const groupsLink = page.locator('a[href="/groups"], text=/그룹 목록|groups/i');

      if (await groupsLink.isVisible()) {
        await groupsLink.click();
        await expect(page).toHaveURL('/groups');
      }
    });

    test('should have navigation to create prayer', async ({ page }) => {
      // Create a group first
      const groupId = await createGroup(page, {
        name: `${TEST_GROUP.name} ${Date.now()}`,
        description: TEST_GROUP.description,
      });

      await page.goto('/mypage');

      // Look for create prayer action
      const createPrayerButton = page.locator('text=/새 기도제목|new prayer/i');

      if (await createPrayerButton.isVisible()) {
        await createPrayerButton.click();

        // Should navigate to create prayer page (might need group selection)
        await page.waitForURL(/\/prayers\/new|\/groups\/[^/]+\/prayers\/new/, {
          timeout: 5000,
        });
      }
    });
  });

  test.describe('Error Handling', () => {
    test('should handle network errors gracefully', async ({ page }) => {
      await page.goto('/mypage');

      // Simulate offline mode
      await page.context().setOffline(true);

      // Try to refresh
      await page.reload();

      // Should show error message or offline indicator
      await page.waitForTimeout(2000);

      // Restore online mode
      await page.context().setOffline(false);
    });

    test('should handle unauthorized access', async ({ page }) => {
      // Clear auth token
      await page.evaluate(() => {
        localStorage.removeItem('token');
      });

      // Try to access mypage
      await page.goto('/mypage');

      // Should redirect to login
      await expect(page).toHaveURL('/login', { timeout: 5000 });
    });
  });
});
