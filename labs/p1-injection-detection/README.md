# P1 — Prompt-injection detection pack

Portfolio artefact #1. A pipeline that turns a vulnerable LLM app into
detections, measured against a labelled corpus.

```
toy-target (logs JSONL)  ──►  Elastic / Splunk  ──►  alerts + dashboard
        │                                              │
        └── attack.py builds the corpus               └── evaluate.py scores the rules
```

## What you produce

- [ ] `logs/requests.jsonl` from at least 10 benign + 12 attack requests
- [ ] Three detections implemented in Elastic (ES|QL) **and** Splunk (SPL)
- [ ] `evaluate.py` output saved as `results/run-1.txt`
- [ ] One Kibana/Elastic dashboard: alerts by rule, token spend by user, egress attempts
- [ ] `TUNING.md` — 500 words: what fired, what was noisy, what you suppressed, next iteration
- [ ] `threat-model.md` — from module 03
- [ ] Optional: `results/run-2.txt` after closing gaps

## Step 1 — generate the corpus

```powershell
cd D:\ai-security-academy\labs\toy-target
python app.py                       # terminal 1
```

```powershell
cd D:\ai-security-academy\labs\p1-injection-detection
python attack.py                    # terminal 2
python evaluate.py                  # baseline numbers
```

You now have a baseline. Expect the delimiter and sequence rules to miss the
paraphrased payload — that is the point. Record the numbers.

## Step 2 — ship the logs to Elastic

Minimal Filebeat input (`filebeat.yml`) tailing the JSONL:

```yaml
filebeat.inputs:
  - type: filestream
    id: supportbot-logs
    paths:
      - D:\ai-security-academy\labs\toy-target\logs\requests.jsonl
    parsers:
      - ndjson:
          target: ""
          overwrite_keys: true
          add_error_key: true

output.elasticsearch:
  hosts: ["https://localhost:9200"]
  username: "elastic"
  password: "CHANGEME"
  index: "logs-ai.chat-default"

setup.ilm.enabled: false
setup.template.name: "logs-ai.chat"
setup.template.pattern: "logs-ai.chat-*"
```

Then confirm the mapping — if `prompt.text` is indexed as `keyword`, long
prompts get truncated and your rules silently miss things:

```powershell
Invoke-RestMethod -Uri "https://localhost:9200/logs-ai.chat-*/_mapping" `
  -Headers @{Authorization="Basic ..."} | ConvertTo-Json -Depth 8
```

## Step 3 — implement the rules

- Elastic: `elastic/queries.esql` (paste into Discover, then save as rules)
- Kibana API payloads: `elastic/detection-rules.json`
- Splunk: `splunk/savedsearches.conf`

Keep rule logic identical across platforms. If the numbers differ, your field
extraction differs — find out why.

## Step 4 — measure, then improve

`evaluate.py` approximates the rules in Python. After porting, confirm the SIEM
produces the same TP/FP counts. If it does not, the difference is a mapping or
parsing bug, which is exactly the class of problem detection engineers spend
their days on.

Target for a second iteration: recall > 0.85 with precision > 0.90. Do not
chase recall by lowering thresholds to zero — that is how rules get disabled.

## Grading rubric (be honest with yourself)

| Level | Looks like |
|---|---|
| Weak | Rules run; no numbers; no tuning notes |
| Competent | Numbers measured; three rules; dashboard exists |
| Strong | Second iteration with a documented gap analysis; FP classes named; ATLAS mapping |
| Hireable | Strong + runbook per rule + a paragraph on what you would need in production that you do not have here |
