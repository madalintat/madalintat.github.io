// Both CVs, one source: the /cv page renders them and scripts/cv-pdf.mjs prints them. Sentence case: a document for
// recruiters, not the cetusian voice. The shape follows Mădălin's own resume: a profile, then each job as
// company · role with short "label: what" bullets, an Earlier line, skills and education. Few numbers, each one earned.
export type CvVersion = "research" | "builder";
/** one bullet: a bold label and what was done; an empty label prints the text alone */
export type Bullet = [string, string];
export type CvItem = { org: string; role?: string; note?: string; when?: string; bullets?: Bullet[] };
export type CvSection = { heading: string; items: CvItem[]; earlier?: string };
export type Cv = { contact: typeof CONTACT; role: string; profile: string; sections: CvSection[]; skills: Bullet[]; more: Bullet[] };

export const CONTACT = {
  name: "Mădălin Tatarciuc",
  email: "madalintat@gmail.com",
  site: "cetusian.com",
  place: "Bucharest, Romania · EU citizen, remote",
  github: "github.com/madalintat",
  hf: "huggingface.co/cetusian",
  linkedin: "linkedin.com/in/madalin-tatarciuc",
};

const INVERGENT = { org: "Invergent", role: "Applied AI Researcher", note: "surogate.ai", when: "Mar 2026 – Present" };

const EARLIER: CvItem[] = [
  { org: "Salestools", role: "Engineering Team Lead", when: "Jun 2025 – Nov 2025", bullets: [
    ["", "Led the team building an LLM-driven outbound sales platform on multi-step agents (research → personalise → write)."],
    ["", "Designed agent pipelines combining retrieval, reasoning and validated JSON output, with confidence scoring and failure routing."],
  ] },
  { org: "Plant an App & Bazinga AI", role: "AI Automation Engineer", when: "Jul 2024 – Jun 2025", bullets: [
    ["", "Fine-tuned and deployed models for sales and support automation; integrated them into production APIs and internal tools."],
  ] },
  { org: ".worlds", role: "Co-founder, CEO", when: "Jun 2024 – Jun 2025", bullets: [
    ["", "Built text-to-image and image-to-video pipelines that turned a song into a music video. buildspace S5."],
  ] },
  { org: "Omdena", role: "Romania Chapter Lead · BD Partner", when: "Apr 2023 – Apr 2024", bullets: [
    ["", "Led open-source applied ML projects, including computer vision for environmental monitoring; brought Omdena into the Romanian market."],
  ] },
];
const EARLIER_LINE = "Skillab · Gameloft · Coreto.io";

const MORE: Bullet[] = [
  ["Education", "buildspace, AI Builder Cohort (2024)"],
  ["Certifications", "Deep Learning, Machine Learning, Computer Vision, Hugging Face Deep RL"],
  ["Languages", "Romanian, English · Kendo: Romanian national team, 1 Dan"],
];

