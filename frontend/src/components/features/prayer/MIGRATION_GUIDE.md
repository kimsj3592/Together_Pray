# Migration Guide: PrayerCard v1.0 → v2.0

Complete guide for migrating from legacy PrayerCard components to v2.0 feature components.

---

## Overview

### What's New in v2.0

✨ **Design Improvements**
- Toss-style modern UI with refined spacing
- Enhanced visual hierarchy with dividers
- Category tags with emoji icons
- Avatar group for prayed users
- Improved status badges

✨ **Interaction Improvements**
- Long-press interaction for PrayButton (800ms)
- Circular progress indicator
- Haptic feedback (vibration)
- Confetti celebration animation
- Optimistic UI updates

✨ **Component Architecture**
- Cleaner prop interfaces
- Better TypeScript support
- Improved accessibility
- Consistent design system integration
- Feature-based organization

---

## File Location Changes

### v1.0 Structure
```
/components/
├── PrayerCard.tsx
└── PrayButton.tsx
```

### v2.0 Structure
```
/components/
├── PrayerCard.tsx (legacy - keep for backward compatibility)
├── PrayButton.tsx (legacy - keep for backward compatibility)
└── features/
    └── prayer/
        ├── PrayerCard.tsx (NEW)
        ├── PrayButton.tsx (NEW)
        ├── PrayerCardSkeleton.tsx (NEW)
        ├── index.ts
        ├── README.md
        ├── MIGRATION_GUIDE.md
        └── PrayerCard.example.tsx
```

**Migration Strategy**: Gradual migration
1. Keep old components for backward compatibility
2. Migrate pages one by one to new components
3. Remove old components when all pages are migrated

---

## Import Changes

### v1.0 Imports

```typescript
// Old way
import PrayerCard from '@/components/PrayerCard';
import PrayButton from '@/components/PrayButton';
```

### v2.0 Imports

```typescript
// New way - Named exports
import { PrayerCard, PrayButton, PrayerCardSkeleton } from '@/components/features/prayer';

// Or import individually
import { PrayerCard } from '@/components/features/prayer/PrayerCard';
import { PrayButton } from '@/components/features/prayer/PrayButton';
```

**Why Named Exports?**
- Better tree-shaking
- Easier to add new exports
- TypeScript auto-import works better
- Follows modern React conventions

---

## PrayerCard Component Changes

### Props Comparison

#### v1.0 Props
```typescript
interface PrayerCardProps {
  item: PrayerItem;
  onPraySuccess?: (newCount: number) => void;
  showFullContent?: boolean;
}
```

#### v2.0 Props
```typescript
interface PrayerCardProps {
  item: PrayerItem;
  onPraySuccess?: (newCount: number) => void;
  showFullContent?: boolean;
  showGroupName?: boolean;        // NEW
  variant?: 'default' | 'compact'; // NEW
}
```

### Visual Changes

#### v1.0 Layout
```
┌─────────────────────────────────────┐
│ 👤 Author  •  Time          [Badge] │
│                                     │
│ Title                               │
│ Content (line-clamp-3)              │
│                                     │
│ 💼 Category                         │
│                                     │
│ 🙏 12명 함께 기도    [함께 기도하기] │
└─────────────────────────────────────┘
```

#### v2.0 Layout
```
┌─────────────────────────────────────┐
│ 👤 Author  •  Time          [Badge] │
│     Group Name (optional)           │
├─────────────────────────────────────┤ ← Divider
│                                     │
│ Title                               │
│ Content (line-clamp-3)              │
│                                     │
│ 💼 Category  📅 Updates  💬 Comments│
│                                     │
├─────────────────────────────────────┤
│ 🙏 12명 함께 기도  👤👤👤    [기도하기]│
└─────────────────────────────────────┘
```

### Code Migration Example

