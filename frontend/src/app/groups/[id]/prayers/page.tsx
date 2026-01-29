'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, CheckCircle, Filter } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import PrayerCard from '@/components/PrayerCard';
import EmptyState from '@/components/EmptyState';
import { PrayerListSkeleton } from '@/components/Skeleton';
import { api, PrayerItem, PrayerStatus, Group } from '@/lib/api';

const STATUS_LABELS: Record<PrayerStatus | '', string> = {
  '': '전체',
  praying: '기도중',
  partial_answer: '부분 응답',
  answered: '응답 완료',
};

function PrayerListPage() {
  const params = useParams();
  const groupId = params.id as string;

  const [group, setGroup] = useState<Group | null>(null);
  const [items, setItems] = useState<PrayerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState<PrayerStatus | ''>('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadGroup();
  }, [groupId]);

  useEffect(() => {
    loadPrayerItems();
  }, [groupId, statusFilter, page]);

  const loadGroup = async () => {
    try {
      const data = await api.getGroup(groupId);
      setGroup(data);
    } catch (err: any) {
      setError(err.message || '그룹 정보를 불러올 수 없습니다.');
    }
  };

  const loadPrayerItems = async () => {
    try {
      setLoading(true);
      const response = await api.getPrayerItems(groupId, {
        status: statusFilter || undefined,
        page,
        limit: 20,
      });
      setItems(response.items);
      setTotalPages(response.totalPages);
    } catch (err: any) {
      setError(err.message || '기도제목을 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (status: PrayerStatus | '') => {
    setStatusFilter(status);
    setPage(1);
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
            className="p-4 rounded-xl mb-4"
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
        title={group?.name || '기도제목'}
        backHref={`/groups/${groupId}`}
        backLabel={group?.name || '그룹'}
      />

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Filter & Actions */}
        <div className="mb-6 space-y-4">
          {/* Filter Pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {(Object.keys(STATUS_LABELS) as (PrayerStatus | '')[]).map((status) => (
              <motion.button
                key={status}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleFilterChange(status)}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
                  transition-all duration-200
                  ${
                    statusFilter === status
                      ? 'text-white shadow-md'
                      : 'bg-tertiary hover:bg-[rgb(var(--color-border))]'
                  }
                `}
                style={
                  statusFilter === status
                    ? { backgroundColor: 'rgb(var(--color-accent-blue))' }
                    : { color: 'rgb(var(--color-text-secondary))' }
                }
              >
                {STATUS_LABELS[status]}
              </motion.button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Link href={`/groups/${groupId}/prayers/new`} className="flex-1">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <Plus size={20} />
                <span>기도제목 작성</span>
              </motion.button>
            </Link>

            <Link href={`/groups/${groupId}/answered`}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-success flex items-center gap-2"
              >
                <CheckCircle size={20} />
                <span className="hidden sm:inline">응답된 기도</span>
              </motion.button>
            </Link>
          </div>
        </div>

        {/* Prayer List */}
        {loading ? (
          <PrayerListSkeleton count={3} />
        ) : items.length === 0 ? (
          <EmptyState
            type={statusFilter ? 'search' : 'prayers'}
            title={statusFilter ? '해당 상태의 기도제목이 없습니다' : undefined}
            description={statusFilter ? '다른 필터를 선택해보세요' : undefined}
            actionLabel={!statusFilter ? '첫 기도제목 작성하기' : undefined}
            actionHref={!statusFilter ? `/groups/${groupId}/prayers/new` : undefined}
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

export default function PrayerList() {
  return (
    <ProtectedRoute>
      <PrayerListPage />
    </ProtectedRoute>
  );
}
