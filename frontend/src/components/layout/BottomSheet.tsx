'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { motion, AnimatePresence, useDragControls, PanInfo } from 'framer-motion';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { transitions, modalOverlay } from '@/lib/animations';

export interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  snapPoints?: number[]; // Height percentages (0.5 = 50%, 0.9 = 90%)
  initialSnap?: number; // Index of snapPoints array
  title?: string;
  showHeader?: boolean;
  showHandle?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  className?: string;
}

export default function BottomSheet({
  isOpen,
  onClose,
  children,
  snapPoints = [0.5, 0.9],
  initialSnap = 0,
  title,
  showHeader = true,
  showHandle = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className,
}: BottomSheetProps) {
  const dragControls = useDragControls();
  const sheetRef = useRef<HTMLDivElement>(null);
  const [currentSnapIndex, setCurrentSnapIndex] = useState(initialSnap);
  const [isDragging, setIsDragging] = useState(false);

  // Calculate snap point heights in pixels
  const getSnapHeight = useCallback((snapPercentage: number) => {
    if (typeof window === 'undefined') return 0;
    return window.innerHeight * snapPercentage;
  }, []);

  // Get current snap height
  const currentSnapHeight = getSnapHeight(snapPoints[currentSnapIndex]);

  // Handle drag end - snap to nearest point
  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const { offset, velocity } = info;
      const swipeVelocityThreshold = 500;
      const swipeDistanceThreshold = 100;

      // Close if swiped down significantly
      if (
        offset.y > swipeDistanceThreshold ||
        velocity.y > swipeVelocityThreshold
      ) {
        onClose();
        return;
      }

      // Snap to nearest snap point
      const currentY = Math.abs(offset.y);
      let nearestSnapIndex = currentSnapIndex;
      let minDistance = Infinity;

      snapPoints.forEach((snapPoint, index) => {
        const snapHeight = getSnapHeight(snapPoint);
        const distance = Math.abs(currentY - (window.innerHeight - snapHeight));

        if (distance < minDistance) {
          minDistance = distance;
          nearestSnapIndex = index;
        }
      });

      setCurrentSnapIndex(nearestSnapIndex);
      setIsDragging(false);
    },
    [currentSnapIndex, snapPoints, getSnapHeight, onClose]
  );

  // ESC key handler
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // Body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [isOpen]);

  // Focus trap
  useEffect(() => {
    if (!isOpen || !sheetRef.current) return;

    const focusableElements = sheetRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTab);
    firstElement?.focus();

    return () => document.removeEventListener('keydown', handleTab);
  }, [isOpen]);

  // Keyboard aware (visual viewport API)
  useEffect(() => {
    if (!isOpen || typeof window === 'undefined' || !window.visualViewport) return;

    const viewport = window.visualViewport;

    const handleResize = () => {
      if (sheetRef.current) {
        const keyboardHeight = window.innerHeight - viewport.height;
        if (keyboardHeight > 100) {
          // Keyboard is open - adjust sheet height
          sheetRef.current.style.maxHeight = `${viewport.height - 20}px`;
        } else {
          // Keyboard is closed - reset
          sheetRef.current.style.maxHeight = '';
        }
      }
    };

    viewport.addEventListener('resize', handleResize);
    return () => viewport.removeEventListener('resize', handleResize);
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            variants={modalOverlay}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={closeOnOverlayClick ? onClose : undefined}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Bottom Sheet */}
          <motion.div
            ref={sheetRef}
            drag="y"
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.2 }}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={handleDragEnd}
            initial={{ y: '100%' }}
            animate={{
              y: isDragging ? undefined : 0,
              height: currentSnapHeight,
              transition: transitions.bottomSheet,
            }}
            exit={{
              y: '100%',
              transition: {
                duration: 0.2,
                ease: 'easeIn',
              },
            }}
            className={cn(
              'fixed bottom-0 left-0 right-0 z-50',
              'flex flex-col',
              'bg-[rgb(var(--color-bg-card))]',
              'rounded-t-[24px]',
              'shadow-xl',
              'overflow-hidden',
              className
            )}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'bottom-sheet-title' : undefined}
          >
            {/* Drag Handle */}
            {showHandle && (
              <div
                onPointerDown={(e) => dragControls.start(e)}
                className="flex items-center justify-center py-3 cursor-grab active:cursor-grabbing touch-none"
              >
                <div className="w-10 h-1 bg-[rgb(var(--color-gray-300))] dark:bg-[rgb(var(--color-gray-700))] rounded-full" />
              </div>
            )}

            {/* Header */}
            {showHeader && (
              <div className="flex items-center justify-between px-5 py-4 border-b border-[rgb(var(--color-border))]">
                {title && (
                  <h2
                    id="bottom-sheet-title"
                    className="text-lg font-semibold text-[rgb(var(--color-text-primary))]"
                  >
                    {title}
                  </h2>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className={cn(
                    'p-2 rounded-lg',
                    'text-[rgb(var(--color-text-secondary))]',
                    'hover:bg-[rgb(var(--color-gray-100))]',
                    'dark:hover:bg-[rgb(var(--color-gray-800))]',
                    'transition-colors',
                    'min-w-[44px] min-h-[44px]',
                    'flex items-center justify-center',
                    !title && 'ml-auto'
                  )}
                  aria-label="닫기"
                >
                  <X size={20} />
                </button>
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
