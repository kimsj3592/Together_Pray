'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { springConfig } from '@/lib/animations';

export interface PrayButtonProps {
  prayerItemId: string;
  initialPrayCount: number;
  initialHasPrayedToday?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onPraySuccess?: (newCount: number) => void;
  showCount?: boolean;
}

const LONG_PRESS_DURATION = 800; // ms

const sizeClasses = {
  sm: 'px-3 py-2 text-[var(--font-size-sm)] min-h-[36px]',
  md: 'px-4 py-2.5 text-[var(--font-size-base)] min-h-[44px]',
  lg: 'px-6 py-3 text-[var(--font-size-lg)] min-h-[52px]',
};

export const PrayButton = ({
  prayerItemId,
  initialPrayCount,
  initialHasPrayedToday = false,
  size = 'md',
  onPraySuccess,
  showCount = false,
}: PrayButtonProps) => {
  const [prayCount, setPrayCount] = useState(initialPrayCount);
  const [hasPrayedToday, setHasPrayedToday] = useState(initialHasPrayedToday);
  const [isPressed, setIsPressed] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (pressTimerRef.current) clearTimeout(pressTimerRef.current);
      if (progressTimerRef.current) clearTimeout(progressTimerRef.current);
    };
  }, []);

  const triggerHapticFeedback = useCallback(() => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(50);
    }
  }, []);

  const showConfettiEffect = useCallback(() => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 1000);
  }, []);

  const handlePraySuccess = useCallback(
    async (result: { prayCount: number; hasPrayedToday: boolean }) => {
      setPrayCount(result.prayCount);
      setHasPrayedToday(result.hasPrayedToday);
      triggerHapticFeedback();
      showConfettiEffect();

      if (onPraySuccess) {
        onPraySuccess(result.prayCount);
      }
    },
    [onPraySuccess, triggerHapticFeedback, showConfettiEffect]
  );

  const submitPrayer = useCallback(async () => {
    if (isSubmitting || hasPrayedToday) return;

    try {
      setIsSubmitting(true);
      const result = await api.pray(prayerItemId);
      await handlePraySuccess(result);
    } catch (err: any) {
      if (err.message.includes('Already prayed')) {
        setHasPrayedToday(true);
      }
      console.error(err.message || '기도 등록에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  }, [prayerItemId, hasPrayedToday, isSubmitting, handlePraySuccess]);

  const startLongPress = useCallback(() => {
    if (hasPrayedToday || isSubmitting) return;

    setIsPressed(true);
    startTimeRef.current = Date.now();

    // Progress update interval
    const updateProgress = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const newProgress = Math.min((elapsed / LONG_PRESS_DURATION) * 100, 100);
      setProgress(newProgress);

      if (elapsed < LONG_PRESS_DURATION) {
        progressTimerRef.current = setTimeout(updateProgress, 16); // ~60fps
      }
    };

    updateProgress();

    // Complete action after duration
    pressTimerRef.current = setTimeout(() => {
      submitPrayer();
      setIsPressed(false);
      setProgress(0);
    }, LONG_PRESS_DURATION);
  }, [hasPrayedToday, isSubmitting, submitPrayer]);

  const cancelLongPress = useCallback(() => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
    if (progressTimerRef.current) {
      clearTimeout(progressTimerRef.current);
      progressTimerRef.current = null;
    }
    setIsPressed(false);
    setProgress(0);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    startLongPress();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    cancelLongPress();
  };

  const handleMouseDown = () => {
    startLongPress();
  };

  const handleMouseUp = () => {
    cancelLongPress();
  };

  const handleMouseLeave = () => {
    cancelLongPress();
  };

  return (
    <div className="relative inline-flex items-center gap-2">
      <motion.button
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        disabled={hasPrayedToday || isSubmitting}
        whileHover={!hasPrayedToday && !isSubmitting ? { scale: 1.02 } : {}}
        transition={springConfig.snappy}
        aria-label={
          hasPrayedToday
            ? '오늘 이미 기도했습니다'
            : isPressed
            ? '기도하는 중...'
            : '길게 눌러서 기도하기'
        }
        aria-pressed={hasPrayedToday}
        aria-busy={isSubmitting}
        className={cn(
          'relative inline-flex items-center justify-center gap-2',
          'font-medium rounded-[var(--radius-lg)]',
          'transition-all duration-200 ease-in-out',
          'overflow-hidden select-none',
          sizeClasses[size],
          hasPrayedToday
            ? 'bg-[rgb(var(--color-bg-tertiary))] text-[rgb(var(--color-text-secondary))] cursor-default'
            : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-lg)] active:shadow-[var(--shadow-sm)]',
          isSubmitting && 'cursor-wait'
        )}
        style={{
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        {/* Progress circle background */}
        {isPressed && !hasPrayedToday && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <svg className="w-full h-full absolute inset-0" style={{ transform: 'rotate(-90deg)' }}>
              <circle
                cx="50%"
                cy="50%"
                r="40%"
                fill="none"
                stroke="rgba(255, 255, 255, 0.3)"
                strokeWidth="3"
              />
              <motion.circle
                cx="50%"
                cy="50%"
                r="40%"
                fill="none"
                stroke="rgba(255, 255, 255, 0.9)"
                strokeWidth="3"
                strokeDasharray={`${2 * Math.PI * 40} ${2 * Math.PI * 40}`}
                strokeDashoffset={2 * Math.PI * 40 * (1 - progress / 100)}
                strokeLinecap="round"
              />
            </svg>
          </motion.div>
        )}

        {/* Content */}
        <AnimatePresence mode="wait">
          {hasPrayedToday ? (
            <motion.span
              key="completed"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={springConfig.bouncy}
              className="flex items-center gap-1.5 relative z-10"
            >
              <Check size={size === 'sm' ? 14 : size === 'md' ? 16 : 18} />
              <span>기도함</span>
            </motion.span>
          ) : isPressed ? (
            <motion.span
              key="pressing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-1.5 relative z-10"
            >
              <span className="text-xl">🙏</span>
            </motion.span>
          ) : (
            <motion.span
              key="default"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-1.5 relative z-10"
            >
              <span>기도하기</span>
            </motion.span>
          )}
        </AnimatePresence>

        {/* Confetti particles */}
        <AnimatePresence>
          {showConfetti && (
            <>
              {Array.from({ length: 8 }).map((_, i) => {
                const angle = (i / 8) * Math.PI * 2;
                const distance = 60;
                const x = Math.cos(angle) * distance;
                const y = Math.sin(angle) * distance;

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                    animate={{
                      opacity: 0,
                      scale: 1,
                      x,
                      y,
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="absolute text-lg pointer-events-none z-20"
                  >
                    {i % 3 === 0 ? '🙏' : i % 3 === 1 ? '✨' : '💫'}
                  </motion.div>
                );
              })}
            </>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Optional count display */}
      {showCount && prayCount > 0 && (
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-[var(--font-size-sm)] text-[rgb(var(--color-text-secondary))] font-medium"
        >
          {prayCount}명
        </motion.span>
      )}
    </div>
  );
};

PrayButton.displayName = 'PrayButton';
