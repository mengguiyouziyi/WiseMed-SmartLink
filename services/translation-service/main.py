from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel
from typing import Optional, List
import logging
import os

from asr import ASREngine
from translator import MedicalTranslator

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="WiseMed Translation Service", version="0.1.0")

# Configuration
MODEL_SIZE = os.getenv("MODEL_SIZE", "base")
DEVICE = os.getenv("DEVICE", "cpu")

# Initialize ASR and Translator
asr_engine = ASREngine(model_size=MODEL_SIZE, device=DEVICE)
translator = MedicalTranslator()


class TranscriptionResponse(BaseModel):
    text: str
    language: str
    confidence: Optional[float] = None


class TranslationRequest(BaseModel):
    text: str
    source_lang: str = "zh"
    target_lang: str = "en"


class TranslationResponse(BaseModel):
    original_text: str
    translated_text: str
    matched_terms: List[dict] = []


@app.get("/healthz")
async def health_check():
    return {
        "status": "ok",
        "service": "translation-service",
        "model_size": MODEL_SIZE,
        "device": DEVICE
    }


@app.post("/asr/transcribe", response_model=TranscriptionResponse)
async def transcribe_audio(file: UploadFile = File(...)):
    """
    Transcribe audio file to text using Whisper.
    Accepts WAV, MP3, M4A formats.
    """
    if not file.filename.endswith(('.wav', '.mp3', '.m4a', '.ogg')):
        raise HTTPException(
            status_code=400,
            detail="Invalid file format. Supported: WAV, MP3, M4A, OGG"
        )

    logger.info(f"Received audio file for transcription: {file.filename}")

    try:
        # Read audio file
        audio_data = await file.read()

        # Load hotwords
        hotwords = []
        hotwords_path = "/app/config/hotwords.txt"
        if os.path.exists(hotwords_path):
            with open(hotwords_path, 'r', encoding='utf-8') as f:
                hotwords = [
                    line.strip()
                    for line in f
                    if line.strip() and not line.startswith('#')
                ]

        # Transcribe
        result = await asr_engine.transcribe(
            audio_data,
            language="zh",
            hotwords=hotwords
        )

        return TranscriptionResponse(**result)

    except Exception as e:
        logger.error(f"Transcription failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/translate", response_model=TranslationResponse)
async def translate_text(request: TranslationRequest):
    """
    Translate text using medical terminology dictionary.
    """
    logger.info(
        f"Translation request: {request.text[:50]}... "
        f"({request.source_lang} -> {request.target_lang})"
    )

    try:
        result = translator.translate(
            text=request.text,
            source_lang=request.source_lang,
            target_lang=request.target_lang
        )

        return TranslationResponse(
            original_text=request.text,
            translated_text=result["translated_text"],
            matched_terms=result["matched_terms"]
        )

    except Exception as e:
        logger.error(f"Translation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/terminology")
async def get_terminology(query: Optional[str] = None, limit: int = 100):
    """
    Query medical terminology database.
    """
    try:
        terms = translator.search_terms(query=query, limit=limit)
        return {
            "total": len(terms),
            "terms": terms
        }
    except Exception as e:
        logger.error(f"Terminology query failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))
