from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List
import yaml
import os
from pathlib import Path

app = FastAPI(title="API Config Service")

# 配置文件路径
CONFIG_PATH = Path("/app/config/api_config.yaml")

class APIConfigCreate(BaseModel):
    name: str
    service_type: str
    provider: str
    endpoint: str
    api_key: Optional[str] = None
    model: Optional[str] = None
    is_active: bool = True

class APIConfigUpdate(BaseModel):
    name: Optional[str] = None
    provider: Optional[str] = None
    endpoint: Optional[str] = None
    api_key: Optional[str] = None
    model: Optional[str] = None
    is_active: Optional[bool] = None

class APIConfigResponse(BaseModel):
    id: str
    name: str
    service_type: str
    provider: str
    endpoint: str
    api_key: Optional[str] = None
    model: Optional[str] = None
    is_active: bool
    created_at: str

def load_config():
    """加载配置文件"""
    if not CONFIG_PATH.exists():
        return {}
    with open(CONFIG_PATH, 'r', encoding='utf-8') as f:
        return yaml.safe_load(f) or {}

def save_config(config: dict):
    """保存配置文件"""
    CONFIG_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(CONFIG_PATH, 'w', encoding='utf-8') as f:
        yaml.dump(config, f, allow_unicode=True, default_flow_style=False)

@app.get("/healthz")
async def health_check():
    return {"status": "ok", "service": "api-config-service"}

@app.get("/api/admin/api-configs", response_model=List[APIConfigResponse])
async def list_configs(service_type: Optional[str] = None):
    """获取所有 API 配置"""
    config = load_config()
    
    # TODO: 从数据库加载配置
    # 这里暂时返回配置文件中的默认配置
    
    configs = []
    for svc_type, svc_config in config.items():
        if svc_type == 'config':
            continue
        if service_type and svc_type != service_type:
            continue
        
        provider = svc_config.get('provider', 'local')
        provider_config = svc_config.get(provider, {})
        
        configs.append({
            "id": f"{svc_type}_{provider}",
            "name": f"{svc_type.upper()} - {provider}",
            "service_type": svc_type,
            "provider": provider,
            "endpoint": provider_config.get('endpoint', ''),
            "model": provider_config.get('model'),
            "is_active": True,
            "created_at": "2025-11-21",
        })
    
    return configs

@app.post("/api/admin/api-configs", response_model=APIConfigResponse)
async def create_config(config: APIConfigCreate):
    """创建新的 API 配置"""
    # TODO: 保存到数据库
    
    return {
        "id": f"{config.service_type}_{config.provider}",
        "name": config.name,
        "service_type": config.service_type,
        "provider": config.provider,
        "endpoint": config.endpoint,
        "api_key": config.api_key,
        "model": config.model,
        "is_active": config.is_active,
        "created_at": "2025-11-21",
    }

@app.put("/api/admin/api-configs/{config_id}", response_model=APIConfigResponse)
async def update_config(config_id: str, config: APIConfigUpdate):
    """更新 API 配置"""
    # TODO: 更新数据库
    
    raise HTTPException(status_code=501, detail="Not implemented")

@app.delete("/api/admin/api-configs/{config_id}")
async def delete_config(config_id: str):
    """删除 API 配置"""
    # TODO: 从数据库删除
    
    return {"message": "Config deleted successfully"}

@app.get("/api/admin/api-configs/{service_type}/active")
async def get_active_config(service_type: str):
    """获取指定服务类型的活动配置"""
    config = load_config()
    
    if service_type not in config:
        raise HTTPException(status_code=404, detail="Service type not found")
    
    svc_config = config[service_type]
    provider = svc_config.get('provider', 'local')
    provider_config = svc_config.get(provider, {})
    
    return {
        "service_type": service_type,
        "provider": provider,
        "endpoint": provider_config.get('endpoint'),
        "model": provider_config.get('model'),
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
