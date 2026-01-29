# Specialized Agents for Together Pray Project

This directory contains specialized agent configurations for the Together Pray prayer community development.

## Quick Start

1. **Restart your Claude Code session** to load the agents
2. Run `/agents` to see all available agents
3. Select an agent to activate it for your current task

## Available Agents (8)

### 1. Database Architect
**File**: `database-architect.md`

**Use when**: Designing database schemas, creating entities, writing migrations, optimizing queries

**Key capabilities**:
- PostgreSQL schema design
- TypeORM entity creation
- Database migrations
- Index optimization
- Data integrity constraints

---

### 2. Backend Developer
**File**: `backend-developer.md`

**Use when**: Building APIs, implementing business logic, creating DTOs, developing backend features

**Key capabilities**:
- NestJS module/controller/service implementation
- RESTful API design
- DTO validation
- Error handling
- Analytics integration

---

### 3. Frontend Developer
**File**: `frontend-developer.md`

**Use when**: Building UI components, implementing pages, integrating APIs, client-side features

**Key capabilities**:
- Next.js App Router pages
- React component development
- API integration
- State management
- Form validation

---

### 4. Auth & Security Specialist
**File**: `auth-security.md`

**Use when**: Implementing authentication, creating guards, enforcing permissions, security reviews

**Key capabilities**:
- JWT authentication
- Authorization guards
- Anonymous prayer protection
- Security best practices
- Rate limiting

---

### 5. Test Engineer
**File**: `test-engineer.md`

**Use when**: Writing tests, ensuring coverage, validating business logic, setting up CI/CD tests

**Key capabilities**:
- Unit/integration/E2E tests
- Test coverage analysis
- Performance testing
- Mobile responsiveness testing
- CI/CD integration

---

### 6. DevOps Specialist
**File**: `devops-specialist.md`

**Use when**: Deploying to production, setting up CI/CD, configuring monitoring, managing infrastructure

**Key capabilities**:
- Production deployment (Vercel, Railway)
- CI/CD pipelines (GitHub Actions)
- Database migration strategies
- Monitoring setup (Sentry)
- Backup and rollback procedures

---

### 7. Mobile UX Specialist
**File**: `mobile-ux-specialist.md`

**Use when**: Designing mobile UI, optimizing touch interactions, ensuring accessibility, mobile performance

**Key capabilities**:
- Mobile-first design (375px-768px)
- Touch target optimization (44x44px)
- WCAG 2.1 AA accessibility
- Korean UX patterns
- Performance optimization (<2s load)

---

### 8. PoC Coordinator
**File**: `poc-coordinator.md`

**Use when**: Defining KPIs, conducting user research, analyzing data, making product decisions

**Key capabilities**:
- KPI definition and tracking
- User interview guides
- Analytics implementation
- Weekly reporting
- Go/No-Go decision framework

---

## How to Use These Agents

### In Claude Code CLI

Run the `/agents` command:
```
/agents
```

Then select the agent you need from the list. The agent will be activated with its specialized context.

### Development Workflow

**Phase 1: Database & Backend Setup**
1. `database-architect` → Design schema
2. `backend-developer` → Build APIs
3. `auth-security` → Add guards

**Phase 2: Frontend Development**
4. `mobile-ux-specialist` → Design mobile UI
5. `frontend-developer` → Implement components
6. `test-engineer` → Write tests

**Phase 3: Deployment**
7. `devops-specialist` → Deploy and monitor

**Phase 4: PoC Validation**
8. `poc-coordinator` → Track KPIs and user research

### Multi-Agent Coordination

For complex features, use multiple agents in sequence:

**Example: Prayer Item Feature**
1. `poc-coordinator` → Define success metrics
2. `database-architect` → Create PrayerItem entity
3. `backend-developer` → Build prayer APIs
4. `auth-security` → Add permission guards
5. `mobile-ux-specialist` → Design prayer card UI
6. `frontend-developer` → Implement components
7. `test-engineer` → Write comprehensive tests
8. `devops-specialist` → Deploy to staging

## Agent Specialization Matrix

| Agent | Primary Tech | Focus Area | Success Metric |
|-------|-------------|------------|----------------|
| Database Architect | PostgreSQL, TypeORM | Schema design | Migrations succeed |
| Backend Developer | NestJS | API endpoints | APIs functional |
| Frontend Developer | Next.js, React | UI components | User experience |
| Auth & Security | JWT, Guards | Security | Zero vulnerabilities |
| Test Engineer | Jest, Playwright | Quality assurance | 80%+ coverage |
| DevOps Specialist | Vercel, Railway | Deployment | Zero downtime |
| Mobile UX Specialist | Mobile-first | Accessibility | Lighthouse >90 |
| PoC Coordinator | Analytics | Validation | KPIs met |

---

## Reference Documentation

Detailed guides are available in the `guides/` subdirectory:

- `guides/database-architect.md` - Comprehensive DB design guide
- `guides/backend-developer.md` - Full API implementation guide
- `guides/frontend-developer.md` - Complete frontend guide
- `guides/auth-security.md` - Security best practices
- `guides/test-engineer.md` - Testing strategies
- `guides/devops-specialist.md` - Deployment procedures
- `guides/mobile-ux-specialist.md` - Mobile UX patterns
- `guides/poc-coordinator.md` - PoC validation framework
- `guides/ORCHESTRATION_GUIDE.md` - Phase-by-phase coordination

---

## Tips for Effective Agent Use

### 1. Start with the Right Agent
- Database changes → `database-architect`
- New API → `backend-developer`
- UI work → `mobile-ux-specialist` + `frontend-developer`
- Security concern → `auth-security`
- Deployment → `devops-specialist`

### 2. Sequential Task Flow
Let each agent complete their work before moving to the next:
```
Schema ready → API built → UI designed → Components implemented → Tests written → Deployed
```

### 3. Use PoC Coordinator Early
Define success metrics before building features:
```
poc-coordinator (define KPIs) → development → poc-coordinator (measure results)
```

### 4. Mobile-First Approach
Always involve `mobile-ux-specialist` for user-facing features:
```
mobile-ux-specialist (design) → frontend-developer (implement)
```

---

## Project Context

This agent system is designed for the **Together Pray** prayer community PoC:

- **Goal**: 2-4 week testing with real church groups
- **Tech**: Next.js + NestJS + PostgreSQL
- **Focus**: Mobile-first Korean prayer community
- **Success**: WAU ≥50%, Engagement ≥3 prayers/item

All agents understand this context and work towards these goals.

---

## Contributing

When customizing agents:
1. Edit the agent's `.md` file
2. Maintain YAML frontmatter format
3. Restart Claude Code to reload changes
4. Test the agent with `/agents` command

---

## Need Help?

- Run `/agents` to see all available agents
- Select "Create new agent" to add custom agents
- Check `guides/ORCHESTRATION_GUIDE.md` for phase-by-phase coordination
- Refer to individual agent files for detailed capabilities
