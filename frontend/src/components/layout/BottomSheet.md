# BottomSheet Component

Toss-style mobile-first bottom sheet component with advanced features for Together Pray v2.0.

## Features

### Core Features
- ✅ **Drag Handle** - Visual handle for dragging
- ✅ **Snap Points** - Auto-snap to predefined heights (50%, 90%, etc.)
- ✅ **Backdrop Blur** - Semi-transparent blurred overlay
- ✅ **Swipe to Dismiss** - Swipe down to close
- ✅ **Overlay Click** - Close by clicking overlay (configurable)
- ✅ **ESC Key** - Close with Escape key (configurable)

### Advanced Features
- ✅ **Keyboard Aware** - Auto-adjusts height when keyboard opens
- ✅ **Body Scroll Lock** - Prevents background scrolling
- ✅ **Focus Trap** - Keeps focus within sheet
- ✅ **AnimatePresence** - Smooth enter/exit animations
- ✅ **Accessibility** - ARIA attributes, role="dialog"

## Installation

```tsx
import { BottomSheet } from '@/components/layout';
import { useBottomSheet } from '@/hooks/useBottomSheet';
```

## Basic Usage

```tsx
function PrayerFormSheet() {
  const sheet = useBottomSheet();

  return (
    <>
      <Button onClick={sheet.open}>새 기도제목</Button>

      <BottomSheet
        isOpen={sheet.isOpen}
        onClose={sheet.close}
        title="기도제목 작성"
      >
        <div className="p-5">
          <PrayerForm onSubmit={sheet.close} />
        </div>
      </BottomSheet>
    </>
  );
}
```

## Props API

### BottomSheetProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | **required** | Open/close state |
| `onClose` | `() => void` | **required** | Close callback |
| `children` | `ReactNode` | **required** | Sheet content |
| `snapPoints` | `number[]` | `[0.5, 0.9]` | Height percentages (0.5 = 50%) |
| `initialSnap` | `number` | `0` | Initial snap point index |
| `title` | `string` | `undefined` | Sheet title |
| `showHeader` | `boolean` | `true` | Show header with title/close |
| `showHandle` | `boolean` | `true` | Show drag handle |
| `closeOnOverlayClick` | `boolean` | `true` | Close on overlay click |
| `closeOnEscape` | `boolean` | `true` | Close on ESC key |
| `className` | `string` | `undefined` | Additional CSS classes |

## Examples

### 1. Basic Prayer Form

```tsx
import { BottomSheet } from '@/components/layout';
import { useBottomSheet } from '@/hooks/useBottomSheet';
import { Button, Input } from '@/components/ui';

function PrayerForm() {
  const sheet = useBottomSheet();

  return (
    <>
      <Button onClick={sheet.open}>기도제목 등록</Button>

      <BottomSheet isOpen={sheet.isOpen} onClose={sheet.close} title="새 기도제목">
        <div className="p-5 space-y-4">
          <Input placeholder="제목" />
          <textarea
            placeholder="내용"
            className="w-full p-4 rounded-lg border min-h-[120px]"
          />
          <Button onClick={sheet.close} className="w-full">등록</Button>
        </div>
      </BottomSheet>
    </>
  );
}
```

### 2. Custom Snap Points

```tsx
<BottomSheet
  isOpen={isOpen}
  onClose={onClose}
  snapPoints={[0.3, 0.6, 0.95]} // 30%, 60%, 95%
  initialSnap={1} // Start at 60%
>
  {/* Content */}
</BottomSheet>
```

### 3. Full Height Form

```tsx
<BottomSheet
  isOpen={isOpen}
  onClose={onClose}
  title="상세 정보"
  snapPoints={[0.95]} // 95% height only
>
  {/* Long form content */}
</BottomSheet>
```

### 4. Without Header

```tsx
<BottomSheet
  isOpen={isOpen}
  onClose={onClose}
  showHeader={false}
>
  <div className="p-5">
    <h3 className="text-xl font-bold">Custom Header</h3>
    {/* Content */}
  </div>
</BottomSheet>
```

### 5. Prevent Accidental Close

```tsx
<BottomSheet
  isOpen={isOpen}
  onClose={onClose}
  title="중요한 작업"
  closeOnOverlayClick={false}
  closeOnEscape={false}
>
  {/* Important content */}
</BottomSheet>
```

## Hook API: useBottomSheet

```tsx
const sheet = useBottomSheet(initialState?: boolean)

// Returns
{
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}
```

### Usage

```tsx
const sheet = useBottomSheet(); // Start closed
const openSheet = useBottomSheet(true); // Start open

sheet.open();    // Open
sheet.close();   // Close
sheet.toggle();  // Toggle
```

## Behavior

### Snap Points
- Drag to resize sheet height
- Auto-snaps to nearest defined point
- Swipe down fast = close
- Defined as percentages (0.5 = 50% of viewport)

