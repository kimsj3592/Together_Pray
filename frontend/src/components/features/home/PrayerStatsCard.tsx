'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui';
import { listItem } from '@/lib/animations';

interface PrayerStats {
  praying: number;
  partialAnswer: number;
  answered: number;
}

interface PrayerStatsCardProps {
  stats: PrayerStats;
}

export function PrayerStatsCard({ stats }: PrayerStatsCardProps) {
  const router = useRouter();

  const statItems = [
    {
      label: '기도중',
      count: stats.praying,
      emoji: '🙏',
      color: 'rgb(var(--color-info))',
      bgColor: 'rgb(var(--color-status-praying-bg))',
      status: 'praying',
    },
    {
      label: '부분응답',
      count: stats.partialAnswer,
      emoji: '✨',
      color: 'rgb(var(--color-warning))',
      bgColor: 'rgb(var(--color-status-partial-bg))',
      status: 'partial_answer',
    },
    {
      label: '응답완료',
      count: stats.answered,
      emoji: '✅',
      color: 'rgb(var(--color-success))',
      bgColor: 'rgb(var(--color-status-answered-bg))',
      status: 'answered',
    },
  ];

  return (
    <motion.div variants={listItem} className="mb-8">
      <h2
        className="text-lg font-semibold mb-4"
        style={{ color: 'rgb(var(--color-text-primary))' }}
      >
        📊 이번 주 기도 현황
      </h2>

      <Card className="p-5">
        <div className="grid grid-cols-3 gap-4">
          {statItems.map((item) => (
            <motion.button
              key={item.status}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                // Navigate to prayers filtered by status
                // For now, navigate to groups page
                router.push('/groups');
              }}
              className="flex flex-col items-center gap-2 p-3 rounded-xl transition-colors"
              style={{ backgroundColor: item.bgColor }}
            >
              <span className="text-2xl">{item.emoji}</span>
              <span
                className="text-2xl font-bold"
                style={{ color: item.color }}
              >
                {item.count}
              </span>
              <span
                className="text-xs font-medium"
                style={{ color: 'rgb(var(--color-text-secondary))' }}
              >
                {item.label}
              </span>
            </motion.button>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}
