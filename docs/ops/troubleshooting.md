# WiseMed-SmartLink 故障排查指南

## 1. 常见问题 (FAQ)

### Q1: Docker 容器启动失败，提示 "port already allocated"
**原因**: 端口被占用。
**解决**:
1.  检查占用端口的进程: `sudo lsof -i :<port>`
2.  停止冲突进程或修改 `docker-compose.yml` 中的端口映射。

### Q2: Grafana 仪表板未显示数据
**原因**: Prometheus 数据源未连接或服务未暴露指标。
**解决**:
1.  检查 Prometheus 状态: 访问 http://localhost:9090/targets，确认所有 Target 状态为 UP。
2.  检查 Grafana 数据源配置: 确认 URL 为 `http://prometheus:9090`。

### Q3: 翻译服务响应慢
**原因**: 首次请求正在下载 Whisper 模型，或 CPU 资源不足。
**解决**:
1.  查看日志: `docker logs translation-service`，确认是否在下载模型。
2.  如果是资源不足，建议增加 CPU 分配或切换到模拟模式。

### Q4: 卷挂载失败 (Permission denied)
**原因**: 宿主机目录权限问题。
**解决**:
1.  修改目录权限: `chmod -R 777 infra/docker/grafana/provisioning` (开发环境)。
2.  确保以正确用户运行 Docker。

---

## 2. 常用诊断命令

### 查看服务日志
```bash
# 查看实时日志
docker logs -f <container_name>

# 查看最后 100 行
docker logs --tail 100 <container_name>
```

### 检查服务健康状态
```bash
# 检查所有容器状态
docker ps

# 手动调用健康检查端点
curl http://localhost:8001/healthz  # Auth
curl http://localhost:8002/healthz  # AI Infer
curl http://localhost:8003/healthz  # PACS GW
curl http://localhost:8004/healthz  # Translation
```

### 检查网络连接
```bash
# 进入容器内部
docker exec -it <container_name> sh

# 测试连接其他服务
curl http://<service_name>:8000/healthz
```

### 重启单个服务
```bash
docker compose -f infra/docker/docker-compose.yml restart <service_name>
```
