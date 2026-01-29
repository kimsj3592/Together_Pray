# Together Pray v2.0 - Development Tasks

> PRD v2.0 기반 개발 태스크 트래킹
>
> Last Updated: 2026-01-30

---

## 📊 Progress Overview

| Phase | 상태 | 진행률 |
|-------|------|--------|
| Phase 1: Design System Foundation | ✅ 완료 | 100% |
| Phase 2: Navigation & Layout | ✅ 완료 | 100% |
| Phase 3: Core Feature Enhancement | 🔲 대기 | 0% |
| Phase 4: UX Polish | 🔲 대기 | 0% |
| Phase 5: Backend Refactoring | 🔲 대기 | 0% |
| Phase 6: QA & Launch | 🔲 대기 | 0% |

**범례**: ✅ 완료 | 🔄 진행중 | 🔲 대기 | ⏸️ 보류

---

## Phase 1: Design System Foundation

> 목표: 토스 스타일 디자인 시스템 기반 구축

### 1.1 디자인 토큰 설정
- [x] **1.1.1** Color System 정의 (Light/Dark Mode)
  - Primary colors (인디고 블루 계열)
  - Semantic colors (success, warning, info)
  - Neutral colors (그레이 스케일)
  - Background & Text colors
- [x] **1.1.2** Typography Scale 설정
  - Pretendard Variable 폰트 적용
  - 11px ~ 34px 스케일 정의
  - Line height & Font weight 정의
- [x] **1.1.3** Spacing System (4px 기반)
- [x] **1.1.4** Border Radius 토큰
- [x] **1.1.5** Shadow System (Elevation)

### 1.2 Tailwind 설정
- [x] **1.2.1** tailwind.config.ts 커스터마이징
  - 디자인 토큰을 Tailwind 변수로 변환
  - Dark mode 설정 (class 기반)
- [x] **1.2.2** CSS 변수 글로벌 설정 (globals.css)
- [x] **1.2.3** 컴포넌트 유틸리티 클래스 정의

### 1.3 기본 UI 컴포넌트
- [x] **1.3.1** Button 컴포넌트
  - Variants: primary, secondary, ghost, danger
  - Sizes: sm, md, lg
  - States: default, hover, active, disabled, loading
- [x] **1.3.2** Input 컴포넌트
  - Text, Textarea, Select
  - Validation states
  - Icon support
- [x] **1.3.3** Card 컴포넌트
  - 기본 카드, 인터랙티브 카드
  - Hover elevation 효과
- [x] **1.3.4** Badge 컴포넌트
  - Status badges (기도중, 부분응답, 응답완료)
  - Category badges
- [x] **1.3.5** Avatar 컴포넌트
  - Image, Initial 타입
  - Sizes, Group 지원
- [x] **1.3.6** Skeleton 컴포넌트
  - Shimmer 애니메이션
  - 다양한 형태 지원

### 1.4 Framer Motion 설정
- [x] **1.4.1** 애니메이션 variants 정의
- [x] **1.4.2** Spring config 프리셋
- [x] **1.4.3** 공통 트랜지션 설정

---

## Phase 2: Navigation & Layout

> 목표: 앱 구조와 네비게이션 시스템 구축

### 2.1 하단 네비게이션
- [x] **2.1.1** BottomNav 컴포넌트 리팩토링
  - 4개 탭: 홈, 기도, 응답, 내정보
  - Active indicator 애니메이션
  - Safe area 대응
- [x] **2.1.2** 라우트별 동적 메뉴 구성
- [x] **2.1.3** 스크롤 시 숨김/표시 옵션

### 2.2 헤더
- [x] **2.2.1** Header 컴포넌트 리팩토링
  - 글래스모피즘 효과 개선
  - 스크롤 반응형 스타일
- [x] **2.2.2** 동적 타이틀 시스템
- [x] **2.2.3** 액션 버튼 영역 표준화

