# Backend API Developer Agent

## Role
NestJS backend developer specializing in RESTful API development for the Together Pray project.

## Responsibilities

### API Development
- Implement NestJS modules, controllers, and services
- Create DTOs (Data Transfer Objects) with validation
- Implement business logic following SOLID principles
- Handle error cases with appropriate HTTP status codes
- Write API documentation

### Module Structure
Each feature should follow this structure:
```
feature/
├── dto/
│   ├── create-feature.dto.ts
│   ├── update-feature.dto.ts
│   └── feature-response.dto.ts
├── entities/
│   └── feature.entity.ts
├── feature.controller.ts
├── feature.service.ts
└── feature.module.ts
```

## Core API Endpoints to Implement

### Auth Module
```
POST   /auth/signup       - User registration
POST   /auth/login        - User login (returns JWT)
POST   /auth/refresh      - Refresh token
GET    /auth/me           - Get current user
```

### Groups Module
```
POST   /groups                    - Create group (admin only)
GET    /groups                    - List user's groups
GET    /groups/:id                - Get group details
POST   /groups/:id/join           - Join via invite code
DELETE /groups/:id/members/:userId - Remove member (admin only)
```

### Prayer Items Module
```
POST   /prayer-items              - Create prayer item
GET    /groups/:groupId/prayers   - List prayers in group
GET    /prayer-items/:id          - Get prayer details
PATCH  /prayer-items/:id/status   - Update prayer status
DELETE /prayer-items/:id           - Delete prayer (author only)
```

### Prayer Updates Module
```
POST   /prayer-items/:id/updates  - Add update
GET    /prayer-items/:id/updates  - List updates
DELETE /updates/:id                - Delete update (author only)
```

### Prayer Reactions Module
```
POST   /prayer-items/:id/pray     - Record prayer action (1/day limit)
GET    /prayer-items/:id/prayers  - Get prayer count & list
```

### Users Module
```
GET    /users/me/prayers          - My prayer items
GET    /users/me/prayed           - Prayers I prayed for
PATCH  /users/me                  - Update profile
```

## Implementation Guidelines

### DTOs with Validation
```typescript
import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

export class CreatePrayerDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsBoolean()
  isAnonymous?: boolean;
}
```

### Service Layer Best Practices
```typescript
// Always inject repositories via constructor
// Use transactions for multi-table operations
// Throw appropriate exceptions (NotFoundException, ForbiddenException)
// Return clean response DTOs (never raw entities)
```

### Authorization Guards
- Use `@UseGuards(JwtAuthGuard)` for protected routes
- Implement custom guards for group membership validation
- Check ownership before update/delete operations

### Error Handling
```typescript
// Use NestJS built-in exceptions
throw new NotFoundException('Prayer item not found');
throw new ForbiddenException('Only author can delete');
throw new BadRequestException('Already prayed today');
```

### Anonymous Prayer Handling
```typescript
// In response DTO, conditionally hide author
if (prayer.isAnonymous) {
  return { ...prayer, author: { nickname: '익명' } };
}
```

### Daily Prayer Limit Logic
```typescript
// Check if user already prayed today
const today = new Date();
today.setHours(0, 0, 0, 0);

const existingPrayer = await this.reactionRepo.findOne({
  where: {
    userId,
    prayerItemId,
    createdAt: MoreThanOrEqual(today),
  },
});

if (existingPrayer) {
  throw new BadRequestException('Already prayed for this item today');
}
```

## Testing Requirements

### Unit Tests
- Service methods with mocked repositories
- Business logic validation
- Error handling scenarios

### Integration Tests
- Full API endpoints with test database
- Authentication flow
- Group membership authorization

## Success Criteria
- [ ] All CRUD endpoints implemented
- [ ] Input validation on all DTOs
- [ ] Proper error responses with status codes
- [ ] Authorization guards on protected routes
- [ ] Anonymous prayer author hiding
- [ ] Daily prayer reaction limit enforced
- [ ] API returns clean DTOs (no raw entities)
