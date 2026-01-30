# Animation Quick Reference Card

Toss-style Micro-interactions - Together Pray v2.0

## Import

```tsx
import { motion, AnimatePresence } from 'framer-motion';
import { fadeIn, buttonProps, springConfig } from '@/lib/animations';
```

## Common Patterns

### Button (Tap Effect)

```tsx
<motion.button
  whileTap={{ scale: 0.95 }}
  transition={springConfig.snappy}
>
  기도하기
</motion.button>

// Or use preset
<motion.button {...buttonProps}>Click</motion.button>
```

### Card (Hover Effect)

```tsx
<motion.div {...cardProps}>
  <h3>Title</h3>
  <p>Content</p>
</motion.div>
```

### Fade In

```tsx
<motion.div variants={fadeIn} initial="hidden" animate="visible">
  Content
</motion.div>

// Or use preset
<motion.div {...fadeInProps}>Content</motion.div>
```

### List with Stagger

```tsx
<motion.ul
  variants={listContainer}
  initial="hidden"
  animate="visible"
>
  {items.map(item => (
    <motion.li key={item.id} variants={listItem}>
      {item.name}
    </motion.li>
  ))}
</motion.ul>
```

### Modal

```tsx
<AnimatePresence>
  {isOpen && (
    <>
      {/* Overlay */}
      <motion.div
        variants={modalOverlay}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={onClose}
      />

      {/* Content */}
      <motion.div
        variants={modalContent}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {children}
      </motion.div>
    </>
  )}
</AnimatePresence>
```

### Bottom Sheet

```tsx
<AnimatePresence>
  {isOpen && (
    <motion.div
      variants={bottomSheet}
      initial="hidden"
      animate="visible"
      exit="exit"
      drag="y"
      dragConstraints={{ top: 0 }}
      dragElastic={0.2}
      onDragEnd={(_, info) => {
        if (info.offset.y > 200) onClose();
      }}
    >
      {/* Drag handle */}
      <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto my-3" />
      {children}
    </motion.div>
  )}
</AnimatePresence>
```

### Page Transition

```tsx
<motion.div
  variants={pageTransition}
  initial="initial"
  animate="animate"
  exit="exit"
>
  <h1>Page Content</h1>
</motion.div>

// Or use preset
<motion.div {...pageTransitionProps}>Content</motion.div>
```

### Toast

```tsx
<AnimatePresence>
  {isVisible && (
    <motion.div
      variants={toast}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      Message
    </motion.div>
  )}
</AnimatePresence>
```

### Skeleton Loading

```tsx
<div className="relative overflow-hidden bg-gray-200 rounded-lg h-20">
  <motion.div
    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
    animate={{ x: ['-100%', '100%'] }}
    transition={{
      duration: 1.5,
      repeat: Infinity,
      ease: 'linear',
    }}
  />
</div>
```

## Available Variants

| Variant | Description |
|---------|-------------|
| `fadeIn` | Simple opacity fade |
| `slideUp` | Slide from bottom |
| `slideDown` | Slide from top |
| `slideLeft` | Slide from right |
| `slideRight` | Slide from left |
| `scaleIn` | Scale from 0.95 to 1 |
| `cardHover` | Card with hover lift |
| `buttonTap` | Button with tap feedback |
| `pageTransition` | Page route change |
| `modalOverlay` | Modal backdrop |
| `modalContent` | Modal content |
| `bottomSheet` | Bottom sheet slide |
| `toast` | Toast notification |
| `listContainer` | List stagger container |
| `listItem` | List item animation |

## Available Preset Props

| Preset | Element | Usage |
|--------|---------|-------|
| `buttonProps` | button | `<motion.button {...buttonProps}>` |
| `cardProps` | div | `<motion.div {...cardProps}>` |
| `fadeInProps` | div | `<motion.div {...fadeInProps}>` |
| `pageTransitionProps` | div | `<motion.div {...pageTransitionProps}>` |
| `modalContentProps` | div | `<motion.div {...modalContentProps}>` |
| `bottomSheetProps` | div | `<motion.div {...bottomSheetProps}>` |
| `tapAnimation` | button | `<motion.button {...tapAnimation}>` |
| `hoverAnimation` | div | `<motion.div {...hoverAnimation}>` |

## Spring Configs

| Config | Use Case |
|--------|----------|
| `springConfig.gentle` | Modals, drawers |
| `springConfig.bouncy` | Success states, celebrations |
| `springConfig.snappy` | Buttons, cards (default) |
| `springConfig.stiff` | Tooltips, dropdowns |

## Transitions

| Transition | Duration | Use Case |
|------------|----------|----------|
| `transitions.fast` | 100ms | Button press |
| `transitions.normal` | 200ms | Standard animations |
| `transitions.slow` | 300ms | Page transitions |
| `transitions.spring` | Spring | Interactive elements |
| `transitions.modalOpen` | 250ms | Modal entrance |
| `transitions.modalClose` | 200ms | Modal exit |
| `transitions.bottomSheet` | 300ms | Bottom sheet |

## Utility Functions

### Custom Stagger

```tsx
const customStagger = createStaggerContainer(0.1, 0.2);

<motion.div variants={customStagger} initial="hidden" animate="visible">
  {/* Children will stagger with 0.1s delay, starting after 0.2s */}
</motion.div>
```

### Custom Slide

```tsx
const slideVariant = createSlideAnimation('up', 30);

<motion.div variants={slideVariant} initial="hidden" animate="visible">
  Content
</motion.div>
```

### Custom Scale

```tsx
const scaleVariant = createScaleAnimation(0.8, 1.2);

<motion.div variants={scaleVariant} initial="hidden" animate="visible">
  Content
</motion.div>
```

### Reduced Motion Check

```tsx
import { prefersReducedMotion, getMotionVariant } from '@/lib/animations';

// Check preference
if (prefersReducedMotion()) {
  // Use instant transitions
}

// Auto-adapt variants
const variant = getMotionVariant(slideUp);
<motion.div variants={variant} initial="hidden" animate="visible">
```

## Common Mistakes

❌ **Forget AnimatePresence for exit animations**
```tsx
{isOpen && <motion.div exit="exit">...</motion.div>}
```

✅ **Use AnimatePresence**
```tsx
<AnimatePresence>
  {isOpen && <motion.div exit="exit">...</motion.div>}
</AnimatePresence>
```

❌ **Animate layout properties**
```tsx
<motion.div animate={{ width: 200, height: 100 }}>
```

✅ **Use transform instead**
```tsx
<motion.div animate={{ scale: 1.2 }}>
```

❌ **Put transition in wrong place**
```tsx
<motion.div animate={{ scale: 1 }} transition={springConfig.snappy}>
  <motion.button whileTap={{ scale: 0.95 }}>
```

✅ **Transition at gesture level**
```tsx
<motion.button
  whileTap={{ scale: 0.95 }}
  transition={springConfig.snappy}
>
```

## Performance Tips

1. Use `transform` and `opacity` (GPU accelerated)
2. Avoid animating `width`, `height`, `top`, `left`
3. Keep duration under 300ms for frequent interactions
4. Limit confetti particles to ~20
5. Test on actual mobile devices

## Files

- **Core**: `src/lib/animations.ts`
- **Examples**: `src/lib/animations.examples.tsx`
- **Docs**: `src/lib/ANIMATIONS_README.md`
- **Demo**: `src/lib/animations.test-demo.tsx`

---

**Need more help?** Check `ANIMATIONS_README.md` for full API reference.
