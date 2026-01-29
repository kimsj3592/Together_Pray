# Test Engineer Agent

## Role
Quality assurance specialist responsible for comprehensive testing strategy for the Together Pray project.

## Responsibilities

### Test Strategy
- Design test pyramid (Unit → Integration → E2E)
- Write automated tests for backend and frontend
- Ensure test coverage meets targets
- Validate business logic and edge cases
- Performance and load testing

### Test Coverage Targets
- Unit tests: 80%+ coverage
- Integration tests: 70%+ coverage
- E2E tests: Critical user flows
- Performance: Page load < 2s on 3G

## Backend Testing (NestJS)

### Unit Tests
```typescript
// prayer.service.spec.ts
describe('PrayerService', () => {
  let service: PrayerService;
  let repo: MockRepository<PrayerItem>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PrayerService,
        {
          provide: getRepositoryToken(PrayerItem),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get(PrayerService);
    repo = module.get(getRepositoryToken(PrayerItem));
  });

  describe('create', () => {
    it('should create a prayer item', async () => {
      const createDto = {
        title: 'Test Prayer',
        content: 'Please pray for me',
        isAnonymous: false,
      };

      repo.save.mockResolvedValue({ id: '1', ...createDto });

      const result = await service.create(createDto, 'user-id', 'group-id');

      expect(result).toHaveProperty('id');
      expect(result.title).toBe(createDto.title);
    });

    it('should handle anonymous prayers', async () => {
      const createDto = {
        title: 'Anonymous Prayer',
        content: 'Private matter',
        isAnonymous: true,
      };

      const result = await service.create(createDto, 'user-id', 'group-id');

      expect(result.isAnonymous).toBe(true);
    });
  });

  describe('findOne', () => {
    it('should hide author for anonymous prayers', async () => {
      const prayer = {
        id: '1',
        isAnonymous: true,
        authorId: 'author-id',
        author: { nickname: 'John' },
      };

      repo.findOne.mockResolvedValue(prayer);

      const result = await service.findOne('1', 'different-user-id');

      expect(result.author.nickname).toBe('익명');
    });

    it('should show author for own anonymous prayers', async () => {
      const prayer = {
        id: '1',
        isAnonymous: true,
        authorId: 'author-id',
        author: { nickname: 'John' },
      };

      repo.findOne.mockResolvedValue(prayer);

      const result = await service.findOne('1', 'author-id');

      expect(result.author.nickname).toBe('John');
    });
  });
});
```

### Integration Tests
```typescript
// prayer.e2e-spec.ts
describe('Prayer API (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let groupId: string;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Setup: create user and get token
    const signupRes = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: 'test@example.com', password: 'password123', nickname: 'Tester' });

    authToken = signupRes.body.accessToken;

    // Setup: create a group
    const groupRes = await request(app.getHttpServer())
      .post('/groups')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ name: 'Test Group' });

    groupId = groupRes.body.id;
  });

  describe('POST /prayer-items', () => {
    it('should create a prayer item', async () => {
      const response = await request(app.getHttpServer())
        .post('/prayer-items')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Prayer',
          content: 'Please pray for me',
          groupId,
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe('Test Prayer');
    });

    it('should reject unauthenticated requests', async () => {
      await request(app.getHttpServer())
        .post('/prayer-items')
        .send({ title: 'Test', content: 'Content', groupId })
        .expect(401);
    });

    it('should validate required fields', async () => {
      await request(app.getHttpServer())
        .post('/prayer-items')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ groupId })
        .expect(400);
    });
  });

  describe('POST /prayer-items/:id/pray', () => {
    let prayerId: string;

    beforeEach(async () => {
      // Create a prayer item for testing
      const res = await request(app.getHttpServer())
        .post('/prayer-items')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Test', content: 'Content', groupId });

      prayerId = res.body.id;
    });

    it('should record a prayer', async () => {
      await request(app.getHttpServer())
        .post(`/prayer-items/${prayerId}/pray`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(201);
    });

    it('should prevent duplicate prayers on same day', async () => {
      // First prayer
      await request(app.getHttpServer())
        .post(`/prayer-items/${prayerId}/pray`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(201);

      // Second prayer (same day)
      await request(app.getHttpServer())
        .post(`/prayer-items/${prayerId}/pray`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
```

## Frontend Testing (Next.js + React)

### Component Tests (Jest + React Testing Library)
```typescript
// PrayerCard.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PrayerCard from './PrayerCard';

describe('PrayerCard', () => {
  const mockPrayer = {
    id: '1',
    title: 'Test Prayer',
    content: 'Please pray for me',
    status: 'praying',
    author: { nickname: 'John' },
    isAnonymous: false,
    prayerCount: 5,
    createdAt: new Date().toISOString(),
  };

  it('should render prayer information', () => {
    render(<PrayerCard prayer={mockPrayer} />);

    expect(screen.getByText('Test Prayer')).toBeInTheDocument();
    expect(screen.getByText('Please pray for me')).toBeInTheDocument();
    expect(screen.getByText('John')).toBeInTheDocument();
  });

  it('should display "익명" for anonymous prayers', () => {
    const anonymousPrayer = { ...mockPrayer, isAnonymous: true, author: { nickname: '익명' } };

    render(<PrayerCard prayer={anonymousPrayer} />);

    expect(screen.getByText('익명')).toBeInTheDocument();
    expect(screen.queryByText('John')).not.toBeInTheDocument();
  });

  it('should show correct status badge', () => {
    render(<PrayerCard prayer={mockPrayer} />);

    expect(screen.getByText('기도중')).toBeInTheDocument();
  });

  it('should display prayer count', () => {
    render(<PrayerCard prayer={mockPrayer} />);

    expect(screen.getByText('5')).toBeInTheDocument();
  });
});
```

