# AI Security Academy

A hands-on curriculum for moving from security generalist to AI security
engineer, with the emphasis on **detection engineering, MLSecOps and
governance** — plus enough offensive work to be credible.

**Live site:** https://pdeepak18.github.io/ai-security-academy/

## What this is

A study workbook, not a video course. Each lesson has: the concept, why it
matters in a job, a lab that runs on your own machine, and three questions.
Progress is tracked locally in the browser.

Twelve modules, roughly 13 weeks at 8–10 hours per week:

| # | Module | Status |
|---|---|---|
| 00 | Orientation: the AI security job map | complete |
| 01 | LLM internals, intuition first | complete |
| 02 | How LLMs fail: OWASP Top 10 and the lethal trifecta | complete |
| 03 | Threat modelling AI systems | complete |
| 04 | Detection engineering for AI | complete |
| 05 | Guardrails and defence in depth | map |
| 06 | MLSecOps: securing the model supply chain | map |
| 07 | Cloud AI platform security | map |
| 08 | Classical adversarial ML | map |
| 09 | Agentic AI and MCP security | map |
| 10 | AI governance: NIST AI RMF, ISO 42001, EU AI Act | map |
| 11 | Career ops: resume, stories, interviews | map |

"map" = the module page and its plan lesson are published; the full lessons and
labs land one per week.

## Run it

No build step, no server, no dependencies:

```
double-click index.html
```

Or serve it if you prefer a real origin:

```powershell
cd ai-security-academy
python -m http.server 8080
# http://localhost:8080
```

Content lives in plain JS modules under `content/`, which is why it works from
`file://` (no `fetch`, no CORS problems) and identically on GitHub Pages.

## Labs

| Path | What it is |
|---|---|
| `labs/toy-target/` | Deliberately vulnerable RAG chatbot (Flask + Ollama) that logs JSONL |
| `labs/p1-injection-detection/` | P1: labelled attack corpus, three detections, evaluation script, Elastic + Splunk rules |
| `labs/p2-mlsecops/` | P2: artefact scanning and a CI gate |
| `labs/p3-governance/` | P3: AI inventory, risk register, RMF mapping |
| `labs/p4-shadow-ai/` | P4: Shadow AI discovery report |

> **Safety:** `labs/toy-target` is intentionally insecure. Bind it to
> `127.0.0.1` only, never expose it, and never reuse its patterns in real code.
> Attack scripts are for systems you own.

## Requirements

- Node 18+ (not needed for the site — only if you extend the tooling)
- Python 3.10+ for the labs
- [Ollama](https://ollama.com/download) with `llama3.2:3b` for the model labs
- Optional: Docker, an Elastic stack (you probably already have one)

## Progress

Browser-local (`localStorage`). The durable record is your git history — commit
each week's lab output. That history is what you show in interviews.

## Contributing / use

Personal study project. Fork it and make it yours; if you fix a lab, a PR is
welcome.
