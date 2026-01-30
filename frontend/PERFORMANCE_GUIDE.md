# Performance Optimization Guide

Together Pray v2.0 성능 최적화 가이드

## 목표

- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1
- **TTFB** (Time to First Byte): < 800ms

---

## 1. 이미지 최적화

### Next.js Image 컴포넌트 사용

**권장 사항**:
```tsx
import Image from 'next/image';

// 정적 이미지
<Image
  src="/images/prayer-bg.jpg"
  alt="기도 배경 이미지"
  width={800}
  height={600}
  priority // LCP 이미지에만 사용
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>

// 동적 이미지 (사용자 프로필 등)
<Image
  src={user.avatarUrl}
  alt={`${user.name}의 프로필`}
  fill
  sizes="(max-width: 768px) 40px, 48px"
  className="object-cover rounded-full"
  loading="lazy" // 기본값, LCP가 아닌 이미지
/>
```

### 이미지 형식

- **WebP 우선**: 더 작은 파일 크기, 우수한 압축
- **AVIF**: 최신 브라우저 지원 시 사용
- **Fallback**: JPEG/PNG

### 체크리스트

- [ ] 모든 `<img>` 태그를 `next/image`로 교체
- [ ] `priority` 속성은 LCP 이미지에만 사용
- [ ] 적절한 `sizes` 속성 지정
- [ ] 불필요한 `priority` 제거 (페이지당 1-2개만)
- [ ] 이미지 압축 (TinyPNG, ImageOptim 등)

---

## 2. 코드 스플리팅 (Code Splitting)

### 동적 임포트

**무거운 컴포넌트 지연 로드**:

```tsx
import dynamic from 'next/dynamic';

// 클라이언트 전용 컴포넌트 (SSR 비활성화)
const BottomSheet = dynamic(
  () => import('@/components/layout/BottomSheet'),
  { ssr: false }
);

// 로딩 상태와 함께
const RichTextEditor = dynamic(
  () => import('@/components/RichTextEditor'),
  {
    loading: () => <Skeleton className="h-32" />,
    ssr: false,
  }
);

// 조건부 로딩
const AdminPanel = dynamic(
  () => import('@/components/AdminPanel'),
  { ssr: false }
);

function Dashboard() {
  const { user } = useAuth();

  return (
    <div>
      {user.isAdmin && <AdminPanel />}
    </div>
  );
}
```

### 적용 대상

- [ ] Modal/BottomSheet 컴포넌트
- [ ] 차트/그래프 라이브러리
- [ ] 리치 텍스트 에디터
- [ ] 이모지 피커
- [ ] 날짜 피커
- [ ] 지도 컴포넌트

---

## 3. 번들 크기 최적화

### 번들 분석

```bash
# package.json에 이미 추가됨
npm run analyze
```

### 최적화 전략

1. **Tree Shaking**:
```tsx
// 나쁜 예
import _ from 'lodash';

// 좋은 예
import debounce from 'lodash/debounce';
```

2. **중복 제거**:
```bash
# 중복 패키지 확인
npm ls lucide-react
npm dedupe
```

3. **불필요한 의존성 제거**:
```bash
npm uninstall unused-package
```

### 체크리스트

- [ ] 번들 분석 실행 및 큰 패키지 확인
- [ ] Tree-shakable 임포트 사용
- [ ] 중복 의존성 제거
- [ ] `next.config.js`에서 번들 최적화 설정

---

## 4. React 성능 최적화

### React.memo 사용

**적용 대상**:
```tsx
import { memo } from 'react';

// 자주 리렌더링되는 리스트 아이템
export const PrayerCard = memo(({ item, onPraySuccess }) => {
  // ...
}, (prevProps, nextProps) => {
  // Custom comparison (선택적)
  return prevProps.item.id === nextProps.item.id &&
         prevProps.item.prayCount === nextProps.item.prayCount;
});

// 복잡한 컴포넌트
export const GroupCard = memo(GroupCardComponent);
```

### useMemo & useCallback

