# Search & Filter Components

Together Pray v2.0 - Toss-style search and filter UI

## Components

### SearchInput
Search input with debouncing, clear button, and loading state.

```tsx
<SearchInput
  value={search}
  onChange={setSearch}
  placeholder="기도제목 검색"
  loading={isSearching}
  debounceDelay={300}
  autoFocus
/>
```

### FilterChips
Status filter chips with single or multiple selection.

```tsx
<FilterChips
  options={[
    { value: 'all', label: '전체', count: 24 },
    { value: 'praying', label: '기도중', count: 12 },
  ]}
  value={filter}
  onChange={setFilter}
  multiple={false}
/>
```

### SortDropdown
Dropdown for sorting options.

```tsx
<SortDropdown
  options={[
    { value: 'latest', label: '최신순' },
    { value: 'oldest', label: '오래된순' },
  ]}
  value={sort}
  onChange={setSort}
/>
```

### SearchFilterBar (Integrated)
Complete search, filter, and sort bar.

```tsx
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

## Features

- Debounced search (300ms default)
- Clear button with animation
- Loading indicator
- Keyboard navigation
- Touch-friendly (44x44px minimum)
- Haptic feedback on mobile
- Dark mode support
- Responsive layout

## Design System

Uses design tokens from `globals.css`:
- Colors: `rgb(var(--color-primary-500))`
- Spacing: 4px base scale
- Border radius: `var(--radius-lg)`
- Typography: Pretendard font

## Animation

Uses Framer Motion for:
- Chip selection animation
- Dropdown open/close
- Clear button fade in/out
- List stagger animation

## Mobile Optimization

- Horizontal scroll for filter chips
- Touch-friendly tap targets
- Haptic feedback integration
- iOS safe area support
- Native scroll behavior

## Accessibility

- ARIA labels for icon buttons
- Keyboard navigation support
- Focus management
- Screen reader friendly
- Reduced motion support

## Example Usage

See `/app/(main)/groups/[id]/prayers/example-page.tsx` for complete implementation.
