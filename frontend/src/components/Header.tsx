'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronLeft, Sun, Moon, Monitor, LogOut, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useState } from 'react';

interface HeaderProps {
  title?: string;
  backHref?: string;
  backLabel?: string;
  showThemeToggle?: boolean;
  transparent?: boolean;
}

export default function Header({
  title,
  backHref,
  backLabel,
  showThemeToggle = true,
  transparent = false,
}: HeaderProps) {
  const { user, logout } = useAuth();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
  };

  const themeOptions = [
    { value: 'light' as const, icon: <Sun size={18} />, label: '라이트' },
    { value: 'dark' as const, icon: <Moon size={18} />, label: '다크' },
    { value: 'system' as const, icon: <Monitor size={18} />, label: '시스템' },
  ];

  return (
    <header
      className={`sticky top-0 z-40 ${
        transparent ? 'glass' : 'bg-primary'
      } border-b border-[rgb(var(--color-border))]`}
    >
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          {backHref && (
            <Link
              href={backHref}
              className="flex items-center gap-1 text-sm font-medium hover:opacity-70 transition-opacity"
              style={{ color: 'rgb(var(--color-accent-blue))' }}
            >
              <ChevronLeft size={20} />
              <span className="hidden sm:inline">{backLabel || '뒤로'}</span>
            </Link>
          )}

          {title && (
            <h1
              className="text-lg font-semibold truncate"
              style={{ color: 'rgb(var(--color-text-primary))' }}
            >
              {title}
            </h1>
          )}

          {!title && !backHref && (
            <Link href="/groups" className="flex items-center gap-2">
              <span
                className="text-xl font-bold"
                style={{ color: 'rgb(var(--color-accent-blue))' }}
              >
                Together Pray
              </span>
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2">
          {showThemeToggle && (
            <div className="relative">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                className="p-2 rounded-lg hover:bg-tertiary transition-colors"
                style={{ color: 'rgb(var(--color-text-secondary))' }}
              >
                {resolvedTheme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
              </motion.button>

              {showThemeMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowThemeMenu(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute right-0 top-full mt-2 w-36 rounded-xl shadow-lg overflow-hidden z-50 card"
                  >
                    {themeOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setTheme(option.value);
                          setShowThemeMenu(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                          theme === option.value
                            ? 'bg-tertiary'
                            : 'hover:bg-tertiary'
                        }`}
                        style={{ color: 'rgb(var(--color-text-primary))' }}
                      >
                        {option.icon}
                        <span>{option.label}</span>
                        {theme === option.value && (
                          <span
                            className="ml-auto w-2 h-2 rounded-full"
                            style={{ backgroundColor: 'rgb(var(--color-accent-blue))' }}
                          />
                        )}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </div>
          )}

          {user && (
            <>
              <Link
                href="/mypage"
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-tertiary transition-colors"
              >
                <span
                  className="text-sm font-medium"
                  style={{ color: 'rgb(var(--color-text-primary))' }}
                >
                  {user.name}
                </span>
              </Link>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-tertiary transition-colors"
                style={{ color: 'rgb(var(--color-text-secondary))' }}
                title="로그아웃"
              >
                <LogOut size={20} />
              </motion.button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
