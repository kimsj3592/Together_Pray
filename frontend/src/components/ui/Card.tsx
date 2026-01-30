'use client';

import { forwardRef, HTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { unifiedCardInteraction } from '@/lib/animations';

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'onAnimationStart' | 'onDrag' | 'onDragEnd' | 'onDragStart'> {
  interactive?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ interactive = false, className, children, onClick, ...props }, ref) => {
    if (interactive || onClick) {
      return (
        <motion.div
          ref={ref}
          {...unifiedCardInteraction}
          onClick={onClick}
          className={cn(
            'bg-[rgb(var(--color-bg-card))]',
            'rounded-[var(--radius-md)]',
            'shadow-[var(--shadow-sm)]',
            'transition-all duration-200 ease-in-out',
            'hover:shadow-[var(--shadow-md)]',
            interactive || onClick ? 'cursor-pointer' : '',
            className
          )}
          {...props}
        >
          {children}
        </motion.div>
      );
    }

    return (
      <div
        ref={ref}
        onClick={onClick}
        className={cn(
          'bg-[rgb(var(--color-bg-card))]',
          'rounded-[var(--radius-md)]',
          'shadow-[var(--shadow-sm)]',
          'transition-all duration-200 ease-in-out',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
