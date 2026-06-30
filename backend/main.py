from __future__ import annotations

import os
import sqlite3
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


BASE_DIR = Path(__file__).resolve().parent
DB_PATH = Path(os.getenv("NEXUS_DB_PATH", BASE_DIR / "nexus.db"))
SCHEMA_PATH = BASE_DIR / "schema.sql"

COLLECTION_FIELDS: dict[str, tuple[str, ...]] = {
    "applications": ("company", "role", "status", "deadline", "link", "notes"),
    "certifications": ("name", "provider", "progress", "target", "link"),
    "projects": ("name", "stack", "stage", "link", "impact"),
    "skills": ("name", "category", "level", "evidence"),
    "networking": ("name", "organization", "status", "next", "notes"),
    "interviews": ("role", "company", "type", "date", "notes"),
    "goals": ("goal", "category", "progress", "due", "next_step"),
}

REQUIRED_FIELDS: dict[str, tuple[str, ...]] = {
    "applications": ("company", "role", "status"),
    "certifications": ("name", "provider"),
    "projects": ("name", "stack", "stage"),
    "skills": ("name", "category", "level"),
    "networking": ("name", "status"),
    "interviews": ("role", "type"),
    "goals": ("goal",),
}

ROLE_REQUIREMENTS = {
    "data analyst": {"SQL", "Excel", "Power BI", "Data Analysis", "Statistics", "Communication"},
    "business intelligence": {"SQL", "Power BI", "Data Visualization", "Business Analysis", "Excel", "Communication"},
    "ai data": {"AI Model Evaluation", "Prompt Engineering", "Data Quality", "Generative AI", "Communication"},
    "machine learning": {"Python", "Statistics", "Machine Learning", "SQL", "Data Visualization"},
    "business analyst": {"Business Analysis", "Systems Analysis", "SQL", "Agile", "Communication"},
    "systems analyst": {"Systems Analysis", "Database Management", "Business Analysis", "Agile", "Documentation"},
    "software": {"JavaScript", "Object-Oriented Programming", "GitHub", "Testing", "APIs"},
    "cloud": {"Cloud Computing", "Troubleshooting", "Networking", "Documentation", "Security"},
    "default": {"SQL", "JavaScript", "Data Analysis", "Generative AI", "GitHub", "Communication"},
}


class Profile(BaseModel):
    target_role: str = ""
    major: str = ""
    graduation: str = ""
    weekly_hours: int = Field(default=0, ge=0, le=80)


class ResumeNotes(BaseModel):
    body: str = ""


class CollectionItem(BaseModel):
    company: str | None = None
    role: str | None = None
    status: str | None = None
    deadline: str | None = None
    link: str | None = None
    notes: str | None = None
    name: str | None = None
    provider: str | None = None
    progress: int | None = Field(default=None, ge=0, le=100)
    target: str | None = None
    stack: str | None = None
    stage: str | None = None
    impact: str | None = None
    category: str | None = None
    level: int | None = Field(default=None, ge=0, le=100)
    evidence: str | None = None
    organization: str | None = None
    next: str | None = None
    type: str | None = None
    date: str | None = None
    goal: str | None = None
    due: str | None = None
    next_step: str | None = None


