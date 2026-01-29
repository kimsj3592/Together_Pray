'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Sun, Moon, Monitor } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { springConfig, scaleIn } from '@/lib/animations';

interface HeaderProps {
  /** Header title text */
  title?: string;
  /** Show back button (default: false) */
  showBackButton?: boolean;
  /** Custom back button handler (if not provided, uses router.back()) */
  onBack?: () => void;
  /** Right side action buttons */
  rightActions?: React.ReactNode;
  /** Transparent background (default: false) */
  transparent?: boolean;
  /** Show theme toggle (default: true) */
  showThemeToggle?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Header Component (v2.0 Toss-style)
 *
 * Features:
 * - Glassmorphism effect with scroll-reactive styling
 * - Dynamic title system
 * - Optional back button navigation
 * - Customizable right actions area
 * - Theme toggle with dropdown menu
 * - Responsive design (mobile & desktop)
 * - Smooth animations with Framer Motion
 */
export default function Header({
  title,
  showBackButton = false,
  onBack,
  rightActions,
  transparent = false,
  showThemeToggle = true,
  className = '',
}: HeaderProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Scroll detection for reactive styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const themeOptions = [
    { value: 'light' as const, icon: <Sun size={18} />, label: '라이트' },
    { value: 'dark' as const, icon: <Moon size={18} />, label: '다크' },
    { value: 'system' as const, icon: <Monitor size={18} />, label: '시스템' },
  ];

  return (
    <motion.header
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={springConfig.snappy}
      className={`sticky top-0 z-40 transition-all duration-200 ${
        transparent && !scrolled
          ? 'glass'
          : scrolled
          ? 'glass border-b shadow-md'
          : 'bg-primary border-b'
      } ${className}`}
    >
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Left section: Back button or title */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {showBackButton && (
            <motion.button
              whileTap={{ scale: 0.92 }}
              transition={springConfig.snappy}
              onClick={handleBack}
              className="flex items-center gap-1 p-2 -ml-2 rounded-lg hover:bg-tertiary transition-colors"
              style={{ color: 'rgb(var(--color-primary-500))' }}
            >
              <ChevronLeft size={24} />
              <span className="hidden sm:inline text-sm font-medium">뒤로</span>
            </motion.button>
          )}

          {title && (
            <h1
              className="text-lg font-semibold truncate"
              style={{ color: 'rgb(var(--color-text-primary))' }}
            >
              {title}
            </h1>
          )}

          {!title && !showBackButton && (
            <Link href="/groups" className="flex items-center gap-2 group">
              <motion.span
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={springConfig.snappy}
                className="text-xl font-bold"
                style={{ color: 'rgb(var(--color-primary-500))' }}
              >
                Together Pray
              </motion.span>
            </Link>
          )}
        </div>

        {/* Right section: Custom actions or default actions */}
        <div className="flex items-center gap-2">
          {rightActions ? (
            rightActions
          ) : (
            <>
              {/* Theme toggle */}
              {showThemeToggle && (
                <div className="relative">
                  <motion.button
                    whileTap={{ scale: 0.92 }}
                    transition={springConfig.snappy}
                    onClick={() => setShowThemeMenu(!showThemeMenu)}
                    className="p-2 rounded-lg hover:bg-tertiary transition-colors"
                    style={{ color: 'rgb(var(--color-text-secondary))' }}
                    aria-label="테마 변경"
                  >
                    {resolvedTheme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                  </motion.button>

                  {/* Theme dropdown menu */}
                  <AnimatePresence>
                    {showThemeMenu && (
                      <>
                        {/* Backdrop */}
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setShowThemeMenu(false)}
                        />

                        {/* Dropdown */}
                        <motion.div
                          variants={scaleIn}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
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
                              <span className="flex-1 text-left">{option.label}</span>
                              {theme === option.value && (
                                <motion.span
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={springConfig.bouncy}
                                  className="w-2 h-2 rounded-full"
                                  style={{ backgroundColor: 'rgb(var(--color-primary-500))' }}
                                />
                              )}
                            </button>
                          ))}
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* User info (desktop only) */}
              {user && (
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
              )}
            </>
          )}
        </div>
      </div>
    </motion.header>
  );
}
