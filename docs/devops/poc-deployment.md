# PoC 容器化部署草案

## 1. 部署模式
- **本地/研发**：Docker Compose → 快速联调。
- **区域中心 (Stage)**：K3s/Kubernetes 集群，采用 Helm/Kustomize。
- **边缘节点**：RK3588 + K3s agent 或 Docker；必要时使用轻量 runtime (containerd + nerdctl)。

## 2. Docker Compose (dev)
`infra/docker/docker-compose.yml`
```
version: "3.9"
services:
  redpanda:
    image: redpandadata/redpanda:v23
    ports: ["9092:9092", "9644:9644"]
  postgres:
    image: postgres:15
    environment: [POSTGRES_PASSWORD=xxx]
  minio:
    image: minio/minio:RELEASE
    command: server /data
    ports: ["9000:9000"]
  keycloak:
    image: quay.io/keycloak/keycloak:23
    command: start --features=token-exchange
  orthanc:
    image: jodogne/orthanc-plugins:1.12
    environment:
      ORTHANC__DICOM_UID_ROOT: "1.2.826.0.1.3680043.10"
    ports: ["4242:4242", "8042:8042"]
  monai-infer:
    build: services/ai-infer-service
  espnet:
    build: services/nmt-asr-service
  bahmni:
    image: bahmni/bahmni:0.93
  grafana:
    image: grafana/grafana:10
```
- 使用 `.env` 管理密码/密钥。
- 通过 `docker compose --profile edge` 启动边缘子集（orthanc + monai + espnet）。

## 3. Kubernetes (stage/prod)
### 拓扑
- namespace：`edge`, `platform`, `observability`, `data`。
- 入口：Nginx Ingress / Traefik；mTLS between services。
- 存储：
  - Ceph/Rook 或 Longhorn 提供 RWX 卷。
  - Edge 节点使用本地 NVMe + rsync 备份。

### 关键组件
- `infra/k8s/base`：
  - Deployments: auth, pacs-gw, ai-infer, nmt-asr, emr-adapter, inventory, audit。
  - Statefulsets: redpanda, postgres, minio。
  - Daemonset: otel-collector。
- `infra/k8s/overlays/edge`：启用边缘 profile（禁用 SaaS/Redpanda，改用 MQTT/Kafka proxy）。
- GitOps：ArgoCD 管理 `apps/platform.yaml` `apps/edge.yaml`。

### CI/CD
- Docker 镜像推送 Harbor。
- Argo Rollouts 做金丝雀发布（10/50/100%）。
- Helm values 包含 siteId、network、hardware profile。

## 4. 边缘部署脚本
- `scripts/edge/bootstrap.sh`
  1. 检查硬件（RK3588 CPU、NPU）。
  2. 安装 containerd + nerdctl + k3s agent。
  3. 拉取离线镜像（Orthanc、ai-infer、espnet）。
  4. 配置离线 license、证书。
  5. 注册至集中控制平面（Fleet/ArgoCD Edge）。
- 缓存策略：使用 `litestream`/`sqlite` 持久化队列；断网时写本地，恢复后自动补传。

## 5. 安全与访问
- 证书管理：cert-manager + private CA；边缘设备预灌根证书。
- VPN：WireGuard/ZeroTier 保障数据传输通道。
- 日志：Fluent Bit / Loki；边缘日志缓存 7 天。
- 固件更新：使用 `Mender`/`Rancher Fleet`；策略：验证签名、空闲时升级。

## 6. 监控与告警
- `observability` namespace：Prometheus, Alertmanager, Grafana, Loki, Tempo/Jaeger。
- 边缘指标：Node Exporter + custom exporter (推理延迟、缓存队列长度)。
- 告警策略：
  - P1：推理服务不可用 > 5min → PagerDuty。
  - P2：WER 超过 20% → Slack/飞书 + 邮件。
  - P3：库存采集失败 12h → Jira Ticket。

## 7. 配置管理
- 使用 `Helmfile`/`Kustomize` + `SOPS` 管理敏感配置。
- 站点配置：YAML（siteId, modalities, dialects, network, contact）。
- 版本：`config-YY.MM.patch`；记录在 `audit-service`。

## 8. 灾备
- Stage 集群跨可用区；数据库异地备份（MinIO replication）。
- 边缘断网容灾：缓存24h，补传成功率≥99%。
- 重大故障演练：季度执行（勒索、断网、模型异常）。
