# Agent Orchestration Guide

Strategic guide for coordinating specialized agents throughout the Together Pray development lifecycle.

## Overview

This guide provides phase-by-phase agent coordination strategies aligned with `IMPLEMENTATION_PLAN.md`. Each phase specifies which agents to activate, their collaboration patterns, and success handoffs.

## Phase-by-Phase Agent Coordination

### Phase 1: Project Setup (Days 1-2)

**Primary Agents**: Database Architect, DevOps Specialist
**Supporting Agents**: Backend Developer, Frontend Developer

**Workflow**:
```
1. DevOps Specialist
   → Set up development environment
   → Configure PostgreSQL locally
   → Initialize Git repository
   → Create project structure

2. Database Architect
   → Design ERD
   → Define table schemas
   → Plan migration strategy
   → Create initial TypeORM entities

3. Backend Developer
   → Initialize NestJS project
   → Configure TypeORM
   → Set up environment variables
   → Configure ESLint/Prettier

4. Frontend Developer
   → Initialize Next.js project
   → Set up TailwindCSS
   → Configure TypeScript
   → Create folder structure
```

**Handoff**: Initial project scaffolding complete, databases ready for development

---

### Phase 2: Authentication System (Days 3-5)

**Primary Agents**: Auth & Security Specialist, Backend Developer
**Supporting Agents**: Database Architect, Frontend Developer, Test Engineer

**Workflow**:
```
1. Database Architect
   → Create User entity
   → Design auth tables
   → Generate migration

2. Auth & Security Specialist + Backend Developer
   → Implement JWT strategy
   → Create auth guards
   → Build signup/login APIs
   → Hash passwords with bcrypt
   → Implement token refresh

3. Frontend Developer
   → Create signup page
   → Create login page
   → Implement auth context
   → Set up protected routes

4. Test Engineer
   → Write auth API tests
   → Test password hashing
   → Validate token expiration
   → Test protected routes

5. Auth & Security Specialist (Review)
   → Security audit
   → Validate JWT implementation
   → Check for vulnerabilities
```

**Handoff**: Secure authentication system with passing tests

---

### Phase 3: Group Features (Days 6-8)

**Primary Agents**: Backend Developer, Database Architect
**Supporting Agents**: Auth & Security, Frontend Developer, Test Engineer

**Workflow**:
```
1. Database Architect
   → Create Group and GroupMember entities
   → Design invite code system
   → Generate migrations

2. Backend Developer
   → Implement group CRUD APIs
   → Create invite link generation
   → Build group join logic
   → Implement membership validation

3. Auth & Security Specialist
   → Create GroupMemberGuard
   → Validate permissions
   → Test invite code security

4. Frontend Developer
   → Build group selection UI
   → Create group creation form
   → Implement invite link sharing
   → Design group join flow

5. Test Engineer
   → Test group APIs
   → Validate membership logic
   → Test invite code expiration
```

**Handoff**: Functional group system with invite mechanism

---

### Phase 4: Prayer Items Core (Days 9-13)

**Primary Agents**: Backend Developer, Frontend Developer, Mobile UX Specialist
**Supporting Agents**: Database Architect, Auth & Security, Test Engineer, PoC Coordinator

**Workflow**:
```
1. PoC Coordinator
   → Define prayer item KPIs
   → Set up analytics events
   → Plan tracking strategy

2. Database Architect
   → Create PrayerItem entity
   → Design status enum
   → Handle anonymous prayers
   → Generate migration

3. Backend Developer
   → Build prayer CRUD APIs
   → Implement status management
   → Add analytics tracking
   → Create filtering logic

4. Auth & Security Specialist
   → Create PrayerOwnerGuard
   → Protect anonymous author IDs
   → Validate group membership

5. Mobile UX Specialist
   → Design prayer card layout
   → Create status badge system
   → Optimize for mobile touch
   → Design prayer detail page

6. Frontend Developer
   → Implement prayer list
   → Build prayer creation form
   → Create detail page
   → Integrate analytics tracking

7. Test Engineer
   → Test prayer APIs
   → Validate anonymous protection
   → Test status changes
   → Verify analytics events
```

**Handoff**: Core prayer system with analytics tracking

---

