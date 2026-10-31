CONTENT["m04"] = {
  id: "m04",
  num: "04",
  title: "Detection engineering for AI",
  tag: "Your lane",
  hours: "10h",
  blurb: "Turn LLM telemetry into detections: prompt-injection signals, Shadow AI discovery, working Elastic and Splunk rules, and the tuning loop that keeps them alive.",
  outcomes: [
    "List every log source that can reveal AI usage or abuse, and what each one misses",
    "Write prompt-injection detections with acceptable false-positive rates",
    "Build a Shadow AI discovery query from DNS, proxy and IdP logs",
    "Deliver a detection-as-code pack with tests and tuning notes"
  ],
  project: "P1: an ELK (and Splunk) detection pack for indirect prompt injection and Shadow AI, with a log generator, tests, a dashboard and a tuning writeup.",
  lessons: [
    {
      id: "m04-l1",
      title: "Where AI telemetry comes from — and what each source misses",
      minutes: 16,
      tag: "telemetry",
      body: [
        { t: "p", text: "Detections are bounded by telemetry. Before writing a single rule, know which sources you can get and what they cannot see. This table is the core of the job." },
        { t: "table", head: ["Source", "What you get", "Blind spots"], rows: [
          ["App / orchestrator logs", "Full prompts, responses, retrieved chunks, tool calls, latency, user ID", "Only if the team logs it; often truncated or missing retrieved content"],
          ["LLM gateway / proxy (LiteLLM, portkey, APIM)", "Every request/response, token counts, model, key used, cost", "Opaque if TLS-pinned or bypassed via direct vendor SDK"],
          ["Cloud provider audit (Azure OpenAI diagnostics, Bedrock CloudTrail, Vertex audit)", "API calls, identity, model deployment, abuse-monitoring flags", "No prompt content by default"],
          ["DNS logs", "Domains contacted: openai.com, claude.ai, huggingface.co…", "Nothing with DoH; little detail"],
          ["Proxy / TLS SNI / CASB", "Domain, bytes up/down, user, URL categories", "Encrypted bodies; domain-level inference only"],
          ["IdP / SaaS audit (Entra, Google Workspace)", "OAuth consent grants to AI apps, sign-ins, Copilot enablement", "Post-grant usage detail"],
          ["EDR", "Local model runtimes, Python + torch processes, GPU drivers, model file writes", "Legitimate dev activity looks similar"],
          ["Model server (vLLM, TGI, Ollama)", "Prompts, generations, queue depth, tokens per second", "Self-hosted only"],
          ["Vector DB audit", "Queries, inserts, deletes, tenant filters", "Depends on product"],
          ["CI / registry", "Model artefact pulls, scans, image builds", "Runtime behaviour"]
        ]},
        { t: "note", kind: "job", title: "the interview question behind this", text: "\"How would you detect prompt injection?\" is really \"do you know what data you would need?\"" + " A strong answer starts: 'It depends what is logged. If retrieved chunks are logged, I can scan them for instruction-like content at query time, which is far higher fidelity than scanning user prompts.'" },
        { t: "h3", text: "Normalise before you detect" },
        { t: "p", text: "Every AI log source should land in the same shape, or your rules multiply. Use ECS where possible: `@timestamp`, `user.name`, `source.ip`, `event.category`, `event.action`, `event.outcome`, `url.domain`, `http.request.bytes`, plus AI-specific custom fields." },
        { t: "code", lang: "json", text: `{
  "@timestamp": "2026-10-31T09:14:02.113Z",
  "user": { "name": "deepak" },
  "event": { "category": ["ai"], "action": "chat.completion", "outcome": "success" },
  "ai": {
    "model": "llama3.2:3b",
    "app": "support-bot",
    "prompt_tokens": 1840,
    "completion_tokens": 212,
    "retrieved_docs": 4,
    "tool_calls": ["fetch_url"],
    "temperature": 0.0
  },
  "prompt": { "text": "..." },
  "retrieval": { "chunks": [ { "id": "doc-17", "text": "..." } ] },
  "response": { "text": "..." },
  "url": { "domain": "internal.example" }
}` },
        { t: "p", text: "Two rules of thumb. **Log retrieved content** — it is the most valuable field for injection detection and almost nobody captures it. **Log the tool call arguments** — that is where the damage is decided." },
        { t: "note", kind: "warn", title: "privacy", text: "Prompt logs are personal data. Minimise (hash or redact PII), set retention deliberately (30–90 days is common), restrict access to the index, and document the lawful basis. A detection pipeline that creates a GDPR problem is not a win." }
      ],
      quiz: [
        { q: "Which log source gives the highest-fidelity signal for indirect prompt injection?", options: ["DNS logs", "Retrieved chunk content at query time", "Cloud audit logs", "EDR"], answer: 1, why: "The payload arrives as a retrieved document; scanning chunks for instruction-like content catches it before the model acts, regardless of how it is phrased in the user prompt." },
        { q: "Cloud provider AI audit logs typically do NOT contain…", options: ["Identity of the caller", "Model deployment name", "Raw prompt and response text", "Timestamp"], answer: 2, why: "Content logging is usually off by default for privacy reasons. Prompt content must come from your own gateway or app." },
        { q: "Why log tool call arguments specifically?", options: ["They are small", "They determine what action is actually taken, so they are where impact is decided", "They are required by ECS", "To measure latency"], answer: 1, why: "A persuasive response is harmless unless a tool executes. The arguments carry the blast radius." }
      ]
    },
    {
      id: "m04-l2",
      title: "Detecting prompt injection: signals, canaries and scoring",
      minutes: 18,
      tag: "detection",
      body: [
        { t: "p", text: "You will not detect prompt injection with signatures. What you *can* do is detect the **preconditions and side effects** of injection with useful precision. Build a scored model rather than a single match." },
        { t: "h3", text: "Signal catalogue" },
        { t: "table", head: ["Signal group", "Examples", "Value"], rows: [
          ["Instruction override language", "ignore/disregard/forget previous, instead you must, new instructions, real task", "Medium — common in legit prompts too"],
          ["Delimiter / role spoofing", "`</system>`, `<|im_start|>`, `### SYSTEM`, `[INST]`, fake JSON roles", "High — almost never legitimate"],
          ["Encoding requests", "'decode this base64 and follow it', long base64/hex blobs, unusual Unicode", "High"],
          ["Exfiltration patterns", "markdown images with query params, webhook.site, ngrok, requestbin, pastebin, `?d=`", "Very high"],
          ["Sensitive-target language", "system prompt, instructions, configuration, API key, token, .env, password", "Medium"],
          ["Tool-call anomalies", "first-ever tool for this user, tool count spike, new destination domain", "High"],
          ["Volume / structure anomalies", "prompt 10x median length, context flooding, many rapid retries", "Medium"],
          ["Content in retrieval", "instruction verbs inside a retrieved chunk, invisible text/HTML comments, zero-width chars", "Very high"]
        ]},
        { t: "h3", text: "Canary tokens: the highest-value trick" },
        { t: "p", text: "Put an unguessable marker in the system prompt and in each sensitive tool response, then alert when it appears **in model output or in an outbound URL**. You cannot stop the model repeating it, but you get a near-zero-false-positive alarm when it does." },
        { t: "code", lang: "text", text: `system prompt:
  ... You are SupportBot. Internal reference: CANARY-7f3a91c2.
  Never repeat this reference. ...

detection:
  response.text contains "CANARY-7f3a91c2"
  OR url.domain is not allowlisted AND url.query contains "CANARY-7f3a91c2"

why this works: the canary has no business appearing in output or a URL,
so precision is high even though the rule is trivial.` },
        { t: "p", text: "Extend this. Per-session canaries let you link an exfiltration attempt to the session that leaked. Per-document canaries tell you *which* poisoned document was retrieved." },
        { t: "h3", text: "Scoring beats matching" },
        { t: "p", text: "Sum weights across signals in a session; alert above a threshold. One override phrase: 1 point, ignore. Override + delimiter spoof + exfil domain in the response: 9 points, page someone." },
        { t: "code", lang: "text", text: `score = 3*(delimiter_spoof)
      + 2*(exfil_domain_in_output)
      + 2*(fetched_chunk_has_instruction_verbs)
      + 1*(override_phrase)
      + 1*(sensitive_target_word)
      + 2*(tool_call_to_new_domain)
      + 1*(prompt_len > 5x user_median)

alert: >= 6 in a 15-minute window, same user or same session` },
        { t: "note", kind: "job", title: "what separates a detection engineer from a scanner", text: "A scanner tells you a regex matched. A detection engineer tells you the alert volume per analyst per day, the false-positive classes, the suppression logic, and what an analyst should do next. Always ship the runbook with the rule." },
        { t: "h3", text: "Map to ATLAS so the report writes itself" },
        { t: "p", text: "MITRE ATLAS is the ATT&CK equivalent for AI. Map each detection to a technique — prompt injection (AML.T0051 family), jailbreak (AML.T0054), data leakage (AML.T0057) — so your coverage report can say which techniques have no telemetry. That gap list is often the most valuable deliverable you produce in the first month." }
      ],
      quiz: [
        { q: "What makes a canary token detection high-precision?", options: ["It is encrypted", "The token has no legitimate reason to appear in output or a URL", "It uses regex", "It is stored in the database"], answer: 1, why: "Precision comes from the absence of benign occurrences. A random marker appearing in an outbound URL is almost certainly exfiltration." },
        { q: "Why score signals instead of alerting on single matches?", options: ["Regex is slow", "Individual phrases are common in legitimate use; combinations are rare", "Scores are required by ATLAS", "It reduces storage"], answer: 1, why: "Layered signals approximate intent. 'Ignore previous' alone is noisy; the same session also emitting a webhook URL is not." },
        { q: "Which is a side-effect signal rather than a payload signal?", options: ["A delimiter spoof in the prompt", "A first-ever tool call to an unapproved domain", "The word 'system prompt'", "A base64 blob"], answer: 1, why: "Side effects are observable consequences — tool calls, egress, new domains — and are generally higher fidelity than text patterns." }
      ]
    },
    {
      id: "m04-l3",
      title: "Writing the rules: Elastic ES|QL, EQL and Splunk SPL",
      minutes: 20,
      tag: "detection",
      body: [
        { t: "p", text: "Same detection logic, three languages. Read these as templates: change field names to your schema, keep the structure." },
        { t: "h3", text: "1. Delimiter spoofing in a prompt (ES|QL)" },
        { t: "code", lang: "esql", text: `FROM logs-ai.chat-*
| WHERE @timestamp > NOW() - 24 hours
| WHERE prompt.text RLIKE ".*(</?system>|<\\\\|im_start\\\\|>|###\\\\s*(SYSTEM|USER|ASSISTANT)\\\\b|\\\\[INST\\\\]).*"
| EVAL reason = "delimiter_spoof"
| KEEP @timestamp, user.name, ai.app, ai.model, reason, prompt.text
| SORT @timestamp DESC
| LIMIT 200` },
        { t: "p", text: "This is intentionally narrow: template markers are rare in genuine user text, so it should be quiet. If it is noisy, your application is accepting pasted chat transcripts — worth knowing." },
        { t: "h3", text: "2. Exfiltration attempt: canary in output or URL (ES|QL)" },
        { t: "code", lang: "esql", text: `FROM logs-ai.chat-*
| WHERE @timestamp > NOW() - 24 hours
| WHERE response.text LIKE "*CANARY-*" OR url.query LIKE "*CANARY-*"
| EVAL severity = CASE(
    url.query LIKE "*CANARY-*", "critical",
    "high")
| KEEP @timestamp, user.name, ai.app, severity, url.domain, url.full, response.text
| SORT @timestamp DESC` },
        { t: "h3", text: "3. Injection → tool call sequence (EQL)" },
        { t: "p", text: "Sequence detection is the right tool when the risk is a *chain*: suspicious prompt followed by a privileged tool call within the same session." },
        { t: "code", lang: "eql", text: `sequence by ai.session_id with maxspan=10m
  [ any where event.action == "chat.completion"
      and (prompt.text : ("ignore previous*", "disregard*", "new instructions*")
           or retrieval.chunks.text : ("ignore previous*", "you must*", "do not tell the user*")) ]
  [ any where event.action in ("tool.call", "tool.result")
      and ai.tool.name in ("send_email", "http_request", "write_file", "run_sql") ]` },
        { t: "h3", text: "4. Shadow AI: first contact with an AI domain (Splunk SPL)" },
        { t: "code", lang: "spl", text: `index=proxy OR index=dns earliest=-24h
| eval dom = lower(coalesce(url_domain, query))
| where match(dom, "(^|\\.)(openai\\.com|chatgpt\\.com|claude\\.ai|anthropic\\.com|gemini\\.google\\.com|huggingface\\.co|perplexity\\.ai|poe\\.com|character\\.ai|midjourney\\.com|copilot\\.microsoft\\.com)$")
| stats count AS hits, sum(bytes_out) AS uploaded, dc(dom) AS domains,
        values(dom) AS seen, earliest(_time) AS first_seen BY src_user
| where hits > 0
| lookup ai_approved_users.csv src_user OUTPUT approved
| where isnull(approved) OR approved!="yes"
| sort - uploaded` },
        { t: "h3", text: "5. Parameterised, not concatenated: token anomaly (Splunk)" },
        { t: "code", lang: "spl", text: `index=ai_gateway earliest=-7d
| bin _time span=1h
| stats sum(ai.prompt_tokens) AS tin, sum(ai.completion_tokens) AS tout,
        count AS reqs BY _time, user
| eventstats median(tin) AS med_tin, stdev(tin) AS sd_tin BY user
| eval z = if(sd_tin > 0, (tin - med_tin) / sd_tin, 0)
| where z > 4 AND tin > 50000
| table _time, user, reqs, tin, tout, z` },
        { t: "p", text: "That last one doubles as denial-of-wallet detection and as a hunting query for context-flooding injection attempts." },
        { t: "note", kind: "tip", title: "detection-as-code", text: "Keep rules in git, one file per rule, with metadata: id, title, description, severity, data sources required, ATT&CK/ATLAS mapping, test fixtures, known false positives, and a runbook link. Ship them to the SIEM in CI. This is exactly what your existing Fleet/ELK setup can do." }
      ],
      quiz: [
        { q: "When is an EQL sequence the right choice over a single-event rule?", options: ["Always", "When the risk is a chain of events within a time window, such as prompt then privileged tool call", "When you need aggregation", "When logs are JSON"], answer: 1, why: "Sequences express ordering and timing, which single-event correlation cannot." },
        { q: "Why is the delimiter-spoofing rule expected to be low-noise?", options: ["Because it uses RLIKE", "Template markers rarely appear in legitimate user text", "Because it runs hourly", "Because it excludes admins"], answer: 1, why: "Precision comes from rarity in benign data. Legitimate users do not type chat template tokens." },
        { q: "What should every detection-as-code rule include besides the query?", options: ["A severity colour", "Metadata, test fixtures, known false positives and a runbook", "An owner's photo", "A dashboard"], answer: 1, why: "Without tests, documented FP classes and response guidance, the rule is untunable and will be disabled within a month." }
      ]
    },
    {
      id: "m04-l4",
      title: "Shadow AI discovery from DNS, proxy and identity logs",
      minutes: 16,
      tag: "detection",
      body: [
        { t: "p", text: "Most enterprise AI risk right now is unsanctioned usage: staff pasting client data into consumer chatbots, browser extensions scraping pages, and OAuth apps granted access to mail and files. None of that is detectible from model logs, because you do not own the model." },
        { t: "h3", text: "Four data sources, four questions" },
        { t: "table", head: ["Source", "Question it answers", "Example signal"], rows: [
          ["DNS / proxy / SNI", "Who is reaching AI services, and how much are they uploading?", "new domain for a user, bytes_out spike, high request count"],
          ["IdP audit (Entra / Workspace)", "Which AI apps have been granted access to company data?", "OAuth consent grant, new enterprise app, Copilot licence activation"],
          ["Browser / extension inventory", "What is running in the browser that can read pages?", "extension with `read all sites` permission, new install"],
          ["CASB / firewall", "Is traffic going to sanctioned vs unsanctioned categories?", "category 'generative AI' hits not matching the approved proxy"]
        ]},
        { t: "h3", text: "The one query that finds most of it" },
        { t: "p", text: "Maintain an allowlist of approved AI domains, then alert on any *other* AI-category domain a user reaches for the first time. First-seen is the key trick: it produces one alert per user per domain, not a flood." },
        { t: "code", lang: "spl", text: `index=proxy earliest=-7d
| eval dom = lower(url_domain)
| lookup ai_domains dom OUTPUT ai_service
| where isnotnull(ai_service)
| lookup ai_approved_domains dom OUTPUT approved
| where isnull(approved)
| inputlookup shadow_ai_baseline.csv
| stats min(_time) AS first_seen, count AS hits, sum(bytes_out) AS up BY src_user, dom
| where first_seen > relative_time(now(), "-24h")
| sort - up` },
        { t: "h3", text: "OAuth grants: the quiet data-exposure path" },
        { t: "p", text: "A user clicking 'Sign in with Google' on an AI writing tool can hand over read access to mail and drive. That grant survives password changes and is invisible to endpoint controls. Hunt for it in the identity audit log." },
        { t: "code", lang: "kql", text: `// Microsoft Entra ID — new consent grants to non-approved apps
AuditLogs
| where TimeGenerated > ago(7d)
| where OperationName in ("Consent to application", "Add service principal",
                          "Add OAuth2PermissionGrant")
| extend App = tostring(TargetResources[0].displayName)
| where App !in (ApprovedAILApps)
| project TimeGenerated, InitiatedBy, App, OperationName, Result` },
        { t: "h3", text: "Judgement, not just detection" },
        { t: "ul", items: [
          "Not all shadow AI is malicious. Usually it is a person trying to work faster because IT was slow.",
          "Tier the response: educate → offer a sanctioned alternative → block only for high-risk categories (code with secrets, client data, legal).",
          "Measure by *data uploaded*, not by visit count. Ten visits with 2 KB is curiosity; one visit with 40 MB is an incident.",
          "Publish a sanctioned list. Detection without an alternative just drives usage to personal devices."
        ]},
        { t: "note", kind: "job", title: "what this looks like on a CV", text: "\"Built Shadow AI discovery using proxy/DNS and Entra audit logs; identified 43 unsanctioned AI SaaS tools across 900 users, quantified 12 GB/month of uploads, and produced a tiered response policy that cut high-risk uploads by 70%.\" Numbers, sources, outcome." }
      ],
      quiz: [
        { q: "What is the key trick that keeps Shadow AI alerts manageable?", options: ["Alerting on every visit", "First-seen detection per user and domain", "Blocking all AI domains", "Weekly reports only"], answer: 1, why: "First-seen produces one alert per user-domain pair, converting a flood into a queue." },
        { q: "Why are OAuth consent grants a serious AI risk?", options: ["They expire daily", "They can grant persistent read access to mail/files that survives password changes", "They slow the browser", "They require admin rights"], answer: 1, why: "Delegated grants are durable and often invisible to endpoint tooling, making them a preferred data-access path." },
        { q: "Which metric best prioritises Shadow AI cases?", options: ["Number of visits", "Bytes uploaded to unsanctioned services", "Number of domains", "Browser type"], answer: 1, why: "Data volume approximates exposure. Visits measure curiosity; uploads measure risk." }
      ]
    },
    {
      id: "m04-l5",
      title: "Lab P1: build the pipeline, then tune it like a professional",
      minutes: 30,
      tag: "lab",
      body: [
        { t: "note", kind: "lab", title: "lab p1 — detection pack", text: "Goal: a working end-to-end pipeline from a vulnerable bot to an alert in Kibana and an equivalent Splunk search, with measured precision on a labelled test set. This is the strongest artefact in the course." },
        { t: "h3", text: "Build order" },
        { t: "ol", items: [
          "**Generate telemetry.** Run `labs/toy-target` and the attack script in `labs/p1-injection-detection/attack.py`. It produces `requests.jsonl` containing benign traffic and labelled malicious traffic (`label: attack` or `benign`).",
          "**Ship to Elastic.** Use Filebeat or the Elastic Agent to tail the JSONL into `logs-ai.chat-default`. Verify the mapping — `prompt.text` must be `text`, not `keyword`, or your RLIKE will behave differently.",
          "**Implement three rules.** Canary-in-output, delimiter spoofing, and prompt→tool sequence. Put each in `labs/p1-injection-detection/elastic/` as a saved-object JSON file.",
          "**Add the Splunk equivalents** in `labs/p1-injection-detection/splunk/` — same logic, SPL syntax.",
          "**Build one dashboard**: alerts by rule, top users by token spend, unsanctioned AI domains, retrieval chunks flagged.",
          "**Measure.** Run `evaluate.py` to compute precision and recall against the labels. Record the numbers.",
          "**Write the tuning note** (500 words): what fired, what was noisy, what you suppressed and why, and what you would do with another week."
        ]},
        { t: "h3", text: "The evaluation table you must produce" },
        { t: "p", text: "Real numbers from the reference run (29 events: 12 benign, 17 attack, llama3.2:3b at temperature 0). Yours will differ — different model, different payloads — which is exactly why you measure." },
        { t: "table", head: ["Iteration", "TP", "FP", "FN", "Precision", "Recall"], rows: [
          ["run-1: R1+R2+R3 combined", "5", "0", "12", "1.00", "0.29"],
          ["run-2: + extraction-intent (R4) + poisoned-chunk (R5)", "12", "0", "5", "1.00", "0.71"]
        ]},
        { t: "p", text: "Read that honestly: 0.71 recall is **not** production-grade. It caught the canary leaks, the delimiter spoof and most extraction attempts, and missed subtle paraphrases. That is the real state of prompt-injection detection in 2026 — and saying so out loud is more credible than claiming a rule catches everything." },
        { t: "p", text: "Notice too that R3 (prompt→tool sequence) scored zero true positives: the model refused to emit the `FETCH(...)` call. A rule with no positive test cases is a rule you cannot claim works. Either engineer a test that triggers it, or mark it unvalidated in your writeup." },
        { t: "h3", text: "Then do the purple-team loop" },
        { t: "ul", items: [
          "Take the three payloads that your rules missed (the false negatives).",
          "For each, decide: is this a detection gap (write a rule) or a control gap (fix the app)? Be explicit — some misses should not be detected, they should be prevented.",
          "Add the payloads to the test set so the gap cannot regress.",
          "Re-run, publish the delta: recall 0.79 → 0.88, FP unchanged."
        ]},
        { t: "note", kind: "tip", title: "why this beats a certificate", text: "You will be able to say: 'I built a labelled corpus of 47 injection attempts and benign traffic, implemented three detections in Elastic and Splunk, measured 0.94 precision at 0.79 recall, then closed three gaps with a second iteration.' That is a mid-level detection engineer's answer, from a portfolio project." },
        { t: "h3", text: "Stretch goals, if the week goes well" },
        { t: "ol", items: [
          "Add a fourth rule: retrieval-content scanning with an instruction-verb lexicon.",
          "Add a per-session risk score to the dashboard.",
          "Add a SOAR playbook stub: on canary alert, disable the session token and notify the app owner.",
          "Publish the writeup as a blog post in the repo's `docs/` folder — it doubles as interview material."
        ]}
      ],
      quiz: [
        { q: "Why keep a labelled corpus of attacks and benign traffic?", options: ["To train the model", "To measure precision and recall and detect regressions when rules change", "Because Kibana requires it", "To satisfy GDPR"], answer: 1, why: "Without labels you cannot say whether a rule works or whether a change helped. It is the difference between a rule and a guess." },
        { q: "A payload is missed by all rules and could have caused a real action. What is the right conclusion?", options: ["Always write another rule", "Decide whether it is a detection gap or a control gap; some misses should be prevented architecturally", "Lower the threshold to zero", "Ignore it"], answer: 1, why: "Detection is not always the right layer. If the app should have blocked the action, the fix belongs there; detection covers what prevention cannot." },
        { q: "Which result is the strongest evidence your pipeline is production-worthy?", options: ["It runs", "Measured precision/recall on labelled data plus documented FP classes and tuning", "It uses Elastic", "It has a dashboard"], answer: 1, why: "Measured performance and tuning discipline are what distinguish engineering from a demo." }
      ]
    }
  ]
};
