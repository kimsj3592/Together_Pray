'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';

function HomePage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Together Pray</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">{user?.name}님</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            환영합니다, {user?.name}님!
          </h2>
          <p className="text-gray-600 mb-8">
            Together Pray 기도제목 커뮤니티에 오신 것을 환영합니다
          </p>
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">내 정보</h3>
            <dl className="space-y-2 text-left max-w-md mx-auto">
              <div className="flex justify-between">
                <dt className="text-gray-600">이름:</dt>
                <dd className="font-medium">{user?.name}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">이메일:</dt>
                <dd className="font-medium">{user?.email}</dd>
              </div>
            </dl>
          </div>
          <p className="mt-8 text-gray-500 text-sm">
            Phase 2: 인증 시스템 구현 완료 ✅
          </p>
        </div>
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <ProtectedRoute>
      <HomePage />
    </ProtectedRoute>
  );
}
