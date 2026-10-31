CONTENT["m03"] = {
  id: "m03",
  num: "03",
  title: "Threat modelling AI systems",
  tag: "Design",
  hours: "4h",
  blurb: "MAESTRO and STRIDE applied to a real architecture, so you can walk into a design review and produce a threat table nobody argues with.",
  outcomes: [
    "Draw a data-flow diagram of an AI system with correct trust boundaries",
    "Apply MAESTRO's layers and STRIDE to produce concrete threats",
    "Score risks by likelihood and impact, and propose controls that map to them",
    "Deliver a one-page threat model as a review artefact"
  ],
  project: "A one-page threat model for the toy bot: diagram, ten threats, scoring, controls, owners.",
  lessons: [
    {
      id: "m03-l1",
      title: "MAESTRO and STRIDE: the two frameworks that get used",
      minutes: 15,
      tag: "frameworks",
      body: [
        { t: "p", text: "Classic threat modelling assumes a deterministic program. AI systems add moving parts — models, data pipelines, retrieval, agents, third-party providers — so the community extended the method. Two tools cover almost everything you will be asked to do." },
        { t: "h3", text: "STRIDE, refreshed for AI" },
        { t: "table", head: ["Threat", "Classic meaning", "AI-specific expression"], rows: [
          ["Spoofing", "Pretending to be another identity", "Prompt claims a role ('I am the admin'); forged tool results; impersonated model endpoint"],
          ["Tampering", "Modifying data or code", "Poisoned training data, poisoned index, tampered model artefact, edited system prompt at rest"],
          ["Repudiation", "Denying an action", "Agent took an action, but no per-user attribution in logs; shared service identity"],
          ["Information disclosure", "Data seen by the wrong party", "Cross-tenant retrieval, system prompt leakage, membership inference, secret in context"],
          ["Denial of service", "Availability loss", "Denial of wallet, context flooding, tool recursion, rate-limit exhaustion"],
          ["Elevation of privilege", "Gaining more rights", "Injection → tool call → action as a privileged agent; sandbox escape"]
        ]},
        { t: "p", text: "STRIDE is quick and works per component. Its weakness is that AI risk is often **emergent** — no single component is at fault, the composition is (the lethal trifecta). That is what MAESTRO is for." },
        { t: "h3", text: "MAESTRO: layer-by-layer for AI systems" },
        { t: "p", text: "MAESTRO (Cloud Security Alliance) models an AI system as layers, and asks threat questions at each. Exact layer names vary between write-ups; the useful structure is this:" },
        { t: "table", head: ["Layer", "What lives here", "Typical threat questions"], rows: [
          ["1. Business & goals", "Intended use, users, harm if wrong", "What is the worst plausible misuse? Who is harmed? Is this use lawful?"],
          ["2. AI model", "Base model, adapters, prompts, alignment", "Can it be jailbroken? Does it leak training data? Is the artefact verified?"],
          ["3. Data operations", "Ingestion, labelling, embeddings, index, retention", "Who can write? Is poisoned data detectable? Are deletions propagated?"],
          ["4. Application & infrastructure", "API, UI, tools, network, cloud", "Is output handled safely? Are tools least-privilege? Is the model host isolated?"],
          ["5. Security & compliance", "Identity, logging, DLP, policy", "Is every action attributable? Are prompts sensitive data? What evidence exists for audit?"],
          ["6. Agentic & orchestration", "Planner, memory, tool routing, multi-agent", "Can injection reach a tool? Is memory poisoned? Can agents escalate each other?"],
          ["7. Ecosystem", "Third-party models, plugins, supply chain, customers", "What does the vendor see? What happens if they are breached? Who is liable?"]
        ]},
        { t: "note", kind: "job", title: "why this matters at work", text: "Most engineers have never seen a threat model and will be impressed by a clean one. Use MAESTRO for coverage (so you do not forget the data layer) and STRIDE per component for specificity. Then hand over a table with owners — not a document with adjectives." },
        { t: "h3", text: "The four questions that actually drive the session" },
        { t: "ol", items: [
          "What are we building, and what does 'working' mean? (If nobody can say, stop.)",
          "What can go wrong, and who would bother? (Motivation filters noise.)",
          "What are we doing about each one? (Control, or accepted risk with a name against it.)",
          "How will we know it is still true next quarter? (Detection, test, or review date.)"
        ]},
        { t: "p", text: "That last question is where detection engineers earn their seat: a threat model without a monitoring story is a document that rots." }
      ],
      quiz: [
        { q: "Which STRIDE category best covers 'no per-user attribution for agent actions'?", options: ["Spoofing", "Repudiation", "Tampering", "Denial of service"], answer: 1, why: "Repudiation is about denying an action happened. Shared service identities destroy attribution." },
        { q: "What does MAESTRO add over plain STRIDE?", options: ["Faster scoring", "Layer-based coverage of AI-specific components like data operations and orchestration", "Legal compliance", "Automated scanning"], answer: 1, why: "Its value is structural coverage across the AI stack, including layers STRIDE has no vocabulary for." },
        { q: "A threat model lists risks but no owners or review dates. What is missing?", options: ["Severity scores", "The operational loop: accountability and re-validation", "A diagram", "A CVE reference"], answer: 1, why: "Without an owner and a re-check, the model is stale on arrival and nobody is accountable for the control." }
      ]
    },
    {
      id: "m03-l2",
      title: "Trust boundaries, data flows, and the AI asset inventory",
      minutes: 14,
      tag: "method",
      body: [
        { t: "p", text: "A threat model without a diagram is an opinion. The diagram's job is to show **where trust changes** — every crossing is a place to attack." },
        { t: "h3", text: "Draw these five things" },
        { t: "ol", items: [
          "**External actors** — anonymous user, authenticated user, admin, third-party API, attacker-controlled content source",
          "**Processes** — UI, API, orchestrator, model endpoint, tool runtime, indexer",
          "**Data stores** — vector DB, object storage, conversation history, model registry, prompt store",
          "**Flows** — arrows with the data type on them (prompt, document, embedding, tool result, credential)",
          "**Trust boundaries** — dashed lines wherever the identity or privilege level changes"
        ]},
        { t: "code", lang: "text", text: `  internet                DMZ                    private subnet
 ┌──────────┐      ┌──────────────┐      ┌─────────────────────────┐
 │  user    │─────►│  web / API   │─────►│  orchestrator           │
 │ browser  │      │  (authN)     │      │  prompt assembly        │
 └──────────┘      └──────────────┘      │        │                │
        ▲                                  │        ▼                │
        │  markdown render                 │  model endpoint         │
        │  (remote images!)                │  (no egress)            │
        │                                  │        │                │
 ┌──────┴───────┐   untrusted docs   ┌─────▼────────▼─────┐  ┌───────▼──────┐
 │  attacker    │──────────────────► │  vector index      │  │ tool runtime │
 │  web page    │   (indirect inj)   │  (shared tenant?)  │  │ (creds!)     │
 └──────────────┘                    └────────────────────┘  └──────┬───────┘
                                                                    │
                                                             ┌──────▼───────┐
                                                             │ external API │
                                                             └──────────────┘` },
        { t: "p", text: "Now read the crossings out loud. Every arrow that carries attacker-influenced text into a component that can act is a candidate finding. In the diagram above: the untrusted-docs arrow crosses into the index (integrity), the index crosses into prompt assembly (injection), tool runtime holds credentials (privilege), and the browser fetches images (egress). Four findings in one picture." },
        { t: "h3", text: "The asset inventory question everyone forgets" },
        { t: "p", text: "You cannot protect AI you do not know exists. Before threat modelling anything, list:" },
        { t: "ul", items: [
          "Every model in use: provider, version, hosting (vendor API vs self-hosted), data retention terms",
          "Every prompt and system message stored in code or config — these are source artefacts and should be reviewed like code",
          "Every dataset used for fine-tuning or evaluation, with its provenance and lawful basis",
          "Every vector index, its source documents, its ACL model, and its retention policy",
          "Every tool/plugin and the credential it uses",
          "Every integration that sends data to a third party (including 'free' AI browser extensions)"
        ]},
        { t: "note", kind: "warn", title: "shadow AI is the norm, not the exception", text: "In most enterprises, the AI inventory is 3–10x larger than the official list. Module 04 gives you the detection approach: proxy logs, DNS, OAuth grants to AI SaaS, and browser extension inventory." },
        { t: "h3", text: "A useful habit: model the attacker's easiest path" },
        { t: "p", text: "After the full model, write one paragraph: 'The cheapest path to impact is X, because Y is unowned.' In the diagram above it is almost certainly the document ingestion path — anyone with write access to a shared drive can plant an instruction. Saying that out loud in a review is what gets you invited back." }
      ],
      quiz: [
        { q: "What is the primary purpose of a data-flow diagram in threat modelling?", options: ["Documentation for auditors", "Making trust boundaries explicit so crossings can be attacked", "Estimating cost", "Showing the UI"], answer: 1, why: "Every trust-boundary crossing is a candidate attack surface. The diagram exists to expose them." },
        { q: "Which asset is most often missing from AI inventories?", options: ["The base model", "Prompts and system messages stored in config", "The cloud account", "The website"], answer: 1, why: "Prompts are code-like artefacts holding business logic and sometimes secrets, yet they rarely appear in inventories or reviews." },
        { q: "In the diagram, why is document ingestion usually the cheapest attack path?", options: ["It is unencrypted", "Many people can write documents, and the index has no trust concept", "It uses HTTP", "It is slower"], answer: 1, why: "Broad write access plus similarity-only retrieval means a cheap, low-privilege action influences model behaviour for everyone." }
      ]
    },
    {
      id: "m03-l3",
      title: "Lab: threat-model the toy bot, end to end",
      minutes: 25,
      tag: "lab",
      body: [
        { t: "note", kind: "lab", title: "lab 3 — one page, ten threats", text: "Goal: a single-page threat model you could hand to an engineering team. Use the template below. Time: 45–60 minutes. This becomes portfolio artefact #2." },
        { t: "h3", text: "Template" },
        { t: "code", lang: "markdown", text: `# Threat model — Support Assistant v0.1
Author / date / version:
Scope: what is in, what is explicitly out.

## 1. System
One paragraph + DFD (ASCII is fine) + trust boundaries numbered T1..Tn.

## 2. Assets
| Asset | Why it matters | Where it lives |

## 3. Threats
| # | Layer | STRIDE | Threat | Path (T#) | L | I | Score | Control | Owner |
L and I on 1-5; Score = L x I.

## 4. Top 3 by score
Two sentences each: why it is realistic, what the cheapest mitigation is.

## 5. Detection
For each top threat: what telemetry would show it, and what rule would fire.

## 6. Accepted risks
Risk, why accepted, who accepted it, review date.` },
        { t: "h3", text: "Worked example — three of the ten rows" },
        { t: "table", head: ["#", "Threat", "L", "I", "Score", "Control", "Owner"], rows: [
          ["1", "Indirect injection via shared docs folder steers answers (LLM01)", "5", "4", "20", "Restrict index writes to reviewed sources; delimit retrieved text; alert on instruction-like content", "Platform"],
          ["2", "Cross-tenant retrieval returns another customer's chunks (LLM08/02)", "3", "5", "15", "Tenant filter enforced in the query, not post-retrieval; per-tenant collections; retrieval tests in CI", "Data"],
          ["3", "Markdown image exfiltrates conversation content (LLM05)", "4", "3", "12", "CSP img-src self; rewrite remote images through a proxy; strip HTML in renderer", "Frontend"]
        ]},
        { t: "p", text: "Fill the remaining seven yourself, covering at least: system prompt leakage, secret in context, tool over-permission, shared service identity (repudiation), denial of wallet, model artefact integrity, and prompt/response log retention (compliance)." },
        { t: "h3", text: "Scoring without pretending to be precise" },
        { t: "p", text: "Use 1–5 for likelihood and impact, multiply, and resist false precision. The point of scoring is ordering, not measurement. What matters more is that each row names a **control** and an **owner**, and that the top three have a **detection**." },
        { t: "note", kind: "tip", title: "the reviewer's test", text: "Hand your model to someone technical and ask: 'Which row would you argue with?' If they can only argue with scores, your threats are solid. If they argue with the threats, you missed their mental model — add it." },
        { t: "h3", text: "Make it public" },
        { t: "p", text: "Commit it as `labs/p1-injection-detection/threat-model.md` or `portfolio/threat-model-support-bot.md`. In an interview, walk one row end to end: threat, path, control, and how you would detect it failing. That four-part structure is the whole job in miniature." }
      ],
      quiz: [
        { q: "What makes a threat-model row actionable?", options: ["A high score", "A named control and a named owner", "A CVE", "A diagram"], answer: 1, why: "Without an owner and a concrete control, the row is a statement of anxiety rather than a plan." },
        { q: "Why include a detection section in a threat model?", options: ["To satisfy auditors", "A control you cannot observe failing is not verifiable", "Detections replace controls", "To fill space"], answer: 1, why: "Detection is how you know the control still holds. It also connects design work to the SOC." },
        { q: "Ten rows, top three scored 20, 15, 12. What should you do first?", options: ["Implement all ten equally", "Mitigate the 20, and add a detection for it while the fix is pending", "Rewrite the model", "Accept all three"], answer: 1, why: "Order by risk, but pair the top risk with monitoring so you have coverage during remediation." }
      ]
    }
  ]
};
