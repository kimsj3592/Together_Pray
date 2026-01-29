'use client';

import Modal from './Modal';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'default';
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = '확인',
  cancelText = '취소',
  variant = 'default',
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

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
        {variant === 'danger' && (
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[rgb(var(--color-accent-red))]/10">
            <AlertCircle
              size={24}
              className="text-[rgb(var(--color-accent-red))]"
            />
          </div>
        )}

        {/* Title */}
        <h3 className="text-lg font-semibold text-[rgb(var(--color-text-primary))]">
          {title}
        </h3>

        {/* Message */}
        <p className="text-base text-[rgb(var(--color-text-secondary))]">
          {message}
        </p>

        {/* Actions */}
        <div className="flex gap-3 w-full pt-2">
          <button
            type="button"
            onClick={onClose}
            className={cn(
              'flex-1 px-4 py-3 rounded-lg font-medium',
              'bg-[rgb(var(--color-gray-100))]',
              'text-[rgb(var(--color-text-primary))]',
              'hover:bg-[rgb(var(--color-gray-200))]',
              'dark:bg-[rgb(var(--color-gray-800))]',
              'dark:hover:bg-[rgb(var(--color-gray-700))]',
              'transition-colors',
              'min-h-[44px]'
            )}
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className={cn(
              'flex-1 px-4 py-3 rounded-lg font-medium',
              'transition-colors',
              'min-h-[44px]',
              variant === 'danger'
                ? [
                    'bg-[rgb(var(--color-accent-red))]',
                    'text-white',
                    'hover:bg-[rgb(var(--color-accent-red))]/90',
                  ]
                : [
                    'bg-[rgb(var(--color-primary-600))]',
                    'text-white',
                    'hover:bg-[rgb(var(--color-primary-700))]',
                  ]
            )}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
