/**
 * Modal, ConfirmDialog, AlertDialog Examples
 *
 * Toss-style modal dialogs for Together Pray v2.0
 */

'use client';

import { useState } from 'react';
import Modal from './Modal';
import ConfirmDialog from './ConfirmDialog';
import AlertDialog from './AlertDialog';

export default function ModalExamples() {
  const [isBasicOpen, setIsBasicOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertVariant, setAlertVariant] = useState<'success' | 'error' | 'warning' | 'info'>('success');

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold mb-8">Modal System Examples</h1>

      {/* Basic Modal */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">1. Basic Modal</h2>
        <button
          onClick={() => setIsBasicOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Open Basic Modal
        </button>

        <Modal
          isOpen={isBasicOpen}
          onClose={() => setIsBasicOpen(false)}
          title="기도제목 상세"
          size="md"
        >
          <div className="space-y-4">
            <p className="text-base text-gray-700">
              이것은 기본 모달입니다. 제목과 닫기 버튼이 있으며, 배경을 클릭하거나 ESC 키를 누르면 닫힙니다.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setIsBasicOpen(false)}
                className="flex-1 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                취소
              </button>
              <button
                onClick={() => setIsBasicOpen(false)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                확인
              </button>
            </div>
          </div>
        </Modal>
      </section>

      {/* Confirm Dialog */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">2. Confirm Dialog</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setIsConfirmOpen(true)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Open Danger Confirm
          </button>
        </div>

        <ConfirmDialog
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={() => {
            console.log('Confirmed!');
            alert('삭제되었습니다.');
          }}
          title="기도제목 삭제"
          message="정말로 이 기도제목을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
          confirmText="삭제"
          cancelText="취소"
          variant="danger"
        />
      </section>

      {/* Alert Dialog */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">3. Alert Dialog</h2>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setAlertVariant('success');
              setIsAlertOpen(true);
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Success Alert
          </button>
          <button
            onClick={() => {
              setAlertVariant('error');
              setIsAlertOpen(true);
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Error Alert
          </button>
          <button
            onClick={() => {
              setAlertVariant('warning');
              setIsAlertOpen(true);
            }}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
          >
            Warning Alert
          </button>
          <button
            onClick={() => {
              setAlertVariant('info');
              setIsAlertOpen(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Info Alert
          </button>
        </div>

        <AlertDialog
          isOpen={isAlertOpen}
          onClose={() => setIsAlertOpen(false)}
          title={
            alertVariant === 'success'
              ? '등록 완료'
              : alertVariant === 'error'
              ? '오류 발생'
              : alertVariant === 'warning'
              ? '주의 필요'
              : '알림'
          }
          message={
            alertVariant === 'success'
              ? '기도제목이 성공적으로 등록되었습니다.'
              : alertVariant === 'error'
              ? '네트워크 오류가 발생했습니다. 다시 시도해주세요.'
              : alertVariant === 'warning'
              ? '이 작업은 주의가 필요합니다.'
              : '새로운 알림이 있습니다.'
          }
          variant={alertVariant}
        />
      </section>

      {/* Usage Code Examples */}
      <section className="space-y-4 mt-12">
        <h2 className="text-2xl font-semibold">Usage Examples</h2>
        <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`// Basic Modal
<Modal
  isOpen={isOpen}
  onClose={close}
  title="기도제목 상세"
  size="md"
>
  <div>Content here</div>
</Modal>

// Confirm Dialog
<ConfirmDialog
  isOpen={isOpen}
  onClose={close}
  onConfirm={handleDelete}
  title="삭제 확인"
  message="정말로 삭제하시겠습니까?"
  variant="danger"
/>

// Alert Dialog
<AlertDialog
  isOpen={isOpen}
  onClose={close}
  title="등록 완료"
  message="기도제목이 등록되었습니다."
  variant="success"
/>`}
        </pre>
      </section>
    </div>
  );
}
