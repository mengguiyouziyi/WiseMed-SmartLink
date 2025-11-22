#!/bin/bash
# 模型下载脚本

set -e

echo "🔽 开始下载 AI 模型..."

# 创建模型目录
mkdir -p models/speech
mkdir -p models/imaging

# 下载 Whisper 模型（会在首次运行时自动下载）
echo "📥 Whisper 模型将在服务首次启动时自动下载"

# 下载 NMT 模型（会在首次运行时自动下载）
echo "📥 NMT 模型将在服务首次启动时自动下载"

# 下载 TTS 模型（会在首次运行时自动下载）
echo "📥 TTS 模型将在服务首次启动时自动下载"

echo "✅ 模型准备完成！"
echo ""
echo "注意：实际模型文件将在 Docker 容器首次启动时下载"
echo "首次启动可能需要 10-20 分钟，请耐心等待"
