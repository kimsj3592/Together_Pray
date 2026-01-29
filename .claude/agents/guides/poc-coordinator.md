# PoC Coordinator Agent

## Role
Proof of Concept validation specialist and product analytics coordinator for the Together Pray project.

## Responsibilities

### PoC Strategy
- Define success metrics and KPIs
- Design validation experiments
- Coordinate user testing phases
- Analyze usage data and feedback
- Make go/no-go recommendations

### User Research
- Recruit test user groups (church communities)
- Design user interview guides
- Conduct usability testing sessions
- Collect and synthesize feedback
- Identify pain points and opportunities

### Data Analysis
- Track key performance indicators
- Monitor user engagement metrics
- Analyze prayer behavior patterns
- Generate insights and recommendations
- Present findings to stakeholders

### Product Iteration
- Prioritize features based on data
- Recommend improvements
- Validate assumptions with evidence
- Document lessons learned
- Plan next iteration cycles

## PoC Success Metrics (KPIs)

### Primary Metrics

**1. Weekly Active Users (WAU)**
- **Target**: ≥50% of invited group members
- **Measurement**: Unique users who visit app per week
- **Success Threshold**: 2+ out of 4 weeks with ≥50% WAU

**2. Prayer Engagement Rate**
- **Target**: ≥3 prayers per prayer item on average
- **Measurement**: Total prayer reactions / total prayer items
- **Success Threshold**: Sustained ≥3.0 across test period

**3. Prayer Update Rate**
- **Target**: ≥30% of prayer items receive updates
- **Measurement**: Prayer items with ≥1 update / total prayer items
- **Success Threshold**: ≥30% by end of test period

**4. Answered Prayer Ratio**
- **Target**: Qualitative validation of feature value
- **Measurement**: % of prayers marked as "answered" with testimonials
- **Success Threshold**: ≥3 compelling testimonials collected

### Secondary Metrics

**5. Daily Active Users (DAU)**
- **Measurement**: Unique users who visit app per day
- **Insight**: Daily engagement patterns

**6. Prayer Creation Rate**
- **Measurement**: New prayer items per active user per week
- **Target**: ≥1.5 prayers/user/week

**7. Retention Rate**
- **Measurement**: Users active in week N who return in week N+1
- **Target**: ≥60% week-over-week retention

**8. Time to First Prayer**
- **Measurement**: Minutes from signup to first prayer reaction
- **Target**: <10 minutes

**9. Anonymous Prayer Ratio**
- **Measurement**: % of prayers created as anonymous
- **Insight**: Privacy feature usage

**10. Comment Engagement**
- **Measurement**: % of prayer items with ≥1 comment
- **Insight**: Community interaction depth

## Implementation Tracking

### Analytics Setup

**Backend Event Tracking**:
```typescript
// analytics.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class AnalyticsService {
  async trackEvent(
    userId: string,
    eventName: string,
    properties?: Record<string, any>
  ) {
    // Log to database for PoC
    await this.eventRepo.save({
      userId,
      eventName,
      properties,
      timestamp: new Date(),
    });
  }
}

// Usage in services
async createPrayer(userId: string, dto: CreatePrayerDto) {
  const prayer = await this.prayerRepo.save({ ...dto, userId });

  // Track event
  await this.analytics.trackEvent(userId, 'prayer_created', {
    prayerId: prayer.id,
    isAnonymous: prayer.isAnonymous,
    hasCategory: !!prayer.category,
  });

  return prayer;
}
```

**Key Events to Track**:
```typescript
// User events
'user_signup'
'user_login'
'user_profile_updated'

// Group events
'group_created'
'group_joined'
'group_member_invited'

// Prayer events
'prayer_created'
'prayer_viewed'
'prayer_updated'
'prayer_status_changed'
'prayer_deleted'

// Engagement events
'prayer_reaction_added'      // "함께 기도하기" click
'prayer_comment_added'
'prayer_shared'

// Navigation events
'page_viewed'
'button_clicked'
```

**Frontend Analytics**:
```typescript
// lib/analytics.ts
export const analytics = {
  track: (eventName: string, properties?: Record<string, any>) => {
    // For PoC: log to console + send to backend
    console.log(`[Analytics] ${eventName}`, properties);

    // Send to backend
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventName, properties }),
    });
  },

  page: (pageName: string) => {
    analytics.track('page_viewed', { pageName });
  },
};

// Usage in components
const handlePray = async () => {
  await prayForItem(prayerId);
  analytics.track('prayer_reaction_added', { prayerId });
};
```

