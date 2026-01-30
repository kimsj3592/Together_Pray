/**
 * Performance Optimization Utilities
 *
 * Tools for monitoring and optimizing performance metrics
 */

/**
 * Report Web Vitals to analytics
 */
export const reportWebVitals = (metric: {
  id: string;
  name: string;
  value: number;
  label: 'web-vital' | 'custom';
}) => {
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vitals] ${metric.name}:`, metric.value);
  }

  // Send to analytics in production
  if (process.env.NODE_ENV === 'production') {
    // TODO: Send to analytics service
    // Example: analytics.track('web-vitals', metric);
  }
};

/**
 * Preload critical images
 */
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

/**
 * Preload multiple images
 */
export const preloadImages = (sources: string[]): Promise<void[]> => {
  return Promise.all(sources.map(preloadImage));
};

/**
 * Lazy load component with custom loading
 */
export const lazyLoadWithFallback = <T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ReactNode
) => {
  const React = require('react');
  const LazyComponent = React.lazy(importFunc);

  return (props: React.ComponentProps<T>) => (
    <React.Suspense fallback={fallback || null}>
      <LazyComponent {...props} />
    </React.Suspense>
  );
};

/**
 * Check if reduced motion is preferred
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Debounce function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttle function
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Check if user is on slow connection
 */
export const isSlowConnection = (): boolean => {
  if (typeof navigator === 'undefined' || !('connection' in navigator)) {
    return false;
  }

  const connection = (navigator as any).connection;
  return (
    connection.saveData ||
    connection.effectiveType === 'slow-2g' ||
    connection.effectiveType === '2g'
  );
};

/**
 * Request Idle Callback wrapper with fallback
 */
export const requestIdleCallbackPolyfill = (
  callback: () => void,
  options?: { timeout?: number }
): number => {
  if (typeof window === 'undefined') {
    return 0;
  }

  if ('requestIdleCallback' in window) {
    return window.requestIdleCallback(callback, options);
  }

  // Fallback to setTimeout
  return window.setTimeout(callback, 1) as any;
};

/**
 * Cancel Idle Callback wrapper with fallback
 */
export const cancelIdleCallbackPolyfill = (id: number): void => {
  if (typeof window === 'undefined') return;

  if ('cancelIdleCallback' in window) {
    window.cancelIdleCallback(id);
  } else {
    window.clearTimeout(id);
  }
};

/**
 * Intersection Observer hook for lazy loading
 */
export const useIntersectionObserver = (
  ref: React.RefObject<Element>,
  options?: IntersectionObserverInit
): boolean => {
  const React = require('react');
  const [isIntersecting, setIsIntersecting] = React.useState(false);

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      options
    );

    observer.observe(element);
    return () => observer.unobserve(element);
  }, [ref, options]);

  return isIntersecting;
};

/**
 * Performance mark and measure
 */
export const performanceMark = (name: string): void => {
  if (typeof performance === 'undefined') return;
  performance.mark(name);
};

export const performanceMeasure = (
  name: string,
  startMark: string,
  endMark: string
): PerformanceMeasure | null => {
  if (typeof performance === 'undefined') return null;

  try {
    return performance.measure(name, startMark, endMark);
  } catch (error) {
    console.error('Performance measure failed:', error);
    return null;
  }
};
