#!/usr/bin/env python3
"""Compute ASR WER/terminology accuracy from log files."""

import argparse
import csv
import json
from pathlib import Path
from typing import Dict, List, Tuple

from jiwer import wer


def load_reference(path: Path) -> Dict[str, str]:
    data: Dict[str, str] = {}
    with path.open() as f:
        reader = csv.DictReader(f)
        for row in reader:
            data[row["session_id"]] = row["transcript"]
    return data


def load_hypothesis(path: Path) -> Dict[str, str]:
    data: Dict[str, str] = {}
    with path.open() as f:
        for line in f:
            event = json.loads(line)
            sid = event.get("sessionId")
            if not sid:
                continue
            data[sid] = event.get("text", "")
    return data


def terminology_accuracy(ref: str, hyp: str, terms: List[str]) -> Tuple[int, int]:
    ref_hits = sum(1 for t in terms if t in ref)
    hyp_hits = sum(1 for t in terms if t in hyp)
    return hyp_hits, ref_hits


def main() -> None:
    parser = argparse.ArgumentParser(description="ASR metrics")
    parser.add_argument("--ref", required=True, help="CSV with session_id,transcript")
    parser.add_argument("--hyp", required=True, help="JSONL with ASR output")
    parser.add_argument("--terms", nargs="*", default=[], help="Terminology words")
    args = parser.parse_args()

    ref = load_reference(Path(args.ref))
    hyp = load_hypothesis(Path(args.hyp))

    all_wers = []
    term_hits = 0
    term_total = 0
    for session_id, ref_text in ref.items():
        hyp_text = hyp.get(session_id, "")
        all_wers.append(wer(ref_text, hyp_text))
        hits, ref_hits = terminology_accuracy(ref_text, hyp_text, args.terms)
        term_hits += hits
        term_total += ref_hits or len(args.terms)

    wer_avg = sum(all_wers) / len(all_wers) if all_wers else 0.0
    term_acc = term_hits / term_total if term_total else 0.0
    print(f"Average WER: {wer_avg:.3f}")
    print(f"Terminology accuracy: {term_acc:.3f}")


if __name__ == "__main__":
    main()
