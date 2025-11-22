from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
from datetime import datetime
import psutil
import time

app = FastAPI(title="Monitoring Service")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class ServiceStatus(BaseModel):
    name: str
    status: str  # healthy, degraded, down
    uptime: int  # seconds
    cpu_usage: float
    memory_usage: float
    response_time: float  # ms
    last_check: str

class BusinessMetrics(BaseModel):
    total_patients: int
    today_appointments: int
    pending_imaging: int
    active_sessions: int
    api_calls_today: int
    avg_response_time: float

class Alert(BaseModel):
    id: str
    severity: str  # critical, warning, info
    service: str
    message: str
    timestamp: str
    resolved: bool

# Mock Data
SERVICES = [
    {"name": "web-service", "port": 3001},
    {"name": "pacs-gw-service", "port": 8005},
    {"name": "ai-infer-service", "port": 8002},
    {"name": "asr-tts-nmt-service", "port": 8003},
    {"name": "translation-service", "port": 8004},
    {"name": "auth-service", "port": 8001},
]

MOCK_ALERTS = [
    {
        "id": "alert-1",
        "severity": "warning",
        "service": "ai-infer-service",
        "message": "GPU 使用率超过 80%",
        "timestamp": datetime.now().isoformat(),
        "resolved": False
    },
    {
        "id": "alert-2",
        "severity": "info",
        "service": "pacs-gw-service",
        "message": "存储空间使用率 65%",
        "timestamp": datetime.now().isoformat(),
        "resolved": False
    },
]

@app.get("/")
def read_root():
    return {"service": "monitoring-service", "status": "healthy"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.get("/services", response_model=List[ServiceStatus])
def get_services():
    """Get status of all services"""
    services_status = []
    
    for service in SERVICES:
        # Mock service status
        status = ServiceStatus(
            name=service["name"],
            status="healthy" if service["name"] != "ai-infer-service" else "degraded",
            uptime=int(time.time() % 86400),  # Mock uptime
            cpu_usage=psutil.cpu_percent(interval=0.1),
            memory_usage=psutil.virtual_memory().percent,
            response_time=45.0 + (hash(service["name"]) % 50),  # Mock response time
            last_check=datetime.now().isoformat()
        )
        services_status.append(status)
    
    return services_status

@app.get("/business", response_model=BusinessMetrics)
def get_business_metrics():
    """Get business metrics"""
    return BusinessMetrics(
        total_patients=1284,
        today_appointments=24,
        pending_imaging=8,
        active_sessions=12,
        api_calls_today=5432,
        avg_response_time=45.3
    )

@app.get("/alerts", response_model=List[Alert])
def get_alerts(resolved: Optional[bool] = None):
    """Get alerts"""
    alerts = MOCK_ALERTS
    
    if resolved is not None:
        alerts = [a for a in alerts if a["resolved"] == resolved]
    
    return alerts

@app.post("/alerts/{alert_id}/resolve")
def resolve_alert(alert_id: str):
    """Resolve an alert"""
    for alert in MOCK_ALERTS:
        if alert["id"] == alert_id:
            alert["resolved"] = True
            return {"message": "Alert resolved", "alert_id": alert_id}
    
    raise HTTPException(status_code=404, detail="Alert not found")

@app.get("/metrics/cpu")
def get_cpu_metrics():
    """Get CPU usage over time"""
    return {
        "timestamps": [f"{i}:00" for i in range(24)],
        "values": [20 + (i * 2) % 60 for i in range(24)]
    }

@app.get("/metrics/memory")
def get_memory_metrics():
    """Get memory usage over time"""
    return {
        "timestamps": [f"{i}:00" for i in range(24)],
        "values": [40 + (i * 3) % 50 for i in range(24)]
    }

@app.get("/metrics/api-calls")
def get_api_calls():
    """Get API call statistics"""
    return {
        "timestamps": [f"{i}:00" for i in range(24)],
        "values": [100 + (i * 50) % 500 for i in range(24)]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8006)
