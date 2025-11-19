import sys
import os
from fastapi.testclient import TestClient
from unittest.mock import MagicMock, patch

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
    assert data["service"] == "ai-infer-service"
    assert "model_loaded" in data

def test_infer_endpoint():
    # Create a dummy DICOM file content
    dummy_dicom = b"fake dicom content"
    
    # Mock the inference logic if needed, but since the current implementation
    # is mostly placeholder/mock in main.py (even with MONAI loaded, it doesn't do real inference yet),
    # we can test the endpoint directly.
    # However, if we want to be safe against future changes that use the real model,
    # we should mock the model inference part.
    
    # For now, let's just test that the endpoint accepts the file and returns the expected structure.
    response = client.post(
        "/infer/lung-nodule",
        files={"file": ("test.dcm", dummy_dicom, "application/dicom")}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["filename"] == "test.dcm"
    assert "prediction" in data
    assert "confidence" in data
