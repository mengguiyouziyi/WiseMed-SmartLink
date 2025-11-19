# 接口规范与 DevOps 流程草稿

## 1. HL7 / FHIR 映射
### 1.1 影像报告
| HL7 ORU^R01 字段 | 示例 | FHIR 对象 | 说明 |
| --- | --- | --- | --- |
| MSH-9 | ORU^R01 | MessageHeader.eventCoding | 消息类型 |
| PID-3 | 123456789 | Patient.identifier | 患者ID（本地ID + 匿名化Hash） |
| ORC-1 | NW | ServiceRequest.status | 新订单/更新 |
| OBR-4 | CT^LUNG^99ROC | ServiceRequest.code | 影像类型/部位 |
| OBX-2 | ED（DICOM SR） | DiagnosticReport.media | 推理原始结果 |
| OBX-5 | Structured finding | Observation | 病灶描述、置信度 |
| OBX-8 | A/N | Observation.interpretation | 异常/正常 |

FHIR 输出：
- `DiagnosticReport` （status=preliminary/final，category=radiology）
- `Observation` （component：病灶尺寸、位置、置信度、模型版本）
- `ImagingStudy` 引用 DICOM UID。

### 1.2 用药校验 / Drug Alert
| HL7 字段 | FHIR | 说明 |
| --- | --- | --- |
| RXE-2 (Give Code) | MedicationRequest.medicationCodeableConcept | 药品码（基药目录） |
| RXE-5 (Give Strength) | MedicationRequest.dosageInstruction.dose | 剂量 |
| RXR | MedicationRequest.route | 用法途径 |
| NTE | DetectedIssue.detail | 违规/禁忌说明 |

`DetectedIssue` 资源用于发出 `drug.alert` 事件（包含 severity、evidence）。

## 2. API 规范
- **Auth**：OIDC (Keycloak)，Scopes：`diagnostic.read`、`diagnostic.write`、`translation.invoke`、`inventory.manage`。
- **AI Infer Service**
  - `POST /v1/infer`：body={examId,dicomUri,modelId}
  - 响应：`{status, inferenceTime, modelVersion, findings:[{label,confidence,location}], dicomSrUri}`
  - 触发 Kafka `infer.completed`。
- **ASR/NMT Service**
  - `POST /v1/asr`：音频流（WebSocket）或文件；参数 language, dialect, domain。
  - `POST /v1/translate`：`{sessionId, sourceText, sourceLang, targetLang}`；返回 `confidence`、`terminologyHits`。
  - 低置信度 (<0.8) → `translation.review` 事件。
- **Inventory Service**
  - `POST /v1/consumption`：{itemId, quantity, department}
  - 近效期/库存下限时生成 `drug.alert`。

## 3. DevOps 流程
### 3.1 分支与版本
- `main`：受保护，release 分支来源。
- `dev`：日常集成；每周同步至 main。
- `feature/*`：单功能；MR 需代码审查 + 单元测试。
- 版本号：`YY.MM.patch`（例：24.05.0）。模型版本独立 `model-YYYYMMDD-N`。

### 3.2 CI/CD Pipeline（GitHub Actions 示例）
1. `lint`：Python (ruff)、Go (golangci-lint)、TypeScript (eslint)。
2. `test`：单元/集成测试，包含 mock DICOM/HL7 数据。
3. `build`：Docker 镜像，打上 SBOM（Syft）和签名（Cosign）。
4. `scan`：Grype/Trivy 扫描 CVE；Semgrep 代码扫描。
5. `deploy`：ArgoCD/Flux 推送到测试集群；Kustomize overlay（edge/central）。
6. `notify`：CI 结果同步到 Slack/飞书；严重失败触发 PagerDuty。

### 3.3 SBOM & 合规
- SBOM 工具：`syft packages dir` → 生成 SPDX/CycloneDX。
- 存档：上传到 Artifact Registry + audit-service。
- 变更控制：
  - 每个 release 附 `Change Impact Assessment`（对 SaMD 风险等级）。
  - 高风险变更需合规负责人批准。

### 3.4 可观察性
- OpenTelemetry SDK 接入所有服务；trace context 贯穿 DICOM 上传 → AI → EMR。
- 指标：
  - `inference_latency_ms` (P50/P95)
  - `asr_word_error_rate`
  - `translation_confidence`
  - `inventory_alerts_total`
- 日志：结构化 JSON，字段（timestamp, service, userId, patientAlias, modelVersion, action）。
- 警报：基于 Prometheus Alertmanager；严重级别对应 SLA（P1/P2）。

### 3.5 安全与发布
- 代码依赖：Dependabot/Snyk；每月安全审计。
- 镜像签名：Cosign；边缘设备拉取前验证。
- 灰度发布：10% 设备 → 50% → 100%；失败自动回滚。
- 备份：配置/模型/数据库每日备份；MinIO 版本化。

## 4. 数据治理接口
- 数据目录：枚举数据资产（影像、EMR、翻译语料、日志）。
- 授权 API：`POST /v1/data-access-request`（purpose, dataset, retention）；审批链（数据官→合规）。
- 审计：audit-service 将所有高敏查询写入不可篡改存储（区块链/append-only log）。

## 5. 文档与模板
- 接口契约：使用 OpenAPI/AsyncAPI；自动生成 SDK。
- HL7/FHIR Mapping 表：维护在 Notion + 版本控制。
- DevOps Runbook：常见故障排查、SLA、应急联系人。
