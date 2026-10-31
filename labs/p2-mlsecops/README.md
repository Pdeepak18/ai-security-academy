# P2 — MLSecOps hardening lab

Portfolio artefact #2. Show that you can secure a model supply chain, not just
talk about it.

## Build order

1. **Unsafe artefact demo (isolated container, no network, no secrets)**
   ```powershell
   docker run --rm -it --network none -v ${PWD}:/work python:3.11-slim bash
   # inside: pip install torch --index-url https://download.pytorch.org/whl/cpu
   ```
   Create a tiny `torch.save` pickle, then demonstrate that loading an
   untrusted one can execute code. Keep the payload *harmless* — write a file
   named `PWNED.txt`, nothing else.
2. **Convert to safetensors** and show the same load path is inert.
3. **Scan the artefact** with `modelscan` and `picklescan`; capture output.
4. **Dataset review:** a checklist for accepting a new fine-tuning dataset
   (provenance, licence, PII, poisoning risk, deletion process).
5. **CI gate** in GitHub Actions:
   - `pip-audit` for dependencies
   - `bandit` for code
   - `modelscan` on every artefact under `models/`
   - `trivy` on the serving image
   - fail closed, with a documented break-glass path
6. **Provenance:** hash every artefact, publish `models.lock` (name → sha256 →
   source URL → scan result), and sign the release note.
7. **Serving controls:** run the model server as non-root, no egress, one
   network namespace per tenant, API key auth on the inference endpoint.

## Deliverables

- [ ] `demo/unsafe_load.py` + `demo/safe_load.py` with a README explaining the difference
- [ ] `models.lock` with hashes and scan results
- [ ] `.github/workflows/model-scan.yml` (the gate)
- [ ] `DATASET-REVIEW.md` checklist
- [ ] `RELEASE.md` describing what ships and how it was verified
- [ ] A short note: "three ways a gate like this fails in practice" (bypass via
      direct upload, unpinned action versions, allowlist drift)

## Why this matters in interviews

MLSecOps roles ask: "what would you check before loading a model from the
internet?" A weak answer lists tools. A strong answer describes the threat
(pickle deserialisation), the layered control (format policy → scan → sandbox →
no secrets on the host), and the organisational reality (a gate engineers can
bypass will be bypassed, so make the safe path the fast path).

## Safety

Do all of this on a machine you own, in a container, with no cloud credentials
mounted. Never run a real untrusted model artefact on a host with access to
production secrets.
