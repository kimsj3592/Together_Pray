# Animation Reference Guide - Together Pray v2.0

Quick reference for developers implementing animations in the Together Pray app.

## Import Patterns

```typescript
// For button animations
import { unifiedButtonPress } from '@/lib/animations';

// For card animations
import { unifiedCardInteraction } from '@/lib/animations';

// For list stagger animations
import { staggerContainer, listItemAnimation } from '@/lib/animations';

// For Pull to Refresh
import { PullToRefresh } from '@/components/ui/PullToRefresh';
```

## Usage Examples

### 1. Button Animation

```typescript
// Standard button with press feedback
<motion.button
  {...unifiedButtonPress}
  className="btn-primary"
>
  Click me
</motion.button>
```

### 2. Card Animation

```typescript
// Interactive card with hover/tap effects
<motion.div
  {...unifiedCardInteraction}
  className="card p-4"
>
  Card content
</motion.div>
```

### 3. List Stagger Animation

```typescript
// Container with stagger effect
<motion.div
  variants={staggerContainer}
  initial="hidden"
  animate="visible"
  className="space-y-4"
>
  {items.map((item) => (
    <motion.div
      key={item.id}
      variants={listItemAnimation}
    >
      <ListItem item={item} />
    </motion.div>
  ))}
</motion.div>
```

### 4. Pull to Refresh

```typescript
// Wrap your page content
<PullToRefresh
  onRefresh={async () => {
    await loadData();
  }}
  disabled={isLoading}
>
  <main>
    {/* Your page content */}
  </main>
</PullToRefresh>
```

## Animation Timing Reference

| Animation Type | Duration | Easing | Spring Config |
|---------------|----------|--------|---------------|
| Button Press | - | - | snappy (500/30) |
| Button Release | - | - | snappy (500/30) |
| Card Hover | 150ms | ease-out | - |
| Card Tap | 150ms | ease-out | - |
| List Item | 200ms | ease-out | normal |
| Stagger Delay | 50ms | - | - |
| Pull Threshold | 80px | - | - |

## Component-Specific Animations

### Button Component
- **Built-in**: All `<Button>` components have unified press animation
- **No extra work**: Just use the component

### Card Component
- **Built-in**: All interactive cards have hover/tap effects
- **Trigger**: Set `interactive={true}` or add `onClick` handler

## Page-Level Patterns

### Groups Page
```typescript
// Pull to Refresh wrapper
<PullToRefresh onRefresh={loadGroups}>
  {/* Staggered grid */}
  <motion.div variants={staggerContainer} initial="hidden" animate="visible">
    {groups.map(group => (
      <motion.div key={group.id} variants={listItemAnimation}>
        <Card>{/* group content */}</Card>
      </motion.div>
    ))}
  </motion.div>
</PullToRefresh>
```

### Prayer List Page
```typescript
// Pull to Refresh + Stagger
<PullToRefresh onRefresh={loadPrayers}>
  <motion.div variants={staggerContainer} initial="hidden" animate="visible">
    {prayers.map(prayer => (
      <motion.div key={prayer.id} variants={listItemAnimation}>
        <PrayerCard prayer={prayer} />
      </motion.div>
    ))}
  </motion.div>
</PullToRefresh>
```

### Home Dashboard
```typescript
// Pull to Refresh for entire dashboard
<PullToRefresh onRefresh={loadDashboard}>
  <motion.div variants={listContainer} initial="hidden" animate="visible">
    {/* Dashboard sections with built-in animations */}
  </motion.div>
</PullToRefresh>
```

## Common Patterns

### Loading States
```typescript
// Don't animate while loading
{loading ? (
  <Skeleton />
) : (
  <motion.div variants={staggerContainer} initial="hidden" animate="visible">
    {/* content */}
  </motion.div>
)}
```

### Conditional Animations
```typescript
// Disable animations when needed
<motion.button
  {...unifiedButtonPress}
  disabled={isDisabled}
  className="btn-primary"
>
  {/* Button content */}
</motion.button>
```

### Custom Refresh Logic
```typescript
<PullToRefresh
  onRefresh={async () => {
    try {
      await Promise.all([
        loadGroups(),
        loadStats(),
        loadPrayers()
      ]);
    } catch (error) {
      // Handle error
    }
  }}
  threshold={100} // Custom threshold
  disabled={isLoading || isOffline}
>
  {/* content */}
</PullToRefresh>
```

## Do's and Don'ts

### ✅ Do
- Use unified animations for consistency
- Apply stagger to lists with 3+ items
- Add Pull to Refresh on data-heavy pages
- Respect the `disabled` prop for buttons
- Use `springConfig.snappy` for interactions

### ❌ Don't
- Mix custom animations with unified ones
- Create new button/card animations
- Skip stagger delays (use 50ms standard)
- Forget to handle loading states
- Override transition durations without reason

## Accessibility

All animations respect `prefers-reduced-motion`:
```typescript
// Built into animations.ts
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};
```

## Testing Checklist

- [ ] Button press feels snappy (not sluggish)
- [ ] Card hover is subtle (2px lift)
- [ ] List items stagger smoothly
- [ ] Pull to Refresh triggers at 80px
- [ ] Refresh indicator rotates during pull
- [ ] No animation jank on low-end devices
- [ ] Reduced motion preference respected

## Performance Tips

1. **Avoid animating height**: Use opacity/transform instead
2. **Use `will-change` sparingly**: Let Framer Motion handle it
3. **Keep stagger delays short**: 50ms is optimal
4. **Limit concurrent animations**: Max 20 items staggered at once
5. **Test on real devices**: Emulators don't show true performance

## Spring Configuration Reference

```typescript
export const springConfig = {
  gentle: { stiffness: 120, damping: 14 },  // Slow, smooth
  bouncy: { stiffness: 400, damping: 25 },  // Playful
  snappy: { stiffness: 500, damping: 30 },  // Quick, responsive
  stiff: { stiffness: 700, damping: 30 },   // Very fast
};
```

Use `snappy` for most interactions (buttons, cards).

## Questions?

Refer to:
- `/src/lib/animations.ts` - All animation utilities
- `/src/components/ui/PullToRefresh.tsx` - Pull to Refresh implementation
- `/src/components/ui/Button.tsx` - Button animation example
- `/src/components/ui/Card.tsx` - Card animation example
