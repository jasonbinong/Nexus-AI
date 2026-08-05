from __future__ import annotations

import os
import sqlite3
import json
import urllib.error
import urllib.request
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from fastapi import FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


BASE_DIR = Path(__file__).resolve().parent
DB_PATH = Path(os.getenv("NEXUS_DB_PATH", BASE_DIR / "nexus.db"))
SCHEMA_PATH = BASE_DIR / "schema.sql"
ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.getenv(
        "NEXUS_ALLOWED_ORIGINS",
        "http://127.0.0.1:8070,http://localhost:8070,https://jasonbinong.github.io",
    ).split(",")
    if origin.strip()
]

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
    display_name: str = ""
    email: str = ""
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


class AiCoachRequest(BaseModel):
    tool: str = "resume_review"
    extra_context: str = ""
    application: dict[str, Any] | None = None
    snapshot: dict[str, Any] = Field(default_factory=dict)


app = FastAPI(
    title="Nexus AI Backend",
    description="SQLite-backed API for the Nexus AI student career operating system.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)

AI_TOOL_LABELS = {
    "resume_review": "Resume Review",
    "cover_letter": "Cover Letter Draft",
    "interview_prep": "Interview Practice",
    "role_fit": "Role Fit Explanation",
    "roadmap": "Role Roadmap",
    "weekly_plan": "Weekly Career Plan",
    "networking_message": "Networking Message",
    "follow_up": "Application Follow-up",
    "opportunity_strategy": "Opportunity Strategy",
}


def now() -> str:
    return datetime.now(timezone.utc).isoformat()


def connect() -> sqlite3.Connection:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    ensure_schema(conn)
    return conn


def ensure_schema(conn: sqlite3.Connection) -> None:
    has_profile_table = conn.execute(
        "SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'profiles'"
    ).fetchone()
    if not has_profile_table:
        conn.executescript(SCHEMA_PATH.read_text(encoding="utf-8"))
    else:
        migrate_profile_columns(conn)
        migrate_application_statuses(conn)


def migrate_profile_columns(conn: sqlite3.Connection) -> None:
    columns = {
        row["name"]
        for row in conn.execute("PRAGMA table_info(profiles)").fetchall()
    }
    migrations = {
        "display_name": "ALTER TABLE profiles ADD COLUMN display_name TEXT NOT NULL DEFAULT ''",
        "email": "ALTER TABLE profiles ADD COLUMN email TEXT NOT NULL DEFAULT ''",
    }
    for column, statement in migrations.items():
        if column not in columns:
            conn.execute(statement)


def migrate_application_statuses(conn: sqlite3.Connection) -> None:
    table = conn.execute(
        "SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'applications'"
    ).fetchone()
    if not table or "Wishlist" not in table["sql"] or "Interviewing" in table["sql"]:
        return

    conn.execute("ALTER TABLE applications RENAME TO applications_legacy")
    conn.executescript(
        """
        CREATE TABLE applications (
          id TEXT PRIMARY KEY,
          company TEXT NOT NULL,
          role TEXT NOT NULL,
          status TEXT NOT NULL CHECK (status IN ('Saved', 'Applied', 'Interviewing', 'Offer', 'Rejected', 'Follow-up needed', 'Deadline approaching')),
          deadline TEXT,
          link TEXT,
          notes TEXT,
          created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
        """
    )
    conn.execute(
        """
        INSERT INTO applications (id, company, role, status, deadline, link, notes, created_at, updated_at)
        SELECT id, company, role,
          CASE
            WHEN status = 'Wishlist' THEN 'Saved'
            WHEN status = 'Interview' THEN 'Interviewing'
            ELSE status
          END,
          deadline, link, notes, created_at, updated_at
        FROM applications_legacy
        """
    )
    conn.execute("DROP TABLE applications_legacy")


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


def build_career_report(snapshot: dict[str, Any]) -> dict[str, Any]:
    profile = snapshot["profile"]
    analytics = snapshot["analytics"]
    skill_gap = snapshot["skill_gap"]
    applications = snapshot["applications"]
    projects = snapshot["projects"]
    networking = snapshot["networking"]
    goals = snapshot["goals"]

    alerts = []
    if not profile.get("target_role"):
        alerts.append("Save a target role so Nexus can judge your workspace against one career direction.")
    if analytics["active_applications"] < 3:
        alerts.append("Add at least three active applications to create a useful pipeline.")
    if len([project for project in projects if project.get("link")]) < 2:
        alerts.append("Attach GitHub, live site, or project links to at least two projects.")
    if skill_gap["gaps"]:
        alerts.append(f"Close the first skill gap: {skill_gap['gaps'][0]}.")
    if not networking:
        alerts.append("Add one networking contact and a follow-up date.")

    weekly_actions = [
        {
            "action": "Update application pipeline",
            "why": "A current pipeline improves readiness scoring and deadline alerts.",
            "measure": f"{analytics['active_applications']} active applications tracked",
        },
        {
            "action": "Add portfolio proof",
            "why": "Recruiters need evidence that your listed skills show up in shipped work.",
            "measure": f"{len(projects)} projects tracked",
        },
        {
            "action": "Close one skill gap",
            "why": f"{profile.get('target_role') or 'Your target role'} still has missing skill evidence.",
            "measure": ", ".join(skill_gap["gaps"][:3]) or "No major gaps detected",
        },
    ]
    if goals:
        weekly_actions.append(
            {
                "action": "Advance the highest-priority goal",
                "why": "Goals turn the dashboard from tracking into execution.",
                "measure": goals[0].get("next_step") or goals[0].get("goal") or "Next step pending",
            }
        )

    return {
        "profile": profile,
        "readiness": analytics,
        "skill_gap": skill_gap,
        "alerts": alerts[:5],
        "weekly_actions": weekly_actions[:5],
        "summary": (
            f"{profile.get('display_name') or 'This student'} is at {analytics['career_score']}/100 career readiness "
            f"for {profile.get('target_role') or 'a target role'}. Skill coverage is {skill_gap['coverage']}%."
        ),
    }


def fallback_ai_sections(request: AiCoachRequest) -> dict[str, Any]:
    snapshot = request.snapshot or {}
    profile = snapshot.get("profile") or {}
    role = profile.get("targetRole") or profile.get("target_role") or "the student's target role"
    application = request.application or {}
    app_label = (
        f"{application.get('role', 'the saved role')} at {application.get('company', 'the selected company')}"
        if application
        else role
    )
    projects = snapshot.get("projects") or []
    skills = snapshot.get("skills") or []
    skill_fit = snapshot.get("skillFit") or {}
    gaps = skill_fit.get("gaps") or []
    matched = skill_fit.get("matched") or []
    strongest_project = next((item for item in projects if item.get("link") and item.get("impact")), projects[0] if projects else {})
    gap_name = (gaps[0] or {}).get("name") if gaps and isinstance(gaps[0], dict) else "role-specific proof"
    project_name = strongest_project.get("name") or "Nexus AI"
    project_impact = strongest_project.get("impact") or "Add a measurable impact statement to make this proof stronger."
    resume_text = str(snapshot.get("resume") or "").lower()
    has_resume = bool(resume_text.strip())
    resume_strengths = []
    if "github" in resume_text:
        resume_strengths.append("GitHub/project proof")
    if "sql" in resume_text or "python" in resume_text or "javascript" in resume_text:
        resume_strengths.append("technical keywords")
    if any(token in resume_text for token in ["deployed", "built", "designed", "analyzed"]):
        resume_strengths.append("action-oriented bullets")
    if any(char.isdigit() for char in resume_text):
        resume_strengths.append("some measurable detail")

    options = {
        "resume_review": [
            ("Fair review status", "OpenAI model review is not enabled on this backend yet, so this is the calibrated fallback review." if has_resume else "Upload or paste resume text before running review."),
            ("What already works", f"Detected {', '.join(resume_strengths) if resume_strengths else 'some project and profile context from the workspace'}. Keep the strongest proof visible near the top."),
            ("Most important improvement", f"Target the resume toward {role}. Lead with deployed AI/data/software projects and make every major bullet follow action + tool + result."),
            ("Best evidence to feature", f"Feature {project_name}: {project_impact}"),
            ("Next edit", f"Add stronger proof for {gap_name}, but keep it truthful and tied to a project, course, certification, or work example."),
        ],
        "cover_letter": [
            ("Opening", f"Connect your interest in {app_label} to building AI-assisted career and learning systems for students."),
            ("Proof paragraph", f"Use {project_name} as the central example, then explain the problem, stack, and outcome."),
            ("Close", "End with the specific value you can bring: clean software, AI evaluation, data workflows, or student-centered product thinking."),
        ],
        "interview_prep": [
            ("Project story", f"Practice explaining {project_name}: problem, user, architecture, tradeoffs, result, and next improvement."),
            ("Technical practice", f"Prepare for questions about {gap_name}, API design, data validation, testing, and deployment."),
            ("Behavioral story", "Use a STAR answer about accepting feedback and improving Nexus into a stronger product."),
        ],
        "role_fit": [
            ("Match signals", f"Strongest current signals: {', '.join(str(item.get('name', item)) for item in matched[:5]) or 'deployed projects, AI/data experience, and career-product focus'}."),
            ("Risk signals", f"Weakest current signals: {', '.join(str(item.get('name', item)) for item in gaps[:5]) or 'make outcomes more measurable and role-specific'}."),
            ("Next move", f"Build or document proof for {gap_name}, then save one matched opportunity into the pipeline."),
        ],
        "roadmap": [
            ("Skills to learn", f"Prioritize {gap_name}, then add proof for the skills most visible in {role}."),
            ("Project proof", f"Use {project_name} as the anchor project and document the problem, stack, result, and next improvement."),
            ("Resume keywords", f"Include truthful keywords tied to proof: {role}, AI, data, software, GitHub, deployed project, and {gap_name}."),
        ],
        "weekly_plan": [
            ("Monday", "Save or apply to two matched roles and add deadlines for each."),
            ("Wednesday", f"Improve {project_name} proof with a clearer README, screenshot, or result statement."),
            ("Friday", "Send two networking messages and practice one project walkthrough."),
        ],
        "networking_message": [
            ("Message draft", f"Hi, I’m Jason, an Information Systems student at UMBC interested in {role}. I’ve been building Nexus AI and other student-focused AI/data tools, and I’d appreciate any advice on what project proof matters most for {app_label}."),
            ("Why it works", "It is specific, short, and asks for advice instead of immediately asking for a job."),
        ],
    }
    options["follow_up"] = [
        ("Subject", f"Following up on {app_label}"),
        ("Draft", f"Hi, I wanted to follow up on my application for {app_label}. Since applying, I have continued strengthening project proof through Nexus AI and related AI/data tools, and I would be glad to share more context on how my experience matches the role."),
    ]
    options["opportunity_strategy"] = [
        ("Prioritize", "Move the strongest saved opportunities into applications before adding more roles."),
        ("Balance", "Track fellowships and programs separately from internships because they often reward project story and mission fit."),
    ]
    sections = [{"title": title, "body": body} for title, body in options.get(request.tool, options["resume_review"])]
    if request.extra_context:
        sections.append({"title": "Extra context considered", "body": request.extra_context[:500]})
    return {
        "provider": "Local fallback",
        "sections": sections,
        "note": "Set OPENAI_API_KEY on the backend to enable model-generated coaching.",
    }


def call_openai_ai_coach(request: AiCoachRequest) -> dict[str, Any]:
    api_key = os.getenv("OPENAI_API_KEY", "").strip()
    if not api_key:
        return fallback_ai_sections(request)

    model = os.getenv("NEXUS_AI_MODEL", "gpt-5").strip() or "gpt-5"
    tool_label = AI_TOOL_LABELS.get(request.tool, request.tool.replace("_", " ").title())
    resume_instruction = ""
    if request.tool == "resume_review":
        resume_instruction = (
            "For Resume Review, act like a fair senior university career coach and technical recruiter. "
            "Review the actual resume text in the snapshot, not just project tracker data. "
            "Be honest but calibrated: do not invent a harsh numerical score from missing signals, and do not flatter. "
            "If you give a score, make it a recruiter-style estimate for internship readiness, not an ATS pass/fail grade. "
            "Call out the 3-5 highest-impact fixes, quote or paraphrase specific weak areas when possible, and explain what is already strong. "
        )
    user_payload = {
        "tool": tool_label,
        "extra_context": request.extra_context[:3000],
        "selected_application": request.application,
        "workspace_snapshot": request.snapshot,
    }
    prompt = (
        "You are Nexus AI, a practical career coach for college students. "
        "Use the student's workspace data to produce specific, honest, role-aware guidance. "
        "Do not promise jobs or invent credentials. Avoid sending overly personal content. "
        f"{resume_instruction}"
        "Return only JSON with this shape: "
        '{"provider":"OpenAI","sections":[{"title":"short heading","body":"specific guidance"}],"note":""}. '
        "Create 3 to 6 sections. Keep each body under 90 words.\n\n"
        f"Request data:\n{json.dumps(user_payload, ensure_ascii=False)}"
    )
    body = json.dumps({"model": model, "input": prompt}).encode("utf-8")
    req = urllib.request.Request(
        "https://api.openai.com/v1/responses",
        data=body,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as response:
            data = json.loads(response.read().decode("utf-8"))
    except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError, json.JSONDecodeError) as exc:
        fallback = fallback_ai_sections(request)
        fallback["provider"] = "Local fallback after AI API issue"
        fallback["note"] = f"AI API unavailable: {exc}"
        return fallback

    output_text = data.get("output_text", "")
    if not output_text:
        for item in data.get("output", []):
            for content in item.get("content", []):
                if content.get("type") in {"output_text", "text"} and content.get("text"):
                    output_text += content["text"]
    try:
        parsed = json.loads(output_text)
        if isinstance(parsed.get("sections"), list):
            parsed["provider"] = parsed.get("provider") or "OpenAI"
            return parsed
    except json.JSONDecodeError:
        pass
    return {
        "provider": "OpenAI",
        "sections": [{"title": tool_label, "body": output_text[:1200] or "The AI response did not include text."}],
        "note": "",
    }


def build_snapshot() -> dict[str, Any]:
    with connect() as conn:
        profile = row_to_dict(conn.execute("SELECT display_name, email, target_role, major, graduation, weekly_hours FROM profiles WHERE id = 1").fetchone())
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
        SET display_name = '', email = '', target_role = '', major = '', graduation = '', weekly_hours = 0, updated_at = ?
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
def health() -> dict[str, Any]:
    return {
        "status": "ok",
        "service": "nexus-ai-backend",
        "version": app.version,
        "database": str(DB_PATH),
        "collections": sorted(COLLECTION_FIELDS),
        "allowed_origins": ALLOWED_ORIGINS,
    }


@app.get("/snapshot")
def snapshot() -> dict[str, Any]:
    return build_snapshot()


@app.get("/analytics/readiness")
def readiness() -> dict[str, Any]:
    snapshot_data = build_snapshot()
    return {"analytics": snapshot_data["analytics"], "skill_gap": snapshot_data["skill_gap"]}


@app.get("/workspace/report")
def workspace_report() -> dict[str, Any]:
    return build_career_report(build_snapshot())


@app.post("/ai/coach")
def ai_coach(request: AiCoachRequest) -> dict[str, Any]:
    return call_openai_ai_coach(request)


@app.delete("/workspace/reset", status_code=204)
def reset_workspace() -> Response:
    with connect() as conn:
        clear_workspace(conn)
        log_activity(conn, "Started a new workspace")
    return Response(status_code=204)


@app.post("/workspace/import")
def import_workspace(snapshot_data: dict[str, Any]) -> dict[str, Any]:
    profile = snapshot_data.get("profile") or {}
    with connect() as conn:
        clear_workspace(conn)
        conn.execute(
            """
            UPDATE profiles
            SET display_name = ?, email = ?, target_role = ?, major = ?, graduation = ?, weekly_hours = ?, updated_at = ?
            WHERE id = 1
            """,
            (
                pick(profile, "display_name", "displayName"),
                pick(profile, "email"),
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
            SET display_name = ?, email = ?, target_role = ?, major = ?, graduation = ?, weekly_hours = ?, updated_at = ?
            WHERE id = 1
            """,
            (profile.display_name, profile.email, profile.target_role, profile.major, profile.graduation, profile.weekly_hours, now()),
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
def delete_item(collection: str, item_id: str) -> Response:
    require_collection(collection)
    with connect() as conn:
        result = conn.execute(f"DELETE FROM {collection} WHERE id = ?", (item_id,))
        if result.rowcount == 0:
            raise HTTPException(status_code=404, detail="Item not found")
        log_activity(conn, f"Deleted {collection[:-1] if collection.endswith('s') else collection}")
    return Response(status_code=204)
