# Gesture Interactions & Search/Filter UI Guide

Together Pray v2.0 - Implementation Guide

## Table of Contents

1. [Haptic Feedback](#haptic-feedback)
2. [Keyboard Shortcuts](#keyboard-shortcuts)
3. [Long Press Gesture](#long-press-gesture)
4. [Search Components](#search-components)
5. [Usage Examples](#usage-examples)

---

## Haptic Feedback

### Overview
Provides tactile feedback for mobile interactions using the Vibration API.

### Location
`/lib/haptics.ts`

### API

```typescript
import { haptics } from '@/lib/haptics';

// Light tap (10ms)
haptics.light();

// Medium impact (25ms)
haptics.medium();

// Heavy impact (50ms)
haptics.heavy();

// Success pattern (10ms, 50ms, 10ms)
haptics.success();

// Error pattern (50ms, 100ms, 50ms)
haptics.error();
```

### Hook Usage

```typescript
import { useHaptics } from '@/lib/haptics';

const { haptics, withHaptic } = useHaptics();

// Wrap callback with haptic feedback
const handleClick = withHaptic(() => {
  console.log('Button clicked');
}, 'light');
```

### Use Cases

- **Light**: Button taps, switch toggles, chip selections
- **Medium**: Card selections, filter changes, modal opens
- **Heavy**: Important actions, destructive actions
- **Success**: Prayer reactions, status updates, form submissions
- **Error**: Validation errors, failed actions

---

## Keyboard Shortcuts

### Overview
Manage keyboard shortcuts for desktop users.

### Location
`/hooks/useKeyboardShortcuts.ts`

### API

```typescript
import { useKeyboardShortcuts } from '@/hooks';

const shortcuts = [
  {
    key: 'n',
    description: '새 기도제목 작성',
    callback: () => handleNewPrayer(),
  },
  {
    key: '/',
    description: '검색 포커스',
    callback: () => searchInputRef.current?.focus(),
  },
  {
    key: 'Escape',
    description: '모달 닫기',
    callback: () => setIsOpen(false),
  },
  {
    key: '?',
    shiftKey: true,
    description: '단축키 도움말',
    callback: () => setShowHelp(true),
  },
];

useKeyboardShortcuts(shortcuts);
```

### Default Shortcuts

| Key | Action | Description |
|-----|--------|-------------|
| `n` | New Prayer | 새 기도제목 작성 |
| `/` | Focus Search | 검색 포커스 |
| `Esc` | Close Modal | 모달/바텀시트 닫기 |
| `Shift + ?` | Show Help | 단축키 도움말 |

---

## Long Press Gesture

### Overview
Handle long press gestures for contextual actions.

### Location
`/hooks/useLongPress.ts`

### API

```typescript
import { useLongPress } from '@/hooks';

const longPressHandlers = useLongPress({
  threshold: 500, // ms
  onLongPress: () => {
    console.log('Long press detected');
    showContextMenu();
  },
  onPress: () => {
    console.log('Regular tap');
  },
  onPressStart: () => {
    haptics.light();
  },
  onPressEnd: () => {
    console.log('Press ended');
  },
});

// Apply to element
<div {...longPressHandlers}>
  Press and hold
</div>
```

### Use Cases

- Long press on prayer card to show context menu
- Long press on user avatar to show profile preview
- Long press on status badge to show history

---

## Search Components

### 1. SearchInput

#### Overview
Toss-style search input with debouncing and clear button.

#### Location
`/components/features/search/SearchInput.tsx`

#### Props

```typescript
interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  loading?: boolean;
  debounceDelay?: number; // default: 300ms
  className?: string;
  autoFocus?: boolean;
}
```

#### Example

```tsx
import { SearchInput } from '@/components/features/search';

const [search, setSearch] = useState('');

<SearchInput
  value={search}
  onChange={setSearch}
  placeholder="기도제목 검색"
  loading={isSearching}
  autoFocus
/>
```

---

### 2. FilterChips

#### Overview
Status filter chips with single or multiple selection.

#### Location
`/components/features/search/FilterChips.tsx`

#### Props

```typescript
interface FilterChipsProps {
  options: FilterOption[];
  value: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  className?: string;
}

interface FilterOption {
  value: string;
  label: string;
  count?: number; // optional count badge
}
```

#### Example

```tsx
import { FilterChips } from '@/components/features/search';

const filterOptions = [
  { value: 'all', label: '전체', count: 24 },
  { value: 'praying', label: '기도중', count: 12 },
  { value: 'partial', label: '부분응답', count: 5 },
  { value: 'answered', label: '응답완료', count: 7 },
];

const [filter, setFilter] = useState('all');

<FilterChips
  options={filterOptions}
  value={filter}
  onChange={setFilter}
/>
```

---

### 3. SortDropdown

#### Overview
Dropdown for sorting options.

#### Location
`/components/features/search/SortDropdown.tsx`

#### Props

```typescript
interface SortDropdownProps {
  options: SortOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

interface SortOption {
  value: string;
  label: string;
}
```

#### Example

```tsx
import { SortDropdown } from '@/components/features/search';

const sortOptions = [
  { value: 'latest', label: '최신순' },
  { value: 'oldest', label: '오래된순' },
  { value: 'most-prayed', label: '기도 많은순' },
  { value: 'updated', label: '업데이트순' },
];

const [sort, setSort] = useState('latest');

<SortDropdown
  options={sortOptions}
  value={sort}
  onChange={setSort}
/>
```

---

### 4. SearchFilterBar (Integrated)

#### Overview
Complete search, filter, and sort bar.

#### Location
`/components/features/search/SearchFilterBar.tsx`

#### Props

```typescript
interface SearchFilterBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  filterOptions?: FilterOption[];
  filterValue?: string | string[];
  onFilterChange?: (value: string | string[]) => void;
  multipleFilters?: boolean;
  sortOptions?: SortOption[];
  sortValue?: string;
  onSortChange?: (value: string) => void;
  showFilters?: boolean;
  showSort?: boolean;
  searchLoading?: boolean;
  className?: string;
}
```

#### Example

```tsx
import { SearchFilterBar } from '@/components/features/search';

const [search, setSearch] = useState('');
const [filter, setFilter] = useState('all');
const [sort, setSort] = useState('latest');

<SearchFilterBar
  searchValue={search}
  onSearchChange={setSearch}
  filterOptions={filterOptions}
  filterValue={filter}
  onFilterChange={setFilter}
  sortOptions={sortOptions}
  sortValue={sort}
  onSortChange={setSort}
  searchLoading={isLoading}
/>
```

---

## Usage Examples

### Example 1: Prayer List Page with Full Search

```tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { SearchFilterBar } from '@/components/features/search';
import { useKeyboardShortcuts } from '@/hooks';
import { haptics } from '@/lib/haptics';
import { PrayerCard } from '@/components/features/prayer';

export default function PrayersPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('latest');
  const [isLoading, setIsLoading] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter options
  const filterOptions = [
    { value: 'all', label: '전체', count: 24 },
    { value: 'praying', label: '기도중', count: 12 },
    { value: 'partial', label: '부분응답', count: 5 },
    { value: 'answered', label: '응답완료', count: 7 },
  ];

  // Sort options
  const sortOptions = [
    { value: 'latest', label: '최신순' },
    { value: 'oldest', label: '오래된순' },
    { value: 'most-prayed', label: '기도 많은순' },
    { value: 'updated', label: '업데이트순' },
  ];

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: '/',
      description: '검색 포커스',
      callback: () => searchInputRef.current?.focus(),
    },
  ]);

  // Fetch prayers when filters change
  useEffect(() => {
    setIsLoading(true);
    fetchPrayers({ search, filter, sort })
      .finally(() => setIsLoading(false));
  }, [search, filter, sort]);

  return (
    <div className="p-4 space-y-4">
      <SearchFilterBar
        searchValue={search}
        onSearchChange={setSearch}
        filterOptions={filterOptions}
        filterValue={filter}
        onFilterChange={setFilter}
        sortOptions={sortOptions}
        sortValue={sort}
        onSortChange={setSort}
        searchLoading={isLoading}
      />

      {/* Prayer list */}
      <div className="space-y-3">
        {prayers.map((prayer) => (
          <PrayerCard key={prayer.id} prayer={prayer} />
        ))}
      </div>
    </div>
  );
}
```

---

### Example 2: Prayer Card with Long Press

```tsx
'use client';

import { motion } from 'framer-motion';
import { useLongPress } from '@/hooks';
import { haptics } from '@/lib/haptics';
import { Badge } from '@/components/ui';

export function PrayerCard({ prayer }) {
  const [showMenu, setShowMenu] = useState(false);

  const longPressHandlers = useLongPress({
    threshold: 500,
    onLongPress: () => {
      haptics.medium();
      setShowMenu(true);
    },
    onPress: () => {
      // Regular tap - navigate to detail
      router.push(`/prayers/${prayer.id}`);
    },
    onPressStart: () => {
      haptics.light();
    },
  });

  return (
    <motion.div
      {...longPressHandlers}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="card p-5"
    >
      <div className="flex items-center gap-3 mb-4">
        <h3 className="font-semibold flex-1">{prayer.title}</h3>
        <Badge variant={prayer.status}>
          {statusLabels[prayer.status]}
        </Badge>
      </div>
      <p className="text-secondary line-clamp-3">{prayer.content}</p>

      {/* Context menu */}
      {showMenu && <ContextMenu onClose={() => setShowMenu(false)} />}
    </motion.div>
  );
}
```

---

### Example 3: Pray Button with Haptic Feedback

```tsx
'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui';
import { haptics } from '@/lib/haptics';

export function PrayButton({ prayerId, hasPrayed, onPray }) {
  const handlePray = async () => {
    try {
      // Immediate haptic feedback
      haptics.light();

      // Optimistic update
      onPray(prayerId);

      // API call
      await api.prayers.pray(prayerId);

      // Success haptic
      haptics.success();
    } catch (error) {
      // Error haptic
      haptics.error();
      console.error(error);
    }
  };

  return (
    <Button
      variant={hasPrayed ? 'secondary' : 'primary'}
      size="sm"
      onClick={handlePray}
      disabled={hasPrayed}
    >
      {hasPrayed ? '기도했어요 ✓' : '🙏 기도하기'}
    </Button>
  );
}
```

---

## Design System Integration

All components use the design system from `globals.css`:

- **Colors**: CSS variables (e.g., `rgb(var(--color-primary-500))`)
- **Spacing**: 4px base scale
- **Typography**: Pretendard font family
- **Radius**: `var(--radius-lg)`, `var(--radius-full)`, etc.
- **Shadows**: `var(--shadow-sm)`, `var(--shadow-md)`, etc.

---

## Mobile-First Approach

- All components are touch-friendly (44x44px minimum)
- Horizontal scroll for filter chips on mobile
- Responsive search/sort layout
- Haptic feedback for touch interactions
- Optimized animations for mobile performance

---

## Accessibility

- Keyboard navigation support
- ARIA labels for icon buttons
- Focus management for modals
- Screen reader friendly
- Reduced motion support

---

## Performance Considerations

- **Debouncing**: Search input debounces at 300ms (configurable)
- **Lazy Loading**: Components load only when needed
- **Animation Optimization**: Uses GPU-accelerated transforms
- **Memory Management**: Proper cleanup of timers and listeners

---

## Browser Compatibility

- **Vibration API**: Supported in Chrome/Android, Safari/iOS
- **Keyboard Events**: All modern browsers
- **Framer Motion**: React 18+, all modern browsers

---

## Next Steps

1. Integrate components into prayer list pages
2. Add analytics tracking for search/filter usage
3. Implement server-side filtering and sorting
4. Add saved filter presets
5. Create keyboard shortcuts help modal
