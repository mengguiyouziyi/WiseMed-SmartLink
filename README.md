# 慧医智联 · 基层医疗AI诊断与语言服务平台# WiseMed-SmartLink

**智慧医疗互联平台 PoC** - 面向基层医疗的 AI 辅助诊断、多语言翻译与 SaaS 服务平台

![Status](https://img.shields.io/badge/status-PoC%20Development-blue)
![Services](https://img.shields.io/badge/services-4%2F4%20running-success)
![Docker](https://img.shields.io/badge/docker-compose%20ready-informational)

## 📋 项目概述

WiseMed-SmartLink 是一个面向基层医疗机构的智能化平台,整合了:
- 🏥 **AI 影像辅助诊断** - 基于 MONAI 的肺结节检测
- 🗣️ **医学多语言翻译** - 方言 ASR + 医学术语翻译
- 📊 **SaaS 基础服务** - 租户管理、权限控制、数据分析
- 🔒 **合规与安全** - SBOM、漏洞扫描、审计日志

## 🚀 快速开始


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
