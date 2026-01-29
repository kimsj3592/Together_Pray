# Component Comparison: v1 vs v2

## Visual & Functional Differences

### BottomNav Component

#### Visual Changes

**v1 (Old):**
- Basic glassmorphism
- Simple color transitions
- Static positioning
- Basic tap animation (scale: 0.9)

**v2 (New):**
- Enhanced glassmorphism with better blur
- Smooth color + font-weight transitions
- Optional scroll-based hide/show
- Better tap animation (scale: 0.92) with spring physics
- Active indicator with layoutId animation
- Improved icon scaling on active state

#### Code Comparison

```tsx
// ============= v1 (OLD) =============
<nav className="bottom-nav md:hidden">
  <div className="flex items-center justify-around px-2 py-1">
    {navItems.map((item) => {
      const isActive = item.matchPattern.test(pathname);
      return (
        <Link key={item.href} href={item.href}
          className={`bottom-nav-item relative flex-1 ${isActive ? 'active' : ''}`}
        >
          <motion.div whileTap={{ scale: 0.9 }}
            className="flex flex-col items-center"
          >
            {isActive && (
              <motion.div layoutId="bottomNavIndicator"
                className="absolute -top-1 w-12 h-1 rounded-full"
                style={{ backgroundColor: 'rgb(var(--color-accent-blue))' }}
              />
            )}
            <span className="mb-1">{item.icon}</span>
            <span className="text-xs font-medium">{item.label}</span>
          </motion.div>
        </Link>
      );
    })}
  </div>
</nav>

// ============= v2 (NEW) =============
<AnimatePresence>
  {!shouldHide && (
    <motion.nav
      initial={{ y: 0 }}
      animate={{ y: 0 }}
      exit={{ y: 100 }}
      transition={springConfig.snappy}
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="glass border-t">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map((item) => {
            const isActive = item.matchPattern.test(pathname);
            return (
              <Link key={item.href} href={item.href}
                className="relative flex-1 min-w-0"
              >
                <motion.div
                  whileTap={{ scale: 0.92 }}
                  transition={springConfig.snappy}
                  className="flex flex-col items-center justify-center py-2 px-3 relative"
                >
                  {isActive && (
                    <motion.div layoutId="bottomNavActiveIndicator"
                      className="absolute -top-1 left-1/2 -translate-x-1/2 w-12 h-1 rounded-full"
                      style={{ backgroundColor: 'rgb(var(--color-primary-500))' }}
                      transition={springConfig.snappy}
                    />
                  )}
                  <motion.span
                    animate={{
                      color: isActive ? 'rgb(var(--color-primary-500))' : 'rgb(var(--color-text-secondary))',
                      scale: isActive ? 1.05 : 1,
                    }}
                    transition={springConfig.snappy}
                    className="mb-1 flex items-center justify-center"
                  >
                    {item.icon}
                  </motion.span>
                  <motion.span
                    animate={{
                      color: isActive ? 'rgb(var(--color-primary-500))' : 'rgb(var(--color-text-secondary))',
                      fontWeight: isActive ? 600 : 500,
                    }}
                    transition={springConfig.snappy}
                    className="text-xs leading-tight"
                  >
                    {item.label}
                  </motion.span>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </motion.nav>
  )}
</AnimatePresence>
```

#### Key Improvements

1. **AnimatePresence wrapper**: Smooth mount/unmount animations
2. **Scroll-based hiding**: Optional hide on scroll down
3. **Better spacing**: More padding for touch targets
4. **Dual animations**: Icon scale + label font-weight changes
5. **Improved centering**: Better alignment with translate-x
6. **Safe area support**: Built-in iOS notch handling

---

### Header Component

#### Visual Changes

**v1 (Old):**
- Fixed background or glass
- Static appearance
- Theme menu with manual AnimatePresence
- Included logout button
- Used `backHref` prop for navigation