### Drag Behavior
- **Drag Handle**: Top 40x4px bar
- **Velocity Threshold**: 500px/s to close
- **Distance Threshold**: 100px to close
- **Elastic Drag**: Slight overscroll at top

### Keyboard Handling
- Automatically adjusts when keyboard opens
- Uses Visual Viewport API
- Prevents content from being hidden

### Focus Management
- Auto-focuses first focusable element
- Tab traps within sheet
- Restores focus on close

### Scroll Behavior
- Content scrollable when exceeds height
- Background scroll locked
- Overscroll contained

## Accessibility

### ARIA Attributes
```tsx
role="dialog"
aria-modal="true"
aria-labelledby="bottom-sheet-title"
```

### Keyboard Navigation
- **ESC**: Close (if `closeOnEscape={true}`)
- **Tab**: Cycles through focusable elements
- **Shift+Tab**: Reverse cycle

### Touch Targets
- Close button: 44x44px minimum
- Drag handle: Full width hit area

## Styling

### Design Tokens
- Border Radius: `24px` (top corners)
- Backdrop: `black/50` + `blur-sm`
- Shadow: `shadow-xl`
- Background: `bg-card`

### Customization

```tsx
<BottomSheet
  className="max-w-md mx-auto" // Custom styles
>
  {/* Content */}
</BottomSheet>
```

## Animation

### Enter Animation
```ts
initial: { y: '100%' }
animate: { y: 0 }
transition: spring(300, 30, 0.3s)
```

### Exit Animation
```ts
exit: { y: '100%' }
transition: ease-in(0.2s)
```

### Overlay
```ts
opacity: 0 → 1 (enter)
opacity: 1 → 0 (exit)
```

## Performance

### Optimizations
- **useCallback** for drag handlers
- **AnimatePresence** for unmounting
- **CSS contain** for scroll
- **requestAnimationFrame** for smooth drag

### Bundle Size
- Framer Motion: ~40KB (shared)
- Component: ~3KB

## Mobile Support

### Safe Area
- Respects iOS safe area insets
- Auto-adjusts for notch/home indicator

### Touch Gestures
- Native touch handling
- 60fps drag performance
- Momentum snap

### Viewport
- Visual Viewport API for keyboard
- Orientation change handling
- Dynamic height calculation

## Common Patterns

### Prayer Creation Flow
```tsx
const createPrayer = useBottomSheet();

<Button onClick={createPrayer.open}>새 기도제목</Button>
<BottomSheet isOpen={createPrayer.isOpen} onClose={createPrayer.close}>
  <PrayerForm onSuccess={createPrayer.close} />
</BottomSheet>
```

### Multi-Step Form
```tsx
const [step, setStep] = useState(1);

<BottomSheet isOpen={isOpen} onClose={() => { setStep(1); onClose(); }}>
  {step === 1 && <StepOne onNext={() => setStep(2)} />}
  {step === 2 && <StepTwo onNext={() => setStep(3)} />}
  {step === 3 && <StepThree onDone={onClose} />}
</BottomSheet>
```

### Confirmation Dialog
```tsx
<BottomSheet
  isOpen={isOpen}
  onClose={onClose}
  title="정말 삭제하시겠습니까?"
  snapPoints={[0.3]}
  closeOnOverlayClick={false}
>
  <div className="p-5 space-y-3">
    <p className="text-secondary">이 작업은 취소할 수 없습니다.</p>
    <div className="flex gap-2">
      <Button variant="secondary" onClick={onClose}>취소</Button>
      <Button variant="danger" onClick={handleDelete}>삭제</Button>
    </div>
  </div>
</BottomSheet>
```

## Troubleshooting

### Sheet doesn't open
- Check `isOpen` prop is `true`
- Verify parent component re-renders

### Drag not working
- Ensure `showHandle={true}` (default)
- Check touch-action CSS

### Keyboard covers content
- Component auto-handles this
- Ensure Visual Viewport API support (iOS 13+)

### Focus trap not working
- Add `tabindex="0"` to custom elements
- Verify no `pointer-events: none` on overlay

## Browser Support

- ✅ Chrome/Edge 88+
- ✅ Safari 14+ (iOS 14+)
- ✅ Firefox 90+
- ⚠️ Visual Viewport API: iOS 13+, Chrome 61+

## Related Components

- **Modal** - Center screen dialog
- **Toast** - Temporary notification
- **Drawer** - Side panel (future)

## Migration Guide

### From Modal to BottomSheet

```diff
- <Modal isOpen={isOpen} onClose={onClose}>
+ <BottomSheet isOpen={isOpen} onClose={onClose}>
    <Content />
- </Modal>
+ </BottomSheet>
```

Mobile users typically prefer bottom sheets over centered modals for better thumb reach.
