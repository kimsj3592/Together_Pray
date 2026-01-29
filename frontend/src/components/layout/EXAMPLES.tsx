/**
 * Layout Components Usage Examples (v2.0)
 *
 * This file contains example usage patterns for the new layout components.
 * Copy and adapt these examples for your pages.
 */

'use client';

import { useRouter } from 'next/navigation';
import { Header, BottomNav } from '@/components/layout';
import { Settings, Share, Bell, Search } from 'lucide-react';

// ============================================================================
// EXAMPLE 1: Basic Page with Header and BottomNav
// ============================================================================

export function BasicPageExample({ groupId }: { groupId: string }) {
  return (
    <div className="min-h-screen bg-secondary">
      {/* Simple header with back button */}
      <Header
        title="기도제목 목록"
        showBackButton={true}
      />

      <main className="pb-20 px-4">
        {/* Your page content */}
        <h1>Page Content</h1>
      </main>

      {/* Bottom navigation */}
      <BottomNav groupId={groupId} />
    </div>
  );
}

// ============================================================================
// EXAMPLE 2: Page with Scroll-Hide Navigation
// ============================================================================

export function ScrollHideExample({ groupId }: { groupId: string }) {
  return (
    <div className="min-h-screen bg-secondary">
      <Header
        title="기도 피드"
        showBackButton={true}
        transparent={true} // Glassmorphism by default
      />

      <main className="pb-20">
        {/* Long scrollable content */}
        <div className="space-y-4 p-4">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="card p-4">
              Content {i + 1}
            </div>
          ))}
        </div>
      </main>

      {/* Hide nav when scrolling down */}
      <BottomNav groupId={groupId} hideOnScroll={true} />
    </div>
  );
}

// ============================================================================
// EXAMPLE 3: Header with Custom Right Actions
// ============================================================================

export function CustomActionsExample({ groupId }: { groupId: string }) {
  const handleSearch = () => {
    console.log('Search clicked');
  };

  const handleNotifications = () => {
    console.log('Notifications clicked');
  };

  return (
    <div className="min-h-screen bg-secondary">
      <Header
        title="그룹 홈"
        showBackButton={true}
        rightActions={
          <div className="flex items-center gap-2">
            {/* Search button */}
            <button
              onClick={handleSearch}
              className="p-2 rounded-lg hover:bg-tertiary transition-colors"
              style={{ color: 'rgb(var(--color-text-secondary))' }}
            >
              <Search size={20} />
            </button>

            {/* Notifications button */}
            <button
              onClick={handleNotifications}
              className="p-2 rounded-lg hover:bg-tertiary transition-colors relative"
              style={{ color: 'rgb(var(--color-text-secondary))' }}
            >
              <Bell size={20} />
              {/* Notification badge */}
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-error" />
            </button>
          </div>
        }
      />

      <main className="pb-20 px-4">
        <h1>Content</h1>
      </main>

      <BottomNav groupId={groupId} />
    </div>
  );
}

// ============================================================================
// EXAMPLE 4: Header with Custom Back Handler
// ============================================================================

export function CustomBackExample({ groupId }: { groupId: string }) {
  const router = useRouter();

  const handleBack = () => {
    // Custom back logic (e.g., unsaved changes warning)
    const hasUnsavedChanges = false; // Your logic here

    if (hasUnsavedChanges) {
      const confirmed = window.confirm('저장하지 않은 변경사항이 있습니다. 나가시겠습니까?');
      if (!confirmed) return;
    }

    router.push(`/groups/${groupId}`);
  };

  return (
    <div className="min-h-screen bg-secondary">
      <Header
        title="기도제목 작성"
        showBackButton={true}
        onBack={handleBack}
      />

      <main className="pb-20 px-4">
        <form>{/* Your form */}</form>
      </main>

      <BottomNav groupId={groupId} />
    </div>
  );
}

// ============================================================================
// EXAMPLE 5: Landing Page (No Auth, No Group)
// ============================================================================

