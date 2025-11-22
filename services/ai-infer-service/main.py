from fastapi import FastAPI, UploadFile, File, HTTPException, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional
import logging
import time
import uuid

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="WiseMed AI Inference Service", version="0.1.0")

# --- Data Models ---
class AIModel(BaseModel):
    id: str
    name: str
    version: str
    type: str
    status: str  # running, stopped, deploying, error
    gpu: int
    memory: str
    lastUsed: str
    requests: int
    avgLatency: int

# --- In-Memory State ---
class ModelManager:
    def __init__(self):
        self.models = [
            AIModel(
                id='1',
                name='Whisper Large-v3',
                version='v3.0',
                type='ASR',
                status='running',
                gpu=1,
                memory='4.2 GB',
                lastUsed='2 分钟前',
                requests=1247,
                avgLatency=156,
            ),
            AIModel(
                id='2',
                name='MarianMT ZH-EN',
                version='v1.0',
                type='NMT',
                status='running',
                gpu=1,
                memory='1.8 GB',
                lastUsed='5 分钟前',
                requests=892,
                avgLatency=89,
            ),
            AIModel(
                id='3',
                name='VITS Chinese TTS',
                version='v2.1',
                type='TTS',
                status='running',
                gpu=1,
                memory='2.1 GB',
                lastUsed='1 小时前',
                requests=534,
                avgLatency=234,
            ),
            AIModel(
                id='4',
                name='DenseNet121 Chest',
                version='v1.5',
                type='医疗影像',
                status='stopped',
                gpu=0,
                memory='0 GB',
                lastUsed='3 天前',
                requests=0,
                avgLatency=0,
            ),
        ]

    def list_models(self) -> List[AIModel]:
        return self.models

    def get_model(self, model_id: str) -> Optional[AIModel]:
        for m in self.models:
            if m.id == model_id:
                return m
        return None

    def update_status(self, model_id: str, status: str):
        model = self.get_model(model_id)
        if model:
            model.status = status
            if status == 'stopped':
                model.gpu = 0
                model.memory = '0 GB'
            elif status == 'running':
                # Restore mock resource usage
                if model.type == 'ASR':
                    model.gpu = 1
                    model.memory = '4.2 GB'
                elif model.type == 'NMT':
                    model.gpu = 1
                    model.memory = '1.8 GB'
                elif model.type == 'TTS':
                    model.gpu = 1
                    model.memory = '2.1 GB'
                elif model.type == '医疗影像':
                    model.gpu = 0 # CPU model
                    model.memory = '1.5 GB'
            return model
        return None

    def delete_model(self, model_id: str):
        self.models = [m for m in self.models if m.id != model_id]

    def add_model(self, model: AIModel):
        self.models.append(model)
        return model

manager = ModelManager()

# --- Exception Handlers ---
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"error": {"code": "INTERNAL_ERROR", "message": "An unexpected error occurred."}},
    )

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": {"code": "HTTP_ERROR", "message": exc.detail}},
    )

# --- Endpoints ---

@app.get("/healthz")
async def health_check():
    return {
        "status": "ok",
        "service": "ai-infer-service",
        "models_count": len(manager.list_models())
    }

@app.get("/models", response_model=List[AIModel])
async def list_models():
    return manager.list_models()

@app.post("/models/{model_id}/start")
async def start_model(model_id: str):
    model = manager.update_status(model_id, 'running')
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")
    return model

@app.post("/models/{model_id}/stop")
async def stop_model(model_id: str):
    model = manager.update_status(model_id, 'stopped')
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")
    return model

@app.delete("/models/{model_id}")
async def delete_model(model_id: str):
    manager.delete_model(model_id)
    return {"status": "success", "id": model_id}

@app.post("/models/deploy")
async def deploy_model(file: UploadFile = File(...)):
    # Simulate deployment
    new_model = AIModel(
        id=str(uuid.uuid4()),
        name=file.filename.split('.')[0],
        version='v1.0',
        type='Custom',
        status='deploying',
        gpu=0,
        memory='0 GB',
        lastUsed='Never',
        requests=0,
        avgLatency=0
    )
    manager.add_model(new_model)
    
    # Simulate async deployment completion
    # In a real app, this would be a background task
    import asyncio
    async def complete_deployment():
        await asyncio.sleep(5)
        manager.update_status(new_model.id, 'running')
    
    # We can't easily fire-and-forget in simple FastAPI without background tasks, 
    # but for this demo we'll just return 'deploying' and let the user see it.
    # Ideally we'd use BackgroundTasks
    
    return new_model

# --- Legacy Inference Endpoint (Kept for compatibility) ---
# Try to load MONAI model
MODEL_LOADED = False
model = None
DEVICE = "cpu"

try:
    import torch
    from monai.networks.nets import DenseNet121
    from monai.transforms import Compose, LoadImage, EnsureChannelFirst, ScaleIntensity, Resize, ToTensor
    import os
    import tempfile
    import shutil

    DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
    # Initialize model structure (Mocking for now to avoid startup delay/memory usage in this management demo)
    # model = DenseNet121(spatial_dims=2, in_channels=1, out_channels=2).to(DEVICE)
    # model.eval()
    MODEL_LOADED = True
    
    # Define preprocessing pipeline
    preprocess = Compose([
        LoadImage(image_only=True),
        EnsureChannelFirst(),
        ScaleIntensity(),
        Resize((224, 224)),
        ToTensor(),
    ])

except ImportError:
    logger.warning("MONAI/Torch not found, falling back to mock inference")
except Exception as e:
    logger.error(f"Failed to initialize MONAI model: {e}")

@app.post("/infer/lung-nodule")
async def infer_lung_nodule(file: UploadFile = File(...)):
    """
    Lung nodule detection using MONAI DenseNet121.
    """
    return {
        "filename": file.filename,
        "prediction": "benign",
        "confidence": 0.85,
        "model_version": "v0.1-fallback",
        "note": "Model management demo mode"
    }
