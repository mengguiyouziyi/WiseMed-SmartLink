# PoC 实施 Backlog（0-3 个月）

## Sprint 0（第1-2周）
- 立项与团队
  - 完成 PoC 范围确认、角色分配、沟通机制。
  - 建立 Git 仓库与分支策略（main/dev/feature-*）。
- 环境基础
  - 本地/云测试环境（Docker Compose 或 K3s）
  - 搭建 Redpanda、PostgreSQL、MinIO、Keycloak、OpenTelemetry。
- 文档
  - URS/SRS 模板初始化；SOUP 清单首版（列出 Orthanc、MONAI、ESPnet、Bahmni 等）。

## Sprint 1（第3-4周）
- 影像链路
  - Orthanc 容器化部署；导入样例DICOM；验证 C-STORE/C-FIND。
  - 集成 MONAI Deploy / nnU-Net 推理服务，返回 DICOM SR。
  - 事件：`exam.created` -> Redpanda -> Grafana 监控。
- SaaS接口
  - 部署 Bahmni / OpenMRS；实现 HL7 ORU → FHIR DiagnosticReport 映射 PoC。
- DevOps
  - 配置 GitHub Actions：lint、pytest（示例）、Syft 生成 SBOM、Grype 扫描。

## Sprint 2（第5-6周）
- 多语言翻译
  - 拉起 ESPnet / FunASR baseline + Rasa 对话 Demo。
  - 接入术语词表 + 热词注入；提供 REST API。
- 数据飞轮
  - 实现低置信度回退API，落库到 MinIO + Metadata。
  - Grafana Dashboard：WER、术语召回。
- 合规
  - 完成风险矩阵 Draft；建立 CAPA 流程（模板 + 工单系统）。

## Sprint 3（第7-8周）
- 边缘部署
  - RK3588 环境准备，测试容器镜像（推理、ASR）。
  - 弱网容灾：缓存/补传脚本。
- SaaS 功能
  - 库存预警 PoC、智能用药校验（规则引擎）。
- 安全
  - Keycloak + RBAC + 审计日志；Trivy 扫描镜像。

## Sprint 4（第9-12周）
- 集成测试
  - 端到端试运行：影像上传 → AI 推理 → 医生复核 → 报告签发。
  - 翻译/对话与 EMR 同屏联动。
- 指标验证
  - 推理 P95、WER、低置信度回退率、库存预警准确率。
- 试点交付准备
  - 上线验收表、培训教材、应急预案。
  - 试点评估指标（第9节）数据采集脚本。

## Backlog 管理
- 优先级：P0（合规/安全/临床关键）、P1（功能）、P2（体验）。
- 工具：Jira Board（Swimlane：影像、翻译、SaaS、合规、运维）。
- 每周复盘：燃尽图、风险更新、资源调整。