export function LandingPageExample() {
  return (
    <div className="min-h-screen bg-secondary">
      {/* No title, shows "Together Pray" logo */}
      <Header
        showThemeToggle={true}
        transparent={true}
      />

      <main className="pb-20">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-4">
            함께 기도하는 공동체
          </h1>
          <p className="text-secondary">
            Together Pray와 함께 기도 제목을 나누고 응답을 경험하세요.
          </p>
        </div>
      </main>

      {/* No group context, shows "그룹" and "내정보" only */}
      <BottomNav />
    </div>
  );
}

// ============================================================================
// EXAMPLE 6: Settings Page with Multiple Actions
// ============================================================================

export function SettingsPageExample() {
  const router = useRouter();

  const handleShare = () => {
    console.log('Share app');
  };

  return (
    <div className="min-h-screen bg-secondary">
      <Header
        title="설정"
        showBackButton={true}
        rightActions={
          <button
            onClick={handleShare}
            className="p-2 rounded-lg hover:bg-tertiary transition-colors"
            style={{ color: 'rgb(var(--color-text-secondary))' }}
          >
            <Share size={20} />
          </button>
        }
      />

      <main className="pb-20">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
          <div className="card p-4">
            <h2 className="font-semibold mb-2">계정 설정</h2>
            {/* Settings content */}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

// ============================================================================
// EXAMPLE 7: Transparent Header with Scroll Effect
// ============================================================================

export function TransparentHeaderExample({ groupId }: { groupId: string }) {
  return (
    <div className="min-h-screen bg-secondary">
      {/* Transparent header that becomes opaque on scroll */}
      <Header
        title="응답된 기도"
        showBackButton={true}
        transparent={true}
      />

      <main className="pb-20">
        {/* Hero section */}
        <div className="h-64 flex items-center justify-center bg-gradient-to-br from-primary-500 to-primary-700 text-white">
          <h1 className="text-3xl font-bold">응답의 기쁨</h1>
        </div>

        {/* Content */}
        <div className="space-y-4 p-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="card p-4">
              Answered Prayer {i + 1}
            </div>
          ))}
        </div>
      </main>

      <BottomNav groupId={groupId} />
    </div>
  );
}

// ============================================================================
// EXAMPLE 8: Minimal Header (No Back, No Theme)
// ============================================================================

export function MinimalHeaderExample({ groupId }: { groupId: string }) {
  return (
    <div className="min-h-screen bg-secondary">
      {/* Minimal header with just title */}
      <Header
        title="기도 통계"
        showThemeToggle={false}
      />

      <main className="pb-20 px-4">
        <div className="space-y-6 py-6">
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4">이번 주 통계</h3>
            {/* Stats content */}
          </div>
        </div>
      </main>

      <BottomNav groupId={groupId} />
    </div>
  );
}

// ============================================================================
// EXAMPLE 9: Complex Action Bar
// ============================================================================

export function ComplexActionsExample({ groupId }: { groupId: string }) {
  return (
    <div className="min-h-screen bg-secondary">
      <Header
        title="그룹 관리"
        showBackButton={true}
        rightActions={
          <div className="flex items-center gap-1">
            <button className="p-2 rounded-lg hover:bg-tertiary transition-colors">
              <Search size={20} />
            </button>
            <button className="p-2 rounded-lg hover:bg-tertiary transition-colors">
              <Bell size={20} />
            </button>
            <button className="p-2 rounded-lg hover:bg-tertiary transition-colors">
              <Settings size={20} />
            </button>
          </div>
        }
      />

      <main className="pb-20 px-4">
        <h1>Group Management</h1>
      </main>

      <BottomNav groupId={groupId} />
    </div>
  );
}

// ============================================================================
// EXAMPLE 10: Custom Styling
// ============================================================================

export function CustomStylingExample({ groupId }: { groupId: string }) {
  return (
    <div className="min-h-screen bg-secondary">
      {/* Custom className for special styling */}
      <Header
        title="특별한 페이지"
        showBackButton={true}
        className="border-b-2 border-primary-500"
      />

      <main className="pb-20 px-4">
        <h1>Custom Page</h1>
      </main>

      <BottomNav
        groupId={groupId}
        className="shadow-xl"
      />
    </div>
  );
}
