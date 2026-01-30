'use client';

import { useEffect, useCallback } from 'react';

export type KeyboardShortcut = {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  callback: () => void;
  description: string;
};

/**
 * Hook for managing keyboard shortcuts
 */
export const useKeyboardShortcuts = (shortcuts: KeyboardShortcut[]) => {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const matchingShortcut = shortcuts.find((shortcut) => {
        const keyMatches = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatches = shortcut.ctrlKey ? event.ctrlKey : !event.ctrlKey;
        const metaMatches = shortcut.metaKey ? event.metaKey : !event.metaKey;
        const shiftMatches = shortcut.shiftKey ? event.shiftKey : !event.shiftKey;
        const altMatches = shortcut.altKey ? event.altKey : !event.altKey;

        return keyMatches && ctrlMatches && metaMatches && shiftMatches && altMatches;
      });

      if (matchingShortcut) {
        event.preventDefault();
        matchingShortcut.callback();
      }
    },
    [shortcuts]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return { shortcuts };
};

/**
 * Default keyboard shortcuts for Together Pray
 */
export const DEFAULT_SHORTCUTS: KeyboardShortcut[] = [
  {
    key: 'n',
    description: '새 기도제목 작성',
    callback: () => {
      // Will be overridden by component
      console.log('New prayer item');
    },
  },
  {
    key: '/',
    description: '검색 포커스',
    callback: () => {
      // Will be overridden by component
      console.log('Focus search');
    },
  },
  {
    key: 'Escape',
    description: '모달/바텀시트 닫기',
    callback: () => {
      // Will be overridden by component
      console.log('Close modal');
    },
  },
  {
    key: '?',
    shiftKey: true,
    description: '단축키 도움말',
    callback: () => {
      // Will be overridden by component
      console.log('Show help');
    },
  },
];
