from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
import uvicorn
import os
import shutil
import uuid
from pathlib import Path

app = FastAPI(title="WiseMed PACS Gateway")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Storage configuration
UPLOAD_DIR = Path("data/dicom")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

@app.get("/healthz")
async def health_check():
    return {"status": "healthy", "service": "pacs-gw-service"}

@app.post("/upload")
async def upload_dicom(file: UploadFile = File(...)):
    """Upload a DICOM file and return its ID"""
    if not file.filename.lower().endswith('.dcm'):
        raise HTTPException(status_code=400, detail="Only .dcm files are supported")
    
    try:
        file_id = str(uuid.uuid4())
        file_path = UPLOAD_DIR / f"{file_id}.dcm"
        
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        return {
            "id": file_id,
            "filename": file.filename,
            "url": f"/api/imaging/wado?requestType=WADO&studyUID=&seriesUID=&objectUID={file_id}"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/wado")
async def wado_retrieve(requestType: str, objectUID: str, studyUID: str = None, seriesUID: str = None):
    """
    Simplified WADO-URI implementation for Cornerstone.js
    """
    if requestType != "WADO":
        raise HTTPException(status_code=400, detail="Invalid requestType")
    
    file_path = UPLOAD_DIR / f"{objectUID}.dcm"
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="DICOM file not found")
        
    return FileResponse(
        path=file_path,
        media_type="application/dicom",
        filename=f"{objectUID}.dcm"
    )

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
