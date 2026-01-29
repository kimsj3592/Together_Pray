'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import PrayButton from '@/components/PrayButton';
import { api, PrayerItem } from '@/lib/api';

const STATUS_LABELS = {
  praying: '기도중',
  partial_answer: '부분 응답',
  answered: '응답 완료',
};

const STATUS_COLORS = {
  praying: 'bg-blue-100 text-blue-800',
  partial_answer: 'bg-yellow-100 text-yellow-800',
  answered: 'bg-green-100 text-green-800',
};

type TabType = 'my-prayers' | 'prayed-items' | 'profile';

function MyPageContent() {
  const { user, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('my-prayers');
  const [myPrayers, setMyPrayers] = useState<PrayerItem[]>([]);
  const [prayedItems, setPrayedItems] = useState<PrayerItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Profile edit state
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
      alert('이름을 입력해주세요.');
      return;
    }

    try {
      setUpdating(true);
      await api.updateProfile(newName.trim());
      await refreshUser();
      setEditingName(false);
      alert('프로필이 수정되었습니다.');
    } catch (err: any) {
      alert(err.message || '프로필 수정에 실패했습니다.');
    } finally {
      setUpdating(false);
    }
  };

  const renderPrayerCard = (item: PrayerItem) => (
    <div key={item.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
      <Link href={`/prayers/${item.id}`} className="block p-4 sm:p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex-1">
            {item.title}
          </h3>
          <span
            className={`ml-2 px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full text-xs font-medium ${
              STATUS_COLORS[item.status]
            }`}
          >
            {STATUS_LABELS[item.status]}
          </span>
        </div>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.content}</p>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-500 mb-4 gap-2">
          <div className="flex items-center space-x-2 sm:space-x-4">
            {item.group && (
              <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded text-xs">
                {item.group.name}
              </span>
            )}
            {item.category && (
              <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">{item.category}</span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <span className="flex items-center gap-1">
              🙏 {item._count.reactions}회
            </span>
            <span className="text-gray-400">·</span>
            <span>{new Date(item.createdAt).toLocaleDateString('ko-KR')}</span>
          </div>
        </div>
      </Link>
      {activeTab === 'prayed-items' && (
        <div className="px-4 pb-4 sm:px-6">
          <PrayButton
            prayerItemId={item.id}
            initialPrayCount={item._count.reactions}
            initialHasPrayedToday={item.hasPrayedToday}
            size="small"
            onPraySuccess={(newCount) => {
              setPrayedItems((prevItems) =>
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
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/groups" className="text-xl font-bold text-gray-900 hover:text-gray-700">
                Together Pray
              </Link>
            </div>
            <div className="flex items-center">
              <Link
                href="/groups"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                그룹 목록
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl sm:text-2xl font-bold">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{user?.name}</h1>
              <p className="text-sm sm:text-base text-gray-600">{user?.email}</p>
            </div>
          </div>
        </div>

        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-4 sm:space-x-8 overflow-x-auto">
            <button
              onClick={() => handleTabChange('my-prayers')}
              className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'my-prayers'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              내 기도제목
            </button>
            <button
              onClick={() => handleTabChange('prayed-items')}
              className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'prayed-items'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              기도한 기도제목
            </button>
            <button
              onClick={() => handleTabChange('profile')}
              className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'profile'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              프로필 설정
            </button>
          </nav>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {activeTab === 'profile' ? (
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">프로필 정보</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
                <input
                  type="email"
                  value={user?.email}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
                />
                <p className="mt-1 text-xs text-gray-500">이메일은 변경할 수 없습니다.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
                {editingName ? (
                  <form onSubmit={handleUpdateProfile} className="space-y-3">
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="이름을 입력하세요"
                      maxLength={50}
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={updating}
                        className="min-h-[44px] px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {updating ? '저장 중...' : '저장'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingName(false);
                          setNewName(user?.name || '');
                        }}
                        className="min-h-[44px] px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                      >
                        취소
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={user?.name}
                      disabled
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900"
                    />
                    <button
                      onClick={() => {
                        setEditingName(true);
                        setNewName(user?.name || '');
                      }}
                      className="ml-3 min-h-[44px] px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50"
                    >
                      수정
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <>
            {loading ? (
              <div className="text-center py-12 text-gray-500">로딩 중...</div>
            ) : activeTab === 'my-prayers' && myPrayers.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <p className="text-gray-500 mb-4">아직 작성한 기도제목이 없습니다.</p>
                <Link href="/groups" className="text-blue-600 hover:text-blue-500">
                  그룹에서 기도제목을 작성해보세요
                </Link>
              </div>
            ) : activeTab === 'prayed-items' && prayedItems.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <p className="text-gray-500 mb-4">아직 기도한 기도제목이 없습니다.</p>
                <Link href="/groups" className="text-blue-600 hover:text-blue-500">
                  그룹에서 기도제목을 함께 기도해보세요
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {activeTab === 'my-prayers'
                  ? myPrayers.map(renderPrayerCard)
                  : prayedItems.map(renderPrayerCard)}
              </div>
            )}

            {totalPages > 1 && !loading && (
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
          </>
        )}
      </div>
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
