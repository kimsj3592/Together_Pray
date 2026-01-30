# Quick Start - New Components

Together Pray v2.0 신규 컴포넌트 빠른 시작 가이드

## 🚀 5분 안에 시작하기

### 1. Timeline 추가하기

**기도 상세 페이지에 타임라인 표시**

```tsx
// app/prayers/[id]/page.tsx
'use client';

import { useState } from 'react';
import { Timeline } from '@/components/features/prayer';
import { api } from '@/lib/api';

export default function PrayerDetailPage({ params }: { params: { id: string } }) {
  const [prayer, setPrayer] = useState(null);
  const [updates, setUpdates] = useState([]);

  // Fetch data...

  const handleAddUpdate = async (content: string) => {
    const newUpdate = await api.createPrayerUpdate(params.id, content);
    setUpdates([...updates, newUpdate]);
  };

  return (
    <div className="p-4 space-y-6">
      <PrayerCard item={prayer} showFullContent />

      <Timeline
        prayerItem={prayer}
        updates={updates}
        onAddUpdate={handleAddUpdate}
        canEdit={prayer.isAuthor}
      />
    </div>
  );
}
```

**Done!** 이제 사용자들이 기도 여정을 볼 수 있습니다 ✨

---

### 2. PrayerForm 추가하기

**그룹 페이지에 기도제목 작성 폼 추가**

```tsx
// app/groups/[id]/prayers/page.tsx
'use client';

import { useState } from 'react';
import { PrayerForm } from '@/components/features/prayer';
import { FAB } from '@/components/features/home';

export default function GroupPrayersPage({ params }: { params: { id: string } }) {
  const [formOpen, setFormOpen] = useState(false);

  return (
    <div>
      {/* Your prayer list */}
      <PrayerList groupId={params.id} />

      {/* FAB to open form */}
      <FAB onClick={() => setFormOpen(true)} />

      {/* Prayer form */}
      <PrayerForm
        groupId={params.id}
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSuccess={(id) => {
          console.log('Created prayer:', id);
          // Optionally refresh list
        }}
      />
    </div>
  );
}
```

**Done!** 사용자들이 기도제목을 쉽게 작성할 수 있습니다 📝

---

### 3. EmptyState 업데이트하기

**빈 상태 표시 개선**

```tsx
// Before (v1.0)
import EmptyState from '@/components/EmptyState';

// After (v2.0)
import { EmptyState } from '@/components/ui';

// Usage stays the same!
<EmptyState
  type="prayers"
  actionLabel="새 기도제목 작성"
  onAction={() => setFormOpen(true)}
/>
```

**Done!** 더 나은 UX의 빈 상태를 사용할 수 있습니다 🎨

---

## 📦 Import Cheat Sheet

```tsx
// Prayer components
import {
  PrayerCard,
  PrayButton,
  Timeline,        // NEW
  PrayerForm,      // NEW
} from '@/components/features/prayer';

// UI components
import {
  Button,
  Input,
  Textarea,
  Badge,
  Avatar,
  EmptyState,      // MOVED here
} from '@/components/ui';

// Layout components
import {
  BottomSheet,
  Modal,
  Toast,
} from '@/components/layout';
```

---

## 🎯 Common Patterns

### Pattern 1: Prayer Detail with Timeline

```tsx
const PrayerDetail = ({ prayerId }) => {
  const { data: prayer, refetch } = usePrayer(prayerId);
  const { data: updates, refetch: refetchUpdates } = usePrayerUpdates(prayerId);

  const handleAddUpdate = async (content: string) => {
    await api.createPrayerUpdate(prayerId, content);
    refetchUpdates();
  };

  return (
    <>
      <PrayerCard item={prayer} showFullContent />
      <Timeline
        prayerItem={prayer}
        updates={updates}
        onAddUpdate={handleAddUpdate}
        canEdit={prayer.isAuthor}
      />
    </>
  );
};
```

---

### Pattern 2: Prayer List with Create Form

