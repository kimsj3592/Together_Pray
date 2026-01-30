/**
 * EXAMPLE PAGE - Prayer List with Search/Filter
 * This file demonstrates complete integration of search, filter, sort, and gestures
 * Copy this pattern to actual prayer list pages
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { SearchFilterBar } from '@/components/features/search';
import { useKeyboardShortcuts, useLongPress } from '@/hooks';
import { haptics } from '@/lib/haptics';
import { Button, Badge } from '@/components/ui';
import { listContainer, listItem } from '@/lib/animations';

// Mock data types
interface Prayer {
  id: string;
  title: string;
  content: string;
  status: 'praying' | 'partial' | 'answered';
  author: string;
  prayerCount: number;
  createdAt: string;
}

export default function ExamplePrayersPage() {
  // State
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('latest');
  const [isLoading, setIsLoading] = useState(false);
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [showNewPrayerSheet, setShowNewPrayerSheet] = useState(false);

  // Refs
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter options
  const filterOptions = [
    { value: 'all', label: '전체', count: 24 },
    { value: 'praying', label: '기도중', count: 12 },
    { value: 'partial', label: '부분응답', count: 5 },
    { value: 'answered', label: '응답완료', count: 7 },
  ];

  // Sort options
  const sortOptions = [
    { value: 'latest', label: '최신순' },
    { value: 'oldest', label: '오래된순' },
    { value: 'most-prayed', label: '기도 많은순' },
    { value: 'updated', label: '업데이트순' },
  ];

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: 'n',
      description: '새 기도제목 작성',
      callback: () => {
        haptics.medium();
        setShowNewPrayerSheet(true);
      },
    },
    {
      key: '/',
      description: '검색 포커스',
      callback: () => {
        haptics.light();
        searchInputRef.current?.focus();
      },
    },
    {
      key: 'Escape',
      description: '바텀시트 닫기',
      callback: () => {
        setShowNewPrayerSheet(false);
      },
    },
  ]);

  // Fetch prayers when filters change
  useEffect(() => {
    const fetchPrayers = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Mock data
        const mockPrayers: Prayer[] = [
          {
            id: '1',
            title: '가족의 건강을 위해',
            content: '가족 모두가 건강하게 지낼 수 있도록 기도해주세요.',
            status: 'praying',
            author: '김철수',
            prayerCount: 12,
            createdAt: '2024-01-28T10:00:00Z',
          },
          {
            id: '2',
            title: '취업을 위한 기도',
            content: '좋은 회사에 취업할 수 있도록 기도 부탁드립니다.',
            status: 'partial',
            author: '이영희',
            prayerCount: 8,
            createdAt: '2024-01-27T15:30:00Z',
          },
          {
            id: '3',
            title: '시험 합격',
            content: '다음 주 시험에 합격할 수 있도록 기도해주세요.',
            status: 'answered',
            author: '박민수',
            prayerCount: 15,
            createdAt: '2024-01-26T09:00:00Z',
          },
        ];

        setPrayers(mockPrayers);
      } catch (error) {
        console.error('Failed to fetch prayers:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrayers();
  }, [search, filter, sort]);

  return (
    <div className="min-h-screen bg-secondary pb-20">
      {/* Header */}
      <div className="bg-primary border-b border-[rgb(var(--color-border))] sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold mb-4">기도제목</h1>

          {/* Search, Filter, Sort */}
          <SearchFilterBar
            searchValue={search}
            onSearchChange={setSearch}
            filterOptions={filterOptions}
            filterValue={filter}
            onFilterChange={setFilter}
            sortOptions={sortOptions}
            sortValue={sort}
            onSortChange={setSort}
            searchLoading={isLoading}
          />
        </div>
      </div>

      {/* Prayer List */}
      <div className="max-w-2xl mx-auto px-4 py-4">
        <motion.div
          variants={listContainer}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          {prayers.map((prayer) => (
            <PrayerCardExample key={prayer.id} prayer={prayer} />
          ))}
        </motion.div>

        {/* Empty state */}
        {prayers.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-secondary">검색 결과가 없습니다</p>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed bottom-20 right-4 z-10"
      >
        <Button
          variant="primary"
          size="lg"
          onClick={() => {
            haptics.medium();
            setShowNewPrayerSheet(true);
          }}
          className="rounded-full w-14 h-14 shadow-lg"
        >
          <Plus size={24} />
        </Button>
      </motion.div>
    </div>
  );
}

/**
 * Example Prayer Card with Long Press
 */
function PrayerCardExample({ prayer }: { prayer: Prayer }) {
  const [showMenu, setShowMenu] = useState(false);

  const longPressHandlers = useLongPress({
    threshold: 500,
    onLongPress: () => {
      haptics.medium();
      setShowMenu(true);
    },
    onPress: () => {
      haptics.light();
      // Navigate to detail page
      console.log('Navigate to:', prayer.id);
    },
  });

  const statusLabels = {
    praying: '기도중',
    partial: '부분 응답',
    answered: '응답 완료',
  };

  return (
    <motion.div
      variants={listItem}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      {...longPressHandlers}
      className="card p-5 cursor-pointer relative"
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-[var(--font-size-base)] mb-1">
            {prayer.title}
          </h3>
          <p className="text-[var(--font-size-xs)] text-secondary">
            {prayer.author}
          </p>
        </div>
        <Badge variant={prayer.status}>{statusLabels[prayer.status]}</Badge>
      </div>

      {/* Content */}
      <p className="text-secondary text-[var(--font-size-sm)] line-clamp-2 mb-3">
        {prayer.content}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between text-[var(--font-size-xs)] text-tertiary">
        <span>🙏 {prayer.prayerCount}명이 기도했어요</span>
        <span>{new Date(prayer.createdAt).toLocaleDateString('ko-KR')}</span>
      </div>

      {/* Context Menu (shown on long press) */}
      {showMenu && (
        <div className="absolute inset-0 bg-black/50 rounded-[var(--radius-md)] flex items-center justify-center">
          <div className="bg-primary rounded-[var(--radius-lg)] p-3 space-y-2">
            <button className="px-4 py-2 text-sm">공유하기</button>
            <button className="px-4 py-2 text-sm">수정하기</button>
            <button className="px-4 py-2 text-sm text-error">삭제하기</button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
