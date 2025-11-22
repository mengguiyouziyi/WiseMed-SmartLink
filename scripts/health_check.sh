#!/bin/bash
# WiseMed-SmartLink 健康检查脚本

set -e

echo "🏥 WiseMed-SmartLink 服务健康检查"
echo "===================================="

# 检查服务列表
services=(
  "web-service:3001"
  "auth-service:8001"
  "ai-infer-service:8002"
  "asr-tts-nmt-service:8003"
  "translation-service:8004"
  "pacs-gw-service:8005"
)

all_healthy=true

for service in "${services[@]}"; do
  name="${service%%:*}"
  port="${service##*:}"
  
  echo -n "检查 $name (端口 $port)... "
  
  if curl -sf "http://localhost:$port/healthz" > /dev/null 2>&1; then
    echo "✅ 健康"
  else
    echo "❌ 不健康"
    all_healthy=false
  fi
done

echo ""
if [ "$all_healthy" = true ]; then
  echo "✅ 所有服务健康！"
  exit 0
else
  echo "⚠️  部分服务不健康，请检查日志"
  exit 1
fi
