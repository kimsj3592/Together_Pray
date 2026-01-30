'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { haptics } from '@/lib/haptics';

export interface SortOption {
  value: string;
  label: string;
}

export interface SortDropdownProps {
  /** Available sort options */
  options: SortOption[];
  /** Current selected value */
  value: string;
  /** Callback when selection changes */
  onChange: (value: string) => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * SortDropdown Component
 * Toss-style dropdown for sorting options
 */
export const SortDropdown = ({ options, value, onChange, className }: SortDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const selectedOption = options.find((option) => option.value === value);

  const handleSelect = (optionValue: string) => {
    haptics.light();
    onChange(optionValue);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    haptics.light();
    setIsOpen(!isOpen);
  };

  return (
    <div ref={dropdownRef} className={cn('relative inline-block', className)}>
      {/* Dropdown Button */}
      <motion.button
        onClick={toggleDropdown}
        whileTap={{ scale: 0.98 }}
        className={cn(
          'inline-flex items-center justify-center gap-2',
          'px-4 py-2',
          'min-h-[36px]',
          'rounded-[var(--radius-lg)]',
          'text-[var(--font-size-sm)]',
          'font-medium',
          'bg-[rgb(var(--color-bg-primary))]',
          'text-[rgb(var(--color-text-primary))]',
          'border border-[rgb(var(--color-border))]',
          'hover:border-[rgb(var(--color-primary-500))]',
          'transition-all duration-200 ease-in-out',
          isOpen && 'border-[rgb(var(--color-primary-500))] shadow-[0_0_0_3px_rgba(99,102,241,0.1)]'
        )}
        type="button"
      >
        <span>{selectedOption?.label || '정렬'}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={16} />
        </motion.span>
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={cn(
              'absolute right-0 top-[calc(100%+8px)] z-50',
              'min-w-[160px]',
              'rounded-[var(--radius-lg)]',
              'bg-[rgb(var(--color-bg-primary))]',
              'border border-[rgb(var(--color-border))]',
              'shadow-[var(--shadow-lg)]',
              'overflow-hidden'
            )}
          >
            <div className="py-1">
              {options.map((option) => {
                const isSelected = option.value === value;

                return (
                  <button
                    key={option.value}
                    onClick={() => handleSelect(option.value)}
                    className={cn(
                      'flex items-center justify-between gap-3',
                      'w-full px-4 py-2.5',
                      'text-[var(--font-size-sm)]',
                      'text-left',
                      'transition-colors duration-150',
                      isSelected
                        ? 'bg-[rgb(var(--color-primary-50))] text-[rgb(var(--color-primary-600))] font-medium'
                        : 'text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-gray-50))] dark:hover:bg-[rgb(var(--color-gray-800))]'
                    )}
                    type="button"
                  >
                    <span>{option.label}</span>
                    {isSelected && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.15 }}
                      >
                        <Check size={16} strokeWidth={2.5} />
                      </motion.span>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

SortDropdown.displayName = 'SortDropdown';
