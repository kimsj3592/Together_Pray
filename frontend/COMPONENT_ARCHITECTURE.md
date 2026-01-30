# Component Architecture

Together Pray v2.0 - Search & Gesture System

## Component Hierarchy

```
SearchFilterBar (Integrated)
├── SearchInput
│   ├── Search Icon (lucide-react)
│   ├── Input Field
│   └── Clear Button | Loading Spinner
│
├── FilterChips
│   └── Chip Buttons
│       ├── Check Icon (selected)
│       ├── Label
│       └── Count Badge (optional)
│
└── SortDropdown
    ├── Dropdown Button
    └── Dropdown Menu
        └── Option Items
            ├── Label
            └── Check Icon (selected)
```

## Data Flow

```
Parent Component
     │
     ├─ searchValue (state) ──────────┐
     ├─ filterValue (state) ──────────┤
     ├─ sortValue (state) ────────────┤
     │                                 │
     ▼                                 ▼
SearchFilterBar                   API Fetch
     │                                 │
     ├─ onSearchChange ────────────────┤
     ├─ onFilterChange ────────────────┤
     ├─ onSortChange ──────────────────┤
     │                                 │
     ▼                                 ▼
Update State ──────────────────► Update Results
```

## Interaction Flow

### Search Flow
```
User types → Local state updates → Debounce (300ms) →
onChange callback → Parent updates → API call → Results update
```

### Filter Flow
```
User clicks chip → Haptic feedback → onChange callback →
Parent updates → API call → Results update
```

### Sort Flow
```
User clicks sort → Opens dropdown → User selects option →
Haptic feedback → Dropdown closes → onChange callback →
Parent updates → API call → Results update
```

## Hook Integration

### useKeyboardShortcuts
```
Component Mount
     │
     ├─ Register shortcuts
     │   ├─ '/' → Focus search
     │   ├─ 'n' → New item
     │   └─ 'Esc' → Close modal
     │
     └─ On keydown event
         └─ Match shortcut → Execute callback
```

### useLongPress
```
Touch Start
     │
     ├─ Start timer (500ms)
     ├─ Call onPressStart
     │
     ├─ If timer completes → Long Press
     │   ├─ Haptic feedback
     │   └─ Call onLongPress
     │
     └─ If timer cancelled → Regular Press
         └─ Call onPress
```

### useHaptics
```
User Action
     │
     ├─ Tap → haptics.light()
     ├─ Important action → haptics.medium()
     ├─ Success → haptics.success()
     └─ Error → haptics.error()
         │
         └─ Vibration API → Device vibrates
```

## State Management

### Component State
```typescript
// Local component state
const [search, setSearch] = useState('');
const [filter, setFilter] = useState('all');
const [sort, setSort] = useState('latest');
const [isLoading, setIsLoading] = useState(false);

// Derived state
const filteredPrayers = useMemo(() => {
  return prayers.filter(prayer => {
    const matchesSearch = prayer.title.includes(search);
    const matchesFilter = filter === 'all' || prayer.status === filter;
    return matchesSearch && matchesFilter;
  });
}, [prayers, search, filter]);

// Sorted results
const sortedPrayers = useMemo(() => {
  return [...filteredPrayers].sort((a, b) => {
    switch (sort) {
      case 'latest': return b.createdAt - a.createdAt;
      case 'oldest': return a.createdAt - b.createdAt;
      case 'most-prayed': return b.prayerCount - a.prayerCount;
      default: return 0;
    }
  });
}, [filteredPrayers, sort]);
```

## Animation System

### Component Animations
```
SearchInput
├─ Clear button: fade in/out + scale
└─ Loading spinner: fade in/out + spin

FilterChips
├─ Chip selection: background color transition
├─ Check icon: fade in/out + scale
└─ Hover: scale + color change

SortDropdown
├─ Dropdown open: fade + slide + scale
├─ Chevron rotation: 0° → 180°
└─ Option selection: background color transition

SearchFilterBar
└─ Initial mount: fade in + slide up
```

### List Animations
```typescript
// Stagger children animation
<motion.div variants={listContainer} initial="hidden" animate="visible">
  {items.map((item, i) => (
    <motion.div
      key={item.id}
      variants={listItem}
      // Delay based on index
      transition={{ delay: i * 0.05 }}
    >
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

## Responsive Behavior

### Mobile (< 768px)
```
SearchFilterBar
├── Search Input (full width)
├── Sort Dropdown (inline)
└── Filter Chips (horizontal scroll)
```

### Desktop (≥ 768px)
```
SearchFilterBar
├── Row 1: Search Input + Sort Dropdown
└── Row 2: Filter Chips (wrap)
```

## Event Handling

### Search Debouncing
```typescript
// Internal state for immediate feedback
const [localValue, setLocalValue] = useState(value);