#### Before (v1.0)
```tsx
import PrayerCard from '@/components/PrayerCard';

function PrayerList({ prayers }: { prayers: PrayerItem[] }) {
  return (
    <div className="space-y-4">
      {prayers.map((prayer) => (
        <PrayerCard
          key={prayer.id}
          item={prayer}
          showFullContent={false}
        />
      ))}
    </div>
  );
}
```

#### After (v2.0)
```tsx
import { PrayerCard, PrayerCardSkeleton } from '@/components/features/prayer';

function PrayerList({
  prayers,
  isLoading
}: {
  prayers: PrayerItem[];
  isLoading: boolean;
}) {
  if (isLoading) {
    return <PrayerCardSkeleton count={5} />;
  }

  return (
    <div className="space-y-4">
      {prayers.map((prayer) => (
        <PrayerCard
          key={prayer.id}
          item={prayer}
          showFullContent={false}
          showGroupName={true}  // NEW
          variant="default"     // NEW
        />
      ))}
    </div>
  );
}
```

---

## PrayButton Component Changes

### Props Comparison

#### v1.0 Props
```typescript
interface PrayButtonProps {
  prayerItemId: string;
  initialPrayCount: number;
  initialHasPrayedToday?: boolean;
  size?: 'small' | 'large';
  onPraySuccess?: (newCount: number) => void;
}
```

#### v2.0 Props
```typescript
interface PrayButtonProps {
  prayerItemId: string;
  initialPrayCount: number;
  initialHasPrayedToday?: boolean;
  size?: 'sm' | 'md' | 'lg';  // CHANGED: renamed + added 'md'
  onPraySuccess?: (newCount: number) => void;
  showCount?: boolean;        // NEW
}
```

### Size Prop Migration

| v1.0 | v2.0 | Notes |
|------|------|-------|
| `'small'` | `'sm'` | Shorter name |
| `'large'` | `'lg'` | Shorter name |
| N/A | `'md'` | NEW default size |

### Interaction Changes

#### v1.0 Interaction
- **Click** to pray
- Instant submission
- Loading spinner during API call
- Modal for prayers list

#### v2.0 Interaction
- **Long-press (800ms)** to pray
- Circular progress indicator
- Haptic feedback on completion
- Confetti celebration
- No prayers list modal (removed for simplicity)

### Code Migration Example

#### Before (v1.0)
```tsx
import PrayButton from '@/components/PrayButton';

<PrayButton
  prayerItemId={prayer.id}
  initialPrayCount={prayer._count.reactions}
  initialHasPrayedToday={prayer.hasPrayedToday}
  size="large"
  onPraySuccess={(count) => console.log(count)}
/>
```

#### After (v2.0)
```tsx
import { PrayButton } from '@/components/features/prayer';

<PrayButton
  prayerItemId={prayer.id}
  initialPrayCount={prayer._count.reactions}
  initialHasPrayedToday={prayer.hasPrayedToday}
  size="lg"  // Changed from 'large' to 'lg'
  onPraySuccess={(count) => console.log(count)}
  showCount={false}  // NEW optional prop
/>
```

---

## Design System Integration

### v1.0 Styling Approach
```tsx
// Inline styles with CSS variables
<div
  className="w-10 h-10 rounded-full flex items-center justify-center"
  style={{ backgroundColor: 'rgb(var(--color-bg-tertiary))' }}
>
```

### v2.0 Styling Approach
```tsx
// Using design system components
import { Avatar } from '@/components/ui/Avatar';

<Avatar name={author.name} size="md" />
```

**Benefits:**
- Consistent styling across app
- Type-safe props
- Easier to maintain
- Better accessibility

### Component Usage Comparison

#### v1.0: Manual Implementation
```tsx
// Badge
<span className={STATUS_CLASSES[item.status]}>
  {STATUS_LABELS[item.status]}
</span>

// Avatar placeholder
<div className="w-10 h-10 rounded-full bg-tertiary">
  <User size={20} />
</div>

// Loading state
{isLoading && (
  <div className="skeleton h-20 w-full" />
)}
```

