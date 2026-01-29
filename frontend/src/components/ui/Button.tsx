'use client';

import { forwardRef, ButtonHTMLAttributes } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'onAnimationStart' | 'onDrag' | 'onDragEnd' | 'onDragStart'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  className?: string;
  children: React.ReactNode;
}

const buttonVariants: Record<ButtonVariant, string> = {
  primary: 'bg-[rgb(var(--color-primary-500))] text-white hover:bg-[rgb(var(--color-primary-600))] active:bg-[rgb(var(--color-primary-700))] hover:shadow-[var(--shadow-md)]',
  secondary: 'bg-[rgb(var(--color-gray-100))] text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-gray-200))] dark:bg-[rgb(var(--color-gray-800))] dark:hover:bg-[rgb(var(--color-gray-700))]',
  ghost: 'bg-transparent text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-gray-100))] dark:hover:bg-[rgb(var(--color-gray-800))]',
  danger: 'bg-[rgb(var(--color-error))] text-white hover:bg-[rgb(220,38,38)] hover:shadow-[var(--shadow-md)]',
};

const buttonSizes: Record<ButtonSize, string> = {
  sm: 'px-3 py-2 text-[var(--font-size-sm)] min-h-[36px] rounded-[var(--radius-md)]',
  md: 'px-4 py-2.5 text-[var(--font-size-base)] min-h-[44px] rounded-[var(--radius-lg)]',
  lg: 'px-6 py-3 text-[var(--font-size-lg)] min-h-[52px] rounded-[var(--radius-lg)]',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading = false, disabled, className, children, type = 'button', ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        type={type}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.95 }}
        transition={{ duration: 0.1 }}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-all duration-200 ease-in-out',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          buttonVariants[variant],
          buttonSizes[size],
          className
        )}
        {...props}
      >
        {isLoading && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
