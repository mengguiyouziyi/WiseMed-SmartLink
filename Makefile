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

metricasr:
	python3 scripts/metrics/asr_metrics.py

lint:
	flake8 services/

test:
	pytest services/

sbom:
	syft services/pacs-gw-service -o cyclonedx-json > sbom.json

scan:
	grype sbom.json

help:
	@echo "Usage: make [target]"
	@echo "  compose-up    Start the PoC environment"
	@echo "  compose-edge  Start the Edge environment"
	@echo "  metrics       Run the metrics extraction script"
	@echo "  asr           Run the ASR metrics script"
	@echo "  metricasr     Run the ASR metrics script (default)"
	@echo "  lint          Run flake8 linting"
	@echo "  test          Run pytest"
	@echo "  sbom          Generate SBOM for pacs-gw-service (requires syft)"
	@echo "  scan          Scan SBOM for vulnerabilities (requires grype)"