### 2.3 바텀시트
- [x] **2.3.1** BottomSheet 컴포넌트 구현
  - Drag handle
  - Snap points (50%, 90%)
  - Backdrop blur
  - Swipe to dismiss
- [x] **2.3.2** Keyboard aware 높이 조절
- [x] **2.3.3** 중첩 바텀시트 지원

### 2.4 모달 시스템
- [x] **2.4.1** Modal 컴포넌트 구현
  - Enter/Exit 애니메이션
  - Backdrop click to close
  - Focus trap
- [x] **2.4.2** Confirm Dialog
- [x] **2.4.3** Alert Dialog

### 2.5 토스트 알림
- [x] **2.5.1** Toast 컴포넌트 구현
  - Success, Error, Info, Warning
  - Auto dismiss
  - Stack management
- [x] **2.5.2** useToast 훅 구현

### 2.6 페이지 전환
- [x] **2.6.1** Page transition 애니메이션
- [x] **2.6.2** Loading state 표준화
- [x] **2.6.3** Error boundary 구현

---

## Phase 3: Core Feature Enhancement

> 목표: 핵심 기능 컴포넌트 고도화

### 3.1 홈 대시보드 (신규)
- [ ] **3.1.1** 통합 홈 페이지 설계
  - 인사 메시지 섹션
  - 기도 현황 통계 카드
  - 내 그룹 요약 리스트
  - 기도 필요 기도제목 피드
- [ ] **3.1.2** 기도 현황 통계 컴포넌트
- [ ] **3.1.3** 그룹 요약 카드
- [ ] **3.1.4** FAB (빠른 기도제목 작성)

### 3.2 PrayerCard 리디자인
- [ ] **3.2.1** 새로운 카드 레이아웃 구현
  - 작성자 정보 헤더
  - 콘텐츠 영역
  - 메타 정보 (카테고리, 업데이트 수)
  - 액션 푸터
- [ ] **3.2.2** 상태 배지 새 디자인
- [ ] **3.2.3** 기도한 사람 아바타 그룹
- [ ] **3.2.4** Swipe to pray 제스처 (선택)

### 3.3 PrayButton 고도화
- [ ] **3.3.1** Long press 인터랙션 구현
  - Press 시작 시 scale down
  - Progress indicator (800ms)
  - 완료 시 햅틱 피드백
- [ ] **3.3.2** Confetti 애니메이션
- [ ] **3.3.3** 기도 완료 토스트 메시지
- [ ] **3.3.4** 기도한 사람 목록 모달 개선

### 3.4 Timeline 리디자인
- [ ] **3.4.1** 새로운 타임라인 UI
  - 연결선 + 도트 디자인
  - 상태별 아이콘/색상
- [ ] **3.4.2** 업데이트 카드 디자인
- [ ] **3.4.3** 인라인 업데이트 추가 UI

### 3.5 기도제목 작성 개선
- [ ] **3.5.1** 바텀시트 기반 작성 폼
- [ ] **3.5.2** 카테고리 칩 선택 UI
- [ ] **3.5.3** 익명 토글 개선
- [ ] **3.5.4** 작성 완료 축하 애니메이션

### 3.6 Empty State 개선
- [ ] **3.6.1** 일러스트/아이콘 적용
- [ ] **3.6.2** 친근한 메시지 카피
- [ ] **3.6.3** CTA 버튼 강화

---

## Phase 4: UX Polish

> 목표: 사용자 경험 세부 개선

### 4.1 애니메이션 Polish
- [ ] **4.1.1** 모든 버튼 press feedback 통일
- [ ] **4.1.2** 카드 hover/tap 효과 통일
- [ ] **4.1.3** 리스트 아이템 stagger 애니메이션
- [ ] **4.1.4** 페이지 전환 일관성

### 4.2 Pull to Refresh
- [ ] **4.2.1** 기도 목록 PTR 구현
- [ ] **4.2.2** 그룹 목록 PTR 구현
- [ ] **4.2.3** 커스텀 refresh indicator

