'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Users, Heart, CheckCircle, Copy, Check, Shield, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import { Skeleton } from '@/components/Skeleton';
import { api, Group } from '@/lib/api';

function GroupDetailPage() {
  const params = useParams();
  const { user } = useAuth();
  const groupId = params.id as string;

  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    loadGroup();
  }, [groupId]);

  const loadGroup = async () => {
    try {
      setLoading(true);
      const data = await api.getGroup(groupId);
      setGroup(data);
    } catch (err: any) {
      setError(err.message || '그룹 정보를 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  const copyInviteCode = async () => {
    if (!group) return;

    try {
      await navigator.clipboard.writeText(group.inviteCode);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('복사에 실패했습니다.');
    }
  };

  const isAdmin = group?.members.find((m) => m.userId === user?.id)?.role === 'admin';

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary pb-20 md:pb-6">
        <Header backHref="/groups" backLabel="그룹 목록" />
        <div className="max-w-2xl mx-auto px-4 py-6">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-4 w-full mb-6" />
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
          </div>
          <Skeleton className="h-12 w-full mb-3 rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !group) {
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
            {error || '그룹을 찾을 수 없습니다.'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary pb-20 md:pb-6">
      <Header
        title={group.name}
        backHref="/groups"
        backLabel="그룹 목록"
      />

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Group Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6 mb-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1
                className="text-2xl font-bold mb-2"
                style={{ color: 'rgb(var(--color-text-primary))' }}
              >
                {group.name}
              </h1>
              {isAdmin && (
                <span className="badge-praying flex items-center gap-1 w-fit">
                  <Shield size={12} />
                  관리자
                </span>
              )}
            </div>
          </div>

          {group.description && (
            <p
              className="mb-6"
              style={{ color: 'rgb(var(--color-text-secondary))' }}
            >
              {group.description}
            </p>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div
              className="p-4 rounded-xl text-center"
              style={{ backgroundColor: 'rgb(var(--color-bg-secondary))' }}
            >
              <Users
                size={24}
                className="mx-auto mb-2"
                style={{ color: 'rgb(var(--color-accent-blue))' }}
              />
              <div
                className="text-2xl font-bold"
                style={{ color: 'rgb(var(--color-text-primary))' }}
              >
                {group.members.length}
              </div>
              <div
                className="text-sm"
                style={{ color: 'rgb(var(--color-text-secondary))' }}
              >
                멤버
              </div>
            </div>
            <div
              className="p-4 rounded-xl text-center"
              style={{ backgroundColor: 'rgb(var(--color-bg-secondary))' }}
            >
              <Heart
                size={24}
                className="mx-auto mb-2"
                style={{ color: 'rgb(var(--color-accent-blue))' }}
              />
              <div
                className="text-2xl font-bold"
                style={{ color: 'rgb(var(--color-text-primary))' }}
              >
                {group._count?.prayerItems || 0}
              </div>
              <div
                className="text-sm"
                style={{ color: 'rgb(var(--color-text-secondary))' }}
              >
                기도제목
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link href={`/groups/${groupId}/prayers`}>
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <Heart size={20} />
                기도제목 보기
              </motion.button>
            </Link>
            <Link href={`/groups/${groupId}/answered`}>
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="btn-success w-full flex items-center justify-center gap-2"
              >
                <CheckCircle size={20} />
                응답된 기도 보기
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Invite Code Section (Admin Only) */}
        {isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card p-6 mb-6"
          >
            <h3
              className="text-lg font-semibold mb-3"
              style={{ color: 'rgb(var(--color-text-primary))' }}
            >
              초대 코드
            </h3>
            <div className="flex gap-3">
              <input
                type="text"
                readOnly
                value={group.inviteCode}
                className="input flex-1 font-mono text-center"
              />
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={copyInviteCode}
                className={`btn-primary flex items-center gap-2 ${copySuccess ? 'bg-green-500' : ''}`}
              >
                {copySuccess ? <Check size={20} /> : <Copy size={20} />}
                {copySuccess ? '복사됨' : '복사'}
              </motion.button>
            </div>
            <p
              className="mt-3 text-sm"
              style={{ color: 'rgb(var(--color-text-tertiary))' }}
            >
              이 코드를 공유하여 다른 사람들을 그룹에 초대하세요
            </p>
          </motion.div>
        )}

        {/* Members Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6"
        >
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: 'rgb(var(--color-text-primary))' }}
          >
            멤버 목록
          </h3>
          <div className="space-y-3">
            {group.members.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className="p-4 rounded-xl"
                style={{ backgroundColor: 'rgb(var(--color-bg-secondary))' }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center text-white font-semibold text-lg flex-shrink-0"
                    style={{ backgroundColor: 'rgb(var(--color-accent-blue))' }}
                  >
                    {member.user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="font-medium"
                        style={{ color: 'rgb(var(--color-text-primary))' }}
                      >
                        {member.user.name}
                      </span>
                      {member.role === 'admin' && (
                        <span
                          className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            color: 'rgb(var(--color-accent-blue))',
                          }}
                        >
                          <Shield size={10} />
                          관리자
                        </span>
                      )}
                    </div>
                    <div
                      className="text-sm truncate mt-0.5"
                      style={{ color: 'rgb(var(--color-text-tertiary))' }}
                    >
                      {member.user.email}
                    </div>
                    <div
                      className="text-xs flex items-center gap-1 mt-1"
                      style={{ color: 'rgb(var(--color-text-tertiary))' }}
                    >
                      <Calendar size={12} />
                      {new Date(member.joinedAt).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                      <span>가입</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>

      <BottomNav groupId={groupId} />
    </div>
  );
}

export default function GroupDetail() {
  return (
    <ProtectedRoute>
      <GroupDetailPage />
    </ProtectedRoute>
  );
}
