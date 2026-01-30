# Prayer Feature Components

Together Pray v2.0 - Prayer-related UI components following Toss-style design principles.

## Components

### PrayerCard

Modern prayer card component with Toss-style design and smooth animations.

**Features:**
- Responsive mobile-first design
- Author information with avatar
- Status badges (기도중, 부분 응답, 응답 완료)
- Category tags with emoji
- Update count display
- Prayer count with avatar group
- Integrated PrayButton
- Hover and tap animations
- Compact variant support

**Usage:**

```tsx
import { PrayerCard } from '@/components/features/prayer';

<PrayerCard
  item={prayerItem}
  onPraySuccess={(newCount) => console.log('New count:', newCount)}
  showGroupName={true}
  variant="default"
/>
```

**Props:**

```typescript
interface PrayerCardProps {
  item: PrayerItem;                    // Prayer item data
  onPraySuccess?: (newCount: number) => void;  // Callback on pray success
  showFullContent?: boolean;           // Show full content or truncate
  showGroupName?: boolean;             // Display group name in header
  variant?: 'default' | 'compact';     // Card size variant
}
```

**Variants:**
- `default`: Full-size card with all information (p-5)
- `compact`: Condensed card for lists (p-3)

---

### PrayButton

Interactive prayer button with long-press gesture and delightful animations.

**Features:**
- 800ms long-press interaction
- Circular progress indicator
- Haptic feedback (vibration)
- Confetti celebration on success
- Optimistic UI updates
- Three states: default, pressing, completed
- Responsive sizing (sm, md, lg)
- Disabled state for already prayed

**Usage:**

```tsx
import { PrayButton } from '@/components/features/prayer';

<PrayButton
  prayerItemId="prayer-123"
  initialPrayCount={12}
  initialHasPrayedToday={false}
  size="md"
  onPraySuccess={(newCount) => console.log('Prayed!', newCount)}
  showCount={true}
/>
```

**Props:**

```typescript
interface PrayButtonProps {
  prayerItemId: string;                      // Prayer item ID
  initialPrayCount: number;                  // Initial prayer count
  initialHasPrayedToday?: boolean;           // Already prayed today
  size?: 'sm' | 'md' | 'lg';                // Button size
  onPraySuccess?: (newCount: number) => void; // Success callback
  showCount?: boolean;                       // Display count next to button
}
```

**Interaction Flow:**

1. **Press Start**: User presses and holds button
2. **Progress**: Circular progress indicator fills over 800ms
3. **Completion**:
   - API call triggered
   - Haptic feedback (vibration)
   - Confetti animation
   - State changes to "기도함"
4. **Cancel**: Release before 800ms cancels the action

**States:**
- `default`: "기도하기" - Blue gradient background
- `pressing`: 🙏 emoji with circular progress
- `completed`: ✓ "기도함" - Gray background, disabled

---

### PrayerCardSkeleton

Loading skeleton for PrayerCard with matching layout.

**Usage:**

```tsx
import { PrayerCardSkeleton } from '@/components/features/prayer';

// Single skeleton
<PrayerCardSkeleton variant="default" />

// Multiple skeletons
<PrayerCardSkeleton variant="compact" count={5} />
```

**Props:**

```typescript
interface PrayerCardSkeletonProps {
  variant?: 'default' | 'compact';  // Match card variant
  count?: number;                   // Number of skeletons to render
}
```

---

## Design System Integration

### Colors Used

```css
/* Primary - Blue gradient for pray button */
--color-primary-500: 99 102 241;

/* Status badges */
--color-status-praying-bg: 219 234 254;
--color-status-praying-text: 30 64 175;
--color-status-partial-bg: 254 249 195;
--color-status-partial-text: 161 98 7;
--color-status-answered-bg: 209 250 229;
--color-status-answered-text: 6 95 70;

/* Backgrounds */
--color-bg-card: 255 255 255;
--color-bg-secondary: 249 250 251;
--color-bg-tertiary: 243 244 246;

/* Text */
--color-text-primary: 17 24 39;
--color-text-secondary: 107 114 128;
--color-text-tertiary: 156 163 175;

/* Borders */
--color-border: 229 231 235;
```

### Typography

```css
--font-size-xs: 11px;
--font-size-sm: 13px;
--font-size-base: 15px;
--font-size-lg: 17px;
```