export const cv: Record<CvVersion, Cv> = {
  research: {
    contact: CONTACT,
    role: "Applied AI Researcher · Speech and video models",
    profile: "Applied AI researcher who trains small, specialised models and takes them all the way to production: data, training, evaluation, a fast runtime and the product around it. I learn by rebuilding: take a paper, implement it without the reference code, and write each experiment down with its bar before it runs.",
    sections: [
      {
        heading: "Experience",
        items: [
          { ...INVERGENT, bullets: [
            ["Speech recognition", "built jackrabbit-110m-ro alone, Romanian ASR at 5.69% WER on FLEURS: ahead of Whisper large-v3 at a fourteenth of its size, with a streaming variant for live calls."],
            ["Text-to-speech", "built amami-357m-ro alone, three Romanian voices in one model, running natively on CPU, CUDA and Metal."],
            ["Data and evaluation", "collected and cleaned the Romanian speech corpus, with one normaliser so every run stays comparable."],
            ["Agents", "built the parts of Surogates where an agent meets a customer: phone calls over SIP, Discord, Teams and website chat, and simulated channels to test an agent before it goes live."],
          ] },
          ...EARLIER,
        ],
        earlier: EARLIER_LINE,
      },
      {
        heading: "Own research",
        items: [
          { org: "ipporu", role: "Video understanding for kendo", note: "ipporu.com", when: "Oct 2026 – Present", bullets: [
            ["Models", "a chain of specialist video models on Modal GPUs: player tracking, a referee-flag reader, strike detection, shinai keypoints and a who-struck model on V-JEPA 2."],
            ["Method", "every experiment logged with its gate before it runs; when clean labels disagreed with my own result, I retracted it and rebuilt the method."],
            ["Product", "live, with the record of 139k kendoka, scouting, video analysis and live scoring on top of the models."],
          ] },
          { org: "Open models and tools", note: "huggingface.co/cetusian", bullets: [
            ["Chess LLM", "SFT datasets from Lichess games and puzzles for training a chess-playing model."],
            ["Tools", "PS3 Eye camera driver for Apple silicon; vecdb, a disk-backed vector database in C; LlamaRanch for local models."],
          ] },
        ],
      },
    ],
    skills: [
      ["Research", "speech (ASR, TTS), video understanding, fine-tuning (SFT, LoRA), evaluation, quantisation (GGUF)"],
      ["Engineering", "Python, PyTorch, NeMo, transformers, Go, TypeScript, Rust, C; FastAPI, Postgres, Redis"],
      ["Runtime", "llama.cpp, CPU and streaming inference, Modal GPUs"],
    ],
    more: MORE,
  },
  builder: {
    contact: CONTACT,
    role: "AI Engineer · From the model to the product",
    profile: "I build products from the model up: training and evaluation, the backend, the app, the brand and the launch. In 2026 I shipped two products of my own, ipporu and Superstarling, and built the Romanian speech models behind Surogate.",
    sections: [
      {
        heading: "Products I built",
        items: [
          { org: "ipporu", role: "The home of kendo", note: "ipporu.com", when: "Oct 2026 – Present · solo", bullets: [
            ["Product", "the record of 139k kendoka across 99 countries, scouting, Ippon Lab to analyse your own videos, live scoring for organisers and a coach agent."],
            ["Engine", "specialist video models on Modal GPUs that find the strikes and read the referees' flags."],
            ["Brand", "the marks, launch films and copy."],
          ] },
          { org: "Superstarling", role: "An AI team for your business and your life", when: "Nov 2026 – Present · solo", bullets: [
            ["Workspace", "pages, tables and one calendar for posts, emails and articles, quotes and invoices."],
            ["Agents", "Starling leads nine specialist agents on my own agent loop with about 80 tools over MCP; anything risky waits for a person's yes."],
            ["Stack", "Node and SQLite with no framework, live sync, over a thousand server tests."],
          ] },
        ],
      },
      {
        heading: "Experience",
        items: [
          { ...INVERGENT, bullets: [
            ["Speech", "built Surogate's Romanian models alone: jackrabbit-110m-ro (5.69% WER on FLEURS, ahead of Whisper large-v3) and amami-357m-ro, three voices in one model."],
            ["Agents", "built the parts of Surogates where an agent meets a customer: phone calls, Discord, Teams and website chat, and simulated channels for testing."],
          ] },
          ...EARLIER,
        ],
        earlier: EARLIER_LINE,
      },
      { heading: "Open source", items: [{ org: "", bullets: [["", "PS3 Eye camera driver for Apple silicon · vecdb, a vector database in C · LlamaRanch for local models · chess SFT datasets on Hugging Face."]] }] },
    ],
    skills: [
      ["Product", "TypeScript, React, Node, Python, FastAPI, Go; Postgres, SQLite, Redis"],
      ["AI", "PyTorch, NeMo, transformers, speech (ASR, TTS), video models, agents and MCP, llama.cpp"],
      ["Ship", "Modal, Fly, Vercel, Cloudflare, GitHub Actions, PostHog, Stripe"],
    ],
    more: MORE,
  },
};
