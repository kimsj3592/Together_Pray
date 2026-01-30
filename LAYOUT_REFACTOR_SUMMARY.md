# Layout Components Refactor Summary (v2.0)

## Overview

Successfully refactored BottomNav and Header components to Toss-style modern UI with enhanced animations, better UX, and improved maintainability.

## What Was Done

### 1. Created New Components

#### `/frontend/src/components/layout/BottomNav.tsx`
- Toss-style glassmorphism with enhanced backdrop blur
- Smooth active indicator with Framer Motion `layoutId`
- Optional scroll-based hide/show functionality
- Enhanced animations (icon scale, label font-weight transitions)
- Safe area support for iOS devices
- AnimatePresence for mount/unmount transitions

#### `/frontend/src/components/layout/Header.tsx`
- Scroll-reactive styling (shadow and blur increase on scroll)
- Smooth mount animation on page load
- Better back button implementation (button instead of link)
- Flexible `rightActions` prop for custom action buttons
- Enhanced theme toggle dropdown with animations
- Logo hover and tap animations

#### `/frontend/src/hooks/useScrollDirection.ts`
- Custom hook to detect scroll direction
- Configurable threshold and debounce
- Performance-optimized with requestAnimationFrame
- Used for BottomNav hide/show feature

### 2. Created Index Files

#### `/frontend/src/components/layout/index.ts`
```tsx
export { default as BottomNav } from './BottomNav';
export { default as Header } from './Header';
```

#### `/frontend/src/hooks/index.ts`
```tsx
export { useScrollDirection } from './useScrollDirection';
export type { ScrollDirection, UseScrollDirectionOptions } from './useScrollDirection';
```

### 3. Created Documentation

#### `/frontend/src/components/layout/README.md`
- Comprehensive migration guide
- Props comparison table
- Code examples (before/after)
- Troubleshooting section
- Testing checklist

#### `/frontend/src/components/layout/COMPARISON.md`
- Visual and functional differences
- Side-by-side code comparison
- Feature matrix
- Animation timing details
- Performance considerations
- Rollback plan

## Key Features

### BottomNav Enhancements

1. **Better Animations**
   - Active indicator with `layoutId` for smooth transitions
   - Icon scale animation on active state (1.05x)
   - Label font-weight transition (500 → 600)
   - Spring physics for natural motion

2. **New Features**
   - `hideOnScroll` prop for auto-hide on scroll down
   - AnimatePresence for smooth mount/unmount
   - Better touch feedback (scale: 0.92)

3. **Improved Design**
   - Enhanced glassmorphism effect
   - Better spacing and alignment
   - Improved safe area support

### Header Enhancements

1. **Scroll-Reactive**
   - Automatically adds shadow when scrolled
   - Glass effect intensifies on scroll
   - Smooth transitions (200ms)

2. **Better API**
   - `showBackButton` + optional `onBack` callback
   - Removed hard-coded logout button
   - Added `rightActions` prop for flexibility

3. **Enhanced Animations**
   - Mount animation (slide down + fade in)
   - Logo hover and tap effects
   - Back button with rounded hover state
   - Theme menu with scale animation

### useScrollDirection Hook

1. **Features**
   - Detects scroll direction (up/down)
   - Configurable threshold (default: 10px)
   - Debounce support (default: 100ms)
   - Performance-optimized

2. **Usage**
```tsx
const scrollDirection = useScrollDirection({
  threshold: 50,
  debounceDelay: 100
});
```

## File Structure

```
/Users/ksj/Desktop/Together_Pray/frontend/src/
├── components/
│   ├── layout/                    # NEW
│   │   ├── BottomNav.tsx          # Refactored
│   │   ├── Header.tsx             # Refactored
│   │   ├── index.ts               # NEW
│   │   ├── README.md              # NEW - Migration guide
│   │   └── COMPARISON.md          # NEW - Visual comparison
│   ├── BottomNav.tsx              # OLD (kept for rollback)
│   └── Header.tsx                 # OLD (kept for rollback)
├── hooks/                         # NEW
│   ├── useScrollDirection.ts      # NEW
│   └── index.ts                   # NEW
└── lib/
    └── animations.ts              # Used by new components
```

## Migration Required

The following files import the old components and need migration:

1. `/frontend/src/app/groups/[id]/page.tsx`
2. `/frontend/src/app/prayers/[id]/page.tsx`
3. `/frontend/src/app/groups/[id]/prayers/new/page.tsx`
4. `/frontend/src/app/groups/[id]/answered/page.tsx`
5. `/frontend/src/app/mypage/page.tsx`
6. `/frontend/src/app/groups/page.tsx`
7. `/frontend/src/app/groups/[id]/prayers/page.tsx`

### Migration Steps

For each file:

1. **Update imports:**
```tsx
// Before
import BottomNav from '@/components/BottomNav';
import Header from '@/components/Header';

// After
import { BottomNav, Header } from '@/components/layout';
```

