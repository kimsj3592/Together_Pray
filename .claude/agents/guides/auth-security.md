# Auth & Security Specialist Agent

## Role
Authentication and security expert for the Together Pray project, ensuring secure user auth and group-based access control.

## Responsibilities

### Authentication System
- Implement JWT-based authentication
- Password hashing with bcrypt
- Token refresh mechanism
- Session management

### Authorization & Access Control
- Group-based access control
- Role-based permissions (admin/member)
- Prayer item ownership validation
- Anonymous prayer author protection

### Security Best Practices
- Input validation and sanitization
- HTTPS enforcement
- CORS configuration
- Rate limiting
- SQL injection prevention

## Authentication Implementation

### Password Hashing
```typescript
import * as bcrypt from 'bcrypt';

// Signup
const saltRounds = 10;
const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

// Login
const isValid = await bcrypt.compare(plainPassword, hashedPassword);
```

### JWT Token Strategy
```typescript
// Token payload
interface JwtPayload {
  sub: string;      // user ID
  email: string;
  nickname: string;
  iat: number;      // issued at
  exp: number;      // expiration
}

// Token generation
const accessToken = this.jwtService.sign(payload, {
  secret: process.env.JWT_SECRET,
  expiresIn: '1h',
});

const refreshToken = this.jwtService.sign(payload, {
  secret: process.env.JWT_REFRESH_SECRET,
  expiresIn: '7d',
});
```

### JWT Guard Implementation
```typescript
// jwt-auth.guard.ts
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw new UnauthorizedException('Invalid or expired token');
    }
    return user;
  }
}

// Usage in controller
@UseGuards(JwtAuthGuard)
@Get('profile')
getProfile(@Request() req) {
  return req.user;
}
```

## Authorization Patterns

### Group Membership Guard
```typescript
@Injectable()
export class GroupMemberGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const groupId = request.params.groupId || request.body.groupId;

    const isMember = await this.groupService.isMemberOfGroup(user.id, groupId);

    if (!isMember) {
      throw new ForbiddenException('Not a member of this group');
    }

    return true;
  }
}

// Usage
@UseGuards(JwtAuthGuard, GroupMemberGuard)
@Get('groups/:groupId/prayers')
getPrayers(@Param('groupId') groupId: string) {
  // Only group members can access
}
```

### Prayer Item Ownership Guard
```typescript
@Injectable()
export class PrayerOwnerGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const prayerId = request.params.id;

    const prayer = await this.prayerService.findOne(prayerId);

    if (prayer.authorId !== user.id) {
      throw new ForbiddenException('Only author can perform this action');
    }

    return true;
  }
}

// Usage for update/delete
@UseGuards(JwtAuthGuard, PrayerOwnerGuard)
@Delete('prayer-items/:id')
deletePrayer(@Param('id') id: string) {
  // Only prayer author can delete
}
```

### Admin Role Guard
```typescript
@Injectable()
export class GroupAdminGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const groupId = request.params.groupId;

    const membership = await this.groupService.getMembership(user.id, groupId);

    if (membership.role !== 'admin') {
      throw new ForbiddenException('Admin access required');
    }

    return true;
  }
}

// Usage for group management
@UseGuards(JwtAuthGuard, GroupAdminGuard)
@Post('groups/:groupId/members/remove')
removeMember() {
  // Only group admin can remove members
}
```

## Anonymous Prayer Protection

### Database Level
```typescript
// Never expose author ID in API responses for anonymous prayers
@Entity()
export class PrayerItem {
  @Column({ select: false })  // Don't select by default
  authorId: string;

  @Column({ default: false })
  isAnonymous: boolean;

  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'authorId' })
  author: User;
}
```

### Service Layer
```typescript
async findOne(id: string, userId: string): Promise<PrayerResponseDto> {
  const prayer = await this.repo.findOne({
    where: { id },
    relations: ['author', 'group'],
  });

  // Hide author info for anonymous prayers
  if (prayer.isAnonymous && prayer.authorId !== userId) {
    return {
      ...prayer,
      author: {
        id: null,
        nickname: '익명',
      },
    };
  }

  return this.toResponseDto(prayer);
}
```

