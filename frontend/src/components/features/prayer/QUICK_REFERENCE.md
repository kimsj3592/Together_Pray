# PrayerCard v2.0 Quick Reference

**Quick copy-paste reference for common usage patterns**

---

## Basic Usage

### Import

```typescript
import { PrayerCard, PrayButton, PrayerCardSkeleton } from '@/components/features/prayer';
```

---

## PrayerCard

### Default Card

```tsx
<PrayerCard
  item={prayerItem}
  onPraySuccess={(count) => console.log(count)}
/>
```

### With Group Name

```tsx
<PrayerCard
  item={prayerItem}
  showGroupName={true}
/>
```

### Compact Variant

```tsx
<PrayerCard
  item={prayerItem}
  variant="compact"
/>
```

### Full Content (No Truncation)

```tsx
<PrayerCard
  item={prayerItem}
  showFullContent={true}
/>
```

### With Custom Handler

```tsx
<PrayerCard
  item={prayerItem}
  onPraySuccess={(newCount) => {
    // Update parent state
    setPrayCount(newCount);
    // Track analytics
    trackEvent('prayer_completed');
    // Refresh data
    refetch();
  }}
/>
```

---

## PrayButton

### Default Button

```tsx
<PrayButton
  prayerItemId="prayer-123"
  initialPrayCount={12}
/>
```

### Small Size

```tsx
<PrayButton
  prayerItemId="prayer-123"
  initialPrayCount={12}
  size="sm"
/>
```

### Large Size

```tsx
<PrayButton
  prayerItemId="prayer-123"
  initialPrayCount={12}
  size="lg"
/>
```

### With Count Display

```tsx
<PrayButton
  prayerItemId="prayer-123"
  initialPrayCount={12}
  showCount={true}
/>
```

### Already Prayed

```tsx
<PrayButton
  prayerItemId="prayer-123"
  initialPrayCount={12}
  initialHasPrayedToday={true}
/>
```

### Standalone (Outside Card)

```tsx
<PrayButton
  prayerItemId="prayer-123"
  initialPrayCount={12}
  size="lg"
  onPraySuccess={(count) => console.log('Prayed!', count)}
  showCount={true}
/>
```

---

## PrayerCardSkeleton

### Single Skeleton

```tsx
<PrayerCardSkeleton />
```

### Multiple Skeletons

```tsx
<PrayerCardSkeleton count={5} />
```

### Compact Skeletons

```tsx
<PrayerCardSkeleton variant="compact" count={3} />
```

---

## Common Patterns

### List with Loading

```tsx
function PrayerList({ groupId }) {
  const { data, isLoading } = usePrayers(groupId);

  if (isLoading) {
    return <PrayerCardSkeleton count={5} />;
  }

  return (
    <div className="space-y-4">
      {data.items.map((item) => (
        <PrayerCard key={item.id} item={item} />
      ))}
    </div>
  );
}
```

### With Stagger Animation

```tsx
import { motion } from 'framer-motion';
import { listContainer, listItem } from '@/lib/animations';

<motion.div
  variants={listContainer}
  initial="hidden"
  animate="visible"
>
  {prayers.map((prayer, i) => (
    <motion.div
      key={prayer.id}
      variants={listItem}
      transition={{ delay: i * 0.05 }}
    >
      <PrayerCard item={prayer} />
    </motion.div>
  ))}
</motion.div>
```

### Optimistic Updates

```tsx
const [prayers, setPrayers] = useState(initialPrayers);

const handlePraySuccess = (prayerId: string) => (newCount: number) => {
  // Update state immediately
  setPrayers(prev => prev.map(p =>
    p.id === prayerId
      ? { ...p, hasPrayedToday: true, _count: { ...p._count, reactions: newCount } }
      : p
  ));
};

<PrayerCard
  item={prayer}
  onPraySuccess={handlePraySuccess(prayer.id)}
/>
```

### Infinite Scroll

```tsx
import InfiniteScroll from 'react-infinite-scroll-component';

<InfiniteScroll
  dataLength={prayers.length}
  next={fetchMore}
  hasMore={hasMore}
  loader={<PrayerCardSkeleton count={3} />}
>
  {prayers.map((prayer) => (
    <PrayerCard key={prayer.id} item={prayer} />
  ))}
</InfiniteScroll>
```

### Grouped by Status

```tsx
const prayingItems = prayers.filter(p => p.status === 'praying');
const answeredItems = prayers.filter(p => p.status === 'answered');

<div className="space-y-8">
  <section>
    <h2>기도중</h2>
    <div className="space-y-4">
      {prayingItems.map((item) => (
        <PrayerCard key={item.id} item={item} />
      ))}
    </div>
  </section>

  <section>
    <h2>응답 완료</h2>
    <div className="space-y-4">
      {answeredItems.map((item) => (
        <PrayerCard key={item.id} item={item} />
      ))}
    </div>
  </section>
</div>
```

