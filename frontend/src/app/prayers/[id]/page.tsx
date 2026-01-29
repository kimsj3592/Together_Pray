'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import PrayButton from '@/components/PrayButton';
import { api, PrayerItem, PrayerStatus, PrayerUpdate } from '@/lib/api';

const STATUS_LABELS: Record<PrayerStatus, string> = {
  praying: '기도중',
  partial_answer: '부분 응답',
  answered: '응답 완료',
};

const STATUS_COLORS: Record<PrayerStatus, string> = {
  praying: 'bg-blue-100 text-blue-800',
  partial_answer: 'bg-yellow-100 text-yellow-800',
  answered: 'bg-green-100 text-green-800',
};

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600">로딩 중...</div>
      </div>
    );
  }

  if (error || !prayer) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error || '기도제목을 찾을 수 없습니다.'}
          </div>
          <Link href="/groups" className="text-blue-600 hover:text-blue-500">
            ← 그룹 목록으로
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href={`/groups/${prayer.groupId}/prayers`}
            className="text-blue-600 hover:text-blue-500"
          >
            ← {prayer.group?.name || '그룹'} 기도제목으로
          </Link>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      STATUS_COLORS[prayer.status]
                    }`}
                  >
                    {STATUS_LABELS[prayer.status]}
                  </span>
                  {prayer.category && (
                    <span className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600">
                      {prayer.category}
                    </span>
                  )}
                  {prayer.isAnonymous && (
                    <span className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600">
                      익명
                    </span>
                  )}
                </div>
                <h1 className="text-2xl font-bold text-gray-900">{prayer.title}</h1>
              </div>
            </div>

            <div className="prose prose-sm max-w-none mb-6">
              <p className="text-gray-700 whitespace-pre-wrap">{prayer.content}</p>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500 border-t border-gray-200 pt-4 mb-6">
              <div>
                <span className="font-medium">{prayer.author.name}</span>
                <span className="mx-2">·</span>
                <span>{new Date(prayer.createdAt).toLocaleDateString('ko-KR')}</span>
              </div>
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

          {prayer.isAuthor && (
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="relative">
                  <button
                    onClick={() => setShowStatusMenu(!showStatusMenu)}
                    disabled={statusChanging}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-white disabled:opacity-50"
                  >
                    {statusChanging ? '변경 중...' : '상태 변경'}
                  </button>
                  {showStatusMenu && (
                    <div className="absolute left-0 mt-2 w-40 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                      {(Object.keys(STATUS_LABELS) as PrayerStatus[]).map((status) => (
                        <button
                          key={status}
                          onClick={() => handleStatusChange(status)}
                          disabled={prayer.status === status}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 first:rounded-t-md last:rounded-b-md ${
                            prayer.status === status
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'text-gray-700'
                          }`}
                        >
                          {STATUS_LABELS[status]}
                          {prayer.status === status && ' (현재)'}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 hover:bg-red-50"
                >
                  삭제
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Pray Button */}
        <div className="bg-white shadow rounded-lg overflow-hidden mt-6">
          <div className="p-6">
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
        </div>

        {/* Prayer Updates Timeline */}
        <div className="bg-white shadow rounded-lg overflow-hidden mt-6">
          <div className="p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">업데이트 타임라인</h2>

            {/* Update Form - Only for author */}
            {prayer.isAuthor && (
              <form onSubmit={handleSubmitUpdate} className="mb-6">
                <textarea
                  value={newUpdate}
                  onChange={(e) => setNewUpdate(e.target.value)}
                  placeholder="기도제목에 대한 업데이트를 작성해주세요 (최소 5자)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
                  rows={3}
                  disabled={submittingUpdate}
                />
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-gray-500">
                    {newUpdate.length}자 {newUpdate.length < 5 && '(최소 5자 필요)'}
                  </span>
                  <button
                    type="submit"
                    disabled={submittingUpdate || newUpdate.trim().length < 5}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium min-h-[44px]"
                  >
                    {submittingUpdate ? '작성 중...' : '업데이트 작성'}
                  </button>
                </div>
              </form>
            )}

            {/* Updates List */}
            {updatesLoading ? (
              <div className="text-center py-8 text-gray-500 text-sm">로딩 중...</div>
            ) : updates.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm">
                아직 업데이트가 없습니다.
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                {updates.map((update, index) => (
                  <div key={update.id} className="relative">
                    {/* Timeline Line */}
                    {index !== updates.length - 1 && (
                      <div className="absolute left-[7px] top-6 bottom-0 w-0.5 bg-gray-200" />
                    )}

                    {/* Timeline Item */}
                    <div className="flex gap-3 sm:gap-4">
                      {/* Timeline Dot */}
                      <div className="relative flex-shrink-0">
                        <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white ring-2 ring-blue-100 mt-1" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 pb-4 sm:pb-6">
                        <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                          <div className="flex items-start justify-between mb-2 gap-2">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                              <span className="font-medium text-gray-900">
                                {update.author.name}
                              </span>
                              <span className="hidden sm:inline text-gray-400">·</span>
                              <span className="text-gray-500">
                                {new Date(update.createdAt).toLocaleDateString('ko-KR', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })}
                                {' '}
                                {new Date(update.createdAt).toLocaleTimeString('ko-KR', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                            {update.isAuthor && (
                              <button
                                onClick={() => setDeleteUpdateId(update.id)}
                                className="text-red-600 hover:text-red-700 text-xs sm:text-sm font-medium flex-shrink-0 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 flex items-center justify-center sm:block"
                              >
                                삭제
                              </button>
                            )}
                          </div>
                          <p className="text-sm sm:text-base text-gray-700 whitespace-pre-wrap">
                            {update.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Delete Update Confirmation Modal */}
        {deleteUpdateId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                업데이트 삭제
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                이 업데이트를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setDeleteUpdateId(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 min-h-[44px]"
                >
                  취소
                </button>
                <button
                  onClick={handleDeleteUpdate}
                  className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 min-h-[44px]"
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        )}

        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                기도제목 삭제
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                정말로 이 기도제목을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 min-h-[44px]"
                >
                  취소
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 min-h-[44px]"
                >
                  {deleting ? '삭제 중...' : '삭제'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
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
