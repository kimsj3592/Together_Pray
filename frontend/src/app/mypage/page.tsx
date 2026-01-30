'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, FileText, Settings, Edit2, Check, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import PrayerCard from '@/components/PrayerCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { PrayerListSkeleton } from '@/components/Skeleton';
import { api, PrayerItem } from '@/lib/api';

type TabType = 'my-prayers' | 'prayed-items' | 'profile';

const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
  { id: 'my-prayers', label: '내 기도제목', icon: <FileText size={18} /> },
  { id: 'prayed-items', label: '기도한 기도제목', icon: <Heart size={18} /> },
  { id: 'profile', label: '프로필 설정', icon: <Settings size={18} /> },
];

function MyPageContent() {
  const { user, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('my-prayers');
  const [myPrayers, setMyPrayers] = useState<PrayerItem[]>([]);
  const [prayedItems, setPrayedItems] = useState<PrayerItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState(user?.name || '');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (activeTab === 'my-prayers') {
      loadMyPrayers();
    } else if (activeTab === 'prayed-items') {
      loadPrayedItems();
    }
  }, [activeTab, page]);

  const loadMyPrayers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.getMyPrayerItems(page, 20);
      setMyPrayers(response.items);
      setTotalPages(response.totalPages);
    } catch (err: any) {
      setError(err.message || '내 기도제목을 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  const loadPrayedItems = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.getMyPrayedItems(page, 20);
      setPrayedItems(response.items);
      setTotalPages(response.totalPages);
    } catch (err: any) {
      setError(err.message || '기도한 기도제목을 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setPage(1);
    setError('');
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newName.trim()) {
      return;
    }

    try {
      setUpdating(true);
      await api.updateProfile(newName.trim());
      await refreshUser();
      setEditingName(false);
    } catch (err: any) {
      console.error(err.message || '프로필 수정에 실패했습니다.');
    } finally {
      setUpdating(false);
    }
  };

  const handlePraySuccess = (itemId: string, newCount: number) => {
    setPrayedItems((prevItems) =>
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

  return (
    <div className="min-h-screen bg-secondary pb-20 md:pb-6">
      <Header title="마이페이지" />

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6 mb-6"
        >
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold"
              style={{ backgroundColor: 'rgb(var(--color-accent-blue))' }}
            >
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1
                className="text-xl font-bold"
                style={{ color: 'rgb(var(--color-text-primary))' }}
              >
                {user?.name}
              </h1>
              <p
                className="text-sm"
                style={{ color: 'rgb(var(--color-text-secondary))' }}
              >
                {user?.email}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <div className="mb-6 overflow-x-auto scrollbar-hide">
          <div
            className="flex gap-1 p-1 rounded-xl"
            style={{ backgroundColor: 'rgb(var(--color-bg-tertiary))' }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`
                  flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg
                  text-sm font-medium whitespace-nowrap transition-all duration-200
                  ${activeTab === tab.id ? 'card shadow-sm' : ''}
                `}
                style={
                  activeTab === tab.id
                    ? { color: 'rgb(var(--color-accent-blue))' }
                    : { color: 'rgb(var(--color-text-secondary))' }
                }
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-4 rounded-xl mb-6"
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              color: 'rgb(var(--color-accent-red))',
            }}
          >
            {error}
          </motion.div>
        )}

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'profile' ? (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="card p-6"
            >
              <h2
                className="text-lg font-semibold mb-6"
                style={{ color: 'rgb(var(--color-text-primary))' }}
              >
                프로필 정보
              </h2>

              <div className="space-y-6">
                {/* Email (readonly) */}
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: 'rgb(var(--color-text-primary))' }}
                  >
                    이메일
                  </label>
                  <input
                    type="email"
                    value={user?.email}
                    disabled
                    className="input opacity-60"
                  />
                  <p
                    className="mt-1 text-xs"
                    style={{ color: 'rgb(var(--color-text-tertiary))' }}
                  >
                    이메일은 변경할 수 없습니다
                  </p>
                </div>

                {/* Name (editable) */}
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: 'rgb(var(--color-text-primary))' }}
                  >
                    이름
                  </label>
                  {editingName ? (
                    <form onSubmit={handleUpdateProfile} className="space-y-3">
                      <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="input"
                        placeholder="이름을 입력하세요"
                        maxLength={50}
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          type="submit"
                          disabled={updating}
                          className="btn-primary flex items-center gap-2"
                        >
                          <Check size={18} />
                          {updating ? '저장 중...' : '저장'}
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          type="button"
                          onClick={() => {
                            setEditingName(false);
                            setNewName(user?.name || '');
                          }}
                          className="btn-secondary flex items-center gap-2"
                        >
                          <X size={18} />
                          취소
                        </motion.button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={user?.name}
                        disabled
                        className="input flex-1"
                      />
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setEditingName(true);
                          setNewName(user?.name || '');
                        }}
                        className="btn-secondary flex items-center gap-2"
                      >
                        <Edit2 size={18} />
                        수정
                      </motion.button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {loading ? (
                <PrayerListSkeleton count={3} />
              ) : activeTab === 'my-prayers' && myPrayers.length === 0 ? (
                <EmptyState
                  type="prayers"
                  title="아직 작성한 기도제목이 없습니다"
                  description="그룹에서 첫 기도제목을 작성해보세요"
                  actionLabel="그룹으로 이동"
                  actionHref="/groups"
                />
              ) : activeTab === 'prayed-items' && prayedItems.length === 0 ? (
                <EmptyState
                  type="prayers"
                  title="아직 기도한 기도제목이 없습니다"
                  description="그룹에서 다른 사람의 기도제목을 함께 기도해보세요"
                  actionLabel="그룹으로 이동"
                  actionHref="/groups"
                />
              ) : (
                <div className="space-y-4">
                  {(activeTab === 'my-prayers' ? myPrayers : prayedItems).map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <PrayerCard
                        item={item}
                        onPraySuccess={
                          activeTab === 'prayed-items'
                            ? (newCount) => handlePraySuccess(item.id, newCount)
                            : undefined
                        }
                      />
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && !loading && (
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
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <BottomNav />
    </div>
  );
}

export default function MyPage() {
  return (
    <ProtectedRoute>
      <MyPageContent />
    </ProtectedRoute>
  );
}
