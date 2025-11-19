import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi.testclient import TestClient  # noqa: E402
from main import app  # noqa: E402

client = TestClient(app)


def test_health_check():
    response = client.get("/healthz")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "service": "pacs-gw-service"}


def test_hello():
    response = client.get("/hello")
    assert response.status_code == 200
    assert response.json() == {"message": "Hello from PACS Gateway"}
