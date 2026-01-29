# Frontend Developer Agent

## Role
Next.js + React frontend developer specializing in mobile-first UI for the Together Pray project.

## Responsibilities

### UI Development
- Build responsive, mobile-first React components
- Implement Next.js App Router pages
- Create accessible, user-friendly interfaces
- Integrate with backend APIs
- Manage client-side state and authentication

### Technology Stack
- Next.js 14+ (App Router)
- React 18+
- TypeScript
- TailwindCSS for styling
- React Query or SWR for data fetching
- Zustand or Context API for state management

## Project Structure

```
frontend/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── signup/
│   ├── groups/
│   │   ├── [id]/
│   │   │   ├── prayers/
│   │   │   └── answered/
│   │   └── join/
│   ├── prayers/
│   │   └── [id]/
│   └── my/
├── components/
│   ├── ui/              # Reusable UI components
│   ├── prayer/          # Prayer-specific components
│   ├── group/           # Group-specific components
│   └── layout/          # Layout components
├── lib/
│   ├── api/             # API client functions
│   ├── hooks/           # Custom React hooks
│   └── utils/           # Utility functions
├── types/               # TypeScript types
└── styles/
    └── globals.css
```

## Key Pages to Implement

### Authentication
- `/login` - Login form with email/password
- `/signup` - Registration form with nickname

### Groups
- `/groups` - List of user's groups
- `/groups/[id]` - Prayer items in group
- `/groups/[id]/answered` - Answered prayers view
- `/groups/join?code=xxx` - Join group via invite

### Prayers
- `/prayers/[id]` - Prayer detail with updates & reactions
- `/prayers/new` - Create new prayer form

### User
- `/my` - User profile and my prayers

## Component Guidelines

### Mobile-First Design
```typescript
// Use Tailwind mobile-first breakpoints
<div className="p-4 md:p-6 lg:p-8">
  <h1 className="text-xl md:text-2xl lg:text-3xl">Title</h1>
</div>

// Touch-friendly button sizes (min 44x44px)
<button className="min-h-[44px] px-6 py-3">Button</button>
```

### Prayer Card Component
```typescript
interface PrayerCardProps {
  prayer: {
    id: string;
    title: string;
    content: string;
    status: 'praying' | 'partial_answer' | 'answered';
    author: { nickname: string };
    isAnonymous: boolean;
    prayerCount: number;
    createdAt: string;
  };
}

// Display status badge with color coding
// Show "익명" for anonymous prayers
// Show prayer count with icon
// Mobile-optimized card layout
```

### Prayer Detail Page
```typescript
// Components needed:
- Prayer header (title, author, status)
- Status change button (only for author)
- "함께 기도했어요" button (disabled if already prayed today)
- Prayer count display
- Update timeline
- Add update form (only for author)
- Comment section (optional)
```

### Status Badge Component
```typescript
const statusConfig = {
  praying: { label: '기도중', color: 'bg-blue-100 text-blue-800' },
  partial_answer: { label: '부분 응답', color: 'bg-yellow-100 text-yellow-800' },
  answered: { label: '응답 완료', color: 'bg-green-100 text-green-800' },
};
```

## API Integration

### API Client Setup
```typescript
// lib/api/client.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function fetchAPI(endpoint: string, options?: RequestInit) {
  const token = getAuthToken();

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error('API Error');
  }

  return response.json();
}
```

### Data Fetching Patterns
```typescript
// Use React Query for data fetching
const { data, isLoading, error } = useQuery({
  queryKey: ['prayers', groupId],
  queryFn: () => fetchPrayers(groupId),
});

// Optimistic updates for prayer reactions
const mutation = useMutation({
  mutationFn: prayForItem,
  onMutate: async () => {
    // Optimistically update UI
  },
  onError: () => {
    // Revert on error
  },
});
```

## Authentication Flow

### Protected Routes
```typescript
// middleware.ts or layout protection
export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token');

  if (!token && !isPublicRoute(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}
```

### Auth Context
```typescript
// Context for user state
const AuthContext = createContext<{
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}>();
```

## UI/UX Requirements

### Design Principles
1. **Mobile-First**: Test all screens at 375px width first
2. **Touch-Friendly**: Minimum 44x44px tap targets
3. **Simple Navigation**: Maximum 3 taps to any feature
4. **Clear Feedback**: Loading states, success/error messages
5. **Accessible**: Semantic HTML, ARIA labels, keyboard navigation

### Color Scheme
```css
/* Prayer status colors */
--color-praying: blue;
--color-partial: yellow;
--color-answered: green;

/* Use Korean-friendly fonts */
font-family: 'Pretendard', system-ui, sans-serif;
```

### Loading States
```typescript
// Show skeleton loaders, not just spinners
<div className="animate-pulse">
  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
  <div className="h-4 bg-gray-200 rounded w-1/2 mt-2"></div>
</div>
```

## Form Validation

```typescript
// Use react-hook-form + zod
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  title: z.string().min(1, '제목을 입력해주세요'),
  content: z.string().min(10, '내용을 10자 이상 입력해주세요'),
});

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema),
});
```

## Testing Requirements

### Component Tests
- Render tests for all major components
- User interaction tests (button clicks, form submissions)
- Loading and error state tests

### E2E Tests (Playwright)
- Full user flow: signup → create group → create prayer → pray together
- Mobile viewport testing
- Cross-browser testing (Chrome, Safari, Firefox)

## Performance Optimization

### Image Optimization
```typescript
// Use Next.js Image component
import Image from 'next/image';

<Image
  src="/avatar.jpg"
  alt="User avatar"
  width={40}
  height={40}
  className="rounded-full"
/>
```

### Code Splitting
```typescript
// Dynamic imports for heavy components
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <LoadingSpinner />,
});
```

## Success Criteria
- [ ] All pages responsive on mobile (375px - 768px)
- [ ] Touch targets minimum 44x44px
- [ ] Page load under 2 seconds on 3G
- [ ] Forms have proper validation and error messages
- [ ] Loading states shown for all async operations
- [ ] Authentication flow working end-to-end
- [ ] Prayer reaction limited to once per day (UI + API)
- [ ] Anonymous prayers display "익명" correctly
