#!/bin/bash
# WiseMed-SmartLink 一键部署脚本

set -e

echo "🚀 WiseMed-SmartLink 一键部署"
echo "=============================="

# 检查 Docker
echo "📋 检查 Docker..."
if ! command -v docker &> /dev/null; then
    echo "❌ Docker 未安装"
    exit 1
fi

# 检查 Docker Compose
if ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose 未安装"
    exit 1
fi

echo "✅ Docker 环境检查通过"

# 检查 NVIDIA GPU（可选）
echo "📋 检查 GPU 环境..."
if docker run --rm --gpus all nvidia/cuda:12.1.0-base-ubuntu22.04 nvidia-smi > /dev/null 2>&1; then
    echo "✅ GPU 环境可用"
    GPU_AVAILABLE=true
else
    echo "⚠️  GPU 环境不可用，将使用 CPU 模式"
    GPU_AVAILABLE=false
fi

# 下载模型
echo "📥 准备模型..."
./scripts/download_models.sh

# 停止现有服务
echo "🛑 停止现有服务..."
docker compose -f infra/docker/docker-compose.yml --profile central down || true

# 构建镜像
echo "🔨 构建 Docker 镜像..."
docker compose -f infra/docker/docker-compose.yml --profile central build

# 启动服务
echo "🚀 启动服务..."
docker compose -f infra/docker/docker-compose.yml --profile central up -d

# 等待服务就绪
echo "⏳ 等待服务启动（60秒）..."
sleep 60

# 健康检查
echo "🏥 服务健康检查..."
./scripts/health_check.sh

echo ""
echo "✅ 部署完成！"
echo ""
echo "访问地址："
echo "  Web Console:  http://localhost:3001"
echo "  全球诊所:     http://localhost:3001/clinical/clinic"
echo "  智能影像:     http://localhost:3001/clinical/imaging"
echo "  Grafana:      http://localhost:3000 (admin/admin)"
echo ""
echo "默认登录凭据: admin / admin"
