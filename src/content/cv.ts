// Both CVs, one source: the /cv page renders them and scripts/cv-pdf.mjs prints them. Sentence case: a document for
// recruiters, not the cetusian voice. Numbers match the home page and the model cards.
export type CvVersion = "research" | "builder";
export type CvItem = { title: string; when?: string; sub?: string; bullets?: string[] };

export const CONTACT = {
  name: "Mădălin Tatarciuc",
  email: "madalintat@gmail.com",
  site: "madalintat.github.io",
  github: "github.com/madalintat",
  hf: "hf.co/cetusian",
  linkedin: "linkedin.com/in/madalin-tatarciuc",
  terms: "EU citizen · remote, CET · B2B or employment",
};

export type Cv = { contact: typeof CONTACT; role: string; summary: string; sections: { heading: string; items: CvItem[] }[]; skills: [string, string][] };

const EARLIER: CvItem[] = [
  { title: "Engineering Team Lead, Salestools", when: "Jun 2025 – Nov 2025", sub: "LLM-driven sales platform. Led the engineering team, on-site in Bucharest." },
  { title: "AI Automation Engineer, Plant an App", when: "Jul 2024 – Jun 2025", sub: "Bazinga AI: assistants for customer support, onboarding and retention. Remote." },
  { title: "Co-founder and CEO, .worlds", when: "Jun 2024 – Jun 2025", sub: "Generated lo-fi music videos from text. buildspace S5." },
  { title: "Romania Chapter Lead and Business Development, Omdena", when: "Apr 2023 – Apr 2024", sub: "Ran open-source AI projects with local contributors; brought Omdena into the Romanian market." },
];

const SUROGATES = "Surogates, Invergent's public agent runtime, the parts I built: phone calls to agents over SIP on my Romanian speech models, Simulate (practice worlds for WhatsApp, Telegram, Slack, Teams, Discord and phone), Discord and Teams channels, a website widget, an OpenAI-compatible endpoint for any agent, follow-ups, credits and the EU AI Act disclosure.";

