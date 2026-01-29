# BottomSheet - Quick Reference

## Import

```tsx
import { BottomSheet } from '@/components/layout';
import { useBottomSheet } from '@/hooks';
```

## 30-Second Setup

```tsx
function MyComponent() {
  const sheet = useBottomSheet();

  return (
    <>
      <Button onClick={sheet.open}>열기</Button>
      <BottomSheet isOpen={sheet.isOpen} onClose={sheet.close} title="제목">
        <div className="p-5">내용</div>
      </BottomSheet>
    </>
  );
}
```

## Common Props

```tsx
// Basic
<BottomSheet isOpen={true} onClose={fn} title="제목">

// Custom Height
<BottomSheet snapPoints={[0.5, 0.9]} initialSnap={1}>

// No Header
<BottomSheet showHeader={false} showHandle={true}>

// Prevent Dismiss
<BottomSheet closeOnOverlayClick={false} closeOnEscape={false}>
```

## Hook Usage

```tsx
const sheet = useBottomSheet();

sheet.open();    // Open
sheet.close();   // Close
sheet.toggle();  // Toggle
sheet.isOpen     // State
```

## Snap Points Cheatsheet

| Value | Height | Use Case |
|-------|--------|----------|
| `0.3` | 30% | Quick action |
| `0.5` | 50% | Default (simple form) |
| `0.7` | 70% | Medium form |
| `0.9` | 90% | Full form |
| `0.95` | 95% | Almost fullscreen |

## Real-World Examples

### 1. Prayer Form
```tsx
const sheet = useBottomSheet();

<BottomSheet isOpen={sheet.isOpen} onClose={sheet.close} title="새 기도제목">
  <PrayerForm onSubmit={(data) => {
    createPrayer(data);
    sheet.close();
  }} />
</BottomSheet>
```

### 2. Filter Sheet
```tsx
<BottomSheet
  isOpen={isOpen}
  onClose={onClose}
  title="필터"
  snapPoints={[0.6]}
>
  <FilterOptions />
</BottomSheet>
```

### 3. Confirmation
```tsx
<BottomSheet
  isOpen={isOpen}
  onClose={onClose}
  title="삭제 확인"
  snapPoints={[0.3]}
  closeOnOverlayClick={false}
>
  <ConfirmDelete onConfirm={handleDelete} />
</BottomSheet>
```

## Gotchas

### ❌ Don't
```tsx
// Re-creating hook every render
function Bad() {
  return <Component sheet={useBottomSheet()} />; // ❌
}

// Missing p-5 padding
<BottomSheet>
  <div>Content</div> {/* ❌ No padding */}
</BottomSheet>
```

### ✅ Do
```tsx
// Hoist hook to parent
function Good() {
  const sheet = useBottomSheet(); // ✅
  return <Component sheet={sheet} />;
}

// Add padding to content
<BottomSheet>
  <div className="p-5">Content</div> {/* ✅ */}
</BottomSheet>
```

## Keyboard Handling

The component automatically:
- Adjusts height when keyboard opens
- Maintains scrollable content
- Keeps focused input visible

No manual handling needed!

## Accessibility

Automatically handled:
- ✅ Focus trap
- ✅ ESC to close
- ✅ ARIA attributes
- ✅ Keyboard navigation
- ✅ 44px touch targets

## Performance Tips

1. **Memoize content**: Use `useMemo` for heavy components
2. **Lazy load**: Import heavy forms dynamically
3. **Close on navigate**: Reset state on route change

```tsx
// Good
const content = useMemo(() => <HeavyForm />, [deps]);
<BottomSheet>{content}</BottomSheet>
```

## Debugging

```tsx
// Check state
console.log('Sheet open:', sheet.isOpen);

// Test animations
<BottomSheet
  onClose={() => {
    console.log('Closing!');
    onClose();
  }}
/>

// Force height
<BottomSheet
  snapPoints={[0.9]}
  className="!h-[500px]" // Override if needed
/>
```

## Mobile Best Practices

1. **Default to 50% height** - Users can resize
2. **Always show handle** - Visual affordance
3. **Use bottom for actions** - Thumb-friendly
4. **Respect safe areas** - Auto-handled

## When NOT to Use

- ❌ Desktop-only app → Use Modal
- ❌ Full page content → Use route/page
- ❌ Permanent UI → Use Drawer/Sidebar
- ❌ Tooltips → Use Popover

## Comparison

| Feature | BottomSheet | Modal | Drawer |
|---------|-------------|-------|--------|
| Mobile-first | ✅ | ❌ | ⚠️ |
| Resizable | ✅ | ❌ | ❌ |
| Touch-optimized | ✅ | ⚠️ | ✅ |
| Keyboard-aware | ✅ | ❌ | ❌ |
| Snap points | ✅ | ❌ | ❌ |

Choose **BottomSheet** for mobile forms and actions.
