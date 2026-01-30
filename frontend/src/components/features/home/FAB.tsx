'use client';

import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface FABProps {
  onClick?: () => void;
}

export function FAB({ onClick }: FABProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      // Default: Navigate to groups page to select a group
      router.push('/groups');
    }
  };

  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      onClick={handleClick}
      className="fixed bottom-20 right-5 z-40 md:bottom-6 md:right-6"
      aria-label="새 기도제목 작성"
      style={{
        width: '56px',
        height: '56px',
        borderRadius: '28px',
        backgroundColor: 'rgb(var(--color-primary-500))',
        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Plus size={24} color="white" strokeWidth={2.5} />
    </motion.button>
  );
}
