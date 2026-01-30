'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import PrayerCard from '@/components/PrayerCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { PrayerListSkeleton } from '@/components/Skeleton';
import { api, PrayerItem, Group } from '@/lib/api';

function AnsweredPrayersPage() {
  const params = useParams();
  const groupId = params.id as string;

  const [group, setGroup] = useState<Group | null>(null);
  const [items, setItems] = useState<PrayerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadGroup();
  }, [groupId]);

  useEffect(() => {
    loadAnsweredPrayers();
  }, [groupId, page]);

  const loadGroup = async () => {
    try {
      const data = await api.getGroup(groupId);
      setGroup(data);
    } catch (err: any) {
      setError(err.message || '그룹 정보를 불러올 수 없습니다.');
    }
  };

  const loadAnsweredPrayers = async () => {
    try {
      setLoading(true);
      const response = await api.getPrayerItems(groupId, {
        status: 'answered',
        page,
        limit: 20,
      });
      setItems(response.items);
      setTotalPages(response.totalPages);
    } catch (err: any) {
      setError(err.message || '응답된 기도를 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handlePraySuccess = (itemId: string, newCount: number) => {
    setItems((prevItems) =>
      prevItems.map((prevItem) =>
        prevItem.id === itemId
          ? {
              ...prevItem,
              _count: { ...prevItem._count, reactions: newCount },
              hasPrayedToday: true,
            }
          : prevItem
      )
    );
  };

  if (error && !group) {
    return (
      <div className="min-h-screen bg-secondary">
        <Header title="오류" backHref="/groups" backLabel="그룹 목록" />
        <div className="max-w-2xl mx-auto p-4">
          <div
            className="p-4 rounded-xl"
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              color: 'rgb(var(--color-accent-red))',
            }}
          >
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary pb-20 md:pb-6">
      <Header
        title="응답된 기도"
        backHref={`/groups/${groupId}/prayers`}
        backLabel="기도제목"
      />

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div
              className="p-2 rounded-full"
              style={{ backgroundColor: 'rgb(var(--color-status-answered-bg))' }}
            >
              <CheckCircle
                size={24}
                style={{ color: 'rgb(var(--color-accent-green))' }}
              />
            </div>
            <h1
              className="text-2xl font-bold"
              style={{ color: 'rgb(var(--color-text-primary))' }}
            >
              응답된 기도
            </h1>
          </div>
          <p style={{ color: 'rgb(var(--color-text-secondary))' }}>
            {group?.name && `${group.name} 그룹의 `}응답 완료된 기도제목을 확인하세요
          </p>
        </motion.div>

        {/* Prayer List */}
        {loading ? (
          <PrayerListSkeleton count={3} />
        ) : items.length === 0 ? (
          <EmptyState
            type="answered"
            actionLabel="기도제목 목록으로"
            actionHref={`/groups/${groupId}/prayers`}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <PrayerCard
                  item={item}
                  onPraySuccess={(newCount) => handlePraySuccess(item.id, newCount)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center items-center gap-4">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn-secondary disabled:opacity-50"
            >
              이전
            </motion.button>
            <span
              className="text-sm font-medium"
              style={{ color: 'rgb(var(--color-text-secondary))' }}
            >
              {page} / {totalPages}
            </span>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="btn-secondary disabled:opacity-50"
            >
              다음
            </motion.button>
          </div>
        )}
      </main>

      <BottomNav groupId={groupId} />
    </div>
  );
}

export default function AnsweredPrayers() {
  return (
    <ProtectedRoute>
      <AnsweredPrayersPage />
    </ProtectedRoute>
  );
}