### Phase 5: Prayer Updates (Days 14-15)

**Primary Agents**: Backend Developer, Frontend Developer
**Supporting Agents**: Database Architect, Mobile UX Specialist

**Workflow**:
```
1. Database Architect
   → Create PrayerUpdate entity
   → Design timeline schema
   → Generate migration

2. Backend Developer
   → Build update CRUD APIs
   → Implement timeline sorting

3. Mobile UX Specialist
   → Design timeline UI
   → Create update card layout

4. Frontend Developer
   → Implement timeline component
   → Build update form
   → Add real-time updates
```

**Handoff**: Prayer update timeline functional

---

### Phase 6: Prayer Reactions (Days 16-17)

**Primary Agents**: Backend Developer, Auth & Security
**Supporting Agents**: Database Architect, Frontend Developer, Test Engineer, PoC Coordinator

**Workflow**:
```
1. Database Architect
   → Create PrayerReaction entity
   → Add unique constraint for daily limit
   → Generate migration

2. Backend Developer
   → Implement prayer reaction API
   → Add daily limit logic
   → Track reaction analytics

3. Auth & Security Specialist
   → Validate daily limit enforcement
   → Prevent duplicate reactions

4. Frontend Developer
   → Build prayer button
   → Show prayer count
   → Disable after praying

5. Test Engineer
   → Test daily limit logic
   → Validate timestamp checks
   → Test reaction counting

6. PoC Coordinator
   → Track prayer engagement metrics
   → Monitor daily active prayers
```

**Handoff**: Prayer reaction system with daily limit

---

### Phase 7: Answered Prayers (Days 18-19)

**Primary Agents**: Backend Developer, Frontend Developer, PoC Coordinator
**Supporting Agents**: Mobile UX Specialist

**Workflow**:
```
1. Backend Developer
   → Create answered prayer filter API
   → Add group statistics

2. Mobile UX Specialist
   → Design answered prayers page
   → Create celebration UI

3. Frontend Developer
   → Build answered prayers view
   → Implement filtering
   → Add testimonial display

4. PoC Coordinator
   → Set up testimonial collection
   → Plan answered prayer tracking
```

**Handoff**: Answered prayers collection feature ready

---

### Phase 8: Comments (Optional) (Days 20-21)

**Primary Agents**: Backend Developer, Frontend Developer
**Supporting Agents**: Database Architect, Auth & Security

**Workflow**:
```
1. Database Architect
   → Create Comment entity
   → Generate migration

2. Backend Developer
   → Build comment CRUD APIs

3. Frontend Developer
   → Implement comment list
   → Build comment form

4. Auth & Security Specialist
   → Validate comment permissions
```

**Handoff**: Comment system (if implemented)

---

### Phase 9: User Profile (Days 22-23)

**Primary Agents**: Frontend Developer, Backend Developer
**Supporting Agents**: Mobile UX Specialist

**Workflow**:
```
1. Backend Developer
   → Create user profile APIs
   → Build "my prayers" query
   → Build "prayed for" query

2. Mobile UX Specialist
   → Design profile page layout
   → Create prayer history UI

3. Frontend Developer
   → Build profile page
   → Implement prayer lists
   → Add profile editing
```

**Handoff**: User profile pages complete

---

### Phase 10: Testing & QA (Days 24-26)

**Primary Agent**: Test Engineer
**Supporting Agents**: All agents for their domains

**Workflow**:
```
1. Test Engineer (Coordinator)
   → Review test coverage
   → Run full test suite
   → Identify gaps

2. Backend Developer + Auth & Security
   → Fix backend test failures
   → Add missing API tests

3. Frontend Developer + Mobile UX Specialist
   → Fix frontend test failures
   → Add component tests
   → Run E2E tests on mobile

4. Test Engineer
   → Performance testing
   → Cross-browser testing
   → Mobile device testing

5. All Agents
   → Code review
   → Bug fixing
```

**Handoff**: All tests passing, bugs fixed

---

### Phase 11: Deployment (Days 27-29)

**Primary Agent**: DevOps Specialist
**Supporting Agents**: Backend Developer, Frontend Developer, Auth & Security, Test Engineer

