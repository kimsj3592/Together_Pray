'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Heart, CheckCircle, User } from 'lucide-react';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { springConfig } from '@/lib/animations';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  matchPattern: RegExp;
}

interface BottomNavProps {
  /** Group ID to determine navigation context */
  groupId?: string;
  /** Whether to hide nav on scroll down (default: false) */
  hideOnScroll?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Bottom Navigation Component (v2.0 Toss-style)
 *
 * Features:
 * - 4-tab layout with icons and labels
 * - Glassmorphism effect with backdrop blur
 * - Active indicator with Framer Motion layoutId
 * - Safe area inset support for iOS
 * - Optional scroll-based visibility
 * - Touch-friendly tap animations
 * - Dynamic routes based on group context
 */
export default function BottomNav({ groupId, hideOnScroll = false, className = '' }: BottomNavProps) {
  const pathname = usePathname();
  const scrollDirection = useScrollDirection({ threshold: 50, debounceDelay: 50 });

  // Determine if nav should be hidden based on scroll
  const shouldHide = hideOnScroll && scrollDirection === 'down';

  // Build navigation items based on context
  const navItems: NavItem[] = groupId
    ? [
        {
          href: `/groups/${groupId}`,
          label: '홈',
          icon: <Home size={24} />,
          matchPattern: new RegExp(`^/groups/${groupId}$`),
        },
        {
          href: `/groups/${groupId}/prayers`,
          label: '기도',
          icon: <Heart size={24} />,
          matchPattern: new RegExp(`^/groups/${groupId}/prayers`),
        },
        {
          href: `/groups/${groupId}/answered`,
          label: '응답',
          icon: <CheckCircle size={24} />,
          matchPattern: new RegExp(`^/groups/${groupId}/answered`),
        },
        {
          href: '/mypage',
          label: '내정보',
          icon: <User size={24} />,
          matchPattern: /^\/mypage/,
        },
      ]
    : [
        {
          href: '/groups',
          label: '그룹',
          icon: <Home size={24} />,
          matchPattern: /^\/groups$/,
        },
        {
          href: '/mypage',
          label: '내정보',
          icon: <User size={24} />,
          matchPattern: /^\/mypage/,
        },
      ];

  return (
    <AnimatePresence>
      {!shouldHide && (
        <motion.nav
          initial={{ y: 0 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={springConfig.snappy}
          className={`fixed bottom-0 left-0 right-0 z-50 md:hidden ${className}`}
          style={{
            paddingBottom: 'env(safe-area-inset-bottom)',
          }}
        >
          {/* Glassmorphism container */}
          <div className="glass border-t">
            <div className="flex items-center justify-around px-2 py-2">
              {navItems.map((item) => {
                const isActive = item.matchPattern.test(pathname);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="relative flex-1 min-w-0"
                  >
                    <motion.div
                      whileTap={{ scale: 0.92 }}
                      transition={springConfig.snappy}
                      className="flex flex-col items-center justify-center py-2 px-3 relative"
                    >
                      {/* Active indicator - top accent line */}
                      {isActive && (
                        <motion.div
                          layoutId="bottomNavActiveIndicator"
                          className="absolute -top-1 left-1/2 -translate-x-1/2 w-12 h-1 rounded-full"
                          style={{ backgroundColor: 'rgb(var(--color-primary-500))' }}
                          transition={springConfig.snappy}
                        />
                      )}

                      {/* Icon with active state color */}
                      <motion.span
                        animate={{
                          color: isActive
                            ? 'rgb(var(--color-primary-500))'
                            : 'rgb(var(--color-text-secondary))',
                          scale: isActive ? 1.05 : 1,
                        }}
                        transition={springConfig.snappy}
                        className="mb-1 flex items-center justify-center"
                      >
                        {item.icon}
                      </motion.span>

                      {/* Label with active state */}
                      <motion.span
                        animate={{
                          color: isActive
                            ? 'rgb(var(--color-primary-500))'
                            : 'rgb(var(--color-text-secondary))',
                          fontWeight: isActive ? 600 : 500,
                        }}
                        transition={springConfig.snappy}
                        className="text-xs leading-tight"
                      >
                        {item.label}
                      </motion.span>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
