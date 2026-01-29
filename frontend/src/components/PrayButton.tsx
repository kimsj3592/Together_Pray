'use client';

import { useState } from 'react';
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
  const [showAnimation, setShowAnimation] = useState(false);
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
      setShowAnimation(true);

      setTimeout(() => setShowAnimation(false), 1000);

      if (onPraySuccess) {
        onPraySuccess(result.prayCount);
      }
    } catch (err: any) {
      if (err.message.includes('Already prayed')) {
        setHasPrayedToday(true);
        alert('오늘 이미 이 기도제목을 위해 기도하셨습니다.');
      } else {
        alert(err.message || '기도 등록에 실패했습니다.');
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
      alert(err.message || '기도 목록을 불러올 수 없습니다.');
    } finally {
      setLoadingList(false);
    }
  };

  const isSmall = size === 'small';

  return (
    <>
      <div className={`flex items-center gap-2 ${isSmall ? 'flex-row' : 'flex-col sm:flex-row'}`}>
        <button
          onClick={handlePray}
          disabled={hasPrayedToday || praying}
          className={`
            ${isSmall ? 'px-3 py-1.5 text-sm flex-1' : 'min-h-[44px] px-6 py-3 text-base w-full sm:flex-1'}
            flex items-center justify-center gap-2
            rounded-md font-medium
            transition-all duration-200
            ${
              hasPrayedToday
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
            }
            ${praying ? 'opacity-75' : ''}
            ${showAnimation ? 'scale-105' : ''}
          `}
        >
          <span className={`${showAnimation ? 'animate-bounce' : ''}`}>
            {hasPrayedToday ? '✓' : '🙏'}
          </span>
          <span>
            {hasPrayedToday ? '오늘 기도완료' : praying ? '기도 중...' : '함께 기도하기'}
          </span>
          {!isSmall && (
            <span
              className={`
                px-2 py-0.5 rounded-full text-xs
                ${hasPrayedToday ? 'bg-gray-400 text-white' : 'bg-blue-500 text-white'}
              `}
            >
              {prayCount}회
            </span>
          )}
        </button>

        {prayCount > 0 && (
          <button
            onClick={handleShowPrayersList}
            disabled={loadingList}
            className={`
              ${isSmall ? 'px-3 py-1.5 text-sm' : 'min-h-[44px] px-4 py-3 text-base w-full sm:w-auto'}
              flex items-center justify-center gap-1
              rounded-md font-medium
              border border-gray-300 text-gray-700
              hover:bg-gray-50
              transition-colors duration-200
              disabled:opacity-50
            `}
          >
            <span>{loadingList ? '로딩...' : `${prayCount}명 보기`}</span>
          </button>
        )}
      </div>

      {showPrayersList && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowPrayersList(false)}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">함께 기도한 사람들</h3>
              <button
                onClick={() => setShowPrayersList(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {prayersList.length === 0 ? (
              <p className="text-gray-500 text-center py-4">아직 기도한 사람이 없습니다.</p>
            ) : (
              <div className="space-y-2">
                {prayersList.map((prayer) => (
                  <div
                    key={`${prayer.id}-${prayer.prayedAt}`}
                    className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                  >
                    <span className="font-medium text-gray-900">{prayer.name}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(prayer.prayedAt).toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
