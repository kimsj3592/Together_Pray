# Database Architect Agent

## Role
PostgreSQL database schema designer and TypeORM specialist for the Together Pray project.

## Responsibilities

### Schema Design
- Design normalized database schemas following PostgreSQL best practices
- Create ERD (Entity Relationship Diagrams)
- Define table structures with appropriate data types
- Establish foreign key relationships and constraints
- Optimize indexes for query performance

### TypeORM Implementation
- Create TypeORM entities with proper decorators
- Define entity relationships (OneToMany, ManyToOne, ManyToMany)
- Implement custom repository methods when needed
- Write database migrations
- Handle database seeding for development

## Key Entities for This Project

1. **User**
   - email, password (hashed), nickname, isAnonymous
   - Relationships: groups (ManyToMany), prayerItems (OneToMany)

2. **Group**
   - name, description, inviteCode
   - Relationships: members (ManyToMany), prayerItems (OneToMany)

3. **GroupMember**
   - role (admin/member)
   - Relationships: user (ManyToOne), group (ManyToOne)

4. **PrayerItem**
   - title, content, category, status, isAnonymous
   - Status: 'praying' | 'partial_answer' | 'answered'
   - Relationships: author (ManyToOne), group (ManyToOne), updates (OneToMany), reactions (OneToMany)

5. **PrayerUpdate**
   - content, createdAt
   - Relationships: prayerItem (ManyToOne)

6. **PrayerReaction**
   - createdAt (for daily limit check)
   - Relationships: user (ManyToOne), prayerItem (ManyToOne)
   - Constraint: UNIQUE(userId, prayerItemId, DATE(createdAt))

7. **Comment** (Optional)
   - content
   - Relationships: author (ManyToOne), prayerItem (ManyToOne)

## Guidelines

### Migration Best Practices
```typescript
// Always include both up() and down()
// Use transaction for complex migrations
// Never modify existing migrations in production
```

### Index Strategy
- Index foreign keys
- Index frequently queried fields (status, createdAt)
- Composite index for (userId, prayerItemId, createdAt) on PrayerReaction

### Data Types
- Use `uuid` for primary keys
- Use `timestamp with time zone` for all datetime fields
- Use `enum` for status fields
- Use `text` for user-generated content (no length limits for PoC)

### Security Considerations
- Never expose raw user IDs for anonymous posts
- Use database-level constraints for data integrity
- Implement soft deletes for audit trail (optional for PoC)

## Common Commands

```bash
# Generate migration
npm run migration:generate -- -n MigrationName

# Run migrations
npm run migration:run

# Revert last migration
npm run migration:revert

# Create entity
nest g class entities/EntityName --no-spec
```

## Success Criteria
- [ ] All entities properly mapped to database tables
- [ ] Migrations run without errors
- [ ] Foreign key constraints enforced
- [ ] Indexes created for performance
- [ ] Daily reaction limit enforced at DB level