```tsx
import { useMemo, useCallback } from 'react';

function PrayerList({ prayers, filter }) {
  // 비용이 큰 계산 메모이제이션
  const filteredPrayers = useMemo(() => {
    return prayers.filter(p => p.status === filter);
  }, [prayers, filter]);

  // 콜백 메모이제이션 (자식 컴포넌트에 전달 시)
  const handlePray = useCallback((id) => {
    // ...
  }, [/* dependencies */]);

  return (
    <div>
      {filteredPrayers.map(prayer => (
        <PrayerCard
          key={prayer.id}
          item={prayer}
          onPray={handlePray}
        />
      ))}
    </div>
  );
}
```

### 적용 체크리스트

- [ ] PrayerCard에 `React.memo` 적용
- [ ] GroupCard에 `React.memo` 적용
- [ ] 리스트 필터링에 `useMemo` 적용
- [ ] 이벤트 핸들러에 `useCallback` 적용
- [ ] 불필요한 상태 업데이트 제거

---

## 5. API 요청 최적화

### SWR/React Query 캐싱

```tsx
import useSWR from 'swr';

function PrayerDetail({ id }) {
  const { data, error, isLoading, mutate } = useSWR(
    `/api/prayers/${id}`,
    fetcher,
    {
      // 캐싱 설정
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 5000,
      // 백그라운드 재검증
      refreshInterval: 30000, // 30초
    }
  );

  // 낙관적 업데이트
  const handlePray = async () => {
    mutate(
      { ...data, prayCount: data.prayCount + 1 },
      false // 재검증 비활성화
    );

    try {
      await api.pray(id);
    } catch (error) {
      mutate(); // 에러 시 롤백
    }
  };

  // ...
}
```

### 요청 최적화

- [ ] SWR 또는 React Query 도입
- [ ] 중복 요청 제거 (deduping)
- [ ] 캐시 전략 설정
- [ ] 낙관적 업데이트 구현
- [ ] API 응답 페이지네이션

---

## 6. 폰트 최적화

### 폰트 로딩 전략

```tsx
// app/layout.tsx
import '@fontsource/pretendard/400.css'; // 필요한 weight만
import '@fontsource/pretendard/600.css';

// 또는 next/font 사용
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // FOUT 방지
  preload: true,
  variable: '--font-inter',
});
```

### 체크리스트

- [ ] 사용하지 않는 폰트 weight 제거
- [ ] `font-display: swap` 사용
- [ ] 폰트 preload (중요 폰트만)
- [ ] 시스템 폰트 fallback 설정

---

## 7. CSS 최적화

### Tailwind CSS 최적화

```js
// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  // 사용하지 않는 스타일 제거
  purge: {
    enabled: true,
  },
};
```

### Critical CSS

- [ ] Above-the-fold CSS 인라인화
- [ ] 사용하지 않는 CSS 제거
- [ ] CSS 압축 확인

---

## 8. JavaScript 최적화

### 스크립트 로딩

```tsx
import Script from 'next/script';

// 분석 스크립트 (비필수)
<Script
  src="https://analytics.example.com/script.js"
  strategy="lazyOnload" // 페이지 로드 후
/>

// 필수 스크립트
<Script
  src="https://required.example.com/script.js"
  strategy="beforeInteractive" // 페이지 인터랙티브 전
/>
```

### 체크리스트

- [ ] 서드파티 스크립트 최소화
- [ ] 분석 스크립트 지연 로딩
- [ ] 불필요한 polyfill 제거

---

## 9. 렌더링 최적화

### Suspense 경계

```tsx
import { Suspense } from 'react';
import PrayerListSkeleton from './PrayerListSkeleton';

function PrayersPage() {
  return (
    <Suspense fallback={<PrayerListSkeleton />}>
      <PrayerList />
    </Suspense>
  );
}
```

### 레이아웃 시프트 방지

```tsx
// 이미지 크기 명시
<Image width={800} height={600} />

// 스켈레톤 정확한 크기
<Skeleton className="h-[200px] w-full" />

// 동적 콘텐츠 최소 높이
<div className="min-h-[100px]">
  {content}
</div>
```

### 체크리스트

- [ ] Suspense 경계 추가
- [ ] 스켈레톤 로딩 UI 구현
- [ ] 이미지/컨테이너 크기 명시
- [ ] 폰트 크기 고정 (layout shift 방지)