### Spacing

```css
--space-3: 12px;  /* Compact padding */
--space-4: 16px;
--space-5: 20px;  /* Default padding */
```

### Border Radius

```css
--radius-md: 12px;   /* Card border */
--radius-lg: 16px;   /* Button border */
--radius-full: 9999px; /* Badge, Avatar */
```

### Shadows

```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.07);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.08);
```

---

## Animations

### Card Hover Animation

```typescript
import { cardHover } from '@/lib/animations';

<motion.div
  variants={cardHover}
  initial="initial"
  animate="animate"
  whileHover="hover"
  whileTap="tap"
>
  <Card>...</Card>
</motion.div>
```

- **Hover**: y: -2px, shadow elevation
- **Tap**: scale: 0.98

### Button Spring Animation

```typescript
import { springConfig } from '@/lib/animations';

<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.95 }}
  transition={springConfig.snappy}
>
```

### Confetti Particles

Radial burst animation with 8 particles:
- Emoji variations: 🙏, ✨, 💫
- Distance: 60px from center
- Duration: 600ms ease-out
- Opacity: 1 → 0

---

## Accessibility

### Touch Targets

All interactive elements meet 44x44px minimum:
- PrayButton: min-h-[44px] (default)
- Card tap area: Full card clickable
- Link to detail: Entire content area

### Keyboard Navigation

- Tab-accessible buttons
- Enter/Space to activate
- Focus indicators (browser default)

### Screen Readers

- Semantic HTML structure
- Alt text for avatars
- ARIA labels where needed

### Haptic Feedback

```typescript
if ('vibrate' in navigator) {
  navigator.vibrate(50); // 50ms vibration
}
```

Gracefully degrades when not supported.

---

## Mobile Optimizations

### Touch-Friendly Interactions

- Long-press instead of click (prevents accidental taps)
- Large touch targets (44x44px minimum)
- No hover-dependent UI
- Smooth 60fps animations

### Performance

- Optimistic UI updates
- Lazy-loaded confetti particles
- CSS-based animations where possible
- Proper cleanup of timers/intervals

### Safe Areas

Components respect iOS safe areas:
- Bottom padding: `pb-safe`
- Top padding: `pt-safe`

---

## Advanced Usage

### Custom Prayer Success Handler

```tsx
const handlePraySuccess = async (newCount: number) => {
  // Optimistic update
  setPrayerCount(newCount);

  // Analytics
  trackEvent('prayer_completed', { prayerId, newCount });

  // Refresh related data
  await refetchPrayerList();
};

<PrayerCard item={item} onPraySuccess={handlePraySuccess} />
```

### List with Stagger Animation

```tsx
import { motion } from 'framer-motion';
import { listContainer, listItem } from '@/lib/animations';

<motion.div
  variants={listContainer}
  initial="hidden"
  animate="visible"
>
  {prayers.map((prayer, index) => (
    <motion.div
      key={prayer.id}
      variants={listItem}
      transition={{ delay: index * 0.05 }}
    >
      <PrayerCard item={prayer} />
    </motion.div>
  ))}
</motion.div>
```

### Loading States

```tsx
const { data, isLoading } = usePrayers(groupId);

{isLoading ? (
  <PrayerCardSkeleton count={5} />
) : (
  data.items.map((item) => (
    <PrayerCard key={item.id} item={item} />
  ))
)}
```

### Infinite Scroll Integration

```tsx
import InfiniteScroll from 'react-infinite-scroll-component';

<InfiniteScroll
  dataLength={prayers.length}
  next={fetchMorePrayers}
  hasMore={hasMore}
  loader={<PrayerCardSkeleton count={3} />}
>
  {prayers.map((prayer) => (
    <PrayerCard key={prayer.id} item={prayer} />
  ))}
</InfiniteScroll>
```

---

## Browser Support

- **Modern browsers**: Chrome 90+, Safari 14+, Firefox 88+
- **Mobile**: iOS 14+, Android Chrome 90+
- **Vibration API**: iOS 13+, Android 4.4+
- **Fallbacks**: Graceful degradation for unsupported features

---

## Migration Guide

### From Old PrayerCard

