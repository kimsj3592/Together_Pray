# Accessibility Checklist

Together Pray v2.0 접근성 체크리스트 및 가이드

## 목표

- WCAG 2.1 AA 준수
- 키보드 내비게이션 완전 지원
- 스크린 리더 호환성
- 색상 대비 기준 충족

---

## 1. ARIA 라벨 및 역할 (ARIA Labels & Roles)

### 완료 항목

- [x] **Modal**: `role="dialog"`, `aria-modal="true"`, `aria-labelledby` 추가
- [x] **BottomSheet**: `role="dialog"`, `aria-modal="true"`, `aria-labelledby` 추가
- [x] **Toast**: `role="alert"`, `aria-live="polite"` 추가
- [x] **Button**: 로딩 상태에 `aria-busy` 추가
- [x] **Input/Textarea**: `aria-invalid`, `aria-describedby` 추가
- [x] **PrayButton**: `aria-label`, `aria-pressed`, `aria-busy` 추가
- [x] **PrayerCard**: 링크에 포괄적인 `aria-label` 추가

### 진행 필요 항목

- [ ] **Navigation**: 네비게이션 컴포넌트에 `role="navigation"`, `aria-label` 추가
- [ ] **GroupCard**: 그룹 카드 링크에 설명적인 `aria-label` 추가
- [ ] **EmptyState**: 적절한 `role` 및 `aria-label` 추가
- [ ] **Badge**: 상태 뱃지에 `aria-label` 추가 (예: "기도중 상태")
- [ ] **Avatar**: 이미지에 `alt` 텍스트 확인
- [ ] **Form**: 폼 제출 시 성공/실패 메시지에 `aria-live` 영역 추가

---

## 2. 키보드 네비게이션 (Keyboard Navigation)

### 완료 항목

- [x] **Modal**: ESC로 닫기, Tab 포커스 트랩 구현
- [x] **BottomSheet**: ESC로 닫기, Tab 포커스 트랩 구현
- [x] **Input/Textarea**: 자동 포커스 관리
- [x] **Skip Link**: 본문으로 건너뛰기 링크 추가

### 진행 필요 항목

- [ ] **Enter/Space 키**: 모든 버튼에서 Enter 및 Space 키 동작 확인
- [ ] **Arrow 키**: 리스트 네비게이션 (선택적)
- [ ] **BottomNav**: 키보드로 탭 전환 가능하도록 개선
- [ ] **GroupList**: 키보드로 그룹 선택 및 이동 개선
- [ ] **PrayerList**: 키보드로 기도제목 선택 및 이동

---

## 3. 포커스 관리 (Focus Management)

### 완료 항목

- [x] **Focus Utilities**: `/lib/focus.ts` 유틸리티 함수 생성
  - `focusFirst()`: 첫 번째 포커스 가능 요소에 포커스
  - `createFocusTrap()`: 포커스 트랩 생성
  - `createFocusReturn()`: 이전 포커스 복원
- [x] **Modal/BottomSheet**: 열릴 때 자동 포커스, 닫힐 때 이전 요소로 복원

### 진행 필요 항목

- [ ] **페이지 전환**: 페이지 이동 시 메인 콘텐츠로 포커스 이동
- [ ] **Toast 닫기 후**: 이전 포커스 요소로 복원
- [ ] **Drawer/Dialog**: 열릴 때 첫 번째 입력 요소로 자동 포커스
- [ ] **에러 발생 시**: 에러 메시지 또는 첫 번째 에러 필드로 포커스

---

## 4. 색상 대비 (Color Contrast)

### 검증 필요

모든 텍스트 색상이 WCAG AA 기준을 충족하는지 확인:

- **일반 텍스트**: 최소 4.5:1 대비율
- **큰 텍스트** (18px 이상 또는 14px bold): 최소 3:1 대비율
- **UI 컴포넌트**: 최소 3:1 대비율

#### 확인 필요 항목

- [ ] `--color-text-primary` vs `--color-bg-primary`
- [ ] `--color-text-secondary` vs `--color-bg-primary`
- [ ] `--color-text-tertiary` vs `--color-bg-primary`
- [ ] 버튼 텍스트 vs 버튼 배경
- [ ] 뱃지 텍스트 vs 뱃지 배경
- [ ] 다크 모드에서 모든 색상 조합

**검증 도구**:
- Chrome DevTools Lighthouse
- WebAIM Contrast Checker
- axe DevTools

---

## 5. 포커스 표시 (Focus Visible)

### 완료 항목

- [x] **전역 스타일**: `globals.css`에 `:focus-visible` 스타일 적용
- [x] **Input/Textarea**: 포커스 링 스타일 적용
- [x] **Button**: 포커스 시 시각적 피드백 제공

### 확인 필요 항목

- [ ] 모든 상호작용 요소에 명확한 포커스 표시 확인
- [ ] 포커스 표시가 배경색과 충분히 구별되는지 확인
- [ ] 다크 모드에서 포커스 링 가시성 확인

---

## 6. 화면 리더 (Screen Reader)

### 테스트 항목

#### macOS - VoiceOver
```bash
# VoiceOver 켜기: Cmd + F5
```

- [ ] 모든 페이지 탐색 가능
- [ ] 폼 입력 필드 라벨 읽기
- [ ] 버튼 및 링크 용도 명확
- [ ] 모달/다이얼로그 열림/닫힘 안내
- [ ] 동적 콘텐츠 변경 안내 (aria-live)

