# WiseMed-SmartLink 部署指南

## 1. 环境要求

### 硬件要求
- **CPU**: 4核及以上 (推荐 8核)
- **内存**: 16GB 及以上 (运行真实 AI 模型需要)
- **磁盘**: 50GB 可用空间

### 软件要求
- **OS**: Linux (Ubuntu 20.04+ 推荐)
- **Docker**: 24.0+
- **Docker Compose**: 2.20+
- **Make**: 用于运行快捷命令

---

## 2. 快速启动

1.  **克隆代码库**:
    ```bash
    git clone <repository-url>
    cd WiseMed-SmartLink
    ```

2.  **启动服务**:
    使用 Make 命令一键启动所有服务:
    ```bash
    make compose-up
    ```
    或者使用 Docker Compose:
    ```bash
    docker compose -f infra/docker/docker-compose.yml up -d --build
    ```

3.  **验证状态**:
    ```bash
    docker ps
    # 确认所有服务 (auth, ai-infer, pacs-gw, translation, postgres, minio, redpanda, prometheus, grafana) 均在运行
    ```

---

## 3. 监控系统配置

平台集成了 Prometheus 和 Grafana 进行全链路监控。

### 访问地址
- **Grafana**: http://localhost:3000
  - 用户名: `admin`
  - 密码: `admin`
- **Prometheus**: http://localhost:9090

### 仪表板
登录 Grafana 后，请访问 `Dashboards` -> `WiseMed-SmartLink` 查看预置仪表板:
- **System Overview**: 查看服务健康状态、资源使用率 (CPU/内存) 和网络流量。

### 告警规则
告警规则定义在 `infra/docker/prometheus/alerts.yml` 中，包括:
- **ServiceDown**: 服务宕机告警
- **HighErrorRate**: 错误率过高告警
- **ResourceUsage**: CPU/内存高负载告警

---

## 4. AI 模型配置

### 启用/禁用真实模型
默认情况下，PoC 环境启用了真实的 AI 模型 (Whisper 和 MONAI)。如果您的环境资源有限或网络受限，可以切换回模拟模式。

**切换方法**:
1.  编辑对应服务的 `requirements.txt`:
    - `services/translation-service/requirements.txt`: 注释掉 `openai-whisper`
    - `services/ai-infer-service/requirements.txt`: 注释掉 `monai` 和 `torch`
2.  重建容器:
    ```bash
    docker compose -f infra/docker/docker-compose.yml build
    docker compose -f infra/docker/docker-compose.yml up -d
    ```

### 模型下载
- **Whisper**: 首次运行翻译服务时会自动下载 `base` 模型 (约 140MB)。
- **MONAI**: 首次运行推理服务时会初始化 DenseNet121 结构。

---

## 5. 数据持久化

以下目录用于持久化数据，请定期备份:
- `./infra/docker/postgres_data`: 数据库文件
- `./infra/docker/minio_data`: 对象存储文件
- `./infra/docker/redpanda_data`: 消息队列数据
- `./infra/docker/grafana_data`: Grafana 配置和仪表板
- `./infra/docker/prometheus_data`: 监控指标数据
