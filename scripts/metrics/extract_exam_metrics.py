#!/usr/bin/env python3
"""Extract imaging turnaround metrics from Kafka (Redpanda).

Subscribes to `exam.created` and `report.signed` topics, calculates turnaround
and inference latency, writes summary CSV.
"""

import argparse
import csv
import json
import os
import signal
import sys
from collections import defaultdict
from datetime import datetime
from typing import Dict, Tuple

from confluent_kafka import Consumer, TopicPartition

DEFAULT_BOOTSTRAP = os.getenv("KAFKA_BOOTSTRAP", "localhost:9092")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Collect exam metrics")
    parser.add_argument("--bootstrap", default=DEFAULT_BOOTSTRAP)
    parser.add_argument("--group", default="metrics-agent")
    parser.add_argument("--output", default="exam_metrics.csv")
    parser.add_argument(
        "--topics",
        nargs="+",
        default=["exam.created", "report.signed", "infer.completed"],
    )
    return parser.parse_args()


def build_consumer(bootstrap: str, group: str) -> Consumer:
    return Consumer(
        {
            "bootstrap.servers": bootstrap,
            "group.id": group,
            "auto.offset.reset": "earliest",
        }
    )


def parse_event(msg_value: bytes) -> Dict:
    try:
        return json.loads(msg_value)
    except json.JSONDecodeError:
        return {}


def iso_to_dt(value: str) -> datetime:
    return datetime.fromisoformat(value.replace("Z", "+00:00"))


def main() -> None:
    args = parse_args()
    consumer = build_consumer(args.bootstrap, args.group)
    consumer.subscribe(args.topics)

    turnaround: Dict[str, Dict[str, str]] = defaultdict(dict)
    running = True

    def handle_sig(sig, frame):  # noqa: ARG001
        nonlocal running
        running = False

    signal.signal(signal.SIGINT, handle_sig)
    signal.signal(signal.SIGTERM, handle_sig)

    print("[metrics] collecting events...", file=sys.stderr)
    while running:
        msg = consumer.poll(timeout=1.0)
        if msg is None:
            continue
        if msg.error():
            print(f"[metrics] error: {msg.error()}", file=sys.stderr)
            continue
        payload = parse_event(msg.value())
        exam_id = payload.get("examId") or payload.get("id")
        if not exam_id:
            continue
        if msg.topic() == "exam.created":
            turnaround[exam_id]["created"] = payload.get("timestamp")
        elif msg.topic() == "infer.completed":
            turnaround[exam_id]["inference_ms"] = payload.get("inferenceTime")
        elif msg.topic() == "report.signed":
            turnaround[exam_id]["signed"] = payload.get("timestamp")

    consumer.close()

    rows: Dict[str, Tuple[str, str, str]] = {}
    for exam_id, entry in turnaround.items():
        created = entry.get("created")
        signed = entry.get("signed")
        inference_ms = entry.get("inference_ms")
        if not created or not signed:
            continue
        try:
            created_dt = iso_to_dt(created)
            signed_dt = iso_to_dt(signed)
        except ValueError:
            continue
        turnaround_minutes = (signed_dt - created_dt).total_seconds() / 60.0
        rows[exam_id] = (
            created,
            signed,
            f"{turnaround_minutes:.2f}",
        )
        if inference_ms:
            rows[exam_id] += (str(inference_ms),)

    headers = ["exam_id", "created_at", "signed_at", "turnaround_min", "inference_ms"]
    with open(args.output, "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        for exam_id, data in rows.items():
            row = list(data)
            if len(row) == 4:
                row.append("")
            writer.writerow([exam_id, *row])
    print(f"[metrics] wrote {len(rows)} rows to {args.output}")


if __name__ == "__main__":
    main()