**Workflow**:
```
1. DevOps Specialist
   → Set up production database (Neon/Supabase)
   → Configure environment variables
   → Set up CI/CD pipeline

2. Backend Developer + DevOps
   → Deploy backend to Railway/Vercel
   → Run production migrations
   → Configure CORS

3. Frontend Developer + DevOps
   → Deploy frontend to Vercel
   → Configure API endpoints
   → Set up domain

4. Auth & Security Specialist
   → Verify HTTPS enforcement
   → Check secret security
   → Validate production auth

5. DevOps Specialist
   → Set up monitoring (Sentry)
   → Configure health checks
   → Set up backups

6. Test Engineer
   → Smoke test production
   → Verify all flows work
   → Performance validation
```

**Handoff**: Production deployment successful and monitored

---

### Phase 12: PoC Operation (Weeks 2-6)

**Primary Agent**: PoC Coordinator
**Supporting Agents**: DevOps Specialist, Mobile UX Specialist, All agents for bug fixes

**Workflow**:
```
1. PoC Coordinator
   → Recruit test groups
   → Onboard users
   → Distribute usage guide

2. PoC Coordinator (Ongoing)
   → Monitor KPIs daily
   → Conduct user interviews
   → Collect feedback
   → Generate weekly reports

3. DevOps Specialist
   → Monitor uptime and errors
   → Fix production issues
   → Optimize performance

4. Mobile UX Specialist
   → Analyze mobile usage patterns
   → Identify UX friction points
   → Recommend improvements

5. All Agents (as needed)
   → Fix critical bugs
   → Implement quick wins
   → Respond to user feedback

6. PoC Coordinator (Final)
   → Analyze results
   → Write final report
   → Make go/no-go recommendation
```

**Handoff**: PoC results and strategic recommendation

---

## Agent Collaboration Patterns

### Sequential Pattern
Agents work in strict order, each completing before the next begins.

**Example**: Database Architect → Backend Developer → Frontend Developer

**Use When**:
- Strong dependencies between steps
- Each step requires previous completion
- Clear handoff points

### Parallel Pattern
Multiple agents work simultaneously on independent tasks.

**Example**: Backend Developer (API) ∥ Frontend Developer (UI mockups) ∥ Test Engineer (test setup)

**Use When**:
- Tasks are independent
- Can save development time
- Resources available

### Review Pattern
One agent completes work, another reviews before merge.

**Example**: Backend Developer → Auth & Security Specialist (security review)

**Use When**:
- Quality gates needed
- Specialized expertise required
- High-risk changes

### Pairing Pattern
Two agents collaborate simultaneously on same task.

**Example**: Mobile UX Specialist + Frontend Developer (mobile UI implementation)

**Use When**:
- Complex requirements
- Cross-functional expertise needed
- Knowledge transfer desired

---

## Critical Path Dependencies

### Blocker Dependencies
```
Database Schema → Backend APIs → Frontend Integration → Testing
                 ↓
              Auth System (must be first)
                 ↓
              Group System
                 ↓
              Prayer System
```

### Recommended Parallelization
```
Phase 2 (Auth) → MUST complete first

Then parallel:
├─ Phase 3: Groups (Backend + Frontend)
├─ Phase 5: Updates (Backend + Frontend)
└─ Phase 6: Reactions (Backend + Frontend)

Phase 4 (Prayer Items) → MUST complete before Phase 7 (Answered Prayers)
```

---

## Agent Communication Protocol

### Handoff Checklist
Each agent should complete before handing off:

**Database Architect**:
- [ ] ERD documented
- [ ] Entities created
- [ ] Migration tested
- [ ] Indexes defined

**Backend Developer**:
- [ ] APIs implemented
- [ ] DTOs validated
- [ ] Error handling added
- [ ] Analytics tracked

**Frontend Developer**:
- [ ] Components responsive
- [ ] Forms validated
- [ ] Loading states added
- [ ] API integrated

**Auth & Security**:
- [ ] Guards implemented
- [ ] Permissions validated
- [ ] Security audit passed
- [ ] No vulnerabilities

**Test Engineer**:
- [ ] Tests written
- [ ] Coverage ≥80%
- [ ] All tests passing
- [ ] E2E flows validated

