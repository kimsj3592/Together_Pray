/**
 * Framer Motion Animation System for Together Pray v2.0
 * Toss-style delightful micro-interactions
 */

import { Transition, Variants, HTMLMotionProps } from 'framer-motion';

// ================================================================================
// SPRING CONFIGURATIONS
// ================================================================================

export const springConfig = {
  /** Gentle spring - smooth and soft animations */
  gentle: {
    type: 'spring' as const,
    stiffness: 120,
    damping: 14,
  },
  /** Bouncy spring - playful with slight bounce */
  bouncy: {
    type: 'spring' as const,
    stiffness: 400,
    damping: 25,
  },
  /** Snappy spring - quick and responsive */
  snappy: {
    type: 'spring' as const,
    stiffness: 500,
    damping: 30,
  },
  /** Stiff spring - very quick, minimal overshoot */
  stiff: {
    type: 'spring' as const,
    stiffness: 700,
    damping: 30,
  },
};

// ================================================================================
// TRANSITION PRESETS
// ================================================================================

export const transitions = {
  /** Fast transition - 100ms ease-out */
  fast: {
    type: 'tween' as const,
    duration: 0.1,
    ease: 'easeOut',
  } as Transition,

  /** Normal transition - 200ms ease-out */
  normal: {
    type: 'tween' as const,
    duration: 0.2,
    ease: 'easeOut',
  } as Transition,

  /** Slow transition - 300ms ease-in-out */
  slow: {
    type: 'tween' as const,
    duration: 0.3,
    ease: 'easeInOut',
  } as Transition,

  /** Spring transition - snappy spring */
  spring: springConfig.snappy,

  /** Gentle spring transition */
  springGentle: springConfig.gentle,

  /** Bouncy spring transition */
  springBouncy: springConfig.bouncy,

  /** Modal open transition - 250ms spring */
  modalOpen: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 25,
    duration: 0.25,
  } as Transition,

  /** Modal close transition - 200ms ease-in */
  modalClose: {
    type: 'tween' as const,
    duration: 0.2,
    ease: 'easeIn',
  } as Transition,

  /** Bottom sheet transition - 300ms spring */
  bottomSheet: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 30,
    duration: 0.3,
  } as Transition,
};

// ================================================================================
// EASING FUNCTIONS
// ================================================================================

export const easings = {
  easeOut: [0.0, 0.0, 0.2, 1.0],
  easeIn: [0.4, 0.0, 1.0, 1.0],
  easeInOut: [0.4, 0.0, 0.2, 1.0],
  sharp: [0.4, 0.0, 0.6, 1.0],
} as const;

// ================================================================================
// ANIMATION VARIANTS
// ================================================================================

/** Fade in/out animation */
export const fadeIn: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
};

/** Fade in/out with custom transition */
export const fadeInWithTransition = (duration = 0.2): Variants => ({
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: duration * 0.8,
      ease: 'easeIn',
    },
  },
});

/** Slide up animation */
export const slideUp: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.normal,
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: transitions.fast,
  },
};

/** Slide down animation */
export const slideDown: Variants = {
  hidden: {
    opacity: 0,
    y: -20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.normal,
  },
  exit: {
    opacity: 0,
    y: 20,
    transition: transitions.fast,
  },
};

/** Slide left animation */
export const slideLeft: Variants = {
  hidden: {
    opacity: 0,
    x: 20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: transitions.normal,
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: transitions.fast,
  },
};

/** Slide right animation */
export const slideRight: Variants = {
  hidden: {
    opacity: 0,
    x: -20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: transitions.normal,
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: transitions.fast,
  },
};

/** Scale in/out animation */
export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: springConfig.snappy,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: transitions.fast,
  },
};

/** Scale out animation (for buttons/cards) */
export const scaleOut: Variants = {
  hidden: {
    opacity: 0,
    scale: 1.05,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: springConfig.snappy,
  },
  exit: {
    opacity: 0,
    scale: 1.05,
    transition: transitions.fast,
  },
};

/** Card hover animation */
export const cardHover: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  hover: {
    y: -2,
    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
    transition: {
      duration: 0.15,
      ease: 'easeOut',
    },
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.1,
      ease: 'easeOut',
    },
  },
};

/** Button tap animation */
export const buttonTap: Variants = {
  initial: {
    scale: 1,
  },
  hover: {
    scale: 1.02,
    transition: transitions.fast,
  },
  tap: {
    scale: 0.95,
    transition: transitions.fast,
  },
};

/** Page transition animation */
export const pageTransition: Variants = {
  initial: {
    opacity: 0,
    x: 20,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: transitions.slow,
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: transitions.slow,
  },
};

/** Modal overlay animation */
export const modalOverlay: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.15,
      ease: 'easeIn',
    },
  },
};

/** Modal content animation */
export const modalContent: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 10,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: transitions.modalOpen,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: transitions.modalClose,
  },
};

/** Bottom sheet animation */
export const bottomSheet: Variants = {
  hidden: {
    y: '100%',
  },
  visible: {
    y: 0,
    transition: transitions.bottomSheet,
  },
  exit: {
    y: '100%',
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  },
};

/** List item animation (for stagger) */
export const listItem: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.normal,
  },
};

/** List container animation (with stagger) */
export const listContainer: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

/** Toast notification animation */
export const toast: Variants = {
  hidden: {
    opacity: 0,
    y: -50,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: springConfig.bouncy,
  },
  exit: {
    opacity: 0,
    y: -50,
    scale: 0.95,
    transition: transitions.fast,
  },
};

