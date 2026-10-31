CONTENT["m00"] = {
  id: "m00",
  num: "00",
  title: "Orientation: the AI security job map",
  tag: "Start here",
  hours: "1.5h",
  blurb: "Six different jobs get advertised as 'AI security'. Pick one, learn what it screens for, and leave with a 90-day plan.",
  outcomes: [
    "Name the six AI-security job families and what each one actually does all day",
    "Match your existing SOC/infra background to the shortest path into the field",
    "Leave with a dated 13-week plan and the four portfolio artefacts you will build"
  ],
  project: "A written target: role, salary band, three companies, and a 13-week plan saved as a note you review weekly.",
  lessons: [
    {
      id: "m00-l1",
      title: "The six jobs hiding behind 'AI security'",
      minutes: 14,
      tag: "orientation",
      body: [
        { t: "p", text: "Recruiters throw 'AI security' at six genuinely different jobs. The work, the interview and the pay all differ. Pick a primary lane now and a secondary lane; you will study the same fundamentals either way, but the labs and the resume bullets diverge." },
        { t: "table", head: ["Role", "What the day actually looks like", "What they screen for"], rows: [
          ["AI Security Engineer", "Reviews LLM app designs, builds guardrails, does authz for tools, fixes OWASP LLM issues in code", "AppSec fundamentals, secure design, Python, OWASP LLM Top 10, threat modelling"],
          ["MLSecOps Engineer", "Secures the model pipeline: artifact scanning, CI gates, registries, secrets, provenance, SBOM", "CI/CD, containers, supply chain, Python, cloud IAM"],
          ["AI Detection / AI SOC Engineer", "Writes detections for prompt injection, Shadow AI and model abuse; tunes SIEM; runs purple-team loops", "SIEM query languages, log pipelines, detection-as-code, false-positive discipline"],
          ["AI Red Teamer", "Attacks LLM apps and agents, builds harnesses, writes findings up for engineers", "Offensive mindset, scripting, reporting, prompt injection depth, agent exploitation"],
          ["AI Governance / GRC", "AI inventory, risk registers, NIST AI RMF / ISO 42001 mapping, vendor reviews, audit evidence", "Frameworks, writing, stakeholder management, policy"],
          ["AI Platform / Cloud AI Security", "Secures Azure OpenAI, Bedrock, Vertex, M365 Copilot; network isolation, key management, tenant config", "Cloud architecture, IAM, networking, one cloud deeply"]
        ]},
        { t: "p", text: "**Read that table against your own lab.** You have built ELK, Fleet and Splunk, run Kali, and written up a SOC build report. That maps almost perfectly onto the detection lane, and gives you credible stories for the red-team lane. MLSecOps needs the most new skill (CI/CD and packaging) but has the most open roles. Governance needs the least technical ramp and has the most competition from non-technical candidates." },
        { t: "note", kind: "job", title: "why this matters at work", text: "Job postings conflate these six. If you cannot tell which one you are interviewing for, you will prepare for the wrong interview. Ask the recruiter: \"Is this role closer to AppSec review, SOC detection, or platform engineering?\" Their answer tells you what to revise." },
        { t: "h3", text: "The blunt hiring reality" },
        { t: "ul", items: [
          "Almost nobody hires a pure 'AI security' junior. They hire security people who can demonstrate AI-specific work.",
          "Your security fundamentals are the moat. Most candidates for these roles can prompt a model but cannot read a packet capture, write a detection rule, or explain a trust boundary.",
          "The differentiator is **artefacts**, not certificates: a detection pipeline with tuning notes, a hardened ML repo, a risk register, an attack report with reproducible steps.",
          "Job titles lag the work. Many 'AI Security Engineer' roles are 70% ordinary AppSec with an LLM feature on top. That is good news — you can do 70% of the job on day one."
        ]},
        { t: "h3", text: "Where the demand actually is" },
        { t: "p", text: "Three demand pools, in rough order of volume: (1) enterprises deploying Copilot/M365 and internal RAG chat, needing governance and Shadow-AI control; (2) product companies shipping LLM features, needing AppSec and red team; (3) AI-native vendors and model providers, needing platform and supply-chain security. Pool 1 is the easiest door for someone with SOC experience: the work is detection plus policy plus vendor review." },
        { t: "note", kind: "tip", title: "pick now", text: "Write one sentence: \"I am targeting [role] at [company type], and my proof will be [artefact].\" Example: \"I am targeting AI detection engineering at a mid-size enterprise, and my proof will be an ELK pipeline that detects indirect prompt injection in a RAG bot.\" Everything in this course can then be filtered through that sentence." }
      ],
      quiz: [
        { q: "Which role is the shortest hop from a SOC analyst background?", options: ["AI Governance", "AI Detection / AI SOC Engineer", "MLSecOps", "AI Platform Architect"], answer: 1, why: "The detection lane reuses SIEM, log pipeline and tuning skills you already have; the new part is AI-specific telemetry and attack patterns." },
        { q: "What do AI security employers weight most heavily?", options: ["Certificates", "Years of ML research", "Demonstrable artefacts and security fundamentals", "Prompt engineering courses"], answer: 2, why: "Artefacts plus fundamentals beat certificates repeatedly. A tuned detection pipeline or a hardened model repo is evidence you can do the work." },
        { q: "Which statement about 'AI Security Engineer' titles is most accurate?", options: ["They are all ML research roles", "Many are ordinary AppSec roles with LLM features added", "They never involve coding", "They require a PhD"], answer: 1, why: "Titles lag reality. A large share of these roles is standard secure-design and code review work applied to an application that happens to call a model." }
      ]
    },
    {
      id: "m00-l2",
      title: "Your 13-week plan, and how to use this site",
      minutes: 12,
      tag: "planning",
      body: [
        { t: "p", text: "The plan is deliberately output-first: every module ends in something you can show, not something you can recall. Thirteen weeks, roughly 8–10 hours a week, one module per week with two buffer weeks." },
        { t: "table", head: ["Weeks", "Module", "Artefact you end with"], rows: [
          ["1", "00 Orientation", "Target role sentence + 13-week calendar"],
          ["2", "01 LLM internals", "Notes + local model running"],
          ["3", "02 Failure modes", "Attack log: 5 reproduced issues with payloads"],
          ["4", "03 Threat modelling", "Threat model diagram + 10-row risk table"],
          ["5–6", "04 Detection engineering", "P1: ELK/Splunk detection pipeline + tuning writeup"],
          ["7", "05 Guardrails", "Hardened toy bot, before/after attack results"],
          ["8–9", "06 MLSecOps", "P2: CI repo with model scanning gate"],
          ["10", "07 Cloud AI", "Audit checklist applied to a trial tenant"],
          ["11", "08 Adversarial ML", "Short lab note on membership inference"],
          ["12", "09 Agentic + MCP", "Agent attack chain writeup"],
          ["13", "10 Governance", "P3: AI inventory + risk register + RMF mapping"],
          ["buffer", "11 Career", "P4: Shadow AI report, resume, 2 mock interviews"]
        ]},
        { t: "h3", text: "The weekly rhythm" },
        { t: "ol", items: [
          "**Read** the module's lessons in one sitting (60–90 min). Do not take notes yet.",
          "**Do** the lab the same week. Labs are where the interview stories come from.",
          "**Write** 200 words in your own repo: what you did, what broke, what you would tell an engineer. Commit it.",
          "**Quiz** at the end of each lesson. Anything you miss, re-read that section before the next module.",
          "**Push** the week's work to GitHub. The commit history is a public record of consistent effort."
        ]},
        { t: "note", kind: "warn", title: "the trap", text: "Watching AI-security content feels like progress and is not. If a week goes by with no artefact, you have not learned the week. The labs are the course; the reading exists to make the labs legible." },
        { t: "h3", text: "How to use the site" },
        { t: "ul", items: [
          "Press `/` to search across every lesson — use it when an interview question stumps you.",
          "Progress is stored in your browser (localStorage). It is per-browser, not per-account. Exporting is not needed; the real record is your repo.",
          "Every lesson ends with three questions. Answering all of them marks the lesson complete and saves your score.",
          "Modules 00–04 are complete now. 05–11 open one per week — each currently has a map lesson so you can see what is coming."
        ]},
        { t: "h3", text: "The 20% that carries 80% of interviews" },
        { t: "p", text: "If you only had ten hours before an interview, spend them here: the lethal trifecta (module 02), indirect prompt injection via retrieved documents (02), why output filtering is not a fix (02/05), the difference between RAG and fine-tuning and why it matters for data exposure (01), how you would detect an injection attempt from logs (04), and the NIST AI RMF's four functions: govern, map, measure, manage (10)." }
      ],
      quiz: [
        { q: "What is the primary output of each module?", options: ["Flashcards", "A written artefact or lab result", "A certificate", "A reading summary"], answer: 1, why: "Output-first: each module ends in something demonstrable, because artefacts are what get you interviews." },
        { q: "A week passes and you read two modules but built nothing. What is the correct read?", options: ["Ahead of schedule", "Neutral — reading counts", "Behind: no artefact means the week did not land", "Time to change roles"], answer: 2, why: "Reading without a lab produces recall, not capability. The plan treats artefact-free weeks as missed weeks." },
        { q: "Where is your real learning record kept?", options: ["Browser localStorage", "The GitHub commit history and lab writeups", "The quiz score", "This site's database"], answer: 1, why: "Progress in the browser is only a convenience. The durable, shareable, interview-usable record is your repo history and writeups." }
      ]
    },
    {
      id: "m00-l3",
      title: "Certificates, pay bands, and honest expectations",
      minutes: 11,
      tag: "career",
      body: [
        { t: "p", text: "There is no certificate that proves AI security competence yet. That is both a problem and an opening: the field still rewards demonstrated work over paper. Here is the honest landscape as of 2026." },
        { t: "table", head: ["Credential", "Cost (rough)", "Worth it if…"], rows: [
          ["(ISC)² CC", "low", "You already have it — it clears HR filters for entry-level security"],
          ["CISSP / CCSP", "high", "You are going for governance, architecture or enterprise roles; it is a filter, not a skill"],
          ["IAPP AIGP", "medium", "You are targeting AI governance — the most recognised AI-specific credential right now"],
          ["ISO/IEC 42001 Lead Auditor", "medium–high", "You want to run or audit AI management systems; strong for GRC consulting"],
          ["Azure AI-102 / SC-100", "medium", "Your target employer is Microsoft-heavy (very common with M365 Copilot)"],
          ["AWS Certified AI Practitioner", "low–medium", "Foundational cloud-AI vocabulary; cheap credibility for MLSecOps roles"],
          ["SANS AI/ML security courses", "very high", "An employer is paying. Rarely worth self-funding early"]
        ]},
        { t: "note", kind: "warn", title: "certificate trap", text: "Do not spend the first three months collecting AI certificates. No hiring manager has ever been persuaded by an AI certificate alone. One finished detection pipeline outweighs four badges." },
        { t: "h3", text: "Pay, with heavy caveats" },
        { t: "p", text: "Ranges below are broad 2026 figures for full-time roles, USD, total compensation, and they swing wildly by city, company size and remote policy. Treat them as orientation, not negotiation data. Get local numbers from Levels.fyi, Glassdoor and your own network before quoting anything." },
        { t: "table", head: ["Role", "US (mid → senior)", "UK", "India"], rows: [
          ["AI Detection / SOC Engineer", "110–160k → 150–200k", "£55–80k", "₹15–30 LPA"],
          ["AI Security Engineer", "130–190k → 180–260k", "£65–100k", "₹20–45 LPA"],
          ["MLSecOps Engineer", "140–200k → 190–270k", "£70–105k", "₹22–48 LPA"],
          ["AI Red Teamer", "150–220k → 200–300k", "£75–120k", "₹25–55 LPA"],
          ["AI Governance / GRC", "110–170k → 150–220k", "£60–95k", "₹18–40 LPA"]
        ]},
        { t: "p", text: "The premium comes from scarcity, and scarcity is uneven: pure research-facing AI security pays most but hires few; enterprise AI governance and detection hire constantly at solid-but-not-extraordinary rates." },
        { t: "h3", text: "What realistic progress looks like" },
        { t: "ul", items: [
          "**Weeks 1–4:** you can explain LLM failure modes and threat-model a simple app. You are not yet employable in the lane.",
          "**Weeks 5–9:** you have one artefact that survives scrutiny — a detection pipeline, a hardened repo. Now you can start applying to detection/MLSecOps roles.",
          "**Weeks 10–13:** three artefacts, a written report, and rehearsed answers. This is the realistic point where interview conversion begins.",
          "**Months 4–6:** expect 30–80 applications for a first AI-security role, and a lateral move inside your current employer is statistically the fastest route."
        ]},
        { t: "note", kind: "job", title: "the internal move", text: "The highest-probability path is not a cold application. It is: find the team at your current employer shipping an LLM feature or rolling out Copilot, offer a free threat model or a detection rule, and convert that into a role. You already have context and trust; external candidates have neither." },
        { t: "h3", text: "Set your baseline this week" },
        { t: "ol", items: [
          "Write the target sentence from lesson 1 and put it somewhere visible.",
          "Pick three companies you would actually work for in that lane and note one AI product each ships.",
          "Block two 90-minute sessions per week in your calendar. Name them 'lab'.",
          "Create the GitHub repo you will push to (or use the one this site lives in).",
          "Bookmark your module 04 lab; it is the one that produces the strongest interview story."
        ]}
      ],
      quiz: [
        { q: "Which credential is most directly relevant to an AI governance target?", options: ["OSCP", "IAPP AIGP", "CCNA", "Azure AI-102"], answer: 1, why: "AIGP is the recognised AI-governance credential; AI-102 is an Azure AI engineering cert, useful but not governance-focused." },
        { q: "When should you start applying for AI security roles?", options: ["Immediately, before any artefact", "After at least one artefact survives technical scrutiny", "Only after CISSP", "After two years of ML study"], answer: 1, why: "One credible artefact plus fundamentals is the practical threshold; without it, applications convert poorly." },
        { q: "Statistically, what is the fastest route into the field?", options: ["Cold applications at scale", "A lateral move inside your current employer", "A master's degree", "Bug bounty fame"], answer: 1, why: "Internal moves leverage existing trust and context, and the team already knows your work. Cold applications have far lower conversion." }
      ]
    }
  ]
};
