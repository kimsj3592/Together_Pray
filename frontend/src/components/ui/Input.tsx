'use client';

import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, rightIcon, className, disabled, id, required, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = `${inputId}-error`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block mb-2 text-[var(--font-size-sm)] font-medium text-[rgb(var(--color-text-primary))]"
          >
            {label}
            {required && <span className="text-[rgb(var(--color-error))] ml-1" aria-label="필수 입력">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--color-text-tertiary))]" aria-hidden="true">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            required={required}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? errorId : undefined}
            className={cn(
              'w-full px-4 py-3 min-h-[44px]',
              'rounded-[var(--radius-lg)]',
              'text-[var(--font-size-base)]',
              'bg-[rgb(var(--color-bg-primary))]',
              'border border-[rgb(var(--color-border))]',
              'text-[rgb(var(--color-text-primary))]',
              'placeholder:text-[rgb(var(--color-text-tertiary))]',
              'transition-all duration-200 ease-in-out',
              'focus:outline-none focus:border-[rgb(var(--color-primary-500))] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              error && 'border-[rgb(var(--color-error))] focus:border-[rgb(var(--color-error))] focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgb(var(--color-text-tertiary))]" aria-hidden="true">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p id={errorId} className="mt-1.5 text-[var(--font-size-xs)] text-[rgb(var(--color-error))]" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, disabled, id, required, ...props }, ref) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = `${textareaId}-error`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block mb-2 text-[var(--font-size-sm)] font-medium text-[rgb(var(--color-text-primary))]"
          >
            {label}
            {required && <span className="text-[rgb(var(--color-error))] ml-1" aria-label="필수 입력">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          disabled={disabled}
          required={required}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            'w-full px-4 py-3',
            'rounded-[var(--radius-lg)]',
            'text-[var(--font-size-base)]',
            'bg-[rgb(var(--color-bg-primary))]',
            'border border-[rgb(var(--color-border))]',
            'text-[rgb(var(--color-text-primary))]',
            'placeholder:text-[rgb(var(--color-text-tertiary))]',
            'transition-all duration-200 ease-in-out',
            'focus:outline-none focus:border-[rgb(var(--color-primary-500))] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'resize-none',
            error && 'border-[rgb(var(--color-error))] focus:border-[rgb(var(--color-error))] focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]',
            className
          )}
          {...props}
        />
        {error && (
          <p id={errorId} className="mt-1.5 text-[var(--font-size-xs)] text-[rgb(var(--color-error))]" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
