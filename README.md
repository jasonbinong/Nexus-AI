# Nexus AI

![Nexus AI thumbnail](thumbnail.png)

Nexus AI is a student career operating system for ambitious college students. It brings applications, certifications, projects, networking, interview preparation, resume notes, goals, skill gaps, and coaching into one organized workspace.

## Quick Links

- [Live App](https://jasonbinong.github.io/Nexus-AI/)
- [Live App With Render Backend](https://jasonbinong.github.io/Nexus-AI/?api=https%3A%2F%2Fnexus-ai-api-upkl.onrender.com)
- [Backend Health Check](https://nexus-ai-api-upkl.onrender.com/health)
- [Portfolio Case Study](https://jasonbinong.github.io/nexus-case-study.html)
- [Jason Binong Portfolio](https://jasonbinong.github.io/)

## Project Snapshot

| Area | Details |
| --- | --- |
| Status | Flagship portfolio product and startup exploration |
| Focus | Career tracking, readiness scoring, student productivity, backend persistence |
| Users | College students preparing for internships and early-career opportunities |
| Frontend | HTML, CSS, JavaScript, localStorage |
| Backend | Python, FastAPI, SQLite, Render |
| Deployment | GitHub Pages frontend, Render backend |

## Demo Walkthrough

![Nexus AI demo walkthrough](assets/nexus-ai-demo.gif)

## What It Does

Nexus AI helps students manage the full career-building process instead of tracking everything across notes, spreadsheets, job boards, resumes, and calendar reminders. It gives students one place to manage applications, projects, contacts, interviews, certifications, goals, resume notes, and career-readiness signals.

## Key Features

- Personalized career readiness dashboard
- Blank workspace and guided onboarding for first-time users
- Account-style profile fields for target role, major, timeline, and weekly focus hours
- Internship application tracker with search and status filtering
- Certification, project, networking, interview, goal, and resume note trackers
- Priority Alerts for overdue items, thin pipelines, deadline windows, missing proof links, and role-fit gaps
- Recent Activity timeline to make the workspace feel active
- Career readiness scoring and target-role skill gap analysis
- AI-style coaching generated from workspace data
- Weekly career plan generator with priorities, reasons, time estimates, and due timing
- Downloadable career action plan and resume notes
- JSON import/export for workspace snapshots
- FastAPI + SQLite backend with CRUD endpoints for core workspace collections
- Backend-generated workspace report and readiness analytics
- GitHub Pages frontend with optional Render API connection

## Tech Stack

- HTML/CSS
- JavaScript
- Browser localStorage
- Python
- FastAPI
- SQLite
- Render
- GitHub Pages

## What Reviewers Should Notice

- Full-stack product direction with a working frontend and backend
- CRUD API design for career-workspace collections
- Relational data modeling with SQLite
- Clear product thinking around student career workflows
- Readiness analytics tied to applications, skills, projects, goals, networking, and deadlines
- Startup-ready roadmap toward authentication, PostgreSQL, and AI coaching

## Backend API

The backend is optional for the static GitHub Pages app, but it powers the full-stack version.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/health` | Verify API status, version, configured origins, and available collections |
| `GET` | `/snapshot` | Return the full workspace |
| `GET` | `/analytics/readiness` | Return readiness score and target-role skill gap analysis |
| `GET` | `/workspace/report` | Return backend-generated summary, alerts, weekly actions, readiness, and skill gaps |
| `PUT` | `/profile` | Update profile data |
| `PUT` | `/resume` | Update saved resume notes |
| `GET` | `/{collection}` | List records in a workspace collection |
| `POST` | `/{collection}` | Create a record |
| `PUT` | `/{collection}/{item_id}` | Edit a record |
| `DELETE` | `/{collection}/{item_id}` | Delete a record |
| `POST` | `/workspace/import` | Import a JSON workspace snapshot |
| `DELETE` | `/workspace/reset` | Clear the workspace |

Supported collections: `applications`, `certifications`, `projects`, `skills`, `networking`, `interviews`, and `goals`.

## How To Run

Open `index.html` in a browser for the static app.

To run the backend:

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python seed.py
uvicorn main:app --reload
```

Then open:

```text
http://127.0.0.1:8000/docs
```

Run the frontend at the same time:

```bash
cd ..
python -m http.server 8070
```

Then open:

```text
http://127.0.0.1:8070/
```

## Tests And Checks

Verify the SQLite schema:

```bash
cd backend
python smoke_test.py
```

Test the API contract after installing dependencies:

```bash
pytest test_api_contract.py
```

## Portfolio Materials

- [Architecture](ARCHITECTURE.md)
- [Deployment Guide](DEPLOYMENT.md)
- [Auth and PostgreSQL Plan](AUTH_POSTGRESQL_PLAN.md)
- [Roadmap](ROADMAP.md)
- [Demo Script](DEMO_SCRIPT.md)
- [Demo Video Script](DEMO_VIDEO_SCRIPT.md)
- [Resume Entry](RESUME_ENTRY.md)
- [Security Policy](SECURITY.md)
- [Privacy Notes](PRIVACY.md)

## Future Improvements

- Add authentication with Clerk or Firebase
- Move production persistence from SQLite to PostgreSQL
- Add user accounts and role-based access controls
- Connect CareerLens recommendations into the Nexus skill plan
- Add AI-generated resume feedback using a real LLM API
- Add frontend and backend test coverage