```tsx
// OLD (v1.0)
import PrayerCard from '@/components/PrayerCard';

<PrayerCard
  item={item}
  onPraySuccess={handler}
  showFullContent={false}
/>

// NEW (v2.0)
import { PrayerCard } from '@/components/features/prayer';

<PrayerCard
  item={item}
  onPraySuccess={handler}
  showFullContent={false}
  variant="default"
  showGroupName={true}
/>
```

### From Old PrayButton

```tsx
// OLD (v1.0)
import PrayButton from '@/components/PrayButton';

<PrayButton
  prayerItemId={id}
  initialPrayCount={count}
  initialHasPrayedToday={false}
  size="large"
  onPraySuccess={handler}
/>

// NEW (v2.0)
import { PrayButton } from '@/components/features/prayer';

<PrayButton
  prayerItemId={id}
  initialPrayCount={count}
  initialHasPrayedToday={false}
  size="lg"  // 'small' → 'sm', 'large' → 'lg'
  onPraySuccess={handler}
  showCount={false}
/>
```

**Key differences:**
- Size prop: `'small'` → `'sm'`, `'large'` → `'lg'`
- New long-press interaction (800ms)
- Confetti animation on success
- Circular progress indicator
- Haptic feedback support

---

## Testing

### Unit Tests

```tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PrayButton } from './PrayButton';

test('long press completes prayer', async () => {
  const onSuccess = jest.fn();

  render(
    <PrayButton
      prayerItemId="test-123"
      initialPrayCount={5}
      onPraySuccess={onSuccess}
    />
  );

  const button = screen.getByText('기도하기');

  // Simulate long press
  fireEvent.mouseDown(button);
  await waitFor(() => {
    expect(onSuccess).toHaveBeenCalledWith(6);
  }, { timeout: 1000 });
});
```

### Visual Testing

Use Storybook for component variations:

```tsx
// PrayButton.stories.tsx
export const Default = () => (
  <PrayButton prayerItemId="1" initialPrayCount={0} />
);

export const AlreadyPrayed = () => (
  <PrayButton prayerItemId="1" initialPrayCount={12} initialHasPrayedToday={true} />
);

export const Sizes = () => (
  <div className="space-y-4">
    <PrayButton prayerItemId="1" initialPrayCount={5} size="sm" />
    <PrayButton prayerItemId="1" initialPrayCount={5} size="md" />
    <PrayButton prayerItemId="1" initialPrayCount={5} size="lg" />
  </div>
);
```

---

## Troubleshooting

### Long press not working

**Issue**: Button triggers immediately instead of waiting 800ms

**Solution**: Check that event handlers are properly preventing default:
```tsx
const handleTouchStart = (e: React.TouchEvent) => {
  e.preventDefault(); // Important!
  startLongPress();
};
```

### Confetti not showing

**Issue**: Confetti particles don't appear after prayer

**Solution**: Ensure AnimatePresence is wrapping the confetti elements:
```tsx
<AnimatePresence>
  {showConfetti && <ConfettiParticles />}
</AnimatePresence>
```

### Progress circle not visible

**Issue**: Circular progress indicator doesn't render

**Solution**: Check that SVG viewBox and transform are correct:
```tsx
<svg style={{ transform: 'rotate(-90deg)' }}>
  <circle cx="50%" cy="50%" r="40%" />
</svg>
```

---

## Future Enhancements

- [ ] Prayer streak tracking
- [ ] Animated prayer count increment
- [ ] Sound effects option
- [ ] Custom confetti patterns
- [ ] Prayer history timeline
- [ ] Group prayer notifications
- [ ] Offline support with sync

---

## Related Components

- **Card** (`@/components/ui/Card`): Base card component
- **Badge** (`@/components/ui/Badge`): Status badges
- **Avatar** (`@/components/ui/Avatar`): User avatars
- **AvatarGroup** (`@/components/ui/Avatar`): Stacked avatars
- **Button** (`@/components/ui/Button`): Base button component
- **Skeleton** (`@/components/ui/Skeleton`): Loading skeletons

---

## References

- [PRD v2.0](/Users/ksj/Desktop/Together_Pray/docs/app/PRD-v2.0.md)
- [Design System](/Users/ksj/Desktop/Together_Pray/frontend/src/components/ui/README.md)
- [Animation System](/Users/ksj/Desktop/Together_Pray/frontend/src/lib/ANIMATIONS_README.md)
- [Framer Motion Docs](https://www.framer.com/motion/)
