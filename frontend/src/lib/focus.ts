/**
 * Focus Management Utilities
 *
 * Utilities for managing focus, keyboard navigation, and accessibility
 */

/**
 * Focus the first focusable element within a container
 */
export const focusFirst = (container: HTMLElement): boolean => {
  const focusableElements = getFocusableElements(container);
  const firstElement = focusableElements[0] as HTMLElement;

  if (firstElement) {
    firstElement.focus();
    return true;
  }

  return false;
};

/**
 * Focus the last focusable element within a container
 */
export const focusLast = (container: HTMLElement): boolean => {
  const focusableElements = getFocusableElements(container);
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

  if (lastElement) {
    lastElement.focus();
    return true;
  }

  return false;
};

/**
 * Get all focusable elements within a container
 */
export const getFocusableElements = (container: HTMLElement): Element[] => {
  const selector = [
    'button:not([disabled])',
    '[href]',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(', ');

  return Array.from(container.querySelectorAll(selector));
};

/**
 * Create a focus trap within a container
 * Returns cleanup function
 */
export const createFocusTrap = (container: HTMLElement): (() => void) => {
  const focusableElements = getFocusableElements(container);
  const firstElement = focusableElements[0] as HTMLElement;
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

  const handleTab = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    // Shift+Tab: Focus last element when on first
    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      }
    }
    // Tab: Focus first element when on last
    else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    }
  };

  // Focus first element initially
  firstElement?.focus();

  // Add event listener
  document.addEventListener('keydown', handleTab);

  // Return cleanup function
  return () => {
    document.removeEventListener('keydown', handleTab);
  };
};

/**
 * Restore focus to a previously focused element
 */
export const createFocusReturn = (): (() => void) => {
  const previouslyFocused = document.activeElement as HTMLElement;

  return () => {
    if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
      previouslyFocused.focus();
    }
  };
};

/**
 * Check if an element is currently visible
 */
export const isElementVisible = (element: HTMLElement): boolean => {
  return !!(
    element.offsetWidth ||
    element.offsetHeight ||
    element.getClientRects().length
  );
};

/**
 * Find the next focusable element after the current element
 */
export const focusNextElement = (currentElement: HTMLElement, container?: HTMLElement): boolean => {
  const root = container || document.body;
  const focusableElements = getFocusableElements(root);
  const currentIndex = focusableElements.indexOf(currentElement);

  if (currentIndex !== -1 && currentIndex < focusableElements.length - 1) {
    const nextElement = focusableElements[currentIndex + 1] as HTMLElement;
    nextElement.focus();
    return true;
  }

  return false;
};

/**
 * Find the previous focusable element before the current element
 */
export const focusPreviousElement = (currentElement: HTMLElement, container?: HTMLElement): boolean => {
  const root = container || document.body;
  const focusableElements = getFocusableElements(root);
  const currentIndex = focusableElements.indexOf(currentElement);

  if (currentIndex > 0) {
    const previousElement = focusableElements[currentIndex - 1] as HTMLElement;
    previousElement.focus();
    return true;
  }

  return false;
};
