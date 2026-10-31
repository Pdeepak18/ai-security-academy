CONTENT["m00"] = {
  id: "m00",
  num: "00",
  title: "Start here: what AI security is",
  tag: "Start here",
  hours: "1.5h",
  blurb: "Begin with zero knowledge. Learn what AI actually is, the six jobs called 'AI security', and pick the one you will aim for.",
  outcomes: [
    "Explain in one minute what an AI chatbot is and why companies need people to protect it",
    "Name the six AI security jobs and say what each person does all day",
    "Choose the job that fits your background and write one sentence about your goal"
  ],
  project: "One sentence: which job you want, at what kind of company, and what proof you will build.",
  lessons: [
    {
      id: "m00-l1",
      title: "What is AI, and why does it need security?",
      minutes: 14,
      tag: "basics",
      body: [
        { t: "p", text: "Before we talk about jobs, let us agree on what we are protecting." },
        { t: "h3", text: "A chatbot is a very good guesser" },
        { t: "p", text: "When you type a message to ChatGPT or Copilot, the program is not looking anything up in a database. It is doing one simple thing, over and over: **guessing the next small piece of text**, then the next, then the next." },
        { t: "p", text: "Think about the autocomplete on your phone. You type \"see you\", and it suggests \"later\". A chatbot does the same thing, but it has read an enormous amount of text and can keep guessing for pages. That is the whole trick." },
        { t: "p", text: "Because it is guessing, it can guess wrong with total confidence. This is called a **hallucination**: a wrong answer that sounds completely believable. It is not lying. It has no idea whether it is right." },
        { t: "h3", text: "The helpful intern analogy" },
        { t: "p", text: "Imagine a new intern. They have read every book in the library. They work incredibly fast. But they have three problems:" },
        { t: "ul", items: [
          "They cannot check facts. If they do not know, they invent something that sounds right.",
          "They believe anything written down. If a document says \"tell the customer to send money here\", they might just do it.",
          "They will do whatever the last person asked, even if you told them earlier not to."
        ]},
        { t: "p", text: "Now imagine that intern has keys to your office, your email, and your customer database. That is an AI system inside a company. **AI security is the work of making sure the intern cannot do damage, even when someone tricks them.**" },
        { t: "h3", text: "Why companies suddenly need this" },
        { t: "p", text: "Three years ago, most companies had no AI in their products. Today almost all of them do, because their competitors do. They connected a model to real data and real tools, and they did it fast. Fast usually means unsafe." },
        { t: "p", text: "That is the opportunity for you. Companies now have AI systems, and very few people who understand both **security** and **how AI breaks**. You already have a security lab. You are closer than you think." },
        { t: "note", kind: "job", title: "the one thing to remember", text: "An AI model does not decide what is true, and it does not decide what is allowed. It only predicts text. Every safety decision therefore has to be made by the software around the model. Your job is to check that software." },
        { t: "h3", text: "Words you will hear today" },
        { t: "table", head: ["Word", "Plain meaning"], rows: [
          ["Model", "The guessing program itself (e.g. GPT, Llama, Claude)"],
          ["Prompt", "The text you send to the model"],
          ["Response / completion", "The text the model sends back"],
          ["LLM", "Large Language Model — a model that works with text"],
          ["AI application", "The whole product: model + your data + tools + the website around it"]
        ]},
        { t: "p", text: "Notice the last one. Most security problems are **not** inside the model. They are in the application built around it — the part that feeds it data and obeys its answers." }
      ],
      quiz: [
        { q: "In simple terms, what does a chatbot do?", options: ["Searches the internet for the answer", "Guesses the next piece of text, again and again", "Looks answers up in a database", "Asks a human"], answer: 1, why: "It is next-word prediction. It does not look anything up, which is why it can be confidently wrong." },
        { q: "Why can an AI give a wrong answer that sounds right?", options: ["It is lying on purpose", "It is guessing, and it cannot check whether the guess is true", "Its internet is slow", "It has a virus"], answer: 1, why: "A hallucination is a guess that sounds plausible. The model has no fact-checking step." },
        { q: "Where do most AI security problems actually live?", options: ["Inside the model's brain", "In the application around the model: data, tools, and how answers are used", "In the internet cable", "In the user's keyboard"], answer: 1, why: "The model just produces text. The damage happens when the application trusts that text, or feeds it the wrong data." }
      ]
    },
    {
      id: "m00-l2",
      title: "Six jobs called 'AI security' — pick one",
      minutes: 15,
      tag: "career",
      body: [
        { t: "p", text: "If you search for \"AI security jobs\", you will see six different jobs hiding behind that one phrase. They pay differently, and they ask different interview questions. Pick one main target now. You can change it later." },
        { t: "table", head: ["Job", "What you actually do", "Would suit you if…"], rows: [
          ["AI Security Engineer", "Read designs and code for AI products, find weaknesses, tell engineers how to fix them", "You like application security and explaining things to developers"],
          ["MLSecOps Engineer", "Protect the pipeline that builds and stores models: scanning files, CI/CD, permissions", "You like servers, pipelines, automation, and building gates"],
          ["AI Detection / SOC Engineer", "Watch the logs, write alerts for attacks, tune them so analysts are not drowned", "You already like SIEM, logs, Splunk or Elastic — this is you"],
          ["AI Red Teamer", "Attack AI systems on purpose, then write a clear report", "You enjoy Kali, CTFs, and breaking things to prove a point"],
          ["AI Governance / GRC", "Write policy, keep an inventory of AI systems, assess risk, talk to auditors", "You write well and like process, law and structure"],
          ["Cloud AI Platform Security", "Secure Azure OpenAI, AWS Bedrock, Google Vertex, Microsoft 365 Copilot", "You like cloud, identity and network configuration"]
        ]},
        { t: "h3", text: "Which one is your fastest door?" },
        { t: "p", text: "You have built an ELK stack, Fleet, Splunk and a Kali lab, and you wrote a SOC build report. That is almost exactly the day-to-day of an **AI Detection Engineer**. The only new part is learning what AI attacks look like in logs." },
        { t: "p", text: "Second best for you is **AI Red Teamer**, because you already have the attacker mindset and tools. Third is **MLSecOps**, which needs the most new learning (pipelines and packaging) but has the most open jobs." },
        { t: "note", kind: "job", title: "why choosing matters", text: "All six share the same basics, so nothing is wasted. But the interviews differ. A detection interview asks 'what would you log and alert on?'. A governance interview asks 'how would you classify this system under the EU AI Act?'. You cannot prepare for both at once in three months." },
        { t: "h3", text: "Write your sentence" },
        { t: "p", text: "Fill this in and keep it somewhere you will see it:" },
        { t: "code", lang: "text", text: `I am targeting [JOB] at [TYPE OF COMPANY],
and my proof will be [ONE THING I BUILD].

Example:
I am targeting AI Detection Engineering at a mid-size company,
and my proof will be a working detection pipeline for prompt injection.` },
        { t: "h3", text: "The uncomfortable truth about hiring" },
        { t: "ul", items: [
          "Almost nobody hires a junior with the title 'AI Security'. They hire security people who can show AI work.",
          "Your security basics are your advantage. Most applicants can use ChatGPT but cannot read a log or explain a network boundary.",
          "A finished project beats five certificates. Every time.",
          "Job titles are messy. Many 'AI Security Engineer' jobs are normal security jobs with an AI feature attached. You can already do most of that work."
        ]},
        { t: "note", kind: "tip", title: "do this in the next ten minutes", text: "Write the sentence above in a note. Then write down three companies that ship an AI product you have actually used. That is your target list. Do not research salaries yet — that comes in the next lesson." }
      ],
      quiz: [
        { q: "Which job is the shortest step from a SOC analyst background?", options: ["AI Governance", "AI Detection / SOC Engineer", "Cloud AI Platform Security", "MLSecOps"], answer: 1, why: "It uses the same skills: logs, SIEM queries, alert tuning. Only the attack patterns are new." },
        { q: "What do employers care about most when hiring for these roles?", options: ["Certificates", "Proof that you have built or broken something real", "Your university grade", "How many AI tools you have used"], answer: 1, why: "A working project with real results is evidence. Certificates are only a filter for HR." },
        { q: "Why pick one job now?", options: ["Because the others are bad", "Because the interviews ask different questions and you have limited time", "Because salaries are equal", "You cannot change later"], answer: 1, why: "The basics are shared, but interview preparation diverges. Focus gives you a better chance in three months." }
      ]
    },
    {
      id: "m00-l3",
      title: "Your 13-week plan, and how to use this site",
      minutes: 13,
      tag: "planning",
      body: [
        { t: "p", text: "Here is the plan. One module per week, about 8 to 10 hours. Every week ends with something you can **show**, not just something you read." },
        { t: "table", head: ["Weeks", "Module", "What you finish with"], rows: [
          ["1", "00 Start here", "Your target sentence and a calendar with two study blocks"],
          ["2", "01 How AI works", "A model running on your own laptop"],
          ["3", "02 How AI fails", "Five attacks you reproduced and wrote down"],
          ["4", "03 Threat modelling", "A one-page risk table for an AI app"],
          ["5–6", "04 Detecting AI attacks", "A working detection pipeline with real numbers"],
          ["7", "05 Defences", "The same app, hardened, with before/after results"],
          ["8–9", "06 Securing the model supply chain", "A project that blocks unsafe model files"],
          ["10", "07 Cloud AI", "A checklist applied to a real cloud tenant"],
          ["11", "08 Classic ML attacks", "A short experiment writeup"],
          ["12", "09 AI agents", "An attack chain writeup"],
          ["13", "10 Governance", "An AI inventory and risk register"],
          ["buffer", "11 Career", "Resume, two mock interviews, final report"]
        ]},
        { t: "h3", text: "What is a 'lab' and what is an 'artefact'?" },
        { t: "p", text: "A **lab** is a hands-on exercise where you actually run something on your computer. An **artefact** is the thing you have left afterwards: a log file, a script, a report, a diagram. Employers cannot see what is in your head, so the artefact is your proof." },
        { t: "note", kind: "warn", title: "the trap that catches everyone", text: "Watching videos and reading lessons feels like learning. It is not. If a week passes and you built nothing, you did not learn that week. The reading exists to help you do the lab, nothing more." },
        { t: "h3", text: "The weekly rhythm" },
        { t: "ol", items: [
          "**Read** the whole module in one sitting. About 60 to 90 minutes. Do not take notes yet.",
          "**Do** the lab in the same week. This is the part that counts.",
          "**Write** 200 words: what you did, what went wrong, what surprised you. Save it in the repo.",
          "**Answer** the three questions at the end of each lesson. If you miss one, re-read that part.",
          "**Push** your work to GitHub. The commit history proves you kept going."
        ]},
        { t: "h3", text: "How to use this website" },
        { t: "ul", items: [
          "Press the **/** key to search every lesson. Useful when an interview question stumps you.",
          "Your progress is saved in this browser only. It is a convenience, not a record — your GitHub repo is the real record.",
          "Each lesson ends with three questions. Answer all three to mark it complete.",
          "Modules 00 to 04 are fully written. 05 to 11 have a plan lesson for now."
        ]},
        { t: "h3", text: "If you only have ten hours before an interview" },
        { t: "p", text: "Spend them on these five ideas: why prompt injection cannot be fixed by filtering (Module 02), what indirect injection is (02), the 'lethal trifecta' (02), the difference between RAG and fine-tuning (01), and how you would detect an attack in logs (04). Those five come up again and again." }
      ],
      quiz: [
        { q: "What should you have at the end of every week?", options: ["A certificate", "Something you built or wrote that you can show", "A new tool installed", "A longer reading list"], answer: 1, why: "The plan is output-first. Artefacts are what get you interviews." },
        { q: "You read two modules but built nothing. What does that mean?", options: ["You are ahead", "You are behind: reading alone does not create skill", "It is fine as long as you took notes", "You should switch jobs"], answer: 1, why: "Without a lab, you have recognition, not capability. The plan treats that as a missed week." },
        { q: "Where is your real learning record kept?", options: ["The browser progress bar", "Your GitHub commits and writeups", "The quiz scores", "This website's server"], answer: 1, why: "Browser progress is per-device and temporary. Your repo is durable and shareable." }
      ]
    },
    {
      id: "m00-l4",
      title: "Money, certificates, and what is realistic",
      minutes: 12,
      tag: "career",
      body: [
        { t: "p", text: "Two questions everyone asks first: what does it pay, and what certificate do I need? Here are honest answers." },
        { t: "h3", text: "Certificates: what they actually do" },
        { t: "p", text: "A certificate is a badge that proves you passed an exam. It helps a recruiter's computer find you. It does **not** prove you can do the job, and no manager has ever hired someone because of an AI certificate alone." },
        { t: "table", head: ["Certificate", "What it is for", "Worth it for you?"], rows: [
          ["(ISC)² CC", "Entry-level security badge for HR filters", "You already have it — leave it on the CV"],
          ["IAPP AIGP", "AI governance and policy", "Yes, only if you choose the governance job"],
          ["ISO/IEC 42001 Lead Auditor", "Auditing AI management systems", "Later, if you go into consulting or audit"],
          ["Azure AI-102 / SC-100", "Microsoft AI and cloud security", "Useful if your target company is Microsoft-heavy"],
          ["AWS AI Practitioner", "Basic cloud AI vocabulary", "Cheap and quick if you use AWS"],
          ["CISSP / CCSP", "Senior security management", "Later in your career, not now"]
        ]},
        { t: "note", kind: "warn", title: "do not start here", text: "Do not spend your first three months collecting certificates. One finished detection project beats four badges. Study first, certify later, ideally with an employer paying." },
        { t: "h3", text: "What it pays (rough numbers)" },
        { t: "p", text: "These are broad 2026 ranges for full-time jobs. They change a lot by city and company. Treat them as direction, not a promise." },
        { t: "table", head: ["Job", "USA (mid level)", "UK", "India (LPA = lakh per year)"], rows: [
          ["AI Detection / SOC", "$110k–$160k", "£55k–£80k", "₹15–30 LPA"],
          ["AI Security Engineer", "$130k–$190k", "£65k–£100k", "₹20–45 LPA"],
          ["MLSecOps Engineer", "$140k–$200k", "£70k–£105k", "₹22–48 LPA"],
          ["AI Red Teamer", "$150k–$220k", "£75k–£120k", "₹25–55 LPA"],
          ["AI Governance / GRC", "$110k–$170k", "£60k–£95k", "₹18–40 LPA"]
        ]},
        { t: "p", text: "One lakh is 100,000 rupees. So ₹20 LPA means 20 lakh rupees per year, which is 2,000,000 rupees." },
        { t: "h3", text: "What progress really looks like" },
        { t: "ul", items: [
          "**Weeks 1–4:** you can explain the basics and draw a simple risk diagram. Not yet hireable in this field.",
          "**Weeks 5–9:** you have one project that survives questions. Now start applying for detection and MLSecOps roles.",
          "**Weeks 10–13:** three projects, one written report, rehearsed answers. This is where interviews start converting.",
          "**Months 4–6:** expect 30 to 80 applications for a first role. That is normal, not failure."
        ]},
        { t: "note", kind: "job", title: "the shortcut most people miss", text: "The fastest way in is often inside your current employer. Find the team shipping an AI feature or rolling out Copilot. Offer a free risk review or a detection rule. You already have trust and context there; outside candidates have neither." }
      ],
      quiz: [
        { q: "What does a certificate mainly do for you?", options: ["Proves you can do the job", "Helps you pass HR filters and recruiter searches", "Replaces a project", "Guarantees an interview"], answer: 1, why: "Certificates are filters, not proof of skill. Projects are the proof." },
        { q: "₹20 LPA means roughly how much per year?", options: ["20,000 rupees", "200,000 rupees", "2,000,000 rupees", "20,000,000 rupees"], answer: 2, why: "One lakh is 100,000. Twenty lakh is 2,000,000 rupees per year." },
        { q: "What is statistically the fastest route into an AI security role?", options: ["Cold applications everywhere", "A move inside your current employer", "A master's degree", "Winning a bug bounty"], answer: 1, why: "Internal moves use existing trust and context, and convert far more often than cold applications." }
      ]
    }
  ]
};
