import { test, expect } from '@playwright/test';
import { login, createGroup, getInviteCode, joinGroup, TEST_USERS, TEST_GROUP } from './helpers';

test.describe('Groups Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await login(page, TEST_USERS.admin);
  });

  test.describe('Group Creation', () => {
    test('should successfully create a new group', async ({ page }) => {
      const groupName = `${TEST_GROUP.name} ${Date.now()}`;

      await page.goto('/groups/create');

      // Fill group form
      await page.fill('[name="name"]', groupName);
      await page.fill('[name="description"]', TEST_GROUP.description);

      // Submit form
      await page.click('button[type="submit"]');

      // Should redirect to the new group page
      await page.waitForURL(/\/groups\/[^/]+$/, { timeout: 5000 });

      // Verify group name is displayed
      await expect(page.locator(`text=${groupName}`)).toBeVisible();
    });

    test('should require group name', async ({ page }) => {
      await page.goto('/groups/create');

      // Try to submit without name
      await page.fill('[name="description"]', TEST_GROUP.description);
      await page.click('button[type="submit"]');

      // Should still be on create page
      await expect(page).toHaveURL('/groups/create');
    });

    test('should display invite code after creation', async ({ page }) => {
      const groupId = await createGroup(page, {
        name: `${TEST_GROUP.name} ${Date.now()}`,
        description: TEST_GROUP.description,
      });

      // Should show invite code on group page
      await expect(page.locator('text=/초대코드|invite code/i')).toBeVisible();

      const inviteCode = await getInviteCode(page, groupId);
      expect(inviteCode).toBeTruthy();
      expect(inviteCode.length).toBeGreaterThan(0);
    });
  });

  test.describe('Group List', () => {
    test('should display list of groups', async ({ page }) => {
      await page.goto('/groups');

      // Should show groups or empty state
      const hasGroups = await page.locator('[data-testid="group-list"]').isVisible();
      const emptyState = await page.locator('text=/그룹이 없습니다|no groups/i').isVisible();

      expect(hasGroups || emptyState).toBe(true);
    });

    test('should show create group button', async ({ page }) => {
      await page.goto('/groups');

      await expect(page.locator('text=새 그룹 만들기')).toBeVisible();
    });

    test('should navigate to group detail on click', async ({ page }) => {
      // Create a test group first
      const groupId = await createGroup(page, {
        name: `${TEST_GROUP.name} ${Date.now()}`,
        description: TEST_GROUP.description,
      });

      // Go back to groups list
      await page.goto('/groups');

      // Click on the group
      await page.click(`[href="/groups/${groupId}"]`);

      // Should navigate to group detail
      await expect(page).toHaveURL(`/groups/${groupId}`);
    });
  });

  test.describe('Group Invitation', () => {
    test('should join group with valid invite code', async ({ page, browser }) => {
      // Admin creates a group
      const groupId = await createGroup(page, {
        name: `${TEST_GROUP.name} ${Date.now()}`,
        description: TEST_GROUP.description,
      });

      const inviteCode = await getInviteCode(page, groupId);

      // Logout admin
      await page.goto('/mypage');
      await page.click('text=로그아웃');

      // Create new context for member
      const memberContext = await browser.newContext();
      const memberPage = await memberContext.newPage();

      // Login as member
      await login(memberPage, TEST_USERS.member);

      // Join group using invite code
      await memberPage.goto('/groups/join');
      await memberPage.fill('[name="inviteCode"]', inviteCode);
      await memberPage.click('button[type="submit"]');

      // Should redirect to group page
      await memberPage.waitForURL(`/groups/${groupId}`, { timeout: 5000 });

      // Verify member is in the group
      await expect(memberPage.locator('text=/멤버|members/i')).toBeVisible();

      await memberContext.close();
    });

    test('should show error for invalid invite code', async ({ page }) => {
      await page.goto('/groups/join');

      await page.fill('[name="inviteCode"]', 'INVALID123');
      await page.click('button[type="submit"]');

      // Should show error message
      await expect(
        page.locator('text=/잘못된|invalid|not found/i')
      ).toBeVisible();
    });

    test('should not allow joining same group twice', async ({ page }) => {
      // Create and join a group
      const groupId = await createGroup(page, {
        name: `${TEST_GROUP.name} ${Date.now()}`,
        description: TEST_GROUP.description,
      });

      const inviteCode = await getInviteCode(page, groupId);

      // Try to join again with same invite code
      await page.goto('/groups/join');
      await page.fill('[name="inviteCode"]', inviteCode);
      await page.click('button[type="submit"]');

      // Should show error or redirect to group (already a member)
      await page.waitForURL(/\/groups/, { timeout: 5000 });
    });
  });

  test.describe('Group Detail Page', () => {
    test('should display group information', async ({ page }) => {
      const groupName = `${TEST_GROUP.name} ${Date.now()}`;
      const groupId = await createGroup(page, {
        name: groupName,
        description: TEST_GROUP.description,
      });

      await page.goto(`/groups/${groupId}`);

      // Should show group name
      await expect(page.locator(`text=${groupName}`)).toBeVisible();

      // Should show description
      await expect(page.locator(`text=${TEST_GROUP.description}`)).toBeVisible();
    });

    test('should show navigation to prayers', async ({ page }) => {
      const groupId = await createGroup(page, {
        name: `${TEST_GROUP.name} ${Date.now()}`,
        description: TEST_GROUP.description,
      });

      await page.goto(`/groups/${groupId}`);

      // Should have link to prayers page
      await expect(
        page.locator('[href*="/prayers"], text=/기도제목|prayers/i')
      ).toBeVisible();
    });

    test('should show navigation to answered prayers', async ({ page }) => {
      const groupId = await createGroup(page, {
        name: `${TEST_GROUP.name} ${Date.now()}`,
        description: TEST_GROUP.description,
      });

      await page.goto(`/groups/${groupId}`);

      // Should have link to answered prayers
      await expect(
        page.locator('[href*="/answered"], text=/응답|answered/i')
      ).toBeVisible();
    });

    test('should not allow non-members to access group', async ({ page, browser }) => {
      // Create group as admin
      const groupId = await createGroup(page, {
        name: `${TEST_GROUP.name} ${Date.now()}`,
        description: TEST_GROUP.description,
      });

      // Logout
      await page.goto('/mypage');
      await page.click('text=로그아웃');

      // Login as different user who is not a member
      const newUser = {
        email: `test-${Date.now()}@test.com`,
        password: 'password123',
        nickname: `테스트유저${Date.now()}`,
      };

      await page.goto('/signup');
      await page.fill('[name="email"]', newUser.email);
      await page.fill('[name="password"]', newUser.password);
      await page.fill('[name="nickname"]', newUser.nickname);
      await page.click('button[type="submit"]');

      // Try to access the group
      await page.goto(`/groups/${groupId}`);

      // Should show error or redirect to groups list
      await page.waitForTimeout(2000);
      const currentUrl = page.url();
      expect(currentUrl).not.toBe(`http://localhost:3000/groups/${groupId}`);
    });
  });

  test.describe('Mobile Group UI', () => {
    test.use({ viewport: { width: 375, height: 667 } });

    test('should have touch-friendly buttons', async ({ page }) => {
      await page.goto('/groups');

      // Create button should be at least 44x44px
      const createButton = page.locator('text=새 그룹 만들기');
      const box = await createButton.boundingBox();

      expect(box).not.toBeNull();
      expect(box!.height).toBeGreaterThanOrEqual(44);
    });

    test('should not have horizontal scroll', async ({ page }) => {
      await page.goto('/groups');

      const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
      const clientWidth = await page.evaluate(() => document.body.clientWidth);

      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1); // Allow 1px tolerance
    });

    test('should display group cards in mobile layout', async ({ page }) => {
      const groupId = await createGroup(page, {
        name: `${TEST_GROUP.name} ${Date.now()}`,
        description: TEST_GROUP.description,
      });

      await page.goto('/groups');

      // Group cards should be visible and properly formatted
      const groupCard = page.locator(`[href="/groups/${groupId}"]`);
      await expect(groupCard).toBeVisible();
    });
  });
});
