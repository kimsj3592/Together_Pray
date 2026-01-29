'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, Users, UserPlus, Heart, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import EmptyState from '@/components/EmptyState';
import { GroupListSkeleton } from '@/components/Skeleton';
import { api, Group } from '@/lib/api';

function GroupsListPage() {
  const { user } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      setLoading(true);
      const data = await api.getGroups();
      setGroups(data);
    } catch (err: any) {
      setError(err.message || '그룹 목록을 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary pb-20 md:pb-6">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Welcome Section */}
        <div className="mb-6">
          <h2
            className="text-2xl font-bold mb-1"
            style={{ color: 'rgb(var(--color-text-primary))' }}
          >
            안녕하세요, {user?.name}님
          </h2>
          <p style={{ color: 'rgb(var(--color-text-secondary))' }}>
            함께 기도하는 공동체에 오신 것을 환영합니다
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-8">
          <Link href="/groups/create" className="flex-1">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              <span>새 그룹 만들기</span>
            </motion.button>
          </Link>
          <Link href="/groups/join">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-secondary flex items-center gap-2"
            >
              <UserPlus size={20} />
              <span className="hidden sm:inline">그룹 참여</span>
            </motion.button>
          </Link>
        </div>

        {/* Error State */}
        {error && (
          <div
            className="p-4 rounded-xl mb-6"
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              color: 'rgb(var(--color-accent-red))',
            }}
          >
            {error}
          </div>
        )}

        {/* Groups Section */}
        <div className="mb-4">
          <h3
            className="text-lg font-semibold"
            style={{ color: 'rgb(var(--color-text-primary))' }}
          >
            내 그룹
          </h3>
        </div>

        {loading ? (
          <GroupListSkeleton count={3} />
        ) : groups.length === 0 ? (
          <EmptyState
            type="groups"
            actionLabel="새 그룹 만들기"
            actionHref="/groups/create"
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {groups.map((group, index) => {
              const isAdmin = group.members.find((m) => m.userId === user?.id)?.role === 'admin';

              return (
                <motion.div
                  key={group.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={`/groups/${group.id}`}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="card p-5 h-full cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3
                          className="text-lg font-semibold line-clamp-1"
                          style={{ color: 'rgb(var(--color-text-primary))' }}
                        >
                          {group.name}
                        </h3>
                        {isAdmin && (
                          <span className="badge-praying flex items-center gap-1">
                            <Shield size={12} />
                            관리자
                          </span>
                        )}
                      </div>

                      {group.description && (
                        <p
                          className="text-sm mb-4 line-clamp-2"
                          style={{ color: 'rgb(var(--color-text-secondary))' }}
                        >
                          {group.description}
                        </p>
                      )}

                      <div
                        className="flex items-center gap-4 text-sm"
                        style={{ color: 'rgb(var(--color-text-tertiary))' }}
                      >
                        <span className="flex items-center gap-1">
                          <Users size={16} />
                          {group._count?.members || group.members.length}명
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart size={16} />
                          {group._count?.prayerItems || 0}개
                        </span>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}

export default function GroupsPage() {
  return (
    <ProtectedRoute>
      <GroupsListPage />
    </ProtectedRoute>
  );
}
