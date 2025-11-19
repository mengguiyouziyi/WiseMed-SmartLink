# 试点评估脚本使用说明

## 1. 影像周转脚本
- 文件：`scripts/metrics/extract_exam_metrics.py`
- 依赖：`pip install confluent-kafka`
- 使用：
  ```bash
  python3 scripts/metrics/extract_exam_metrics.py --bootstrap localhost:9092 --output exam_metrics.csv
  ```
- 输出：CSV（exam_id, created_at, signed_at, turnaround_min, inference_ms）。

## 2. ASR 指标脚本
- 文件：`scripts/metrics/asr_metrics.py`
- 示例数据：`data/reference.csv` + `data/asr_logs.jsonl`
- 依赖：`pip install jiwer`
- 使用：
  ```bash
  python3 scripts/metrics/asr_metrics.py --ref data/reference.csv --hyp data/asr_logs.jsonl --terms 肺结节 血糖
  ```
- 输出：平均 WER 与术语准确率。

## 3. 自动化
- 结合 `Makefile`：
  - `make metrics`
  - `make asr`
- 建议部署为 CronJob 或 K8s Job，每日自动收集，结果上传至 MinIO/ClickHouse。