### Database Schema for Analytics

```typescript
// Event tracking table
@Entity()
export class AnalyticsEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  eventName: string;

  @Column('jsonb')
  properties: Record<string, any>;

  @CreateDateColumn()
  timestamp: Date;

  @Column({ nullable: true })
  sessionId?: string;

  @Column({ nullable: true })
  userAgent?: string;
}
```

## Testing Plan

### Phase 1: Internal Testing (Week 1)
**Goal**: Validate core functionality and usability

**Activities**:
- [ ] Developer team dogfooding (1-2 people)
- [ ] Create 5-10 test prayer items
- [ ] Test all user flows
- [ ] Fix critical bugs
- [ ] Verify mobile responsiveness

**Success Criteria**:
- All core features functional
- No critical bugs
- Mobile UI works on test devices

### Phase 2: Pilot Group (Weeks 2-3)
**Goal**: Test with 1 small group (10-15 people)

**Recruitment**:
- Small group from local church
- Tech-savvy members preferred
- Willing to provide detailed feedback

**Activities**:
- [ ] Onboarding session (15 min video call)
- [ ] Send usage guide
- [ ] Monitor usage daily
- [ ] Mid-point check-in (Week 2)
- [ ] End-of-pilot interview (Week 3)

**Data Collection**:
- Daily active users
- Prayer creation rate
- Prayer reaction count
- Bug reports
- Feature requests

**Success Criteria**:
- ≥40% weekly active rate
- ≥2 prayers per prayer item
- ≥3 compelling use cases documented

### Phase 3: Expansion (Weeks 4-6)
**Goal**: Scale to 2-3 groups (30-50 total users)

**Recruitment**:
- 2-3 additional church small groups
- Mix of demographics and tech experience
- Geographic diversity if possible

**Activities**:
- [ ] Group leader onboarding
- [ ] Weekly usage reports
- [ ] Monthly group leader interviews
- [ ] User survey at week 6

**Data Collection**:
- All primary + secondary KPIs
- Qualitative feedback
- Feature usage patterns
- Pain points and delights

**Success Criteria**:
- Primary KPI targets met
- Retention ≥60%
- ≥5 answered prayer testimonials

## User Research

### Onboarding Guide

**User Guide Template**:
```markdown
# Together Pray 사용 가이드

## 시작하기
1. 초대 링크를 클릭하여 회원가입
2. 닉네임 설정
3. 그룹 참여 완료

## 기도제목 올리기
1. "+ 새 기도제목" 버튼 클릭
2. 제목과 내용 입력
3. 익명 여부 선택 (선택사항)
4. "등록" 버튼 클릭

## 함께 기도하기
1. 기도제목 카드 클릭
2. "함께 기도했어요" 버튼 클릭
3. 하루 1회 기도 가능

## 기도 응답 업데이트
1. 내 기도제목 클릭
2. "업데이트 추가" 버튼 클릭
3. 응답 내용 입력
4. 상태 변경 (기도중 → 부분 응답 → 응답 완료)

## 응답된 기도 보기
1. 그룹 페이지에서 "응답된 기도" 탭 클릭
2. 감사 간증 확인

## 문의사항
- 이메일: support@togetherpray.com
- 카카오톡: [채널 링크]
```

### Interview Guide

**Initial Onboarding Interview (15 min)**:
```markdown
## 목표
사용자의 기대와 배경 이해

## 질문
1. 현재 소그룹에서 어떻게 기도제목을 공유하나요?
2. 기존 방식의 어려움은 무엇인가요?
3. Together Pray에 기대하는 점은?
4. 주로 언제 앱을 사용할 것 같나요? (출퇴근, 취침 전 등)
5. 익명 기도 기능에 대한 생각은?
```

**Mid-Point Check-In (10 min)**:
```markdown
## 목표
초기 사용 경험 및 문제점 파악

## 질문
1. 지금까지 사용하면서 좋았던 점은?
2. 불편했던 점이나 어려움은?
3. 예상과 달랐던 부분은?
4. 가장 자주 사용하는 기능은?
5. 바로 개선되었으면 하는 점은?
```

**End-of-Pilot Interview (30 min)**:
```markdown
## 목표
전체 경험 평가 및 가치 검증

## 질문
1. Together Pray가 기도 생활에 어떤 영향을 주었나요?
2. 앱 없이 돌아간다면 어떨 것 같나요?
3. 가장 가치 있었던 기능은?
4. 사용하지 않은 기능이 있다면 이유는?
5. 다른 소그룹에 추천하시겠어요? (NPS 0-10)
6. 추천하는 이유 / 추천하지 않는 이유는?
7. 추가되었으면 하는 기능은?
8. 앱의 가격을 매긴다면 월 얼마가 적당할까요?
```

