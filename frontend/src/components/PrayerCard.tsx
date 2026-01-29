'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { User, Clock, Tag } from 'lucide-react';
import PrayButton from './PrayButton';
import { PrayerItem, PrayerStatus } from '@/lib/api';

const STATUS_LABELS: Record<PrayerStatus, string> = {
  praying: '기도중',
  partial_answer: '부분 응답',
  answered: '응답 완료',
};

const STATUS_CLASSES: Record<PrayerStatus, string> = {
  praying: 'badge-praying',
  partial_answer: 'badge-partial',
  answered: 'badge-answered',
};

interface PrayerCardProps {
  item: PrayerItem;
  onPraySuccess?: (newCount: number) => void;
  showFullContent?: boolean;
}

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

export default function PrayerCard({
  item,
  onPraySuccess,
  showFullContent = false,
}: PrayerCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="card overflow-hidden"
    >
      <Link href={`/prayers/${item.id}`} className="block p-5">
        {/* Author & Time Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'rgb(var(--color-bg-tertiary))' }}
            >
              <User size={20} style={{ color: 'rgb(var(--color-text-tertiary))' }} />
            </div>
            <div>
              <p
                className="font-medium text-sm"
                style={{ color: 'rgb(var(--color-text-primary))' }}
              >
                {item.isAnonymous ? '익명' : item.author.name}
              </p>
              <p
                className="text-xs flex items-center gap-1"
                style={{ color: 'rgb(var(--color-text-tertiary))' }}
              >
                <Clock size={12} />
                {formatRelativeTime(item.createdAt)}
              </p>
            </div>
          </div>

          <span className={STATUS_CLASSES[item.status]}>
            {STATUS_LABELS[item.status]}
          </span>
        </div>

        {/* Title */}
        <h3
          className="text-base font-semibold mb-2"
          style={{ color: 'rgb(var(--color-text-primary))' }}
        >
          {item.title}
        </h3>

        {/* Content */}
        <p
          className={`text-sm mb-4 ${showFullContent ? '' : 'line-clamp-3'}`}
          style={{ color: 'rgb(var(--color-text-secondary))' }}
        >
          {item.content}
        </p>

        {/* Category Tag */}
        {item.category && (
          <div className="flex items-center gap-1 mb-4">
            <Tag size={14} style={{ color: 'rgb(var(--color-text-tertiary))' }} />
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: 'rgb(var(--color-bg-tertiary))',
                color: 'rgb(var(--color-text-secondary))',
              }}
            >
              {item.category}
            </span>
          </div>
        )}
      </Link>

      {/* Action Footer */}
      <div
        className="px-5 py-4 flex items-center justify-between border-t"
        style={{ borderColor: 'rgb(var(--color-border))' }}
      >
        <div
          className="flex items-center gap-1 text-sm"
          style={{ color: 'rgb(var(--color-text-secondary))' }}
        >
          <span className="text-lg">🙏</span>
          <span className="font-medium">{item._count.reactions}명</span>
          <span>함께 기도</span>
        </div>

        <PrayButton
          prayerItemId={item.id}
          initialPrayCount={item._count.reactions}
          initialHasPrayedToday={item.hasPrayedToday}
          size="small"
          onPraySuccess={onPraySuccess}
        />
      </div>
    </motion.div>
  );
}
