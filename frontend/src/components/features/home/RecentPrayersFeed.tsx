'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { listItem } from '@/lib/animations';
import { PrayerItem } from '@/lib/api';
import PrayerCard from '@/components/PrayerCard';

interface RecentPrayersFeedProps {
  prayers: PrayerItem[];
}

export function RecentPrayersFeed({ prayers }: RecentPrayersFeedProps) {
  const displayPrayers = prayers.slice(0, 3);

  if (prayers.length === 0) {
    return null;
  }

  return (
    <motion.div variants={listItem} className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2
          className="text-lg font-semibold"
          style={{ color: 'rgb(var(--color-text-primary))' }}
        >
          🔥 기도가 필요해요
        </h2>
        {prayers.length > 3 && (
          <Link
            href="/groups"
            className="flex items-center gap-1 text-sm font-medium"
            style={{ color: 'rgb(var(--color-accent-blue))' }}
          >
            모두 보기
            <ChevronRight size={16} />
          </Link>
        )}
      </div>

      <div className="space-y-3">
        {displayPrayers.map((prayer, index) => (
          <motion.div
            key={prayer.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <PrayerCard item={prayer} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
