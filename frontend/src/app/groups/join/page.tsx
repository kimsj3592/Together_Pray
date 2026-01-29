'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { api } from '@/lib/api';

function JoinGroupPage() {
  const router = useRouter();
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const group = await api.joinGroup(inviteCode.trim());
      router.push(`/groups/${group.id}`);
    } catch (err: any) {
      setError(err.message || '그룹 참여에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/groups" className="text-blue-600 hover:text-blue-500">
            ← 그룹 목록으로
          </Link>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">그룹 참여하기</h2>
          <p className="text-gray-600 mb-6 text-sm">
            초대 코드를 입력하여 그룹에 참여하세요
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="inviteCode" className="block text-sm font-medium text-gray-700">
                초대 코드
              </label>
              <input
                id="inviteCode"
                name="inviteCode"
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                placeholder="예: 5fb6597b-b3df-443c-9dd5-d96fc6471ec6"
              />
              <p className="mt-1 text-sm text-gray-500">
                그룹 관리자로부터 받은 초대 코드를 입력하세요
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={loading || !inviteCode.trim()}
                className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? '참여 중...' : '그룹 참여'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function JoinGroup() {
  return (
    <ProtectedRoute>
      <JoinGroupPage />
    </ProtectedRoute>
  );
}
