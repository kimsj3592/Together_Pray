# Home Dashboard Feature Components

Toss-style home dashboard implementation for Together Pray v2.0.

## Components Overview

### 1. GreetingSection
**Location:** `/components/features/home/GreetingSection.tsx`

Displays personalized greeting message based on time of day.

**Features:**
- Dynamic greeting (morning/afternoon/evening)
- User name display
- Fade-in animation
- Responsive typography

**Usage:**
```tsx
<GreetingSection userName={user.name} />
```

---

### 2. PrayerStatsCard
**Location:** `/components/features/home/PrayerStatsCard.tsx`

Shows weekly prayer statistics with interactive stat cards.

**Features:**
- 3-column grid layout (기도중/부분응답/응답완료)
- Emoji indicators for each status
- Color-coded backgrounds
- Tap animation on stat items
- Click to navigate to filtered prayers

**Props:**
```tsx
interface PrayerStats {
  praying: number;
  partialAnswer: number;
  answered: number;
}
```

**Usage:**
```tsx
<PrayerStatsCard stats={stats} />
```

---

### 3. GroupSummaryCard
**Location:** `/components/features/home/GroupSummaryCard.tsx`

Displays user's groups with member count and prayer count.

**Features:**
- Shows up to 3 groups
- "모두 보기" link when more than 3 groups
- Member count and prayer count display
- Interactive card with hover/tap animations
- Staggered entrance animations

**Props:**
```tsx
interface GroupSummaryCardProps {
  groups: Group[];
}
```

**Usage:**
```tsx
<GroupSummaryCard groups={groups} />
```

---

### 4. RecentPrayersFeed
**Location:** `/components/features/home/RecentPrayersFeed.tsx`

Shows recent prayer items from all groups.

**Features:**
- Displays up to 3 recent prayers
- "모두 보기" link when more than 3 prayers
- Uses PrayerCard component for consistency
- Staggered entrance animations

**Props:**
```tsx
interface RecentPrayersFeedProps {
  prayers: PrayerItem[];
}
```

**Usage:**
```tsx
<RecentPrayersFeed prayers={recentPrayers} />
```

---

### 5. FAB (Floating Action Button)
**Location:** `/components/features/home/FAB.tsx`

Floating action button for creating new prayer items.

**Features:**
- Fixed position (bottom-right)
- Spring animation entrance
- Scale animation on hover/tap
- Responsive positioning (mobile/desktop)
- Plus icon indicator

**Props:**
```tsx
interface FABProps {
  onClick?: () => void; // Optional custom handler
}
```

**Usage:**
```tsx
<FAB />
// or with custom handler
<FAB onClick={handleCustomAction} />
```

---

## Home Page Implementation

**Location:** `/app/home/page.tsx`

Main home dashboard page that orchestrates all components.

### Features

1. **Data Loading**
   - Parallel API calls for stats, groups, and recent prayers
   - Loading skeleton states
   - Error handling with retry
   - Empty state when no groups

2. **Layout**
   - Header with navigation
   - Responsive container (max-w-4xl)
   - Bottom navigation
   - FAB for quick actions
   - Safe area padding for mobile

3. **Animations**
   - List container with stagger children
   - Individual component entrance animations
   - Skeleton loading states

### API Endpoints

Added to `/lib/api.ts`:

```typescript
// Get dashboard statistics
async getDashboardStats(): Promise<{
  praying: number;
  partialAnswer: number;
  answered: number;
}>

// Get recent prayer items across all groups
async getRecentPrayers(limit = 3): Promise<PrayerItem[]>
```

**Note:** These endpoints need to be implemented on the backend.

---

## BottomNav Updates

**Location:** `/components/BottomNav.tsx`

Updated navigation structure:

**Global Navigation** (when no groupId):
- 홈 (Home icon) → `/home`
- 그룹 (Heart icon) → `/groups`
- 내정보 (User icon) → `/mypage`

**Group Context Navigation** (when groupId provided):
- 그룹 (Home icon) → `/groups/{id}`
- 기도 (Heart icon) → `/groups/{id}/prayers`
- 응답 (CheckCircle icon) → `/groups/{id}/answered`
- 내정보 (User icon) → `/mypage`

---

## Routing Updates

**Root Page:** `/app/page.tsx`
- Changed redirect from `/groups` to `/home`
- Default landing page is now the home dashboard

