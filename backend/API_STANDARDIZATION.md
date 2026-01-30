# API Standardization Documentation

## Overview

Together Pray v2.0 백엔드 API가 표준화되었습니다. 모든 응답은 일관된 형식을 따르며, Swagger 문서를 통해 API를 탐색할 수 있습니다.

## 표준 응답 형식

### 성공 응답

```typescript
{
  "success": true,
  "data": {
    // 실제 데이터
  },
  "meta": {  // 페이지네이션이 있는 경우에만
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### 에러 응답

```typescript
{
  "success": false,
  "error": {
    "code": "AUTH001",
    "message": "이메일 또는 비밀번호가 올바르지 않습니다",
    "details": {  // 선택적
      "field": "email"
    }
  },
  "timestamp": "2026-01-30T12:00:00.000Z",
  "path": "/api/auth/login"
}
```

## 에러 코드 체계

### Authentication (AUTH001-AUTH099)
- `AUTH001` - 이메일 또는 비밀번호가 올바르지 않습니다
- `AUTH002` - 토큰이 만료되었습니다
- `AUTH003` - 유효하지 않은 토큰입니다
- `AUTH004` - 인증이 필요합니다
- `AUTH005` - 이미 사용 중인 이메일입니다

### Group (GROUP001-GROUP099)
- `GROUP001` - 그룹을 찾을 수 없습니다
- `GROUP002` - 이미 그룹의 멤버입니다
- `GROUP003` - 그룹의 멤버가 아닙니다
- `GROUP004` - 유효하지 않은 초대 링크입니다
- `GROUP005` - 관리자 권한이 필요합니다

### Prayer (PRAYER001-PRAYER099)
- `PRAYER001` - 기도 제목을 찾을 수 없습니다
- `PRAYER002` - 오늘 이미 기도했습니다
- `PRAYER003` - 작성자만 수정/삭제할 수 있습니다
- `PRAYER004` - 유효하지 않은 기도 상태입니다
- `PRAYER005` - 기도 제목 업데이트에 실패했습니다

### User (USER001-USER099)
- `USER001` - 사용자를 찾을 수 없습니다
- `USER002` - 유효하지 않은 사용자 데이터입니다

### Validation (VAL001-VAL099)
- `VAL001` - 입력 데이터 검증에 실패했습니다
- `VAL002` - 필수 항목이 누락되었습니다
- `VAL003` - 입력 형식이 올바르지 않습니다
- `VAL004` - 입력 범위를 벗어났습니다

### General (INT001-INT099)
- `INT001` - 서버 오류가 발생했습니다
- `INT002` - 요청한 리소스를 찾을 수 없습니다
- `INT003` - 잘못된 요청입니다
- `INT004` - 접근 권한이 없습니다
- `INT005` - 리소스 충돌이 발생했습니다

## Swagger 문서

### 접근 방법

개발 환경에서 애플리케이션 실행 후:
```
http://localhost:3001/api/docs
```

### 주요 기능

1. **API 탐색**: 모든 엔드포인트를 카테고리별로 확인
2. **스키마 확인**: 요청/응답 DTO 구조 확인
3. **테스트**: Swagger UI에서 직접 API 호출 테스트
4. **인증**: Bearer 토큰 설정하여 인증이 필요한 API 테스트

### API 태그

- `auth` - 인증 관련 API (회원가입, 로그인, 프로필)
- `users` - 사용자 관련 API (대시보드, 내 기도)
- `groups` - 그룹 관련 API (생성, 조회, 가입)
- `prayer-items` - 기도 제목 관련 API (CRUD, 상태 변경)
- `prayer-updates` - 기도 업데이트 관련 API
- `prayer-reactions` - 기도 반응 관련 API (기도하기)

## 사용 예제

### 1. 로그인

**Request:**
```bash
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123!"
}
```

**Success Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid-string",
      "email": "user@example.com",
      "name": "홍길동",
      "createdAt": "2026-01-30T12:00:00.000Z"
    }
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "AUTH001",
    "message": "이메일 또는 비밀번호가 올바르지 않습니다"
  },
  "timestamp": "2026-01-30T12:00:00.000Z",
  "path": "/auth/login"
}
```

### 2. 기도 제목 생성

