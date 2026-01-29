/**
 * Toast Examples
 *
 * Toss-style toast notifications for Together Pray v2.0
 */

'use client';

import { useToast } from '@/hooks';

export default function ToastExamples() {
  const { success, error, warning, info, toast } = useToast();

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold mb-8">Toast System Examples</h1>

      {/* Basic Toasts */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">1. Basic Toast Variants</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => success('기도제목이 등록되었습니다!')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Success Toast
          </button>
          <button
            onClick={() => error('오류가 발생했습니다. 다시 시도해주세요.')}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Error Toast
          </button>
          <button
            onClick={() => warning('네트워크 연결이 불안정합니다.')}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
          >
            Warning Toast
          </button>
          <button
            onClick={() => info('새로운 기도 응답이 있습니다.')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Info Toast
          </button>
        </div>
      </section>

      {/* Custom Duration */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">2. Custom Duration</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => success('1초 후 사라집니다', 1000)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            1초 Toast
          </button>
          <button
            onClick={() => success('5초 후 사라집니다', 5000)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            5초 Toast
          </button>
          <button
            onClick={() =>
              toast({
                message: '수동으로 닫아야 합니다',
                variant: 'info',
                duration: Infinity,
              })
            }
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Infinite Toast
          </button>
        </div>
      </section>

      {/* Multiple Toasts */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">3. Multiple Toasts</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              success('첫 번째 알림');
              setTimeout(() => info('두 번째 알림'), 200);
              setTimeout(() => warning('세 번째 알림'), 400);
            }}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Show Multiple Toasts
          </button>
        </div>
      </section>

      {/* Real-world Examples */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">4. Real-world Scenarios</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => success('기도제목이 등록되었습니다')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Prayer Created
          </button>
          <button
            onClick={() => success('기도를 드렸습니다 🙏')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Prayer Clicked
          </button>
          <button
            onClick={() => success('그룹에 초대되었습니다')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Group Invite
          </button>
          <button
            onClick={() => error('로그인이 필요합니다')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Auth Required
          </button>
          <button
            onClick={() => warning('오늘은 이미 기도하셨습니다')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Daily Limit
          </button>
          <button
            onClick={() => info('5명이 함께 기도했습니다')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Prayer Count Update
          </button>
        </div>
      </section>

      {/* Usage Code Examples */}
      <section className="space-y-4 mt-12">
        <h2 className="text-2xl font-semibold">Usage Examples</h2>
        <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`import { useToast } from '@/hooks';

function MyComponent() {
  const { success, error, warning, info, toast } = useToast();

  // Simple variants
  success('기도제목이 등록되었습니다!');
  error('오류가 발생했습니다.');
  warning('네트워크 연결이 불안정합니다.');
  info('새로운 알림이 있습니다.');

  // With custom duration
  success('5초 후 사라집니다', 5000);

  // Advanced usage
  toast({
    message: '커스텀 메시지',
    variant: 'success',
    duration: 3000,
  });
}`}
        </pre>
      </section>

      {/* Provider Setup */}
      <section className="space-y-4 mt-12">
        <h2 className="text-2xl font-semibold">Setup (in layout.tsx)</h2>
        <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`import { ToastProvider } from '@/contexts/ToastContext';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}`}
        </pre>
      </section>
    </div>
  );
}
