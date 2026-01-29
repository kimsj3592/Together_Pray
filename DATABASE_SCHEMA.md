# Database Schema - Together Pray

## ERD Overview

```
users (1) ----< (N) group_members (N) >---- (1) groups
                                                  |
                                                  | (1)
                                                  |
                                                  v
                                            prayer_items (N)
                                                  |
                                        +---------+---------+
                                        |         |         |
                                        v         v         v
                                   updates   reactions  comments
```

## Tables

### users
사용자 계정 정보

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | 사용자 ID |
| email | VARCHAR(255) | UNIQUE, NOT NULL | 이메일 |
| password | VARCHAR(255) | NOT NULL | 해시된 비밀번호 |
| name | VARCHAR(100) | NOT NULL | 사용자 이름 |
| created_at | TIMESTAMP | NOT NULL | 가입일 |
| updated_at | TIMESTAMP | NOT NULL | 수정일 |

### groups
교회/소그룹

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | 그룹 ID |
| name | VARCHAR(100) | NOT NULL | 그룹 이름 |
| description | TEXT | | 그룹 설명 |
| invite_code | VARCHAR(50) | UNIQUE, NOT NULL | 초대 코드 |
| created_at | TIMESTAMP | NOT NULL | 생성일 |
| updated_at | TIMESTAMP | NOT NULL | 수정일 |

### group_members
그룹 멤버십

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | 멤버십 ID |
| user_id | UUID | FK → users, NOT NULL | 사용자 ID |
| group_id | UUID | FK → groups, NOT NULL | 그룹 ID |
| role | ENUM | NOT NULL | admin \| member |
| joined_at | TIMESTAMP | NOT NULL | 가입일 |

**Unique Constraint**: (user_id, group_id)

### prayer_items
기도제목

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | 기도제목 ID |
| group_id | UUID | FK → groups, NOT NULL | 그룹 ID |
| author_id | UUID | FK → users, NOT NULL | 작성자 ID |
| title | VARCHAR(200) | NOT NULL | 제목 |
| content | TEXT | NOT NULL | 내용 |
| category | VARCHAR(50) | | 카테고리 |
| status | ENUM | NOT NULL | 기도중 \| 부분응답 \| 응답완료 |
| is_anonymous | BOOLEAN | NOT NULL, DEFAULT false | 익명 여부 |
| created_at | TIMESTAMP | NOT NULL | 작성일 |
| updated_at | TIMESTAMP | NOT NULL | 수정일 |

### prayer_updates
기도제목 업데이트

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | 업데이트 ID |
| prayer_item_id | UUID | FK → prayer_items, NOT NULL | 기도제목 ID |
| content | TEXT | NOT NULL | 업데이트 내용 |
| created_at | TIMESTAMP | NOT NULL | 작성일 |

### prayer_reactions
함께 기도한 반응

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | 반응 ID |
| prayer_item_id | UUID | FK → prayer_items, NOT NULL | 기도제목 ID |
| user_id | UUID | FK → users, NOT NULL | 사용자 ID |
| reacted_at | DATE | NOT NULL | 반응일 (날짜만) |

**Unique Constraint**: (prayer_item_id, user_id, reacted_at)

### comments (Optional)
댓글

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | 댓글 ID |
| prayer_item_id | UUID | FK → prayer_items, NOT NULL | 기도제목 ID |
| user_id | UUID | FK → users, NOT NULL | 작성자 ID |
| content | TEXT | NOT NULL | 댓글 내용 |
| created_at | TIMESTAMP | NOT NULL | 작성일 |
| updated_at | TIMESTAMP | NOT NULL | 수정일 |

## Indexes

```sql
-- Users
CREATE INDEX idx_users_email ON users(email);

-- Group Members
CREATE INDEX idx_group_members_user_id ON group_members(user_id);
CREATE INDEX idx_group_members_group_id ON group_members(group_id);

-- Prayer Items
CREATE INDEX idx_prayer_items_group_id ON prayer_items(group_id);
CREATE INDEX idx_prayer_items_author_id ON prayer_items(author_id);
CREATE INDEX idx_prayer_items_status ON prayer_items(status);
CREATE INDEX idx_prayer_items_created_at ON prayer_items(created_at DESC);

-- Prayer Reactions
CREATE INDEX idx_prayer_reactions_prayer_item_id ON prayer_reactions(prayer_item_id);
CREATE INDEX idx_prayer_reactions_user_id ON prayer_reactions(user_id);
```

## Business Rules

1. **Prayer Reactions**: 하루에 한 번만 가능 (unique constraint)
2. **Anonymous Posts**: `is_anonymous = true`일 경우 API에서 `author_id` 노출 금지
3. **Group Access**: 모든 prayer_items는 group_id로 스코핑, 멤버십 검증 필수
4. **Status Updates**: 작성자 또는 그룹 관리자만 가능
5. **Invite Code**: 그룹 생성 시 UUID 기반 초대 코드 자동 생성
