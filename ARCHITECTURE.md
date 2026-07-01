# Nexus AI Architecture

Nexus AI is designed as a hybrid static/full-stack application.

## System Overview

```text
Browser UI
  |
  |-- GitHub Pages mode
  |     uses localStorage for persistence
  |
  |-- Full-stack local mode
        calls FastAPI at http://127.0.0.1:8000
        stores workspace data in SQLite
```

The public demo stays easy to access through GitHub Pages, while the backend folder shows the path toward a production full-stack product.

## Frontend

Files:

- `index.html`
- `styles.css`
- `app.js`

Responsibilities:

- Render the student career workspace
- Track applications, projects, certifications, networking, interviews, goals, skills, and resume notes
- Calculate career readiness signals
- Generate skill-gap recommendations
- Import/export workspace snapshots
- Detect whether the backend API is available
- Fall back to browser localStorage when the backend is unavailable

## Backend

Files:

- `backend/main.py`
- `backend/schema.sql`
- `backend/seed.py`
- `backend/smoke_test.py`
- `backend/test_api_contract.py`

Responsibilities:

- Expose REST endpoints through FastAPI
- Store workspace records in SQLite
- Provide snapshot import/export behavior
- Calculate readiness analytics
- Calculate target-role skill gaps
- Support workspace reset

## Data Model

Main entities:

- Profile
- Applications
- Certifications
- Projects
- Skills
- Networking contacts
- Interviews
- Goals
- Resume notes
- Activity log

These entities model career preparation as connected data instead of disconnected notes.

## Persistence Modes

### GitHub Pages Mode

When opened from GitHub Pages, Nexus AI uses browser localStorage. This keeps the public demo deployable without a hosted backend.

### API Mode

When the frontend runs locally and detects the FastAPI backend, it switches to API mode and stores workspace data in SQLite.

Default backend URL:

```text
http://127.0.0.1:8000
```

You can override the API URL with:

```text
?api=http://127.0.0.1:8000
```

## Production Path

The next production architecture would be:

```text
Frontend: Vercel or GitHub Pages
Backend: Render, Railway, or Fly.io
Database: PostgreSQL
Auth: Clerk, Firebase Auth, or FastAPI auth
AI Layer: Claude/OpenAI API with transparent recommendation explanations
```

## Design Principle

The AI layer should support student decision-making, not replace it. Nexus AI should explain recommendations, show the data behind them, and keep students in control of their career plan.
