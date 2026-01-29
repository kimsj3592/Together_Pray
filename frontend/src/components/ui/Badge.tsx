'use client';

import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export type BadgeVariant = 'default' | 'praying' | 'partial' | 'answered' | 'success' | 'warning' | 'info' | 'error';

export interface BadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'className'> {
  variant?: BadgeVariant;
  className?: string;
  children: React.ReactNode;
}

const badgeVariants: Record<BadgeVariant, string> = {
  default: 'bg-[rgb(var(--color-gray-100))] text-[rgb(var(--color-text-primary))] dark:bg-[rgb(var(--color-gray-800))]',
  praying: 'bg-[rgb(var(--color-status-praying-bg))] text-[rgb(var(--color-status-praying-text))]',
  partial: 'bg-[rgb(var(--color-status-partial-bg))] text-[rgb(var(--color-status-partial-text))]',
  answered: 'bg-[rgb(var(--color-status-answered-bg))] text-[rgb(var(--color-status-answered-text))]',
  success: 'bg-[rgb(var(--color-status-answered-bg))] text-[rgb(var(--color-status-answered-text))]',
  warning: 'bg-[rgb(var(--color-status-partial-bg))] text-[rgb(var(--color-status-partial-text))]',
  info: 'bg-[rgb(var(--color-status-praying-bg))] text-[rgb(var(--color-status-praying-text))]',
  error: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
};

export const Badge = ({ variant = 'default', className, children, ...props }: BadgeProps) => {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center',
        'px-2.5 py-1',
        'rounded-[var(--radius-full)]',
        'text-[var(--font-size-xs)]',
        'font-medium',
        'transition-colors duration-200',
        badgeVariants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

Badge.displayName = 'Badge';