**Request:**
```bash
POST /prayer-items
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "groupId": "550e8400-e29b-41d4-a716-446655440000",
  "title": "가족의 건강을 위한 기도",
  "content": "가족 모두가 건강하고 평안하게 지낼 수 있도록 기도합니다.",
  "isAnonymous": false
}
```

**Success Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-string",
    "groupId": "550e8400-e29b-41d4-a716-446655440000",
    "title": "가족의 건강을 위한 기도",
    "content": "가족 모두가 건강하고 평안하게 지낼 수 있도록 기도합니다.",
    "status": "PRAYING",
    "isAnonymous": false,
    "prayerCount": 0,
    "author": {
      "id": "uuid-string",
      "name": "홍길동"
    },
    "createdAt": "2026-01-30T12:00:00.000Z",
    "updatedAt": "2026-01-30T12:00:00.000Z"
  }
}
```

### 3. 그룹별 기도 제목 목록 조회 (페이지네이션)

**Request:**
```bash
GET /prayer-items/group/550e8400-e29b-41d4-a716-446655440000?page=1&limit=20&status=PRAYING
Authorization: Bearer {accessToken}
```

**Success Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-string",
      "title": "가족의 건강을 위한 기도",
      // ... prayer item data
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

## 유효성 검증

모든 DTO는 `class-validator`를 사용한 자동 유효성 검증이 적용됩니다.

### 검증 규칙 예시

**SignupDto:**
- `email`: 필수, 유효한 이메일 형식
- `password`: 필수, 8-100자
- `name`: 필수, 2-100자

**CreatePrayerItemDto:**
- `groupId`: 필수, UUID 형식
- `title`: 필수, 2-200자
- `content`: 필수, 5-2000자
- `isAnonymous`: 선택, boolean

### 검증 실패 응답

```json
{
  "success": false,
  "error": {
    "code": "VAL001",
    "message": "입력 데이터 검증에 실패했습니다",
    "details": [
      {
        "field": "email",
        "constraints": {
          "isEmail": "유효한 이메일 주소를 입력해주세요"
        },
        "value": "invalid-email"
      }
    ]
  },
  "timestamp": "2026-01-30T12:00:00.000Z",
  "path": "/auth/signup"
}
```

## 보안 고려사항

1. **JWT 인증**: 모든 보호된 엔드포인트는 `Authorization: Bearer {token}` 헤더 필요
2. **입력 검증**: 모든 사용자 입력은 DTO 레벨에서 검증
3. **에러 메시지**: 프로덕션 환경에서는 상세한 에러 정보 숨김
4. **CORS**: 허용된 오리진에서만 API 접근 가능

## 마이그레이션 가이드

기존 API 클라이언트를 업데이트하는 경우:

1. **응답 구조 변경**: 모든 응답이 `{ success, data, meta }` 형식으로 래핑됨
2. **에러 처리**: `error.code`를 사용하여 특정 에러 타입 처리
3. **페이지네이션**: `meta` 객체에서 페이지네이션 정보 확인
4. **Swagger**: API 문서를 통해 최신 스펙 확인

## 개발자 도구

### 추가된 파일 구조

```
src/
├── common/
│   ├── constants/
│   │   └── error-codes.ts          # 에러 코드 정의
│   ├── dto/
│   │   └── api-response.dto.ts     # 표준 응답 DTO
│   ├── exceptions/
│   │   ├── business.exception.ts   # 비즈니스 로직 예외
│   │   └── validation.exception.ts # 유효성 검증 예외
│   ├── filters/
│   │   └── http-exception.filter.ts # 전역 예외 필터
│   └── interceptors/
│       └── response.interceptor.ts  # 응답 변환 인터셉터
```

### BusinessException 사용 예시

```typescript
// 서비스 레이어에서
import { BusinessException } from '@/common';

// 팩토리 메서드 사용
throw BusinessException.prayerNotFound(prayerId);

// 커스텀 예외
throw new BusinessException(
  ErrorCode.PRAYER_ALREADY_PRAYED,
  { prayerItemId },
  HttpStatus.CONFLICT
);
```

## 테스트

```bash
# 빌드 확인
npm run build

# 개발 서버 실행
npm run start:dev

# Swagger 문서 접속
open http://localhost:3001/api/docs
```

## 참고 자료

- [NestJS Documentation](https://docs.nestjs.com)
- [Swagger/OpenAPI Specification](https://swagger.io/specification/)
- [class-validator](https://github.com/typestack/class-validator)
