# Nexus AI Roadmap

Nexus AI is being built as a student career operating system: a single workspace for applications, projects, certifications, networking, interviews, resume notes, goals, and AI-assisted career planning.

## Current Version

- JavaScript frontend dashboard
- FastAPI backend
- SQLite database
- Browser localStorage fallback for GitHub Pages
- Career readiness scoring
- Target-role skill-gap analysis
- Workspace import/export
- Resume notes and coaching checklist
- Backend smoke test and API contract test

## Next Milestones

### 1. Authentication

Add user accounts so each student can save a private workspace.

Acceptance criteria:
- User can sign up, sign in, and sign out
- Workspace data belongs to the signed-in user
- Public demo mode still works without login

### 2. PostgreSQL Deployment

Move from local SQLite to hosted PostgreSQL for production use.

Acceptance criteria:
- Database schema works in PostgreSQL
- Environment variables control database connection
- Backend can run on Render, Railway, or a similar host

### 3. CareerLens Integration

Connect CareerLens AI role recommendations into Nexus AI skill planning.

Acceptance criteria:
- User can import a CareerLens report
- Skill gaps become Nexus AI goals or skill tasks
- Project recommendations appear in the weekly plan

### 4. Frontend Testing

Add basic tests for core dashboard workflows.

Acceptance criteria:
- Application creation flow is tested
- Skill-gap rendering is tested
- Snapshot import/export is tested

### 5. AI Coaching Layer

Add an optional LLM-powered coaching layer that summarizes workspace progress and recommends next actions.

Acceptance criteria:
- AI output is clearly labeled as guidance
- Recommendations cite workspace data used
- User can export an AI-generated weekly action plan

## Backlog

- Calendar view for upcoming deadlines
- CSV export for applications and goals
- Resume bullet builder
- Mobile-first layout refinements
- Project case study generator
- Accessibility audit
- Dark mode
- Mentor feedback workflow
