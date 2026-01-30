/**
 * PrayerForm Component Examples
 *
 * Demonstrates usage patterns for the PrayerForm component
 * in different contexts.
 */

'use client';

import { useState } from 'react';
import { PrayerForm } from './PrayerForm';
import { Button } from '@/components/ui/Button';

export default function PrayerFormExamples() {
  const [isOpen1, setIsOpen1] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [lastCreatedId, setLastCreatedId] = useState<string | null>(null);

  const handleSuccess1 = (prayerItemId: string) => {
    console.log('Prayer created:', prayerItemId);
    setLastCreatedId(prayerItemId);
  };

  const handleSuccess2 = (prayerItemId: string) => {
    console.log('Prayer created with custom callback:', prayerItemId);
    alert(`기도제목이 등록되었습니다! ID: ${prayerItemId}`);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-12 bg-[rgb(var(--color-bg-secondary))] min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-[rgb(var(--color-text-primary))] mb-4">
          PrayerForm Examples
        </h1>
        <p className="text-[var(--font-size-base)] text-[rgb(var(--color-text-secondary))]">
          BottomSheet 기반의 기도제목 작성 폼 컴포넌트
        </p>
      </div>

      {/* Example 1: Basic Usage */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-[rgb(var(--color-text-primary))] mb-2">
            1. Basic Usage
          </h2>
          <p className="text-[var(--font-size-sm)] text-[rgb(var(--color-text-secondary))]">
            기본 기도제목 작성 폼
          </p>
        </div>
        <div className="p-6 bg-[rgb(var(--color-bg-card))] rounded-[var(--radius-lg)] shadow-sm">
          <Button variant="primary" size="lg" onClick={() => setIsOpen1(true)}>
            새 기도제목 작성
          </Button>
          {lastCreatedId && (
            <p className="mt-4 text-[var(--font-size-sm)] text-[rgb(var(--color-text-secondary))]">
              마지막 생성된 기도제목 ID: {lastCreatedId}
            </p>
          )}
          <PrayerForm
            groupId="example-group-1"
            isOpen={isOpen1}
            onClose={() => setIsOpen1(false)}
            onSuccess={handleSuccess1}
          />
        </div>
      </section>

      {/* Example 2: With Custom Success Handler */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-[rgb(var(--color-text-primary))] mb-2">
            2. Custom Success Handler
          </h2>
          <p className="text-[var(--font-size-sm)] text-[rgb(var(--color-text-secondary))]">
            커스텀 성공 콜백을 사용하는 폼
          </p>
        </div>
        <div className="p-6 bg-[rgb(var(--color-bg-card))] rounded-[var(--radius-lg)] shadow-sm">
          <Button variant="primary" size="lg" onClick={() => setIsOpen2(true)}>
            기도제목 작성 (Custom Handler)
          </Button>
          <PrayerForm
            groupId="example-group-2"
            isOpen={isOpen2}
            onClose={() => setIsOpen2(false)}
            onSuccess={handleSuccess2}
          />
        </div>
      </section>

      {/* Feature List */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-[rgb(var(--color-text-primary))] mb-2">
            Features
          </h2>
          <div className="p-6 bg-[rgb(var(--color-bg-card))] rounded-[var(--radius-lg)] shadow-sm">
            <ul className="space-y-3 text-[var(--font-size-sm)] text-[rgb(var(--color-text-secondary))]">
              <li className="flex items-start gap-2">
                <span className="text-[rgb(var(--color-success))]">✓</span>
                <span>제목 및 내용 입력 (필수 필드 유효성 검사)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[rgb(var(--color-success))]">✓</span>
                <span>7가지 카테고리 선택 (개인, 가족, 건강, 직장, 학업, 감사, 기타)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[rgb(var(--color-success))]">✓</span>
                <span>익명 작성 토글 기능</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[rgb(var(--color-success))]">✓</span>
                <span>작성 완료 시 Confetti 애니메이션</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[rgb(var(--color-success))]">✓</span>
                <span>자동 상세 페이지 이동</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[rgb(var(--color-success))]">✓</span>
                <span>BottomSheet 드래그 제스처 지원</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[rgb(var(--color-success))]">✓</span>
                <span>키보드 높이 자동 조정 (모바일)</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Props Documentation */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-[rgb(var(--color-text-primary))] mb-2">
            Props
          </h2>
          <div className="p-6 bg-[rgb(var(--color-bg-card))] rounded-[var(--radius-lg)] shadow-sm overflow-x-auto">
            <table className="w-full text-[var(--font-size-sm)]">
              <thead>
                <tr className="border-b border-[rgb(var(--color-border))]">
                  <th className="text-left py-2 pr-4 font-semibold text-[rgb(var(--color-text-primary))]">
                    Prop
                  </th>
                  <th className="text-left py-2 pr-4 font-semibold text-[rgb(var(--color-text-primary))]">
                    Type
                  </th>
                  <th className="text-left py-2 pr-4 font-semibold text-[rgb(var(--color-text-primary))]">
                    Required
                  </th>
                  <th className="text-left py-2 font-semibold text-[rgb(var(--color-text-primary))]">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="text-[rgb(var(--color-text-secondary))]">
                <tr className="border-b border-[rgb(var(--color-border))]">
                  <td className="py-3 pr-4 font-mono text-xs">groupId</td>
                  <td className="py-3 pr-4">string</td>
                  <td className="py-3 pr-4">Yes</td>
                  <td className="py-3">기도제목을 등록할 그룹 ID</td>
                </tr>
                <tr className="border-b border-[rgb(var(--color-border))]">
                  <td className="py-3 pr-4 font-mono text-xs">isOpen</td>
                  <td className="py-3 pr-4">boolean</td>
                  <td className="py-3 pr-4">Yes</td>
                  <td className="py-3">BottomSheet 열림 상태</td>
                </tr>
                <tr className="border-b border-[rgb(var(--color-border))]">
                  <td className="py-3 pr-4 font-mono text-xs">onClose</td>
                  <td className="py-3 pr-4">() =&gt; void</td>
                  <td className="py-3 pr-4">Yes</td>
                  <td className="py-3">BottomSheet 닫기 콜백</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-xs">onSuccess</td>
                  <td className="py-3 pr-4">(id: string) =&gt; void</td>
                  <td className="py-3 pr-4">No</td>
                  <td className="py-3">등록 성공 시 콜백 (생성된 기도제목 ID 전달)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
