# Migration Guide - Components v2.0

Together Pray 컴포넌트 업데이트 마이그레이션 가이드

## 📋 Changes Summary

### 1. EmptyState Component Relocation

**Before (v1.0):**
```tsx
import EmptyState from '@/components/EmptyState';

<EmptyState type="prayers" />
```

**After (v2.0):**
```tsx
import { EmptyState } from '@/components/ui/EmptyState';
// or
import { EmptyState } from '@/components/ui';

<EmptyState type="prayers" />
```

**Breaking Changes:**
- ✅ Moved from `/components/` to `/components/ui/`
- ✅ Changed from default export to named export
- ✅ Added 'custom' type option
- ✅ Enhanced animations and styling

**Migration Steps:**
1. Update import path: `@/components/EmptyState` → `@/components/ui/EmptyState`
2. Change to named import: `import EmptyState` → `import { EmptyState }`
3. (Optional) Use new 'custom' type for fully customized states

---

### 2. New Components Available

#### Timeline Component
**Path:** `@/components/features/prayer/Timeline`

**Usage:**
```tsx
import { Timeline } from '@/components/features/prayer';

<Timeline
  prayerItem={prayerItem}
  updates={updates}
  onAddUpdate={handleAddUpdate}
  canEdit={isAuthor}
  sortOrder="desc"
/>
```

**Integration Points:**
- Prayer detail page (`/prayers/[id]`)
- Admin dashboard
- Prayer update modals

---

#### PrayerForm Component
**Path:** `@/components/features/prayer/PrayerForm`

**Usage:**
```tsx
import { PrayerForm } from '@/components/features/prayer';

const [isOpen, setIsOpen] = useState(false);

<PrayerForm
  groupId={groupId}
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onSuccess={(prayerItemId) => {
    console.log('Created:', prayerItemId);
  }}
/>
```

**Integration Points:**
- Group prayer list page FAB
- Quick add from dashboard
- Navigation menu action

---

## 🔄 File-by-File Migration

### app/groups/page.tsx
```diff
- import EmptyState from '@/components/EmptyState';
+ import { EmptyState } from '@/components/ui';
```

### app/groups/[id]/prayers/page.tsx
```diff
- import EmptyState from '@/components/EmptyState';
+ import { EmptyState } from '@/components/ui';
+ import { PrayerForm } from '@/components/features/prayer';

+ const [formOpen, setFormOpen] = useState(false);

  {prayers.length === 0 ? (
    <EmptyState
      type="prayers"
      actionLabel="새 기도제목 작성"
+     onAction={() => setFormOpen(true)}
    />
  ) : (
    // ... prayer list
  )}

+ <PrayerForm
+   groupId={groupId}
+   isOpen={formOpen}
+   onClose={() => setFormOpen(false)}
+ />
```

### app/prayers/[id]/page.tsx (NEW)
```tsx
import { Timeline } from '@/components/features/prayer';
import { useParams } from 'next/navigation';

export default function PrayerDetailPage() {
  const params = useParams();
  const { data: prayer } = usePrayer(params.id);
  const { data: updates } = usePrayerUpdates(params.id);

  const handleAddUpdate = async (content: string) => {
    await api.createPrayerUpdate(params.id, content);
    // Revalidate updates
  };

  return (
    <div className="space-y-6">
      <PrayerCard item={prayer} showFullContent />

      <Timeline
        prayerItem={prayer}
        updates={updates}
        onAddUpdate={handleAddUpdate}
        canEdit={prayer.isAuthor}
      />
    </div>
  );
}
```

---

## 🎯 Quick Reference

### Import Paths

| Component | Old Path | New Path |
|-----------|----------|----------|
| EmptyState | `@/components/EmptyState` | `@/components/ui/EmptyState` |
| Timeline | N/A (new) | `@/components/features/prayer/Timeline` |
| PrayerForm | N/A (new) | `@/components/features/prayer/PrayerForm` |

### Export Types

| Component | Export Type |
|-----------|-------------|
| EmptyState | Named (`export { EmptyState }`) |
| Timeline | Named (`export { Timeline }`) |
| PrayerForm | Named (`export { PrayerForm }`) |

---

## ✅ Automated Migration Script

Run this script to automatically update imports:

```bash
#!/bin/bash
# migrate-components.sh

# Update EmptyState imports
find src/app -name "*.tsx" -type f -exec sed -i '' \
  "s|import EmptyState from '@/components/EmptyState'|import { EmptyState } from '@/components/ui'|g" {} \;

echo "Migration complete!"
echo "Please review changes and test thoroughly."
```

**Usage:**
```bash
chmod +x migrate-components.sh
./migrate-components.sh
```

---

## 🧪 Testing Checklist

After migration, verify:

- [ ] All pages with EmptyState render correctly
- [ ] Prayer list pages show PrayerForm on FAB click
- [ ] Prayer detail pages show Timeline
- [ ] Timeline allows adding updates (for authors)
- [ ] PrayerForm validates input correctly
- [ ] PrayerForm shows confetti on success
- [ ] All animations work smoothly
- [ ] Dark mode compatibility
- [ ] Mobile responsiveness
- [ ] No TypeScript errors
- [ ] No console warnings

---

## 🐛 Troubleshooting

### Issue: "Module not found: @/components/EmptyState"
**Solution:** Update import path to `@/components/ui/EmptyState`

### Issue: "has no default export"
**Solution:** Change to named import: `import { EmptyState }`

### Issue: Timeline not showing events
**Solution:** Check `updates` array is being passed correctly

### Issue: PrayerForm not opening
**Solution:** Verify `isOpen` state is managed correctly

### Issue: Confetti animation not showing
**Solution:** Check browser supports CSS animations

---

## 📚 Additional Resources

- [Component Guide](./features/prayer/COMPONENT_GUIDE.md)
- [Timeline Examples](./features/prayer/Timeline.example.tsx)
- [PrayerForm Examples](./features/prayer/PrayerForm.example.tsx)
- [Design System](./ui/README.md)

---

## 🚀 Next Steps

1. ✅ Complete file-by-file migration
2. ✅ Test all affected pages
3. ✅ Update any custom EmptyState usage
4. ✅ Integrate Timeline in prayer detail pages
5. ✅ Add PrayerForm to appropriate locations
6. ✅ Review and update documentation
7. ✅ Deploy to staging
8. ✅ QA testing
9. ✅ Deploy to production

---

**Questions?** Check the component documentation or example files.
