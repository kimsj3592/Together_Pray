'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { api, Group } from '@/lib/api';

function GroupDetailPage() {
  const params = useParams();
  const router = useRouter();
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
      alert('복사에 실패했습니다.');
    }
  };

  const isAdmin = group?.members.find((m) => m.userId === user?.id)?.role === 'admin';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600">로딩 중...</div>
      </div>
    );
  }

  if (error || !group) {
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
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/groups" className="text-blue-600 hover:text-blue-500">
            ← 그룹 목록으로
          </Link>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{group.name}</h1>
                {isAdmin && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    관리자
                  </span>
                )}
              </div>
            </div>

            {group.description && (
              <p className="text-gray-600 mb-6">{group.description}</p>
            )}

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-500">멤버 수</div>
                <div className="text-2xl font-bold text-gray-900">
                  {group.members.length}명
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-500">기도제목</div>
                <div className="text-2xl font-bold text-gray-900">
                  {group._count?.prayerItems || 0}개
                </div>
              </div>
            </div>

            <div className="mb-8">
              <Link
                href={`/groups/${groupId}/prayers`}
                className="block w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white text-center font-medium rounded-lg transition-colors"
              >
                기도제목 보기
              </Link>
            </div>

            {isAdmin && (
              <div className="border-t border-gray-200 pt-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">초대 코드</h3>
                <div className="flex items-center space-x-3">
                  <input
                    type="text"
                    readOnly
                    value={group.inviteCode}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 font-mono text-sm"
                  />
                  <button
                    onClick={copyInviteCode}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 whitespace-nowrap"
                  >
                    {copySuccess ? '복사됨 ✓' : '복사'}
                  </button>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  이 코드를 공유하여 다른 사람들을 그룹에 초대하세요
                </p>
              </div>
            )}

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">멤버 목록</h3>
              <div className="space-y-3">
                {group.members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <div className="font-medium text-gray-900">{member.user.name}</div>
                      <div className="text-sm text-gray-500">{member.user.email}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {member.role === 'admin' && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          관리자
                        </span>
                      )}
                      <span className="text-sm text-gray-500">
                        {new Date(member.joinedAt).toLocaleDateString('ko-KR')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
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
