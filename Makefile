.PHONY: setup compose-up compose-down metrics exams asr

setup:
	python3 -m venv .venv && . .venv/bin/activate && pip install -U pip

compose-up:
	cd infra/docker && docker compose up -d

compose-edge:
	cd infra/docker && docker compose --profile edge up -d

compose-down:
	cd infra/docker && docker compose down

metrics:
	python3 scripts/metrics/extract_exam_metrics.py --output exam_metrics.csv

asr:
	python3 scripts/metrics/asr_metrics.py --ref data/reference.csv --hyp data/asr_logs.jsonl --terms 肺结节 血糖
