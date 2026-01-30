'use client';

import { motion } from 'framer-motion';
import { Heart, Users, FileText, Search, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from './Button';

export type EmptyStateType = 'groups' | 'prayers' | 'answered' | 'search' | 'custom';

export interface EmptyStateProps {
  type: EmptyStateType;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

const EMPTY_STATE_CONFIG: Record<
  Exclude<EmptyStateType, 'custom'>,
  {
    icon: React.ReactNode;
    defaultTitle: string;
    defaultDescription: string;
  }
> = {
  groups: {
    icon: <Users size={56} strokeWidth={1.5} />,
    defaultTitle: '아직 참여한 그룹이 없어요',
    defaultDescription:
      '새 그룹을 만들거나\n초대 코드로 기도 공동체에 참여해보세요!',
  },
  prayers: {
    icon: <Heart size={56} strokeWidth={1.5} />,
    defaultTitle: '아직 기도제목이 없어요',
    defaultDescription: '첫 기도제목을 작성해볼까요?\n함께 기도하는 은혜를 나눠보세요',
  },
  answered: {
    icon: <CheckCircle2 size={56} strokeWidth={1.5} />,
    defaultTitle: '아직 응답된 기도가 없어요',
    defaultDescription:
      '기도가 응답되면 이곳에서\n감사의 기록을 확인할 수 있습니다',
  },
  search: {
    icon: <Search size={56} strokeWidth={1.5} />,
    defaultTitle: '검색 결과가 없어요',
    defaultDescription: '다른 키워드로 검색해보세요',
  },
};

export const EmptyState = ({
  type,
  title,
  description,
  icon,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) => {
  // Get config for non-custom types
  const config = type !== 'custom' ? EMPTY_STATE_CONFIG[type] : null;

  const displayTitle = title || config?.defaultTitle || '';
  const displayDescription = description || config?.defaultDescription || '';
  const displayIcon = icon || config?.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      {/* Icon Container */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          delay: 0.1,
          type: 'spring',
          stiffness: 200,
          damping: 15,
        }}
        className="mb-6 p-6 rounded-full bg-[rgb(var(--color-bg-tertiary))]"
      >
        <div className="text-[rgb(var(--color-text-tertiary))]">{displayIcon}</div>
      </motion.div>

      {/* Title */}
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-[var(--font-size-lg)] font-semibold text-[rgb(var(--color-text-primary))] mb-2"
      >
        {displayTitle}
      </motion.h3>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-[var(--font-size-sm)] text-[rgb(var(--color-text-secondary))] whitespace-pre-line mb-8 max-w-sm leading-relaxed"
      >
        {displayDescription}
      </motion.p>

      {/* Action Button */}
      {actionLabel && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          {actionHref ? (
            <Link href={actionHref}>
              <Button variant="primary" size="lg">
                {actionLabel}
              </Button>
            </Link>
          ) : onAction ? (
            <Button variant="primary" size="lg" onClick={onAction}>
              {actionLabel}
            </Button>
          ) : null}
        </motion.div>
      )}
    </motion.div>
  );
};

EmptyState.displayName = 'EmptyState';