### 4.3 제스처 인터랙션
- [ ] **4.3.1** Swipe actions 구현 (선택)
- [ ] **4.3.2** 햅틱 피드백 (모바일)
- [ ] **4.3.3** Keyboard shortcuts (데스크톱)

### 4.4 검색 & 필터
- [ ] **4.4.1** 검색 UI 개선
- [ ] **4.4.2** 필터 칩 UI
- [ ] **4.4.3** 정렬 옵션 드롭다운

### 4.5 접근성
- [ ] **4.5.1** ARIA 라벨 점검
- [ ] **4.5.2** 키보드 네비게이션
- [ ] **4.5.3** 색상 대비 검증
- [ ] **4.5.4** Screen reader 테스트

### 4.6 성능 최적화
- [ ] **4.6.1** 이미지 최적화 (next/image)
- [ ] **4.6.2** Code splitting 점검
- [ ] **4.6.3** Bundle size 분석
- [ ] **4.6.4** Lighthouse 점수 개선

---

## Phase 5: Backend Refactoring

> 목표: Clean Architecture 적용 및 코드 품질 개선

### 5.1 아키텍처 리팩토링
- [ ] **5.1.1** Domain Layer 분리
  - Entity 정의
  - Repository Interface
- [ ] **5.1.2** Application Layer 분리
  - Use Case 패턴 적용
  - DTO 정의
- [ ] **5.1.3** Infrastructure Layer 정리
  - Repository 구현체
  - External service adapters

### 5.2 API 개선
- [ ] **5.2.1** Response 형식 표준화
- [ ] **5.2.2** Error handling 통일
- [ ] **5.2.3** Validation 강화
- [ ] **5.2.4** API 문서화 (Swagger)

### 5.3 성능 & 보안
- [ ] **5.3.1** Query 최적화
- [ ] **5.3.2** Caching 전략 수립
- [ ] **5.3.3** Rate limiting
- [ ] **5.3.4** Security audit

---

## Phase 6: QA & Launch

> 목표: 품질 보증 및 배포

### 6.1 테스트
- [ ] **6.1.1** Unit 테스트 보강
- [ ] **6.1.2** Integration 테스트
- [ ] **6.1.3** E2E 테스트 (Playwright)
- [ ] **6.1.4** Visual regression 테스트

### 6.2 QA
- [ ] **6.2.1** 크로스 브라우저 테스트
- [ ] **6.2.2** 반응형 테스트 (모바일/태블릿/데스크톱)
- [ ] **6.2.3** 다크모드 전체 점검
- [ ] **6.2.4** 엣지 케이스 테스트

### 6.3 베타 테스트
- [ ] **6.3.1** 내부 테스트
- [ ] **6.3.2** 베타 사용자 피드백 수집
- [ ] **6.3.3** 버그 수정 및 개선

### 6.4 배포
- [ ] **6.4.1** Production 환경 설정
- [ ] **6.4.2** CI/CD 파이프라인 점검
- [ ] **6.4.3** Monitoring 설정
- [ ] **6.4.4** Launch!

---

## 📝 Notes

### 우선순위 가이드
1. **P0 (Critical)**: 사용자 플로우에 직접 영향
2. **P1 (High)**: UX 품질에 큰 영향
3. **P2 (Medium)**: 개선 사항
4. **P3 (Low)**: Nice to have

### 기술 스택
- **Frontend**: Next.js 16, React 19, TypeScript, TailwindCSS 4, Framer Motion 11
- **Backend**: NestJS 10, Prisma 5, PostgreSQL
- **State**: Zustand (선택적 도입)
- **Testing**: Vitest, Playwright

### 참고 문서
- [PRD v2.0](./docs/PRD_V2.md)
- [App Documentation](./docs/APP_DOCUMENTATION.md)

---

*Last Updated: 2026-01-30*
