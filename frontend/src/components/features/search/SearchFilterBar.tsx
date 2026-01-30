'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SearchInput } from './SearchInput';
import { FilterChips, FilterOption } from './FilterChips';
import { SortDropdown, SortOption } from './SortDropdown';

export interface SearchFilterBarProps {
  /** Search value */
  searchValue: string;
  /** Search change handler */
  onSearchChange: (value: string) => void;
  /** Filter options */
  filterOptions?: FilterOption[];
  /** Selected filter value(s) */
  filterValue?: string | string[];
  /** Filter change handler */
  onFilterChange?: (value: string | string[]) => void;
  /** Allow multiple filter selections */
  multipleFilters?: boolean;
  /** Sort options */
  sortOptions?: SortOption[];
  /** Selected sort value */
  sortValue?: string;
  /** Sort change handler */
  onSortChange?: (value: string) => void;
  /** Show filters */
  showFilters?: boolean;
  /** Show sort */
  showSort?: boolean;
  /** Search loading state */
  searchLoading?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * SearchFilterBar Component
 * Integrated search, filter, and sort bar for Together Pray v2.0
 */
export const SearchFilterBar = ({
  searchValue,
  onSearchChange,
  filterOptions = [],
  filterValue,
  onFilterChange,
  multipleFilters = false,
  sortOptions = [],
  sortValue,
  onSortChange,
  showFilters = true,
  showSort = true,
  searchLoading = false,
  className,
}: SearchFilterBarProps) => {
  const hasFilters = showFilters && filterOptions.length > 0;
  const hasSort = showSort && sortOptions.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn('space-y-4', className)}
    >
      {/* Search and Sort Row */}
      <div className="flex items-center gap-3">
        {/* Search Input */}
        <div className="flex-1">
          <SearchInput
            value={searchValue}
            onChange={onSearchChange}
            placeholder="기도제목 검색"
            loading={searchLoading}
          />
        </div>

        {/* Sort Dropdown */}
        {hasSort && sortValue && onSortChange && (
          <SortDropdown
            options={sortOptions}
            value={sortValue}
            onChange={onSortChange}
          />
        )}
      </div>

      {/* Filter Chips Row */}
      {hasFilters && filterValue && onFilterChange && (
        <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
          <FilterChips
            options={filterOptions}
            value={filterValue}
            onChange={onFilterChange}
            multiple={multipleFilters}
          />
        </div>
      )}
    </motion.div>
  );
};

SearchFilterBar.displayName = 'SearchFilterBar';
