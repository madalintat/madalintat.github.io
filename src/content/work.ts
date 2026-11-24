import type { Work } from "./types";

export const work: Work[] = [
  {
    slug: "ipporu",
    title: "ipporu",
    line: "video models that find every strike and ippon in a kendo match",
    hero: { kind: "film", src: "/work/ipporu.mp4", poster: "/work/ipporu.jpg", alt: "ipporu launch film: each ippon as it was scored" },
    numbers: [
      { value: "99", label: "countries in the record", condition: "kendoka, clubs and competitions on ipporu.com", source: "ipporu-site" },
      { value: "152 / 182", label: "sure strikes found", condition: "20 held-out matches; 32% of calls still wrong", source: "ipporu-strikes" },
      { value: "57%", label: "who struck, on clean labels", condition: "83 flag labels; always guessing aka gets 58%", source: "ipporu-e101" },
      { value: "~2,600", label: "commits, alone", condition: "since 8 oct 2026, merges excluded", source: "ipporu-git" },
    ],
    links: [
      { label: "ipporu.com", href: "https://ipporu.com" },
      { label: "the labels note", href: "/notes/when-my-labels-fooled-me" },
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
    mine: "all of it. the models, the 99 logged experiments, the app, the brand marks and the launch films.",
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
    hero: { kind: "figure", src: "speech", alt: "audio into a 110M recogniser, text into a 357M speech model, both on a CPU" },
    numbers: [
      { value: "5.00%", label: "WER offline", condition: "CTC + 4-gram, 3,196 test clips from FLEURS, common voice 22, voxpopuli", source: "jackrabbit-card" },
      { value: "5.75%", label: "WER streaming", condition: "same clips, full-attention finals after pauses", source: "jackrabbit-card" },
      { value: "7.15–8.08%", label: "WER of the three voices", condition: "301 stress sentences, read back by our own recogniser on a CPU", source: "amami-card" },
      { value: "615", label: "downloads of the voices", condition: "hugging face, as of 24 nov 2026", source: "amami-downloads" },
    ],
    links: [
      { label: "jackrabbit-110m-ro", href: "https://huggingface.co/surogate/jackrabbit-110m-ro" },
      { label: "streaming variant", href: "https://huggingface.co/surogate/jackrabbit-110m-ro-streaming" },
      { label: "amami-357m-ro", href: "https://huggingface.co/surogate/amami-357m-ro" },
    ],
    sections: [
      {
        heading: "no graphics card, no cloud",
        body: "the recogniser is nvidia's 110M parakeet, fine-tuned for romanian. a 4-gram language model rescores the ctc beam. the streaming version keeps a cached encoder and runs a full-attention pass when you pause.",
      },
      {
        heading: "three voices, one checkpoint",
        body: "the voices are an adaptation of the 357M magpie tts. doina, tudor and radu live in one checkpoint, so switching voice costs nothing at inference. creating a voice needs gpus once; speaking afterwards is cpu only.",
      },
    ],
    mine: "built both alone at invergent: data, training recipes, evaluation and the cpu runtimes. the models are invergent's and public under cc-by-nc-4.0.",
    limits: [
      "streaming is behind offline by about 0.75 points of WER.",
      "the voice numbers use our own recogniser as the judge, so they inherit its errors.",
    ],
    next: { label: "the agent runtime at invergent", href: "/work/surogates" },
  },
  {
    slug: "superstarling",
    title: "superstarling",
    line: "a workspace where an agent team drafts and you say yes",
    hero: { kind: "image", src: "/work/superstarling-home.webp", alt: "superstarling home: what needs you, drafts to approve, what goes out" },
    numbers: [
      { value: "31", label: "block types", condition: "pages with markdown shortcuts, a slash menu, history and trash", source: "superstarling-readme" },
      { value: "10", label: "agents on the team", condition: "each with a role; nothing goes out without a yes", source: "superstarling-readme" },
      { value: "1,200+", label: "server tests", condition: "node 24 with node:http and node:sqlite, no framework", source: "superstarling-readme" },
      { value: "~800", label: "commits, alone", condition: "since 11 nov 2026, merges excluded", source: "superstarling-git" },
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
    limits: ["in private build. no sign-up yet.", "one sqlite file per install; it has not met a large team."],
    next: { label: "back to the work", href: "/" },
  },
  {
    slug: "surogates",
    title: "surogates",
    line: "the open runtime for managed agents, at invergent",
    hero: { kind: "figure", src: "surogates", alt: "an agent session that survives a crash: durable session, isolated execution, a policy check on every tool call" },
    numbers: [
      { value: "708", label: "of my commits", condition: "invergent-ai/surogates, merges excluded, as of 24 nov 2026", source: "surogates-git" },
    ],
    links: [{ label: "github.com/invergent-ai/surogates", href: "https://github.com/invergent-ai/surogates" }],
    sections: [
      {
        heading: "agents that survive a bad decision",
        body: "durable sessions, isolated execution and governance on every tool call. an agent picks up where it was after a crash or a restart, and a policy can stop a call before it runs.",
      },
    ],
    mine: "a core contributor: features, fixes and tooling across the runtime, from slack and voice channels to session handling.",
    limits: ["a team project. the design is not mine alone."],
    next: { label: "the speech models", href: "/work/romanian-speech" },
  },
];

export const getWork = (slug: string) => work.find((w) => w.slug === slug);