**DevOps Specialist**:
- [ ] Deployment successful
- [ ] Monitoring active
- [ ] Backups configured
- [ ] Rollback tested

**Mobile UX Specialist**:
- [ ] Mobile optimized
- [ ] Touch targets ≥44px
- [ ] Performance validated
- [ ] Accessibility checked

**PoC Coordinator**:
- [ ] KPIs defined
- [ ] Analytics tracked
- [ ] Users onboarded
- [ ] Feedback collected

---

## Emergency Protocols

### Production Issue Response
```
1. DevOps Specialist
   → Detect and assess issue
   → Page relevant agents

2. Relevant Domain Agent(s)
   → Diagnose root cause
   → Propose fix or rollback

3. Test Engineer
   → Validate fix in staging

4. DevOps Specialist
   → Deploy fix
   → Verify resolution

5. PoC Coordinator
   → Communicate to users
   → Document incident
```

### Critical Bug Protocol
```
Priority 1 (Blocking): Fix within 2 hours
Priority 2 (Major): Fix within 24 hours
Priority 3 (Minor): Fix in next sprint

Agents mobilize based on domain:
- Auth bugs → Auth & Security + Backend
- UI bugs → Frontend + Mobile UX
- Data bugs → Database Architect + Backend
- Deployment → DevOps + relevant domain
```

---

## Success Metrics by Agent

**Database Architect**:
- Zero migration failures
- Query performance <100ms
- Data integrity maintained

**Backend Developer**:
- API response time <200ms
- Error rate <0.1%
- Test coverage ≥80%

**Frontend Developer**:
- Page load <2s
- Bundle size <500KB
- Zero console errors

**Auth & Security**:
- Zero security vulnerabilities
- Auth success rate >99%
- No unauthorized access

**Test Engineer**:
- Coverage ≥80% (unit)
- Coverage ≥70% (integration)
- All E2E flows passing

**DevOps Specialist**:
- Uptime ≥99.9%
- Deploy time <5 min
- Zero failed deployments

**Mobile UX Specialist**:
- Lighthouse mobile >90
- Touch targets ≥44px
- Accessibility score >90

**PoC Coordinator**:
- WAU ≥50%
- Engagement ≥3 prayers/item
- NPS ≥40

---

## Best Practices

### 1. Clear Communication
- Document decisions in agent markdown files
- Use pull request descriptions for context
- Tag relevant agents in code reviews

### 2. Single Responsibility
- Each agent focuses on their domain
- Avoid scope creep
- Request help from other agents when needed

### 3. Evidence-Based Handoffs
- Provide test results
- Share performance metrics
- Document known issues

### 4. Continuous Feedback
- PoC Coordinator shares user feedback with all agents
- Test Engineer reports test failures immediately
- DevOps alerts on production issues

### 5. Knowledge Sharing
- Pairing sessions for complex features
- Code review for knowledge transfer
- Documentation updates after major changes

---

## Quick Reference: "Which Agent Do I Need?"

**Task**: Create database table
**Agent**: Database Architect

**Task**: Build API endpoint
**Agent**: Backend Developer

**Task**: Add auth guard
**Agent**: Auth & Security Specialist

**Task**: Design mobile UI
**Agent**: Mobile UX Specialist

**Task**: Implement React component
**Agent**: Frontend Developer

**Task**: Write tests
**Agent**: Test Engineer

**Task**: Deploy to production
**Agent**: DevOps Specialist

**Task**: Analyze user behavior
**Agent**: PoC Coordinator

**Task**: Fix security vulnerability
**Agent**: Auth & Security Specialist

**Task**: Optimize mobile performance
**Agent**: Mobile UX Specialist + Frontend Developer

**Task**: Investigate production error
**Agent**: DevOps Specialist + relevant domain agent

**Task**: Make product decision
**Agent**: PoC Coordinator

---

## Conclusion

Effective agent orchestration requires:
- Clear phase boundaries
- Well-defined handoffs
- Domain expertise respect
- Continuous communication
- Evidence-based decisions

By following this guide, the Together Pray project can achieve:
- ✅ Efficient development workflow
- ✅ High code quality
- ✅ Secure and performant application
- ✅ Successful PoC validation
- ✅ Data-driven product decisions
