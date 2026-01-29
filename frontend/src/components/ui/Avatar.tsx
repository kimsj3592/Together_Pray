'use client';

import { HTMLAttributes, useMemo } from 'react';
import { cn } from '@/lib/utils';

export type AvatarSize = 'sm' | 'md' | 'lg';

export interface AvatarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  src?: string;
  name: string;
  size?: AvatarSize;
  className?: string;
}

const avatarSizes: Record<AvatarSize, string> = {
  sm: 'w-8 h-8 text-[var(--font-size-xs)]',
  md: 'w-10 h-10 text-[var(--font-size-sm)]',
  lg: 'w-12 h-12 text-[var(--font-size-base)]',
};

const getInitials = (name: string): string => {
  const parts = name.trim().split(' ');
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const getColorFromName = (name: string): string => {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-teal-500',
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
};

export const Avatar = ({ src, name, size = 'md', className, ...props }: AvatarProps) => {
  const initials = useMemo(() => getInitials(name), [name]);
  const bgColor = useMemo(() => getColorFromName(name), [name]);

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center',
        'rounded-[var(--radius-full)]',
        'overflow-hidden',
        'flex-shrink-0',
        avatarSizes[size],
        !src && bgColor,
        !src && 'text-white font-medium',
        className
      )}
      {...props}
    >
      {src ? (
        <img
          src={src}
          alt={name}
          className="w-full h-full object-cover"
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
};

Avatar.displayName = 'Avatar';

export interface AvatarGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  users: Array<{ name: string; src?: string }>;
  max?: number;
  size?: AvatarSize;
  className?: string;
}

export const AvatarGroup = ({ users, max = 3, size = 'sm', className, ...props }: AvatarGroupProps) => {
  const displayedUsers = users.slice(0, max);
  const remainingCount = users.length - max;

  return (
    <div
      className={cn('flex items-center -space-x-2', className)}
      {...props}
    >
      {displayedUsers.map((user, index) => (
        <Avatar
          key={index}
          name={user.name}
          src={user.src}
          size={size}
          className="ring-2 ring-[rgb(var(--color-bg-card))]"
        />
      ))}
      {remainingCount > 0 && (
        <div
          className={cn(
            'relative inline-flex items-center justify-center',
            'rounded-[var(--radius-full)]',
            'bg-[rgb(var(--color-gray-200))]',
            'text-[rgb(var(--color-text-secondary))]',
            'font-medium',
            'ring-2 ring-[rgb(var(--color-bg-card))]',
            'dark:bg-[rgb(var(--color-gray-700))]',
            avatarSizes[size]
          )}
        >
          <span className="text-[var(--font-size-xs)]">+{remainingCount}</span>
        </div>
      )}
    </div>
  );
};

AvatarGroup.displayName = 'AvatarGroup';
