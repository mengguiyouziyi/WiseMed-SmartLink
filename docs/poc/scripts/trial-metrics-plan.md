# 试点评估数据采集方案

## 1. 目标
支撑第9节 KPI：影像报告周转、诊断准确率、医患沟通时长、近效期报废率、患者满意度。

## 2. 数据点与来源
| 指标 | 数据来源 | 采集方式 | 频率 |
| --- | --- | --- | --- |
| 影像周转时长 | Orthanc + Bahmni 工作站 | 事件 `exam.created`、`report.signed` 时间差 | 实时，日汇总 |
| 常见病诊断准确率 | AI 推理 vs 医生复核 | JSON 日志 + 医生复核系统 | 每例记录，周度分析 |
| 医患沟通时长 | ASR 会话日志 | `session.start/end` 时间戳 | 实时，月度分析 |
| 低置信度回退率 | ASR/NMT 服务 | `translation.review` 事件数 / 总请求 | 实时 |
| 近效期报废率 | 库存模块 | 库存记录 + 报废单 | 月度 |
| 患者满意度 (NRS) | 调查问卷 (电子/纸质) | Form + 自动汇总 | 每周 |

## 3. 数据管道
1. `Redpanda` 事件转发至 `ClickHouse`/`TimescaleDB`（TTL ≥ 6 个月）。
2. `Grafana` 统一展示：KPI 面板 + 阈值告警。
3. 试点专用数据湖：`MinIO` -> `Delta Lake`（供分析/合规）。
4. 数据脱敏：患者 ID 映射为匿名标识；敏感字段仅授权访问。

## 4. 脚本与工具
- `scripts/extract_exam_metrics.py`
  - 订阅 Kafka 主题，计算周转时长、推理延迟。
  - 输出 CSV/Parquet；上传至 MinIO。
- `scripts/compute_accuracy.py`
  - 对比 AI 结果与医生复核（从 FHIR `DiagnosticReport`/`Observation` 提取）。
  - 计算敏感度/特异度/假阳假阴率。
- `scripts/asr_metrics.py`
  - 统计 WER（需对齐人工转写）、低置信度回退率。
- `scripts/inventory_expiry.py`
  - 统计近效期物资、报废额；生成 `drug.alert` 分析。
- `survey/form-templates/`：NRS 满意度表格（电子问卷）。

## 5. 采集流程
1. 在试点上线前布署 `metrics-agent`（Docker）
   - 负责订阅 Kafka + 写入数据库。
2. 配置 Grafana Dashboard 模板；培训客户成功填写数据差异说明。
3. 每日自动生成摘要邮件（推理延迟、沟通时长、异常事件）。
4. 月度编制《试点评估报告》：包含 KPI 趋势、对比基线、偏差解释。

## 6. 合规
- 数据使用遵从 DPA：仅限试点评估。
- 数据存储本地化；导出需审批。
- 数据保留：影像/诊断 2 年，语音日志 1 年，满意度调查 1 年。

## 7. 责任人
| 角色 | 职责 |
| --- | --- |
| 数据工程师 | 搭建采集脚本、监控管道 |
| 客户成功 | 核对数据、与医院沟通 |
| 合规 | 审批数据访问、审查报告 |

## 8. 时间表
| 时间 | 任务 |
| --- | --- |
| T-4 周 | 完成指标定义、脚本开发 |
| T-2 周 | 环境部署、验证数据准确性 |
| T0 | 正式采集；每周出具KPI简报 |
| T+12 周 | 形成试点评估总结报告 |
