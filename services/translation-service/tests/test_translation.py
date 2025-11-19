import sys
import os

# Add parent directory to path
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, parent_dir)

from fastapi.testclient import TestClient  # noqa: E402
from main import app  # noqa: E402

from unittest.mock import MagicMock, patch
from main import app

# Mock ASREngine before creating TestClient
# This prevents loading the real Whisper model during tests
with patch('main.asr_engine') as mock_engine:
    mock_engine.transcribe.return_value = {
        "text": "测试语音转录",
        "language": "zh",
        "confidence": 0.95
    }
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


def test_asr_transcribe_endpoint():
    # Create a dummy audio file content
    dummy_audio = b"fake audio content"
    
def test_asr_transcribe_endpoint():
    # Create a dummy audio file content
    dummy_audio = b"fake audio content"
    
    # Define async mock side effect
    async def mock_transcribe_coro(*args, **kwargs):
        return {
            "text": "测试语音转录",
            "language": "zh",
            "confidence": 0.95
        }

    # We need to patch the asr_engine instance on the app
    with patch('main.asr_engine.transcribe') as mock_transcribe:
        mock_transcribe.side_effect = mock_transcribe_coro
        
        response = client.post(
            "/asr/transcribe",
            files={"file": ("test.wav", dummy_audio, "audio/wav")}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["text"] == "测试语音转录"
        assert data["language"] == "zh"
        assert data["confidence"] == 0.95
