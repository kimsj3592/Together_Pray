'use client';

import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/animations';

interface GreetingSectionProps {
  userName: string;
}

export function GreetingSection({ userName }: GreetingSectionProps) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '좋은 아침이에요';
    if (hour < 18) return '좋은 오후에요';
    return '좋은 저녁이에요';
  };

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="mb-8"
    >
      <h1
        className="text-2xl font-bold mb-2"
        style={{ color: 'rgb(var(--color-text-primary))' }}
      >
        안녕하세요, {userName}님 👋
      </h1>
      <p
        className="text-base"
        style={{ color: 'rgb(var(--color-text-secondary))' }}
      >
        {getGreeting()}, 오늘도 함께 기도해요
      </p>
    </motion.div>
  );
}
