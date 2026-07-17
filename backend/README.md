# Nexus AI Backend

This folder adds a working backend/database layer to Nexus AI. It uses FastAPI and SQLite so the product can move beyond browser-only storage while staying simple enough to run locally.

## What The API Supports

- Student career profile
- Internship applications
- Certifications
- Projects
- Skills
- Networking contacts
- Interview preparation
- Goals
- Resume notes
- Activity log
- Readiness analytics
- Target-role skill gap analysis
- Health metadata for deployment checks
- Workspace import and reset flows
- Self-healing SQLite schema initialization before endpoint operations

## Run Locally

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python seed.py
uvicorn main:app --reload
```

Optional environment variables are documented in `.env.example`.

## Deploy

The repo includes deployment files:

- Root `render.yaml` for Render
- `backend/Procfile` for Railway-style process startup
- `backend/runtime.txt` for Python runtime pinning

See the root `DEPLOYMENT.md` for full instructions.

Render free-tier note: the provided blueprint uses `/tmp/nexus.db` because persistent disks are not available on free web services. This is fine for demo deployment, but use PostgreSQL or a persistent disk before storing real user data.

Open the API docs:

```text
http://127.0.0.1:8000/docs
```

## Example Requests

Health check:

```bash
curl http://127.0.0.1:8000/health
```

Full workspace snapshot:

```bash
curl http://127.0.0.1:8000/snapshot
curl http://127.0.0.1:8000/analytics/readiness
```

```bash
curl -X POST http://127.0.0.1:8000/applications ^
  -H "Content-Type: application/json" ^
  -d "{\"company\":\"DoorDash\",\"role\":\"AI Research Fellow\",\"status\":\"Wishlist\",\"deadline\":\"2026-07-15\",\"link\":\"\",\"notes\":\"Upload research proposal\"}"
```

## Endpoint Reference

| Method | Endpoint | Request Body | Response |
|---|---|---|---|
| `GET` | `/health` | None | API status, version, DB path, allowed origins, and collections |
| `GET` | `/snapshot` | None | Full workspace snapshot with analytics and skill gap data |
| `GET` | `/analytics/readiness` | None | Readiness score and skill-gap analysis |
| `PUT` | `/profile` | `target_role`, `major`, `graduation`, `weekly_hours` | Updated profile |
| `PUT` | `/resume` | `body` | Saved resume notes |
| `GET` | `/{collection}` | None | All records for a collection |
| `POST` | `/{collection}` | Collection fields | Created record |
| `PUT` | `/{collection}/{item_id}` | Editable collection fields | Updated record |
| `DELETE` | `/{collection}/{item_id}` | None | `204 No Content` |
| `POST` | `/workspace/import` | Nexus JSON snapshot | Imported workspace snapshot |
| `DELETE` | `/workspace/reset` | None | `204 No Content` |

Allowed collections:

```text
applications, certifications, projects, skills, networking, interviews, goals
```

## Database

The database is created at `backend/nexus.db` by default. Set `NEXUS_DB_PATH` to use another location.

The schema is in `schema.sql` and is designed around the same entities used by the frontend dashboard.

## Verify The Database Schema

This smoke test uses only the Python standard library, so it can run before installing FastAPI:

```bash
python smoke_test.py
```

## Run API Tests

After installing the requirements, run:

```bash
pytest test_api_contract.py
```
