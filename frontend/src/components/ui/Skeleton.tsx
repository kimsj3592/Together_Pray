'use client';

import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export type SkeletonVariant = 'text' | 'circle' | 'rect';

export interface SkeletonProps extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
  className?: string;
}

export const Skeleton = ({
  variant = 'rect',
  width,
  height,
  className,
  style,
  ...props
}: SkeletonProps) => {
  const variantStyles: Record<SkeletonVariant, string> = {
    text: 'h-4 rounded-[var(--radius-sm)]',
    circle: 'rounded-[var(--radius-full)]',
    rect: 'rounded-[var(--radius-md)]',
  };

  const computedStyle: React.CSSProperties = {
    ...style,
    ...(width && { width: typeof width === 'number' ? `${width}px` : width }),
    ...(height && { height: typeof height === 'number' ? `${height}px` : height }),
  };

  // Set default dimensions for circle
  if (variant === 'circle' && !width && !height) {
    computedStyle.width = '40px';
    computedStyle.height = '40px';
  }

  return (
    <div
      className={cn(
        'bg-[rgb(var(--color-bg-tertiary))]',
        'animate-[shimmer_1.5s_infinite]',
        'bg-gradient-to-r from-[rgb(var(--color-bg-tertiary))] via-[rgb(var(--color-border))] to-[rgb(var(--color-bg-tertiary))]',
        'bg-[length:200%_100%]',
        variantStyles[variant],
        className
      )}
      style={computedStyle}
      {...props}
    />
  );
};

Skeleton.displayName = 'Skeleton';

// Predefined skeleton patterns
export const SkeletonText = ({ lines = 3, className }: { lines?: number; className?: string }) => {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          variant="text"
          width={index === lines - 1 ? '80%' : '100%'}
        />
      ))}
    </div>
  );
};

SkeletonText.displayName = 'SkeletonText';

export const SkeletonCard = ({ className }: { className?: string }) => {
  return (
    <div className={cn('p-4 space-y-3', className)}>
      <div className="flex items-center gap-3">
        <Skeleton variant="circle" width={40} height={40} />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="40%" />
          <Skeleton variant="text" width="60%" />
        </div>
      </div>
      <Skeleton variant="rect" height={80} />
      <div className="flex gap-2">
        <Skeleton variant="rect" width={80} height={32} />
        <Skeleton variant="rect" width={80} height={32} />
      </div>
    </div>
  );
};

SkeletonCard.displayName = 'SkeletonCard';
