'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, Heart, CheckCircle, User } from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  matchPattern: RegExp;
}

interface BottomNavProps {
  groupId?: string;
}

export default function BottomNav({ groupId }: BottomNavProps) {
  const pathname = usePathname();

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
    <nav className="bottom-nav md:hidden">
      <div className="flex items-center justify-around px-2 py-1">
        {navItems.map((item) => {
          const isActive = item.matchPattern.test(pathname);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`bottom-nav-item relative flex-1 ${isActive ? 'active' : ''}`}
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="flex flex-col items-center"
              >
                {isActive && (
                  <motion.div
                    layoutId="bottomNavIndicator"
                    className="absolute -top-1 w-12 h-1 rounded-full"
                    style={{ backgroundColor: 'rgb(var(--color-accent-blue))' }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                <span className="mb-1">{item.icon}</span>
                <span className="text-xs font-medium">{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
