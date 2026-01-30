'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { haptics } from '@/lib/haptics';

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface FilterChipsProps {
  /** Available filter options */
  options: FilterOption[];
  /** Selected value(s) */
  value: string | string[];
  /** Callback when selection changes */
  onChange: (value: string | string[]) => void;
  /** Allow multiple selections */
  multiple?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * FilterChips Component
 * Toss-style filter chips for status, category, etc.
 */
export const FilterChips = ({
  options,
  value,
  onChange,
  multiple = false,
  className,
}: FilterChipsProps) => {
  const selectedValues = Array.isArray(value) ? value : [value];

  const handleSelect = (optionValue: string) => {
    haptics.light();

    if (multiple) {
      // Multiple selection mode
      const newValues = selectedValues.includes(optionValue)
        ? selectedValues.filter((v) => v !== optionValue)
        : [...selectedValues, optionValue];

      onChange(newValues);
    } else {
      // Single selection mode
      onChange(optionValue);
    }
  };

  const isSelected = (optionValue: string) => selectedValues.includes(optionValue);

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {options.map((option) => {
        const selected = isSelected(option.value);

        return (
          <motion.button
            key={option.value}
            onClick={() => handleSelect(option.value)}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className={cn(
              'inline-flex items-center justify-center gap-2',
              'px-4 py-2',
              'min-h-[36px]',
              'rounded-[var(--radius-full)]',
              'text-[var(--font-size-sm)]',
              'font-medium',
              'transition-all duration-200 ease-in-out',
              'border',
              selected
                ? 'bg-[rgb(var(--color-primary-500))] text-white border-[rgb(var(--color-primary-500))]'
                : 'bg-[rgb(var(--color-bg-primary))] text-[rgb(var(--color-text-primary))] border-[rgb(var(--color-border))] hover:border-[rgb(var(--color-primary-500))] hover:text-[rgb(var(--color-primary-500))]'
            )}
            type="button"
          >
            {/* Check icon for selected state */}
            {selected && (
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.15 }}
              >
                <Check size={16} strokeWidth={2.5} />
              </motion.span>
            )}

            {/* Label */}
            <span>{option.label}</span>

            {/* Optional count badge */}
            {option.count !== undefined && (
              <span
                className={cn(
                  'inline-flex items-center justify-center',
                  'px-1.5 py-0.5',
                  'rounded-full',
                  'text-[10px]',
                  'font-semibold',
                  selected
                    ? 'bg-white/20 text-white'
                    : 'bg-[rgb(var(--color-gray-100))] text-[rgb(var(--color-text-secondary))]'
                )}
              >
                {option.count}
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
};

FilterChips.displayName = 'FilterChips';
