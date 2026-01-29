'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import PrayButton from '@/components/PrayButton';
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
          <Link href={`/groups/${groupId}/prayers`} className="text-blue-600 hover:text-blue-500">
            ← 기도제목 목록으로
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">응답된 기도</h1>
          <p className="text-gray-600">
            {group?.name && `${group.name} 그룹의 `}응답 완료된 기도제목을 확인하세요
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">로딩 중...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <div className="mb-4">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-gray-500 mb-4">아직 응답된 기도가 없습니다</p>
            <Link
              href={`/groups/${groupId}/prayers`}
              className="text-blue-600 hover:text-blue-500"
            >
              기도제목 목록으로 돌아가기
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <Link href={`/prayers/${item.id}`} className="block p-4 md:p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 flex-1 pr-2">
                      {item.title}
                    </h3>
                    <span className="flex-shrink-0 ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      응답 완료
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {item.content}
                  </p>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-gray-500">
                    <div className="flex items-center space-x-3">
                      <span>{item.author.name}</span>
                      {item.category && (
                        <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">
                          {item.category}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="flex items-center gap-1">
                        🙏 {item._count.reactions}회
                      </span>
                      <span className="text-gray-400">·</span>
                      <span className="text-xs sm:text-sm">
                        응답: {new Date(item.updatedAt).toLocaleDateString('ko-KR')}
                      </span>
                    </div>
                  </div>
                </Link>
                <div className="px-4 md:px-6 pb-4">
                  <PrayButton
                    prayerItemId={item.id}
                    initialPrayCount={item._count.reactions}
                    initialHasPrayedToday={item.hasPrayedToday}
                    size="small"
                    onPraySuccess={(newCount) => {
                      setItems((prevItems) =>
                        prevItems.map((prevItem) =>
                          prevItem.id === item.id
                            ? {
                                ...prevItem,
                                _count: { ...prevItem._count, reactions: newCount },
                                hasPrayedToday: true,
                              }
                            : prevItem
                        )
                      );
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-8 flex justify-center items-center space-x-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="min-h-[44px] px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              이전
            </button>
            <span className="text-sm text-gray-600">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="min-h-[44px] px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              다음
            </button>
          </div>
        )}
      </div>
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