---

## 10. 캐싱 전략

### Next.js 캐싱

```tsx
// Static Generation (권장)
export async function generateStaticParams() {
  const prayers = await getPrayers();
  return prayers.map(p => ({ id: p.id }));
}

// Incremental Static Regeneration
export const revalidate = 60; // 60초마다 재생성

// API Routes 캐싱
export async function GET(request: Request) {
  const data = await fetchData();

  return new Response(JSON.stringify(data), {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
    },
  });
}
```

### 체크리스트

- [ ] 정적 페이지 ISR 설정
- [ ] API 응답 캐시 헤더 설정
- [ ] 서비스 워커 캐싱 (선택적)

---

## 11. 성능 모니터링

### Web Vitals 리포팅

```tsx
// app/layout.tsx 또는 _app.tsx
import { reportWebVitals } from '@/lib/performance';

export function reportWebVitals(metric) {
  reportWebVitals(metric);
}
```

### 모니터링 도구

- [ ] **Lighthouse**: Chrome DevTools
- [ ] **WebPageTest**: https://www.webpagetest.org/
- [ ] **PageSpeed Insights**: https://pagespeed.web.dev/
- [ ] **Vercel Analytics**: 프로덕션 모니터링

---

## 12. 네트워크 최적화

### 리소스 힌트

```tsx
// app/layout.tsx
<head>
  <link rel="preconnect" href="https://api.example.com" />
  <link rel="dns-prefetch" href="https://cdn.example.com" />
</head>
```

### 압축

- [ ] gzip/brotli 압축 활성화 (Vercel 자동)
- [ ] 정적 에셋 CDN 사용
- [ ] 이미지 CDN 사용 고려

---

## 13. 모바일 성능

### 터치 최적화

```tsx
// 터치 지연 제거
<button style={{ touchAction: 'manipulation' }}>
  버튼
</button>

// 스크롤 성능
<div style={{ overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
  콘텐츠
</div>
```

### 체크리스트

- [ ] 터치 타겟 크기 최소 44px
- [ ] 터치 지연 제거
- [ ] 스크롤 성능 최적화
- [ ] 느린 네트워크 대응 (로딩 상태)

---

## 14. 디버깅 도구

### Chrome DevTools

```bash
# Performance 탭
1. Record 시작
2. 페이지 상호작용
3. Record 중지
4. 병목 구간 분석

# Coverage 탭
- 사용하지 않는 CSS/JS 확인

# Network 탭
- 느린 리소스 확인
- Waterfall 분석
```

### Lighthouse CI

```bash
# 설치
npm install -g @lhci/cli

# 실행
lhci autorun --collect.url=http://localhost:3000
```

---

## 우선순위

### P0 (긴급)
- [ ] 이미지 최적화 (`next/image` 사용)
- [ ] 번들 크기 분석 및 최적화
- [ ] Core Web Vitals 측정 및 개선

### P1 (중요)
- [ ] React 성능 최적화 (memo, useMemo)
- [ ] 코드 스플리팅 (동적 임포트)
- [ ] API 캐싱 전략

### P2 (권장)
- [ ] 폰트 최적화
- [ ] CSS 최적화
- [ ] 성능 모니터링 도구 설정

---

## 성능 예산 (Performance Budget)

| 메트릭 | 목표 | 최대 허용 |
|--------|------|-----------|
| JavaScript 번들 | < 200KB | < 300KB |
| CSS 크기 | < 50KB | < 100KB |
| 이미지 크기 (페이지당) | < 500KB | < 1MB |
| 총 페이지 크기 | < 1MB | < 2MB |
| 요청 수 | < 30 | < 50 |
| LCP | < 2.5s | < 3s |
| FID | < 100ms | < 200ms |
| CLS | < 0.1 | < 0.15 |

---

## 리소스

- [Next.js Performance](https://nextjs.org/docs/basic-features/built-in-css-support)
- [Web.dev Performance](https://web.dev/performance/)
- [Google Web Vitals](https://web.dev/vitals/)
- [Framer Motion Performance](https://www.framer.com/motion/guide-reduce-bundle-size/)