```tsx
const PrayerList = ({ groupId }) => {
  const [formOpen, setFormOpen] = useState(false);
  const { data: prayers, refetch } = usePrayers(groupId);

  return (
    <>
      {prayers.length === 0 ? (
        <EmptyState
          type="prayers"
          actionLabel="첫 기도제목 작성"
          onAction={() => setFormOpen(true)}
        />
      ) : (
        <div className="space-y-4">
          {prayers.map(prayer => (
            <PrayerCard key={prayer.id} item={prayer} />
          ))}
        </div>
      )}

      <FAB onClick={() => setFormOpen(true)} />

      <PrayerForm
        groupId={groupId}
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSuccess={() => refetch()}
      />
    </>
  );
};
```

---

### Pattern 3: Custom Empty State

```tsx
<EmptyState
  type="custom"
  icon={<CustomIcon />}
  title="맞춤 메시지"
  description="원하는 설명을 넣으세요"
  actionLabel="액션 버튼"
  onAction={handleAction}
/>
```

---

## 🎨 Customization Examples

### Timeline with Custom Styling

```tsx
<div className="bg-white dark:bg-gray-900 rounded-lg p-6">
  <Timeline
    prayerItem={prayer}
    updates={updates}
    sortOrder="asc"  // 오래된 순서
    canEdit={false}   // 읽기 전용
  />
</div>
```

---

### PrayerForm with Success Callback

```tsx
<PrayerForm
  groupId={groupId}
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onSuccess={(prayerItemId) => {
    // Custom action after creation
    toast.success('기도제목이 등록되었습니다!');
    router.push(`/prayers/${prayerItemId}`);
    // Auto-close is handled by component
  }}
/>
```

---

## 🐛 Troubleshooting

### Issue: "Cannot find module '@/components/EmptyState'"

**Fix:**
```tsx
// Wrong
import EmptyState from '@/components/EmptyState';

// Correct
import { EmptyState } from '@/components/ui';
```

---

### Issue: Timeline not showing updates

**Check:**
1. `updates` prop is an array
2. Updates have required fields (id, content, createdAt, author)
3. PrayerItem has valid data

**Debug:**
```tsx
console.log('Prayer:', prayer);
console.log('Updates:', updates);
```

---

### Issue: PrayerForm not submitting

**Check:**
1. `groupId` is valid
2. User is authenticated
3. API endpoint is correct
4. Network tab for errors

**Debug:**
```tsx
const handleSuccess = (id) => {
  console.log('Success! Prayer ID:', id);
};

<PrayerForm
  groupId={groupId}
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onSuccess={handleSuccess}
/>
```

---

## 🎓 Learning Resources

### Example Files
- `Timeline.example.tsx` - 6가지 Timeline 사용 예제
- `PrayerForm.example.tsx` - 2가지 PrayerForm 사용 예제

### Documentation
- [Component Guide](./src/components/features/prayer/COMPONENT_GUIDE.md)
- [Migration Guide](./src/components/MIGRATION_GUIDE_V2.md)
- [Implementation Details](./src/components/features/prayer/IMPLEMENTATION_SUMMARY_V2.md)

### API Reference
```tsx
// Timeline Props
interface TimelineProps {
  prayerItem: PrayerItem;      // Required
  updates: PrayerUpdate[];     // Required
  onAddUpdate?: (content: string) => void;
  canEdit?: boolean;
  sortOrder?: 'asc' | 'desc';
}

// PrayerForm Props
interface PrayerFormProps {
  groupId: string;             // Required
  isOpen: boolean;             // Required
  onClose: () => void;         // Required
  onSuccess?: (id: string) => void;
}

// EmptyState Props
interface EmptyStateProps {
  type: 'groups' | 'prayers' | 'answered' | 'search' | 'custom';
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}
```

---

## ✅ Quick Checklist

Starting a new feature? Use this checklist:

- [ ] Import from correct path (`@/components/features/prayer` or `@/components/ui`)
- [ ] Use named imports (`import { Component }`)
- [ ] Pass required props
- [ ] Handle success/error states
- [ ] Test on mobile viewport
- [ ] Check dark mode
- [ ] Verify accessibility
- [ ] Add loading states

---

## 🚀 You're Ready!

모든 준비가 완료되었습니다. 이제 멋진 기도 경험을 만들어보세요!

**Need help?** Check the documentation or example files.

**Happy Coding! 💻✨**
