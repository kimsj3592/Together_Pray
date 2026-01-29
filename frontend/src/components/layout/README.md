# Layout Components (v2.0) - Migration Guide

This document provides guidance for migrating from the old Header and BottomNav components to the new Toss-style v2.0 versions.

## Overview

The v2.0 layout components have been refactored with:
- Enhanced Toss-style design with glassmorphism
- Improved animations using Framer Motion
- Better TypeScript types and documentation
- New features (scroll-reactive behavior, safe area support)
- Cleaner API with better prop naming

## File Locations

**Old Components:**
- `/src/components/BottomNav.tsx`
- `/src/components/Header.tsx`

**New Components:**
- `/src/components/layout/BottomNav.tsx`
- `/src/components/layout/Header.tsx`
- `/src/hooks/useScrollDirection.ts` (new custom hook)

## Migration Steps

### 1. Update Imports

**Before:**
```tsx
import BottomNav from '@/components/BottomNav';
import Header from '@/components/Header';
```

**After:**
```tsx
import { BottomNav, Header } from '@/components/layout';
// or
import BottomNav from '@/components/layout/BottomNav';
import Header from '@/components/layout/Header';
```

### 2. BottomNav Component Changes

#### Props Changes

| Old Prop | New Prop | Notes |
|----------|----------|-------|
| `groupId` | `groupId` | ✅ Same |
| - | `hideOnScroll` | ⭐ New feature |
| - | `className` | ⭐ New prop |

#### Basic Usage

**Before:**
```tsx
<BottomNav groupId={groupId} />
```

**After (same API):**
```tsx
<BottomNav groupId={groupId} />
```

#### With New Features

```tsx
{/* Hide nav when scrolling down */}
<BottomNav
  groupId={groupId}
  hideOnScroll={true}
/>

{/* With custom className */}
<BottomNav
  groupId={groupId}
  className="custom-bottom-nav"
/>
```

### 3. Header Component Changes

#### Props Changes

| Old Prop | New Prop | Notes |
|----------|----------|-------|
| `title` | `title` | ✅ Same |
| `backHref` | ❌ Removed | Use `showBackButton` + `onBack` |
| `backLabel` | ❌ Removed | Always shows "뒤로" |
| - | `showBackButton` | ⭐ New prop (boolean) |
| - | `onBack` | ⭐ New callback |
| - | `rightActions` | ⭐ New prop (ReactNode) |
| `transparent` | `transparent` | ✅ Same |
| `showThemeToggle` | `showThemeToggle` | ✅ Same |
| - | `className` | ⭐ New prop |

#### Migration Examples

**Before (with back link):**
```tsx
<Header
  title="기도제목"
  backHref={`/groups/${groupId}`}
  backLabel="뒤로"
/>
```

**After:**
```tsx
<Header
  title="기도제목"
  showBackButton={true}
  // Optional: custom back handler
  onBack={() => router.push(`/groups/${groupId}`)}
/>
```

**Before (transparent header):**
```tsx
<Header
  title="Together Pray"
  transparent={true}
  showThemeToggle={true}
/>
```

**After (same API):**
```tsx
<Header
  title="Together Pray"
  transparent={true}
  showThemeToggle={true}
/>
```

#### New Features

**Custom Right Actions:**
```tsx
<Header
  title="설정"
  showBackButton={true}
  rightActions={
    <>
      <button className="p-2">
        <Settings size={20} />
      </button>
      <button className="p-2">
        <Share size={20} />
      </button>
    </>
  }
/>
```

**Scroll-Reactive Styling:**
The header automatically adjusts its appearance when scrolling:
- Adds shadow and blur when scrolled
- Works automatically, no props needed

## New Features

### 1. useScrollDirection Hook

```tsx
import { useScrollDirection } from '@/hooks';

function MyComponent() {
  const scrollDirection = useScrollDirection({
    threshold: 50,      // pixels before detecting change
    debounceDelay: 100  // milliseconds debounce
  });

  return (
    <div>
      Scrolling: {scrollDirection} {/* 'up', 'down', or null */}
    </div>
  );
}
```

### 2. Enhanced Animations

Both components now use:
- Smooth scale animations on tap
- Layout animations for active indicators
- Scroll-based animations
- AnimatePresence for mount/unmount transitions

### 3. Glassmorphism Design

Both components feature:
- Backdrop blur effect
- Semi-transparent backgrounds
- Border accent on scroll
- Dark mode support

### 4. Safe Area Support

BottomNav automatically handles iOS safe areas:
```css
padding-bottom: env(safe-area-inset-bottom);
```

## Breaking Changes

### Header Component

1. **Removed `backHref` and `backLabel`**
   - Use `showBackButton` + optional `onBack` callback
   - Default behavior: calls `router.back()`

2. **Removed logout button**
   - Previously shown when user was authenticated
   - Not needed in v2.0 architecture
   - Can be added via `rightActions` prop if needed

### BottomNav Component

No breaking changes! The API is backward compatible.

## Complete Migration Example

### Before (Old Components)

```tsx
// pages/groups/[id]/prayers/page.tsx
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';

export default function PrayersPage({ params }) {
  return (
    <div>
      <Header
        title="기도제목 목록"
        backHref={`/groups/${params.id}`}
        showThemeToggle={true}
      />

      <main className="pb-20">
        {/* Content */}
      </main>

      <BottomNav groupId={params.id} />
    </div>
  );
}
```

### After (New Components)

```tsx
// pages/groups/[id]/prayers/page.tsx
import { Header, BottomNav } from '@/components/layout';

export default function PrayersPage({ params }) {
  return (
    <div>
      <Header
        title="기도제목 목록"
        showBackButton={true}
        showThemeToggle={true}
      />

      <main className="pb-20">
        {/* Content */}
      </main>

      <BottomNav
        groupId={params.id}
        hideOnScroll={true} // NEW: Hide when scrolling down
      />
    </div>
  );
}
```

## Testing Checklist

After migration, verify:

- [ ] Navigation works correctly on all routes
- [ ] Back button navigates properly
- [ ] Active tab indicators animate smoothly
- [ ] Theme toggle functions correctly
- [ ] Safe area is respected on iOS devices
- [ ] Glassmorphism appears correctly
- [ ] Scroll animations work as expected
- [ ] Touch feedback feels responsive
- [ ] Dark mode styles are correct
- [ ] Desktop responsive behavior is maintained

## Troubleshooting

### Issue: "Cannot find module '@/hooks'"

**Solution:** Ensure tsconfig.json has the path mapping:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Issue: Header back button not working

**Solution:** Make sure you're in a client component context:
```tsx
'use client';
```

### Issue: BottomNav not hiding on scroll

**Solution:** Verify you've set `hideOnScroll={true}`:
```tsx
<BottomNav groupId={id} hideOnScroll={true} />
```

### Issue: Glassmorphism not showing

**Solution:** Check that backdrop-filter is supported and globals.css is imported:
```css
/* In globals.css */
.glass {
  background: var(--glass-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
```

## Additional Resources

- [Framer Motion Docs](https://www.framer.com/motion/)
- [TailwindCSS v4 Docs](https://tailwindcss.com/docs)
- [Together Pray Design System](/docs/design-system.md)

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the component source code and JSDoc comments
3. Refer to the design system documentation
4. Contact the frontend team

---

**Version:** 2.0
**Last Updated:** 2025-01-30
**Author:** Together Pray Frontend Team
