'use client';

import { motion } from 'framer-motion';
import { Heart, Users, FileText, Search } from 'lucide-react';
import Link from 'next/link';

type EmptyStateType = 'prayers' | 'groups' | 'answered' | 'search';

interface EmptyStateProps {
  type: EmptyStateType;
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

const emptyStateConfig: Record<EmptyStateType, {
  icon: React.ReactNode;
  defaultTitle: string;
  defaultDescription: string;
}> = {
  prayers: {
    icon: <Heart size={48} strokeWidth={1.5} />,
    defaultTitle: '아직 기도제목이 없습니다',
    defaultDescription: '첫 번째 기도제목을 작성하고\n함께 기도하는 은혜를 나눠보세요',
  },
  groups: {
    icon: <Users size={48} strokeWidth={1.5} />,
    defaultTitle: '참여 중인 그룹이 없습니다',
    defaultDescription: '그룹을 만들거나 초대 코드로\n기도 공동체에 참여해보세요',
  },
  answered: {
    icon: <FileText size={48} strokeWidth={1.5} />,
    defaultTitle: '응답된 기도가 없습니다',
    defaultDescription: '기도가 응답되면 이곳에서\n감사의 기록을 확인할 수 있습니다',
  },
  search: {
    icon: <Search size={48} strokeWidth={1.5} />,
    defaultTitle: '검색 결과가 없습니다',
    defaultDescription: '다른 키워드로 검색해보세요',
  },
};

export default function EmptyState({
  type,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  const config = emptyStateConfig[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
        className="mb-6 p-4 rounded-full"
        style={{ backgroundColor: 'rgb(var(--color-bg-tertiary))' }}
      >
        <span style={{ color: 'rgb(var(--color-text-tertiary))' }}>
          {config.icon}
        </span>
      </motion.div>

      <h3
        className="text-lg font-semibold mb-2"
        style={{ color: 'rgb(var(--color-text-primary))' }}
      >
        {title || config.defaultTitle}
      </h3>

      <p
        className="text-sm whitespace-pre-line mb-6 max-w-xs"
        style={{ color: 'rgb(var(--color-text-secondary))' }}
      >
        {description || config.defaultDescription}
      </p>

      {(actionLabel && actionHref) && (
        <Link href={actionHref}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-primary"
          >
            {actionLabel}
          </motion.button>
        </Link>
      )}

      {(actionLabel && onAction && !actionHref) && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onAction}
          className="btn-primary"
        >
          {actionLabel}
        </motion.button>
      )}
    </motion.div>
  );
}
