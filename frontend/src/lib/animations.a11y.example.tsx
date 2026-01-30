/**
 * Accessibility-Aware Animation Examples
 *
 * How to use useReducedMotion hook with Framer Motion
 */

import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

// Example 1: Simple animation with reduced motion support
export function AnimatedCard() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={
        shouldReduceMotion
          ? { duration: 0 } // Instant
          : { duration: 0.3, ease: 'easeOut' } // Animated
      }
    >
      Card Content
    </motion.div>
  );
}

// Example 2: Conditional animation variants
export function AnimatedButton() {
  const shouldReduceMotion = useReducedMotion();

  const variants = {
    initial: { scale: 1 },
    hover: shouldReduceMotion ? { scale: 1 } : { scale: 1.05 },
    tap: shouldReduceMotion ? { scale: 1 } : { scale: 0.95 },
  };

  return (
    <motion.button
      variants={variants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      transition={{ duration: 0.1 }}
    >
      Click Me
    </motion.button>
  );
}

// Example 3: Complex animation with fallback
export function AnimatedModal({ isOpen }: { isOpen: boolean }) {
  const shouldReduceMotion = useReducedMotion();

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const contentVariants = {
    hidden: shouldReduceMotion
      ? { opacity: 0 }
      : { opacity: 0, scale: 0.9, y: 20 },
    visible: shouldReduceMotion
      ? { opacity: 1 }
      : { opacity: 1, scale: 1, y: 0 },
  };

  return (
    <>
      <motion.div
        variants={backdropVariants}
        initial="hidden"
        animate={isOpen ? 'visible' : 'hidden'}
        transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
        className="fixed inset-0 bg-black/50"
      />
      <motion.div
        variants={contentVariants}
        initial="hidden"
        animate={isOpen ? 'visible' : 'hidden'}
        transition={{
          duration: shouldReduceMotion ? 0 : 0.3,
          ease: 'easeOut',
        }}
        className="fixed inset-0 flex items-center justify-center"
      >
        Modal Content
      </motion.div>
    </>
  );
}

// Example 4: Using in shared animation config
export function getAnimationConfig(shouldReduceMotion: boolean) {
  return {
    duration: shouldReduceMotion ? 0 : 0.3,
    ease: shouldReduceMotion ? 'linear' : 'easeOut',
  };
}

export function SmartAnimatedComponent() {
  const shouldReduceMotion = useReducedMotion();
  const animationConfig = getAnimationConfig(shouldReduceMotion);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={animationConfig}
    >
      Smart Component
    </motion.div>
  );
}

// Example 5: List animations with reduced motion
export function AnimatedList({ items }: { items: string[] }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <ul>
      {items.map((item, index) => (
        <motion.li
          key={item}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : {
                  duration: 0.3,
                  delay: index * 0.1, // Stagger effect
                  ease: 'easeOut',
                }
          }
        >
          {item}
        </motion.li>
      ))}
    </ul>
  );
}

// Example 6: Spring animations with reduced motion
export function SpringButton() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.button
      whileHover={shouldReduceMotion ? {} : { scale: 1.1 }}
      whileTap={shouldReduceMotion ? {} : { scale: 0.9 }}
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : {
              type: 'spring',
              stiffness: 400,
              damping: 17,
            }
      }
    >
      Spring Button
    </motion.button>
  );
}

// Example 7: Gesture animations
export function DraggableCard() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      drag={!shouldReduceMotion} // Disable drag if reduced motion
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={shouldReduceMotion ? 0 : 0.2}
      dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
    >
      Draggable Card
    </motion.div>
  );
}
