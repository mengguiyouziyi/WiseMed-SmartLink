import sys
import os
from fastapi.testclient import TestClient

# Add parent directory to path
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, parent_dir)

from main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/healthz")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["service"] == "auth-service"

def test_read_users_me_unauthorized():
    # Test without token
    response = client.get("/users/me")
    assert response.status_code == 401

def test_read_users_me_authorized():
    # Test with mock token (since we haven't implemented real verification yet)
    # Note: In a real scenario, we would need to mock the verify_token dependency
    # For now, the code just checks if token is present
    response = client.get("/users/me", headers={"Authorization": "Bearer mock_token"})
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "test_user"
