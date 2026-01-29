# Modal & Toast System Documentation

Together Pray v2.0 - Toss-style Modal and Toast Implementation

## Overview

This implementation provides a complete modal and toast notification system with Toss-style design and animations.

## Components

### 1. Modal

A versatile modal dialog with animations, focus trap, and accessibility features.

#### Props

```typescript
interface ModalProps {
  isOpen: boolean;              // Control modal visibility
  onClose: () => void;          // Close handler
  children: React.ReactNode;    // Modal content
  title?: string;               // Optional title
  size?: 'sm' | 'md' | 'lg';   // Modal size (default: 'md')
  showCloseButton?: boolean;    // Show X button (default: true)
  closeOnOverlayClick?: boolean; // Close on backdrop click (default: true)
  closeOnEscape?: boolean;      // Close on ESC key (default: true)
  className?: string;           // Additional classes
}
```

#### Features

- Enter/Exit animations (scale 0.95 → 1, opacity)
- Backdrop click to close
- Focus trap (keeps focus inside modal)
- ESC key to close
- Body scroll lock when open
- Portal rendering
- Responsive sizes

#### Usage

```tsx
import { Modal } from '@/components/layout';
import { useState } from 'react';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="기도제목 상세"
        size="md"
      >
        <div className="space-y-4">
          <p>Modal content here</p>
          <button onClick={() => setIsOpen(false)}>Close</button>
        </div>
      </Modal>
    </>
  );
}
```

### 2. ConfirmDialog

A specialized modal for confirmation actions with optional danger variant.

#### Props

```typescript
interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;         // Confirm action handler
  title: string;
  message: string;
  confirmText?: string;          // Default: "확인"
  cancelText?: string;           // Default: "취소"
  variant?: 'danger' | 'default'; // Style variant
}
```

#### Features

- Two-button layout (cancel + confirm)
- Danger variant with red styling
- Icon indicators
- Calls onConfirm then onClose automatically

#### Usage

```tsx
import { ConfirmDialog } from '@/components/layout';

function DeleteButton() {
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = () => {
    // Perform delete action
    console.log('Deleted!');
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Delete Prayer</button>

      <ConfirmDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleDelete}
        title="기도제목 삭제"
        message="정말로 이 기도제목을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
        confirmText="삭제"
        cancelText="취소"
        variant="danger"
      />
    </>
  );
}
```

### 3. AlertDialog

A single-button modal for informational alerts with variant styles.

#### Props

```typescript
interface AlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  confirmText?: string;          // Default: "확인"
  variant?: 'success' | 'error' | 'warning' | 'info';
}
```

#### Features

- Four variants with appropriate icons and colors:
  - Success: Green with CheckCircle icon
  - Error: Red with AlertCircle icon
  - Warning: Yellow with AlertTriangle icon
  - Info: Blue with Info icon
- Single confirm button
- Center-aligned content

#### Usage

```tsx
import { AlertDialog } from '@/components/layout';

function CreatePrayerButton() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleSubmit = async () => {
    try {
      await createPrayer();
      setShowSuccess(true);
    } catch (error) {
      setShowError(true);
    }
  };

  return (
    <>
      <button onClick={handleSubmit}>Create Prayer</button>

      {/* Success Alert */}
      <AlertDialog
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="등록 완료"
        message="기도제목이 성공적으로 등록되었습니다."
        variant="success"
      />

      {/* Error Alert */}
      <AlertDialog
        isOpen={showError}
        onClose={() => setShowError(false)}
        title="오류 발생"
        message="네트워크 오류가 발생했습니다. 다시 시도해주세요."
        variant="error"
      />
    </>
  );
}
```

### 4. Toast

Individual toast notification component (usually not used directly).

#### Props

```typescript
interface ToastProps {
  id: string;
  message: string;
  variant?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;             // Auto-dismiss time in ms (default: 3000)
  onClose: (id: string) => void;
}
```

### 5. ToastContainer

Container for rendering toast notifications (managed by ToastProvider).

### 6. useToast Hook

The primary interface for showing toast notifications.

#### Return Type

```typescript
interface UseToastReturn {
  toasts: ToastItem[];
  toast: (options: ToastOptions) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}
```

#### Usage

```tsx
import { useToast } from '@/hooks';

function MyComponent() {
  const { success, error, warning, info, toast } = useToast();

  // Simple variants
  const handlePrayerCreated = () => {
    success('기도제목이 등록되었습니다!');
  };

  const handleError = () => {
    error('오류가 발생했습니다. 다시 시도해주세요.');
  };

  const handleWarning = () => {
    warning('네트워크 연결이 불안정합니다.');
  };

  const handleInfo = () => {
    info('새로운 기도 응답이 있습니다.');
  };

  // With custom duration
  const handleCustom = () => {
    success('5초 후 사라집니다', 5000);
  };

  // Advanced usage
  const handleAdvanced = () => {
    toast({
      message: '커스텀 메시지',
      variant: 'success',
      duration: 3000,
    });
  };

  // Never auto-dismiss
  const handlePersistent = () => {
    toast({
      message: '수동으로 닫아야 합니다',
      variant: 'info',
      duration: Infinity,
    });
  };

  return (
    <div>
      <button onClick={handlePrayerCreated}>Show Success</button>
      <button onClick={handleError}>Show Error</button>
      <button onClick={handleWarning}>Show Warning</button>
      <button onClick={handleInfo}>Show Info</button>
    </div>
  );
}
```

