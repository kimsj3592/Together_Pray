# UI Components - Toss-style Design System

Together Pray v2.0의 기본 UI 컴포넌트 라이브러리입니다. 토스 스타일의 모던하고 모바일 친화적인 디자인을 제공합니다.

## 설치된 의존성

- `framer-motion` - 애니메이션
- `lucide-react` - 아이콘
- `clsx` + `tailwind-merge` - 클래스 병합 유틸리티

## 컴포넌트 목록

### Button

다양한 variant와 크기를 지원하는 버튼 컴포넌트입니다.

**Variants:** `primary`, `secondary`, `ghost`, `danger`
**Sizes:** `sm`, `md`, `lg`

```tsx
import { Button } from '@/components/ui';

// Primary button
<Button variant="primary" size="md">
  기도제목 등록
</Button>

// Loading state
<Button variant="primary" isLoading>
  저장 중...
</Button>

// Disabled
<Button variant="secondary" disabled>
  비활성화
</Button>
```

### Input & Textarea

아이콘과 에러 상태를 지원하는 입력 컴포넌트입니다.

```tsx
import { Input, Textarea } from '@/components/ui';
import { Mail, Lock } from 'lucide-react';

// With icon
<Input
  placeholder="이메일을 입력하세요"
  leftIcon={<Mail size={20} />}
/>

// With error
<Input
  error="올바른 이메일 형식이 아닙니다"
  value={email}
/>

// Textarea
<Textarea
  label="기도제목 내용"
  placeholder="기도제목을 작성해주세요"
  rows={4}
/>
```

### Card

인터랙티브 카드 컴포넌트로 hover 효과를 지원합니다.

```tsx
import { Card } from '@/components/ui';

// Basic card
<Card className="p-4">
  <h3>Card Title</h3>
  <p>Card content</p>
</Card>

// Interactive card with animation
<Card interactive onClick={() => console.log('clicked')}>
  <div className="p-4">Clickable Card</div>
</Card>
```

### Badge

상태 표시를 위한 배지 컴포넌트입니다.

**Variants:** `default`, `praying`, `partial`, `answered`, `success`, `warning`, `info`, `error`

```tsx
import { Badge } from '@/components/ui';

<Badge variant="praying">기도중</Badge>
<Badge variant="partial">부분 응답</Badge>
<Badge variant="answered">응답 완료</Badge>
<Badge variant="info">알림</Badge>
```

### Avatar & AvatarGroup

사용자 프로필 이미지 또는 이니셜을 표시합니다.

**Sizes:** `sm`, `md`, `lg`

```tsx
import { Avatar, AvatarGroup } from '@/components/ui';

// With image
<Avatar
  src="/profile.jpg"
  name="김철수"
  size="md"
/>

// With initials (no image)
<Avatar
  name="김철수"
  size="lg"
/>

// Avatar Group
<AvatarGroup
  users={[
    { name: '김철수', src: '/user1.jpg' },
    { name: '이영희', src: '/user2.jpg' },
    { name: '박민수' },
  ]}
  max={3}
  size="sm"
/>
```

### Skeleton

로딩 상태를 표시하는 스켈레톤 컴포넌트입니다.

**Variants:** `text`, `circle`, `rect`

```tsx
import { Skeleton, SkeletonText, SkeletonCard } from '@/components/ui';

// Basic skeleton
<Skeleton variant="rect" width={200} height={100} />
<Skeleton variant="circle" width={40} height={40} />

// Text skeleton (multiple lines)
<SkeletonText lines={3} />

// Predefined card skeleton
<SkeletonCard />
```

## 사용 예제

### Prayer Card 예제

```tsx
import { Card, Avatar, Badge, Button } from '@/components/ui';

function PrayerCard({ prayer }) {
  return (
    <Card interactive className="p-5">
      <div className="flex items-center gap-3 mb-4">
        <Avatar name={prayer.author.name} size="md" />
        <div className="flex-1">
          <p className="font-medium">{prayer.author.name}</p>
          <p className="text-xs text-[rgb(var(--color-text-tertiary))]">
            2시간 전
          </p>
        </div>
        <Badge variant="praying">기도중</Badge>
      </div>

      <h3 className="font-semibold mb-2">{prayer.title}</h3>
      <p className="text-[rgb(var(--color-text-secondary))] line-clamp-3">
        {prayer.content}
      </p>

      <div className="flex items-center justify-between mt-4 pt-4 border-t">
        <span className="text-sm">🙏 {prayer.prayerCount}명</span>
        <Button variant="secondary" size="sm">
          함께 기도하기
        </Button>
      </div>
    </Card>
  );
}
```

### Login Form 예제

```tsx
import { Input, Button } from '@/components/ui';
import { Mail, Lock } from 'lucide-react';

function LoginForm() {
  return (
    <form className="space-y-4">
      <Input
        label="이메일"
        type="email"
        placeholder="email@example.com"
        leftIcon={<Mail size={20} />}
      />

      <Input
        label="비밀번호"
        type="password"
        placeholder="비밀번호를 입력하세요"
        leftIcon={<Lock size={20} />}
      />

      <Button variant="primary" className="w-full">
        로그인
      </Button>
    </form>
  );
}
```

### Loading State 예제

```tsx
import { SkeletonCard } from '@/components/ui';

function PrayerListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
```

## 디자인 토큰

모든 컴포넌트는 `globals.css`에 정의된 CSS 변수를 사용합니다:

- **Colors:** `--color-primary-500`, `--color-success`, `--color-error` 등
- **Border Radius:** `--radius-sm`, `--radius-md`, `--radius-lg` 등
- **Shadows:** `--shadow-sm`, `--shadow-md`, `--shadow-lg` 등
- **Font Sizes:** `--font-size-xs`, `--font-size-sm`, `--font-size-base` 등

## 애니메이션

모든 인터랙티브 컴포넌트는 Framer Motion을 사용하여 부드러운 애니메이션을 제공합니다:

- **Button:** `scale(0.95)` on tap
- **Card (interactive):** `y: -2` on hover, `scale(0.98)` on tap
- **Skeleton:** Shimmer 애니메이션

## 접근성

- 모든 터치 타겟은 최소 44x44px 크기
- 포커스 상태 명확하게 표시
- 적절한 색상 대비
- 키보드 네비게이션 지원

## Dark Mode

모든 컴포넌트는 자동으로 다크모드를 지원합니다. CSS 변수가 `.dark` 클래스에 따라 자동으로 전환됩니다.
