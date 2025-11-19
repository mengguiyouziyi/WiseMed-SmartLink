# 慧医智联 · 基层医疗AI诊断与语言服务平台 (WiseMed SmartLink)

![Status](https://img.shields.io/badge/Status-PoC%20%2F%20Sprint%200-blue)

该仓库承载创业计划执行文档与PoC代码，致力于解决中国基层医疗“能力不足 + 语言壁垒”双痛点。

## 🛠️ 技术栈 (Tech Stack)

- **核心框架**: FastAPI (Python), React (Web App - Planned)
- **医疗影像**: Orthanc (DICOM Server), MONAI (AI Inference), OHIF (Viewer)
- **多语言**: ESPnet (ASR/NMT), OpenNMT
- **基础设施**: Docker Compose, K3s (Edge), Redpanda (Kafka compatible), PostgreSQL
- **可观测性**: OpenTelemetry, Grafana, Prometheus

## 📂 项目结构

- **`services/`**: 微服务源码
    - `pacs-gw-service`: 影像网关服务 (FastAPI)
    - `ai-infer-service`: AI 推理服务 (Planned)
    - `nmt-asr-service`: 语音翻译服务 (Planned)
- **`infra/`**: 基础设施配置 (Docker Compose, K8s, Terraform)
- **`scripts/`**: 运维与工具脚本 (Edge Bootstrap, Metrics, Data Processing)
- **`data/`**: 示例数据、术语表与语料采集剧本
- **`docs/`**: 全面项目文档

## 🚀 快速开始

详细部署指南请参考 [PoC 部署文档](docs/devops/poc-deployment.md)。

### 环境要求
- Docker & Docker Compose
- Python 3.11+
- Make

### 常用命令
```bash
make help             # 查看所有命令帮助
make setup            # 安装开发依赖
make compose-up       # 启动完整 PoC 环境 (Central Profile)
make compose-edge     # 启动边缘节点最小集 (Edge Profile)
make metrics          # 运行试点评估指标脚本
make asr              # 运行 ASR 评估脚本
```

## 📚 文档索引

### 核心规划
- [PoC 架构设计](docs/poc/architecture.md)
- [实施 Backlog (Sprint 0-4)](docs/poc/backlog.md)
- [接口与 DevOps 规范](docs/poc/interfaces-devops.md)

### 数据与算法
- [方言语料采集与调优方案](docs/data/dialect-asr-plan.md)
- [方言采集剧本](docs/data/dialect-script.md)
- [术语表与热词策略](docs/data/glossary/hotword-strategy.md)

### 合规与治理 (SaMD)
- [合规体系与试点 SOP](docs/governance/compliance-and-pilot-sop.md)
- [风险矩阵与 CAPA](docs/governance/risk-matrix-capa.md)
- [SOUP 第三方组件登记](docs/templates/SOUP-register.md)

## 🤝 贡献
请阅读 [CONTRIBUTING.md](CONTRIBUTING.md) 了解代码规范与提交流程。
