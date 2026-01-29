'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import ToastContainer, { ToastItem } from '@/components/layout/ToastContainer';

export interface ToastOptions {
  message: string;
  variant?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

export interface ToastContextValue {
  toasts: ToastItem[];
  toast: (options: ToastOptions) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

let toastId = 0;
const generateId = () => `toast-${++toastId}`;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback((options: ToastOptions) => {
    const id = generateId();
    const newToast: ToastItem = {
      id,
      message: options.message,
      variant: options.variant ?? 'info',
      duration: options.duration ?? 3000,
    };

    setToasts((prev) => [...prev, newToast]);
  }, []);

  const success = useCallback(
    (message: string, duration?: number) => {
      toast({ message, variant: 'success', duration });
    },
    [toast]
  );

  const error = useCallback(
    (message: string, duration?: number) => {
      toast({ message, variant: 'error', duration });
    },
    [toast]
  );

  const warning = useCallback(
    (message: string, duration?: number) => {
      toast({ message, variant: 'warning', duration });
    },
    [toast]
  );

  const info = useCallback(
    (message: string, duration?: number) => {
      toast({ message, variant: 'info', duration });
    },
    [toast]
  );

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider
      value={{
        toasts,
        toast,
        success,
        error,
        warning,
        info,
        dismiss,
        dismissAll,
      }}
    >
      {children}
      <ToastContainer toasts={toasts} onClose={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}