#### v2.0: Design System Components
```tsx
// Badge
<Badge variant={STATUS_VARIANTS[item.status]}>
  {STATUS_LABELS[item.status]}
</Badge>

// Avatar
<Avatar name={author.name} size="md" />

// Avatar Group
<AvatarGroup users={prayedUsers} max={3} size="sm" />

// Loading state
<PrayerCardSkeleton count={5} />
```

---

## Animation Improvements

### v1.0 Animations
```tsx
// Simple fade-in
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
```

### v2.0 Animations
```tsx
import { cardHover } from '@/lib/animations';

// Predefined animation variants
<motion.div
  variants={cardHover}
  initial="initial"
  animate="animate"
  whileHover="hover"
  whileTap="tap"
>
```

**New Animation Features:**
- Circular progress for long-press
- Confetti particle system
- Haptic feedback
- Smooth state transitions

---

## Loading States

### v1.0 Approach
```tsx
// No built-in skeleton
{isLoading ? (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="skeleton h-40" />
    ))}
  </div>
) : (
  <PrayerList />
)}
```

### v2.0 Approach
```tsx
import { PrayerCardSkeleton } from '@/components/features/prayer';

{isLoading ? (
  <PrayerCardSkeleton count={5} variant="default" />
) : (
  <PrayerList />
)}
```

---

## Accessibility Improvements

### v1.0
- Basic semantic HTML
- Click events only
- No haptic feedback

### v2.0
- Improved semantic structure
- Touch-friendly long-press
- Haptic feedback support
- Better keyboard navigation
- Proper ARIA labels
- 44px minimum touch targets

---

## Mobile Optimizations

### v1.0
```tsx
// Basic responsive padding
<div className="p-4 sm:p-5">
```

### v2.0
```tsx
// Touch-optimized interactions
const handleTouchStart = (e: React.TouchEvent) => {
  e.preventDefault();
  startLongPress();
};

// Haptic feedback
if ('vibrate' in navigator) {
  navigator.vibrate(50);
}

// Safe area support
<div className="pb-safe">
```

---

## Performance Considerations

### v1.0
- Direct API calls in components
- No optimistic updates
- Modal for prayers list (heavy)

### v2.0
- Optimistic UI updates
- Timer cleanup on unmount
- Removed prayers list modal
- Efficient animation cleanup
- Proper memo usage

---

## Breaking Changes Checklist

- [x] Import paths changed
- [x] Named exports instead of default
- [x] Size prop values (`small` → `sm`, `large` → `lg`)
- [x] Click → Long-press interaction
- [x] Prayers list modal removed
- [x] New required UI components (Avatar, Badge, Card)
- [x] Animation library integration required

---

## Step-by-Step Migration Process

### 1. Install Dependencies (if needed)

```bash
npm install framer-motion clsx tailwind-merge lucide-react
```

### 2. Update Imports

```typescript
// Find and replace
// FROM:
import PrayerCard from '@/components/PrayerCard';
import PrayButton from '@/components/PrayButton';

// TO:
import { PrayerCard, PrayButton } from '@/components/features/prayer';
```

### 3. Update Size Props

```typescript
// Find and replace in PrayButton usage
size="small"  → size="sm"
size="large"  → size="lg"
```

### 4. Add New Props

```tsx
<PrayerCard
  item={item}
  onPraySuccess={handler}
  showFullContent={false}
  // Add these:
  variant="default"
  showGroupName={true}
/>
```

### 5. Update Loading States

```tsx
// Replace custom skeletons
{isLoading ? (
  <PrayerCardSkeleton count={5} />
) : (
  // ... prayer list
)}
```

### 6. Test Interactions

- ✅ Long-press (800ms) triggers prayer
- ✅ Release before 800ms cancels
- ✅ Confetti shows on success
- ✅ Haptic feedback works (mobile)
- ✅ Disabled state for already prayed

### 7. Visual QA

