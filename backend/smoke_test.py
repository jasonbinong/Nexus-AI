import os
import sqlite3
import tempfile
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent
SCHEMA_PATH = BASE_DIR / "schema.sql"
TEST_DB = Path(tempfile.gettempdir()) / "nexus-ai-smoke-test.db"


def main() -> None:
    if TEST_DB.exists():
        TEST_DB.unlink()

    conn = sqlite3.connect(TEST_DB)
    conn.row_factory = sqlite3.Row
    conn.executescript(SCHEMA_PATH.read_text(encoding="utf-8"))
    conn.execute(
        """
        UPDATE profiles
        SET target_role = ?, major = ?, graduation = ?, weekly_hours = ?
        WHERE id = 1
        """,
        ("Data Analyst Intern", "Information Systems", "May 2029", 8),
    )
    conn.execute(
        """
        INSERT INTO applications (id, company, role, status, deadline, notes)
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        ("app-1", "DoorDash", "AI Research Fellow", "Wishlist", "2026-07-15", "Upload proposal"),
    )
    conn.execute(
        """
        INSERT INTO skills (id, name, category, level, evidence)
        VALUES (?, ?, ?, ?, ?)
        """,
        ("skill-1", "SQL", "Data", 70, "Coursework and project evidence"),
    )
    conn.commit()

    profile = conn.execute("SELECT target_role, weekly_hours FROM profiles WHERE id = 1").fetchone()
    app_count = conn.execute("SELECT COUNT(*) AS total FROM applications").fetchone()["total"]
    skill_count = conn.execute("SELECT COUNT(*) AS total FROM skills").fetchone()["total"]
    conn.close()

    assert profile["target_role"] == "Data Analyst Intern"
    assert profile["weekly_hours"] == 8
    assert app_count == 1
    assert skill_count == 1
    print(f"SQLite smoke test passed: {os.fspath(TEST_DB)}")


if __name__ == "__main__":
    main()
