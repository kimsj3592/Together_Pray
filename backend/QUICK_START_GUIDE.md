# Quick Start Guide - Together Pray API v2.0

## 1. 개발 서버 실행

```bash
cd /Users/ksj/Desktop/Together_Pray/backend
npm run start:dev
```

서버가 실행되면 다음과 같은 메시지가 표시됩니다:
```
Application is running on: http://localhost:3001
Swagger documentation: http://localhost:3001/api/docs
```

## 2. Swagger UI 접속

브라우저에서 다음 URL로 접속:
```
http://localhost:3001/api/docs
```

## 3. API 테스트 (Swagger UI 사용)

### Step 1: 회원가입

1. `auth` 태그 클릭
2. `POST /auth/signup` 엔드포인트 클릭
3. "Try it out" 버튼 클릭
4. Request body 입력:
```json
{
  "email": "test@example.com",
  "password": "password123!",
  "name": "테스트사용자"
}
```
5. "Execute" 버튼 클릭
6. 응답 확인:
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGci...",
    "user": {
      "id": "...",
      "email": "test@example.com",
      "name": "테스트사용자"
    }
  }
}
```

### Step 2: 로그인

1. `POST /auth/login` 엔드포인트 클릭
2. "Try it out" 버튼 클릭
3. Request body 입력:
```json
{
  "email": "test@example.com",
  "password": "password123!"
}
```
4. "Execute" 버튼 클릭
5. **중요**: 응답에서 `accessToken` 값 복사

### Step 3: 인증 설정

1. Swagger UI 상단의 **"Authorize"** 버튼 클릭
2. 팝업에서 Value 입력란에 복사한 토큰 입력:
```
eyJhbGci... (복사한 전체 토큰)
```
3. "Authorize" 버튼 클릭
4. "Close" 버튼으로 팝업 닫기

이제 모든 인증이 필요한 API를 테스트할 수 있습니다!

### Step 4: 그룹 생성

1. `groups` 태그 클릭
2. `POST /groups` 엔드포인트 클릭
3. "Try it out" 버튼 클릭
4. Request body 입력:
```json
{
  "name": "새벽기도 모임",
  "description": "매일 새벽 5시에 함께 기도하는 모임"
}
```
5. "Execute" 버튼 클릭
6. 응답에서 `groupId` 복사

### Step 5: 기도 제목 작성

1. `prayer-items` 태그 클릭
2. `POST /prayer-items` 엔드포인트 클릭
3. "Try it out" 버튼 클릭
4. Request body 입력 (위에서 복사한 groupId 사용):
```json
{
  "groupId": "복사한-그룹-ID",
  "title": "가족의 건강을 위한 기도",
  "content": "가족 모두가 건강하고 평안하게 지낼 수 있도록 기도합니다.",
  "isAnonymous": false
}
```
5. "Execute" 버튼 클릭
6. 응답에서 `id` (기도 제목 ID) 복사

### Step 6: 그룹별 기도 제목 목록 조회

1. `GET /prayer-items/group/{groupId}` 엔드포인트 클릭
2. "Try it out" 버튼 클릭
3. Parameters:
   - `groupId`: 위에서 복사한 그룹 ID
   - `page`: 1
   - `limit`: 20
4. "Execute" 버튼 클릭
5. 페이지네이션된 응답 확인

### Step 7: 기도하기 (반응 남기기)

1. `prayer-reactions` 태그 클릭
2. `POST /prayer-items/{id}/pray` 엔드포인트 클릭
3. "Try it out" 버튼 클릭
4. `id` 파라미터에 기도 제목 ID 입력
5. "Execute" 버튼 클릭

**제한**: 하루에 한 번만 가능 (같은 날 다시 시도하면 에러 발생)

### Step 8: 기도 업데이트 작성

1. `prayer-updates` 태그 클릭
2. `POST /prayer-items/{id}/updates` 엔드포인트 클릭
3. "Try it out" 버튼 클릭
4. Parameters:
   - `id`: 기도 제목 ID
   - Request body:
```json
{
  "content": "오늘 병원 검사 결과 많이 호전되었습니다. 감사합니다!"
}
```
5. "Execute" 버튼 클릭

## 4. curl을 사용한 API 테스트

Swagger UI 대신 터미널에서 테스트하려면:

### 회원가입
```bash
curl -X POST http://localhost:3001/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123!",
    "name": "테스트사용자"
  }'