---

## Design Tokens Used

All components use design tokens from `globals.css`:

- **Colors:** Primary, success, warning, info, text variants
- **Spacing:** Consistent spacing scale
- **Border Radius:** var(--radius-md), var(--radius-lg), var(--radius-xl)
- **Shadows:** var(--shadow-sm), var(--shadow-md)
- **Typography:** var(--font-size-xs) through var(--font-size-2xl)

---

## Animation System

Uses Framer Motion with predefined variants from `/lib/animations.ts`:

- **fadeIn:** Greeting section
- **listItem:** Individual cards
- **listContainer:** Stagger children animation
- **cardHover:** Interactive cards
- **springConfig:** FAB entrance

---

## Mobile-First Considerations

1. **Touch Targets:** All interactive elements ≥44x44px
2. **Safe Areas:** Bottom padding for home button (pb-20 mobile, pb-6 desktop)
3. **Responsive Grid:** Stats card uses 3-column grid optimized for mobile
4. **FAB Positioning:** Adjusted for bottom nav (bottom-20 mobile, bottom-6 desktop)
5. **Font Sizing:** Mobile-optimized typography with desktop scaling

---

## Backend Integration Required

The following backend endpoints need to be implemented:

### 1. Dashboard Stats Endpoint
```
GET /users/me/dashboard/stats
Response: {
  praying: number,
  partialAnswer: number,
  answered: number
}
```

**Logic:**
- Count prayer items across all user's groups
- Filter by status (praying/partial_answer/answered)
- Optionally filter by date range (this week)

### 2. Recent Prayers Endpoint
```
GET /users/me/dashboard/recent-prayers?limit=3
Response: PrayerItem[]
```

**Logic:**
- Get prayer items from all user's groups
- Sort by createdAt DESC
- Limit results
- Include necessary relations (author, group, reactions count)

---

## Testing Checklist

- [ ] All components render without errors
- [ ] Loading states display correctly
- [ ] Error states show with retry button
- [ ] Empty state when no groups
- [ ] Stats card navigation works
- [ ] Group cards navigate to group detail
- [ ] Prayer cards navigate to prayer detail
- [ ] FAB opens prayer creation flow
- [ ] Bottom navigation highlights home tab
- [ ] Animations play smoothly
- [ ] Mobile responsive (375px-1440px)
- [ ] Dark mode support
- [ ] Touch targets meet 44x44px minimum

---

## Future Enhancements

1. **Pull to Refresh:** Add pull-to-refresh gesture on mobile
2. **Skeleton Variants:** More detailed loading skeletons
3. **Stats Filtering:** Click stat to filter prayers by status
4. **Group Actions:** Quick actions on group cards (invite, settings)
5. **Prayer Quick Actions:** Swipe actions on prayer cards
6. **Notifications Badge:** Show unread prayer updates
7. **Weekly Summary:** Add weekly prayer summary card
8. **Confetti Animation:** Success animation when prayers are answered

---

## File Structure

```
components/features/home/
├── GreetingSection.tsx      # User greeting with time-based message
├── PrayerStatsCard.tsx      # Weekly statistics card
├── GroupSummaryCard.tsx     # User's groups preview
├── RecentPrayersFeed.tsx    # Recent prayers feed
├── FAB.tsx                  # Floating action button
├── index.ts                 # Barrel export
└── README.md                # This file

app/home/
└── page.tsx                 # Home dashboard page

lib/
└── api.ts                   # Updated with dashboard endpoints
```

---

## Dependencies

- `framer-motion`: Animations
- `lucide-react`: Icons
- `next/navigation`: Routing
- Design system components from `/components/ui`
- Animation utilities from `/lib/animations`

---

## Accessibility

- Semantic HTML structure
- ARIA labels on FAB
- Keyboard navigation support
- Focus states on interactive elements
- Color contrast meets WCAG AA
- Screen reader friendly content

---

## Performance Considerations

1. **Parallel Data Loading:** All API calls happen in parallel
2. **Optimistic Updates:** PrayButton uses optimistic updates
3. **Lazy Loading:** Prayer cards only load visible content
4. **Animation Performance:** Hardware-accelerated transforms
5. **Image Optimization:** Next.js Image component ready (if avatars added)

---

Last Updated: 2026-01-30
Version: 2.0
