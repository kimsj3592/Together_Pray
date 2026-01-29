'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import { api, PrayerItem, PrayerStatus, Group } from '@/lib/api';

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

  if (error && !group) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
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
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <Link href={`/groups/${groupId}`} className="text-blue-600 hover:text-blue-500">
            ← {group?.name || '그룹'}으로
          </Link>
          <Link
            href={`/groups/${groupId}/prayers/new`}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            + 기도제목 작성
          </Link>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">기도제목</h1>

        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => handleFilterChange('')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              statusFilter === ''
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            전체
          </button>
          {(Object.keys(STATUS_LABELS) as PrayerStatus[]).map((status) => (
            <button
              key={status}
              onClick={() => handleFilterChange(status)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                statusFilter === status
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {STATUS_LABELS[status]}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">로딩 중...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              {statusFilter ? '해당 상태의 기도제목이 없습니다.' : '아직 기도제목이 없습니다.'}
            </p>
            <Link
              href={`/groups/${groupId}/prayers/new`}
              className="text-blue-600 hover:text-blue-500"
            >
              첫 기도제목을 작성해보세요
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <Link
                key={item.id}
                href={`/prayers/${item.id}`}
                className="block bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 flex-1">
                    {item.title}
                  </h3>
                  <span
                    className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      STATUS_COLORS[item.status]
                    }`}
                  >
                    {STATUS_LABELS[item.status]}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {item.content}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span>{item.author.name}</span>
                    {item.category && (
                      <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">
                        {item.category}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-4">
                    <span>기도 {item._count.reactions}회</span>
                    <span>{new Date(item.createdAt).toLocaleDateString('ko-KR')}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-8 flex justify-center items-center space-x-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              이전
            </button>
            <span className="text-sm text-gray-600">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              다음
            </button>
          </div>
        )}
      </div>
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
