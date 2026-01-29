'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, User, Clock, Tag, MoreVertical, Trash2, Edit3, MessageCircle } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import PrayButton from '@/components/PrayButton';
import { api, PrayerItem, PrayerStatus, PrayerUpdate } from '@/lib/api';

const STATUS_LABELS: Record<PrayerStatus, string> = {
  praying: '기도중',
  partial_answer: '부분 응답',
  answered: '응답 완료',
};

const STATUS_CLASSES: Record<PrayerStatus, string> = {
  praying: 'badge-praying',
  partial_answer: 'badge-partial',
  answered: 'badge-answered',
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return `${date.toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
  })} ${date.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  })}`;
}

function PrayerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const prayerId = params.id as string;

  const [prayer, setPrayer] = useState<PrayerItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusChanging, setStatusChanging] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Prayer Updates
  const [updates, setUpdates] = useState<PrayerUpdate[]>([]);
  const [updatesLoading, setUpdatesLoading] = useState(false);
  const [newUpdate, setNewUpdate] = useState('');
  const [submittingUpdate, setSubmittingUpdate] = useState(false);
  const [deleteUpdateId, setDeleteUpdateId] = useState<string | null>(null);

  useEffect(() => {
    loadPrayer();
    loadUpdates();
  }, [prayerId]);

  const loadPrayer = async () => {
    try {
      setLoading(true);
      const data = await api.getPrayerItem(prayerId);
      setPrayer(data);
    } catch (err: any) {
      setError(err.message || '기도제목을 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  const loadUpdates = async () => {
    try {
      setUpdatesLoading(true);
      const data = await api.getPrayerUpdates(prayerId);
      setUpdates(data);
    } catch (err: any) {
      console.error('Failed to load updates:', err);
    } finally {
      setUpdatesLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: PrayerStatus) => {
    if (!prayer || statusChanging) return;

    try {
      setStatusChanging(true);
      const updated = await api.updatePrayerStatus(prayerId, newStatus);
      setPrayer((prev) => (prev ? { ...prev, ...updated } : null));
      setShowStatusMenu(false);
    } catch (err: any) {
      alert(err.message || '상태 변경에 실패했습니다.');
    } finally {
      setStatusChanging(false);
    }
  };

  const handleDelete = async () => {
    if (!prayer || deleting) return;

    try {
      setDeleting(true);
      await api.deletePrayerItem(prayerId);
      router.push(`/groups/${prayer.groupId}/prayers`);
    } catch (err: any) {
      alert(err.message || '삭제에 실패했습니다.');
      setDeleting(false);
    }
  };

  const handleSubmitUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUpdate.trim() || submittingUpdate) return;

    if (newUpdate.trim().length < 5) {
      alert('업데이트 내용은 5자 이상이어야 합니다.');
      return;
    }

    try {
      setSubmittingUpdate(true);
      await api.createPrayerUpdate(prayerId, newUpdate.trim());
      setNewUpdate('');
      await loadUpdates();
    } catch (err: any) {
      alert(err.message || '업데이트 작성에 실패했습니다.');
    } finally {
      setSubmittingUpdate(false);
    }
  };

  const handleDeleteUpdate = async () => {
    if (!deleteUpdateId) return;

    try {
      await api.deletePrayerUpdate(deleteUpdateId);
      setDeleteUpdateId(null);
      await loadUpdates();
    } catch (err: any) {
      alert(err.message || '업데이트 삭제에 실패했습니다.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary">
        <Header title="기도제목" backHref="/groups" backLabel="그룹 목록" />
        <div className="max-w-2xl mx-auto p-4">
          <div className="card p-6 space-y-4">
            <div className="skeleton h-6 w-24 rounded-full" />
            <div className="skeleton h-8 w-3/4" />
            <div className="skeleton h-20 w-full" />
            <div className="skeleton h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !prayer) {
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
            {error || '기도제목을 찾을 수 없습니다.'}
          </div>
          <Link
            href="/groups"
            className="flex items-center gap-2"
            style={{ color: 'rgb(var(--color-accent-blue))' }}
          >
            <ArrowLeft size={18} />
            그룹 목록으로
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary pb-20 md:pb-6">
      <Header
        title={prayer.group?.name || '기도제목'}
        backHref={`/groups/${prayer.groupId}/prayers`}
        backLabel="기도제목 목록"
      />

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Prayer Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card overflow-hidden"
        >
          {/* Header */}
          <div className="p-5">
            {/* Status & Tags */}
            <div className="flex items-center flex-wrap gap-2 mb-4">
              <span className={STATUS_CLASSES[prayer.status]}>
                {STATUS_LABELS[prayer.status]}
              </span>
              {prayer.category && (
                <span
                  className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full"
                  style={{
                    backgroundColor: 'rgb(var(--color-bg-tertiary))',
                    color: 'rgb(var(--color-text-secondary))',
                  }}
                >
                  <Tag size={12} />
                  {prayer.category}
                </span>
              )}
              {prayer.isAnonymous && (
                <span
                  className="text-xs px-2.5 py-1 rounded-full"
                  style={{
                    backgroundColor: 'rgb(var(--color-bg-tertiary))',
                    color: 'rgb(var(--color-text-secondary))',
                  }}
                >
                  익명
                </span>
              )}
            </div>

            {/* Title */}
            <h1
              className="text-xl font-bold mb-4"
              style={{ color: 'rgb(var(--color-text-primary))' }}
            >
              {prayer.title}
            </h1>

            {/* Content */}
            <p
              className="text-base whitespace-pre-wrap mb-6 leading-relaxed"
              style={{ color: 'rgb(var(--color-text-secondary))' }}
            >
              {prayer.content}
            </p>

            {/* Author & Date */}
            <div
              className="flex items-center gap-3 pt-4 border-t"
              style={{ borderColor: 'rgb(var(--color-border))' }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'rgb(var(--color-bg-tertiary))' }}
              >
                <User size={20} style={{ color: 'rgb(var(--color-text-tertiary))' }} />
              </div>
              <div className="flex-1">
                <p
                  className="font-medium text-sm"
                  style={{ color: 'rgb(var(--color-text-primary))' }}
                >
                  {prayer.isAnonymous ? '익명' : prayer.author.name}
                </p>
                <p
                  className="text-xs flex items-center gap-1"
                  style={{ color: 'rgb(var(--color-text-tertiary))' }}
                >
                  <Clock size={12} />
                  {formatDate(prayer.createdAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Pray Button Section */}
          <div
            className="px-5 py-4 flex items-center justify-between border-t"
            style={{
              borderColor: 'rgb(var(--color-border))',
              backgroundColor: 'rgb(var(--color-bg-tertiary))',
            }}
          >
            <div
              className="flex items-center gap-2 text-sm"
              style={{ color: 'rgb(var(--color-text-secondary))' }}
            >
              <span className="text-xl">🙏</span>
              <span className="font-medium">{prayer._count.reactions}명</span>
              <span>함께 기도</span>
            </div>

            <PrayButton
              prayerItemId={prayer.id}
              initialPrayCount={prayer._count.reactions}
              initialHasPrayedToday={prayer.hasPrayedToday}
              size="large"
              onPraySuccess={(newCount) => {
                setPrayer((prev) =>
                  prev
                    ? {
                        ...prev,
                        _count: { ...prev._count, reactions: newCount },
                        hasPrayedToday: true,
                      }
                    : null
                );
              }}
            />
          </div>

          {/* Author Actions */}
          {prayer.isAuthor && (
            <div
              className="px-5 py-4 flex items-center justify-between border-t"
              style={{ borderColor: 'rgb(var(--color-border))' }}
            >
              <div className="relative">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowStatusMenu(!showStatusMenu)}
                  disabled={statusChanging}
                  className="btn-secondary flex items-center gap-2"
                >
                  <Edit3 size={16} />
                  {statusChanging ? '변경 중...' : '상태 변경'}
                </motion.button>

                <AnimatePresence>
                  {showStatusMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute left-0 mt-2 w-40 card shadow-lg z-10 overflow-hidden"
                    >
                      {(Object.keys(STATUS_LABELS) as PrayerStatus[]).map((status) => (
                        <button
                          key={status}
                          onClick={() => handleStatusChange(status)}
                          disabled={prayer.status === status}
                          className="w-full text-left px-4 py-3 text-sm transition-colors"
                          style={{
                            color:
                              prayer.status === status
                                ? 'rgb(var(--color-text-tertiary))'
                                : 'rgb(var(--color-text-primary))',
                            backgroundColor:
                              prayer.status === status
                                ? 'rgb(var(--color-bg-tertiary))'
                                : 'transparent',
                          }}
                        >
                          {STATUS_LABELS[status]}
                          {prayer.status === status && ' (현재)'}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                style={{
                  color: 'rgb(var(--color-accent-red))',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                }}
              >
                <Trash2 size={16} />
                삭제
              </motion.button>
            </div>
          )}
        </motion.div>

        {/* Prayer Updates Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card mt-6 overflow-hidden"
        >
          <div className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <MessageCircle size={20} style={{ color: 'rgb(var(--color-accent-blue))' }} />
              <h2
                className="text-lg font-semibold"
                style={{ color: 'rgb(var(--color-text-primary))' }}
              >
                업데이트 타임라인
              </h2>
            </div>

            {/* Update Form - Only for author */}
            {prayer.isAuthor && (
              <form onSubmit={handleSubmitUpdate} className="mb-6">
                <textarea
                  value={newUpdate}
                  onChange={(e) => setNewUpdate(e.target.value)}
                  placeholder="기도제목에 대한 업데이트를 작성해주세요 (최소 5자)"
                  className="input resize-none"
                  rows={3}
                  disabled={submittingUpdate}
                />
                <div className="mt-3 flex justify-between items-center">
                  <span
                    className="text-xs"
                    style={{ color: 'rgb(var(--color-text-tertiary))' }}
                  >
                    {newUpdate.length}자 {newUpdate.length < 5 && '(최소 5자 필요)'}
                  </span>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={submittingUpdate || newUpdate.trim().length < 5}
                    className="btn-primary disabled:opacity-50"
                  >
                    {submittingUpdate ? '작성 중...' : '업데이트 작성'}
                  </motion.button>
                </div>
              </form>
            )}

            {/* Updates List */}
            {updatesLoading ? (
              <div
                className="text-center py-8 text-sm"
                style={{ color: 'rgb(var(--color-text-tertiary))' }}
              >
                로딩 중...
              </div>
            ) : updates.length === 0 ? (
              <div
                className="text-center py-8 text-sm"
                style={{ color: 'rgb(var(--color-text-tertiary))' }}
              >
                아직 업데이트가 없습니다.
              </div>
            ) : (
              <div className="space-y-4">
                {updates.map((update, index) => (
                  <motion.div
                    key={update.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative"
                  >
                    {/* Timeline Line */}
                    {index !== updates.length - 1 && (
                      <div
                        className="absolute left-[7px] top-6 bottom-0 w-0.5"
                        style={{ backgroundColor: 'rgb(var(--color-border))' }}
                      />
                    )}

                    {/* Timeline Item */}
                    <div className="flex gap-4">
                      {/* Timeline Dot */}
                      <div className="relative flex-shrink-0">
                        <div
                          className="w-4 h-4 rounded-full mt-1"
                          style={{
                            backgroundColor: 'rgb(var(--color-accent-blue))',
                            boxShadow: '0 0 0 3px rgb(var(--color-bg-primary))',
                          }}
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 pb-4">
                        <div
                          className="rounded-xl p-4"
                          style={{ backgroundColor: 'rgb(var(--color-bg-tertiary))' }}
                        >
                          <div className="flex items-start justify-between mb-2 gap-2">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm">
                              <span
                                className="font-medium"
                                style={{ color: 'rgb(var(--color-text-primary))' }}
                              >
                                {update.author?.name || '익명'}
                              </span>
                              <span
                                className="text-xs"
                                style={{ color: 'rgb(var(--color-text-tertiary))' }}
                              >
                                {formatDateTime(update.createdAt)}
                              </span>
                            </div>
                            {update.isAuthor && (
                              <button
                                onClick={() => setDeleteUpdateId(update.id)}
                                className="text-sm font-medium min-h-[44px] min-w-[44px] flex items-center justify-center"
                                style={{ color: 'rgb(var(--color-accent-red))' }}
                              >
                                삭제
                              </button>
                            )}
                          </div>
                          <p
                            className="text-sm whitespace-pre-wrap"
                            style={{ color: 'rgb(var(--color-text-secondary))' }}
                          >
                            {update.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </main>

      <BottomNav groupId={prayer.groupId} />

      {/* Delete Update Confirmation Modal */}
      <AnimatePresence>
        {deleteUpdateId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setDeleteUpdateId(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="card p-6 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3
                className="text-lg font-semibold mb-2"
                style={{ color: 'rgb(var(--color-text-primary))' }}
              >
                업데이트 삭제
              </h3>
              <p
                className="text-sm mb-6"
                style={{ color: 'rgb(var(--color-text-secondary))' }}
              >
                이 업데이트를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
              </p>
              <div className="flex justify-end gap-3">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setDeleteUpdateId(null)}
                  className="btn-secondary"
                >
                  취소
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDeleteUpdate}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-white"
                  style={{ backgroundColor: 'rgb(var(--color-accent-red))' }}
                >
                  삭제
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Prayer Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="card p-6 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3
                className="text-lg font-semibold mb-2"
                style={{ color: 'rgb(var(--color-text-primary))' }}
              >
                기도제목 삭제
              </h3>
              <p
                className="text-sm mb-6"
                style={{ color: 'rgb(var(--color-text-secondary))' }}
              >
                정말로 이 기도제목을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
              </p>
              <div className="flex justify-end gap-3">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowDeleteConfirm(false)}
                  className="btn-secondary"
                >
                  취소
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDelete}
                  disabled={deleting}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-white disabled:opacity-50"
                  style={{ backgroundColor: 'rgb(var(--color-accent-red))' }}
                >
                  {deleting ? '삭제 중...' : '삭제'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function PrayerDetail() {
  return (
    <ProtectedRoute>
      <PrayerDetailPage />
    </ProtectedRoute>
  );
}
