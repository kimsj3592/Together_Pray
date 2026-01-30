'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

export interface PullToRefreshProps {
  children: React.ReactNode;
  onRefresh: () => Promise<void>;
  disabled?: boolean;
  threshold?: number;
}

export function PullToRefresh({
  children,
  onRefresh,
  disabled = false,
  threshold = 80,
}: PullToRefreshProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const y = useMotionValue(0);

  // Transform pull distance to indicator rotation
  const rotate = useTransform(y, [0, threshold], [0, 180]);
  const opacity = useTransform(y, [0, threshold / 2, threshold], [0, 0.5, 1]);
  const scale = useTransform(y, [0, threshold / 2, threshold], [0.5, 0.8, 1]);

  const handleDragStart = useCallback(() => {
    // Only allow pull to refresh if at the top of the page
    if (containerRef.current) {
      const scrollTop = containerRef.current.scrollTop;
      return scrollTop === 0;
    }
    return false;
  }, []);

  const handleDragEnd = useCallback(
    async (event: any, info: PanInfo) => {
      if (disabled || isRefreshing) return;

      // If pulled beyond threshold, trigger refresh
      if (info.offset.y >= threshold) {
        setIsRefreshing(true);
        y.set(threshold);

        try {
          await onRefresh();
        } catch (error) {
          console.error('Refresh failed:', error);
        } finally {
          setIsRefreshing(false);
          y.set(0);
        }
      } else {
        // Snap back if not pulled enough
        y.set(0);
      }
    },
    [disabled, isRefreshing, onRefresh, threshold, y]
  );

  const handleDrag = useCallback(
    (event: any, info: PanInfo) => {
      if (disabled || isRefreshing) return;

      // Only allow downward drag
      const newY = Math.max(0, Math.min(info.offset.y, threshold * 1.2));
      y.set(newY);
    },
    [disabled, isRefreshing, threshold, y]
  );

  return (
    <div ref={containerRef} className="relative overflow-auto h-full">
      {/* Pull to Refresh Indicator */}
      <motion.div
        className="absolute top-0 left-0 right-0 flex items-center justify-center pointer-events-none z-50"
        style={{
          height: threshold,
          y: useTransform(y, (value) => value - threshold),
        }}
      >
        <motion.div
          style={{
            opacity,
            scale,
            rotate,
          }}
          className="flex items-center justify-center"
        >
          <RefreshCw
            size={24}
            className={`${
              isRefreshing ? 'animate-spin' : ''
            }`}
            style={{ color: 'rgb(var(--color-primary-500))' }}
          />
        </motion.div>
      </motion.div>

      {/* Content with drag gesture */}
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0.3, bottom: 0 }}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        style={{ y }}
        className="min-h-full"
      >
        {children}
      </motion.div>
    </div>
  );
}