## Setup

### 1. Install ToastProvider in layout.tsx

The ToastProvider has already been added to `/Users/ksj/Desktop/Together_Pray/frontend/src/app/layout.tsx`:

```tsx
import { ToastProvider } from "@/contexts/ToastContext";

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <ThemeProvider>
          <ToastProvider>
            <AuthProvider>{children}</AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### 2. Use in Components

```tsx
// Import the hook
import { useToast } from '@/hooks';

// Or import components directly
import { Modal, ConfirmDialog, AlertDialog } from '@/components/layout';
```

## Design Features

### Animations

All components use Framer Motion with predefined animation variants from `/lib/animations.ts`:

- **Modal**: Scale (0.95 → 1) + Fade
- **Toast**: Slide down + Fade
- **Backdrop**: Fade overlay

### Styling

- **Border Radius**: lg (16px) for modern look
- **Shadow**: xl for modals, md for toasts
- **Colors**: Using design tokens from tailwind.config.ts
- **Dark Mode**: Fully supported with CSS variables

### Accessibility

- **Focus Trap**: Focus stays within modal
- **Keyboard Support**: ESC to close, Tab navigation
- **ARIA Labels**: role="dialog", aria-modal, aria-live
- **Touch Targets**: Minimum 44x44px for mobile

## Real-world Examples

### Prayer Creation Flow

```tsx
function CreatePrayerForm() {
  const { success, error } = useToast();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (data) => {
    try {
      await createPrayer(data);
      success('기도제목이 등록되었습니다!');
      router.push('/prayers');
    } catch (err) {
      error('등록에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit">등록</button>
    </form>
  );
}
```

### Prayer Deletion Flow

```tsx
function PrayerCard({ prayer }) {
  const { success } = useToast();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    await deletePrayer(prayer.id);
    success('기도제목이 삭제되었습니다');
  };

  return (
    <>
      <div className="card">
        {/* Prayer content */}
        <button onClick={() => setShowConfirm(true)}>삭제</button>
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        title="기도제목 삭제"
        message="정말로 삭제하시겠습니까?"
        variant="danger"
      />
    </>
  );
}
```

### Prayer Reaction (Daily Limit)

```tsx
function PrayButton({ prayerId, hasPrayed }) {
  const { success, warning } = useToast();

  const handlePray = async () => {
    if (hasPrayed) {
      warning('오늘은 이미 기도하셨습니다');
      return;
    }

    try {
      await createReaction(prayerId);
      success('기도를 드렸습니다 🙏');
    } catch (error) {
      error('오류가 발생했습니다');
    }
  };

  return <button onClick={handlePray}>기도하기</button>;
}
```

## File Structure

```
frontend/src/
├── components/layout/
│   ├── Modal.tsx                    # Base modal component
│   ├── ConfirmDialog.tsx            # Confirmation dialog
│   ├── AlertDialog.tsx              # Alert dialog
│   ├── Toast.tsx                    # Toast notification
│   ├── ToastContainer.tsx           # Toast container
│   ├── Modal.example.tsx            # Modal examples
│   ├── Toast.example.tsx            # Toast examples
│   └── index.ts                     # Exports
├── contexts/
│   └── ToastContext.tsx             # Toast provider & context
├── hooks/
│   ├── useToast.ts                  # Toast hook export
│   └── index.ts                     # Exports
└── lib/
    └── animations.ts                # Animation variants
```

## Testing

View examples:

1. Modal Examples: Create a page importing `Modal.example.tsx`
2. Toast Examples: Create a page importing `Toast.example.tsx`

```tsx
// Example test page
import ModalExamples from '@/components/layout/Modal.example';

export default function TestPage() {
  return <ModalExamples />;
}
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- iOS Safari 14+
- Android Chrome 90+

## Performance

- Portal rendering prevents re-renders
- AnimatePresence for smooth exit animations
- Minimal bundle impact (~5KB gzipped)

## Best Practices

1. **Use appropriate component**:
   - `Modal`: Custom content and actions
   - `ConfirmDialog`: Yes/No confirmations
   - `AlertDialog`: Information only
   - `Toast`: Non-blocking notifications

2. **Toast duration**:
   - Success: 3000ms (default)
   - Error: 5000ms (user needs time to read)
   - Warning: 4000ms
   - Info: 3000ms
   - Infinite: Only for critical messages

3. **Modal size**:
   - `sm`: Confirmations, alerts
   - `md`: Forms, details (default)
   - `lg`: Complex content, tables

4. **Variant selection**:
   - `danger`: Destructive actions (delete, remove)
   - `default`: Normal confirmations
   - `success`: Positive feedback
   - `error`: Failures, errors
   - `warning`: Cautions, limits
   - `info`: Neutral information

5. **Accessibility**:
   - Always provide meaningful titles
   - Write clear, concise messages
   - Don't rely on color alone
   - Test keyboard navigation
