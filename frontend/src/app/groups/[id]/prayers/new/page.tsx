'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FileText, Tag, EyeOff } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
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
      <div className="min-h-screen bg-secondary">
        <Header title="기도제목 작성" backHref="/groups" backLabel="그룹 목록" />
        <div className="max-w-2xl mx-auto p-4">
          <div className="card p-6 space-y-4">
            <div className="skeleton h-8 w-1/2" />
            <div className="skeleton h-12 w-full" />
            <div className="skeleton h-32 w-full" />
            <div className="skeleton h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-screen bg-secondary">
        <Header title="오류" backHref="/groups" backLabel="그룹 목록" />
        <div className="max-w-2xl mx-auto p-4">
          <div
            className="p-4 rounded-xl"
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              color: 'rgb(var(--color-accent-red))',
            }}
          >
            {error || '그룹을 찾을 수 없습니다.'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary pb-20 md:pb-6">
      <Header
        title="기도제목 작성"
        backHref={`/groups/${groupId}/prayers`}
        backLabel="기도제목 목록"
      />

      <main className="max-w-2xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6"
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div
              className="p-2.5 rounded-xl"
              style={{ backgroundColor: 'rgb(var(--color-bg-tertiary))' }}
            >
              <FileText size={24} style={{ color: 'rgb(var(--color-accent-blue))' }} />
            </div>
            <div>
              <h1
                className="text-xl font-bold"
                style={{ color: 'rgb(var(--color-text-primary))' }}
              >
                기도제목 작성
              </h1>
              <p
                className="text-sm"
                style={{ color: 'rgb(var(--color-text-secondary))' }}
              >
                {group.name}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 rounded-xl"
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  color: 'rgb(var(--color-accent-red))',
                }}
              >
                {error}
              </motion.div>
            )}

            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium mb-2"
                style={{ color: 'rgb(var(--color-text-primary))' }}
              >
                제목 <span style={{ color: 'rgb(var(--color-accent-red))' }}>*</span>
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="기도제목 제목을 입력하세요"
                className="input"
                required
              />
            </div>

            {/* Content */}
            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium mb-2"
                style={{ color: 'rgb(var(--color-text-primary))' }}
              >
                내용 <span style={{ color: 'rgb(var(--color-accent-red))' }}>*</span>
              </label>
              <textarea
                id="content"
                rows={5}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="기도제목 내용을 자세히 작성해주세요"
                className="input resize-none"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium mb-2"
                style={{ color: 'rgb(var(--color-text-primary))' }}
              >
                <span className="flex items-center gap-2">
                  <Tag size={16} style={{ color: 'rgb(var(--color-text-tertiary))' }} />
                  카테고리
                </span>
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="input"
              >
                <option value="">선택 안함</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Anonymous Toggle */}
            <div
              className="p-4 rounded-xl"
              style={{ backgroundColor: 'rgb(var(--color-bg-tertiary))' }}
            >
              <label className="flex items-start gap-3 cursor-pointer">
                <div className="relative mt-0.5">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div
                    className="w-10 h-6 rounded-full transition-colors peer-checked:bg-blue-500"
                    style={{
                      backgroundColor: isAnonymous
                        ? 'rgb(var(--color-accent-blue))'
                        : 'rgb(var(--color-border))',
                    }}
                  />
                  <div
                    className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4"
                    style={{
                      transform: isAnonymous ? 'translateX(16px)' : 'translateX(0)',
                    }}
                  />
                </div>
                <div className="flex-1">
                  <div
                    className="flex items-center gap-2 font-medium"
                    style={{ color: 'rgb(var(--color-text-primary))' }}
                  >
                    <EyeOff size={16} />
                    익명으로 작성
                  </div>
                  <p
                    className="text-sm mt-1"
                    style={{ color: 'rgb(var(--color-text-tertiary))' }}
                  >
                    다른 그룹 멤버들에게 작성자가 표시되지 않습니다.
                  </p>
                </div>
              </label>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => router.back()}
                className="btn-secondary flex-1"
              >
                취소
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={loading}
                className="btn-primary flex-1 disabled:opacity-50"
              >
                {loading ? '작성 중...' : '작성하기'}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </main>

      <BottomNav groupId={groupId} />
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
