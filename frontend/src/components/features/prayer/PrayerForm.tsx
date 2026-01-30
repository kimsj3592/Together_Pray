'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { api, CreatePrayerItemData } from '@/lib/api';
import { cn } from '@/lib/utils';
import { confettiParticle } from '@/lib/animations';
import BottomSheet from '@/components/layout/BottomSheet';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export interface PrayerFormProps {
  groupId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (prayerItemId: string) => void;
}

type Category = '개인' | '가족' | '건강' | '직장' | '학업' | '감사' | '기타';

const CATEGORIES: { value: Category; emoji: string }[] = [
  { value: '개인', emoji: '👤' },
  { value: '가족', emoji: '👨‍👩‍👧‍👦' },
  { value: '건강', emoji: '🏥' },
  { value: '직장', emoji: '💼' },
  { value: '학업', emoji: '📚' },
  { value: '감사', emoji: '🙏' },
  { value: '기타', emoji: '📝' },
];

// Confetti animation
const ConfettiParticle = ({ delay }: { delay: number }) => {
  const x = Math.random() * 200 - 100;
  const y = Math.random() * -200 - 50;
  const rotation = Math.random() * 360;
  const scale = Math.random() * 0.5 + 0.5;
  const colors = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#3B82F6'];
  const color = colors[Math.floor(Math.random() * colors.length)];

  return (
    <motion.div
      variants={confettiParticle(x, y, rotation, scale)}
      initial="hidden"
      animate="visible"
      transition={{ delay }}
      className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full"
      style={{ backgroundColor: color }}
    />
  );
};

const SuccessConfetti = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[100]">
      {Array.from({ length: 20 }).map((_, i) => (
        <ConfettiParticle key={i} delay={i * 0.02} />
      ))}
    </div>
  );
};

export const PrayerForm = ({ groupId, isOpen, onClose, onSuccess }: PrayerFormProps) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '' as Category | '',
    isAnonymous: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = '제목을 입력해주세요';
    } else if (formData.title.trim().length < 2) {
      newErrors.title = '제목은 2글자 이상 입력해주세요';
    }

    if (!formData.content.trim()) {
      newErrors.content = '내용을 입력해주세요';
    } else if (formData.content.trim().length < 10) {
      newErrors.content = '내용은 10글자 이상 입력해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const data: CreatePrayerItemData = {
        groupId,
        title: formData.title.trim(),
        content: formData.content.trim(),
        category: formData.category || undefined,
        isAnonymous: formData.isAnonymous,
      };

      const response = await api.createPrayerItem(data);

      // Show success animation
      setShowSuccess(true);

      // Wait for animation
      setTimeout(() => {
        // Reset form
        setFormData({
          title: '',
          content: '',
          category: '',
          isAnonymous: false,
        });
        setShowSuccess(false);

        // Call success callback
        if (onSuccess) {
          onSuccess(response.id);
        }

        // Close sheet
        onClose();

        // Navigate to prayer detail
        router.push(`/prayers/${response.id}`);
      }, 1500);
    } catch (error) {
      console.error('Failed to create prayer item:', error);
      setErrors({
        submit: error instanceof Error ? error.message : '기도제목 등록에 실패했습니다',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        title: '',
        content: '',
        category: '',
        isAnonymous: false,
      });
      setErrors({});
      onClose();
    }
  };

  return (
    <>
      <BottomSheet
        isOpen={isOpen}
        onClose={handleClose}
        title="새 기도제목 작성"
        snapPoints={[0.8, 0.95]}
        initialSnap={0}
        showHeader={true}
        showHandle={true}
        closeOnOverlayClick={!isSubmitting}
      >
        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {/* Title Input */}
          <Input
            label="제목"
            placeholder="기도제목 제목을 입력하세요"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            error={errors.title}
            disabled={isSubmitting}
            maxLength={100}
          />

          {/* Content Textarea */}
          <Textarea
            label="내용"
            placeholder="기도제목 내용을 작성해주세요..."
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            error={errors.content}
            disabled={isSubmitting}
            rows={5}
            maxLength={1000}
          />

          {/* Character count */}
          <div className="text-right text-[var(--font-size-xs)] text-[rgb(var(--color-text-tertiary))]">
            {formData.content.length} / 1000
          </div>

          {/* Category Selection */}
          <div className="space-y-3">
            <label className="block text-[var(--font-size-sm)] font-medium text-[rgb(var(--color-text-primary))]">
              카테고리 선택 (선택사항)
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <motion.button
                  key={cat.value}
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      category: formData.category === cat.value ? '' : cat.value,
                    })
                  }
                  disabled={isSubmitting}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    'px-4 py-2.5 rounded-[var(--radius-lg)]',
                    'flex items-center gap-2',
                    'text-[var(--font-size-sm)] font-medium',
                    'transition-all duration-200',
                    'min-h-[44px]',
                    'border-2',
                    formData.category === cat.value
                      ? 'border-[rgb(var(--color-primary-500))] bg-[rgb(var(--color-primary-50))] text-[rgb(var(--color-primary-600))] dark:bg-[rgb(var(--color-primary-900))] dark:text-[rgb(var(--color-primary-300))]'
                      : 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg-card))] text-[rgb(var(--color-text-primary))] hover:border-[rgb(var(--color-primary-300))]'
                  )}
                >
                  <span className="text-lg">{cat.emoji}</span>
                  <span>{cat.value}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Anonymous Toggle */}
          <div
            className={cn(
              'flex items-center justify-between p-4 rounded-[var(--radius-lg)]',
              'bg-[rgb(var(--color-bg-secondary))]',
              'border border-[rgb(var(--color-border))]'
            )}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">🔒</span>
              <div>
                <p className="text-[var(--font-size-sm)] font-medium text-[rgb(var(--color-text-primary))]">
                  익명으로 작성
                </p>
                <p className="text-[var(--font-size-xs)] text-[rgb(var(--color-text-tertiary))]">
                  이름이 공개되지 않습니다
                </p>
              </div>
            </div>

            {/* Custom Toggle Switch */}
            <button
              type="button"
              role="switch"
              aria-checked={formData.isAnonymous}
              onClick={() => setFormData({ ...formData, isAnonymous: !formData.isAnonymous })}
              disabled={isSubmitting}
              className={cn(
                'relative inline-flex h-6 w-11 items-center rounded-full',
                'transition-colors duration-200 ease-in-out',
                'focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary-500))] focus:ring-offset-2',
                formData.isAnonymous
                  ? 'bg-[rgb(var(--color-primary-500))]'
                  : 'bg-[rgb(var(--color-gray-300))]'
              )}
            >
              <span
                className={cn(
                  'inline-block h-4 w-4 transform rounded-full bg-white',
                  'transition-transform duration-200 ease-in-out',
                  formData.isAnonymous ? 'translate-x-6' : 'translate-x-1'
                )}
              />
            </button>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="p-3 rounded-[var(--radius-md)] bg-red-50 dark:bg-red-900/20">
              <p className="text-[var(--font-size-sm)] text-red-600 dark:text-red-400">
                {errors.submit}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSubmitting}
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? '등록 중...' : '기도제목 등록'}
          </Button>

          {/* Helper text */}
          <p className="text-center text-[var(--font-size-xs)] text-[rgb(var(--color-text-tertiary))]">
            등록된 기도제목은 그룹 멤버들과 함께 나눕니다
          </p>
        </form>
      </BottomSheet>

      {/* Success Confetti */}
      {showSuccess && <SuccessConfetti />}
    </>
  );
};

PrayerForm.displayName = 'PrayerForm';
