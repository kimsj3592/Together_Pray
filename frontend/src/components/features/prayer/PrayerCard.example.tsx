/**
 * PrayerCard Component Examples
 *
 * Demonstrates various usage patterns for PrayerCard and PrayButton components
 */

'use client';

import { useState } from 'react';
import { PrayerCard, PrayerCardSkeleton } from './index';
import { PrayerItem } from '@/lib/api';

// Mock prayer data
const mockPrayer: PrayerItem = {
  id: 'prayer-123',
  groupId: 'group-1',
  title: '취업 준비를 위해 기도해주세요',
  content:
    '이번 달 말까지 서류 합격 결과가 나옵니다. 좋은 결과 있도록 기도 부탁드려요. 하나님의 인도하심을 구합니다.',
  category: '직장',
  status: 'praying',
  isAnonymous: false,
  createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
  updatedAt: new Date().toISOString(),
  isAuthor: false,
  author: {
    id: 'user-1',
    name: '김민수',
  },
  group: {
    id: 'group-1',
    name: '청년부 소그룹',
  },
  hasPrayedToday: false,
  _count: {
    reactions: 12,
    comments: 3,
    updates: 2,
  },
};

const mockPrayerAnonymous: PrayerItem = {
  ...mockPrayer,
  id: 'prayer-456',
  title: '건강 회복을 위한 기도',
  content: '최근 건강 검진에서 좋지 않은 결과가 나왔습니다. 치료 과정이 순조롭게 진행되도록 기도 부탁드립니다.',
  category: '건강',
  isAnonymous: true,
  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  _count: {
    reactions: 25,
    comments: 8,
    updates: 1,
  },
};

const mockPrayerAnswered: PrayerItem = {
  ...mockPrayer,
  id: 'prayer-789',
  title: '가족의 평안을 위한 기도',
  content: '가족 간의 갈등이 해소되고 화목한 관계가 회복되도록 기도했습니다.',
  category: '가족',
  status: 'answered',
  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 1 week ago
  hasPrayedToday: true,
  _count: {
    reactions: 45,
    comments: 15,
    updates: 5,
  },
};

const mockPrayerPartial: PrayerItem = {
  ...mockPrayer,
  id: 'prayer-101',
  title: '시험 합격을 위한 기도',
  content: '자격증 시험 준비 중입니다. 좋은 결과 있도록 기도 부탁드립니다.',
  category: '학업',
  status: 'partial_answer',
  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
  _count: {
    reactions: 18,
    comments: 5,
    updates: 3,
  },
};

