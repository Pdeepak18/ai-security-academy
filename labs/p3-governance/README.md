# P3 — AI governance pack

Portfolio artefact #3. For a fictional company ("Northwind Logistics", 900
staff, uses M365 Copilot and an internal RAG assistant), produce the artefacts
an auditor or customer security questionnaire would ask for.

## Deliverables

- [ ] `01-ai-inventory.csv` — every AI system, owner, purpose, data classes, provider, risk tier
- [ ] `02-risk-register.csv` — risks with likelihood, impact, control, residual, owner, review date
- [ ] `03-rmf-mapping.md` — NIST AI RMF functions → activities → evidence artefact
- [ ] `04-vendor-questionnaire.md` — 25 questions for an AI vendor, with the answers you would accept
- [ ] `05-system-card.md` — one page on the RAG assistant: purpose, limits, data, evaluation, failure modes
- [ ] `06-incident-runbook.md` — who does what when a model leaks data
- [ ] `07-policy-summary.md` — acceptable use in one page, in language staff will read

## Quality bar

A good pack is **specific and boring**. "Ensure appropriate safeguards are in
place" scores zero. "Retrieved chunks are filtered by tenant ID in the query
layer; tested monthly by a 20-case regression suite; failures page the data
platform on-call" scores full marks.

## Templates

`templates/` contains CSV headers to start from. Fill them with plausible
content; the exercise is the judgement, not the formatting.

## Framing for interviews

Do not present this as "I read the NIST RMF". Present it as: "I built an AI
inventory and risk register for a fictional 900-person company, mapped it to the
RMF's four functions, and wrote the vendor questionnaire I would actually send.
The hardest part was tiering — here is how I decided what counts as high risk."
