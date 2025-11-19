# Git 仓库与CI结构建议

## 1. 仓库结构
```
.
├── services/
│   ├── auth-service/
│   ├── pacs-gw-service/
│   ├── ai-infer-service/
│   ├── nmt-asr-service/
│   ├── emr-adapter-service/
│   ├── inventory-service/
│   ├── audit-service/
│   └── common-libs/
├── infra/
│   ├── docker/
│   ├── k8s/
│   ├── terraform/
│   └── helm/
├── data/
│   ├── scripts/
│   └── glossary/
├── docs/
├── scripts/
└── Makefile / Taskfile
```
- 所有服务采用多语言（Python/Go/TypeScript）。`common-libs` 提供共享proto、SDK、工具。
- `infra/docker` 存放镜像构建、Compose；`infra/k8s` 存 Kustomize/Helm；`infra/terraform` 管基础设施。
- `scripts` 用于本地开发、CI辅助（lint、metrics提取）。

## 2. Git 管理
- Branch：`main`、`develop`、`feature/*`、`release/*`、`hotfix/*`。
- 代码所有权：按服务划分 CODEOWNERS。
- 提交规范：Conventional Commits + PR 模板（含风险评估、测试情况）。
- Tag：`vYY.MM.patch` 对应平台release，`model-YYYYMMDD-N` 对应模型。

## 3. CI 管线（GitHub Actions 示例）
### workflows
1. `.github/workflows/ci.yml`
   - 触发：PR、push到develop。
   - 作业：`setup` → `lint` → `test` → `build` → `sbom` → `scan`。
2. `.github/workflows/cd.yml`
   - 触发：release tag或手动。
   - 作业：`build-images` → `sign` → `push` → `deploy-dev` → `deploy-stage`。
3. `.github/workflows/security.yml`
   - 周期：每日/每周。
   - 作业：Dependabot Alerts、Semgrep、Secret Scan。

### 关键步骤示例
- `lint`: python `ruff`, go `golangci-lint`, node `eslint`。
- `test`: `pytest`, `go test`, `npm test`；提供 DICOM/HL7 mock。
- `build`: 使用 `docker buildx bake`；输出多架构镜像 (amd64/arm64)。
- `sbom`: `syft packages dir -o cyclonedx-json`；上传 artifact。
- `scan`: `grype sbom=sbom.json`；决策门控 CVSS≥7 fail。
- `sign`: `cosign sign --key cosign.key <image>`。
- `deploy`: 使用 `kubectl`/`helm`/`argo rollouts`。

## 4. 本地开发
- `devcontainer` 或 `make setup` 安装依赖 (Python/Go/Node) + pre-commit hooks。
- 统一 `.env` 模板；敏感信息通过 `doppler`/`1password cli` 注入。
- `docker compose up` 启动基础依赖：PostgreSQL、Redis、Redpanda、MinIO、Keycloak、OTel。

## 5. 质量门槛
- 单元测试覆盖率：后端 ≥70%，NLP/AI 模块≥60%（结合集成测试）。
- Static Analysis：Semgrep、Bandit、Gosec、Hadolint。
- IaC：Terraform Validate、tflint、kubeconform。
- Release Checklist：
  - 所有 SBOM/扫描通过
  - CAPA/风险评估更新
  - 文档（Model Card、Change Log）完成
  - 灰度计划已批准

## 6. Artifact 管理
- 镜像：Harbor / GHCR，按 `project/service:version`。
- Helm/Kustomize：存 GitOps repo；ArgoCD 监控。
- 模型：Model Registry（MLflow/Weights & Biases）；记录训练数据集版本。
- 日志/metrics：Loki/Prometheus；trace via Jaeger/Tempo。
