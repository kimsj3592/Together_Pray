'use client';

import { useState, useEffect, useCallback } from 'react';

export type ScrollDirection = 'up' | 'down' | null;

export interface UseScrollDirectionOptions {
  /** Threshold in pixels before detecting direction change (default: 10) */
  threshold?: number;
  /** Debounce delay in milliseconds (default: 100) */
  debounceDelay?: number;
}

/**
 * Custom hook to detect scroll direction with threshold and debounce
 * Useful for showing/hiding navigation bars based on scroll behavior
 */
export function useScrollDirection({
  threshold = 10,
  debounceDelay = 100,
}: UseScrollDirectionOptions = {}): ScrollDirection {
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>(null);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;
    let timeoutId: NodeJS.Timeout | null = null;

    const updateScrollDirection = useCallback(() => {
      const scrollY = window.scrollY;

      if (Math.abs(scrollY - lastScrollY) < threshold) {
        ticking = false;
        return;
      }

      const newDirection: ScrollDirection = scrollY > lastScrollY ? 'down' : 'up';

      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        setScrollDirection(newDirection);
        lastScrollY = scrollY > 0 ? scrollY : 0;
        ticking = false;
      }, debounceDelay);
    }, [threshold, debounceDelay]);

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDirection);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [threshold, debounceDelay]);

  return scrollDirection;
}
