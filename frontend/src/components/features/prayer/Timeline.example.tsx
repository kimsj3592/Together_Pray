/**
 * Timeline Component Examples
 *
 * Demonstrates usage patterns for the Timeline component
 * in different contexts and states.
 */

'use client';

import { Timeline } from './Timeline';
import { PrayerItem, PrayerUpdate } from '@/lib/api';

// Mock data for examples
const mockPrayerItem: PrayerItem = {
  id: '1',
  groupId: 'group-1',
  title: '취업을 위한 기도',
  content: '좋은 직장을 구할 수 있도록 기도해주세요',
  category: '직장',
  status: 'praying',
  isAnonymous: false,
  createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
  updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  isAuthor: true,
  author: {
    id: 'user-1',
    name: '김민수',
  },
  _count: {
    reactions: 5,
    comments: 2,
    updates: 2,
  },
};

const mockUpdates: PrayerUpdate[] = [
  {
    id: 'update-1',
    content: '면접을 보게 되었습니다. 잘 준비할 수 있도록 기도해주세요.',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    author: {
      id: 'user-1',
      name: '김민수',
    },
    isAuthor: true,
  },
  {
    id: 'update-2',
    content: '1차 면접을 통과했습니다! 2차 면접을 위해 기도 부탁드립니다.',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    author: {
      id: 'user-1',
      name: '김민수',
    },
    isAuthor: true,
  },
];

const mockAnsweredPrayerItem: PrayerItem = {
  ...mockPrayerItem,
  id: '2',
  status: 'answered',
  updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
};

const mockPartialAnswerPrayerItem: PrayerItem = {
  ...mockPrayerItem,
  id: '3',
  status: 'partial_answer',
  updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
};

export default function TimelineExamples() {
  const handleAddUpdate = async (content: string) => {
    console.log('Adding update:', content);
    // In real implementation, call API
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-12 bg-[rgb(var(--color-bg-secondary))] min-h-screen">
      <h1 className="text-3xl font-bold text-[rgb(var(--color-text-primary))]">
        Timeline Examples
      </h1>

      {/* Example 1: Basic Timeline with Updates */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-[rgb(var(--color-text-primary))] mb-2">
            1. Basic Timeline
          </h2>
          <p className="text-[var(--font-size-sm)] text-[rgb(var(--color-text-secondary))]">
            Timeline with prayer creation and updates
          </p>
        </div>
        <div className="p-6 bg-[rgb(var(--color-bg-card))] rounded-[var(--radius-lg)] shadow-sm">
          <Timeline prayerItem={mockPrayerItem} updates={mockUpdates} canEdit={false} />
        </div>
      </section>

      {/* Example 2: Timeline with Edit Permission */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-[rgb(var(--color-text-primary))] mb-2">
            2. Editable Timeline
          </h2>
          <p className="text-[var(--font-size-sm)] text-[rgb(var(--color-text-secondary))]">
            Timeline with add update functionality
          </p>
        </div>
        <div className="p-6 bg-[rgb(var(--color-bg-card))] rounded-[var(--radius-lg)] shadow-sm">
          <Timeline
            prayerItem={mockPrayerItem}
            updates={mockUpdates}
            onAddUpdate={handleAddUpdate}
            canEdit={true}
          />
        </div>
      </section>

      {/* Example 3: Timeline with Answered Status */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-[rgb(var(--color-text-primary))] mb-2">
            3. Answered Prayer Timeline
          </h2>
          <p className="text-[var(--font-size-sm)] text-[rgb(var(--color-text-secondary))]">
            Timeline showing answered prayer status
          </p>
        </div>
        <div className="p-6 bg-[rgb(var(--color-bg-card))] rounded-[var(--radius-lg)] shadow-sm">
          <Timeline prayerItem={mockAnsweredPrayerItem} updates={mockUpdates} canEdit={false} />
        </div>
      </section>

      {/* Example 4: Timeline with Partial Answer */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-[rgb(var(--color-text-primary))] mb-2">
            4. Partial Answer Timeline
          </h2>
          <p className="text-[var(--font-size-sm)] text-[rgb(var(--color-text-secondary))]">
            Timeline showing partial answer status
          </p>
        </div>
        <div className="p-6 bg-[rgb(var(--color-bg-card))] rounded-[var(--radius-lg)] shadow-sm">
          <Timeline
            prayerItem={mockPartialAnswerPrayerItem}
            updates={mockUpdates}
            canEdit={false}
          />
        </div>
      </section>

      {/* Example 5: Empty Timeline (No Updates) */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-[rgb(var(--color-text-primary))] mb-2">
            5. Empty Timeline
          </h2>
          <p className="text-[var(--font-size-sm)] text-[rgb(var(--color-text-secondary))]">
            Timeline with no updates yet
          </p>
        </div>
        <div className="p-6 bg-[rgb(var(--color-bg-card))] rounded-[var(--radius-lg)] shadow-sm">
          <Timeline
            prayerItem={mockPrayerItem}
            updates={[]}
            onAddUpdate={handleAddUpdate}
            canEdit={true}
          />
        </div>
      </section>

      {/* Example 6: Ascending Order */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-[rgb(var(--color-text-primary))] mb-2">
            6. Ascending Order
          </h2>
          <p className="text-[var(--font-size-sm)] text-[rgb(var(--color-text-secondary))]">
            Timeline sorted oldest to newest
          </p>
        </div>
        <div className="p-6 bg-[rgb(var(--color-bg-card))] rounded-[var(--radius-lg)] shadow-sm">
          <Timeline
            prayerItem={mockPrayerItem}
            updates={mockUpdates}
            canEdit={false}
            sortOrder="asc"
          />
        </div>
      </section>
    </div>
  );
}
