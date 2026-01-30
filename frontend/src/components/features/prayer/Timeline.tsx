'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Edit3, Sparkles, CheckCircle2, FileText, Plus } from 'lucide-react';
import { PrayerItem, PrayerUpdate } from '@/lib/api';
import { cn } from '@/lib/utils';
import { listContainer, listItem, slideUp } from '@/lib/animations';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Input';

export interface TimelineProps {
  prayerItem: PrayerItem;
  updates: PrayerUpdate[];
  onAddUpdate?: (content: string) => void;
  canEdit?: boolean;
  sortOrder?: 'asc' | 'desc';
}

type TimelineEventType = 'created' | 'update' | 'status_change' | 'answered';

interface TimelineEvent {
  id: string;
  type: TimelineEventType;
  content?: string;
  timestamp: string;
  author?: {
    id: string | null;
    name: string;
  };
  status?: string;
  isAuthor?: boolean;
}

const EVENT_ICONS: Record<TimelineEventType, React.ReactNode> = {
  created: <FileText size={16} className="text-[rgb(var(--color-text-tertiary))]" />,
  update: <Edit3 size={16} className="text-[rgb(var(--color-info))]" />,
  status_change: <Sparkles size={16} className="text-[rgb(var(--color-warning))]" />,
  answered: <CheckCircle2 size={16} className="text-[rgb(var(--color-success))]" />,
};

const EVENT_COLORS: Record<TimelineEventType, string> = {
  created: 'bg-[rgb(var(--color-gray-300))]',
  update: 'bg-[rgb(var(--color-info))]',
  status_change: 'bg-[rgb(var(--color-warning))]',
  answered: 'bg-[rgb(var(--color-success))]',
};

