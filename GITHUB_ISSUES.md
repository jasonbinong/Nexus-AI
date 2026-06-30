# Ready-To-Create GitHub Issues

Copy these into GitHub Issues when you want to show the public roadmap more visibly.

## Add Authentication

**Goal:** Add user accounts so each student can save a private Nexus AI workspace.

**Tasks:**
- Choose Clerk, Firebase Auth, or FastAPI auth
- Add user table or external user ID
- Associate workspace records with a user
- Protect backend routes
- Keep public demo mode available

**Labels:** enhancement, backend, auth

## Deploy Backend

**Goal:** Deploy the FastAPI backend so the full-stack version can be used outside local development.

**Tasks:**
- Choose Render, Railway, or Fly.io
- Add environment variable setup
- Confirm CORS works with GitHub Pages
- Update README with production API instructions

**Labels:** deployment, backend

## Move SQLite To PostgreSQL

**Goal:** Upgrade the database from local SQLite to production-ready PostgreSQL.

**Tasks:**
- Convert schema where needed
- Add database URL configuration
- Create migration/setup instructions
- Test application, skill, goal, and snapshot flows

**Labels:** database, backend

## Connect CareerLens AI Reports

**Goal:** Let students import CareerLens AI outputs into Nexus AI.

**Tasks:**
- Define CareerLens report format
- Add import UI
- Convert missing skills into Nexus skill gaps
- Convert project recommendations into goals

**Labels:** integration, product

## Add Frontend Tests

**Goal:** Add tests for the most important user workflows.

**Tasks:**
- Test adding an application
- Test saving profile data
- Test skill-gap calculation
- Test import/export behavior

**Labels:** testing, frontend

## Add Calendar View

**Goal:** Give students a calendar-style view of deadlines across applications, certifications, interviews, networking, and goals.

**Tasks:**
- Combine all dated records into one timeline model
- Add monthly or weekly view
- Highlight overdue and upcoming items
- Link calendar items back to records

**Labels:** frontend, ux

## Add AI Weekly Coach

**Goal:** Generate a weekly action plan from workspace data.

**Tasks:**
- Summarize current applications, goals, skills, and deadlines
- Generate 3-5 next actions
- Explain why each action was recommended
- Add export/copy button

**Labels:** ai, product
