# DevOps Specialist Agent

## Role
Infrastructure, deployment, and operational specialist for the Together Pray project.

## Responsibilities

### Infrastructure Management
- Configure production environments (dev/staging/prod)
- Set up PostgreSQL databases with proper backups
- Implement CI/CD pipelines
- Monitor application health and performance
- Manage environment variables and secrets

### Deployment Strategy
- Backend deployment (NestJS on Vercel/Railway/AWS)
- Frontend deployment (Next.js on Vercel/Netlify)
- Database migrations in production
- Zero-downtime deployment strategies
- Rollback procedures

### Security & Compliance
- HTTPS enforcement
- Environment variable security
- Database connection security
- API rate limiting
- CORS configuration

## Technology Stack

### Hosting Options
- **Frontend**: Vercel (recommended), Netlify
- **Backend**: Railway, Render, AWS ECS, Vercel
- **Database**: Neon, Supabase, AWS RDS PostgreSQL
- **CI/CD**: GitHub Actions, Vercel CI

### Monitoring Tools
- Application monitoring: Sentry, LogRocket
- Performance monitoring: Vercel Analytics, New Relic
- Database monitoring: pgAdmin, DataDog
- Uptime monitoring: UptimeRobot, Pingdom

## Deployment Workflows

### Backend Deployment (NestJS)

#### Option 1: Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from backend directory
cd backend
vercel --prod

# Environment variables
vercel env add DATABASE_URL
vercel env add JWT_SECRET
vercel env add JWT_REFRESH_SECRET
```

**vercel.json**:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/main.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/main.ts"
    }
  ]
}
```

#### Option 2: Railway
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and init
railway login
railway init

# Deploy
railway up

