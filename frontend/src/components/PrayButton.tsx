'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Check, Users, X } from 'lucide-react';
import { api } from '@/lib/api';

interface PrayButtonProps {
  prayerItemId: string;
  initialPrayCount: number;
  initialHasPrayedToday?: boolean;
  size?: 'small' | 'large';
  onPraySuccess?: (newCount: number) => void;
}

export default function PrayButton({
  prayerItemId,
  initialPrayCount,
  initialHasPrayedToday = false,
  size = 'large',
  onPraySuccess,
}: PrayButtonProps) {
  const [prayCount, setPrayCount] = useState(initialPrayCount);
  const [hasPrayedToday, setHasPrayedToday] = useState(initialHasPrayedToday);
  const [praying, setPraying] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showPrayersList, setShowPrayersList] = useState(false);
  const [prayersList, setPrayersList] = useState<
    { id: string; name: string; prayedAt: string }[]
  >([]);
  const [loadingList, setLoadingList] = useState(false);

  const handlePray = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (hasPrayedToday || praying) return;

    try {
      setPraying(true);
      const result = await api.pray(prayerItemId);

      setPrayCount(result.prayCount);
      setHasPrayedToday(result.hasPrayedToday);
      setShowCelebration(true);

      setTimeout(() => setShowCelebration(false), 2000);

      if (onPraySuccess) {
        onPraySuccess(result.prayCount);
      }
    } catch (err: any) {
      if (err.message.includes('Already prayed')) {
        setHasPrayedToday(true);
      } else {
        console.error(err.message || '기도 등록에 실패했습니다.');
      }
    } finally {
      setPraying(false);
    }
  };

  const handleShowPrayersList = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (prayCount === 0) return;

    try {
      setLoadingList(true);
      const list = await api.getPrayersList(prayerItemId);
      setPrayersList(list);
      setShowPrayersList(true);
    } catch (err: any) {
      console.error(err.message || '기도 목록을 불러올 수 없습니다.');
    } finally {
      setLoadingList(false);
    }
  };

  const isSmall = size === 'small';

  return (
    <>
      <div className={`flex items-center gap-2 ${isSmall ? 'flex-row' : 'flex-col sm:flex-row'}`}>
        <motion.button
          onClick={handlePray}
          disabled={hasPrayedToday || praying}
          whileHover={!hasPrayedToday ? { scale: 1.02 } : {}}
          whileTap={!hasPrayedToday ? { scale: 0.95 } : {}}
          className={`
            ${isSmall ? 'px-4 py-2 text-sm' : 'min-h-[48px] px-6 py-3 text-base w-full sm:flex-1'}
            relative flex items-center justify-center gap-2
            rounded-xl font-medium
            transition-all duration-300
            overflow-hidden
            ${
              hasPrayedToday
                ? 'bg-tertiary cursor-default'
                : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md hover:shadow-lg'
            }
            ${!hasPrayedToday && !praying ? 'animate-pray-pulse' : ''}
          `}
          style={hasPrayedToday ? { color: 'rgb(var(--color-text-secondary))' } : {}}
        >
          <AnimatePresence mode="wait">
            {hasPrayedToday ? (
              <motion.span
                key="completed"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2"
              >
                <Check size={isSmall ? 16 : 20} />
                <span>오늘 기도완료</span>
              </motion.span>
            ) : praying ? (
              <motion.span
                key="praying"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Heart size={isSmall ? 16 : 20} />
                </motion.div>
                <span>기도 중...</span>
              </motion.span>
            ) : (
              <motion.span
                key="ready"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2"
              >
                <Heart size={isSmall ? 16 : 20} />
                <span>함께 기도하기</span>
              </motion.span>
            )}
          </AnimatePresence>

          {/* Celebration effect */}
          <AnimatePresence>
            {showCelebration && (
              <>
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                    animate={{
                      opacity: 0,
                      scale: 1,
                      x: Math.cos((i / 6) * Math.PI * 2) * 60,
                      y: Math.sin((i / 6) * Math.PI * 2) * 60,
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="absolute text-lg pointer-events-none"
                  >
                    {i % 2 === 0 ? '🙏' : '✨'}
                  </motion.div>
                ))}
              </>
            )}
          </AnimatePresence>
        </motion.button>

        {prayCount > 0 && (
          <motion.button
            onClick={handleShowPrayersList}
            disabled={loadingList}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
              ${isSmall ? 'px-3 py-2 text-sm' : 'min-h-[48px] px-4 py-3 text-base w-full sm:w-auto'}
              flex items-center justify-center gap-2
              rounded-xl font-medium
              btn-secondary
              disabled:opacity-50
            `}
          >
            <Users size={isSmall ? 14 : 18} />
            <span>{loadingList ? '로딩...' : `${prayCount}명`}</span>
          </motion.button>
        )}
      </div>

      {/* Prayer List Modal */}
      <AnimatePresence>
        {showPrayersList && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setShowPrayersList(false)}
          >
            <div
              className="absolute inset-0"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="card relative w-full max-w-md max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="sticky top-0 flex items-center justify-between p-4 border-b bg-primary"
                style={{ borderColor: 'rgb(var(--color-border))' }}
              >
                <h3
                  className="text-lg font-semibold"
                  style={{ color: 'rgb(var(--color-text-primary))' }}
                >
                  함께 기도한 사람들
                </h3>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowPrayersList(false)}
                  className="p-2 rounded-lg hover:bg-tertiary transition-colors"
                  style={{ color: 'rgb(var(--color-text-secondary))' }}
                >
                  <X size={20} />
                </motion.button>
              </div>

              <div className="p-4 overflow-y-auto max-h-[60vh]">
                {prayersList.length === 0 ? (
                  <p
                    className="text-center py-8"
                    style={{ color: 'rgb(var(--color-text-secondary))' }}
                  >
                    아직 기도한 사람이 없습니다.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {prayersList.map((prayer, index) => (
                      <motion.div
                        key={`${prayer.id}-${prayer.prayedAt}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center justify-between py-3 px-4 rounded-xl"
                        style={{ backgroundColor: 'rgb(var(--color-bg-secondary))' }}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                            style={{
                              backgroundColor: 'rgb(var(--color-accent-blue))',
                              color: 'white',
                            }}
                          >
                            {prayer.name.charAt(0)}
                          </div>
                          <span
                            className="font-medium"
                            style={{ color: 'rgb(var(--color-text-primary))' }}
                          >
                            {prayer.name}
                          </span>
                        </div>
                        <span
                          className="text-sm"
                          style={{ color: 'rgb(var(--color-text-tertiary))' }}
                        >
                          {new Date(prayer.prayedAt).toLocaleDateString('ko-KR')}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