2. **Update Header props:**
```tsx
// Before
<Header
  title="제목"
  backHref="/groups"
  backLabel="뒤로"
/>

// After
<Header
  title="제목"
  showBackButton={true}
  // Optional: custom back handler
  onBack={() => router.push('/groups')}
/>
```

3. **Optional: Add new features:**
```tsx
// BottomNav with scroll hide
<BottomNav groupId={id} hideOnScroll={true} />

// Header with custom actions
<Header
  title="제목"
  showBackButton={true}
  rightActions={
    <button>
      <Settings size={20} />
    </button>
  }
/>
```

## Breaking Changes

### Header Component

1. **Removed props:**
   - `backHref` → Use `showBackButton` + `onBack`
   - `backLabel` → Always "뒤로"

2. **Removed features:**
   - Built-in logout button → Use `rightActions` prop if needed

### BottomNav Component

No breaking changes! API is backward compatible.

## Design System Integration

Both components use:

- **CSS Variables** from `globals.css`
  - `--color-primary-500`
  - `--color-text-primary`
  - `--color-text-secondary`
  - `--glass-bg`, `--glass-border`

- **Animations** from `lib/animations.ts`
  - `springConfig.snappy`
  - `springConfig.bouncy`
  - `scaleIn` variants

- **TailwindCSS v4** utility classes
  - `glass`, `card`, `bg-tertiary`
  - Responsive breakpoints (`md:hidden`)

## Testing Checklist

- [ ] Navigation works on all routes
- [ ] Back button navigates correctly
- [ ] Active tab indicators animate smoothly
- [ ] Theme toggle functions properly
- [ ] Safe area respected on iOS
- [ ] Glassmorphism displays correctly
- [ ] Scroll animations work as expected
- [ ] Touch feedback is responsive
- [ ] Dark mode styles are correct
- [ ] Desktop breakpoints work
- [ ] Hide on scroll works (if enabled)
- [ ] Header shadow appears on scroll

## Performance

### Optimizations Applied

1. **useScrollDirection hook:**
   - `requestAnimationFrame` for smooth updates
   - Debounced scroll handling
   - Cleanup on unmount

2. **Animations:**
   - Spring physics for natural motion
   - Fast transitions (100-200ms)
   - AnimatePresence for efficient mount/unmount

3. **Re-render prevention:**
   - Minimal prop changes
   - CSS variables for theming

### Performance Impact

- **BottomNav:** Minimal impact (same as v1)
- **Header:** Small increase due to scroll listener
- **useScrollDirection:** Optimized with RAF and debounce

## Browser Support

- Chrome/Edge 90+
- Safari 14+
- Firefox 88+
- iOS Safari 14+
- Android Chrome 90+

**Note:** `backdrop-filter` may not work on older browsers (fallback: solid background)

## Next Steps

1. **Migration Phase (1-2 hours):**
   - Update imports in 7 page files
   - Update Header prop usage
   - Test on all routes

2. **Testing Phase (30 minutes):**
   - Manual testing on mobile/desktop
   - Check all navigation flows
   - Verify animations

3. **Cleanup Phase (optional):**
   - After successful migration, consider removing old components
   - Update any remaining documentation

4. **Enhancement Phase (future):**
   - Add more custom hooks if needed
   - Consider creating `BottomSheet`, `Modal` layout components
   - Expand layout component library

## Rollback Plan

If issues arise:

1. Keep old components (`/components/BottomNav.tsx`, `/components/Header.tsx`)
2. Revert import changes
3. Old components remain fully functional

## Success Criteria

- ✅ New components created with Toss-style design
- ✅ Custom hook for scroll detection implemented
- ✅ Comprehensive documentation provided
- ✅ Migration guide with examples
- ✅ Backward-compatible API (BottomNav)
- ✅ Enhanced animations and UX
- ✅ Safe area support
- ✅ Glassmorphism design
- ✅ Dark mode support
- ✅ TypeScript types and JSDoc comments

## File Locations

**New Components:**
- `/Users/ksj/Desktop/Together_Pray/frontend/src/components/layout/BottomNav.tsx`
- `/Users/ksj/Desktop/Together_Pray/frontend/src/components/layout/Header.tsx`
- `/Users/ksj/Desktop/Together_Pray/frontend/src/components/layout/index.ts`
- `/Users/ksj/Desktop/Together_Pray/frontend/src/components/layout/README.md`
- `/Users/ksj/Desktop/Together_Pray/frontend/src/components/layout/COMPARISON.md`

**New Hook:**
- `/Users/ksj/Desktop/Together_Pray/frontend/src/hooks/useScrollDirection.ts`
- `/Users/ksj/Desktop/Together_Pray/frontend/src/hooks/index.ts`

**Documentation:**
- `/Users/ksj/Desktop/Together_Pray/LAYOUT_REFACTOR_SUMMARY.md` (this file)

---

**Completed:** 2025-01-30
**Version:** 2.0
**Status:** Ready for Migration
**Estimated Migration Time:** 1-2 hours
