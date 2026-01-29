'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import { api, PrayerItem, PrayerStatus } from '@/lib/api';

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

  useEffect(() => {
    loadPrayer();
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

            <div className="flex items-center justify-between text-sm text-gray-500 border-t border-gray-200 pt-4">
              <div>
                <span className="font-medium">{prayer.author.name}</span>
                <span className="mx-2">·</span>
                <span>{new Date(prayer.createdAt).toLocaleDateString('ko-KR')}</span>
              </div>
              <div className="flex items-center gap-4">
                <span>기도 {prayer._count.reactions}회</span>
              </div>
            </div>
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

        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                기도제목 삭제
              </h3>
              <p className="text-gray-600 mb-4">
                정말로 이 기도제목을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
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
