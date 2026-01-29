'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import { api, Group } from '@/lib/api';

const CATEGORIES = [
  '개인',
  '가족',
  '건강',
  '학업/직장',
  '관계',
  '신앙',
  '감사',
  '기타',
];

function CreatePrayerPage() {
  const params = useParams();
  const router = useRouter();
  const groupId = params.id as string;

  const [group, setGroup] = useState<Group | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadGroup();
  }, [groupId]);

  const loadGroup = async () => {
    try {
      const data = await api.getGroup(groupId);
      setGroup(data);
    } catch (err: any) {
      setError(err.message || '그룹 정보를 불러올 수 없습니다.');
    } finally {
      setPageLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (title.length < 2) {
      setError('제목은 2자 이상이어야 합니다.');
      return;
    }

    if (content.length < 5) {
      setError('내용은 5자 이상이어야 합니다.');
      return;
    }

    try {
      setLoading(true);
      const prayerItem = await api.createPrayerItem({
        groupId,
        title,
        content,
        category: category || undefined,
        isAnonymous,
      });
      router.push(`/prayers/${prayerItem.id}`);
    } catch (err: any) {
      setError(err.message || '기도제목 작성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600">로딩 중...</div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error || '그룹을 찾을 수 없습니다.'}
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
      <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href={`/groups/${groupId}/prayers`}
            className="text-blue-600 hover:text-blue-500"
          >
            ← 기도제목 목록으로
          </Link>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">기도제목 작성</h1>
          <p className="text-gray-500 mb-6">{group.name}</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                제목 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="기도제목 제목을 입력하세요"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                내용 <span className="text-red-500">*</span>
              </label>
              <textarea
                id="content"
                rows={5}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="기도제목 내용을 자세히 작성해주세요"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                카테고리
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">선택 안함</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isAnonymous"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="isAnonymous"
                className="ml-2 block text-sm text-gray-700"
              >
                익명으로 작성
              </label>
            </div>
            {isAnonymous && (
              <p className="text-sm text-gray-500 -mt-4">
                다른 그룹 멤버들에게 작성자가 표시되지 않습니다.
              </p>
            )}

            <div className="flex justify-end space-x-3">
              <Link
                href={`/groups/${groupId}/prayers`}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                취소
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '작성 중...' : '작성하기'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function CreatePrayer() {
  return (
    <ProtectedRoute>
      <CreatePrayerPage />
    </ProtectedRoute>
  );
}
