from main import connect, init_db, log_activity, now


def seed() -> None:
    init_db()
    with connect() as conn:
        conn.execute(
            """
            UPDATE profiles
            SET target_role = ?, major = ?, graduation = ?, weekly_hours = ?, updated_at = ?
            WHERE id = 1
            """,
            ("Data Analyst Intern", "Information Systems", "May 2029", 8, now()),
        )
        rows = [
            ("skills", ("id", "name", "category", "level", "evidence"), ("skill-sql", "SQL", "Data", 70, "Coursework and CareerLens AI analysis")),
            ("skills", ("id", "name", "category", "level", "evidence"), ("skill-ai", "Generative AI", "AI", 78, "Nexus AI, CareerLens AI, LearnWise AI")),
            ("projects", ("id", "name", "stack", "stage", "link", "impact"), ("project-nexus", "Nexus AI", "HTML, CSS, JavaScript, FastAPI, SQLite", "Improving", "https://github.com/jasonbinong/Nexus-AI", "Career operating system with readiness analytics")),
            ("certifications", ("id", "name", "provider", "progress", "target", "link"), ("cert-oci", "Oracle Cloud Foundations", "Oracle", 100, "2026-06-01", "")),
            ("applications", ("id", "company", "role", "status", "deadline", "link", "notes"), ("app-sample", "Sample Company", "Data Analyst Intern", "Wishlist", "2026-08-01", "", "Tailor resume and add SQL project evidence")),
            ("goals", ("id", "goal", "category", "progress", "due", "next_step"), ("goal-backend", "Build backend/database project", "Technical growth", 45, "2026-07-15", "Connect API to frontend")),
        ]
        for table, columns, values in rows:
            placeholders = ", ".join("?" for _ in columns)
            conn.execute(
                f"INSERT OR REPLACE INTO {table} ({', '.join(columns)}) VALUES ({placeholders})",
                values,
            )
        log_activity(conn, "Loaded sample Nexus AI workspace")


if __name__ == "__main__":
    seed()
    print("Seeded backend/nexus.db")
