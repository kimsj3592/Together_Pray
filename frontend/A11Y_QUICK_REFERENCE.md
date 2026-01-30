# Accessibility Quick Reference

Together Pray v2.0 - 접근성 빠른 참조 가이드

## 1. ARIA 속성 빠른 참조

### 버튼 (Buttons)

```tsx
// 기본 버튼
<button aria-label="기도제목 작성하기">
  +
</button>

// 토글 버튼
<button
  aria-pressed={isActive}
  aria-label={isActive ? '활성화됨' : '비활성화됨'}
>
  Toggle
</button>

// 로딩 버튼
<button aria-busy={isLoading} disabled={isLoading}>
  {isLoading ? '저장 중...' : '저장하기'}
</button>
```

### 폼 (Forms)

```tsx
// Input with label
<label htmlFor="prayer-title">기도제목</label>
<input
  id="prayer-title"
  type="text"
  required
  aria-invalid={hasError}
  aria-describedby={hasError ? 'prayer-title-error' : undefined}
/>
{hasError && (
  <p id="prayer-title-error" role="alert">
    제목을 입력해주세요
  </p>
)}

// Select
<label htmlFor="category">카테고리</label>
<select id="category" aria-required="true">
  <option value="">선택하세요</option>
  <option value="health">건강</option>
</select>
```

### 모달/다이얼로그 (Modal/Dialog)

```tsx
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
>
  <h2 id="modal-title">제목</h2>
  <p id="modal-description">설명</p>
  <button aria-label="닫기" onClick={onClose}>
    <X />
  </button>
</div>
```

### 동적 콘텐츠 (Live Regions)

```tsx
// 상태 변경 알림
<div role="status" aria-live="polite">
  {prayCount}명이 함께 기도하고 있습니다
</div>

// 에러 메시지
<div role="alert" aria-live="assertive">
  오류가 발생했습니다
</div>

// Toast
<div role="status" aria-live="polite" aria-atomic="true">
  기도가 등록되었습니다
</div>
```

### 네비게이션 (Navigation)

```tsx
<nav aria-label="메인 네비게이션">
  <ul>
    <li><a href="/home">홈</a></li>
    <li><a href="/groups">그룹</a></li>
  </ul>
</nav>

// 현재 페이지 표시
<a href="/home" aria-current="page">홈</a>
```

### 리스트 (Lists)

```tsx
<ul aria-label="기도제목 목록">
  {prayers.map(prayer => (
    <li key={prayer.id}>
      <a href={`/prayers/${prayer.id}`} aria-label={`${prayer.author}님의 기도제목: ${prayer.title}`}>
        {prayer.title}
      </a>
    </li>
  ))}
</ul>
```

---

## 2. 키보드 네비게이션 패턴

### 기본 키 바인딩

| 키 | 동작 |
|----|------|
| `Tab` | 다음 요소로 포커스 이동 |
| `Shift + Tab` | 이전 요소로 포커스 이동 |
| `Enter` | 링크/버튼 활성화 |
| `Space` | 버튼 활성화, 체크박스 토글 |
| `Escape` | 모달/다이얼로그 닫기 |
| `Arrow Keys` | 라디오 버튼, 탭 네비게이션 |

### 키보드 핸들러 예제

```tsx
// ESC 키로 닫기
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    onClose();
  }
};

useEffect(() => {
  document.addEventListener('keydown', handleKeyDown);
  return () => document.removeEventListener('keydown', handleKeyDown);
}, []);

// Enter/Ctrl+Enter로 제출
const handleKeyDown = (e: React.KeyboardEvent) => {
  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
    onSubmit();
  }
};
```

### 포커스 트랩

```tsx
import { createFocusTrap } from '@/lib/focus';

useEffect(() => {
  if (!isOpen || !modalRef.current) return;

  const cleanup = createFocusTrap(modalRef.current);
  return cleanup;
}, [isOpen]);
```

---

## 3. 포커스 관리

### 포커스 유틸리티 사용