app = FastAPI(
    title="Nexus AI Backend",
    description="SQLite-backed API for the Nexus AI student career operating system.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


def now() -> str:
    return datetime.now(timezone.utc).isoformat()


def connect() -> sqlite3.Connection:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def init_db() -> None:
    with connect() as conn:
        conn.executescript(SCHEMA_PATH.read_text(encoding="utf-8"))


def row_to_dict(row: sqlite3.Row | None) -> dict[str, Any] | None:
    return dict(row) if row else None


def require_collection(collection: str) -> tuple[str, ...]:
    if collection not in COLLECTION_FIELDS:
        raise HTTPException(status_code=404, detail="Unknown collection")
    return COLLECTION_FIELDS[collection]


def log_activity(conn: sqlite3.Connection, message: str) -> None:
    conn.execute(
        "INSERT INTO activity (id, message, created_at) VALUES (?, ?, ?)",
        (str(uuid.uuid4()), message, now()),
    )


def calculate_score(snapshot: dict[str, Any]) -> dict[str, Any]:
    applications = snapshot["applications"]
    certifications = snapshot["certifications"]
    projects = snapshot["projects"]
    skills = snapshot["skills"]
    networking = snapshot["networking"]
    interviews = snapshot["interviews"]
    goals = snapshot["goals"]
    profile = snapshot["profile"]

    active_apps = [item for item in applications if item.get("status") not in {"Rejected", "Offer"}]
    completed_certs = [item for item in certifications if int(item.get("progress") or 0) >= 100]
    published_projects = [item for item in projects if item.get("stage") in {"Published", "Improving"}]
    strong_skills = [item for item in skills if int(item.get("level") or 0) >= 65]
    active_goals = [item for item in goals if int(item.get("progress") or 0) < 100]

    score = 0
    score += min(len(active_apps) * 7, 24)
    score += min(len(completed_certs) * 8 + len(certifications) * 3, 18)
    score += min(len(published_projects) * 10 + len(projects) * 4, 22)
    score += min(len(strong_skills) * 5, 18)
    score += min(len(networking) * 3, 10)
    score += min(len(interviews) * 4, 8)
    if profile.get("target_role"):
        score += 6
    if active_goals:
        score += 4

    return {
        "career_score": min(score, 100),
        "active_applications": len(active_apps),
        "certifications_in_progress": len([c for c in certifications if int(c.get("progress") or 0) < 100]),
        "portfolio_projects": len(projects),
        "network_touches": len(networking),
        "weekly_focus_hours": profile.get("weekly_hours", 0),
    }


def calculate_skill_gap(snapshot: dict[str, Any]) -> dict[str, Any]:
    target_role = snapshot["profile"].get("target_role", "").lower()
    requirement_key = next((key for key in ROLE_REQUIREMENTS if key in target_role), "default")
    required = ROLE_REQUIREMENTS[requirement_key]
    skill_names = {str(item.get("name", "")).lower() for item in snapshot["skills"]}
    evidence_text = " ".join(
        [
            " ".join(str(value) for value in item.values() if value)
            for item in snapshot["projects"] + snapshot["certifications"]
        ]
    ).lower()

    matched = []
    gaps = []
    for skill in sorted(required):
        has_skill = skill.lower() in skill_names or skill.lower() in evidence_text
        (matched if has_skill else gaps).append(skill)

    coverage = round((len(matched) / len(required)) * 100) if required else 0
    return {"target_role": snapshot["profile"].get("target_role", ""), "coverage": coverage, "matched": matched, "gaps": gaps}


def build_snapshot() -> dict[str, Any]:
    with connect() as conn:
        profile = row_to_dict(conn.execute("SELECT target_role, major, graduation, weekly_hours FROM profiles WHERE id = 1").fetchone())
        resume = row_to_dict(conn.execute("SELECT body FROM resume_notes WHERE id = 1").fetchone())
        snapshot = {"profile": profile or {}, "resume": (resume or {}).get("body", "")}
        for collection in COLLECTION_FIELDS:
            rows = conn.execute(f"SELECT * FROM {collection} ORDER BY created_at DESC").fetchall()
            snapshot[collection] = [row_to_dict(row) for row in rows]
        snapshot["activity"] = [
            row_to_dict(row)
            for row in conn.execute("SELECT message, created_at FROM activity ORDER BY created_at DESC LIMIT 25").fetchall()
        ]
    snapshot["analytics"] = calculate_score(snapshot)
    snapshot["skill_gap"] = calculate_skill_gap(snapshot)
    return snapshot


def clear_workspace(conn: sqlite3.Connection) -> None:
    for table in COLLECTION_FIELDS:
        conn.execute(f"DELETE FROM {table}")
    conn.execute("DELETE FROM activity")
    conn.execute(
        """
        UPDATE profiles
        SET target_role = '', major = '', graduation = '', weekly_hours = 0, updated_at = ?
        WHERE id = 1
        """,
        (now(),),
    )
    conn.execute("UPDATE resume_notes SET body = '', updated_at = ? WHERE id = 1", (now(),))


def pick(raw: dict[str, Any], *keys: str, default: Any = "") -> Any:
    for key in keys:
        if key in raw and raw[key] is not None:
            return raw[key]
    return default


def import_collection(conn: sqlite3.Connection, table: str, rows: list[dict[str, Any]]) -> None:
    fields = COLLECTION_FIELDS[table]
    for raw in rows:
        item_id = pick(raw, "id", default=str(uuid.uuid4()))
        values = []
        for field in fields:
            if table == "goals" and field == "next_step":
                values.append(pick(raw, "next_step", "nextStep"))
            else:
                values.append(pick(raw, field))
        columns = ("id", *fields, "created_at", "updated_at")
        placeholders = ", ".join("?" for _ in columns)
        conn.execute(
            f"INSERT INTO {table} ({', '.join(columns)}) VALUES ({placeholders})",
            [item_id, *values, now(), now()],
        )


@app.on_event("startup")
def startup() -> None:
    init_db()


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "database": str(DB_PATH)}


@app.get("/snapshot")
def snapshot() -> dict[str, Any]:
    return build_snapshot()


@app.get("/analytics/readiness")
def readiness() -> dict[str, Any]:
    snapshot_data = build_snapshot()
    return {"analytics": snapshot_data["analytics"], "skill_gap": snapshot_data["skill_gap"]}