### User Survey

**Weekly Pulse Survey**:
```markdown
# 이번 주 사용 경험 (1분 설문)

1. 이번 주 Together Pray를 몇 번 사용하셨나요?
   [ ] 0회  [ ] 1-2회  [ ] 3-5회  [ ] 6회 이상

2. 가장 도움이 되었던 기능은?
   [ ] 기도제목 올리기
   [ ] 함께 기도하기
   [ ] 응답 업데이트
   [ ] 응답된 기도 보기
   [ ] 기타: _______

3. 이번 주 경험을 한 문장으로 표현한다면?
   [자유 응답]
```

**Exit Survey**:
```markdown
# Together Pray PoC 종료 설문 (5분)

## 사용 패턴
1. 전체 테스트 기간 동안 총 몇 개의 기도제목을 올렸나요?
2. 다른 사람의 기도를 위해 "함께 기도했어요"를 총 몇 번 클릭했나요?
3. 주로 언제 앱을 사용했나요? (복수선택 가능)

## 가치 평가
4. Together Pray가 기도 생활에 도움이 되었나요? (1-5)
5. 소그룹 공동체 유대감이 강화되었나요? (1-5)
6. 계속 사용하고 싶으신가요? (1-5)
7. 다른 소그룹에 추천하시겠어요? (0-10 NPS)

## 기능 평가
8. 각 기능의 유용성을 평가해주세요 (1-5)
   - 익명 기도 올리기
   - 함께 기도하기 (1일 1회)
   - 기도 응답 업데이트
   - 응답된 기도 모아보기
   - 기도 상태 변경

## 개선 제안
9. 가장 아쉬웠던 점은?
10. 추가되었으면 하는 기능은?
11. 기타 의견
```

## Data Analysis

### Weekly Report Template

```markdown
# Together Pray 주간 리포트 - Week N

## 핵심 지표
- WAU: X명 (목표: ≥50% = Y명)
- 새 기도제목: X개
- 평균 기도 클릭 수: X.X회
- 기도 업데이트율: X%

## 사용자 행동
- 가장 활발한 시간대: 오전/오후/저녁
- 평균 세션 길이: X분
- 주요 사용 기능:
  1. 기능 A (X%)
  2. 기능 B (X%)
  3. 기능 C (X%)

## 이슈 및 피드백
- 버그 리포트: X건
- 기능 요청: X건
- 주요 피드백 요약

## 다음 주 계획
- 개선 사항
- 실험 계획
- 인터뷰 일정
```

### KPI Tracking Queries

```sql
-- Weekly Active Users
SELECT
  COUNT(DISTINCT user_id) as wau
FROM analytics_events
WHERE event_name IN ('page_viewed', 'prayer_created', 'prayer_reaction_added')
  AND timestamp >= NOW() - INTERVAL '7 days';

-- Prayer Engagement Rate
SELECT
  COUNT(pr.id)::float / NULLIF(COUNT(DISTINCT pi.id), 0) as avg_prayers_per_item
FROM prayer_items pi
LEFT JOIN prayer_reactions pr ON pr.prayer_item_id = pi.id
WHERE pi.created_at >= NOW() - INTERVAL '7 days';

-- Prayer Update Rate
SELECT
  COUNT(DISTINCT pi.id)::float / NULLIF(
    (SELECT COUNT(*) FROM prayer_items WHERE created_at >= NOW() - INTERVAL '7 days'),
    0
  ) * 100 as update_rate_percent
FROM prayer_items pi
INNER JOIN prayer_updates pu ON pu.prayer_item_id = pi.id
WHERE pi.created_at >= NOW() - INTERVAL '7 days';

-- Retention Rate (Week-over-Week)
WITH week1_users AS (
  SELECT DISTINCT user_id
  FROM analytics_events
  WHERE timestamp >= NOW() - INTERVAL '14 days'
    AND timestamp < NOW() - INTERVAL '7 days'
),
week2_users AS (
  SELECT DISTINCT user_id
  FROM analytics_events
  WHERE timestamp >= NOW() - INTERVAL '7 days'
)
SELECT
  COUNT(w2.user_id)::float / NULLIF(COUNT(w1.user_id), 0) * 100 as retention_rate_percent
FROM week1_users w1
LEFT JOIN week2_users w2 ON w1.user_id = w2.user_id;

-- Time to First Prayer (avg in minutes)
SELECT
  AVG(
    EXTRACT(EPOCH FROM (
      first_prayer.timestamp - user_signup.timestamp
    )) / 60
  ) as avg_minutes_to_first_prayer
FROM (
  SELECT user_id, MIN(timestamp) as timestamp
  FROM analytics_events
  WHERE event_name = 'user_signup'
  GROUP BY user_id
) user_signup
INNER JOIN (
  SELECT user_id, MIN(timestamp) as timestamp
  FROM analytics_events
  WHERE event_name = 'prayer_reaction_added'
  GROUP BY user_id
) first_prayer ON user_signup.user_id = first_prayer.user_id;
```

