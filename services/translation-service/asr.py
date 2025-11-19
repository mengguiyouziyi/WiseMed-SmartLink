"""
ASR module using OpenAI Whisper for speech-to-text transcription.
"""
try:
    import whisper
    WHISPER_AVAILABLE = True
except ImportError:
    WHISPER_AVAILABLE = False
    whisper = None

import tempfile
import os
from typing import Optional
import logging

logger = logging.getLogger(__name__)


class ASREngine:
    def __init__(self, model_size: str = "base", device: str = "cpu"):
        """
        Initialize Whisper ASR engine.

        Args:
            model_size: Whisper model size (tiny, base, small, medium, large)
            device: Device to run on (cpu or cuda)
        """
        self.model_size = model_size
        self.device = device
        self.model = None
        logger.info(
            f"Initializing Whisper ASR with model={model_size}, "
            f"device={device}"
        )

    def load_model(self):
        """Load Whisper model (lazy loading)."""
        if not WHISPER_AVAILABLE:
            logger.warning("Whisper not available, using mock transcription")
            return

        if self.model is None:
            logger.info(f"Loading Whisper {self.model_size} model...")
            self.model = whisper.load_model(
                self.model_size, device=self.device
            )
            logger.info("Whisper model loaded successfully")

    async def transcribe(
        self,
        audio_data: bytes,
        language: Optional[str] = None,
        hotwords: Optional[list] = None
    ) -> dict:
        """
        Transcribe audio to text.

        Args:
            audio_data: Audio file bytes
            language: Language code (e.g., 'zh', 'en')
            hotwords: List of hotwords to boost recognition

        Returns:
            dict with 'text', 'language', 'confidence'
        """
        self.load_model()

        # Mock transcription if Whisper not available
        if not WHISPER_AVAILABLE or self.model is None:
            logger.warning("Using mock transcription (Whisper not available)")
            return {
                "text": "这是模拟转录结果 (Whisper未安装)",
                "language": language or "zh",
                "confidence": 0.0
            }

        # Save audio to temporary file
        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=".wav"
        ) as tmp_file:
            tmp_file.write(audio_data)
            tmp_path = tmp_file.name

        try:
            # Transcribe
            logger.info(f"Transcribing audio file: {tmp_path}")
            result = self.model.transcribe(
                tmp_path,
                language=language,
                initial_prompt=" ".join(hotwords) if hotwords else None
            )

            # Calculate average confidence from segments
            confidence = None
            if "segments" in result and result["segments"]:
                confidences = [
                    seg.get("no_speech_prob", 0.0)
                    for seg in result["segments"]
                ]
                confidence = 1.0 - (sum(confidences) / len(confidences))

            return {
                "text": result["text"].strip(),
                "language": result.get("language", "unknown"),
                "confidence": confidence
            }

        finally:
            # Clean up temporary file
            if os.path.exists(tmp_path):
                os.unlink(tmp_path)