**v2 (New):**
- Scroll-reactive styling (shadow, blur increase on scroll)
- Smooth mount animation
- Simplified theme menu implementation
- Removed built-in logout (use `rightActions`)
- Uses `showBackButton` + `onBack` callback pattern
- Better back button design with rounded hover state

#### Code Comparison

```tsx
// ============= v1 (OLD) =============
<header className={`sticky top-0 z-40 ${
  transparent ? 'glass' : 'bg-primary'
} border-b border-[rgb(var(--color-border))]`}>
  <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
    <div className="flex items-center gap-3 flex-1">
      {backHref && (
        <Link href={backHref}
          className="flex items-center gap-1 text-sm font-medium hover:opacity-70 transition-opacity"
        >
          <ChevronLeft size={20} />
          <span className="hidden sm:inline">{backLabel || '뒤로'}</span>
        </Link>
      )}
      {title && <h1 className="text-lg font-semibold truncate">{title}</h1>}
    </div>
    <div className="flex items-center gap-2">
      {/* Theme toggle and logout buttons */}
    </div>
  </div>
</header>

// ============= v2 (NEW) =============
<motion.header
  initial={{ y: -10, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={springConfig.snappy}
  className={`sticky top-0 z-40 transition-all duration-200 ${
    transparent && !scrolled
      ? 'glass'
      : scrolled
      ? 'glass border-b shadow-md'
      : 'bg-primary border-b'
  } ${className}`}
>
  <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
    <div className="flex items-center gap-3 flex-1 min-w-0">
      {showBackButton && (
        <motion.button
          whileTap={{ scale: 0.92 }}
          transition={springConfig.snappy}
          onClick={handleBack}
          className="flex items-center gap-1 p-2 -ml-2 rounded-lg hover:bg-tertiary transition-colors"
        >
          <ChevronLeft size={24} />
          <span className="hidden sm:inline text-sm font-medium">뒤로</span>
        </motion.button>
      )}
      {title && <h1 className="text-lg font-semibold truncate">{title}</h1>}
      {!title && !showBackButton && (
        <Link href="/groups" className="flex items-center gap-2 group">
          <motion.span
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={springConfig.snappy}
            className="text-xl font-bold"
          >
            Together Pray
          </motion.span>
        </Link>
      )}
    </div>
    <div className="flex items-center gap-2">
      {rightActions || /* default actions */}
    </div>
  </div>
</motion.header>
```

#### Key Improvements

1. **Mount animation**: Header slides in on page load
2. **Scroll-reactive**: Automatically adds shadow/blur when scrolled
3. **Better back button**: Now a button (not link), better touch target
4. **Flexible actions**: `rightActions` prop for customization
5. **Logo animation**: Hover and tap effects on "Together Pray" logo
6. **Cleaner API**: Removed hard-coded logout, use `rightActions` instead

---

## Feature Matrix

| Feature | v1 | v2 | Notes |
|---------|----|----|-------|
| **BottomNav** |
| Glassmorphism | ✅ | ✅ | Enhanced in v2 |
| Active indicator | ✅ | ✅ | Improved animation |
| Touch animations | ✅ | ✅ | Better spring physics |
| Icon color transition | ❌ | ✅ | **NEW** |
| Label weight transition | ❌ | ✅ | **NEW** |
| Icon scale on active | ❌ | ✅ | **NEW** |
| Hide on scroll | ❌ | ✅ | **NEW** |
| Safe area support | ✅ | ✅ | Same |
| AnimatePresence | ❌ | ✅ | **NEW** |
| **Header** |
| Glassmorphism | ✅ | ✅ | Same |
| Scroll-reactive | ❌ | ✅ | **NEW** |
| Mount animation | ❌ | ✅ | **NEW** |
| Theme toggle | ✅ | ✅ | Improved dropdown |
| Back navigation | Link | Button | Better UX |
| Custom actions | ❌ | ✅ | **NEW** `rightActions` |
| Logout button | ✅ | ❌ | Use `rightActions` |
| Logo animation | ❌ | ✅ | **NEW** |

