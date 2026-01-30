# Quick Start Guide

Together Pray v2.0 - Search & Gesture Features

## 5-Minute Integration

### 1. Add Search to Prayer List Page

```tsx
'use client';

import { useState } from 'react';
import { SearchFilterBar } from '@/components/features/search';

export default function PrayersPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('latest');

  return (
    <div className="p-4">
      <SearchFilterBar
        searchValue={search}
        onSearchChange={setSearch}
        filterOptions={[
          { value: 'all', label: '전체' },
          { value: 'praying', label: '기도중' },
          { value: 'partial', label: '부분응답' },
          { value: 'answered', label: '응답완료' },
        ]}
        filterValue={filter}
        onFilterChange={setFilter}
        sortOptions={[
          { value: 'latest', label: '최신순' },
          { value: 'oldest', label: '오래된순' },
        ]}
        sortValue={sort}
        onSortChange={setSort}
      />
    </div>
  );
}
```

### 2. Add Haptic Feedback to Button

```tsx
import { Button } from '@/components/ui';
import { haptics } from '@/lib/haptics';

function PrayButton() {
  const handleClick = () => {
    haptics.light();
    // Your logic here
  };

  return <Button onClick={handleClick}>🙏 기도하기</Button>;
}
```

### 3. Add Keyboard Shortcuts

```tsx
import { useKeyboardShortcuts } from '@/hooks';

function MyPage() {
  useKeyboardShortcuts([
    {
      key: 'n',
      description: '새 기도제목',
      callback: () => router.push('/prayers/new'),
    },
    {
      key: '/',
      description: '검색',
      callback: () => searchRef.current?.focus(),
    },
  ]);

  return <YourComponent />;
}
```

### 4. Add Long Press to Card

```tsx
import { useLongPress } from '@/hooks';
import { haptics } from '@/lib/haptics';

function PrayerCard({ prayer }) {
  const longPressHandlers = useLongPress({
    threshold: 500,
    onLongPress: () => {
      haptics.medium();
      showContextMenu();
    },
    onPress: () => {
      router.push(`/prayers/${prayer.id}`);
    },
  });

  return (
    <div {...longPressHandlers} className="card">
      {prayer.title}
    </div>
  );
}
```

## Import Paths

```typescript
// Search components
import {
  SearchInput,
  FilterChips,
  SortDropdown,
  SearchFilterBar
} from '@/components/features/search';

// Hooks
import {
  useKeyboardShortcuts,
  useLongPress
} from '@/hooks';

// Haptics
import { haptics, useHaptics } from '@/lib/haptics';
```

## Common Patterns

### With API Integration

```tsx
const { data, isLoading } = useQuery({
  queryKey: ['prayers', { search, filter, sort }],
  queryFn: () => api.prayers.list({ search, filter, sort }),
});

<SearchFilterBar
  searchValue={search}
  onSearchChange={setSearch}
  searchLoading={isLoading}
  // ... other props
/>
```

### With URL Params

```tsx
const searchParams = useSearchParams();
const router = useRouter();

const search = searchParams.get('search') || '';
const filter = searchParams.get('filter') || 'all';

const handleSearchChange = (value: string) => {
  const params = new URLSearchParams(searchParams);
  params.set('search', value);
  router.push(`?${params.toString()}`);
};
```

## Pro Tips

1. Always use haptic feedback for important actions
2. Add keyboard shortcuts for power users
3. Use long press for context menus
4. Debounce search to reduce API calls
5. Show loading states during searches

## Troubleshooting

### TypeScript Errors
Make sure to import types:
```typescript
import type { FilterOption, SortOption } from '@/components/features/search';
```

### Haptics Not Working
Check browser support (works on mobile only):
```typescript
if ('vibrate' in navigator) {
  // Haptics supported
}
```

### Animations Janky
Use GPU-accelerated properties:
```typescript
// Good
transform: translateY(-2px)

// Bad
margin-top: -2px
```

## Documentation

- **Complete Guide**: See `GESTURE_SEARCH_GUIDE.md`
- **Full Example**: See `src/app/(main)/groups/[id]/prayers/example-page.tsx`
- **Component Docs**: See `src/components/features/search/README.md`
- **Architecture**: See `COMPONENT_ARCHITECTURE.md`

## Testing

```bash
# Run component tests
npm test search-components.test.tsx

# Run all tests
npm test

# Type check
npm run type-check

# Build
npm run build
```

## Need Help?

1. Check the example page for complete implementation
2. Review component README files
3. Look at test suite for expected behavior
4. Check globals.css for design tokens

---

**Ready to use!** Start with SearchFilterBar and add features as needed.
