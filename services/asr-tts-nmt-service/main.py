from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import torch
import whisper
from transformers import MarianMTModel, MarianTokenizer
from TTS.api import TTS
import tempfile
import os
from pathlib import Path
import logging

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="ASR/TTS/NMT Service")

# CORS 配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 全局模型变量
whisper_model = None
nmt_model = None
nmt_tokenizer = None
tts_model = None

# 配置
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
WHISPER_MODEL_SIZE = os.getenv("WHISPER_MODEL_SIZE", "large-v3")
NMT_MODEL_NAME = "Helsinki-NLP/opus-mt-zh-en"

@app.on_event("startup")
async def load_models():
    """启动时加载所有模型"""
    global whisper_model, nmt_model, nmt_tokenizer, tts_model
    
    logger.info(f"Loading models on device: {DEVICE}")
    
    try:
        # 加载 Whisper ASR 模型
        logger.info(f"Loading Whisper model: {WHISPER_MODEL_SIZE}")
        whisper_model = whisper.load_model(WHISPER_MODEL_SIZE, device=DEVICE)
        logger.info("Whisper model loaded successfully")
        
        # 加载 NMT 模型
        logger.info(f"Loading NMT model: {NMT_MODEL_NAME}")
        nmt_tokenizer = MarianTokenizer.from_pretrained(NMT_MODEL_NAME)
        nmt_model = MarianMTModel.from_pretrained(NMT_MODEL_NAME).to(DEVICE)
        logger.info("NMT model loaded successfully")
        
        # 加载 TTS 模型
        logger.info("Loading TTS model")
        tts_model = TTS(model_name="tts_models/zh-CN/baker/tacotron2-DDC-GST").to(DEVICE)
        logger.info("TTS model loaded successfully")
        
        logger.info("All models loaded successfully!")
        
    except Exception as e:
        logger.error(f"Error loading models: {e}")
        raise

class TranscribeRequest(BaseModel):
    language: str = "zh"

class TranslateRequest(BaseModel):
    text: str
    source_lang: str = "zh"
    target_lang: str = "en"

class TTSRequest(BaseModel):
    text: str
    language: str = "zh"

@app.get("/healthz")
async def health_check():
    """健康检查"""
    return {
        "status": "ok",
        "service": "asr-tts-nmt-service",
        "device": DEVICE,
        "models_loaded": {
            "whisper": whisper_model is not None,
            "nmt": nmt_model is not None,
            "tts": tts_model is not None,
        }
    }

@app.post("/transcribe")
async def transcribe_audio(
    file: UploadFile = File(...),
    language: str = "zh"
):
    """语音识别 (ASR)"""
    if whisper_model is None:
        raise HTTPException(status_code=503, detail="Whisper model not loaded")
    
    try:
        # 保存上传的音频文件
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_file:
            content = await file.read()
            temp_file.write(content)
            temp_path = temp_file.name
        
        # Whisper 推理
        result = whisper_model.transcribe(
            temp_path,
            language=language,
            task="transcribe"
        )
        
        # 删除临时文件
        os.unlink(temp_path)
        
        return {
            "text": result["text"],
            "language": result["language"],
            "segments": result["segments"]
        }
        
    except Exception as e:
        logger.error(f"Transcription error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/translate")
async def translate_text(request: TranslateRequest):
    """文本翻译 (NMT)"""
    if nmt_model is None or nmt_tokenizer is None:
        raise HTTPException(status_code=503, detail="NMT model not loaded")
    
    try:
        # 分词
        inputs = nmt_tokenizer(request.text, return_tensors="pt", padding=True).to(DEVICE)
        
        # 翻译
        with torch.no_grad():
            translated = nmt_model.generate(**inputs)
        
        # 解码
        translated_text = nmt_tokenizer.decode(translated[0], skip_special_tokens=True)
        
        return {
            "original_text": request.text,
            "translated_text": translated_text,
            "source_lang": request.source_lang,
            "target_lang": request.target_lang
        }
        
    except Exception as e:
        logger.error(f"Translation error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/synthesize")
async def synthesize_speech(request: TTSRequest):
    """语音合成 (TTS)"""
    if tts_model is None:
        raise HTTPException(status_code=503, detail="TTS model not loaded")
    
    try:
        # 生成音频
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_file:
            tts_model.tts_to_file(
                text=request.text,
                file_path=temp_file.name
            )
            temp_path = temp_file.name
        
        # 读取音频文件
        with open(temp_path, "rb") as f:
            audio_data = f.read()
        
        # 删除临时文件
        os.unlink(temp_path)
        
        from fastapi.responses import Response
        return Response(
            content=audio_data,
            media_type="audio/wav",
            headers={"Content-Disposition": "attachment; filename=speech.wav"}
        )
        
    except Exception as e:
        logger.error(f"TTS error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
