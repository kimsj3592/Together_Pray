'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast as toastVariants } from '@/lib/animations';

export interface ToastProps {
  id: string;
  message: string;
  variant?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose: (id: string) => void;
}

const variantConfig = {
  success: {
    icon: CheckCircle,
    bgColor: 'bg-[rgb(var(--color-success))]/10',
    borderColor: 'border-[rgb(var(--color-success))]/20',
    iconColor: 'text-[rgb(var(--color-success))]',
    textColor: 'text-[rgb(var(--color-success))]',
  },
  error: {
    icon: AlertCircle,
    bgColor: 'bg-[rgb(var(--color-error))]/10',
    borderColor: 'border-[rgb(var(--color-error))]/20',
    iconColor: 'text-[rgb(var(--color-error))]',
    textColor: 'text-[rgb(var(--color-error))]',
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-[rgb(var(--color-warning))]/10',
    borderColor: 'border-[rgb(var(--color-warning))]/20',
    iconColor: 'text-[rgb(var(--color-warning))]',
    textColor: 'text-[rgb(var(--color-warning))]',
  },
  info: {
    icon: Info,
    bgColor: 'bg-[rgb(var(--color-info))]/10',
    borderColor: 'border-[rgb(var(--color-info))]/20',
    iconColor: 'text-[rgb(var(--color-info))]',
    textColor: 'text-[rgb(var(--color-info))]',
  },
};

export default function Toast({
  id,
  message,
  variant = 'info',
  duration = 3000,
  onClose,
}: ToastProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  // Auto dismiss
  useEffect(() => {
    if (duration === Infinity) return;

    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  return (
    <motion.div
      layout
      variants={toastVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={cn(
        'flex items-start gap-3 p-4 rounded-lg border',
        'bg-[rgb(var(--color-bg-card))]',
        'shadow-md backdrop-blur-sm',
        'min-w-[300px] max-w-[500px]',
        config.bgColor,
        config.borderColor
      )}
      role="alert"
      aria-live="polite"
    >
      {/* Icon */}
      <Icon size={20} className={cn('flex-shrink-0 mt-0.5', config.iconColor)} />

      {/* Message */}
      <p className="flex-1 text-sm font-medium text-[rgb(var(--color-text-primary))]">
        {message}
      </p>

      {/* Close Button */}
      <button
        type="button"
        onClick={() => onClose(id)}
        className={cn(
          'flex-shrink-0 p-1 rounded-md',
          'text-[rgb(var(--color-text-secondary))]',
          'hover:bg-[rgb(var(--color-gray-100))]',
          'dark:hover:bg-[rgb(var(--color-gray-800))]',
          'transition-colors'
        )}
        aria-label="닫기"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
}
