'use client';

import { useState, useEffect, useRef, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Search, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { haptics } from '@/lib/haptics';

export interface SearchInputProps {
  /** Current search value */
  value: string;
  /** Callback when search value changes */
  onChange: (value: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Loading state indicator */
  loading?: boolean;
  /** Debounce delay in milliseconds (default: 300ms) */
  debounceDelay?: number;
  /** Additional CSS classes */
  className?: string;
  /** Auto focus on mount */
  autoFocus?: boolean;
}

/**
 * SearchInput Component
 * Toss-style search input with debouncing and clear button
 */
export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      value,
      onChange,
      placeholder = '검색',
      loading = false,
      debounceDelay = 300,
      className,
      autoFocus = false,
    },
    ref
  ) => {
    const [localValue, setLocalValue] = useState(value);
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Sync external value changes
    useEffect(() => {
      setLocalValue(value);
    }, [value]);

    // Debounced onChange
    const handleChange = (newValue: string) => {
      setLocalValue(newValue);

      // Clear existing timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Set new timer
      debounceTimerRef.current = setTimeout(() => {
        onChange(newValue);
      }, debounceDelay);
    };

    // Clear search
    const handleClear = () => {
      haptics.light();
      setLocalValue('');
      onChange('');

      // Clear debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };

    // Cleanup on unmount
    useEffect(() => {
      return () => {
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }
      };
    }, []);

    const showClearButton = localValue.length > 0;

    return (
      <div className={cn('relative w-full', className)}>
        {/* Search Icon */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--color-text-tertiary))] pointer-events-none">
          <Search size={20} />
        </div>

        {/* Input Field */}
        <input
          ref={ref}
          type="text"
          value={localValue}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className={cn(
            'w-full h-[44px] pl-10 pr-10',
            'rounded-[var(--radius-lg)]',
            'text-[var(--font-size-base)]',
            'bg-[rgb(var(--color-bg-primary))]',
            'border border-[rgb(var(--color-border))]',
            'text-[rgb(var(--color-text-primary))]',
            'placeholder:text-[rgb(var(--color-text-tertiary))]',
            'transition-all duration-200 ease-in-out',
            'focus:outline-none focus:border-[rgb(var(--color-primary-500))] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]'
          )}
        />

        {/* Right Icons (Loading or Clear) */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {loading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
            >
              <Loader2
                size={18}
                className="text-[rgb(var(--color-text-tertiary))] animate-spin"
              />
            </motion.div>
          )}

          {!loading && showClearButton && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.15 }}
              onClick={handleClear}
              type="button"
              className={cn(
                'flex items-center justify-center',
                'w-[20px] h-[20px]',
                'rounded-full',
                'bg-[rgb(var(--color-gray-300))]',
                'text-white',
                'hover:bg-[rgb(var(--color-gray-400))]',
                'transition-colors duration-150'
              )}
              aria-label="검색어 지우기"
            >
              <X size={14} />
            </motion.button>
          )}
        </div>
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';
