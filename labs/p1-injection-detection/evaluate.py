"""
evaluate.py — score detection logic against the labelled corpus produced by
attack.py, before you implement it in Elastic or Splunk.

This is deliberately a Python approximation of the three rules so you can
measure precision/recall in seconds, then port the logic. Rule ids match the
saved objects in elastic/ and the searches in splunk/.

Usage:
    python evaluate.py
    python evaluate.py --log ..\toy-target\logs\requests.jsonl
"""
import argparse
import json
import re
from pathlib import Path

CANARY = "CANARY-7f3a91c2"

DELIM_RE = re.compile(r"(</?system>|<\|\s*im_start\s*\|>|###\s*(SYSTEM|USER|ASSISTANT)\b|\[INST\])", re.I)
OVERRIDE_RE = re.compile(
    r"(ignore|disregard|forget)\b.{0,40}\b(previous|above|earlier|instructions)\b"
    r"|new instructions|repeat everything|verbatim|unrestricted|debugbot",
    re.I,
)
EXFIL_RE = re.compile(r"(webhook\.site|ngrok|requestbin|pastebin\.com|\?d=|\?data=)", re.I)


def load(path):
    out = []
    with Path(path).open(encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line:
                out.append(json.loads(line))
    return out


def text_of(ev):
    prompt = (ev.get("prompt") or {}).get("text") or ""
    chunks = " ".join((c.get("text") or "") for c in (ev.get("retrieval") or {}).get("chunks") or [])
    resp = (ev.get("response") or {}).get("text") or ""
    url = (ev.get("url") or {}).get("full") or ""
    return prompt, chunks, resp, url


def rule_canary(ev):
    _, _, resp, url = text_of(ev)
    return CANARY in resp or CANARY in url


def rule_delimiter(ev):
    prompt, chunks, _, _ = text_of(ev)
    return bool(DELIM_RE.search(prompt) or DELIM_RE.search(chunks))


def rule_sequence(ev):
    # sequence approximated as: suspicious content AND a tool call in the event
    prompt, chunks, _, _ = text_of(ev)
    tools = (ev.get("ai") or {}).get("tool_calls") or []
    suspicious = bool(DELIM_RE.search(prompt) or OVERRIDE_RE.search(prompt) or DELIM_RE.search(chunks))
    return suspicious and bool(tools)


RULES = {
    "R1 canary in output/url": rule_canary,
    "R2 delimiter spoofing": rule_delimiter,
    "R3 suspicious + tool call": rule_sequence,
}


def score(events, fn):
    tp = fp = fn_ = tn = 0
    fps, fns = [], []
    for ev in events:
        actual = (ev.get("label") or "benign") == "attack"
        fired = bool(fn(ev))
        if fired and actual:
            tp += 1
        elif fired and not actual:
            fp += 1
            fps.append(ev)
        elif not fired and actual:
            fn_ += 1
            fns.append(ev)
        else:
            tn += 1
    prec = tp / (tp + fp) if tp + fp else 0.0
    rec = tp / (tp + fn_) if tp + fn_ else 0.0
    return dict(tp=tp, fp=fp, fn=fn_, tn=tn, precision=prec, recall=rec, fps=fps, fns=fns)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--log", default=str(Path(__file__).parent.parent / "toy-target" / "logs" / "requests.jsonl"))
    args = ap.parse_args()

    events = load(args.log)
    attacks = sum(1 for e in events if (e.get("label") or "benign") == "attack")
    print(f"Loaded {len(events)} events ({attacks} attack, {len(events) - attacks} benign)\n")

    print(f"{'rule':30} {'TP':>4} {'FP':>4} {'FN':>4} {'prec':>6} {'rec':>6}")
    print("-" * 62)
    for name, fn in RULES.items():
        s = score(events, fn)
        print(f"{name:30} {s['tp']:>4} {s['fp']:>4} {s['fn']:>4} {s['precision']:>6.2f} {s['recall']:>6.2f}")

    combined = score(events, lambda e: any(f(e) for f in RULES.values()))
    print("-" * 62)
    print(f"{'COMBINED':30} {combined['tp']:>4} {combined['fp']:>4} {combined['fn']:>4} "
          f"{combined['precision']:>6.2f} {combined['recall']:>6.2f}")

    if combined["fns"]:
        print("\nFalse negatives (payloads that got through):")
        for e in combined["fns"]:
            print("  -", ((e.get("prompt") or {}).get("text") or "")[:90])

    if combined["fps"]:
        print("\nFalse positives (benign traffic flagged):")
        for e in combined["fps"]:
            print("  -", ((e.get("prompt") or {}).get("text") or "")[:90])

    print("\nWrite these numbers down, then port the rules to Elastic/Splunk and")
    print("confirm they reproduce. A rule you cannot measure is a guess.")


if __name__ == "__main__":
    main()
