# WiseMed-SmartLink Grafana 监控配置指南

## 概述

本文档提供 Grafana 监控仪表板的配置指南,用于监控 WiseMed-SmartLink 平台的所有服务和基础设施组件。

## 访问 Grafana

- **URL**: http://localhost:3000
- **默认用户名**: admin
- **默认密码**: admin (首次登录后需修改)

## 配置 Prometheus 数据源

### 步骤 1: 添加数据源

1. 登录 Grafana
2. 点击左侧菜单 **Configuration** → **Data Sources**
3. 点击 **Add data source**
4. 选择 **Prometheus**

### 步骤 2: 配置连接

```yaml
Name: Prometheus
URL: http://prometheus:9090
Access: Server (default)
```

点击 **Save & Test** 验证连接。

## 推荐仪表板

### 1. 系统概览仪表板

**面板配置**:

#### 服务健康状态
```promql
# 所有服务的健康状态
up{job=~".*-service"}
```

#### 容器运行时间
```promql
# 容器启动时间
time() - container_start_time_seconds
```

#### CPU 使用率
```promql
# 容器 CPU 使用率
rate(container_cpu_usage_seconds_total[5m]) * 100
```

#### 内存使用
```promql
# 容器内存使用 (MB)
container_memory_usage_bytes / 1024 / 1024
```

### 2. 服务性能仪表板

#### HTTP 请求率
```promql
# 每秒请求数
rate(http_requests_total[5m])
```

#### 请求延迟 (P95)
```promql
# 95th 百分位延迟
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))
```

#### 错误率
```promql
# HTTP 5xx 错误率
rate(http_requests_total{status=~"5.."}[5m])
```

### 3. 业务指标仪表板

#### 影像处理量
```promql
# DICOM 实例处理数
increase(orthanc_instances_total[1h])
```

#### 翻译请求量
```promql
# 翻译服务请求数
increase(translation_requests_total[1h])
```

#### ASR 转录量
```promql
# ASR 转录请求数
increase(asr_transcriptions_total[1h])
```

## 仪表板 JSON 模板

### 系统概览仪表板

保存以下 JSON 到文件,然后在 Grafana 中导入:

```json
{
  "dashboard": {
    "title": "WiseMed-SmartLink System Overview",
    "tags": ["wisemed", "overview"],
    "timezone": "browser",
    "panels": [
      {
        "title": "Service Health",
        "type": "stat",
        "targets": [
          {
            "expr": "up{job=~\".*-service\"}",
            "legendFormat": "{{job}}"
          }
        ],
        "gridPos": {"h": 8, "w": 12, "x": 0, "y": 0}
      },
      {
        "title": "Container Memory Usage",
        "type": "graph",
        "targets": [
          {
            "expr": "container_memory_usage_bytes{name=~\".*-service\"} / 1024 / 1024",
            "legendFormat": "{{name}}"
          }
        ],
        "gridPos": {"h": 8, "w": 12, "x": 12, "y": 0}
      }
    ]
  }
}
```

## 告警配置

### 服务不可用告警

```yaml
alert: ServiceDown
expr: up{job=~".*-service"} == 0
for: 1m
labels:
  severity: critical
annotations:
  summary: "Service {{ $labels.job }} is down"
```

### 高内存使用告警

```yaml
alert: HighMemoryUsage
expr: container_memory_usage_bytes / container_spec_memory_limit_bytes > 0.9
for: 5m
labels:
  severity: warning
annotations:
  summary: "Container {{ $labels.name }} memory usage > 90%"
```

### 高错误率告警

```yaml
alert: HighErrorRate
expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
for: 5m
labels:
  severity: warning
annotations:
  summary: "High error rate on {{ $labels.job }}"
```

## 快速开始

### 方法 1: 手动配置

1. 访问 http://localhost:3000
2. 登录 (admin/admin)
3. 添加 Prometheus 数据源
4. 创建新仪表板
5. 添加面板并使用上述 PromQL 查询

### 方法 2: 使用预配置 (推荐)

创建 Grafana 配置文件:

```bash
# 创建配置目录
mkdir -p infra/docker/grafana/provisioning/{datasources,dashboards}

# 配置数据源
cat > infra/docker/grafana/provisioning/datasources/prometheus.yml <<EOF
apiVersion: 1
datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
EOF

# 配置仪表板
cat > infra/docker/grafana/provisioning/dashboards/default.yml <<EOF
apiVersion: 1
providers:
  - name: 'default'
    folder: 'WiseMed'
    type: file
    options:
      path: /etc/grafana/provisioning/dashboards
EOF
```

然后在 docker-compose.yml 中挂载:

```yaml
grafana:
  volumes:
    - ./grafana/provisioning:/etc/grafana/provisioning:ro
```

## 常用查询示例

### 服务可用性
```promql
avg_over_time(up{job="auth-service"}[24h]) * 100
```

### 请求成功率
```promql
sum(rate(http_requests_total{status!~"5.."}[5m])) / sum(rate(http_requests_total[5m])) * 100
```

### 平均响应时间
```promql
rate(http_request_duration_seconds_sum[5m]) / rate(http_request_duration_seconds_count[5m])
```

## 最佳实践

1. **使用变量**: 创建仪表板变量以便快速切换服务
2. **设置刷新间隔**: 建议 30s-1m
3. **添加注释**: 在重要事件时添加注释
4. **导出备份**: 定期导出仪表板 JSON
5. **权限管理**: 为不同用户设置适当的查看权限

## 故障排查

### Prometheus 连接失败
```bash
# 检查 Prometheus 是否运行
docker ps | grep prometheus

# 检查网络连接
docker exec grafana ping prometheus
```

### 无数据显示
```bash
# 检查 Prometheus targets
curl http://localhost:9090/api/v1/targets

# 检查指标是否存在
curl http://localhost:9090/api/v1/label/__name__/values
```

## 下一步

1. 根据业务需求自定义仪表板
2. 配置告警通知 (Email, Slack, etc.)
3. 创建用户和团队
4. 设置仪表板权限

---

**文档版本**: v1.0  
**最后更新**: 2025-11-19  
**维护者**: WiseMed-SmartLink Team
