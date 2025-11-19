import sys
import os

# Add parent directory to path
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, parent_dir)

from fastapi.testclient import TestClient  # noqa: E402
from main import app  # noqa: E402

client = TestClient(app)


def test_health_check():
    response = client.get("/healthz")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["service"] == "translation-service"


def test_translate_endpoint():
    response = client.post(
        "/translate",
        json={
            "text": "患者有肺结节",
            "source_lang": "zh",
            "target_lang": "en"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "original_text" in data
    assert "translated_text" in data
    assert "matched_terms" in data