---

## Size Reference

### PrayButton Sizes

| Size | Height | Padding | Font Size |
|------|--------|---------|-----------|
| `sm` | 36px | 12px 12px | 13px |
| `md` | 44px | 10px 16px | 15px |
| `lg` | 52px | 12px 24px | 17px |

### PrayerCard Spacing

| Variant | Padding | Gap |
|---------|---------|-----|
| `default` | 20px | 12-16px |
| `compact` | 12px | 8-12px |

---

## Props Cheatsheet

### PrayerCard Props

```typescript
item: PrayerItem                     // Required
onPraySuccess?: (count) => void      // Optional callback
showFullContent?: boolean            // Default: false
showGroupName?: boolean              // Default: false
variant?: 'default' | 'compact'      // Default: 'default'
```

### PrayButton Props

```typescript
prayerItemId: string                 // Required
initialPrayCount: number             // Required
initialHasPrayedToday?: boolean      // Default: false
size?: 'sm' | 'md' | 'lg'           // Default: 'md'
onPraySuccess?: (count) => void      // Optional callback
showCount?: boolean                  // Default: false
```

### PrayerCardSkeleton Props

```typescript
variant?: 'default' | 'compact'      // Default: 'default'
count?: number                       // Default: 1
```

---

## CSS Variables Used

```css
/* Colors */
--color-text-primary
--color-text-secondary
--color-text-tertiary
--color-bg-card
--color-bg-secondary
--color-border

/* Status Colors */
--color-status-praying-bg
--color-status-praying-text
--color-status-partial-bg
--color-status-partial-text
--color-status-answered-bg
--color-status-answered-text

/* Typography */
--font-size-xs: 11px
--font-size-sm: 13px
--font-size-base: 15px
--font-size-lg: 17px

/* Spacing */
--space-3: 12px
--space-4: 16px
--space-5: 20px

/* Border Radius */
--radius-md: 12px
--radius-lg: 16px
--radius-full: 9999px

/* Shadows */
--shadow-sm
--shadow-md
--shadow-lg
```

---

## Category Emoji Map

```typescript
건강: '🏥'
가족: '👨‍👩‍👧‍👦'
직장: '💼'
학업: '📚'
관계: '🤝'
영적성장: '✝️'
재정: '💰'
기타: '📝'
```

---

## Status Labels

```typescript
praying: '기도중'
partial_answer: '부분 응답'
answered: '응답 완료'
```

---

## Animation Variants

```typescript
// Card animation
import { cardHover } from '@/lib/animations';

<motion.div
  variants={cardHover}
  initial="initial"
  animate="animate"
  whileHover="hover"
  whileTap="tap"
>

// Spring config
import { springConfig } from '@/lib/animations';

transition={springConfig.snappy}  // Quick and responsive
transition={springConfig.bouncy}  // Playful bounce
transition={springConfig.gentle}  // Smooth and soft
```

---

## Troubleshooting

### Long-press not working

```tsx
// Add preventDefault to touch events
const handleTouchStart = (e: React.TouchEvent) => {
  e.preventDefault();
  startLongPress();
};
```

### Confetti not showing

```tsx
// Wrap with AnimatePresence
<AnimatePresence>
  {showConfetti && <Confetti />}
</AnimatePresence>
```

### Timer memory leak

```tsx
// Add cleanup
useEffect(() => {
  return () => {
    if (timer) clearTimeout(timer);
  };
}, []);
```

---

## Testing Examples

### Unit Test

```typescript
test('long press completes prayer', async () => {
  const onSuccess = jest.fn();
  render(<PrayButton prayerItemId="1" initialPrayCount={5} onPraySuccess={onSuccess} />);

  const button = screen.getByText('기도하기');
  fireEvent.mouseDown(button);

  await waitFor(() => {
    expect(onSuccess).toHaveBeenCalledWith(6);
  }, { timeout: 1000 });
});
```

### Integration Test

```typescript
test('prayer card updates count on pray', async () => {
  const { rerender } = render(<PrayerCard item={mockPrayer} />);

  const button = screen.getByText('기도하기');
  fireEvent.mouseDown(button);

  await waitFor(() => {
    expect(screen.getByText('13명')).toBeInTheDocument();
  });
});
```

---

## Migration from v1.0

```typescript
// OLD
import PrayerCard from '@/components/PrayerCard';
<PrayerCard item={item} size="large" />

// NEW
import { PrayerCard } from '@/components/features/prayer';
<PrayerCard item={item} variant="default" size="lg" />
```

---

**See Also:**
- [Full README](./README.md)
- [Migration Guide](./MIGRATION_GUIDE.md)
- [Implementation Summary](./IMPLEMENTATION_SUMMARY.md)
- [Examples](./PrayerCard.example.tsx)
