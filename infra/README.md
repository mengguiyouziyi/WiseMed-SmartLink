# Infra 目录

- `docker/`: 开发用 Docker Compose、镜像构建脚本。
- `k8s/`: Kustomize/Helm 配置；`base` 为通用，`overlays/edge` 为边缘节点。
- `terraform/`: 云上基础设施 (VPC、K8s、对象存储等)。
