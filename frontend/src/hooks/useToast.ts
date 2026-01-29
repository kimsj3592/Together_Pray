/**
 * useToast Hook
 *
 * Re-export from ToastContext for convenience
 */
export { useToast } from '@/contexts/ToastContext';
export type { ToastOptions, ToastContextValue as UseToastReturn } from '@/contexts/ToastContext';

// Type definitions for export
export interface ToastOptions {
  message: string;
  variant?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

export interface UseToastReturn {
  toasts: Array<{
    id: string;
    message: string;
    variant?: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
  }>;
  toast: (options: ToastOptions) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}
