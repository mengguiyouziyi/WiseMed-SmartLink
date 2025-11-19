# PoC 架构计划（影像推理 + 医疗翻译 + 基层SaaS）

## 1. 架构目标
- 验证 AI 影像推理在 RK3588 边缘设备上 P95 < 1s。
- 验证方言（衡水/保定）ASR + 医疗翻译在典型门诊场景达到词准确率 85%+。
- 通过轻量级基层SaaS（Bahmni/OpenEMR）打通 DICOM → AI → 医生工作站 → HL7/FHIR 报告链路。
- 为后续 SaMD 合规提供接口日志、事件追踪、联邦学习闭环验证数据。

## 2. 组件与选型
| 能力 | 开源组件 | 关键说明 |
| --- | --- | --- |
| PACS 网关 | Orthanc + dcm4chee-arc | Orthanc 负责边缘推理入站，dcm4chee 负责中心归档；启用 REST / DICOMweb。 |
| AI 推理 | MONAI Deploy + 预训练 nnU-Net | 部署肺结节/慢病模型，支持 TensorRT/ONNX，配合 RK3588 NPU / x86+GPU。 |
| 联邦学习 | Flower + MinIO | Flower 控制平面，MinIO 存储模型权重，所有数据本地存储。 |
| SaaS/EMR | Bahmni (OpenMRS + Odoo) | 提供 EMR + 库存 + 基层工作流；以 HL7 v2 / FHIR 与自研服务对接。 |
| 医疗翻译 | ESPnet + OpenNMT | ESPnet 处理方言 ASR，OpenNMT 处理术语对齐的 NMT；Rasa 做对话策略。 |
| 事件总线 | Redpanda (Kafka-compatible) | 主题 `exam.created`、`report.signed`、`drug.alert`；用于可观测性与联邦协调。 |
| 可观测性 | OpenTelemetry Collector + Prometheus + Grafana | 监控推理延迟、ASR 词错误率、SaaS 指标。 |

## 3. 最小网络拓扑
1. **边缘节点**：RK3588 网关 + Orthanc + MONAI 推理服务 + FunASR/ESPnet 语音盒。
2. **区域中心**：Redpanda、Flower、Model Registry、翻译 NMT 服务、SaaS（Bahmni）。
3. **管理平面**：OpenTelemetry Collector、Grafana、合规日志（Elasticsearch 或 Loki）。

```
[Imaging Modality] --DICOM--> [Orthanc] --gRPC--> [MONAI Inference Server]
                                           \--Kafka exam.created--> [Redpanda]
[Doctor Workstation (OHIF)] <--FHIR/HL7-- [Bahmni/OpenMRS Gateway]
[ASR Device] --WebSocket--> [ESPnet Service] --API--> [OpenNMT Translator]
```

## 4. 服务拆分（首批）
- `auth-service`：OIDC + RBAC，兼容等保三级账号体系。
- `patient-service`：患者档案、就诊记录、FHIR Patient/Encounter。
- `pacs-gw-service`：与 Orthanc 通讯，生成 `exam.created` 事件。
- `ai-infer-service`：封装 MONAI 推理 + 模型管理；提供 REST/GRPC + DICOM SR。
- `nmt-asr-service`：ESPnet/WeNet ASR + OpenNMT 翻译 + 医疗意图安全过滤。
- `emr-service`：面向 Bahmni/OpenEMR 的 API 适配，负责 HL7/FHIR 转换。
- `billing-service`：订阅、政府项目与翻译按次计费数据。
- `audit-service`：日志、SBOM、模型版本追踪，支撑 SaMD 文档。

## 5. 数据与接口
- DICOM：C-STORE/C-FIND；推理结果输出 DICOM SR + HL7 ORU^R01；FHIR `DiagnosticReport` + `Observation`。
- 语音：多通道音频（48kHz/16bit），前置 VAD + 热词注入；低置信度（<0.8）触发人工回补。
- 事件：Kafka Topic 规范
  - `exam.created`：{patientId, modality, siteId, priority}
  - `infer.completed`：{examId, modelVersion, sensitivity, inferenceTime}
  - `translation.requested/completed`：{sessionId, languagePair, confidence}
  - `drug.alert`：药品近效期、违规用药，包含 `severity`。

## 6. 环境部署与验收指标
| 场景 | 组件 | 目标 SLO |
| --- | --- | --- |
| 边缘推理 | MONAI + RK3588 | P95 < 800ms；离线缓存 24h 自动补传成功率 99%。 |
| ASR | ESPnet/FunASR | 词准确率 ≥ 85%；低置信度回退率 < 10%。 |
| NMT | OpenNMT | 医学术语 BLEU ≥ 45，覆盖 ICD-10/基药目录术语可追溯。 |
| SaaS | Bahmni | EMR 结构化率 > 90%；库存预警准确率 > 85%。 |
| 可观测性 | OTel + Grafana | 日志/指标/追踪三件套齐备，7天回溯。 |

## 7. 近期任务 (0–3 个月)
1. 组件 PoC：在本地容器环境复现 MONAI Deploy 推理、Orthanc 接入、ESPnet ASR demo。
2. 边缘硬件选型：确认 RK3588 版本与 NPU 支持，准备 Docker / K3s 部署脚本。
3. SaaS 适配：评估 Bahmni/ OpenEMR 与本地 HIS 数据对接方案，输出接口 Mapping。
4. DevOps：搭建 Git 仓库、CI（GitHub Actions/GitLab CI）执行 lint/test + SBOM 生成（Syft/Grype）。
5. 合规日志：定义最小审计字段（用户、操作、模型版本、患者 ID 别名）。
