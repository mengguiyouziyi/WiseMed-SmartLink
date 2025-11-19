from fastapi import FastAPI, UploadFile, File, HTTPException
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="WiseMed AI Inference Service", version="0.1.0")

# Try to load MONAI model
MODEL_LOADED = False
model = None
DEVICE = "cpu"

try:
    import torch
    from monai.networks.nets import DenseNet121
    
    DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
    logger.info(f"Initializing MONAI DenseNet121 on {DEVICE}...")
    
    # Initialize model structure (weights would need to be loaded from file in real scenario)
    model = DenseNet121(spatial_dims=2, in_channels=1, out_channels=2).to(DEVICE)
    MODEL_LOADED = True
    logger.info("MONAI model initialized successfully")
    
except ImportError:
    logger.warning("MONAI/Torch not found, falling back to mock inference")
except Exception as e:
    logger.error(f"Failed to initialize MONAI model: {e}")


@app.get("/healthz")
async def health_check():
    return {
        "status": "ok",
        "service": "ai-infer-service",
        "model_loaded": MODEL_LOADED,
        "device": DEVICE
    }


@app.post("/infer/lung-nodule")
async def infer_lung_nodule(file: UploadFile = File(...)):

    """
    Placeholder endpoint for lung nodule detection.
    Accepts a DICOM or image file and returns inference results.
    """
    if not file.filename.endswith(('.dcm', '.png', '.jpg')):
        raise HTTPException(status_code=400, detail="Invalid file format")

    logger.info(f"Received file for inference: {file.filename}")

    # TODO: Implement actual MONAI inference pipeline
    # 1. Load image
    # 2. Preprocess (transforms)
    # 3. Model inference
    # 4. Postprocess

    return {
        "filename": file.filename,
        "prediction": "benign",  # Mock result
        "confidence": 0.95,
        "model_version": "v0.1-mock"
    }
