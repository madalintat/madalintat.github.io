import type { Work } from "./types";

export const work: Work[] = [
  {
    slug: "ipporu",
    title: "ipporu",
    line: "video models that find every strike and ippon in a kendo match",
    stat: "99 countries",
    hero: { kind: "film", src: "/work/ipporu.mp4", poster: "/work/ipporu.jpg", alt: "ipporu launch film: each ippon as it was scored" },
    numbers: [
      { value: "99", label: "countries in the record", condition: "kendoka, clubs and competitions on ipporu.com", source: "ipporu-site" },
      { value: "152 / 182", label: "sure strikes found", condition: "20 held-out matches; 32% of calls still wrong", source: "ipporu-strikes" },
      { value: "57%", label: "who struck, on clean labels", condition: "83 flag labels; always guessing aka gets 58%", source: "ipporu-e101" },
      { value: "177", label: "matches agree with the record", condition: "ippon count and side, from flags, tasuki and the strike before them", source: "ipporu-engine" },
    ],
    links: [
      { label: "ipporu.com", href: "https://ipporu.com" },
    ],
    sections: [
      {
        heading: "a chain, not one model",
        body: "a match video goes through a tracker, pose, a strike finder, a reader for the referees' flags, a who-struck model and a shinai fit. each one is measured on its own, so when a number moves i know which part moved it. it runs per match on modal gpus; the app only reads the match files it writes.",
      },
      {
        heading: "what ships",
        body: "who scored comes from the flags and the tasuki, not from a model guessing. that part holds up. the record of kendo, ippon lab for your own videos, live replays for organisers, a dojo space and a coach agent that answers from your matches all sit on top.",
      },
    ],
    mine: "all of it, alone. the record and the rating, scouting, ippon lab, live, the dojo space, the coach agent, the gpu engine, the notebook from e1 to e105, the brand and the films.",
    limits: [
      "who struck on strikes that don't score is at chance on clean labels. 83 labels are too few to train on.",
      "new halls are the worst case for strikes: almost half the calls were wrong before retraining.",
      "weights stay private while the youtube-derived labels wait on a legal review.",
    ],
    next: { label: "try the engine on a match", href: "/work/ipporu#demo" },
  },
  {
    slug: "romanian-speech",
    title: "romanian speech",
    line: "recognition and three voices that run on a CPU, built at invergent",
    stat: "5.69% WER",
    hero: { kind: "figure", src: "speech", alt: "audio into a 110M recogniser, text into a 357M speech model, both on a CPU" },
    numbers: [
      { value: "5.69%", label: "WER on FLEURS", condition: "CTC + 4-gram, 883 clips. canary 1b v2 gets 5.95%, whisper large-v3 8.42%", source: "jackrabbit-card" },
      { value: "2.07%", label: "WER on common voice 21", condition: "3,929 clips, the sped test list", source: "jackrabbit-card" },
      { value: "7.03%", label: "WER streaming", condition: "FLEURS fed as live 32 ms packets; the final text lands about 0.72 s after you stop", source: "streaming-card" },
      { value: "2.02%", label: "WER of the three voices", condition: "100 sentences, read back by whisper large-v3", source: "amami-card" },
      { value: "615", label: "downloads last month", condition: "the voices, hugging face, 24 nov 2026", source: "amami-downloads" },
    ],
    links: [
      { label: "jackrabbit-110m-ro", href: "https://huggingface.co/surogate/jackrabbit-110m-ro" },
      { label: "streaming variant", href: "https://huggingface.co/surogate/jackrabbit-110m-ro-streaming" },
      { label: "amami-357m-ro", href: "https://huggingface.co/surogate/amami-357m-ro" },
    ],
    sections: [
      {
        heading: "no graphics card, no cloud",
        body: "the recogniser is nvidia's 110M parakeet tdt-ctc, fine-tuned for romanian. a 4-gram language model over its own 2,048-piece vocabulary rescores the ctc beam. the streaming version is cache-aware with about a second of lookahead, and re-reads the sentence with full context after a 640 ms pause.",
      },
      {
        heading: "three voices, one checkpoint",
        body: "the voices adapt nvidia's 357M magpie tts. doina, tudor and radu live in one checkpoint, so switching voice costs nothing. it reads numbers, dates and ibans. a native c++ build runs it on cpu, cuda and metal with no pytorch, about real time on an 8 gb m3.",
      },
    ],
    mine: "led both at invergent: data, training recipes, evaluation and the cpu runtimes. the models are invergent's and public under cc-by-nc-4.0.",
    limits: [
      "streaming finals trail offline by 1.34 points on FLEURS.",
      "the voice numbers use a recogniser as the judge, so they inherit its errors.",
    ],
    next: { label: "the agent runtime at invergent", href: "/work/surogates" },
  },
  {
    slug: "superstarling",
    title: "superstarling",
    line: "a workspace where an agent team drafts and you say yes",
    stat: "31 block types",
    hero: { kind: "image", src: "/work/superstarling-home-dark.jpg", alt: "superstarling home: what needs you, drafts to approve, what goes out" },
    numbers: [
      { value: "31", label: "block types", condition: "pages with markdown shortcuts, a slash menu, history and trash", source: "superstarling-readme" },
      { value: "10", label: "agents on the team", condition: "each with a role; nothing goes out without a yes", source: "superstarling-readme" },
      { value: "1,200+", label: "server tests", condition: "node 24 with node:http and node:sqlite, no framework", source: "superstarling-readme" },
      { value: "~80", label: "tools over MCP", condition: "pages, canvas, design, library and video; each says if it edits and if it's risky", source: "superstarling-code" },
    ],
    links: [],
    sections: [
      {
        heading: "pages, tables, one calendar",
        body: "posts, emails and articles live in one calendar, each a set of versions, one per place it goes. live tables have board, calendar and chart views and a page per row.",
      },
      {
        heading: "questions, not guesses",
        body: "when the team needs a decision it asks up to four questions in one card, and your answer is the go. you pick how much it may do alone: always ask, only the risky things, or let it work. every change can be undone.",
      },
    ],
    mine: "everything, from zero: the server, the editor, the agents, the publishing and the design.",
    limits: ["not deployed yet. no sign-up.", "social posting has only met test accounts.", "one sqlite file per install; it has not met a large team."],
    next: { label: "back to the work", href: "/" },
  },
  {
    slug: "surogates",
    title: "surogates",
    line: "the open runtime for managed agents, at invergent",
    stat: "8 features",
    hero: { kind: "figure", src: "surogates", alt: "an agent session that survives a crash: durable session, isolated execution, a policy check on every tool call" },
    numbers: [

    ],
    links: [{ label: "github.com/invergent-ai/surogates", href: "https://github.com/invergent-ai/surogates" }],
    sections: [
      { heading: "phone calls to agents", body: "calls come in over livekit sip and run on my romanian speech models, with turn-taking, barge-in and a background soundscape." },
      { heading: "simulate", body: "practice worlds for whatsapp, telegram, slack, teams, discord, the website and phone. autopilot plays the customers; read-only tools run for real and the rest are faked." },
      { heading: "channels", body: "discord, microsoft teams, telegram parity, a drop-in website chat widget, and any agent served as an openai-compatible endpoint." },
      { heading: "follow-ups and programs", body: "an agent walks a person through a protocol on whatsapp and escalates to the team when it matters." },
      { heading: "commerce and governance", body: "end-user accounts, token allowances, packages and credits on every channel. per-agent policy and the eu ai act art. 50 disclosure." },
    ],
    mine: "the features on this page, each merged as a pull request on the public repo.",
    limits: ["a team project. the runtime's design is not mine."],
    next: { label: "the speech models", href: "/work/romanian-speech" },
  },
];

export const getWork = (slug: string) => work.find((w) => w.slug === slug);
