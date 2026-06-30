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

## Run Locally

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python seed.py
uvicorn main:app --reload
```

Open the API docs:

```text
http://127.0.0.1:8000/docs
```

## Example Requests

```bash
curl http://127.0.0.1:8000/snapshot
curl http://127.0.0.1:8000/analytics/readiness
```

```bash
curl -X POST http://127.0.0.1:8000/applications ^
  -H "Content-Type: application/json" ^
  -d "{\"company\":\"DoorDash\",\"role\":\"AI Research Fellow\",\"status\":\"Wishlist\",\"deadline\":\"2026-07-15\",\"link\":\"\",\"notes\":\"Upload research proposal\"}"
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
