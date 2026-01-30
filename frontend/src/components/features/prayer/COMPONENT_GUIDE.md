# Prayer Components Guide

Together Pray v2.0 기도 관련 컴포넌트 가이드

## 📦 Components Overview

### 1. PrayerCard
기도제목 카드 컴포넌트

**Features:**
- 작성자 정보 (익명 지원)
- 상태 배지 (기도중/부분 응답/응답 완료)
- 카테고리 표시
- 기도 횟수 및 참여자 아바타 그룹
- 업데이트 개수 표시
- PrayButton 통합
- 반응형 레이아웃
- Compact 변형 지원

**Usage:**
```tsx
import { PrayerCard } from '@/components/features/prayer';

<PrayerCard
  item={prayerItem}
  onPraySuccess={(newCount) => console.log(newCount)}
  showGroupName={true}
  variant="default"
/>
```

---

### 2. PrayButton
기도하기 버튼 컴포넌트 (1일 1회 제한)

**Features:**
- 1일 1회 기도 제한
- Optimistic UI 업데이트
- 롱프레스 제스처 지원
- Haptic 피드백 (모바일)
- 시각적 피드백 애니메이션
- 로딩 상태 표시

**Usage:**
```tsx
import { PrayButton } from '@/components/features/prayer';

<PrayButton
  prayerItemId={item.id}
  initialPrayCount={item._count.reactions}
  initialHasPrayedToday={item.hasPrayedToday}
  size="md"
  onPraySuccess={(newCount) => console.log(newCount)}
/>
```

---

### 3. Timeline (NEW)
기도제목 타임라인 컴포넌트

**Features:**
- 기도제목 생성 이벤트
- 업데이트 이벤트 (카드 형태)
- 상태 변경 이벤트 (부분 응답/응답 완료)
- 연결선 + 도트 디자인
- 인라인 업데이트 추가 기능
- 시간순 정렬 (오름차순/내림차순)
- 상태별 색상 구분

**Usage:**
```tsx
import { Timeline } from '@/components/features/prayer';

<Timeline
  prayerItem={prayerItem}
  updates={updates}
  onAddUpdate={async (content) => {
    await api.createPrayerUpdate(prayerItem.id, content);
  }}
  canEdit={isAuthor || isAdmin}
  sortOrder="desc"
/>
```

**Event Types:**
- `created` - 기도제목 작성됨 (gray)
- `update` - 기도 업데이트 (blue)
- `status_change` - 부분 응답 (yellow)
- `answered` - 응답 완료 (green)

---

### 4. PrayerForm (NEW)
기도제목 작성 폼 (BottomSheet 기반)

**Features:**
- BottomSheet 인터페이스
- 제목/내용 입력 (유효성 검사)
- 7가지 카테고리 선택 (개인, 가족, 건강, 직장, 학업, 감사, 기타)
- 익명 작성 토글
- 성공 시 Confetti 애니메이션
- 자동 상세 페이지 이동
- 드래그 제스처 지원
- 키보드 높이 자동 조정

**Usage:**
```tsx
import { PrayerForm } from '@/components/features/prayer';

const [isOpen, setIsOpen] = useState(false);

<PrayerForm
  groupId={groupId}
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onSuccess={(prayerItemId) => {
    console.log('Created:', prayerItemId);
  }}
/>
```

**Categories:**
- 👤 개인
- 👨‍👩‍👧‍👦 가족
- 🏥 건강
- 💼 직장
- 📚 학업
- 🙏 감사
- 📝 기타

---

### 5. PrayerCardSkeleton
로딩 상태 스켈레톤 컴포넌트

**Usage:**
```tsx
import { PrayerCardSkeleton } from '@/components/features/prayer';

{isLoading && (
  <>
    <PrayerCardSkeleton />
    <PrayerCardSkeleton />
    <PrayerCardSkeleton />
  </>
)}
```

---

## 🎨 Design System Integration

