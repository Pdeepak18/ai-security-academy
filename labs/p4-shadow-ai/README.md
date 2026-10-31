# P4 — Shadow AI discovery report

Portfolio artefact #4. A short, numbers-driven report that a security manager
would actually read.

## Scope

Use your own lab. Two options:

1. **Simulated telemetry** — generate 30 days of proxy/DNS logs for 900 fictional
   users with a realistic AI-domain mix. Ship a generator so the work is
   reproducible (`generate_logs.py`).
2. **Real telemetry you own** — your home router, pfSense, Pi-hole, or a
   DNS-filtering service. Anonymise before publishing.

Never collect data from an employer or network without written authorisation.

## Required contents (max 4 pages)

1. **Executive summary** — three sentences, one number, one recommendation.
2. **Method** — sources, domain list, time window, limitations.
3. **Findings**
   - unsanctioned AI services by user count and upload volume
   - OAuth grants to AI apps
   - high-risk patterns (client data in prompts, code uploads, legal docs)
   - top 10 users by upload volume (pseudonymised)
4. **Risk framing** — what could actually go wrong, tied to your risk register
5. **Recommendations** — tiered: sanction, educate, block. Include a sanctioned
   alternative; blocking without an alternative drives usage to personal devices.
6. **Detection appendix** — the SPL/ES|QL used, thresholds, known false positives

## What makes it strong

- **Numbers with denominators**: "43 services across 900 users" beats "many".
- **A judgement call defended**: why you did not block one category.
- **A limitation stated**: DNS misses DoH; proxy misses personal devices.
- **A follow-up**: what you would measure in 30 days to prove the policy worked.

## Publication

Commit it as `labs/p4-shadow-ai/REPORT.md` with charts in `img/`. If you blog it,
redact internal hostnames and user names. A clean public report is a strong
signal; a leaked one is a career problem.

## Interview line

"I built a Shadow AI discovery pipeline on synthetic proxy and DNS telemetry for
900 users, found 43 unsanctioned services, quantified 12 GB/month of uploads,
and wrote a tiered response policy. The interesting part was choosing not to
block two categories, and defending that in the report."
