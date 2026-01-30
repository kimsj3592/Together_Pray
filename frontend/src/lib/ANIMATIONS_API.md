# Animation System API Documentation

Complete reference for all animation exports from `/src/lib/animations.ts`

## Table of Contents
1. [Spring Configurations](#spring-configurations)
2. [Transition Presets](#transition-presets)
3. [Animation Variants](#animation-variants)
4. [Unified Interactions](#unified-interactions)
5. [Gesture Animation Props](#gesture-animation-props)
6. [Preset Animation Props](#preset-animation-props)
7. [Utility Functions](#utility-functions)
8. [Reduced Motion Support](#reduced-motion-support)

---

## Spring Configurations

Pre-configured spring physics for natural motion.

```typescript
export const springConfig = {
  gentle: { type: 'spring', stiffness: 120, damping: 14 },
  bouncy: { type: 'spring', stiffness: 400, damping: 25 },
  snappy: { type: 'spring', stiffness: 500, damping: 30 },
  stiff: { type: 'spring', stiffness: 700, damping: 30 },
};
```

**Usage:**
```typescript
<motion.div transition={springConfig.snappy}>Content</motion.div>
```

---

## Transition Presets

Common transition timings.

```typescript
export const transitions = {
  fast: { type: 'tween', duration: 0.1, ease: 'easeOut' },
  normal: { type: 'tween', duration: 0.2, ease: 'easeOut' },
  slow: { type: 'tween', duration: 0.3, ease: 'easeInOut' },
  spring: springConfig.snappy,
  springGentle: springConfig.gentle,
  springBouncy: springConfig.bouncy,
  modalOpen: { type: 'spring', stiffness: 300, damping: 25, duration: 0.25 },
  modalClose: { type: 'tween', duration: 0.2, ease: 'easeIn' },
  bottomSheet: { type: 'spring', stiffness: 300, damping: 30, duration: 0.3 },
};
```

---

## Animation Variants

Pre-built animation states for common patterns.

### Basic Animations

#### fadeIn
```typescript
const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};
```

#### slideUp
```typescript
const slideUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: transitions.normal },
  exit: { opacity: 0, y: -20, transition: transitions.fast },
};
```

#### slideDown, slideLeft, slideRight
Similar to slideUp but different directions.

#### scaleIn
```typescript
const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: springConfig.snappy },
  exit: { opacity: 0, scale: 0.95, transition: transitions.fast },
};
```

### Component Animations

#### cardHover
```typescript
const cardHover: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  hover: { y: -2, boxShadow: '0 8px 30px rgba(0,0,0,0.12)' },
  tap: { scale: 0.98 },
};
```

#### buttonTap
```typescript
const buttonTap: Variants = {
  initial: { scale: 1 },
  hover: { scale: 1.02, transition: transitions.fast },
  tap: { scale: 0.95, transition: transitions.fast },
};
```

### Page Transitions

#### pageTransition
```typescript
const pageTransition: Variants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0, transition: transitions.slow },
  exit: { opacity: 0, x: -20, transition: transitions.slow },
};
```

### Modal & Sheet Animations

#### modalOverlay
```typescript
const modalOverlay: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2, ease: 'easeOut' } },
  exit: { opacity: 0, transition: { duration: 0.15, ease: 'easeIn' } },
};
```

#### modalContent
```typescript
const modalContent: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  visible: { opacity: 1, scale: 1, y: 0, transition: transitions.modalOpen },
  exit: { opacity: 0, scale: 0.95, y: 10, transition: transitions.modalClose },
};
```

#### bottomSheet
```typescript
const bottomSheet: Variants = {
  hidden: { y: '100%' },
  visible: { y: 0, transition: transitions.bottomSheet },
  exit: { y: '100%', transition: { duration: 0.2, ease: 'easeIn' } },
};
```

### List Animations

#### listItem
```typescript
const listItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: transitions.normal },
};
```

#### listContainer
```typescript
const listContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
};
```

---

## Unified Interactions

**NEW in v2.0** - Standardized animations for consistent UX.

### unifiedButtonPress
```typescript
export const unifiedButtonPress: HTMLMotionProps<'button'> = {
  whileTap: { scale: 0.95 },
  transition: springConfig.snappy,
};
```

**Usage:**
```typescript
<motion.button {...unifiedButtonPress}>
  Click me
</motion.button>
```

### unifiedCardInteraction
```typescript
export const unifiedCardInteraction: HTMLMotionProps<'div'> = {
  whileHover: { y: -2, boxShadow: '0 8px 30px rgba(0,0,0,0.12)' },
  whileTap: { scale: 0.98 },
  transition: { duration: 0.15, ease: 'easeOut' },
};
```

**Usage:**
```typescript
<motion.div {...unifiedCardInteraction}>
  Card content
</motion.div>
```

### staggerContainer
```typescript
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};
```

### listItemAnimation
```typescript
export const listItemAnimation: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: transitions.normal },
};
```

**Combined Usage:**
```typescript
<motion.div variants={staggerContainer} initial="hidden" animate="visible">
  {items.map(item => (
    <motion.div key={item.id} variants={listItemAnimation}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

---

## Gesture Animation Props

Quick props for common gestures.

### tapAnimation
```typescript
export const tapAnimation: HTMLMotionProps<'button'> = {
  whileTap: { scale: 0.95 },
  transition: springConfig.snappy,
};
```

### hoverAnimation
```typescript
export const hoverAnimation: HTMLMotionProps<'div'> = {
  whileHover: { y: -2, boxShadow: '0 8px 30px rgba(0,0,0,0.12)' },
  whileTap: { scale: 0.98 },
  transition: { duration: 0.15, ease: 'easeOut' },
};
```

---

## Preset Animation Props

Complete props objects ready to spread.

### pageTransitionProps
```typescript
export const pageTransitionProps: HTMLMotionProps<'div'> = {
  initial: 'initial',
  animate: 'animate',
  exit: 'exit',
  variants: pageTransition,
};
```

### modalContentProps
```typescript
export const modalContentProps: HTMLMotionProps<'div'> = {
  initial: 'hidden',
  animate: 'visible',
  exit: 'exit',
  variants: modalContent,
};
```

### bottomSheetProps
```typescript
export const bottomSheetProps: HTMLMotionProps<'div'> = {
  initial: 'hidden',
  animate: 'visible',
  exit: 'exit',
  variants: bottomSheet,
  drag: 'y',
  dragConstraints: { top: 0 },
  dragElastic: 0.2,
};
```

### fadeInProps
```typescript
export const fadeInProps: HTMLMotionProps<'div'> = {
  initial: 'hidden',
  animate: 'visible',
  exit: 'exit',
  variants: fadeIn,
};
```

### cardProps
```typescript
export const cardProps: HTMLMotionProps<'div'> = {
  initial: 'initial',
  animate: 'animate',
  whileHover: 'hover',
  whileTap: 'tap',
  variants: cardHover,
};
```

### buttonProps
```typescript
export const buttonProps: HTMLMotionProps<'button'> = {
  initial: 'initial',
  whileHover: 'hover',
  whileTap: 'tap',
  variants: buttonTap,
};
```

---

## Utility Functions

### createStaggerContainer
Create custom stagger animation.

```typescript
export const createStaggerContainer = (
  staggerDelay = 0.05,
  delayChildren = 0
): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: staggerDelay, delayChildren },
  },
});
```

**Usage:**
```typescript
const customStagger = createStaggerContainer(0.1, 0.2);
<motion.div variants={customStagger} initial="hidden" animate="visible">
  {/* children */}
</motion.div>
```

### createSlideAnimation
Create custom slide animation.

```typescript
export const createSlideAnimation = (
  direction: 'up' | 'down' | 'left' | 'right',
  distance = 20
): Variants;
```

**Usage:**
```typescript
const slideUpLarge = createSlideAnimation('up', 40);
<motion.div variants={slideUpLarge} initial="hidden" animate="visible">
  {/* content */}
</motion.div>
```

### createScaleAnimation
Create custom scale animation.

```typescript
export const createScaleAnimation = (
  initialScale = 0.95,
  targetScale = 1
): Variants;
```

**Usage:**
```typescript
const largeScale = createScaleAnimation(0.8, 1.1);
<motion.div variants={largeScale} initial="hidden" animate="visible">
  {/* content */}
</motion.div>
```

---

## Reduced Motion Support

### prefersReducedMotion
Check user's motion preference.

```typescript
export const prefersReducedMotion = (): boolean;
```

**Usage:**
```typescript
if (prefersReducedMotion()) {
  // Use instant transitions
} else {
  // Use animated transitions
}
```

### getMotionVariant
Get appropriate variant based on preference.

```typescript
export const getMotionVariant = <T extends Variants>(
  normalVariant: T,
  reducedVariant?: T
): T;
```

**Usage:**
```typescript
const variant = getMotionVariant(slideUp, fadeIn);
<motion.div variants={variant} initial="hidden" animate="visible">
  {/* content */}
</motion.div>
```

---

## Migration Guide

### Before (Manual Animations)
```typescript
<motion.button
  whileTap={{ scale: 0.95 }}
  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
>
  Click
</motion.button>
```

### After (Unified Animations)
```typescript
<motion.button {...unifiedButtonPress}>
  Click
</motion.button>
```

---

## Performance Tips

1. **Use variants** for complex animations (better optimization)
2. **Spread props** instead of inline objects (prevents re-renders)
3. **Limit stagger** to 20 items max for best performance
4. **Use spring** for interactions, **tween** for page transitions

---

## Type Safety

All exports are fully typed with TypeScript:
- `Variants` for animation states
- `HTMLMotionProps<T>` for motion component props
- `Transition` for transition configs

Import types:
```typescript
import type { Variants, Transition, HTMLMotionProps } from 'framer-motion';
```
