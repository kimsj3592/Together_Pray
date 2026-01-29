import { Page, expect } from '@playwright/test';

/**
 * Test helper utilities for Together Pray E2E tests
 */

export const TEST_USERS = {
  admin: {
    email: 'admin@test.com',
    password: 'password123',
    nickname: 'Test Admin',
  },
  member: {
    email: 'member@test.com',
    password: 'password123',
    nickname: 'Test Member',
  },
  newUser: {
    email: `test-${Date.now()}@test.com`,
    password: 'password123',
    nickname: `테스트유저${Date.now()}`,
  },
};

export const TEST_GROUP = {
  name: '테스트 소그룹',
  description: 'E2E 테스트용 그룹입니다',
};

export const TEST_PRAYER = {
  title: '테스트 기도제목',
  content: '이것은 E2E 테스트용 기도제목입니다.',
};

/**
 * Sign up a new user
 */
export async function signUp(
  page: Page,
  user: { email: string; password: string; nickname: string }
) {
  await page.goto('/signup');
  await page.fill('[name="email"]', user.email);
  await page.fill('[name="password"]', user.password);
  await page.fill('[name="nickname"]', user.nickname);
  await page.click('button[type="submit"]');

  // Wait for navigation to complete
  await page.waitForURL('/groups', { timeout: 5000 });
}

/**
 * Log in an existing user
 */
export async function login(
  page: Page,
  user: { email: string; password: string }
) {
  await page.goto('/login');
  await page.fill('[name="email"]', user.email);
  await page.fill('[name="password"]', user.password);
  await page.click('button[type="submit"]');

  // Wait for successful login redirect
  await page.waitForURL('/groups', { timeout: 5000 });
}

/**
 * Log out the current user
 */
export async function logout(page: Page) {
  // Navigate to a page with logout button (assuming mypage)
  await page.goto('/mypage');
  await page.click('text=로그아웃');

  // Should redirect to login page
  await page.waitForURL('/login', { timeout: 5000 });
}

/**
 * Create a new group and return the group ID
 */
export async function createGroup(
  page: Page,
  group: { name: string; description: string }
): Promise<string> {
  await page.goto('/groups/create');
  await page.fill('[name="name"]', group.name);
  await page.fill('[name="description"]', group.description);
  await page.click('button[type="submit"]');

  // Wait for redirect to group page
  await page.waitForURL(/\/groups\/[^/]+$/, { timeout: 5000 });

  // Extract group ID from URL
  const url = page.url();
  const match = url.match(/\/groups\/([^/]+)$/);
  return match ? match[1] : '';
}

/**
 * Create a prayer item in a group
 */
export async function createPrayer(
  page: Page,
  groupId: string,
  prayer: { title: string; content: string; isAnonymous?: boolean }
) {
  await page.goto(`/groups/${groupId}/prayers/new`);
  await page.fill('[name="title"]', prayer.title);
  await page.fill('[name="content"]', prayer.content);

  if (prayer.isAnonymous) {
    await page.check('[name="isAnonymous"]');
  }

  await page.click('button[type="submit"]');

  // Wait for redirect back to prayers list
  await page.waitForURL(`/groups/${groupId}/prayers`, { timeout: 5000 });
}

/**
 * Get invite code from group page
 */
export async function getInviteCode(page: Page, groupId: string): Promise<string> {
  await page.goto(`/groups/${groupId}`);

  // Look for invite code display
  const inviteCodeElement = await page.locator('text=/초대코드:|Invite Code:/i').locator('..').locator('code, span').first();
  const inviteCode = await inviteCodeElement.textContent();

  return inviteCode || '';
}

/**
 * Join a group using invite code
 */
export async function joinGroup(page: Page, inviteCode: string) {
  await page.goto('/groups/join');
  await page.fill('[name="inviteCode"]', inviteCode);
  await page.click('button[type="submit"]');

  // Wait for redirect to group page
  await page.waitForURL(/\/groups\/[^/]+$/, { timeout: 5000 });
}

/**
 * Click pray button on a prayer item
 */
export async function prayForItem(page: Page, prayerId: string) {
  await page.goto(`/prayers/${prayerId}`);

  const prayButton = page.locator('button:has-text("함께 기도했어요")');
  await prayButton.click();

  // Wait for success indication
  await expect(prayButton).toBeDisabled();
}

/**
 * Verify minimum touch target size (44x44px)
 */
export async function verifyTouchTargetSize(page: Page, selector: string) {
  const element = page.locator(selector).first();
  const box = await element.boundingBox();

  expect(box).not.toBeNull();
  expect(box!.width).toBeGreaterThanOrEqual(44);
  expect(box!.height).toBeGreaterThanOrEqual(44);
}

/**
 * Verify no horizontal scroll on mobile
 */
export async function verifyNoHorizontalScroll(page: Page) {
  const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
  const clientWidth = await page.evaluate(() => document.body.clientWidth);

  expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
}

/**
 * Wait for API response
 */
export async function waitForApiResponse(
  page: Page,
  urlPattern: string | RegExp,
  method: string = 'GET'
) {
  return page.waitForResponse(
    (response) =>
      (typeof urlPattern === 'string'
        ? response.url().includes(urlPattern)
        : urlPattern.test(response.url())) &&
      response.request().method() === method
  );
}
