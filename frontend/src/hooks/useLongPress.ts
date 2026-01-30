'use client';

import { useCallback, useRef } from 'react';

export interface LongPressOptions {
  /** Duration in milliseconds to trigger long press (default: 500ms) */
  threshold?: number;
  /** Callback when long press is triggered */
  onLongPress: () => void;
  /** Optional callback when regular press (tap) is triggered */
  onPress?: () => void;
  /** Optional callback when press starts */
  onPressStart?: () => void;
  /** Optional callback when press ends */
  onPressEnd?: () => void;
}

/**
 * Hook for handling long press gestures
 */
export const useLongPress = ({
  threshold = 500,
  onLongPress,
  onPress,
  onPressStart,
  onPressEnd,
}: LongPressOptions) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPressRef = useRef(false);

  const start = useCallback(() => {
    isLongPressRef.current = false;
    onPressStart?.();

    timerRef.current = setTimeout(() => {
      isLongPressRef.current = true;
      onLongPress();
    }, threshold);
  }, [onLongPress, onPressStart, threshold]);

  const clear = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    onPressEnd?.();

    // If it wasn't a long press, trigger regular press
    if (!isLongPressRef.current && onPress) {
      onPress();
    }
  }, [onPress, onPressEnd]);

  const cancel = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    isLongPressRef.current = false;
  }, []);

  return {
    onMouseDown: start,
    onMouseUp: clear,
    onMouseLeave: cancel,
    onTouchStart: start,
    onTouchEnd: clear,
    onTouchCancel: cancel,
  };
};