// Debounced callback
const handleChange = (newValue: string) => {
  setLocalValue(newValue); // Immediate UI update

  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    onChange(newValue); // Debounced API call
  }, 300);
};
```

### Outside Click Detection
```typescript
// For dropdown close on outside click
useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  if (isOpen) {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }
}, [isOpen]);
```

## Error Handling

### Search Errors
```typescript
try {
  setIsLoading(true);
  const results = await api.search(query);
  setResults(results);
} catch (error) {
  haptics.error();
  toast.error('검색에 실패했습니다');
} finally {
  setIsLoading(false);
}
```

### Haptic Fallback
```typescript
// Graceful degradation for unsupported browsers
const triggerHaptic = (pattern: number | number[]): void => {
  if ('vibrate' in navigator) {
    navigator.vibrate(pattern);
  }
  // No error thrown, just silently fails
};
```

## Performance Optimizations

### Debouncing
```typescript
// Prevent excessive API calls
const debouncedSearch = useMemo(
  () => debounce(search, 300),
  [search]
);
```

### Memoization
```typescript
// Expensive computations
const filteredResults = useMemo(() => {
  return prayers.filter(matchesFilters);
}, [prayers, filters]);
```

### Lazy Loading
```typescript
// Load more on scroll
const observer = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    loadMoreResults();
  }
});
```

## Accessibility Features

### Keyboard Navigation
```
Tab       → Move focus through components
Enter     → Activate focused element
Space     → Toggle chip selection
Escape    → Close dropdown
/         → Focus search input
```

### ARIA Attributes
```tsx
<button
  aria-label="검색어 지우기"
  aria-pressed={isSelected}
  role="button"
/>

<input
  aria-describedby="search-hint"
  aria-invalid={hasError}
/>
```

### Screen Reader Announcements
```tsx
<div role="status" aria-live="polite" aria-atomic="true">
  {isLoading ? '검색 중...' : `${results.length}개의 결과`}
</div>
```

## Testing Strategy

### Unit Tests
```typescript
describe('SearchInput', () => {
  it('debounces onChange callback');
  it('shows clear button when value present');
  it('clears input on clear button click');
});
```

### Integration Tests
```typescript
describe('SearchFilterBar', () => {
  it('updates results when search changes');
  it('filters results when chip selected');
  it('sorts results when sort changed');
});
```

### E2E Tests
```typescript
test('User can search and filter prayers', async () => {
  await page.goto('/prayers');
  await page.fill('[placeholder="검색"]', 'health');
  await page.click('text=기도중');
  await expect(page.locator('.prayer-card')).toHaveCount(5);
});
```

## Integration Examples

### Basic Integration
```tsx
import { SearchFilterBar } from '@/components/features/search';

function PrayersPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('latest');

  return (
    <SearchFilterBar
      searchValue={search}
      onSearchChange={setSearch}
      filterOptions={filterOptions}
      filterValue={filter}
      onFilterChange={setFilter}
      sortOptions={sortOptions}
      sortValue={sort}
      onSortChange={setSort}
    />
  );
}
```

### With API Integration
```tsx
function PrayersPage() {
  const [params, setParams] = useState({
    search: '',
    filter: 'all',
    sort: 'latest',
  });

  const { data, isLoading } = useQuery({
    queryKey: ['prayers', params],
    queryFn: () => api.prayers.list(params),
  });

  return (
    <SearchFilterBar
      {...params}
      onSearchChange={(search) => setParams({ ...params, search })}
      onFilterChange={(filter) => setParams({ ...params, filter })}
      onSortChange={(sort) => setParams({ ...params, sort })}
      searchLoading={isLoading}
    />
  );
}
```

### With Keyboard Shortcuts
```tsx
function PrayersPage() {
  const searchRef = useRef<HTMLInputElement>(null);

  useKeyboardShortcuts([
    {
      key: '/',
      callback: () => searchRef.current?.focus(),
    },
  ]);

  return <SearchInput ref={searchRef} {...props} />;
}
```

## Design Tokens Usage

### Component Styling
```css
/* Primary colors */
background: rgb(var(--color-primary-500));
border: 1px solid rgb(var(--color-border));

/* Typography */
font-size: var(--font-size-base);
font-weight: 500;

/* Spacing */
padding: var(--space-4);
gap: var(--space-3);

/* Border radius */
border-radius: var(--radius-lg);

/* Shadows */
box-shadow: var(--shadow-md);
```

---

**Architecture Date**: 2025-01-30
**Version**: v2.0
**Status**: ✅ Complete