#### Windows - NVDA
```bash
# NVDA 무료 다운로드: https://www.nvaccess.org/
```

- [ ] VoiceOver 테스트 항목과 동일

#### 모바일 - TalkBack (Android) / VoiceOver (iOS)

- [ ] 터치 탐색 모드에서 모든 요소 접근 가능
- [ ] 스와이프 제스처로 네비게이션 가능
- [ ] 버튼 길게 누르기 동작 설명

---

## 7. 시맨틱 HTML (Semantic HTML)

### 검증 필요

- [ ] **Heading 계층**: h1 → h2 → h3 순서대로 사용
- [ ] **Lists**: `<ul>`, `<ol>`, `<li>` 적절히 사용
- [ ] **Navigation**: `<nav>` 태그 사용
- [ ] **Main Content**: `<main>` 태그 사용
- [ ] **Sections**: `<section>`, `<article>` 적절히 사용
- [ ] **Forms**: `<form>`, `<fieldset>`, `<legend>` 사용

---

## 8. 폼 접근성 (Form Accessibility)

### 완료 항목

- [x] **Input/Textarea**: `htmlFor` 및 `id` 연결
- [x] **필수 필드**: `required` 속성 및 시각적 표시 (`*`)
- [x] **에러 메시지**: `aria-describedby`로 연결, `role="alert"`

### 진행 필요 항목

- [ ] **자동완성**: `autocomplete` 속성 추가 (이메일, 이름 등)
- [ ] **입력 타입**: 적절한 `type` 속성 사용 (email, tel, url 등)
- [ ] **에러 위치**: 폼 제출 실패 시 첫 번째 에러 필드로 포커스 이동
- [ ] **성공 메시지**: 폼 제출 성공 시 `aria-live` 영역에 메시지 표시

---

## 9. 이미지 및 미디어 (Images & Media)

### 확인 필요 항목

- [ ] 모든 이미지에 `alt` 텍스트 추가
  - 의미 있는 이미지: 설명적인 alt
  - 장식용 이미지: `alt=""` (빈 문자열)
- [ ] 아이콘에 `aria-label` 또는 `aria-hidden="true"` 추가
- [ ] SVG 아이콘에 `<title>` 또는 `aria-label` 추가
- [ ] 동영상에 자막 제공 (해당 시)
- [ ] 오디오에 텍스트 대본 제공 (해당 시)

---

## 10. 동적 콘텐츠 (Dynamic Content)

### 완료 항목

- [x] **Toast**: `aria-live="polite"` 추가
- [x] **에러 메시지**: `role="alert"` 추가

### 진행 필요 항목

- [ ] **로딩 상태**: 로딩 중일 때 `aria-busy="true"`, 로딩 완료 시 `aria-busy="false"`
- [ ] **무한 스크롤**: 새 콘텐츠 로드 시 스크린 리더 안내
- [ ] **필터/정렬**: 결과 변경 시 `aria-live` 영역에 안내 메시지
- [ ] **카운터**: 숫자 변경 시 스크린 리더 안내 (선택적)

---

## 11. 모바일 접근성 (Mobile Accessibility)

### 확인 필요 항목

- [ ] **터치 타겟 크기**: 최소 44x44px (Apple HIG) 또는 48x48px (Material Design)
- [ ] **터치 타겟 간격**: 최소 8px 간격
- [ ] **확대/축소**: `user-scalable=no` 사용하지 않기
- [ ] **가로 모드**: 가로 모드에서도 정상 동작
- [ ] **키보드 올라올 때**: BottomSheet 높이 자동 조정 (구현됨)

---

## 12. 애니메이션 (Animations)

### 진행 필요 항목

- [ ] **prefers-reduced-motion**: 애니메이션 감소 설정 감지 및 적용

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

Framer Motion에서:
```tsx
import { useReducedMotion } from 'framer-motion';

const shouldReduceMotion = useReducedMotion();
```

---

## 13. 테스트 도구 (Testing Tools)

### 자동 테스트

- [ ] **axe DevTools**: Chrome/Firefox 확장 프로그램
- [ ] **Lighthouse**: Chrome DevTools
- [ ] **WAVE**: 웹 접근성 평가 도구
- [ ] **Pa11y**: CLI 기반 자동 테스트

```bash
npx pa11y http://localhost:3000
```

### 수동 테스트

- [ ] 키보드만으로 모든 기능 사용해보기
- [ ] 스크린 리더로 전체 앱 탐색해보기
- [ ] 200% 확대/축소 테스트
- [ ] 색맹 시뮬레이터 사용 (Chrome DevTools)

---

## 14. 문서화 (Documentation)

### 작성 필요 항목

- [ ] 접근성 성명서 (Accessibility Statement) 페이지
- [ ] 키보드 단축키 문서
- [ ] 스크린 리더 사용 가이드
- [ ] 접근성 피드백 제출 방법

---

## 우선순위

### P0 (긴급)
- [ ] 키보드 네비게이션 완전 지원
- [ ] 폼 접근성 (라벨, 에러 메시지)
- [ ] 색상 대비 검증 및 수정

### P1 (중요)
- [ ] 스크린 리더 테스트 및 개선
- [ ] 포커스 관리 개선
- [ ] ARIA 라벨 완성

### P2 (권장)
- [ ] 모바일 접근성 개선
- [ ] prefers-reduced-motion 지원
- [ ] 접근성 문서화

---

## 리소스

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)
- [WebAIM](https://webaim.org/)
- [Inclusive Components](https://inclusive-components.design/)