/** Success confetti particle animation */
export const confettiParticle = (x: number, y: number, rotation: number, scale: number): Variants => ({
  hidden: {
    x: 0,
    y: 0,
    opacity: 1,
    scale: 0,
    rotate: 0,
  },
  visible: {
    x,
    y,
    opacity: 0,
    scale,
    rotate: rotation,
    transition: {
      duration: 1,
      ease: 'easeOut',
    },
  },
});

// ================================================================================
// GESTURE ANIMATION PROPS
// ================================================================================

/** Standard tap animation props for buttons */
export const tapAnimation: HTMLMotionProps<'button'> = {
  whileTap: { scale: 0.95 },
  transition: springConfig.snappy,
};

/** Standard hover animation props for cards */
export const hoverAnimation: HTMLMotionProps<'div'> = {
  whileHover: { y: -2, boxShadow: '0 8px 30px rgba(0,0,0,0.12)' },
  whileTap: { scale: 0.98 },
  transition: {
    duration: 0.15,
    ease: 'easeOut',
  },
};

/** Drag constraints for bottom sheet */
export const dragConstraints = {
  top: 0,
  bottom: 0,
};

// ================================================================================
// UTILITY FUNCTIONS
// ================================================================================

/**
 * Create stagger animation for list children
 * @param staggerDelay - Delay between each child animation (default: 0.05s)
 * @param delayChildren - Initial delay before starting animations (default: 0s)
 */
export const createStaggerContainer = (
  staggerDelay = 0.05,
  delayChildren = 0
): Variants => ({
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: staggerDelay,
      delayChildren,
    },
  },
});

/**
 * Create custom slide animation with direction and distance
 * @param direction - Direction of slide: 'up' | 'down' | 'left' | 'right'
 * @param distance - Distance to slide in pixels (default: 20)
 */
export const createSlideAnimation = (
  direction: 'up' | 'down' | 'left' | 'right',
  distance = 20
): Variants => {
  const axis = direction === 'up' || direction === 'down' ? 'y' : 'x';
  const value =
    direction === 'up' || direction === 'left' ? distance : -distance;

  if (axis === 'y') {
    return {
      hidden: {
        opacity: 0,
        y: value,
      },
      visible: {
        opacity: 1,
        y: 0,
        transition: transitions.normal,
      },
      exit: {
        opacity: 0,
        y: -value,
        transition: transitions.fast,
      },
    };
  }

  return {
    hidden: {
      opacity: 0,
      x: value,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: transitions.normal,
    },
    exit: {
      opacity: 0,
      x: -value,
      transition: transitions.fast,
    },
  };
};

/**
 * Create scale animation with custom scale values
 * @param initialScale - Initial scale value (default: 0.95)
 * @param targetScale - Target scale value (default: 1)
 */
export const createScaleAnimation = (
  initialScale = 0.95,
  targetScale = 1
): Variants => ({
  hidden: {
    opacity: 0,
    scale: initialScale,
  },
  visible: {
    opacity: 1,
    scale: targetScale,
    transition: springConfig.snappy,
  },
  exit: {
    opacity: 0,
    scale: initialScale,
    transition: transitions.fast,
  },
});

// ================================================================================
// PRESET ANIMATION PROPS
// ================================================================================

/**
 * Complete animation props for page transitions
 * Usage: <motion.div {...pageTransitionProps}>
 */
export const pageTransitionProps: HTMLMotionProps<'div'> = {
  initial: 'initial',
  animate: 'animate',
  exit: 'exit',
  variants: pageTransition,
};

/**
 * Complete animation props for modal content
 * Usage: <motion.div {...modalContentProps}>
 */
export const modalContentProps: HTMLMotionProps<'div'> = {
  initial: 'hidden',
  animate: 'visible',
  exit: 'exit',
  variants: modalContent,
};

/**
 * Complete animation props for bottom sheet
 * Usage: <motion.div {...bottomSheetProps}>
 */
export const bottomSheetProps: HTMLMotionProps<'div'> = {
  initial: 'hidden',
  animate: 'visible',
  exit: 'exit',
  variants: bottomSheet,
  drag: 'y',
  dragConstraints: { top: 0 },
  dragElastic: 0.2,
};

/**
 * Complete animation props for fade in
 * Usage: <motion.div {...fadeInProps}>
 */
export const fadeInProps: HTMLMotionProps<'div'> = {
  initial: 'hidden',
  animate: 'visible',
  exit: 'exit',
  variants: fadeIn,
};

/**
 * Complete animation props for cards with hover effect
 * Usage: <motion.div {...cardProps}>
 */
export const cardProps: HTMLMotionProps<'div'> = {
  initial: 'initial',
  animate: 'animate',
  whileHover: 'hover',
  whileTap: 'tap',
  variants: cardHover,
};

/**
 * Complete animation props for buttons with tap effect
 * Usage: <motion.button {...buttonProps}>
 */
export const buttonProps: HTMLMotionProps<'button'> = {
  initial: 'initial',
  whileHover: 'hover',
  whileTap: 'tap',
  variants: buttonTap,
};

// ================================================================================
// REDUCED MOTION SUPPORT
// ================================================================================

/**
 * Check if user prefers reduced motion
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Get animation variant based on reduced motion preference
 * @param normalVariant - Normal animation variant
 * @param reducedVariant - Reduced motion variant (default: instant transition)
 */
export const getMotionVariant = <T extends Variants>(
  normalVariant: T,
  reducedVariant?: T
): T => {
  if (prefersReducedMotion()) {
    return (
      reducedVariant || {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0 } },
      }
    ) as T;
  }
  return normalVariant;
};