const STATUS_LABELS: Record<string, string> = {
  praying: '기도중',
  partial_answer: '부분 응답',
  answered: '응답 완료',
};

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return '방금 전';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}일 전`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)}주 전`;

  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatAbsoluteTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export const Timeline = ({
  prayerItem,
  updates,
  onAddUpdate,
  canEdit = false,
  sortOrder = 'desc',
}: TimelineProps) => {
  const [showAddUpdate, setShowAddUpdate] = useState(false);
  const [updateContent, setUpdateContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Build timeline events
  const buildTimelineEvents = (): TimelineEvent[] => {
    const events: TimelineEvent[] = [];

    // Created event
    events.push({
      id: `created-${prayerItem.id}`,
      type: 'created',
      timestamp: prayerItem.createdAt,
      author: prayerItem.author,
    });

    // Update events
    updates.forEach((update) => {
      events.push({
        id: update.id,
        type: 'update',
        content: update.content,
        timestamp: update.createdAt,
        author: update.author,
        isAuthor: update.isAuthor,
      });
    });

    // Status change events (if we have status history, add them)
    // For now, we'll show answered status if present
    if (prayerItem.status === 'answered') {
      events.push({
        id: `status-answered-${prayerItem.id}`,
        type: 'answered',
        status: 'answered',
        timestamp: prayerItem.updatedAt,
        author: prayerItem.author,
      });
    } else if (prayerItem.status === 'partial_answer') {
      events.push({
        id: `status-partial-${prayerItem.id}`,
        type: 'status_change',
        status: 'partial_answer',
        timestamp: prayerItem.updatedAt,
        author: prayerItem.author,
      });
    }

    // Sort events by timestamp
    events.sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    return events;
  };

  const events = buildTimelineEvents();

  const handleAddUpdate = async () => {
    if (!updateContent.trim() || !onAddUpdate) return;

    setIsSubmitting(true);
    try {
      await onAddUpdate(updateContent.trim());
      setUpdateContent('');
      setShowAddUpdate(false);
    } catch (error) {
      console.error('Failed to add update:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderEventContent = (event: TimelineEvent, isLast: boolean) => {
    switch (event.type) {
      case 'created':
        return (
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[var(--font-size-sm)] font-medium text-[rgb(var(--color-text-primary))]">
                기도제목 작성됨
              </span>
              <span className="text-[var(--font-size-xs)] text-[rgb(var(--color-text-tertiary))]">
                {formatRelativeTime(event.timestamp)}
              </span>
            </div>
            <p className="text-[var(--font-size-xs)] text-[rgb(var(--color-text-tertiary))]">
              {event.author?.name}님이 작성
            </p>
          </div>
        );

      case 'update':
        return (
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[var(--font-size-sm)] font-medium text-[rgb(var(--color-info))]">
                기도 업데이트
              </span>
              <span className="text-[var(--font-size-xs)] text-[rgb(var(--color-text-tertiary))]">
                {formatRelativeTime(event.timestamp)}
              </span>
            </div>
            <div className="mt-2 p-3 rounded-[var(--radius-md)] bg-[rgb(var(--color-bg-secondary))]">
              <p className="text-[var(--font-size-sm)] text-[rgb(var(--color-text-primary))] whitespace-pre-wrap">
                {event.content}
              </p>
              {event.author && (
                <p className="mt-2 text-[var(--font-size-xs)] text-[rgb(var(--color-text-tertiary))]">
                  - {event.author.name}
                </p>
              )}
            </div>
          </div>
        );

      case 'status_change':
        return (
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[var(--font-size-sm)] font-medium text-[rgb(var(--color-warning))]">
                ✨ 부분 응답
              </span>
              <span className="text-[var(--font-size-xs)] text-[rgb(var(--color-text-tertiary))]">
                {formatRelativeTime(event.timestamp)}
              </span>
            </div>
            <p className="text-[var(--font-size-xs)] text-[rgb(var(--color-text-secondary))]">
              기도 응답의 시작을 경험하고 있습니다
            </p>
          </div>
        );

      case 'answered':
        return (
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[var(--font-size-sm)] font-medium text-[rgb(var(--color-success))]">
                ✅ 응답 완료
              </span>
              <span className="text-[var(--font-size-xs)] text-[rgb(var(--color-text-tertiary))]">
                {formatRelativeTime(event.timestamp)}
              </span>
            </div>
            <div className="p-3 rounded-[var(--radius-md)] bg-[rgb(var(--color-status-answered-bg))] border border-[rgb(var(--color-success))]">
              <p className="text-[var(--font-size-sm)] font-medium text-[rgb(var(--color-status-answered-text))]">
                🎉 감사합니다! 기도가 응답되었습니다
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Add Update button */}
      {canEdit && onAddUpdate && (
        <div className="flex items-center justify-between pb-4 border-b border-[rgb(var(--color-border))]">
          <h3 className="text-[var(--font-size-lg)] font-semibold text-[rgb(var(--color-text-primary))]">
            타임라인
          </h3>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowAddUpdate(!showAddUpdate)}
            className="flex items-center gap-1.5"
          >
            <Plus size={16} />
            업데이트 추가
          </Button>
        </div>
      )}

      {/* Add Update Form */}
      <AnimatePresence>
        {showAddUpdate && (
          <motion.div
            variants={slideUp}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-3 p-4 rounded-[var(--radius-lg)] bg-[rgb(var(--color-bg-secondary))]"
          >
            <Textarea
              placeholder="기도 응답 소식이나 진행 상황을 공유해주세요..."
              value={updateContent}
              onChange={(e) => setUpdateContent(e.target.value)}
              rows={3}
              className="w-full"
            />
            <div className="flex items-center justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setShowAddUpdate(false)}>
                취소
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleAddUpdate}
                isLoading={isSubmitting}
                disabled={!updateContent.trim()}
              >
                업데이트 추가
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Timeline */}
      <motion.div
        variants={listContainer}
        initial="hidden"
        animate="visible"
        className="relative space-y-6"
      >
        {events.map((event, index) => {
          const isLast = index === events.length - 1;
          return (
            <motion.div key={event.id} variants={listItem} className="relative flex gap-4">
              {/* Vertical line */}
              {!isLast && (
                <div className="absolute left-[11px] top-[28px] bottom-[-24px] w-[2px] bg-[rgb(var(--color-border))]" />
              )}

              {/* Icon dot */}
              <div className="relative flex-shrink-0">
                <div
                  className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center',
                    'border-2 border-[rgb(var(--color-bg-card))]',
                    EVENT_COLORS[event.type]
                  )}
                >
                  {EVENT_ICONS[event.type]}
                </div>
              </div>

              {/* Content */}
              {renderEventContent(event, isLast)}
            </motion.div>
          );
        })}
      </motion.div>

      {/* Empty state */}
      {events.length === 1 && events[0].type === 'created' && (
        <div className="text-center py-8">
          <p className="text-[var(--font-size-sm)] text-[rgb(var(--color-text-tertiary))]">
            아직 업데이트가 없습니다
            {canEdit && <br />}
            {canEdit && '첫 번째 업데이트를 추가해보세요'}
          </p>
        </div>
      )}
    </div>
  );
};

Timeline.displayName = 'Timeline';
