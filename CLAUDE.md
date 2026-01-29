# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Together Pray** - Prayer-focused community web app PoC
- Target: 2-4 week testing period with real church groups
- Goal: Validate prayer request tracking with status updates and community engagement

## Tech Stack

- **Frontend**: Next.js (App Router) + React + TypeScript + TailwindCSS
- **Backend**: NestJS + TypeScript
- **Database**: PostgreSQL + TypeORM
- **Auth**: Email-based JWT authentication

## Architecture

### Monorepo Structure (Planned)
```
/
├── frontend/          # Next.js application
│   ├── app/          # App Router pages
│   ├── components/   # React components
│   └── lib/          # Utilities and API clients
└── backend/          # NestJS application
    ├── src/
    │   ├── auth/     # Authentication module
    │   ├── groups/   # Group management
    │   ├── prayers/  # Prayer items core logic
    │   └── users/    # User management
    └── test/
```

### Core Domain Models

1. **User** - Authentication and profile
2. **Group** - Church/small group containers
3. **GroupMember** - User-group relationships with roles
4. **PrayerItem** - Core prayer request entity
   - States: `기도중` (praying) | `부분 응답` (partial answer) | `응답 완료` (answered)
   - Supports anonymous posting
5. **PrayerUpdate** - Timeline updates for prayer items
6. **PrayerReaction** - "Prayed together" actions (1/day limit)
7. **Comment** - Optional discussion feature

### Key Business Rules

- **Prayer Reactions**: Limited to once per day per prayer item
- **Status Updates**: Only author or group admin can change prayer status
- **Anonymous Posts**: Author identity stored server-side, hidden from group members
- **Group Access**: All prayer items scoped to groups, no public access
- **Invite System**: Groups use invite links, admin-only creation

## Development Workflow

### Initial Setup (Not yet done)
```bash
# Backend
cd backend
npm install
cp .env.example .env  # Configure DB and JWT secrets
npm run migration:run
npm run start:dev

# Frontend
cd frontend
npm install
cp .env.local.example .env.local  # Configure API URL
npm run dev
```

### Testing
```bash
# Backend
npm run test          # Unit tests
npm run test:e2e      # Integration tests

# Frontend
npm run test          # Component tests
npm run test:e2e      # Playwright E2E tests
```

### Database
```bash
# Generate migration
npm run migration:generate -- -n MigrationName

# Run migrations
npm run migration:run

# Revert migration
npm run migration:revert
```

## Development Principles

1. **Mobile-First**: All UI must be tested on mobile viewport first
2. **PoC Minimalism**: Implement only features in "Must Have" category
3. **Security-First**: Strict group-based access control, no data leakage
4. **Measurable**: Add usage logging for KPI tracking:
   - Weekly active users
   - Average prayer clicks per item
   - Prayer update rate
   - Answered prayer ratio

## Feature Priority

### Must Have (PoC Critical)
- Email auth (signup/login)
- Group creation and invite links
- Prayer CRUD with status management
- "Prayed together" button with daily limit
- Answered prayers collection view

### Should Have
- Prayer update timeline
- User profile page

### Nice to Have
- Comments
- Category filters
- Statistics dashboard

## API Conventions

- **Auth**: JWT token in `Authorization: Bearer <token>` header
- **Error Format**: `{ statusCode, message, error }`
- **Pagination**: Query params `?page=1&limit=20`
- **Filters**: Prayer status via `?status=answered`

## Security Checklist

- [ ] All prayer endpoints validate group membership
- [ ] Anonymous post author IDs never exposed in API responses
- [ ] JWT tokens expire in reasonable time
- [ ] Input validation on all user-generated content
- [ ] HTTPS enforced in production

## Task Tracking

All work progress should be tracked in `tasks.md` - update this file whenever completing tasks or phases from IMPLEMENTATION_PLAN.md.
