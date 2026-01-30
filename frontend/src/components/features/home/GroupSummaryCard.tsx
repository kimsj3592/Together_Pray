'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronRight, Users, Heart } from 'lucide-react';
import { Card } from '@/components/ui';
import { listItem } from '@/lib/animations';
import { Group } from '@/lib/api';

interface GroupSummaryCardProps {
  groups: Group[];
}

export function GroupSummaryCard({ groups }: GroupSummaryCardProps) {
  const router = useRouter();
  const displayGroups = groups.slice(0, 3);

  if (groups.length === 0) {
    return null;
  }

  return (
    <motion.div variants={listItem} className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2
          className="text-lg font-semibold"
          style={{ color: 'rgb(var(--color-text-primary))' }}
        >
          내 그룹
        </h2>
        {groups.length > 3 && (
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
        {displayGroups.map((group, index) => (
          <motion.div
            key={group.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card
              interactive
              onClick={() => router.push(`/groups/${group.id}`)}
              className="p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3
                    className="font-semibold mb-1"
                    style={{ color: 'rgb(var(--color-text-primary))' }}
                  >
                    🏠 {group.name}
                  </h3>
                  <div
                    className="flex items-center gap-3 text-sm"
                    style={{ color: 'rgb(var(--color-text-tertiary))' }}
                  >
                    <span className="flex items-center gap-1">
                      <Users size={14} />
                      {group._count?.members || group.members.length}명
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart size={14} />
                      기도제목 {group._count?.prayerItems || 0}개
                    </span>
                  </div>
                </div>
                <ChevronRight
                  size={20}
                  style={{ color: 'rgb(var(--color-text-tertiary))' }}
                />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
