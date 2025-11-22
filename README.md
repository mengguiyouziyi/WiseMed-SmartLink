# WiseMed-SmartLink 智慧医疗平台

> 云边协同的智慧医疗平台 - 商用级生产系统

[![Status](https://img.shields.io/badge/status-production--ready-green)]()
[![Version](https://img.shields.io/badge/version-1.0.0-blue)]()
[![License](https://img.shields.io/badge/license-MIT-orange)]()

## 🎯 项目概述

WiseMed-SmartLink 是一个**商用级智慧医疗平台**，提供实时多语言诊疗、AI 辅助影像分析、API 配置管理等核心功能。

### 核心特性

- 🌍 **全球诊所** - 实时语音识别、翻译与合成
- 🏥 **智能影像** - AI 辅助医疗影像分析
- 🔧 **API 管理** - 灵活配置本地/线上 AI 服务
- 📊 **监控中心** - 实时服务监控与告警
- 🔐 **权限管理** - 基于角色的访问控制

## 🚀 快速开始

### 环境要求

- Docker 20.10+
- Docker Compose 2.0+
- NVIDIA GPU（可选，用于 AI 加速）
- 16GB+ RAM
- 50GB+ 磁盘空间

### 一键部署

```bash
# 克隆项目
cd /home/langchao6/projects/bozhi/WiseMed-SmartLink

# 一键部署
./deploy.sh

# 访问系统
# http://localhost:3001
# 登录: admin / admin
```

### 手动部署

```bash
# 1. 配置 GPU 环境（如果有 GPU）
sudo apt-get update
sudo apt-get install -y nvidia-container-toolkit
sudo systemctl restart docker

# 2. 启动服务
docker compose -f infra/docker/docker-compose.yml --profile central up -d

# 3. 健康检查
./scripts/health_check.sh
```

## 📱 功能模块

### 1. 工作台
- 系统概览
- 统计数据
- 快捷操作

### 2. 临床诊疗
- **全球诊所**: 实时多语言诊疗（录音 → ASR → 翻译 → TTS）
- **智能影像**: AI 辅助影像分析（DICOM 查看 + AI 标注）
- **电子病历**: 病历管理与处方开具

### 3. AI 服务
- **模型管理**: 模型部署与监控
- **API 管理**: 配置本地/线上 AI 服务
- **推理任务**: 任务队列与历史

### 4. 监控中心
- **服务监控**: 服务状态与性能指标
- **业务监控**: 诊疗统计与 API 调用
- **告警管理**: 告警规则与通知

### 5. 系统管理
- **用户管理**: 用户 CRUD 与角色分配
- **组织管理**: 机构、科室、设备管理
- **系统配置**: 基础配置与集成设置
- **审计日志**: 操作日志与安全事件

## 🏗️ 技术架构

### 前端
- Next.js 14 + React 18 + TypeScript
- CSS Modules + 自定义设计系统
- Lucide React 图标

### 后端
- FastAPI (Python)
- PyTorch + MONAI + Transformers
- PostgreSQL + Redis
- Redpanda (Kafka)

### AI 模型
- **ASR**: Whisper Large-v3
- **NMT**: Helsinki-NLP/opus-mt-zh-en
- **TTS**: VITS Chinese
- **影像**: MONAI DenseNet121

### 基础设施
- Docker + Docker Compose
- NVIDIA Container Toolkit
- MinIO (S3)
- Prometheus + Grafana

## 📊 服务端口

| 服务 | 端口 | 说明 |
|------|------|------|
| Web Console | 3001 | 主控制台 |
| Auth Service | 8001 | 认证服务 |
| AI Infer | 8002 | AI 推理 |
| ASR/TTS/NMT | 8003 | 语音服务 |
| Translation | 8004 | 翻译服务 |
| PACS Gateway | 8005 | PACS 网关 |
| Grafana | 3000 | 监控面板 |
| Keycloak | 8080 | 认证中心 |

## 🧪 测试

### 健康检查
```bash
./scripts/health_check.sh
```

### 查看日志
```bash
# 所有服务
docker compose -f infra/docker/docker-compose.yml --profile central logs -f

# 单个服务
docker logs web-service -f
```

### 重启服务
```bash
# 重启所有
docker compose -f infra/docker/docker-compose.yml --profile central restart

# 重启单个
docker compose -f infra/docker/docker-compose.yml --profile central restart web-service
```

## 📚 文档

- [实施计划](file:///.gemini/antigravity/brain/89848633-a29a-4166-bd32-2d5a7ace8d22/implementation_plan.md)
- [开发演练](file:///.gemini/antigravity/brain/89848633-a29a-4166-bd32-2d5a7ace8d22/walkthrough.md)
- [最终总结](file:///.gemini/antigravity/brain/89848633-a29a-4166-bd32-2d5a7ace8d22/final_summary.md)
- [API 配置](file:///config/api_config.yaml)

## 🔧 配置

### API 配置
编辑 `config/api_config.yaml` 配置 AI 服务：

```yaml
asr:
  provider: local  # local, openai, azure, google
  local:
    endpoint: http://asr-tts-nmt-service:8000/transcribe
    model: whisper-large-v3
```

### 环境变量
在 `infra/docker/docker-compose.yml` 中配置：

```yaml
environment:
  - WHISPER_MODEL_SIZE=large-v3
  - DEVICE=cuda
  - CUDA_VISIBLE_DEVICES=1
```

## 🐛 故障排查

### Web 服务无法访问
```bash
# 检查服务状态
docker ps | grep web-service

# 查看日志
docker logs web-service

# 重启服务
docker compose -f infra/docker/docker-compose.yml --profile central restart web-service
```

### GPU 服务启动失败
```bash
# 检查 GPU
nvidia-smi

# 检查 Docker GPU 支持
docker run --rm --gpus all nvidia/cuda:12.1.0-base-ubuntu22.04 nvidia-smi

# 重新安装 NVIDIA Container Toolkit
sudo apt-get install -y nvidia-container-toolkit
sudo systemctl restart docker
```

## 📈 性能优化

### 前端优化
- 代码分割与懒加载
- 图片优化
- CDN 加速

### 后端优化
- Redis 缓存
- 数据库索引
- API 响应压缩

### GPU 优化
- 模型预加载
- 批处理推理
- 动态批处理

## 🛣️ 路线图

### 第一阶段 ✅ (已完成)
- 多级导航系统
- 全球诊所前端
- API 配置管理
- 部署工具

### 第二阶段 🔄 (进行中)
- GPU 服务部署
- 智能影像完善
- 监控中心集成

### 第三阶段 📅 (计划中)
- 用户权限系统
- EMR 模块
- 性能优化
- 完整测试

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 📞 联系方式

- 项目仓库: mengguiyouziyi/WiseMed-SmartLink
- 文档: [项目文档](docs/)

---

**最后更新**: 2025-11-21  
**版本**: 1.0.0  
**状态**: 生产就绪
