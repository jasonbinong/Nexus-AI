# Ready-To-Create GitHub Issues

Copy these into GitHub Issues when you want to show the public roadmap more visibly.

## Issue 1: Add Clerk Authentication And Private Student Workspaces

**Goal:** Add user accounts so each student can save a private Nexus AI workspace.

**Tasks:**
- Add Clerk sign-in and sign-up to the frontend
- Send Clerk JWTs with Nexus API requests
- Verify Clerk tokens in FastAPI using the JWKS endpoint
- Create or fetch a `users` row from the verified auth subject
- Scope every profile, application, project, skill, goal, resume note, and activity query by `user_id`
- Keep the public demo workspace available for visitors

**Acceptance Criteria:**
- A signed-in student sees only their own workspace.
- A signed-out visitor can still explore demo/sample mode.
- Backend routes reject unauthenticated private workspace requests.
- README documents required Clerk environment variables.

**Labels:** enhancement, backend, auth, security

## Issue 2: Migrate Workspace Storage From SQLite To PostgreSQL

**Goal:** Upgrade the backend from shared demo SQLite storage to persistent PostgreSQL storage for real users.

**Tasks:**
- Use `backend/postgres_schema.sql` as the first production schema
- Add `DATABASE_URL` configuration
- Add a database adapter layer so SQLite can remain available for local demo mode
- Convert workspace CRUD queries to parameterized PostgreSQL queries
- Add setup instructions for Render PostgreSQL or Neon
- Test snapshot import/export, profile saving, item CRUD, and readiness analytics

**Acceptance Criteria:**
- PostgreSQL stores separate user workspaces.
- Existing SQLite smoke test still works for local/demo mode.
- Render deployment can be configured with `DATABASE_URL`.
- No workspace query returns another user's data.

**Labels:** database, backend, production

## Issue 3: Add AI Resume And Interview Feedback API

**Goal:** Move beyond rule-based coaching by adding optional AI feedback for resume bullets and interview preparation.

**Tasks:**
- Add backend endpoint for resume feedback
- Add backend endpoint for interview practice prompts
- Send the target role, resume notes, projects, and skills as structured context
- Return feedback as JSON with strengths, risks, suggested rewrites, and practice questions
- Add frontend loading and error states
- Keep current rule-based feedback as fallback when no AI key is configured

**Acceptance Criteria:**
- A student can request resume feedback from the Resume view.
- Feedback returns structured, readable suggestions.
- The app works without an AI API key.
- Prompt inputs avoid sending unrelated workspace data.

**Labels:** ai, backend, frontend, privacy

## Additional Roadmap Ideas

### Connect CareerLens AI Reports

**Goal:** Let students import CareerLens AI outputs into Nexus AI.

**Tasks:**
- Define CareerLens report format
- Add import UI
- Convert missing skills into Nexus skill gaps
- Convert project recommendations into goals

**Labels:** integration, product

### Add Frontend Tests

**Goal:** Add tests for the most important user workflows.

**Tasks:**
- Test adding an application
- Test saving profile data
- Test skill-gap calculation
- Test import/export behavior

**Labels:** testing, frontend

### Add Calendar View

**Goal:** Give students a calendar-style view of deadlines across applications, certifications, interviews, networking, and goals.

**Tasks:**
- Combine all dated records into one timeline model
- Add monthly or weekly view
- Highlight overdue and upcoming items
- Link calendar items back to records

**Labels:** frontend, ux

### Add AI Weekly Coach

**Goal:** Generate a weekly action plan from workspace data.

**Tasks:**
- Summarize current applications, goals, skills, and deadlines
- Generate 3-5 next actions
- Explain why each action was recommended
- Add export/copy button

**Labels:** ai, product
