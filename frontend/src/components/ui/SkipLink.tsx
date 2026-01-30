'use client';

import { cn } from '@/lib/utils';

export interface SkipLinkProps {
  href?: string;
  children?: React.ReactNode;
  className?: string;
}

/**
 * Skip Link Component
 *
 * Provides a keyboard-accessible link to skip to main content.
 * Invisible until focused, improving keyboard navigation experience.
 */
export const SkipLink = ({
  href = '#main-content',
  children = '본문으로 건너뛰기',
  className,
}: SkipLinkProps) => {
  return (
    <a
      href={href}
      className={cn(
        // Positioning - absolutely positioned at top
        'absolute left-0 top-0 z-[9999]',
        // Styling
        'px-4 py-2',
        'bg-[rgb(var(--color-primary-500))]',
        'text-white',
        'font-medium',
        'rounded-br-md',
        'shadow-lg',
        // Hidden by default, visible on focus
        'opacity-0',
        'pointer-events-none',
        'focus:opacity-100',
        'focus:pointer-events-auto',
        // Smooth transitions
        'transition-opacity duration-150',
        // Focus outline
        'focus:outline-none',
        'focus:ring-2',
        'focus:ring-white',
        'focus:ring-offset-2',
        'focus:ring-offset-[rgb(var(--color-primary-500))]',
        className
      )}
      onClick={(e) => {
        // Smooth scroll to target
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
          // Focus the target element
          (target as HTMLElement).focus();
        }
      }}
    >
      {children}
    </a>
  );
};

SkipLink.displayName = 'SkipLink';
