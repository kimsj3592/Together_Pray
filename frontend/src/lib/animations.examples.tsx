/**
 * Animation System Usage Examples
 * Together Pray v2.0 - Framer Motion Implementation Examples
 */

import { motion, AnimatePresence } from 'framer-motion';
import {
  // Variants
  fadeIn,
  slideUp,
  cardHover,
  buttonTap,
  pageTransition,
  modalOverlay,
  modalContent,
  bottomSheet,
  listContainer,
  listItem,
  toast,

  // Preset Props
  pageTransitionProps,
  modalContentProps,
  bottomSheetProps,
  fadeInProps,
  cardProps,
  buttonProps,

  // Gesture Props
  tapAnimation,
  hoverAnimation,

  // Spring Configs
  springConfig,
  transitions,

  // Utility Functions
  createStaggerContainer,
  createSlideAnimation,
  createScaleAnimation,
  getMotionVariant,
} from './animations';

// ================================================================================
// 1. BUTTON ANIMATIONS
// ================================================================================

// Simple button with tap animation
export function SimpleButton() {
  return (
    <motion.button
      className="px-6 py-3 bg-blue-500 text-white rounded-lg"
      {...tapAnimation}
    >
      Click Me
    </motion.button>
  );
}

// Button with full variants
export function VariantButton() {
  return (
    <motion.button
      className="px-6 py-3 bg-blue-500 text-white rounded-lg"
      {...buttonProps}
    >
      Hover & Click
    </motion.button>
  );
}

// Custom button with spring animation
export function SpringButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      className="px-6 py-3 bg-primary-500 text-white rounded-lg"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      transition={springConfig.snappy}
      onClick={onClick}
    >
      기도하기
    </motion.button>
  );
}

// ================================================================================
// 2. CARD ANIMATIONS
// ================================================================================

// Prayer card with hover effect
export function PrayerCard({ title, content }: { title: string; content: string }) {
  return (
    <motion.div
      className="p-4 bg-white rounded-lg shadow-md"
      {...cardProps}
    >
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-gray-600">{content}</p>
    </motion.div>
  );
}

// Card with custom hover animation
export function HoverCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className="p-6 bg-white rounded-xl shadow-sm"
      {...hoverAnimation}
    >
      {children}
    </motion.div>
  );
}

// ================================================================================
// 3. PAGE TRANSITIONS
// ================================================================================

// Basic page wrapper
export function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div {...pageTransitionProps}>
      {children}
    </motion.div>
  );
}

// Page with custom transition
export function CustomPageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  );
}

// ================================================================================
// 4. MODAL ANIMATIONS
// ================================================================================

