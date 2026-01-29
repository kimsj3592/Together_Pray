# Together Pray E2E Tests

Comprehensive end-to-end testing suite for the Together Pray frontend application using Playwright.

## Test Coverage

### 1. Authentication Flow (`auth.spec.ts`)
- Sign up new users
- Login with valid credentials
- Error handling for invalid credentials
- Logout functionality
- Protected route access control
- Token expiration handling

### 2. Groups Flow (`groups.spec.ts`)
- Group creation
- Group list display
- Invite code generation
- Joining groups via invite code
- Group detail pages
- Mobile-responsive group UI
- Access control for non-members

### 3. Prayer Items Flow (`prayers.spec.ts`)
- Prayer item creation (regular and anonymous)
- Prayer list display
- Prayer detail pages
- "Prayed together" functionality
- Daily prayer limit enforcement
- Prayer status changes (기도중 → 응답 완료)
- Answered prayers collection
- Mobile-responsive prayer UI
- Prayer deletion

### 4. MyPage Flow (`mypage.spec.ts`)
- User profile display
- My prayer items list
- Profile editing
- Group participation list
- Activity statistics
- Logout functionality
- Mobile-responsive profile UI

## Setup

### Install Dependencies
```bash
npm install
```

### Install Playwright Browsers
```bash
npx playwright install chromium
```

## Running Tests

### Run all tests
```bash
npm run test
```

### Run tests in UI mode (interactive)
```bash
npm run test:ui
```

### Run tests in headed mode (see browser)
```bash
npm run test:headed
```

### Run tests in debug mode
```bash
npm run test:debug
```

### Run specific test file
```bash
npx playwright test auth.spec.ts
```

### Run specific test case
```bash
npx playwright test -g "should successfully login"
```

### View test report
```bash
npm run test:report
```

## Test Configuration

The tests are configured in `playwright.config.ts`:

- **Base URL**: `http://localhost:3000`
- **Browsers**: Desktop Chrome, Mobile Chrome (Pixel 5), Mobile Safari (iPhone 12)
- **Timeout**: 30 seconds per test
- **Retries**: 2 on CI, 0 locally
- **Screenshots**: On failure only
- **Trace**: On first retry

## Mobile Testing

All tests include mobile viewport testing to ensure:
- Touch targets are minimum 44x44px
- No horizontal scrolling
- Proper mobile layout
- Touch-friendly interactions

## Test Helpers

The `helpers.ts` file provides reusable utilities:

- `signUp()` - Register a new user
- `login()` - Authenticate existing user
- `logout()` - End user session
- `createGroup()` - Create test group
- `createPrayer()` - Create test prayer item
- `getInviteCode()` - Extract group invite code
- `joinGroup()` - Join group via invite code
- `prayForItem()` - Click pray button
- `verifyTouchTargetSize()` - Validate minimum touch size
- `verifyNoHorizontalScroll()` - Check responsive layout
- `waitForApiResponse()` - Wait for API calls

## Test Data

Test data is defined in `helpers.ts`:

```typescript
TEST_USERS = {
  admin: { email: 'admin@test.com', ... },
  member: { email: 'member@test.com', ... },
  newUser: { email: 'test-{timestamp}@test.com', ... }
}

TEST_GROUP = {
  name: '테스트 소그룹',
  description: 'E2E 테스트용 그룹입니다'
}

TEST_PRAYER = {
  title: '테스트 기도제목',
  content: '이것은 E2E 테스트용 기도제목입니다.'
}
```

## Prerequisites

Before running E2E tests, ensure:

1. **Backend is running** on `http://localhost:4000` (or configured API URL)
2. **Database is seeded** with test users (admin@test.com, member@test.com)
3. **Frontend dev server** is running on `http://localhost:3000`

The tests will automatically start the frontend dev server if not already running.

## CI/CD Integration

The tests are configured for CI environments:

```yaml
# .github/workflows/e2e.yml example
- name: Install dependencies
  run: npm ci

- name: Install Playwright Browsers
  run: npx playwright install --with-deps chromium

- name: Run Playwright tests
  run: npm run test
```

## Debugging Tests

### Visual debugging
```bash
npm run test:ui
```

### Console debugging
Add `await page.pause()` in your test to pause execution.

### Screenshots and traces
Tests automatically capture screenshots on failure and traces on first retry.

View traces:
```bash
npx playwright show-trace test-results/[test-name]/trace.zip
```

## Best Practices

1. **Use test helpers** - Reuse helper functions instead of duplicating setup code
2. **Wait for navigation** - Always use `page.waitForURL()` after actions that navigate
3. **Use data-testid** - Add `data-testid` attributes for reliable selectors
4. **Test mobile first** - Mobile viewport should be primary test target
5. **Independent tests** - Each test should be isolated and not depend on others
6. **Clean up** - Tests automatically reset state between runs

## Known Issues

- Some tests may fail if backend is not running
- Tests require specific test users to be seeded in database
- Some UI elements may not have unique selectors yet (use data-testid)

## Future Improvements

- [ ] Add visual regression testing
- [ ] Implement API mocking for isolated frontend tests
- [ ] Add performance metrics collection
- [ ] Add accessibility testing with axe-core
- [ ] Add network condition testing (slow 3G, offline)
- [ ] Add cross-browser testing (Firefox, Safari)
- [ ] Add parallel test execution
- [ ] Add test coverage reporting
