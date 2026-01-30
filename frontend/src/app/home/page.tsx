'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import { EmptyState } from '@/components/ui/EmptyState';
import { PullToRefresh } from '@/components/ui/PullToRefresh';
import { api, Group, PrayerItem } from '@/lib/api';
import {
  GreetingSection,
  PrayerStatsCard,
  GroupSummaryCard,
  RecentPrayersFeed,
  FAB,
} from '@/components/features/home';
import { listContainer } from '@/lib/animations';

interface DashboardStats {
  praying: number;
  partialAnswer: number;
  answered: number;
}

function HomePageContent() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Dashboard data
  const [stats, setStats] = useState<DashboardStats>({
    praying: 0,
    partialAnswer: 0,
    answered: 0,
  });
  const [groups, setGroups] = useState<Group[]>([]);
  const [recentPrayers, setRecentPrayers] = useState<PrayerItem[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch all dashboard data in parallel
      const [statsData, groupsData, prayersData] = await Promise.all([
        api.getDashboardStats().catch(() => ({
          praying: 0,
          partialAnswer: 0,
          answered: 0,
        })),
        api.getGroups().catch(() => []),
        api.getRecentPrayers(3).catch(() => []),
      ]);

      setStats(statsData);
      setGroups(groupsData);
      setRecentPrayers(prayersData);
    } catch (err: any) {
      console.error('Failed to load dashboard:', err);
      setError(err.message || '대시보드를 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  // Show loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-secondary pb-20 md:pb-6">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-6">
          <div className="space-y-6">
            {/* Greeting skeleton */}
            <div className="space-y-2">
              <div className="h-8 w-48 bg-tertiary rounded skeleton" />
              <div className="h-5 w-64 bg-tertiary rounded skeleton" />
            </div>

            {/* Stats skeleton */}
            <div className="card p-5">
              <div className="h-6 w-40 bg-tertiary rounded skeleton mb-4" />
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 bg-tertiary rounded skeleton" />
                ))}
              </div>
            </div>

            {/* Groups skeleton */}
            <div>
              <div className="h-6 w-32 bg-tertiary rounded skeleton mb-4" />
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="card p-4 h-20" />
                ))}
              </div>
            </div>
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-secondary pb-20 md:pb-6">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-6">
          <div
            className="p-4 rounded-xl mb-6"
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              color: 'rgb(var(--color-accent-red))',
            }}
          >
            {error}
          </div>
          <button onClick={loadDashboardData} className="btn-primary">
            다시 시도
          </button>
        </main>
        <BottomNav />
      </div>
    );
  }

  // Show empty state if no groups
  if (groups.length === 0) {
    return (
      <div className="min-h-screen bg-secondary pb-20 md:pb-6">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-6">
          {user && <GreetingSection userName={user.name} />}
          <EmptyState
            type="groups"
            actionLabel="그룹 만들기"
            actionHref="/groups/create"
          />
        </main>
        <BottomNav />
      </div>
    );
  }

  // Show dashboard
  return (
    <div className="min-h-screen bg-secondary pb-20 md:pb-6">
      <Header />

      <PullToRefresh onRefresh={loadDashboardData} disabled={loading}>
        <main className="max-w-4xl mx-auto px-4 py-6">
          <motion.div
            variants={listContainer}
            initial="hidden"
            animate="visible"
          >
            {/* Greeting */}
            {user && <GreetingSection userName={user.name} />}

            {/* Prayer Stats */}
            <PrayerStatsCard stats={stats} />

            {/* Groups Summary */}
            <GroupSummaryCard groups={groups} />

            {/* Recent Prayers Feed */}
            {recentPrayers.length > 0 && (
              <RecentPrayersFeed prayers={recentPrayers} />
            )}
          </motion.div>
        </main>
      </PullToRefresh>

      {/* Floating Action Button */}
      <FAB />

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}

export default function HomePage() {
  return (
    <ProtectedRoute>
      <HomePageContent />
    </ProtectedRoute>
  );
}