export default function PrayerCardExamples() {
  const [prayers, setPrayers] = useState([mockPrayer, mockPrayerAnonymous, mockPrayerAnswered, mockPrayerPartial]);
  const [isLoading, setIsLoading] = useState(false);

  const handlePraySuccess = (prayerId: string) => (newCount: number) => {
    console.log(`Prayer ${prayerId} - New count: ${newCount}`);

    // Update local state optimistically
    setPrayers((prev) =>
      prev.map((p) =>
        p.id === prayerId
          ? {
              ...p,
              hasPrayedToday: true,
              _count: { ...p._count, reactions: newCount },
            }
          : p
      )
    );
  };

  const simulateLoading = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[rgb(var(--color-bg-secondary))] p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-[rgb(var(--color-text-primary))] mb-2">
            PrayerCard Examples
          </h1>
          <p className="text-[rgb(var(--color-text-secondary))]">
            Together Pray v2.0 - Prayer card components with interactive examples
          </p>
        </div>

        {/* Loading Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={simulateLoading}
            className="btn-secondary px-4 py-2 rounded-lg"
          >
            Simulate Loading
          </button>
          {isLoading && (
            <span className="text-[rgb(var(--color-text-tertiary))] text-sm">Loading...</span>
          )}
        </div>

        {/* Default Variant */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-[rgb(var(--color-text-primary))]">
            Default Variant
          </h2>

          {isLoading ? (
            <PrayerCardSkeleton variant="default" count={2} />
          ) : (
            <div className="space-y-4">
              <PrayerCard
                item={mockPrayer}
                onPraySuccess={handlePraySuccess(mockPrayer.id)}
                showGroupName={true}
              />

              <PrayerCard
                item={mockPrayerAnonymous}
                onPraySuccess={handlePraySuccess(mockPrayerAnonymous.id)}
                showGroupName={true}
              />
            </div>
          )}
        </section>

        {/* Compact Variant */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-[rgb(var(--color-text-primary))]">
            Compact Variant
          </h2>

          {isLoading ? (
            <PrayerCardSkeleton variant="compact" count={2} />
          ) : (
            <div className="space-y-3">
              <PrayerCard
                item={mockPrayer}
                onPraySuccess={handlePraySuccess(mockPrayer.id)}
                variant="compact"
              />

              <PrayerCard
                item={mockPrayerPartial}
                onPraySuccess={handlePraySuccess(mockPrayerPartial.id)}
                variant="compact"
              />
            </div>
          )}
        </section>

        {/* Different Status States */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-[rgb(var(--color-text-primary))]">
            Status States
          </h2>

          <div className="space-y-4">
            {/* Praying */}
            <div>
              <p className="text-sm text-[rgb(var(--color-text-tertiary))] mb-2">기도중</p>
              <PrayerCard
                item={mockPrayer}
                onPraySuccess={handlePraySuccess(mockPrayer.id)}
              />
            </div>

            {/* Partial Answer */}
            <div>
              <p className="text-sm text-[rgb(var(--color-text-tertiary))] mb-2">부분 응답</p>
              <PrayerCard
                item={mockPrayerPartial}
                onPraySuccess={handlePraySuccess(mockPrayerPartial.id)}
              />
            </div>

            {/* Answered */}
            <div>
              <p className="text-sm text-[rgb(var(--color-text-tertiary))] mb-2">응답 완료</p>
              <PrayerCard
                item={mockPrayerAnswered}
                onPraySuccess={handlePraySuccess(mockPrayerAnswered.id)}
              />
            </div>
          </div>
        </section>

        {/* Full Content */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-[rgb(var(--color-text-primary))]">
            Full Content (No Truncation)
          </h2>

          <PrayerCard
            item={mockPrayer}
            onPraySuccess={handlePraySuccess(mockPrayer.id)}
            showFullContent={true}
          />
        </section>

        {/* List Rendering */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-[rgb(var(--color-text-primary))]">
            List Rendering
          </h2>

          {isLoading ? (
            <PrayerCardSkeleton variant="default" count={4} />
          ) : (
            <div className="space-y-4">
              {prayers.map((prayer) => (
                <PrayerCard
                  key={prayer.id}
                  item={prayer}
                  onPraySuccess={handlePraySuccess(prayer.id)}
                  showGroupName={true}
                />
              ))}
            </div>
          )}
        </section>

        {/* Interactive States */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-[rgb(var(--color-text-primary))]">
            Interactive States
          </h2>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-[rgb(var(--color-text-tertiary))] mb-2">
                Not prayed yet - Try the long-press interaction!
              </p>
              <PrayerCard
                item={{ ...mockPrayer, hasPrayedToday: false }}
                onPraySuccess={handlePraySuccess(mockPrayer.id)}
              />
            </div>

            <div>
              <p className="text-sm text-[rgb(var(--color-text-tertiary))] mb-2">
                Already prayed today - Button is disabled
              </p>
              <PrayerCard
                item={{ ...mockPrayer, hasPrayedToday: true }}
                onPraySuccess={handlePraySuccess(mockPrayer.id)}
              />
            </div>
          </div>
        </section>

        {/* Edge Cases */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-[rgb(var(--color-text-primary))]">
            Edge Cases
          </h2>

          <div className="space-y-4">
            {/* No reactions yet */}
            <div>
              <p className="text-sm text-[rgb(var(--color-text-tertiary))] mb-2">
                No prayers yet
              </p>
              <PrayerCard
                item={{
                  ...mockPrayer,
                  _count: { reactions: 0, comments: 0, updates: 0 },
                }}
                onPraySuccess={handlePraySuccess(mockPrayer.id)}
              />
            </div>

            {/* No category */}
            <div>
              <p className="text-sm text-[rgb(var(--color-text-tertiary))] mb-2">
                No category tag
              </p>
              <PrayerCard
                item={{ ...mockPrayer, category: null }}
                onPraySuccess={handlePraySuccess(mockPrayer.id)}
              />
            </div>

            {/* Long title and content */}
            <div>
              <p className="text-sm text-[rgb(var(--color-text-tertiary))] mb-2">
                Long content (truncated)
              </p>
              <PrayerCard
                item={{
                  ...mockPrayer,
                  title:
                    '매우 긴 제목입니다. 이렇게 긴 제목도 잘 표시되는지 확인하기 위한 예제입니다.',
                  content:
                    '매우 긴 내용입니다. '.repeat(20) +
                    '이렇게 긴 내용도 잘 잘리는지 확인하기 위한 예제입니다.',
                }}
                onPraySuccess={handlePraySuccess(mockPrayer.id)}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