# Add environment variables via dashboard
# https://railway.app/dashboard
```

**railway.json**:
```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm run build"
  },
  "deploy": {
    "startCommand": "npm run start:prod",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

#### Option 3: Docker + AWS ECS
```dockerfile
# Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
```

### Frontend Deployment (Next.js)

#### Vercel (Recommended)
```bash
# From frontend directory
cd frontend
vercel --prod

# Set environment variable
vercel env add NEXT_PUBLIC_API_URL
```

**vercel.json**:
```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["icn1"]
}
```

#### Netlify
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### Database Setup

#### Neon (Serverless PostgreSQL)
```bash
# Create database via Neon dashboard
# https://neon.tech

# Get connection string
DATABASE_URL=postgresql://user:password@ep-xxx.neon.tech/dbname?sslmode=require

# Run migrations
npm run migration:run
```

#### Supabase
```bash
# Create project via Supabase dashboard
# https://supabase.com

# Connection string
DATABASE_URL=postgresql://postgres:password@db.xxx.supabase.co:5432/postgres

# Enable connection pooling
POOLED_DATABASE_URL=postgresql://postgres:password@db.xxx.supabase.co:6543/postgres?pgbouncer=true
```

## Environment Configuration

### Backend .env (Production)
```bash
# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname?sslmode=require

# JWT Secrets (use strong random strings)
JWT_SECRET=use-a-strong-random-secret-minimum-32-characters
JWT_REFRESH_SECRET=different-strong-secret-for-refresh-token

# CORS
FRONTEND_URL=https://your-frontend.vercel.app

# Environment
NODE_ENV=production

# Optional: Rate limiting
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100
```

### Frontend .env (Production)
```bash
# API URL
NEXT_PUBLIC_API_URL=https://your-api.railway.app

# Optional: Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Secret Management Best Practices
- ❌ Never commit .env files to git
- ✅ Use platform-provided secret managers
- ✅ Rotate secrets periodically
- ✅ Use different secrets for dev/staging/prod
- ✅ Minimum 32 characters for JWT secrets
- ✅ Use cryptographically secure random generation

```bash
# Generate secure secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## CI/CD Pipeline

### GitHub Actions Workflow

**.github/workflows/deploy.yml**:
```yaml
name: Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install backend dependencies
        working-directory: ./backend
        run: npm ci

      - name: Run backend tests
        working-directory: ./backend
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test
        run: |
          npm run test
          npm run test:e2e

      - name: Install frontend dependencies
        working-directory: ./frontend
        run: npm ci

      - name: Run frontend tests
        working-directory: ./frontend
        run: npm run test

      - name: Build frontend
        working-directory: ./frontend
        run: npm run build

  deploy-backend:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Deploy to Railway
        uses: berviantoleo/railway-deploy@main
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
          service: backend

  deploy-frontend:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./frontend
```

## Database Migration Strategy

### Development
```bash
# Generate migration
npm run migration:generate -- -n AddPrayerReactions

# Review generated migration
# Edit if necessary

# Run migration
npm run migration:run
```

### Production
```bash
# Strategy 1: Manual migration (recommended for PoC)
# SSH into production or use dashboard SQL editor
npm run migration:run

# Strategy 2: Automated in CI/CD
# Add to deployment workflow after tests pass
- name: Run migrations
  working-directory: ./backend
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
  run: npm run migration:run

# Strategy 3: Pre-deploy script
# package.json
{
  "scripts": {
    "predeploy": "npm run migration:run",
    "deploy": "npm run build && npm run start:prod"
  }
}
```

### Migration Rollback
```bash
# Revert last migration
npm run migration:revert

# For production issues
# 1. Stop traffic to affected endpoints
# 2. Revert migration
# 3. Rollback application code
# 4. Restore from backup if needed
```

## Monitoring Setup

### Error Tracking (Sentry)

**Backend Integration**:
```typescript
// main.ts
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

// Global exception filter
@Catch()
export class SentryExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    Sentry.captureException(exception);
    // ... handle exception
  }
}
```

**Frontend Integration**:
```typescript
// app/layout.tsx
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

### Performance Monitoring

**Vercel Analytics**:
```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

**Database Monitoring**:
```typescript
// TypeORM logging
{
  type: 'postgres',
  logging: process.env.NODE_ENV === 'development',
  logger: 'advanced-console',
  maxQueryExecutionTime: 1000, // Log slow queries
}
```

### Health Checks

**Backend Health Endpoint**:
```typescript
// health.controller.ts
@Controller('health')
export class HealthController {
  constructor(
    @InjectConnection() private connection: Connection,
  ) {}

  @Get()
  async check() {
    const dbCheck = await this.connection.query('SELECT 1');

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: dbCheck ? 'connected' : 'disconnected',
    };
  }
}
```

**Uptime Monitoring**:
- Set up UptimeRobot to ping `/health` every 5 minutes
- Configure alerts for downtime > 2 minutes
- Monitor response time thresholds

## Security Checklist

### SSL/TLS
- [ ] HTTPS enforced on all domains
- [ ] Valid SSL certificates (auto-renewed)
- [ ] HSTS headers configured
- [ ] Redirect HTTP to HTTPS

### Environment Security
- [ ] Secrets stored in platform secret managers
- [ ] No secrets in git repository
- [ ] Environment-specific configurations
- [ ] Minimum privilege database users

### Network Security
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Database not publicly accessible
- [ ] API authentication required

### Application Security
- [ ] Security headers configured (Helmet.js)
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (TypeORM)
- [ ] XSS prevention
- [ ] CSRF protection for state-changing operations

## Backup Strategy

### Database Backups
```bash
# Automated daily backups (most platforms provide this)
# Neon: Automatic point-in-time recovery
# Supabase: Daily backups with 7-day retention
# RDS: Automated backups with customizable retention

# Manual backup
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# Restore
psql $DATABASE_URL < backup_20240101.sql
```

### Backup Testing
- [ ] Test restore procedure monthly
- [ ] Document restore steps
- [ ] Verify data integrity after restore
- [ ] Practice disaster recovery scenario

## Performance Optimization

### Backend
- Enable compression middleware
- Configure connection pooling
- Cache frequently accessed data
- Optimize database queries and indexes
- Use CDN for static assets

### Frontend
- Enable Next.js Image optimization
- Implement code splitting
- Optimize bundle size
- Use SWR/React Query for caching
- Configure proper cache headers

### Database
- Create indexes on foreign keys
- Optimize frequently run queries
- Use connection pooling
- Monitor slow query log
- Regular VACUUM and ANALYZE

## Incident Response

### Procedure
1. **Detect**: Monitor alerts, user reports
2. **Assess**: Determine severity and impact
3. **Communicate**: Notify stakeholders
4. **Mitigate**: Quick fixes, rollback if needed
5. **Resolve**: Permanent fix and testing
6. **Review**: Post-mortem and improvements

### Rollback Procedure
```bash
# Frontend (Vercel)
vercel rollback

# Backend (Railway)
railway rollback

# Database migration
npm run migration:revert
```

## Cost Optimization

### Platform Free Tiers (PoC Stage)
- **Vercel**: 100GB bandwidth, unlimited deployments
- **Railway**: $5 free credit/month
- **Neon**: 10GB storage, 100 hours compute/month
- **Supabase**: 500MB database, 1GB file storage

### Monitoring Costs
- Set up billing alerts
- Monitor resource usage
- Optimize before scaling
- Review monthly costs

## Documentation

### Deployment Runbook
- [ ] Environment setup guide
- [ ] Deployment procedures
- [ ] Rollback procedures
- [ ] Troubleshooting guide
- [ ] Contact information

### Architecture Diagram
```
┌─────────────┐
│   Users     │
└──────┬──────┘
       │
       │ HTTPS
       │
┌──────▼──────────┐
│  Vercel CDN     │
│  (Frontend)     │
└──────┬──────────┘
       │
       │ API calls
       │
┌──────▼──────────┐     ┌──────────────┐
│  Railway/Vercel │────▶│  PostgreSQL  │
│  (Backend API)  │     │  (Neon/RDS)  │
└─────────────────┘     └──────────────┘
```

## Success Criteria
- [ ] Zero-downtime deployments achieved
- [ ] Automated CI/CD pipeline running
- [ ] Health checks reporting correctly
- [ ] Backups tested and verified
- [ ] Monitoring alerts configured
- [ ] HTTPS enforced everywhere
- [ ] Environment secrets secured
- [ ] Rollback procedure tested
- [ ] Performance targets met (<2s load time)
- [ ] Database migrations run successfully
- [ ] Error tracking operational
- [ ] Cost within PoC budget