```tsx
import { focusFirst, createFocusReturn } from '@/lib/focus';

// 모달 열 때
const openModal = () => {
  const restoreFocus = createFocusReturn();
  setIsOpen(true);

  // 모달 닫을 때 이전 포커스 복원
  onClose = () => {
    setIsOpen(false);
    restoreFocus();
  };
};

// 첫 번째 요소로 포커스
useEffect(() => {
  if (isOpen && containerRef.current) {
    focusFirst(containerRef.current);
  }
}, [isOpen]);
```

### autoFocus

```tsx
// 모달 내 첫 번째 입력 필드
<input autoFocus />

// 주의: 모달 외부에서는 autoFocus 지양
```

---

## 4. 시맨틱 HTML

### 올바른 사용

```tsx
// ✅ Good
<main id="main-content">
  <h1>페이지 제목</h1>
  <section>
    <h2>섹션 제목</h2>
    <article>
      <h3>기사 제목</h3>
    </article>
  </section>
</main>

// ❌ Bad
<div>
  <div className="title">페이지 제목</div>
  <div>
    <div className="section-title">섹션 제목</div>
  </div>
</div>
```

### Heading 계층

```tsx
// ✅ Good - 순차적 계층
<h1>메인 제목</h1>
  <h2>섹션 1</h2>
    <h3>서브섹션 1.1</h3>
  <h2>섹션 2</h2>

// ❌ Bad - 건너뛰기
<h1>메인 제목</h1>
  <h3>건너뛴 제목</h3>
```

---

## 5. 이미지 Alt 텍스트

### Alt 텍스트 작성법

```tsx
// ✅ Good - 의미 있는 이미지
<Image
  src="/prayer-bg.jpg"
  alt="촛불과 성경이 있는 기도 공간"
  width={800}
  height={600}
/>

// ✅ Good - 장식용 이미지
<Image
  src="/decoration.svg"
  alt="" // 빈 문자열
  aria-hidden="true"
  width={100}
  height={100}
/>

// ❌ Bad
<Image src="/image.jpg" alt="이미지" />
<Image src="/photo.jpg" alt="사진" />
```

### 아이콘

```tsx
// ✅ Good - 의미 있는 아이콘
<button aria-label="검색">
  <Search aria-hidden="true" />
</button>

// ✅ Good - 텍스트와 함께
<button>
  <Plus aria-hidden="true" />
  <span>추가하기</span>
</button>
```

---

## 6. 색상 대비

### 최소 대비율 (WCAG AA)

| 텍스트 크기 | 최소 대비율 |
|-------------|-------------|
| 일반 텍스트 (< 18px) | 4.5:1 |
| 큰 텍스트 (≥ 18px or 14px bold) | 3:1 |
| UI 컴포넌트 | 3:1 |

### 검증 도구

```bash
# Chrome DevTools
1. 요소 선택
2. Styles 탭
3. 색상 옆 아이콘 클릭
4. 대비율 확인

# WebAIM Contrast Checker
https://webaim.org/resources/contrastchecker/
```

### 다크 모드 고려

```css
/* Light mode */
--color-text-primary: 17 24 39; /* #111827 */
--color-bg-primary: 255 255 255; /* #FFFFFF */

/* Dark mode */
.dark --color-text-primary: 249 250 251; /* #F9FAFB */
.dark --color-bg-primary: 17 24 39; /* #111827 */
```

---

## 7. 모션 접근성

### Reduced Motion Hook

```tsx
import { useReducedMotion } from '@/hooks/useReducedMotion';

function AnimatedComponent() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : { duration: 0.3 }
      }
    >
      Content
    </motion.div>
  );
}
```

### CSS Media Query

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 8. 모바일 접근성

### 터치 타겟 크기

```tsx
// ✅ Good - 최소 44x44px (Apple) or 48x48px (Material)
<button className="min-w-[44px] min-h-[44px]">
  <Icon />
</button>

// ❌ Bad - 너무 작음
<button className="w-[32px] h-[32px]">
  <Icon />
</button>
```

