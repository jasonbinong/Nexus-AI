import os
import tempfile

os.environ["NEXUS_DB_PATH"] = os.path.join(tempfile.gettempdir(), "nexus-api-contract-test.db")

try:
    os.remove(os.environ["NEXUS_DB_PATH"])
except FileNotFoundError:
    pass

from fastapi.testclient import TestClient

from main import app


client = TestClient(app)


def test_full_workspace_flow():
    assert client.get("/health").status_code == 200

    profile_response = client.put(
        "/profile",
        json={
            "target_role": "Data Analyst Intern",
            "major": "Information Systems",
            "graduation": "May 2029",
            "weekly_hours": 8,
        },
    )
    assert profile_response.status_code == 200
    assert profile_response.json()["target_role"] == "Data Analyst Intern"

    application_response = client.post(
        "/applications",
        json={
            "company": "DoorDash",
            "role": "AI Research Fellow",
            "status": "Wishlist",
            "deadline": "2026-07-15",
            "link": "",
            "notes": "Upload research proposal",
        },
    )
    assert application_response.status_code == 201
    application_id = application_response.json()["id"]

    update_response = client.put(
        f"/applications/{application_id}",
        json={"status": "Applied", "notes": "Submitted application"},
    )
    assert update_response.status_code == 200
    assert update_response.json()["status"] == "Applied"

    skill_response = client.post(
        "/skills",
        json={"name": "SQL", "category": "Data", "level": 72, "evidence": "CareerLens analysis pipeline"},
    )
    assert skill_response.status_code == 201

    snapshot = client.get("/snapshot").json()
    assert snapshot["profile"]["target_role"] == "Data Analyst Intern"
    assert len(snapshot["applications"]) == 1
    assert snapshot["analytics"]["career_score"] > 0

    readiness = client.get("/analytics/readiness")
    assert readiness.status_code == 200
    assert "skill_gap" in readiness.json()

    reset_response = client.delete("/workspace/reset")
    assert reset_response.status_code == 204
    assert client.get("/snapshot").json()["applications"] == []