- ✅ Layout matches PRD v2.0 design
- ✅ Spacing is consistent
- ✅ Status badges show correct colors
- ✅ Avatar group displays properly
- ✅ Category tags have emojis
- ✅ Animations are smooth

---

## Rollback Plan

If issues occur during migration:

### Keep Both Versions

```typescript
// Use alias for new components
import { PrayerCard as PrayerCardV2 } from '@/components/features/prayer';
import PrayerCardV1 from '@/components/PrayerCard';

// Switch based on feature flag
const PrayerCard = useFeatureFlag('prayer-v2') ? PrayerCardV2 : PrayerCardV1;
```

### Gradual Rollout

```typescript
// Migrate one page at a time
// /prayers/[id] - Use v2.0
// /groups/[id] - Still use v1.0
// /dashboard - Still use v1.0
```

---

## Testing Checklist

### Unit Tests

- [ ] PrayButton long-press timer works
- [ ] PrayButton cancels on release
- [ ] Confetti animation triggers
- [ ] Haptic feedback calls navigator.vibrate
- [ ] State updates correctly
- [ ] API integration works

### Integration Tests

- [ ] Prayer submission flows end-to-end
- [ ] Optimistic updates work
- [ ] Error handling displays properly
- [ ] Loading states show skeletons

### Visual Tests

- [ ] Component renders correctly in Storybook
- [ ] All variants display properly
- [ ] Animations are smooth
- [ ] Responsive layout works

### Accessibility Tests

- [ ] Keyboard navigation works
- [ ] Screen reader announces correctly
- [ ] Touch targets are 44x44px minimum
- [ ] Color contrast passes WCAG AA

---

## Common Issues & Solutions

### Issue: Long-press not working on iOS

**Problem**: Touch events not preventing default behavior

**Solution**:
```tsx
const handleTouchStart = (e: React.TouchEvent) => {
  e.preventDefault(); // Add this!
  startLongPress();
};
```

### Issue: Confetti not showing

**Problem**: AnimatePresence not wrapping particles

**Solution**:
```tsx
<AnimatePresence>
  {showConfetti && <ConfettiParticles />}
</AnimatePresence>
```

### Issue: Timer memory leak

**Problem**: Timers not cleaned up on unmount

**Solution**:
```tsx
useEffect(() => {
  return () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };
}, []);
```

### Issue: Avatar images not loading

**Problem**: Missing src prop or CORS issues

**Solution**:
```tsx
<Avatar
  name={user.name}
  src={user.avatarUrl}  // Ensure valid URL
/>
```

---

## FAQ

### Q: Do I need to migrate all pages at once?

**A**: No, migrate gradually. Keep v1.0 components until all pages are migrated.

### Q: Will v1.0 components be removed?

**A**: Eventually yes, but not immediately. They'll be deprecated first with warnings.

### Q: Can I customize the long-press duration?

**A**: Currently hardcoded to 800ms. File a feature request if you need customization.

### Q: How do I handle offline mode?

**A**: Use optimistic updates. The component already updates state before API call.

### Q: Can I disable the confetti animation?

**A**: Currently no prop for this. You can fork the component if needed.

### Q: Is the prayers list modal removed permanently?

**A**: Yes. Use a separate page or bottom sheet if you need to show the list.

---

## Resources

- [PRD v2.0](/Users/ksj/Desktop/Together_Pray/docs/app/PRD-v2.0.md)
- [PrayerCard README](./README.md)
- [Design System Docs](/Users/ksj/Desktop/Together_Pray/frontend/src/components/ui/README.md)
- [Animation Guide](/Users/ksj/Desktop/Together_Pray/frontend/src/lib/ANIMATIONS_README.md)
- [Example Usage](./PrayerCard.example.tsx)

---

## Support

If you encounter issues during migration:

1. Check this migration guide
2. Review the README.md
3. Check PrayerCard.example.tsx for working examples
4. Test with the example page
5. File an issue with reproduction steps

Happy migrating! 🙏
