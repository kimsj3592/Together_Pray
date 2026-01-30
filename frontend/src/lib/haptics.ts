/**
 * Haptic Feedback Utility for Together Pray v2.0
 * Provides tactile feedback for mobile interactions
 */

export type HapticFeedbackType = 'light' | 'medium' | 'heavy' | 'success' | 'error';

/**
 * Trigger haptic feedback if supported by the device
 */
const triggerHaptic = (pattern: number | number[]): void => {
  if (typeof window === 'undefined') return;

  // Check if vibration API is supported
  if ('vibrate' in navigator) {
    navigator.vibrate(pattern);
  }
};

/**
 * Haptic feedback functions
 */
export const haptics = {
  /**
   * Light haptic feedback (10ms)
   * Use for: button taps, switch toggles, small interactions
   */
  light: (): void => {
    triggerHaptic(10);
  },

  /**
   * Medium haptic feedback (25ms)
   * Use for: card selections, filter changes, modal opens
   */
  medium: (): void => {
    triggerHaptic(25);
  },

  /**
   * Heavy haptic feedback (50ms)
   * Use for: important actions, errors, warnings
   */
  heavy: (): void => {
    triggerHaptic(50);
  },

  /**
   * Success haptic pattern (10ms, 50ms, 10ms)
   * Use for: successful submissions, prayer reactions, status updates
   */
  success: (): void => {
    triggerHaptic([10, 50, 10]);
  },

  /**
   * Error haptic pattern (50ms, 100ms, 50ms)
   * Use for: validation errors, failed actions, warnings
   */
  error: (): void => {
    triggerHaptic([50, 100, 50]);
  },
};

/**
 * Hook for haptic feedback with event handlers
 */
export const useHaptics = () => {
  const withHaptic = <T extends (...args: any[]) => any>(
    callback: T,
    feedbackType: HapticFeedbackType = 'light'
  ) => {
    return ((...args: Parameters<T>) => {
      haptics[feedbackType]();
      return callback(...args);
    }) as T;
  };

  return { haptics, withHaptic };
};