---

## Animation Timing Comparison

### BottomNav

**v1:**
```tsx
transition={{ type: 'spring', stiffness: 500, damping: 30 }}
whileTap={{ scale: 0.9 }}
```

**v2:**
```tsx
transition={springConfig.snappy} // { type: 'spring', stiffness: 500, damping: 30 }
whileTap={{ scale: 0.92 }}
// Plus: exit animation with AnimatePresence
exit={{ y: 100 }}
```

### Header

**v1:**
```tsx
whileTap={{ scale: 0.95 }}
// No mount animation
```

**v2:**
```tsx
initial={{ y: -10, opacity: 0 }}
animate={{ y: 0, opacity: 1 }}
transition={springConfig.snappy}
whileTap={{ scale: 0.92 }}
```

---

## CSS Class Changes

### BottomNav

**v1:**
```tsx
className="bottom-nav md:hidden"
className="bottom-nav-item relative flex-1"
```

**v2:**
```tsx
className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
className="glass border-t"
className="relative flex-1 min-w-0"
```

### Header

**v1:**
```tsx
className="sticky top-0 z-40 glass border-b"
className="p-2 rounded-lg hover:bg-tertiary"
```

**v2:**
```tsx
className="sticky top-0 z-40 transition-all duration-200 glass border-b shadow-md"
className="p-2 -ml-2 rounded-lg hover:bg-tertiary"
// Added negative margin for better alignment
```

---

## Performance Considerations

### v1
- Basic animations
- No scroll listeners
- Minimal re-renders

### v2
- Enhanced animations with spring physics
- Scroll listener in Header (scroll-reactive styling)
- Optional scroll listener in BottomNav (hideOnScroll)
- AnimatePresence adds slight overhead
- **Recommendation**: Use `hideOnScroll` only when needed

### Optimization Tips

1. **Memoize expensive computations**:
```tsx
const navItems = useMemo(() => buildNavItems(groupId), [groupId]);
```

2. **Debounce scroll handlers** (already implemented in useScrollDirection):
```tsx
useScrollDirection({ threshold: 50, debounceDelay: 100 })
```

3. **Use layout animations sparingly**:
```tsx
// layoutId is only used for active indicator - good!
<motion.div layoutId="bottomNavActiveIndicator" />
```

---

## Browser Support

Both v1 and v2 support:
- Chrome/Edge 90+
- Safari 14+
- Firefox 88+
- iOS Safari 14+
- Android Chrome 90+

**Note:** `backdrop-filter` has good support but may not work on older browsers. Fallback is solid background.

---

## Accessibility

### v1
- Basic semantic HTML
- Link-based navigation
- No ARIA labels

### v2 Improvements
- Same semantic HTML
- Better focus states with rounded hover backgrounds
- Added `aria-label` for theme toggle
- Button vs Link semantics (back button is now `<button>`)
- Better touch target sizes (44x44px minimum)

---

## Migration Effort Estimate

| Component | Lines Changed | Complexity | Estimated Time |
|-----------|---------------|------------|----------------|
| BottomNav | ~20 lines | Low | 10 minutes |
| Header | ~30 lines | Medium | 15 minutes |
| Testing | - | Medium | 30 minutes |
| **Total** | **~50 lines** | **Medium** | **~1 hour** |

---

## Rollback Plan

If issues arise, you can rollback by:

1. **Keep old components** (don't delete):
```tsx
// Old: /components/BottomNav.tsx
// New: /components/layout/BottomNav.tsx
```

2. **Switch imports back**:
```tsx
// Rollback to:
import BottomNav from '@/components/BottomNav';
import Header from '@/components/Header';
```

3. **Update prop usage** (if using new v2 props)

---

**Version:** 2.0
**Created:** 2025-01-30
**Purpose:** Visual and functional comparison for migration planning
