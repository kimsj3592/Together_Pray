'use client';

import { useState, useCallback } from 'react';

export interface UseBottomSheetReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

/**
 * Custom hook for managing BottomSheet state
 *
 * @example
 * ```tsx
 * const bottomSheet = useBottomSheet();
 *
 * return (
 *   <>
 *     <Button onClick={bottomSheet.open}>기도제목 작성</Button>
 *     <BottomSheet isOpen={bottomSheet.isOpen} onClose={bottomSheet.close}>
 *       <PrayerForm />
 *     </BottomSheet>
 *   </>
 * );
 * ```
 */
export function useBottomSheet(initialState = false): UseBottomSheetReturn {
  const [isOpen, setIsOpen] = useState(initialState);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return {
    isOpen,
    open,
    close,
    toggle,
  };
}
