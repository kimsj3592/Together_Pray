# Framer Motion Animation System

Together Pray v2.0 Animation System - Toss-style delightful micro-interactions

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Animation Specifications](#animation-specifications)
- [API Reference](#api-reference)
- [Usage Examples](#usage-examples)
- [Best Practices](#best-practices)
- [Accessibility](#accessibility)

## Overview

This animation system provides a comprehensive set of Framer Motion animations following the PRD v2.0 specifications. All animations are optimized for 60fps performance on mobile devices and respect user preferences for reduced motion.

### Features

- Pre-configured spring and transition presets
- Ready-to-use animation variants
- Gesture-based interactions (tap, hover, drag)
- Accessibility support (reduced motion)
- TypeScript type safety
- Mobile-optimized performance

## Quick Start

### Basic Usage

```tsx
import { motion } from 'framer-motion';
import { fadeIn, buttonProps, springConfig } from '@/lib/animations';

// Variant approach
<motion.div variants={fadeIn} initial="hidden" animate="visible">
  Content
</motion.div>

// Preset props approach
<motion.button {...buttonProps}>
  Click me
</motion.button>

// Direct animation approach
<motion.button
  whileTap={{ scale: 0.95 }}
  transition={springConfig.snappy}
>
  Click me
</motion.button>
```

### AnimatePresence for Exit Animations

```tsx
import { AnimatePresence, motion } from 'framer-motion';
import { modalContent } from '@/lib/animations';

<AnimatePresence>
  {isOpen && (
    <motion.div variants={modalContent} initial="hidden" animate="visible" exit="exit">
      Modal content
    </motion.div>
  )}
</AnimatePresence>
```

## Animation Specifications

### Timing Table

| Animation | Duration | Easing | Transform |
|-----------|----------|--------|-----------|
| Button Press | 100ms | ease-out | scale(0.95) |
| Button Release | 200ms | spring | scale(1) |
| Card Hover | 150ms | ease-out | translateY(-2px) + shadow |
| Page Transition | 300ms | ease-in-out | opacity + translateX(20px) |
| Modal Open | 250ms | spring | scale(0.95→1) + opacity |
| Modal Close | 200ms | ease-in | scale(1→0.95) + opacity |
| Bottom Sheet | 300ms | spring | translateY(100%→0) |
| Skeleton Shimmer | 1.5s | linear | gradient slide (infinite) |
| Confetti | 1000ms | ease-out | particle spread |

### Spring Configurations

```typescript
springConfig.gentle    // { stiffness: 120, damping: 14 }  - Smooth, soft
springConfig.bouncy    // { stiffness: 400, damping: 25 }  - Playful bounce
springConfig.snappy    // { stiffness: 500, damping: 30 }  - Quick, responsive
springConfig.stiff     // { stiffness: 700, damping: 30 }  - Very quick
```

## API Reference

### Animation Variants

#### Basic Animations

- `fadeIn` - Simple opacity fade in/out
- `fadeInWithTransition(duration)` - Fade with custom duration
- `slideUp` - Slide from bottom with fade
- `slideDown` - Slide from top with fade
- `slideLeft` - Slide from right with fade
- `slideRight` - Slide from left with fade
- `scaleIn` - Scale from 0.95 to 1 with fade
- `scaleOut` - Scale from 1.05 to 1 with fade

#### Component-Specific Variants

- `cardHover` - Card with hover lift and tap scale
- `buttonTap` - Button with hover scale and tap feedback
- `pageTransition` - Page route change animation
- `modalOverlay` - Modal backdrop fade
- `modalContent` - Modal content scale + fade
- `bottomSheet` - Bottom sheet slide up
- `toast` - Toast notification slide + bounce
- `listContainer` - Container for stagger animations
- `listItem` - Individual list item animation

### Preset Props

Ready-to-spread animation props for common use cases:

```typescript
pageTransitionProps    // For page wrappers
modalContentProps      // For modal content
bottomSheetProps       // For bottom sheets (includes drag)
fadeInProps           // For simple fade animations
cardProps             // For interactive cards
buttonProps           // For buttons
tapAnimation          // Simple tap gesture
hoverAnimation        // Simple hover gesture
```

### Transition Presets

```typescript
transitions.fast          // 100ms ease-out
transitions.normal        // 200ms ease-out
transitions.slow          // 300ms ease-in-out
transitions.spring        // Snappy spring
transitions.springGentle  // Gentle spring
transitions.springBouncy  // Bouncy spring
transitions.modalOpen     // 250ms spring
transitions.modalClose    // 200ms ease-in
transitions.bottomSheet   // 300ms spring
```

### Utility Functions

#### createStaggerContainer(staggerDelay, delayChildren)

Create custom stagger animation for list children.

```tsx
const customStagger = createStaggerContainer(0.1, 0.2);

<motion.ul variants={customStagger} initial="hidden" animate="visible">
  {items.map(item => (
    <motion.li variants={listItem}>{item}</motion.li>
  ))}
</motion.ul>
```

#### createSlideAnimation(direction, distance)

Create custom slide animation with specific direction and distance.

```tsx
const slideVariant = createSlideAnimation('up', 30);

<motion.div variants={slideVariant} initial="hidden" animate="visible">
  Content
</motion.div>
```

#### createScaleAnimation(initialScale, targetScale)

Create custom scale animation with specific values.

```tsx
const scaleVariant = createScaleAnimation(0.8, 1.2);

<motion.div variants={scaleVariant} initial="hidden" animate="visible">
  Content
</motion.div>
```

#### getMotionVariant(normalVariant, reducedVariant?)

Get appropriate variant based on user's motion preferences.

```tsx
const variant = getMotionVariant(slideUp);

<motion.div variants={variant} initial="hidden" animate="visible">
  Accessible animation
</motion.div>
```

#### prefersReducedMotion()

Check if user prefers reduced motion.

```tsx
if (prefersReducedMotion()) {
  // Use instant transitions
} else {
  // Use full animations
}
```

## Usage Examples

### 1. Button with Tap Animation

```tsx
import { motion } from 'framer-motion';
import { tapAnimation, springConfig } from '@/lib/animations';

function PrayButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      className="px-6 py-3 bg-primary-500 text-white rounded-lg"
      whileTap={{ scale: 0.95 }}
      transition={springConfig.snappy}
      onClick={onClick}
    >
      기도하기
    </motion.button>
  );
}
```

### 2. Card with Hover Effect

```tsx
import { motion } from 'framer-motion';
import { cardProps } from '@/lib/animations';

function PrayerCard({ prayer }: { prayer: Prayer }) {
  return (
    <motion.div
      className="p-4 bg-white rounded-lg shadow-sm"
      {...cardProps}
    >
      <h3>{prayer.title}</h3>
      <p>{prayer.content}</p>
    </motion.div>
  );
}
```

### 3. Page Transition

```tsx
import { motion } from 'framer-motion';
import { pageTransitionProps } from '@/lib/animations';

export default function Page() {
  return (
    <motion.div {...pageTransitionProps}>
      <h1>Page Content</h1>
    </motion.div>
  );
}
```

### 4. Modal with Overlay

```tsx
import { AnimatePresence, motion } from 'framer-motion';
import { modalOverlay, modalContentProps } from '@/lib/animations';

function Modal({ isOpen, onClose, children }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            variants={modalOverlay}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-md mx-auto bg-white rounded-2xl p-6"
            {...modalContentProps}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```

### 5. Bottom Sheet with Drag

```tsx
import { AnimatePresence, motion } from 'framer-motion';
import { bottomSheetProps, modalOverlay } from '@/lib/animations';

function BottomSheet({ isOpen, onClose, children }: BottomSheetProps) {
  const handleDragEnd = (event: any, info: any) => {
    if (info.velocity.y > 500 || info.offset.y > 200) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50"
            variants={modalOverlay}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
          />
          <motion.div
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl"
            {...bottomSheetProps}
            onDragEnd={handleDragEnd}
          >
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```

### 6. List with Stagger Animation

```tsx
import { motion } from 'framer-motion';
import { listContainer, listItem } from '@/lib/animations';

function PrayerList({ prayers }: { prayers: Prayer[] }) {
  return (
    <motion.ul
      className="space-y-3"
      variants={listContainer}
      initial="hidden"
      animate="visible"
    >
      {prayers.map(prayer => (
        <motion.li
          key={prayer.id}
          className="p-4 bg-white rounded-lg"
          variants={listItem}
        >
          {prayer.title}
        </motion.li>
      ))}
    </motion.ul>
  );
}
```

### 7. Toast Notification

```tsx
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from '@/lib/animations';

function Toast({ isVisible, message }: ToastProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed top-4 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full"
          variants={toast}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

### 8. Skeleton Loading

```tsx
import { motion } from 'framer-motion';

function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-gray-200 rounded-lg ${className}`}>
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
  );
}
```

### 9. Success Confetti

```tsx
import { motion } from 'framer-motion';

function Confetti({ trigger }: { trigger: boolean }) {
  if (!trigger) return null;

  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    emoji: ['🙏', '✨', '💫', '🌟', '💖'][i % 5],
    x: Math.random() * 200 - 100,
    y: -(Math.random() * 200 + 100),
    rotation: Math.random() * 360,
    scale: 0.5 + Math.random() * 0.5,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="absolute left-1/2 top-1/2 text-2xl"
          initial={{ x: 0, y: 0, opacity: 1, scale: 0, rotate: 0 }}
          animate={{
            x: particle.x,
            y: particle.y,
            opacity: 0,
            scale: particle.scale,
            rotate: particle.rotation,
          }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          {particle.emoji}
        </motion.div>
      ))}
    </div>
  );
}
```

### 10. Long Press Pray Button

See `/Users/ksj/Desktop/Together_Pray/frontend/src/lib/animations.examples.tsx` for complete implementation with progress indicator.

## Best Practices

### 1. Use AnimatePresence for Conditional Rendering

```tsx
// ✅ Correct
<AnimatePresence>
  {isOpen && <motion.div exit="exit">...</motion.div>}
</AnimatePresence>

// ❌ Wrong - no exit animation
{isOpen && <motion.div>...</motion.div>}
```

### 2. Choose Appropriate Spring Configs

- `gentle` - Modals, drawers, non-critical UI
- `bouncy` - Success states, celebrations, playful interactions
- `snappy` - Buttons, cards, frequent interactions
- `stiff` - Tooltips, dropdowns, instant feedback

### 3. Respect Component Hierarchy

```tsx
// Parent controls overall visibility
<motion.div variants={listContainer} initial="hidden" animate="visible">
  {/* Children animate in sequence */}
  {items.map(item => (
    <motion.div variants={listItem} />
  ))}
</motion.div>
```

### 4. Optimize for Mobile

- Keep animations under 300ms
- Use `transform` and `opacity` (GPU accelerated)
- Avoid animating `width`, `height`, `top`, `left`
- Test on actual devices, not just emulators

### 5. Provide Instant Feedback

```tsx
// ✅ Immediate visual feedback
<motion.button whileTap={{ scale: 0.95 }}>

// ❌ Delayed feedback feels sluggish
<motion.button animate={{ scale: isPressed ? 0.95 : 1 }}>
```

### 6. Layer Animations Appropriately

```tsx
// Overlay appears before content
<AnimatePresence>
  {isOpen && (
    <>
      <motion.div className="z-40" /> {/* Overlay */}
      <motion.div className="z-50" /> {/* Content */}
    </>
  )}
</AnimatePresence>
```

### 7. Use Layout Animations Sparingly

```tsx
// Only when necessary - can be expensive
<motion.div layout>
  {/* Content that changes size/position */}
</motion.div>
```

## Accessibility

### Reduced Motion Support

The system automatically respects `prefers-reduced-motion` user preference:

```tsx
import { getMotionVariant, prefersReducedMotion } from '@/lib/animations';

// Automatic handling
const variant = getMotionVariant(slideUp);

// Manual check
if (prefersReducedMotion()) {
  // Use instant transitions
  return <div>{content}</div>;
}

// Use full animation
return <motion.div variants={slideUp}>{content}</motion.div>;
```

### Keyboard Navigation

Ensure animated elements remain keyboard accessible:

```tsx
<motion.button
  whileTap={{ scale: 0.95 }}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      onClick();
    }
  }}
>
  Button
</motion.button>
```

### Focus Management

Manage focus for modals and drawers:

```tsx
const modalRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  if (isOpen) {
    modalRef.current?.focus();
  }
}, [isOpen]);

<motion.div
  ref={modalRef}
  tabIndex={-1}
  variants={modalContent}
>
  {/* Modal content */}
</motion.div>
```

## Performance Tips

1. **Use `will-change` sparingly** - Only for elements that animate frequently
2. **Avoid layout thrashing** - Batch DOM reads and writes
3. **Use `transform` over positional properties** - GPU accelerated
4. **Limit particle count** - Keep confetti under 30 particles
5. **Debounce scroll animations** - Prevent excessive re-renders
6. **Unmount unused AnimatePresence** - Clean up exit animations

## File Reference

- **Core System**: `/Users/ksj/Desktop/Together_Pray/frontend/src/lib/animations.ts`
- **Usage Examples**: `/Users/ksj/Desktop/Together_Pray/frontend/src/lib/animations.examples.tsx`
- **Documentation**: `/Users/ksj/Desktop/Together_Pray/frontend/src/lib/ANIMATIONS_README.md`

## Next Steps

1. Import animations into your components
2. Test on actual mobile devices
3. Verify 60fps performance with Chrome DevTools
4. Test with `prefers-reduced-motion: reduce` enabled
5. Adjust timing/easing based on user feedback

## Support

For questions or issues with the animation system, refer to:
- [Framer Motion Documentation](https://www.framer.com/motion/)
- Project PRD v2.0 Animation Specifications
- Example implementations in `animations.examples.tsx`
