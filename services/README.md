# Services 目录

存放各微服务代码（auth, pacs-gw, ai-infer, nmt-asr, emr-adapter, inventory, audit, common-libs）。
- `auth-service`: OIDC/RBAC。
- `pacs-gw-service`: DICOM/事件接入。
- `ai-infer-service`: MONAI 推理封装。
- `nmt-asr-service`: ASR/NMT/对话模块。
- `emr-adapter-service`: HL7/FHIR/EMR映射。
- `inventory-service`: 库存、药品预警。
- `audit-service`: 日志、SBOM、追踪。
- `common-libs`: 共享proto/SDK/工具。

## pacs-gw-service
- FastAPI 样板，提供 `/healthz` `/hello?site_id=` 接口。
- 未来扩展：DICOM 事件监听、Kafka 事件推送、FHIR 映射。