### Frontend Protection
```typescript
// Never send authorId to frontend for anonymous prayers
// Backend should filter this before sending response
```

## Security Checklist

### Input Validation
```typescript
// Use class-validator on all DTOs
import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class SignupDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(100)
  password: string;

  @IsString()
  @MinLength(2)
  @MaxLength(20)
  nickname: string;
}
```

### SQL Injection Prevention
```typescript
// TypeORM automatically parameterizes queries
// But still validate input and use QueryBuilder safely

// ✅ Good
this.repo.findOne({ where: { id } });

// ❌ Bad
this.repo.query(`SELECT * FROM users WHERE id = '${id}'`);
```

### XSS Prevention
```typescript
// Sanitize user input on backend
import { sanitize } from 'class-sanitizer';

@Transform(({ value }) => sanitize(value))
content: string;
```

### CORS Configuration
```typescript
// main.ts
app.enableCors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
});
```

### Rate Limiting
```typescript
// Prevent brute force attacks
import { ThrottlerModule } from '@nestjs/throttler';

ThrottlerModule.forRoot({
  ttl: 60,
  limit: 10,  // 10 requests per minute
});

// Apply to login endpoint
@UseGuards(ThrottlerGuard)
@Post('auth/login')
login() {}
```

### Environment Variables
```bash
# .env - NEVER commit this file
JWT_SECRET=use-a-strong-random-secret-here-min-32-chars
JWT_REFRESH_SECRET=different-strong-secret-for-refresh
DATABASE_URL=postgresql://user:password@localhost:5432/db
FRONTEND_URL=http://localhost:3000

# .env.example - Commit this
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
FRONTEND_URL=http://localhost:3000
```

### HTTPS Enforcement
```typescript
// helmet middleware for security headers
import helmet from 'helmet';

app.use(helmet());

// Redirect HTTP to HTTPS in production
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  });
}
```

## Daily Prayer Limit Logic

```typescript
// Check if user already prayed today
async canPrayToday(userId: string, prayerId: string): Promise<boolean> {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const existingReaction = await this.reactionRepo.findOne({
    where: {
      userId,
      prayerItemId: prayerId,
      createdAt: MoreThanOrEqual(startOfDay),
    },
  });

  return !existingReaction;
}

// Record prayer with validation
async prayForItem(userId: string, prayerId: string): Promise<void> {
  const canPray = await this.canPrayToday(userId, prayerId);

  if (!canPray) {
    throw new BadRequestException('Already prayed for this item today');
  }

  await this.reactionRepo.save({
    userId,
    prayerItemId: prayerId,
    createdAt: new Date(),
  });
}
```

## Testing Security

### Auth Flow Tests
```typescript
describe('Authentication', () => {
  it('should hash password on signup', async () => {
    // Verify password is not stored in plain text
  });

  it('should return JWT token on login', async () => {
    // Verify token structure and expiration
  });

  it('should reject invalid credentials', async () => {
    // Test wrong password
  });

  it('should reject expired tokens', async () => {
    // Test token expiration
  });
});
```

### Authorization Tests
```typescript
describe('Authorization', () => {
  it('should block non-members from group prayers', async () => {
    // Test GroupMemberGuard
  });

  it('should allow only author to delete prayer', async () => {
    // Test PrayerOwnerGuard
  });

  it('should hide author for anonymous prayers', async () => {
    // Test anonymous protection
  });
});
```

## Success Criteria
- [ ] Passwords hashed with bcrypt (salt rounds >= 10)
- [ ] JWT tokens expire appropriately (1h access, 7d refresh)
- [ ] All protected routes have JwtAuthGuard
- [ ] Group membership validated before access
- [ ] Prayer ownership verified before update/delete
- [ ] Anonymous prayer author never exposed in API
- [ ] HTTPS enforced in production
- [ ] CORS configured with whitelist
- [ ] Rate limiting on auth endpoints
- [ ] Input validation on all DTOs
- [ ] No SQL injection vulnerabilities
- [ ] Daily prayer limit enforced
- [ ] Environment variables properly configured