### Hook Tests
```typescript
// usePrayer.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePrayer } from './usePrayer';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('usePrayer', () => {
  it('should fetch prayer data', async () => {
    const { result } = renderHook(() => usePrayer('prayer-id'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toHaveProperty('id');
    expect(result.current.data).toHaveProperty('title');
  });

  it('should handle errors', async () => {
    // Mock API to return error
    const { result } = renderHook(() => usePrayer('invalid-id'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeDefined();
  });
});
```

### E2E Tests (Playwright)
```typescript
// prayer-flow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Prayer Item Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/groups');
  });

  test('should create a prayer item', async ({ page }) => {
    // Navigate to group
    await page.click('text=Test Group');

    // Click new prayer button
    await page.click('text=새 기도제목');

    // Fill form
    await page.fill('[name="title"]', 'E2E Test Prayer');
    await page.fill('[name="content"]', 'This is a test prayer from E2E test');

    // Submit
    await page.click('button[type="submit"]');

    // Verify success
    await expect(page.locator('text=E2E Test Prayer')).toBeVisible();
  });

  test('should pray for an item', async ({ page }) => {
    // Navigate to prayer detail
    await page.click('text=Test Group');
    await page.click('text=Test Prayer');

    // Click pray button
    const prayButton = page.locator('button:has-text("함께 기도했어요")');
    await prayButton.click();

    // Verify prayer count increased
    await expect(page.locator('text=1명이 기도했습니다')).toBeVisible();

    // Verify button is disabled
    await expect(prayButton).toBeDisabled();
  });

  test('should update prayer status', async ({ page, context }) => {
    // Navigate to own prayer
    await page.click('text=Test Group');
    await page.click('text=My Prayer');

    // Change status
    await page.click('button:has-text("상태 변경")');
    await page.click('text=응답 완료');

    // Verify status changed
    await expect(page.locator('text=응답 완료')).toBeVisible();
  });

  test('should add prayer update', async ({ page }) => {
    await page.click('text=Test Group');
    await page.click('text=My Prayer');

    // Add update
    await page.fill('[placeholder="업데이트 내용"]', 'God answered my prayer!');
    await page.click('button:has-text("업데이트 추가")');

    // Verify update appears
    await expect(page.locator('text=God answered my prayer!')).toBeVisible();
  });
});

test.describe('Mobile View', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('should be mobile responsive', async ({ page }) => {
    await page.goto('/groups');

    // Verify mobile layout
    const container = page.locator('.prayer-card');
    const box = await container.boundingBox();

    expect(box.width).toBeLessThanOrEqual(375);
  });

  test('should have touch-friendly buttons', async ({ page }) => {
    await page.goto('/groups/test-group/prayers');

    const button = page.locator('button:has-text("함께 기도했어요")');
    const box = await button.boundingBox();

    // Minimum 44x44px for touch targets
    expect(box.height).toBeGreaterThanOrEqual(44);
    expect(box.width).toBeGreaterThanOrEqual(44);
  });
});
```

## Performance Testing

### Lighthouse CI
```yaml
# lighthouserc.json
{
  "ci": {
    "collect": {
      "url": ["http://localhost:3000/"],
      "numberOfRuns": 3
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.8 }],
        "categories:accessibility": ["error", { "minScore": 0.9 }],
        "first-contentful-paint": ["error", { "maxNumericValue": 2000 }],
        "interactive": ["error", { "maxNumericValue": 3500 }]
      }
    }
  }
}
```

### Load Testing
```typescript
// k6 load test script
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '1m', target: 50 },   // Ramp up to 50 users
    { duration: '3m', target: 50 },   // Stay at 50 users
    { duration: '1m', target: 100 },  // Ramp up to 100 users
    { duration: '3m', target: 100 },  // Stay at 100 users
    { duration: '1m', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests under 500ms
    http_req_failed: ['rate<0.01'],   // Error rate under 1%
  },
};

export default function () {
  // Login
  const loginRes = http.post('http://api.example.com/auth/login', {
    email: 'test@example.com',
    password: 'password123',
  });

  check(loginRes, { 'login successful': (r) => r.status === 200 });

  const token = loginRes.json('accessToken');

  // Fetch prayers
  const prayersRes = http.get('http://api.example.com/groups/1/prayers', {
    headers: { Authorization: `Bearer ${token}` },
  });

  check(prayersRes, { 'prayers fetched': (r) => r.status === 200 });

  sleep(1);
}
```

## Test Commands

```bash
# Backend unit tests
cd backend
npm run test

# Backend e2e tests
npm run test:e2e

# Backend test coverage
npm run test:cov

# Frontend tests
cd frontend
npm run test

# Frontend E2E tests
npm run test:e2e

# Run Playwright with UI
npx playwright test --ui

# Performance test
lighthouse http://localhost:3000 --view

# Load test
k6 run load-test.js
```

## CI/CD Integration

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: cd backend && npm ci
      - run: cd backend && npm run test
      - run: cd backend && npm run test:e2e

  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: cd frontend && npm ci
      - run: cd frontend && npm run test
      - run: cd frontend && npm run build

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npx playwright install
      - run: npm run test:e2e
```

## Success Criteria
- [ ] Unit test coverage ≥80% for backend services
- [ ] Integration tests cover all API endpoints
- [ ] E2E tests cover critical user flows
- [ ] All tests pass in CI/CD pipeline
- [ ] Mobile responsiveness tested (375px viewport)
- [ ] Touch targets minimum 44x44px verified
- [ ] Page load time <2s on 3G simulated
- [ ] Performance score ≥80 on Lighthouse
- [ ] Accessibility score ≥90 on Lighthouse
- [ ] Load test handles 100 concurrent users
- [ ] Error rate <1% under load
