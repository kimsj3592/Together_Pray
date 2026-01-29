# Together Pray - 기도제목 커뮤니티 웹앱

교회/소그룹을 위한 기도제목 관리 및 커뮤니티 PoC 프로젝트

## 🎯 프로젝트 목표

- **목적**: 기도제목 중심 커뮤니티 PoC 구축
- **기간**: 2-4주 실사용자 테스트
- **핵심 기능**:
  - 기도제목 작성 및 상태 관리 (기도중/부분응답/응답완료)
  - 함께 기도하기 기능 (1일 1회 제한)
  - 응답된 기도 모아보기
  - 그룹 기반 접근 제어

## 📁 프로젝트 구조

```
poc_app/
├── frontend/          # Next.js 16 + React 19 + TypeScript
│   ├── src/
│   │   ├── app/      # App Router pages
│   │   ├── components/
│   │   └── lib/
│   └── package.json
├── backend/           # NestJS + TypeORM + PostgreSQL
│   ├── src/
│   │   ├── auth/
│   │   ├── groups/
│   │   ├── prayers/
│   │   └── users/
│   └── package.json
├── IMPLEMENTATION_PLAN.md
├── DATABASE_SCHEMA.md
└── tasks.md
```

## 🛠️ 기술 스택

### Frontend
- Next.js 16 (App Router)
- React 19
- TypeScript
- TailwindCSS

### Backend
- NestJS
- TypeORM
- PostgreSQL 14+
- JWT Authentication

## 🚀 시작하기

### 환경 요구사항
- Node.js 18+
- PostgreSQL 14+
- npm 또는 yarn

### 설치

1. **Backend 설정**
```bash
cd backend
npm install
cp .env.example .env
# .env 파일에서 DB 및 JWT 설정 수정
npm run start:dev
```

2. **Frontend 설정**
```bash
cd frontend
npm install
cp .env.local.example .env.local
# .env.local에서 API URL 확인
npm run dev
```

### 데이터베이스 설정

```bash
# PostgreSQL 데이터베이스 생성
createdb together_pray

# 마이그레이션 실행 (예정)
cd backend
npm run migration:run
```

## 📊 개발 상황

현재 진행 상황은 `tasks.md` 참조

- ✅ Phase 1: 프로젝트 초기 설정 (90% 완료)
- ⏳ Phase 2: 인증 시스템 (진행 예정)

## 📖 문서

- [구현 계획](./IMPLEMENTATION_PLAN.md) - 전체 개발 로드맵
- [DB 스키마](./DATABASE_SCHEMA.md) - 데이터베이스 설계
- [작업 진행 상황](./tasks.md) - 현재 진행 상태
- [Claude Code 가이드](./CLAUDE.md) - AI 개발 도우미 가이드

## 🔐 보안 원칙

1. 모든 기도제목은 그룹 스코핑 (그룹 멤버만 접근)
2. 익명 기도제목의 작성자 정보 보호
3. JWT 기반 인증
4. 입력 검증 및 SQL Injection 방지

## 📱 모바일 우선

모든 UI는 모바일 뷰포트를 우선으로 설계 및 테스트

## 📝 라이선스

PoC 프로젝트 - 교육 및 테스트 목적