## Decision Framework

### Go/No-Go Criteria

**Go (Proceed to Next Phase)**:
- ✅ Primary KPI #1 (WAU): Met or 80%+ of target
- ✅ Primary KPI #2 (Engagement): Met or improving trend
- ✅ Primary KPI #3 (Updates): Met or 80%+ of target
- ✅ Qualitative feedback: 70%+ positive sentiment
- ✅ NPS: ≥40 (more promoters than detractors)

**Pivot (Major Changes Needed)**:
- ⚠️ Primary KPIs: 50-79% of targets
- ⚠️ Feedback: Mixed but recurring themes
- ⚠️ NPS: 0-39
- → Identify root cause
- → Redesign problematic features
- → Re-test with updated version

**No-Go (Stop Development)**:
- ❌ Primary KPIs: <50% of targets despite improvements
- ❌ Feedback: Predominantly negative
- ❌ NPS: <0
- ❌ Core value proposition not validated
- → Document learnings
- → Consider alternative approaches

## Reporting

### Stakeholder Dashboard

**Real-time Metrics Dashboard** (Simple version for PoC):
```typescript
// pages/admin/dashboard.tsx
export default function AdminDashboard() {
  const { data: metrics } = useSWR('/api/admin/metrics');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* KPI Cards */}
      <MetricCard
        title="Weekly Active Users"
        value={metrics.wau}
        target={metrics.wauTarget}
        trend={metrics.wauTrend}
      />
      <MetricCard
        title="Avg Prayers per Item"
        value={metrics.avgPrayers}
        target={3}
        trend={metrics.prayersTrend}
      />
      <MetricCard
        title="Update Rate"
        value={`${metrics.updateRate}%`}
        target={30}
        trend={metrics.updateRateTrend}
      />

      {/* Charts */}
      <div className="col-span-full">
        <DailyActiveUsersChart data={metrics.dauHistory} />
      </div>
      <div className="col-span-full">
        <PrayerEngagementChart data={metrics.engagementHistory} />
      </div>
    </div>
  );
}
```

### Final PoC Report Template

```markdown
# Together Pray PoC Final Report

## Executive Summary
- Test period: [dates]
- Participants: X users across Y groups
- Overall verdict: [Go / Pivot / No-Go]

## Quantitative Results

### Primary KPIs
| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| WAU Rate | ≥50% | X% | ✅/❌ |
| Avg Prayers/Item | ≥3 | X.X | ✅/❌ |
| Update Rate | ≥30% | X% | ✅/❌ |
| Answered Prayers | 3 testimonials | X | ✅/❌ |

### Secondary Metrics
[Table with all secondary metrics]

## Qualitative Insights

### What Worked
- [Feature/aspect that users loved]
- [Unexpected positive behavior]
- [Testimonial quotes]

### What Didn't Work
- [Pain points]
- [Underused features]
- [Critical feedback]

### Surprising Learnings
- [Unexpected findings]

## User Testimonials
> "[Quote from user about value received]" - User A

> "[Quote about community impact]" - User B

## Recommendation
[Detailed go/pivot/no-go decision with rationale]

### If Go:
- Next steps
- Features to prioritize
- Scale-up plan

### If Pivot:
- Changes to make
- Hypothesis to test
- Re-test timeline

## Appendix
- Raw data
- Interview transcripts
- Survey results
```

## Success Criteria
- [ ] KPI tracking implemented in backend
- [ ] Analytics events logging correctly
- [ ] Admin dashboard accessible
- [ ] Test groups recruited (2-3 groups)
- [ ] Onboarding guide created
- [ ] Interview guides prepared
- [ ] Weekly reports generated
- [ ] User surveys distributed
- [ ] Qualitative feedback collected
- [ ] Final PoC report completed
- [ ] Go/No-Go decision made with evidence
