'use client';

import { useState } from 'react';
import BottomSheet from './BottomSheet';
import { useBottomSheet } from '@/hooks/useBottomSheet';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

/**
 * Example 1: Basic Usage with Custom Hook
 */
export function BasicBottomSheetExample() {
  const sheet = useBottomSheet();

  return (
    <>
      <Button onClick={sheet.open}>기도제목 작성</Button>

      <BottomSheet
        isOpen={sheet.isOpen}
        onClose={sheet.close}
        title="새 기도제목"
      >
        <div className="p-5 space-y-4">
          <Input placeholder="제목을 입력하세요" />
          <textarea
            placeholder="기도제목 내용을 작성해주세요"
            className="w-full p-4 rounded-lg border border-[rgb(var(--color-border))] min-h-[120px] resize-none"
          />
          <div className="flex gap-2">
            <Button variant="secondary" onClick={sheet.close} className="flex-1">
              취소
            </Button>
            <Button variant="primary" className="flex-1">
              등록
            </Button>
          </div>
        </div>
      </BottomSheet>
    </>
  );
}

/**
 * Example 2: Custom Snap Points
 */
export function SnapPointsExample() {
  const sheet = useBottomSheet();

  return (
    <>
      <Button onClick={sheet.open}>스냅 포인트 예제</Button>

      <BottomSheet
        isOpen={sheet.isOpen}
        onClose={sheet.close}
        title="커스텀 스냅 포인트"
        snapPoints={[0.3, 0.6, 0.95]} // 30%, 60%, 95%
        initialSnap={1} // Start at 60%
      >
        <div className="p-5">
          <p className="text-[rgb(var(--color-text-secondary))]">
            이 바텀시트는 30%, 60%, 95% 높이로 스냅됩니다.
            <br />
            드래그해서 높이를 조절해보세요.
          </p>
        </div>
      </BottomSheet>
    </>
  );
}

/**
 * Example 3: Without Header
 */
export function NoHeaderExample() {
  const sheet = useBottomSheet();

  return (
    <>
      <Button onClick={sheet.open}>헤더 없는 시트</Button>

      <BottomSheet
        isOpen={sheet.isOpen}
        onClose={sheet.close}
        showHeader={false}
      >
        <div className="p-5">
          <h3 className="text-xl font-bold mb-4">커스텀 헤더</h3>
          <p className="text-[rgb(var(--color-text-secondary))]">
            showHeader=false로 설정하면 기본 헤더를 숨기고 커스텀 헤더를 만들 수 있습니다.
          </p>
        </div>
      </BottomSheet>
    </>
  );
}

/**
 * Example 4: Form with Keyboard Support
 */
export function FormExample() {
  const sheet = useBottomSheet();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    sheet.close();
  };

  return (
    <>
      <Button onClick={sheet.open}>기도제목 등록 폼</Button>

      <BottomSheet
        isOpen={sheet.isOpen}
        onClose={sheet.close}
        title="새 기도제목"
        snapPoints={[0.9]} // 90% height for forms
      >
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-[rgb(var(--color-text-primary))]">
              제목
            </label>
            <Input
              placeholder="기도제목 제목을 입력하세요"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-[rgb(var(--color-text-primary))]">
              내용
            </label>
            <textarea
              placeholder="기도제목 내용을 작성해주세요"
              className="w-full p-4 rounded-lg border border-[rgb(var(--color-border))] min-h-[150px] resize-none"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-[rgb(var(--color-text-primary))]">
              카테고리
            </label>
            <select
              className="w-full p-3 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg-primary))]"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            >
              <option value="">선택하세요</option>
              <option value="health">건강</option>
              <option value="family">가족</option>
              <option value="work">직장</option>
              <option value="faith">신앙</option>
            </select>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={sheet.close}
              className="flex-1"
            >
              취소
            </Button>
            <Button type="submit" variant="primary" className="flex-1">
              등록하기
            </Button>
          </div>
        </form>
      </BottomSheet>
    </>
  );
}

/**
 * Example 5: Scrollable Content
 */
export function ScrollableContentExample() {
  const sheet = useBottomSheet();

  return (
    <>
      <Button onClick={sheet.open}>스크롤 가능한 컨텐츠</Button>

      <BottomSheet
        isOpen={sheet.isOpen}
        onClose={sheet.close}
        title="긴 컨텐츠 예제"
        snapPoints={[0.5, 0.9]}
      >
        <div className="p-5 space-y-4">
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={i}
              className="p-4 rounded-lg bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border))]"
            >
              <h4 className="font-semibold mb-1">항목 {i + 1}</h4>
              <p className="text-sm text-[rgb(var(--color-text-secondary))]">
                스크롤 가능한 컨텐츠입니다. 드래그 핸들을 잡고 높이를 조절하거나 스크롤하세요.
              </p>
            </div>
          ))}
        </div>
      </BottomSheet>
    </>
  );
}

/**
 * Example 6: Disable Overlay Click
 */
export function NoOverlayCloseExample() {
  const sheet = useBottomSheet();

  return (
    <>
      <Button onClick={sheet.open}>오버레이 클릭 불가</Button>

      <BottomSheet
        isOpen={sheet.isOpen}
        onClose={sheet.close}
        title="중요한 작업"
        closeOnOverlayClick={false}
        closeOnEscape={false}
      >
        <div className="p-5">
          <p className="mb-4 text-[rgb(var(--color-text-secondary))]">
            이 바텀시트는 오버레이 클릭이나 ESC 키로 닫을 수 없습니다.
            <br />
            버튼을 눌러야 닫힙니다.
          </p>
          <Button onClick={sheet.close} className="w-full">
            확인
          </Button>
        </div>
      </BottomSheet>
    </>
  );
}

/**
 * Example 7: All Examples Combined
 */
export function AllBottomSheetExamples() {
  return (
    <div className="p-5 space-y-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">BottomSheet Examples</h1>

      <BasicBottomSheetExample />
      <SnapPointsExample />
      <NoHeaderExample />
      <FormExample />
      <ScrollableContentExample />
      <NoOverlayCloseExample />
    </div>
  );
}
