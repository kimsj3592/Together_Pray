/**
 * Animation System Test Demo Component
 * Use this to verify all animations work correctly
 */

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  // Variants
  fadeIn,
  slideUp,
  slideDown,
  slideLeft,
  slideRight,
  scaleIn,
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
  buttonProps,
  cardProps,

  // Gesture Props
  tapAnimation,
  hoverAnimation,

  // Spring Configs
  springConfig,
  transitions,

  // Utilities
  createStaggerContainer,
  createSlideAnimation,
  prefersReducedMotion,
} from './animations';

export default function AnimationTestDemo() {
  const [showModal, setShowModal] = useState(false);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'interactive' | 'complex'>('basic');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={transitions.normal}
        >
          <h1 className="text-3xl font-bold text-gray-900">
            Animation System Test Demo
          </h1>
          <p className="mt-2 text-gray-600">
            Together Pray v2.0 - Framer Motion Animations
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Reduced Motion: {prefersReducedMotion() ? 'Enabled' : 'Disabled'}
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-gray-200">
          {(['basic', 'interactive', 'complex'] as const).map((tab) => (
            <motion.button
              key={tab}
              className={`px-4 py-2 font-medium capitalize ${
                activeTab === tab
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </motion.button>
          ))}
        </div>

        {/* Basic Animations Tab */}
        {activeTab === 'basic' && (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={transitions.normal}
          >
            <SectionTitle>Fade Animations</SectionTitle>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <AnimationCard variants={fadeIn} label="Fade In" />
              <AnimationCard variants={slideUp} label="Slide Up" />
              <AnimationCard variants={slideDown} label="Slide Down" />
              <AnimationCard variants={slideLeft} label="Slide Left" />
            </div>

            <SectionTitle>Scale Animations</SectionTitle>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <AnimationCard variants={scaleIn} label="Scale In" />
              <AnimationCard variants={slideRight} label="Slide Right" />
            </div>
          </motion.div>
        )}

        {/* Interactive Tab */}
        {activeTab === 'interactive' && (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={transitions.normal}
          >
            <SectionTitle>Buttons</SectionTitle>
            <div className="flex flex-wrap gap-4">
              <motion.button
                className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium"
                {...buttonProps}
              >
                Button Props
              </motion.button>

              <motion.button
                className="px-6 py-3 bg-green-500 text-white rounded-lg font-medium"
                whileTap={{ scale: 0.95 }}
                transition={springConfig.snappy}
              >
                Tap Animation
              </motion.button>

              <motion.button
                className="px-6 py-3 bg-purple-500 text-white rounded-lg font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={springConfig.bouncy}
              >
                Bouncy Spring
              </motion.button>
            </div>

            <SectionTitle>Cards</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div
                className="p-6 bg-white rounded-xl shadow-sm"
                {...cardProps}
              >
                <h3 className="text-lg font-semibold mb-2">Card with Hover</h3>
                <p className="text-gray-600">Hover and tap to see effects</p>
              </motion.div>

              <motion.div
                className="p-6 bg-white rounded-xl shadow-sm"
                {...hoverAnimation}
              >
                <h3 className="text-lg font-semibold mb-2">Hover Animation</h3>
                <p className="text-gray-600">Simple hover effect</p>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Complex Tab */}
        {activeTab === 'complex' && (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={transitions.normal}
          >
            <SectionTitle>Overlays & Sheets</SectionTitle>
            <div className="flex flex-wrap gap-4">
              <motion.button
                className="px-6 py-3 bg-indigo-500 text-white rounded-lg font-medium"
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowModal(true)}
              >
                Open Modal
              </motion.button>

              <motion.button
                className="px-6 py-3 bg-pink-500 text-white rounded-lg font-medium"
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowBottomSheet(true)}
              >
                Open Bottom Sheet
              </motion.button>

              <motion.button
                className="px-6 py-3 bg-yellow-500 text-white rounded-lg font-medium"
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setShowToast(true);
                  setTimeout(() => setShowToast(false), 3000);
                }}
              >
                Show Toast
              </motion.button>

              <motion.button
                className="px-6 py-3 bg-red-500 text-white rounded-lg font-medium"
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setShowConfetti(true);
                  setTimeout(() => setShowConfetti(false), 1000);
                }}
              >
                Confetti
              </motion.button>
            </div>

            <SectionTitle>List Stagger</SectionTitle>
            <StaggerList />

            <SectionTitle>Skeleton Loading</SectionTitle>
            <div className="space-y-3">
              <Skeleton className="h-20" />
              <Skeleton className="h-16" />
              <Skeleton className="h-24" />
            </div>
          </motion.div>
        )}

        {/* Modal */}
        <AnimatePresence>
          {showModal && (
            <>
              <motion.div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                variants={modalOverlay}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={() => setShowModal(false)}
              />
              <motion.div
                className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-md mx-auto bg-white rounded-2xl p-6 shadow-xl z-50"
                variants={modalContent}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <h2 className="text-2xl font-bold mb-4">Modal Title</h2>
                <p className="text-gray-600 mb-6">
                  This is a modal with spring animation. Click outside to close.
                </p>
                <motion.button
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowModal(false)}
                >
                  Close
                </motion.button>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Bottom Sheet */}
        <AnimatePresence>
          {showBottomSheet && (
            <>
              <motion.div
                className="fixed inset-0 bg-black/50 z-40"
                variants={modalOverlay}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={() => setShowBottomSheet(false)}
              />
              <motion.div
                className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50"
                variants={bottomSheet}
                initial="hidden"
                animate="visible"
                exit="exit"
                drag="y"
                dragConstraints={{ top: 0 }}
                dragElastic={0.2}
                onDragEnd={(_, info) => {
                  if (info.velocity.y > 500 || info.offset.y > 200) {
                    setShowBottomSheet(false);
                  }
                }}
              >
                <div className="flex justify-center pt-3 pb-2">
                  <div className="w-10 h-1 bg-gray-300 rounded-full" />
                </div>
                <div className="px-6 pb-8">
                  <h2 className="text-2xl font-bold mb-4">Bottom Sheet</h2>
                  <p className="text-gray-600 mb-4">
                    Drag down or click outside to close.
                  </p>
                  <motion.button
                    className="w-full px-4 py-2 bg-pink-500 text-white rounded-lg"
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowBottomSheet(false)}
                  >
                    Close
                  </motion.button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Toast */}
        <AnimatePresence>
          {showToast && (
            <motion.div
              className="fixed top-4 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-lg z-50"
              variants={toast}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              Toast notification!
            </motion.div>
          )}
        </AnimatePresence>

        {/* Confetti */}
        {showConfetti && <Confetti />}
      </div>
    </div>
  );
}

// Helper Components

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">{children}</h2>
  );
}

function AnimationCard({ variants, label }: { variants: any; label: string }) {
  const [key, setKey] = useState(0);

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={key}
          className="p-6 bg-white rounded-lg shadow-sm text-center"
          variants={variants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <p className="text-sm font-medium text-gray-700">{label}</p>
        </motion.div>
      </AnimatePresence>
      <button
        className="mt-2 w-full text-xs text-blue-600 hover:text-blue-700"
        onClick={() => setKey((k) => k + 1)}
      >
        Replay
      </button>
    </div>
  );
}

function StaggerList() {
  const items = ['Prayer 1', 'Prayer 2', 'Prayer 3', 'Prayer 4', 'Prayer 5'];

  return (
    <motion.ul
      className="space-y-3"
      variants={listContainer}
      initial="hidden"
      animate="visible"
    >
      {items.map((item, index) => (
        <motion.li
          key={index}
          className="p-4 bg-white rounded-lg shadow-sm"
          variants={listItem}
        >
          {item}
        </motion.li>
      ))}
    </motion.ul>
  );
}

function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-gray-200 rounded-lg ${className}`}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
        animate={{ x: ['-100%', '100%'] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  );
}

function Confetti() {
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
          initial={{ x: 0, y: 0, opacity: 1, scale: 0, rotate: 0 }}
          animate={{
            x: particle.x,
            y: particle.y,
            opacity: 0,
            scale: particle.scale,
            rotate: particle.rotation,
          }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          {particle.emoji}
        </motion.div>
      ))}
    </div>
  );
}
