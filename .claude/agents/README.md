# Specialized Agents for Together Pray v2.0

This directory contains specialized agent configurations for the Together Pray v2.0 development.

## Quick Start

1. **Restart your Claude Code session** to load the agents
2. Run `/agents` to see all available agents
3. Select an agent to activate it for your current task

---

## Available Agents (11)

### Design & UI Agents

#### 1. Design System Architect ⭐ NEW
**File**: `design-system-architect.md`

**Use when**: Creating design tokens, configuring Tailwind, building base UI components

**Key capabilities**:
- Toss-style design token system
- Tailwind configuration
- Base UI components (Button, Card, Input, etc.)
- Light/Dark mode theming
- Typography and spacing systems

---

#### 2. Animation Specialist ⭐ NEW
**File**: `animation-specialist.md`

**Use when**: Implementing micro-interactions, page transitions, gesture interactions

**Key capabilities**:
- Framer Motion animations
- Long press interactions
- Confetti/celebration effects
- Bottom sheet gestures
- Page transitions

---

#### 3. UX Engineer ⭐ NEW
**File**: `ux-engineer.md`

**Use when**: Auditing accessibility, optimizing performance, polishing UX

**Key capabilities**:
- WCAG 2.1 AA compliance
- Core Web Vitals optimization
- Keyboard navigation
- Loading/error/empty states
- Cross-browser testing

---

#### 4. Mobile UX Specialist
**File**: `mobile-ux-specialist.md`

**Use when**: Designing mobile UI, optimizing touch interactions, mobile performance

**Key capabilities**:
- Mobile-first design (375px-768px)
- Touch target optimization (44x44px)
- Korean UX patterns
- Performance optimization

---

### Development Agents

#### 5. Frontend Developer
**File**: `frontend-developer.md`

**Use when**: Building UI components, implementing pages, integrating APIs

**Key capabilities**:
- Next.js App Router pages
- React component development
- API integration
- State management

---

#### 6. Backend Developer
**File**: `backend-developer.md`

**Use when**: Building APIs, implementing business logic, backend features

**Key capabilities**:
- NestJS module/controller/service
- RESTful API design
- DTO validation
- Error handling

---

#### 7. Database Architect
**File**: `database-architect.md`

**Use when**: Designing schemas, creating entities, writing migrations

**Key capabilities**:
- PostgreSQL schema design
- Prisma entity creation
- Database migrations
- Query optimization

---

### Quality & Security Agents

#### 8. Auth & Security Specialist
**File**: `auth-security.md`

**Use when**: Implementing authentication, security reviews

**Key capabilities**:
- JWT authentication
- Authorization guards
- Security best practices

---

#### 9. Test Engineer
**File**: `test-engineer.md`

**Use when**: Writing tests, ensuring coverage, setting up CI/CD tests

**Key capabilities**:
- Unit/integration/E2E tests
- Test coverage analysis
- Performance testing

---

### Operations Agents

#### 10. DevOps Specialist
**File**: `devops-specialist.md`

**Use when**: Deploying, setting up CI/CD, monitoring

**Key capabilities**:
- Production deployment
- CI/CD pipelines
- Monitoring setup

---

#### 11. PoC Coordinator
**File**: `poc-coordinator.md`

**Use when**: Defining KPIs, user research, analytics

**Key capabilities**:
- KPI tracking
- User interviews
- Go/No-Go decisions

---

## v2.0 Development Workflow

### Phase 1: Design System Foundation
```
design-system-architect → Build design tokens, Tailwind config, base components
```

### Phase 2: Navigation & Layout
```
animation-specialist → Page transitions, modal animations
frontend-developer → Implement layout components
```

### Phase 3: Core Feature Enhancement
```
design-system-architect → Feature component design
animation-specialist → Micro-interactions (PrayButton, etc.)
frontend-developer → Implementation
```

### Phase 4: UX Polish
```
ux-engineer → Accessibility audit, performance optimization
animation-specialist → Animation polish
mobile-ux-specialist → Mobile testing
```

### Phase 5: Backend Refactoring
```
backend-developer → Clean architecture
database-architect → Query optimization
auth-security → Security review
```

### Phase 6: QA & Launch
```
test-engineer → E2E tests
devops-specialist → Production deployment
poc-coordinator → KPI tracking
```

---

## Agent Selection Matrix

| Task | Primary Agent | Support Agent |
|------|--------------|---------------|
| Design tokens | design-system-architect | - |
| Base UI components | design-system-architect | animation-specialist |
| Page transitions | animation-specialist | frontend-developer |
| Micro-interactions | animation-specialist | - |
| Feature pages | frontend-developer | mobile-ux-specialist |
| Accessibility | ux-engineer | frontend-developer |
| Performance | ux-engineer | devops-specialist |
| API development | backend-developer | database-architect |
| Authentication | auth-security | backend-developer |
| Testing | test-engineer | frontend-developer |
| Deployment | devops-specialist | - |

---

## Reference Documentation

- [PRD v2.0](../../docs/PRD_V2.md) - Product requirements
- [Tasks](../../TASKS.md) - Development tasks
- [App Documentation](../../docs/APP_DOCUMENTATION.md) - Current app features

---

## Tips for v2.0 Development

### 1. Start with Design System
Always involve `design-system-architect` first for any UI work:
```
design-system-architect (tokens) → animation-specialist (motion) → frontend-developer (implement)
```

### 2. Animation-First Approach
For interactive features, design animations before implementation:
```
animation-specialist (design motion) → frontend-developer (implement with motion)
```

### 3. Accessibility Throughout
Include `ux-engineer` at every phase, not just at the end:
```
Each phase: implement → ux-engineer (review) → iterate
```

### 4. Mobile-First Always
Test on mobile viewports during development:
```
frontend-developer (implement) → mobile-ux-specialist (test) → iterate
```

---

*Last Updated: 2026-01-30 for v2.0*