```

### 로그인
```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123!"
  }'
```

### 내 프로필 조회 (토큰 필요)
```bash
curl -X GET http://localhost:3001/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 그룹 생성 (토큰 필요)
```bash
curl -X POST http://localhost:3001/groups \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "새벽기도 모임",
    "description": "매일 새벽 5시에 함께 기도하는 모임"
  }'
```

## 5. 에러 테스트

### 유효성 검증 실패
```bash
# 짧은 비밀번호로 회원가입 시도
curl -X POST http://localhost:3001/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "123",
    "name": "테스트"
  }'
```

**예상 응답**:
```json
{
  "success": false,
  "error": {
    "code": "VAL001",
    "message": "입력 데이터 검증에 실패했습니다",
    "details": [
      {
        "field": "password",
        "constraints": {
          "minLength": "비밀번호는 최소 8자 이상이어야 합니다"
        }
      }
    ]
  },
  "timestamp": "2026-01-30T...",
  "path": "/auth/signup"
}
```

### 인증 실패
```bash
# 토큰 없이 보호된 엔드포인트 접근
curl -X GET http://localhost:3001/auth/me
```

**예상 응답**:
```json
{
  "success": false,
  "error": {
    "code": "AUTH004",
    "message": "인증이 필요합니다"
  },
  "timestamp": "2026-01-30T...",
  "path": "/auth/me"
}
```

### 이메일 중복
```bash
# 이미 존재하는 이메일로 회원가입 시도
curl -X POST http://localhost:3001/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123!",
    "name": "중복테스트"
  }'
```

**예상 응답**:
```json
{
  "success": false,
  "error": {
    "code": "AUTH005",
    "message": "이미 사용 중인 이메일입니다"
  },
  "timestamp": "2026-01-30T...",
  "path": "/auth/signup"
}
```

## 6. Swagger UI 기능

### Schemas 탭
- 모든 DTO의 구조 확인
- 각 필드의 타입, 제약 조건, 예시 값 확인

### Models 섹션
- 요청/응답 모델 자동 생성
- 복사하여 사용 가능

### 필터링
- 태그별로 엔드포인트 필터링
- 검색 기능으로 특정 엔드포인트 찾기

### Export
- OpenAPI 스펙 다운로드 가능 (JSON/YAML)
- 다른 도구와 통합 가능

## 7. 문제 해결

### 서버가 시작되지 않을 때
```bash
# 의존성 재설치
npm install

# 빌드 확인
npm run build

# 포트 충돌 확인
lsof -i :3001
```

### Swagger UI가 로드되지 않을 때
- 브라우저 캐시 삭제
- 개발자 도구에서 콘솔 에러 확인
- `NODE_ENV=production`이 아닌지 확인 (Swagger는 개발 환경에서만 활성화)

### 토큰이 만료되었을 때
- 다시 로그인하여 새 토큰 발급
- "Authorize" 버튼 클릭하여 새 토큰으로 업데이트

## 8. 다음 단계

- [API_STANDARDIZATION.md](./API_STANDARDIZATION.md) - 전체 API 문서
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - 구현 세부사항
- Swagger UI에서 모든 엔드포인트 탐색
- 프론트엔드 통합 시작

## 9. 유용한 팁

### 1. 응답 복사
Swagger UI의 응답 섹션에서 "Copy" 버튼으로 JSON 복사 가능

### 2. 여러 탭 사용
동시에 여러 엔드포인트를 열어두고 비교 가능

### 3. 북마크
자주 사용하는 엔드포인트는 브라우저 북마크에 저장
예: `http://localhost:3001/api/docs#/auth/AuthController_login`

### 4. 스크린샷
에러 발생 시 Swagger UI 스크린샷을 찍어 공유하면 디버깅에 유용

### 5. API 클라이언트 생성
Swagger의 "Download" 버튼으로 OpenAPI 스펙을 다운로드하고,
`openapi-generator` 또는 `swagger-codegen`으로 TypeScript 클라이언트 자동 생성 가능

---

**즐거운 API 테스팅 되세요!** 🙏