### 터치 타겟 간격

```tsx
// ✅ Good - 최소 8px 간격
<div className="flex gap-2">
  <button className="min-h-[44px]">버튼 1</button>
  <button className="min-h-[44px]">버튼 2</button>
</div>
```

---

## 9. 스크린 리더 전용 텍스트

### Visually Hidden 유틸리티

```tsx
// Tailwind CSS
<span className="sr-only">
  스크린 리더 전용 텍스트
</span>

// Custom CSS
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

### 사용 예

```tsx
<button>
  <span className="sr-only">기도제목 작성하기</span>
  <Plus aria-hidden="true" />
</button>
```

---

## 10. 테스트 체크리스트

### 키보드 테스트
- [ ] Tab 키로 모든 요소 접근 가능
- [ ] Enter/Space로 버튼 활성화
- [ ] ESC로 모달 닫기
- [ ] 포커스 표시 명확
- [ ] Tab 순서 논리적

### 스크린 리더 테스트
- [ ] 모든 이미지에 alt 텍스트
- [ ] 폼 입력 필드에 label 연결
- [ ] 버튼 용도 명확
- [ ] 동적 콘텐츠 변경 안내
- [ ] Heading 계층 순차적

### 색상 테스트
- [ ] 색상만으로 정보 전달 금지
- [ ] 대비율 4.5:1 이상 (일반 텍스트)
- [ ] 다크 모드 지원

### 모바일 테스트
- [ ] 터치 타겟 최소 44x44px
- [ ] 가로 모드 지원
- [ ] 확대/축소 가능 (user-scalable=yes)

---

## 11. 자동화 도구

### Lighthouse (Chrome DevTools)

```bash
1. DevTools 열기 (F12)
2. Lighthouse 탭
3. Accessibility 체크
4. Generate report
```

### axe DevTools

```bash
# Chrome 확장 프로그램 설치
https://chrome.google.com/webstore/detail/axe-devtools

# 사용법
1. DevTools > axe DevTools 탭
2. Scan All Page
3. 문제점 확인 및 수정
```

### Pa11y (CLI)

```bash
# 설치
npm install -g pa11y

# 실행
pa11y http://localhost:3000

# CI 통합
npx pa11y-ci --sitemap http://localhost:3000/sitemap.xml
```

---

## 12. 빠른 수정 템플릿

### 버튼에 aria-label 추가

```tsx
// Before
<button onClick={handleDelete}>
  <Trash />
</button>

// After
<button onClick={handleDelete} aria-label="삭제하기">
  <Trash aria-hidden="true" />
</button>
```

### Input에 label 연결

```tsx
// Before
<input type="text" placeholder="이메일" />

// After
<label htmlFor="email">이메일</label>
<input id="email" type="email" required />
```

### 에러 메시지 연결

```tsx
// Before
<input type="email" />
{error && <p>{error}</p>}

// After
<input
  type="email"
  aria-invalid={!!error}
  aria-describedby={error ? 'email-error' : undefined}
/>
{error && (
  <p id="email-error" role="alert">
    {error}
  </p>
)}
```

### Modal에 ARIA 추가

```tsx
// Before
<div className="modal">
  <h2>제목</h2>
  <button onClick={onClose}>X</button>
</div>

// After
<div
  className="modal"
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
>
  <h2 id="modal-title">제목</h2>
  <button onClick={onClose} aria-label="닫기">
    <X aria-hidden="true" />
  </button>
</div>
```

---

## 참고 자료

- **ARIA Authoring Practices**: https://www.w3.org/WAI/ARIA/apg/
- **WebAIM Checklist**: https://webaim.org/standards/wcag/checklist
- **A11y Project Checklist**: https://www.a11yproject.com/checklist/
- **MDN ARIA**: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA

---

**Tip**: 이 가이드를 프린트하거나 북마크하여 개발 중 빠르게 참조하세요!
