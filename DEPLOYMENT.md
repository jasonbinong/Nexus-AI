# Nexus AI Deployment Guide

The public frontend is already deployable through GitHub Pages. The backend can be deployed separately, then connected to the frontend with the `api` query parameter.

## Current Deployment Model

```text
Frontend: GitHub Pages
Backend: Render or Railway
Database: SQLite for prototype deployment
```

For a production multi-user version, move from SQLite to PostgreSQL and add authentication.

## Deploy Backend On Render

Nexus AI includes a Render blueprint at:

```text
render.yaml
```

Steps:

1. Go to Render.
2. Create a new Blueprint or Web Service from the GitHub repo.
3. Use the `render.yaml` configuration.
4. Confirm these environment variables:

```text
NEXUS_DB_PATH=/var/data/nexus.db
NEXUS_ALLOWED_ORIGINS=https://jasonbinong.github.io,http://127.0.0.1:8070,http://localhost:8070
```

5. Wait for the backend to deploy.
6. Open:

```text
https://YOUR-RENDER-SERVICE.onrender.com/health
```

Expected response:

```json
{"status":"ok","database":"/var/data/nexus.db"}
```

## Connect Frontend To Backend

Open the GitHub Pages frontend with:

```text
https://jasonbinong.github.io/Nexus-AI/?api=https://YOUR-RENDER-SERVICE.onrender.com
```

If the backend is reachable, Nexus AI will show:

```text
API connected
```

If the backend is not reachable, the app safely falls back to local browser storage.

## Deploy Backend On Railway

Railway can use the backend `Procfile`:

```text
web: uvicorn main:app --host 0.0.0.0 --port $PORT
```

Set the service root to:

```text
backend
```

Set environment variables:

```text
NEXUS_DB_PATH=/data/nexus.db
NEXUS_ALLOWED_ORIGINS=https://jasonbinong.github.io,http://127.0.0.1:8070,http://localhost:8070
```

If Railway does not provide persistent disk storage on the selected plan, use PostgreSQL instead of SQLite.

## Local Full-Stack Run

Backend:

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python seed.py
uvicorn main:app --reload
```

Frontend:

```bash
python -m http.server 8070
```

Open:

```text
http://127.0.0.1:8070/
```

## Production Notes

Before real student users:

- Add authentication
- Add user-specific workspace ownership
- Move to PostgreSQL
- Add rate limiting
- Add clearer export/delete controls
- Add production logging