export const cv: Record<CvVersion, Cv> = {
  research: {
    contact: CONTACT,
    role: "Applied AI research engineer: speech, video understanding, small models that run on CPUs",
    summary: "I take a model from data to a shipped product on my own: corpus, training recipe, evaluation, quantized runtime and the app around it. Most of what I know came from rebuilding papers without opening the reference code.",
    sections: [
      {
        heading: "Experience",
        items: [
          {
            title: "Applied AI Researcher, Invergent", when: "Mar 2026 – now",
            sub: "Surogate: open-source training, serving and agent stack. Full-time, Bucharest.",
            bullets: [
              "Romanian speech recognition, built alone: fine-tuned NVIDIA's 110M Parakeet TDT-CTC with a 4-gram LM over its own vocabulary. 5.69% WER on FLEURS (Canary 1B v2: 5.95%, Whisper large-v3: 8.42%), 2.07% on Common Voice 21. Released as jackrabbit-110m-ro.",
              "Streaming variant: cache-aware encoder, full-context re-read after each pause. 7.03% WER on FLEURS fed as live 32 ms packets; final text about 0.72 s after the speaker stops.",
              "Romanian text-to-speech, built alone: adapted the 357M Magpie TTS. Three voices in one checkpoint, 2.02% WER read back by Whisper large-v3, native runtime on CPU, CUDA and Metal with no PyTorch. Released as amami-357m-ro.",
              "Corpus and evaluation for both: collected and cleaned Romanian ASR and TTS data; one normalizer and corrected references so numbers stay comparable across runs.",
              SUROGATES,
            ],
          },
          ...EARLIER,
        ],
      },
      {
        heading: "Own research and products",
        items: [
          {
            title: "ipporu: video understanding for kendo", when: "Oct 2026 – now · solo",
            bullets: [
              "A chain of specialist models on Modal GPUs: tracking (0 swaps on 7 test matches), a referee-flag reader I trained (99 of 103 calls), strike detection (152 of 182 found), shinai keypoints and a who-struck model on V-JEPA 2 features.",
              "Caught my own false result: who-struck scored 76% on agent-made labels and 57% on 83 clean referee-flag labels, against 58% for always guessing red. Ippon side now comes from flags and tasuki; 177 matches agree with the official record. Notebook E1 to E105, each with its gate.",
              "Product on top, live at ipporu.com: a record of 139k kendoka across 99 countries, scouting, Ippon Lab for your own videos, Live for organisers and a coach agent in 7 languages.",
            ],
          },
          { title: "Open source and datasets", when: "2025 – 2026", bullets: ["PS3 Eye camera driver for Apple silicon. LlamaRanch, a home for local models. vecdb, a disk-backed ANN vector database in C.", "Chess SFT data (200k mix, Lichess 2200+) and a synthetic markdown-table QA suite on Hugging Face."] },
        ],
      },
    ],
    skills: [
      ["Models", "PyTorch, NeMo, transformers, ASR (CTC, TDT, n-gram LMs), TTS, V-JEPA 2, pose and keypoints, SFT and LoRA"],
      ["Runtime", "GGUF and llama.cpp, quantized CPU runtimes, streaming inference, Modal GPUs"],
      ["Software", "Python, Go, TypeScript, Rust and C; FastAPI, Node, Postgres, SQLite, Redis"],
      ["Other", "English and Romanian, both native. Competes for Romania's national kendo team."],
    ],
  },
  builder: {
    contact: CONTACT,
    role: "AI engineer who ships the model and the product around it",
    summary: "I build alone from model to launch: training and evaluation, the backend, the app, the brand and the launch film. Two products of my own in 2026, ipporu and Superstarling, and Surogate's Romanian speech models.",
    sections: [
      {
        heading: "Products I built",
        items: [
          {
            title: "ipporu: the home of kendo", when: "Oct 2026 – now · solo",
            bullets: [
              "Live at ipporu.com: the record of 139k kendoka across 99 countries with a rating, scouting with the draw simulated 2,000 times, Ippon Lab that finds every strike in your videos, Live scoring for organisers, Dojo for clubs and a coach agent in 7 languages.",
              "Video engine as a chain of specialist models on Modal GPUs, with a daily cost cap: tracking, referee-flag reader, strike detection, ippon from flags and tasuki (177 matches agree with the record), who-struck on V-JEPA 2.",
              "Brand, marks, launch films and copy are mine too.",
            ],
          },
          {
            title: "Superstarling: a workspace with an agent team inside", when: "Nov 2026 – now · solo",
            bullets: [
              "Pages with 31 block types, tables with five views, one calendar for posts, emails and articles, sales with quotes and invoices. Starling leads nine agents; every tool declares if it is risky and risky ones wait for a person's yes.",
              "My own agent loop with step, time and credit budgets, about 80 tools over MCP. Node 24 with node:http and node:sqlite, no framework, live sync and presence; 1,200+ server tests. Articles ship as pull requests on your site's repo.",
            ],
          },
        ],
      },
      {
        heading: "Experience",
        items: [
          {
            title: "Applied AI Researcher, Invergent", when: "Mar 2026 – now",
            sub: "Surogate: open-source training, serving and agent stack. Full-time, Bucharest.",
            bullets: [
              "Built Surogate's Romanian speech alone: jackrabbit-110m-ro at 5.69% WER on FLEURS, ahead of Canary 1B v2 and Whisper large-v3, with a streaming variant; amami-357m-ro, three voices in one checkpoint at 2.02% WER, no PyTorch at runtime.",
              SUROGATES,
            ],
          },
          ...EARLIER,
        ],
      },
      { heading: "Open source", items: [{ title: "PS3 Eye camera driver for Apple silicon, LlamaRanch for local models, vecdb (ANN vector database in C), a Rust handbook." }] },
    ],
    skills: [
      ["Product", "TypeScript, React, Node, Python, FastAPI, Go; Postgres, SQLite, Redis"],
      ["AI", "PyTorch, NeMo, transformers, speech (ASR, TTS), video models, agents and MCP, GGUF and llama.cpp"],
      ["Ship", "Modal, Fly, Vercel, Cloudflare, GitHub Actions, PostHog, Stripe"],
      ["Other", "English and Romanian, both native. Competes for Romania's national kendo team."],
    ],
  },
};
