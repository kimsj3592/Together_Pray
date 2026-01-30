'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, MessageSquare } from 'lucide-react';
import { PrayerItem, PrayerStatus } from '@/lib/api';
import { cn } from '@/lib/utils';
import { cardHover } from '@/lib/animations';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar, AvatarGroup } from '@/components/ui/Avatar';
import { PrayButton } from './PrayButton';

export interface PrayerCardProps {
  item: PrayerItem;
  onPraySuccess?: (newCount: number) => void;
  showFullContent?: boolean;
  showGroupName?: boolean;
  variant?: 'default' | 'compact';
}

const STATUS_LABELS: Record<PrayerStatus, string> = {
  praying: '기도중',
  partial_answer: '부분 응답',
  answered: '응답 완료',
};

const STATUS_VARIANTS: Record<PrayerStatus, 'praying' | 'partial' | 'answered'> = {
  praying: 'praying',
  partial_answer: 'partial',
  answered: 'answered',
};

const CATEGORY_EMOJI: Record<string, string> = {
  건강: '🏥',
  가족: '👨‍👩‍👧‍👦',
  직장: '💼',
  학업: '📚',
  관계: '🤝',
  영적성장: '✝️',
  재정: '💰',
  기타: '📝',
};

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return '방금 전';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}일 전`;

  return date.toLocaleDateString('ko-KR', {
    month: 'short',
    day: 'numeric',
  });
}

// Mock data for prayed users - in real implementation, fetch from API
const getPrayedUsers = (count: number) => {
  const mockUsers = [
    { name: '김민수', src: undefined },
    { name: '이지은', src: undefined },
    { name: '박서준', src: undefined },
    { name: '최유진', src: undefined },
    { name: '정승호', src: undefined },
  ];
  return mockUsers.slice(0, Math.min(count, 5));
};

export const PrayerCard = ({
  item,
  onPraySuccess,
  showFullContent = false,
  showGroupName = false,
  variant = 'default',
}: PrayerCardProps) => {
  const isCompact = variant === 'compact';
  const updateCount = item._count?.updates || 0;
  const prayCount = item._count.reactions;
  const commentCount = item._count.comments;
  const prayedUsers = getPrayedUsers(prayCount);

  return (
    <motion.div
      variants={cardHover}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      className="w-full"
    >
      <Card className="overflow-hidden">
        {/* Clickable content area */}
        <Link
          href={`/prayers/${item.id}`}
          className="block"
          aria-label={`${item.isAnonymous ? '익명' : item.author.name}님의 기도제목: ${item.title}. ${STATUS_LABELS[item.status]}. ${prayCount}명이 함께 기도하고 있습니다.`}
        >
          {/* Header: Author info + Status badge */}
          <div className={cn('flex items-center justify-between', isCompact ? 'p-3' : 'p-5 pb-4')}>
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Avatar name={item.isAnonymous ? '익명' : item.author.name} size={isCompact ? 'sm' : 'md'} />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p
                    className={cn(
                      'font-medium text-[rgb(var(--color-text-primary))] truncate',
                      isCompact ? 'text-[var(--font-size-sm)]' : 'text-[var(--font-size-base)]'
                    )}
                  >
                    {item.isAnonymous ? '익명' : item.author.name}
                  </p>
                  <span className="text-[rgb(var(--color-text-tertiary))]">•</span>
                  <p
                    className={cn(
                      'text-[rgb(var(--color-text-tertiary))] flex items-center gap-1 flex-shrink-0',
                      'text-[var(--font-size-xs)]'
                    )}
                  >
                    <Clock size={12} />
                    {formatRelativeTime(item.createdAt)}
                  </p>
                </div>

                {/* Group name (optional) */}
                {showGroupName && item.group && (
                  <p className="text-[var(--font-size-xs)] text-[rgb(var(--color-text-tertiary))] truncate mt-0.5">
                    {item.group.name}
                  </p>
                )}
              </div>
            </div>

            <Badge variant={STATUS_VARIANTS[item.status]} className="flex-shrink-0">
              {STATUS_LABELS[item.status]}
            </Badge>
          </div>

          {/* Divider */}
          <div className="mx-5 border-t border-[rgb(var(--color-border))]" />

          {/* Content */}
          <div className={cn('space-y-3', isCompact ? 'p-3 pt-3' : 'p-5 pt-4')}>
            {/* Title */}
            <h3
              className={cn(
                'font-semibold text-[rgb(var(--color-text-primary))] line-clamp-2',
                isCompact ? 'text-[var(--font-size-base)]' : 'text-[var(--font-size-lg)]'
              )}
            >
              {item.title}
            </h3>

            {/* Description */}
            <p
              className={cn(
                'text-[rgb(var(--color-text-secondary))]',
                isCompact ? 'text-[var(--font-size-sm)] line-clamp-2' : 'text-[var(--font-size-base)]',
                showFullContent ? '' : 'line-clamp-3'
              )}
            >
              {item.content}
            </p>

            {/* Meta tags: Category + Updates */}
            <div className="flex items-center gap-2 flex-wrap">
              {item.category && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[var(--radius-md)] bg-[rgb(var(--color-bg-secondary))] text-[rgb(var(--color-text-secondary))] text-[var(--font-size-xs)] font-medium">
                  <span>{CATEGORY_EMOJI[item.category] || '📝'}</span>
                  <span>{item.category}</span>
                </div>
              )}

              {updateCount > 0 && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[var(--radius-md)] bg-[rgb(var(--color-bg-secondary))] text-[rgb(var(--color-text-secondary))] text-[var(--font-size-xs)] font-medium">
                  <span>📅</span>
                  <span>업데이트 {updateCount}개</span>
                </div>
              )}

              {commentCount > 0 && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[var(--radius-md)] bg-[rgb(var(--color-bg-secondary))] text-[rgb(var(--color-text-secondary))] text-[var(--font-size-xs)] font-medium">
                  <MessageSquare size={12} />
                  <span>{commentCount}</span>
                </div>
              )}
            </div>
          </div>
        </Link>

        {/* Footer: Prayer stats + Action button */}
        <div
          className={cn(
            'flex items-center justify-between gap-3 border-t border-[rgb(var(--color-border))]',
            isCompact ? 'px-3 py-2.5' : 'px-5 py-4'
          )}
        >
          {/* Prayer count with avatar group */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {prayCount > 0 ? (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-lg flex-shrink-0">🙏</span>
                  <span className="font-medium text-[rgb(var(--color-text-primary))] text-[var(--font-size-sm)]">
                    {prayCount}명
                  </span>
                  <span className="text-[rgb(var(--color-text-tertiary))] text-[var(--font-size-sm)]">
                    함께 기도
                  </span>
                </div>
                {prayedUsers.length > 0 && <AvatarGroup users={prayedUsers} max={3} size="sm" />}
              </>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-lg flex-shrink-0">🙏</span>
                <span className="text-[rgb(var(--color-text-tertiary))] text-[var(--font-size-sm)]">
                  첫 번째로 기도해주세요
                </span>
              </div>
            )}
          </div>

          {/* Pray button */}
          <div onClick={(e) => e.stopPropagation()}>
            <PrayButton
              prayerItemId={item.id}
              initialPrayCount={prayCount}
              initialHasPrayedToday={item.hasPrayedToday}
              size={isCompact ? 'sm' : 'md'}
              onPraySuccess={onPraySuccess}
            />
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

PrayerCard.displayName = 'PrayerCard';