@app.delete("/workspace/reset", status_code=204)
def reset_workspace() -> None:
    with connect() as conn:
        clear_workspace(conn)
        log_activity(conn, "Started a new workspace")


@app.post("/workspace/import")
def import_workspace(snapshot_data: dict[str, Any]) -> dict[str, Any]:
    profile = snapshot_data.get("profile") or {}
    with connect() as conn:
        clear_workspace(conn)
        conn.execute(
            """
            UPDATE profiles
            SET target_role = ?, major = ?, graduation = ?, weekly_hours = ?, updated_at = ?
            WHERE id = 1
            """,
            (
                pick(profile, "target_role", "targetRole"),
                pick(profile, "major"),
                pick(profile, "graduation"),
                int(pick(profile, "weekly_hours", "weeklyHours", default=0) or 0),
                now(),
            ),
        )
        conn.execute(
            "UPDATE resume_notes SET body = ?, updated_at = ? WHERE id = 1",
            (pick(snapshot_data, "resume"), now()),
        )
        for table in COLLECTION_FIELDS:
            import_collection(conn, table, snapshot_data.get(table) or [])
        log_activity(conn, "Imported workspace snapshot")
    return build_snapshot()


@app.put("/profile")
def update_profile(profile: Profile) -> dict[str, Any]:
    with connect() as conn:
        conn.execute(
            """
            UPDATE profiles
            SET target_role = ?, major = ?, graduation = ?, weekly_hours = ?, updated_at = ?
            WHERE id = 1
            """,
            (profile.target_role, profile.major, profile.graduation, profile.weekly_hours, now()),
        )
        log_activity(conn, "Updated career profile")
    return build_snapshot()["profile"]


@app.put("/resume")
def update_resume(notes: ResumeNotes) -> dict[str, str]:
    with connect() as conn:
        conn.execute("UPDATE resume_notes SET body = ?, updated_at = ? WHERE id = 1", (notes.body, now()))
        log_activity(conn, "Updated resume notes")
    return {"body": notes.body}


@app.get("/{collection}")
def list_items(collection: str) -> list[dict[str, Any]]:
    require_collection(collection)
    with connect() as conn:
        return [row_to_dict(row) for row in conn.execute(f"SELECT * FROM {collection} ORDER BY created_at DESC").fetchall()]


@app.post("/{collection}", status_code=201)
def create_item(collection: str, item: CollectionItem) -> dict[str, Any]:
    fields = require_collection(collection)
    payload = item.model_dump(exclude_unset=True)
    missing = [field for field in REQUIRED_FIELDS[collection] if payload.get(field) in (None, "")]
    if missing:
        raise HTTPException(status_code=422, detail=f"Missing required fields: {', '.join(missing)}")

    item_id = str(uuid.uuid4())
    columns = ("id", *fields, "created_at", "updated_at")
    values = [item_id, *[payload.get(field) for field in fields], now(), now()]
    placeholders = ", ".join("?" for _ in columns)
    with connect() as conn:
        conn.execute(f"INSERT INTO {collection} ({', '.join(columns)}) VALUES ({placeholders})", values)
        log_activity(conn, f"Added {collection[:-1] if collection.endswith('s') else collection}")
        return row_to_dict(conn.execute(f"SELECT * FROM {collection} WHERE id = ?", (item_id,)).fetchone())


@app.put("/{collection}/{item_id}")
def update_item(collection: str, item_id: str, item: CollectionItem) -> dict[str, Any]:
    fields = require_collection(collection)
    payload = item.model_dump(exclude_unset=True)
    editable = [field for field in fields if field in payload]
    if not editable:
        raise HTTPException(status_code=422, detail="No editable fields supplied")

    assignments = ", ".join(f"{field} = ?" for field in editable)
    values = [payload[field] for field in editable] + [now(), item_id]
    with connect() as conn:
        existing = conn.execute(f"SELECT id FROM {collection} WHERE id = ?", (item_id,)).fetchone()
        if not existing:
            raise HTTPException(status_code=404, detail="Item not found")
        conn.execute(f"UPDATE {collection} SET {assignments}, updated_at = ? WHERE id = ?", values)
        log_activity(conn, f"Updated {collection[:-1] if collection.endswith('s') else collection}")
        return row_to_dict(conn.execute(f"SELECT * FROM {collection} WHERE id = ?", (item_id,)).fetchone())


@app.delete("/{collection}/{item_id}", status_code=204)
def delete_item(collection: str, item_id: str) -> None:
    require_collection(collection)
    with connect() as conn:
        result = conn.execute(f"DELETE FROM {collection} WHERE id = ?", (item_id,))
        if result.rowcount == 0:
            raise HTTPException(status_code=404, detail="Item not found")
        log_activity(conn, f"Deleted {collection[:-1] if collection.endswith('s') else collection}")