### Colors (Status-based)
```css
--color-status-praying-bg: Sky Blue/100
--color-status-praying-text: Sky Blue/800

--color-status-partial-bg: Amber/100
--color-status-partial-text: Amber/800

--color-status-answered-bg: Emerald/100
--color-status-answered-text: Emerald/800
```

### Animations
- `cardHover` - 카드 호버 효과
- `listItem` - 리스트 아이템 등장
- `listContainer` - 스태거 애니메이션
- `slideUp` - 슬라이드 업
- `confettiParticle` - 축하 애니메이션

---

## 📱 Mobile Optimizations

### Touch Targets
- 최소 44x44px 터치 영역
- 충분한 간격 (gap-3 이상)

### Gestures
- PrayButton: 롱프레스 (800ms)
- PrayerForm: 드래그 to dismiss
- Timeline: 스크롤 제스처 최적화

### Performance
- Optimistic UI 업데이트
- 스켈레톤 로딩
- 이미지 레이지 로딩
- 메모이제이션 적용

---

## 🔗 API Integration

### Types (from lib/api.ts)
```typescript
interface PrayerItem {
  id: string;
  groupId: string;
  title: string;
  content: string;
  category: string | null;
  status: 'praying' | 'partial_answer' | 'answered';
  isAnonymous: boolean;
  createdAt: string;
  updatedAt: string;
  isAuthor: boolean;
  author: { id: string | null; name: string };
  hasPrayedToday?: boolean;
  _count: {
    reactions: number;
    comments: number;
    updates?: number;
  };
}

interface PrayerUpdate {
  id: string;
  content: string;
  createdAt: string;
  author: { id: string; name: string };
  isAuthor: boolean;
}
```

### API Methods
```typescript
// Create
await api.createPrayerItem(data);

// Read
await api.getPrayerItem(id);
await api.getPrayerItems(groupId, options);
await api.getPrayerUpdates(prayerItemId);

// Update
await api.updatePrayerStatus(id, status);
await api.createPrayerUpdate(prayerItemId, content);

// React
await api.pray(prayerItemId);
```

---

## 🧪 Testing

### Example Files
- `PrayerCard.example.tsx` - PrayerCard 예제
- `Timeline.example.tsx` - Timeline 예제
- `PrayerForm.example.tsx` - PrayerForm 예제

### Run Examples
```bash
# Create example page in app/examples/prayer/
# Import and render example components
```

---

## 📋 Implementation Checklist

### PrayerCard
- [x] 기본 레이아웃 및 스타일
- [x] 상태 배지
- [x] 카테고리 표시
- [x] PrayButton 통합
- [x] 아바타 그룹
- [x] Compact 변형
- [x] 반응형 디자인

### Timeline
- [x] 이벤트 타입 정의
- [x] 연결선 디자인
- [x] 업데이트 카드
- [x] 인라인 추가 폼
- [x] 정렬 기능
- [x] Empty state
- [x] 애니메이션

### PrayerForm
- [x] BottomSheet 통합
- [x] 폼 유효성 검사
- [x] 카테고리 선택 UI
- [x] 익명 토글
- [x] Confetti 애니메이션
- [x] API 연동
- [x] 에러 처리

---

## 🚀 Best Practices

### Performance
```tsx
// Use memo for list items
const MemoizedPrayerCard = memo(PrayerCard);

// Virtualize long lists
import { VirtualList } from '@/components/ui';
```

### Accessibility
```tsx
// Proper ARIA labels
<button aria-label="기도하기" />

// Keyboard navigation support
onKeyDown={(e) => e.key === 'Enter' && handlePray()}
```

### Error Handling
```tsx
try {
  await api.createPrayerItem(data);
} catch (error) {
  toast.error('기도제목 등록에 실패했습니다');
}
```

---

## 📚 Related Documentation

- [Design System](../../ui/README.md)
- [Animation System](../../../lib/animations.ts)
- [API Client](../../../lib/api.ts)
- [BottomSheet](../../layout/BottomSheet.tsx)
