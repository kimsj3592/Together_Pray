'use client';

import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/utils';

export interface PrayerCardSkeletonProps {
  variant?: 'default' | 'compact';
  count?: number;
}

export const PrayerCardSkeleton = ({ variant = 'default', count = 1 }: PrayerCardSkeletonProps) => {
  const isCompact = variant === 'compact';

  const skeletonCard = (
    <Card className="overflow-hidden">
      {/* Header */}
      <div className={cn('flex items-center justify-between', isCompact ? 'p-3' : 'p-5 pb-4')}>
        <div className="flex items-center gap-3 flex-1">
          <Skeleton variant="circle" width={isCompact ? 32 : 40} height={isCompact ? 32 : 40} />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" width="30%" height={16} />
            <Skeleton variant="text" width="20%" height={12} />
          </div>
        </div>
        <Skeleton variant="rect" width={60} height={24} className="rounded-[var(--radius-full)]" />
      </div>

      {/* Divider */}
      <div className="mx-5 border-t border-[rgb(var(--color-border))]" />

      {/* Content */}
      <div className={cn('space-y-3', isCompact ? 'p-3 pt-3' : 'p-5 pt-4')}>
        <Skeleton variant="text" width="80%" height={isCompact ? 18 : 20} />
        <div className="space-y-2">
          <Skeleton variant="text" width="100%" height={14} />
          <Skeleton variant="text" width="90%" height={14} />
          {!isCompact && <Skeleton variant="text" width="60%" height={14} />}
        </div>

        {/* Meta tags */}
        <div className="flex items-center gap-2">
          <Skeleton variant="rect" width={80} height={28} className="rounded-[var(--radius-md)]" />
          <Skeleton variant="rect" width={100} height={28} className="rounded-[var(--radius-md)]" />
        </div>
      </div>

      {/* Footer */}
      <div
        className={cn(
          'flex items-center justify-between gap-3 border-t border-[rgb(var(--color-border))]',
          isCompact ? 'px-3 py-2.5' : 'px-5 py-4'
        )}
      >
        <div className="flex items-center gap-3">
          <Skeleton variant="text" width={80} height={16} />
          <div className="flex -space-x-2">
            <Skeleton variant="circle" width={24} height={24} />
            <Skeleton variant="circle" width={24} height={24} />
            <Skeleton variant="circle" width={24} height={24} />
          </div>
        </div>
        <Skeleton
          variant="rect"
          width={isCompact ? 80 : 100}
          height={isCompact ? 36 : 44}
          className="rounded-[var(--radius-lg)]"
        />
      </div>
    </Card>
  );

  if (count === 1) {
    return skeletonCard;
  }

  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>{skeletonCard}</div>
      ))}
    </div>
  );
};

PrayerCardSkeleton.displayName = 'PrayerCardSkeleton';
