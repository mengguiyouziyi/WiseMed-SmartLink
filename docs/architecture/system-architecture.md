# WiseMed-SmartLink 系统架构

## 架构概览

WiseMed-SmartLink 采用微服务架构,基于 Docker Compose 部署,包含 4 个核心服务和 7 个基础设施组件。

![System Architecture](file:///home/langchao6/.gemini/antigravity/artifacts/system_architecture_diagram.webp)

## 核心服务层

### 1. Auth Service (认证服务)
- **端口**: 8001
- **技术**: FastAPI + Keycloak
- **功能**: JWT 令牌验证、用户认证、RBAC 权限控制
- **依赖**: Keycloak, PostgreSQL

### 2. AI Inference Service (AI 推理服务)
- **端口**: 8002
- **技术**: FastAPI + MONAI
- **功能**: 肺结节检测、DICOM SR 生成
- **依赖**: 无 (独立运行)
- **状态**: PoC 阶段 (MONAI 暂时简化)

### 3. PACS Gateway Service (PACS 网关服务)
- **端口**: 8003
- **技术**: FastAPI + Kafka Producer
- **功能**: Orthanc Webhook 接收、事件发布
- **依赖**: Redpanda, Orthanc
- **事件流**: `Orthanc → PACS GW → Redpanda (exam.created)`

### 4. Translation Service (翻译服务)
- **端口**: 8004
- **技术**: FastAPI + Whisper + 术语词表
- **功能**: 
  - 语音转文字 (ASR)
  - 医学术语翻译 (110+ 术语)
  - 术语数据库查询
- **依赖**: 医学术语 CSV 文件
- **状态**: 翻译功能完全可用,ASR 使用模拟模式

## 基础设施层

### DICOM 服务
- **Orthanc**: DICOM 服务器
  - DICOM 端口: 4242
  - Web 端口: 8042
  - 功能: DICOM 存储、查询、Webhook

### 消息队列
- **Redpanda**: Kafka 兼容消息队列
  - 端口: 9092 (Kafka), 8081-8082 (Admin)
  - 主题: `exam.created`
  - 用途: 异步事件处理

### 数据存储
- **PostgreSQL**: 关系数据库
  - 端口: 5433 (避免与主机冲突)
  - 用途: Keycloak 用户数据
  
- **MinIO**: 对象存储
  - API 端口: 9000
  - Console 端口: 9001
  - 用途: DICOM 文件、模型存储

### 身份认证
- **Keycloak**: 身份和访问管理
  - 端口: 8080
  - 功能: SSO、OAuth2、OIDC
  - Realm: wisemed

### 监控与可观测性
- **Prometheus**: 指标采集
  - 端口: 9090
  - 采集: 所有服务的 metrics 端点

- **Grafana**: 可视化仪表板
  - 端口: 3000
  - 数据源: Prometheus
  - 用途: 服务监控、业务指标

## 数据流

### 1. 影像处理流程
```
DICOM Modality (CT/MRI)
    ↓ C-STORE
Orthanc DICOM Server
    ↓ Webhook (OnStoredInstance)
PACS Gateway Service
    ↓ Kafka Message (exam.created)
Redpanda
    ↓ Consumer
AI Inference Service
    ↓ DICOM SR
Orthanc (结果存储)
```

### 2. 翻译服务流程
```
Voice Input (Audio File)
    ↓ POST /asr/transcribe
Translation Service (ASR Module)
    ↓ Transcribed Text
Translation Service (Translator Module)
    ↓ Query medical-terms.csv
Medical Terminology Database
    ↓ Matched Terms
Translation Result (中英对照)
```

### 3. 认证流程
```
Client Application
    ↓ Login Request
Auth Service
    ↓ Verify Credentials
Keycloak
    ↓ JWT Token
Client (Authenticated)
    ↓ API Request + JWT
Core Services (验证 Token)
```

## 网络拓扑

所有服务运行在 `smartlink-net` Docker 网络中,实现服务间通信隔离。

### 端口映射
| 服务 | 容器端口 | 主机端口 | 协议 |
|------|---------|---------|------|
| auth-service | 8000 | 8001 | HTTP |
| ai-infer-service | 8000 | 8002 | HTTP |
| pacs-gw-service | 8000 | 8003 | HTTP |
| translation-service | 8000 | 8004 | HTTP |
| orthanc (DICOM) | 4242 | 4242 | DICOM |
| orthanc (Web) | 8042 | 8042 | HTTP |
| redpanda | 9092 | 9092 | Kafka |
| postgres | 5432 | 5433 | PostgreSQL |
| minio (API) | 9000 | 9000 | S3 |
| minio (Console) | 9001 | 9001 | HTTP |
| keycloak | 8080 | 8080 | HTTP |
| grafana | 3000 | 3000 | HTTP |
| prometheus | 9090 | 9090 | HTTP |

## 技术栈

### 后端框架
- **Python 3.11**: 所有核心服务
- **FastAPI**: REST API 框架
- **Uvicorn**: ASGI 服务器

### AI/ML
- **MONAI**: 医学影像 AI 框架 (暂时简化)
- **Whisper**: 语音识别 (暂时简化)
- **Pandas**: 术语数据处理
- **Levenshtein**: 模糊匹配

### 基础设施
- **Docker & Docker Compose**: 容器化
- **Redpanda**: 消息队列 (Kafka 兼容)
- **PostgreSQL**: 关系数据库
- **MinIO**: 对象存储 (S3 兼容)

### DevOps
- **GitHub Actions**: CI/CD
- **Flake8**: 代码检查
- **Pytest**: 单元测试
- **Syft**: SBOM 生成
- **Grype**: 漏洞扫描

## 部署架构

### 当前环境 (PoC)
- **部署方式**: Docker Compose
- **环境**: 单机部署
- **资源**: CPU only
- **网络**: 本地网络

### 未来规划
- **生产环境**: Kubernetes (K3s for edge)
- **边缘部署**: RK3588 设备
- **GPU 加速**: CUDA 支持
- **高可用**: 多副本部署

## 安全架构

### 认证与授权
- Keycloak SSO
- JWT Token 验证
- RBAC 权限控制

### 网络安全
- Docker 网络隔离
- 最小权限原则
- 端口访问控制

### 供应链安全
- SBOM 生成 (Syft)
- 漏洞扫描 (Grype)
- 依赖版本锁定

### 数据安全
- 传输加密 (TLS/SSL)
- 数据库加密
- 审计日志

## 可扩展性

### 水平扩展
- 核心服务支持多实例
- Kafka 分区机制
- 负载均衡 (Nginx/Traefik)

### 垂直扩展
- GPU 加速 AI 推理
- 增加内存支持更大模型
- SSD 存储优化

## 监控指标

### 服务健康
- 健康检查端点 (`/healthz`)
- 容器状态监控
- 自动重启机制

### 业务指标
- 影像处理延迟
- ASR 转录准确率
- 翻译术语匹配率
- API 请求量

### 系统指标
- CPU/内存使用率
- 磁盘 I/O
- 网络流量
- 错误率

---

**文档版本**: v1.0  
**最后更新**: 2025-11-19  
**维护者**: WiseMed-SmartLink Team