// Complete modal component
export function Modal({
  isOpen,
  onClose,
  children
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            variants={modalOverlay}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-md mx-auto bg-white rounded-2xl p-6 shadow-xl z-50"
            {...modalContentProps}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ================================================================================
// 5. BOTTOM SHEET ANIMATIONS
// ================================================================================

// Bottom sheet with drag to close
export function BottomSheet({
  isOpen,
  onClose,
  children
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const handleDragEnd = (event: any, info: any) => {
    if (info.velocity.y > 500 || info.offset.y > 200) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            variants={modalOverlay}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-h-[90vh] overflow-y-auto"
            variants={bottomSheet}
            initial="hidden"
            animate="visible"
            exit="exit"
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
          >
            {/* Drag Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>

            <div className="px-4 pb-8">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ================================================================================
// 6. LIST ANIMATIONS (STAGGER)
// ================================================================================

// Prayer list with stagger animation
export function PrayerList({ prayers }: { prayers: Array<{ id: string; title: string }> }) {
  return (
    <motion.ul
      className="space-y-3"
      variants={listContainer}
      initial="hidden"
      animate="visible"
    >
      {prayers.map((prayer) => (
        <motion.li
          key={prayer.id}
          className="p-4 bg-white rounded-lg shadow-sm"
          variants={listItem}
        >
          {prayer.title}
        </motion.li>
      ))}
    </motion.ul>
  );
}

// Custom stagger with different timing
export function CustomStaggerList({ items }: { items: string[] }) {
  const customStagger = createStaggerContainer(0.1, 0.2);

  return (
    <motion.div
      variants={customStagger}
      initial="hidden"
      animate="visible"
    >
      {items.map((item, index) => (
        <motion.div
          key={index}
          variants={listItem}
          className="p-3 bg-gray-100 rounded-lg mb-2"
        >
          {item}
        </motion.div>
      ))}
    </motion.div>
  );
}

// ================================================================================
// 7. TOAST NOTIFICATIONS
// ================================================================================

// Toast notification
export function Toast({
  isVisible,
  message,
  onClose
}: {
  isVisible: boolean;
  message: string;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed top-4 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-lg z-50"
          variants={toast}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ================================================================================
// 8. SKELETON SHIMMER
// ================================================================================

// Skeleton loading animation
export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-gray-200 rounded-lg ${className || 'h-20'}`}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  );
}

// ================================================================================
// 9. CONFETTI ANIMATION
// ================================================================================

// Success confetti effect
export function Confetti({ trigger }: { trigger: boolean }) {
  if (!trigger) return null;

  const emojis = ['🙏', '✨', '💫', '🌟', '💖'];
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    emoji: emojis[i % emojis.length],
    x: Math.random() * 200 - 100,
    y: -(Math.random() * 200 + 100),
    rotation: Math.random() * 360,
    scale: 0.5 + Math.random() * 0.5,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute left-1/2 top-1/2 text-2xl"
          initial={{
            x: 0,
            y: 0,
            opacity: 1,
            scale: 0,
            rotate: 0,
          }}
          animate={{
            x: particle.x,
            y: particle.y,
            opacity: 0,
            scale: particle.scale,
            rotate: particle.rotation,
          }}
          transition={{
            duration: 1,
            ease: 'easeOut',
          }}
        >
          {particle.emoji}
        </motion.div>
      ))}
    </div>
  );
}

// ================================================================================
// 10. LONG PRESS PRAY BUTTON
// ================================================================================

// Pray button with long press and progress indicator
export function PrayButton({
  onPray,
  disabled = false
}: {
  onPray: () => void;
  disabled?: boolean;
}) {
  const [isPressing, setIsPressing] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const timerRef = React.useRef<NodeJS.Timeout>();
  const progressRef = React.useRef<NodeJS.Timeout>();

  const LONG_PRESS_DURATION = 800;

  const startPress = () => {
    if (disabled) return;

    setIsPressing(true);
    setProgress(0);

    const startTime = Date.now();
    progressRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      setProgress(Math.min(elapsed / LONG_PRESS_DURATION, 1));
    }, 16);

    timerRef.current = setTimeout(() => {
      completePress();
    }, LONG_PRESS_DURATION);
  };

  const cancelPress = () => {
    setIsPressing(false);
    setProgress(0);
    clearTimeout(timerRef.current);
    clearInterval(progressRef.current);
  };

  const completePress = () => {
    setIsPressing(false);
    clearInterval(progressRef.current);

    if (navigator.vibrate) {
      navigator.vibrate(50);
    }

    onPray();
  };

  React.useEffect(() => {
    return () => {
      clearTimeout(timerRef.current);
      clearInterval(progressRef.current);
    };
  }, []);

  return (
    <motion.button
      className="relative overflow-hidden rounded-xl px-6 py-3 bg-primary-500 text-white disabled:opacity-50"
      onPointerDown={startPress}
      onPointerUp={cancelPress}
      onPointerLeave={cancelPress}
      whileTap={{ scale: 0.95 }}
      disabled={disabled}
    >
      {/* Progress Ring */}
      {isPressing && (
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            fill="none"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="2"
            strokeDasharray={`${progress * 283} 283`}
          />
        </svg>
      )}

      <span className="relative z-10">
        {isPressing ? '🙏 누르는 중...' : '기도하기'}
      </span>
    </motion.button>
  );
}

// ================================================================================
// 11. REDUCED MOTION SUPPORT
// ================================================================================

// Component that respects reduced motion preference
export function AccessibleAnimation({ children }: { children: React.ReactNode }) {
  const variant = getMotionVariant(slideUp);

  return (
    <motion.div
      variants={variant}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  );
}

// ================================================================================
// 12. CUSTOM ANIMATIONS WITH UTILITIES
// ================================================================================

// Custom slide direction
export function CustomSlide({ direction }: { direction: 'up' | 'down' | 'left' | 'right' }) {
  const slideVariant = createSlideAnimation(direction, 30);

  return (
    <motion.div
      variants={slideVariant}
      initial="hidden"
      animate="visible"
      className="p-4 bg-blue-100 rounded-lg"
    >
      Sliding from {direction}
    </motion.div>
  );
}

// Custom scale animation
export function CustomScale() {
  const scaleVariant = createScaleAnimation(0.8, 1.1);

  return (
    <motion.div
      variants={scaleVariant}
      initial="hidden"
      animate="visible"
      className="p-4 bg-green-100 rounded-lg"
    >
      Custom scale animation
    </motion.div>
  );
}

// Re-export React for PrayButton example
import React from 'react';
