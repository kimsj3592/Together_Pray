'use client';

import Modal from './Modal';
import { CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  confirmText?: string;
  variant?: 'success' | 'error' | 'warning' | 'info';
}

const variantConfig = {
  success: {
    icon: CheckCircle,
    bgColor: 'bg-[rgb(var(--color-success))]/10',
    iconColor: 'text-[rgb(var(--color-success))]',
  },
  error: {
    icon: AlertCircle,
    bgColor: 'bg-[rgb(var(--color-error))]/10',
    iconColor: 'text-[rgb(var(--color-error))]',
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-[rgb(var(--color-warning))]/10',
    iconColor: 'text-[rgb(var(--color-warning))]',
  },
  info: {
    icon: Info,
    bgColor: 'bg-[rgb(var(--color-info))]/10',
    iconColor: 'text-[rgb(var(--color-info))]',
  },
};

export default function AlertDialog({
  isOpen,
  onClose,
  title,
  message,
  confirmText = '확인',
  variant = 'info',
}: AlertDialogProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      showCloseButton={false}
      closeOnOverlayClick={false}
    >
      <div className="flex flex-col items-center text-center space-y-4">
        {/* Icon */}
        <div
          className={cn(
            'flex items-center justify-center w-12 h-12 rounded-full',
            config.bgColor
          )}
        >
          <Icon size={24} className={config.iconColor} />
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-[rgb(var(--color-text-primary))]">
          {title}
        </h3>

        {/* Message */}
        <p className="text-base text-[rgb(var(--color-text-secondary))]">
          {message}
        </p>

        {/* Action */}
        <button
          type="button"
          onClick={onClose}
          className={cn(
            'w-full px-4 py-3 rounded-lg font-medium',
            'bg-[rgb(var(--color-primary-600))]',
            'text-white',
            'hover:bg-[rgb(var(--color-primary-700))]',
            'transition-colors',
            'min-h-[44px]',
            'mt-2'
          )}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
}
