# Modal & Toast Quick Reference

Quick copy-paste examples for Together Pray v2.0

## Import

```tsx
// Modal components
import { Modal, ConfirmDialog, AlertDialog } from '@/components/layout';

// Toast hook
import { useToast } from '@/hooks';
```

## Toast (Most Common)

```tsx
function MyComponent() {
  const { success, error, warning, info } = useToast();

  // Success
  success('기도제목이 등록되었습니다!');

  // Error
  error('오류가 발생했습니다.');

  // Warning
  warning('오늘은 이미 기도하셨습니다');

  // Info
  info('새로운 알림이 있습니다');

  // Custom duration
  success('5초 후 사라집니다', 5000);
}
```

## Modal

```tsx
function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open</button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Title"
        size="md"
      >
        <div>Content</div>
      </Modal>
    </>
  );
}
```

## ConfirmDialog

```tsx
function DeleteButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { success } = useToast();

  const handleDelete = async () => {
    await deletePrayer();
    success('삭제되었습니다');
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Delete</button>

      <ConfirmDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleDelete}
        title="삭제 확인"
        message="정말로 삭제하시겠습니까?"
        variant="danger"
      />
    </>
  );
}
```

## AlertDialog

```tsx
function CreateButton() {
  const [showAlert, setShowAlert] = useState(false);

  const handleSubmit = async () => {
    try {
      await createPrayer();
      setShowAlert(true);
    } catch (error) {
      // Handle error
    }
  };

  return (
    <>
      <button onClick={handleSubmit}>Create</button>

      <AlertDialog
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        title="등록 완료"
        message="기도제목이 등록되었습니다."
        variant="success"
      />
    </>
  );
}
```

## Common Patterns

### Create → Success Toast
```tsx
const { success, error } = useToast();

const handleCreate = async (data) => {
  try {
    await api.create(data);
    success('등록되었습니다!');
  } catch (err) {
    error('등록에 실패했습니다.');
  }
};
```

### Delete → Confirm → Success Toast
```tsx
const [showConfirm, setShowConfirm] = useState(false);
const { success } = useToast();

const handleDelete = async () => {
  await api.delete(id);
  success('삭제되었습니다');
};

return (
  <>
    <button onClick={() => setShowConfirm(true)}>Delete</button>

    <ConfirmDialog
      isOpen={showConfirm}
      onClose={() => setShowConfirm(false)}
      onConfirm={handleDelete}
      title="삭제 확인"
      message="정말로 삭제하시겠습니까?"
      variant="danger"
    />
  </>
);
```

### API Error Handling
```tsx
const { error } = useToast();

try {
  const result = await api.call();
} catch (err) {
  if (err.status === 401) {
    error('로그인이 필요합니다');
  } else if (err.status === 403) {
    error('권한이 없습니다');
  } else if (err.status === 429) {
    error('오늘은 이미 기도하셨습니다');
  } else {
    error('오류가 발생했습니다');
  }
}
```

### Form Validation
```tsx
const { warning } = useToast();

const handleSubmit = (data) => {
  if (!data.title) {
    warning('제목을 입력해주세요');
    return;
  }

  if (data.content.length < 10) {
    warning('내용을 10자 이상 입력해주세요');
    return;
  }

  // Submit
};
```

## Props Reference

### Modal
- `isOpen` - boolean
- `onClose` - () => void
- `title?` - string
- `size?` - 'sm' | 'md' | 'lg'
- `showCloseButton?` - boolean
- `closeOnOverlayClick?` - boolean
- `closeOnEscape?` - boolean

### ConfirmDialog
- `isOpen` - boolean
- `onClose` - () => void
- `onConfirm` - () => void
- `title` - string
- `message` - string
- `confirmText?` - string (default: "확인")
- `cancelText?` - string (default: "취소")
- `variant?` - 'danger' | 'default'

### AlertDialog
- `isOpen` - boolean
- `onClose` - () => void
- `title` - string
- `message` - string
- `confirmText?` - string (default: "확인")
- `variant?` - 'success' | 'error' | 'warning' | 'info'

### useToast
- `success(message, duration?)` - Show success toast
- `error(message, duration?)` - Show error toast
- `warning(message, duration?)` - Show warning toast
- `info(message, duration?)` - Show info toast
- `toast(options)` - Custom toast
- `dismiss(id)` - Dismiss specific
- `dismissAll()` - Dismiss all
