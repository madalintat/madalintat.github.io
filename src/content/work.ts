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
        heading: "six models in a row, each measured alone",
        body: "a match video goes through a tracker, pose, a strike finder, a reader for the referees' flags, a who-struck model and a shinai fit. each one is measured on its own, so when a number moves i know which part moved it. it runs per match on modal gpus; the app only reads the match files it writes.",
      },
      {
        heading: "what ships",
        body: "the flags and the tasuki say who scored. no model guesses that part, and it agrees with the record on 177 matches. the record of kendo, ippon lab for your own videos, live replays for organisers, a dojo space and a coach agent that answers from your matches all sit on top.",
      },
    ],
    mine: "all of it, alone. the record and the rating, scouting, ippon lab, live, the dojo space, the coach agent, the gpu engine, the notebook from e1 to e105, the brand and the films.",
    limits: [
      "who struck on strikes that don't score is at chance on clean labels. 83 labels are too few to train on.",
      "new halls are the worst case for strikes: almost half the calls were wrong before retraining.",
      "weights stay private while the youtube-derived labels wait on a legal review.",
    ],
    next: { label: "superstarling, my company", href: "/work/superstarling" },
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
    next: { label: "back to the sea", href: "/" },
  },
  {
    slug: "superstarling",
    title: "superstarling",
    line: "ten agents in one workspace that draft the week and wait for my yes",
    stat: "10 agents",
    hero: { kind: "image", src: "/work/superstarling-home-dark.jpg", alt: "superstarling home: what needs you, drafts to approve, what goes out" },
    numbers: [
      { value: "10", label: "agents on the team", condition: "starling plans; nine specialists take the parts", source: "superstarling-agents" },
      { value: "2,344", label: "tests", condition: "1,390 server, 772 web, 182 for the browser service", source: "superstarling-tests" },
      { value: "31", label: "block types", condition: "pages with markdown shortcuts, a slash menu, history and trash", source: "superstarling-readme" },
      { value: "~80", label: "tools over MCP", condition: "the same things a person can do; each says if it edits and if it's risky", source: "superstarling-code" },
    ],
    links: [],
    walk: {
      title: "one ask, from the box to the post. the shop is a demo",
      steps: [
        {
          name: "the ask",
          body: "one line to starling: plan corner bakery's autumn menu launch week from my notes, four posts, a picture for each, and keep thursday evening free. an @name on a page or a to-do given to an agent starts a run too.",
          shot: { src: "/work/superstarling/ask-11.webp", alt: "the ask box with starling, the lead, and the launch week request typed in", w: 800, h: 420 },
        },
        {
          name: "the plan",
          body: "starling reads the page and splits the job into five parts: sloane the words, reyes the pictures, hale the dates, quinn the inbox, cross the sending. the run card shows each one finish, with undo and a log of what it did.",
          shot: { src: "/work/superstarling/runcard.webp", alt: "starling's run card: five parts, each member done, and a summary of the launch week", w: 1216, h: 758 },
        },
        {
          name: "the drafts",
          body: "four drafts wait in one list. each says where and when it goes, with yes, post it, or change it. nothing leaves before that yes.",
          shot: { src: "/work/superstarling/needs.webp", alt: "drafts to approve: two bakery posts, each with yes, post it and change it", w: 1320, h: 700 },
        },
        {
          name: "the week",
          body: "the posts land on one calendar, one version per place it goes. thursday evening stayed empty, as asked.",
          shot: { src: "/work/superstarling/plan.webp", alt: "the week on the calendar: four instagram posts, monday to friday, thursday empty", w: 1494, h: 338 },
        },
        {
          name: "out",
          body: "cross sends what i approved when it is due, through postiz, ayrshare or my own browser service for x and linkedin, and can fix or take down a post that is live.",
          shot: { src: "/work/superstarling/post.webp", alt: "one post with its picture, its caption count and the time it goes out", w: 1256, h: 684 },
        },
      ],
    },
    crew: [
      { name: "starling", role: "the lead: plans the job, hands out the parts", face: "/work/superstarling/crew/starling.webp" },
      { name: "sloane", role: "writes posts, emails and articles", face: "/work/superstarling/crew/sloane.webp" },
      { name: "hale", role: "plans the week onto the calendar", face: "/work/superstarling/crew/hale.webp" },
      { name: "reyes", role: "pictures, cards and short videos", face: "/work/superstarling/crew/reyes.webp" },
      { name: "cross", role: "sends what you said yes to", face: "/work/superstarling/crew/cross.webp" },
      { name: "vance", role: "replies to leads, moves deals", face: "/work/superstarling/crew/vance.webp" },
      { name: "steele", role: "quotes and invoices; never marks one paid", face: "/work/superstarling/crew/steele.webp" },
      { name: "quinn", role: "reads the mail, drafts the replies", face: "/work/superstarling/crew/quinn.webp" },
      { name: "mercer", role: "research, every fact with its source", face: "/work/superstarling/crew/mercer.webp" },
      { name: "nash", role: "a private space for life at home", face: "/work/superstarling/crew/nash.webp" },
    ],
    sections: [
      {
        heading: "how much it may do alone",
        body: "three settings: always ask, ask only for the risky things, or let it work. risky means deleting, members, settings, editing more than 20 rows at once, and anything that leaves the workspace. a run nobody is watching never sits waiting; it needs a standing yes for that kind of work, or it stops. every change can be undone.",
      },
      {
        heading: "a workspace first",
        body: "pages, live tables with board, calendar and chart views, a picture library, and one calendar that also reads your meetings from an ical address. the agents work through the same tools a person has, and the house rule is that every human action has an agent tool or a written reason why not.",
      },
      {
        heading: "small on purpose",
        body: "node 24 with node:http and node:sqlite and no framework, one sqlite file, 60 migrations, react 19 on the front. it is set up to run on one small machine in bucharest with nightly backups.",
      },
    ],
    mine: "all of it, from zero, alone: the server, the editor, the ten agents and the rules they follow, the publishing, the browser service, the design and the launch films.",
    limits: [
      "not deployed yet. no sign-up.",
      "publishing has only met test accounts.",
      "the ten agent evals are written and have not run for real, so there is no pass rate to quote.",
      "one sqlite file per install; it has not met a large team.",
    ],
    next: { label: "surogate, my job at invergent", href: "/work/surogates" },
  },
  {
    slug: "surogates",
    title: "surogate at invergent",
    line: "invergent's open stack trains small models, serves them and runs agents on them. i built the part where an agent meets a person",
    stat: "9 channels",
    hero: { kind: "figure", src: "surogates", alt: "the surogate stack: sessions become data, the engine trains and serves, the runtime runs agents, people reach them on nine channels" },
    numbers: [
      { value: "9", label: "channels an agent answers on", condition: "the phone, discord and teams ones are mine from zero", source: "surogates-code" },
      { value: "4", label: "chat platforms faked on a laptop", condition: "slack, telegram, discord, teams: a rehearsal needs no real account", source: "surogates-code" },
      { value: "5.69%", label: "WER, my romanian recogniser", condition: "FLEURS, 883 clips; whisper large-v3 gets 8.42%", source: "jackrabbit-card" },
      { value: "2,531×", label: "real time, the same model", condition: "one RTX 5090; it answers the phone calls", source: "jackrabbit-card" },
    ],
    links: [
      { label: "invergent-ai/surogates", href: "https://github.com/invergent-ai/surogates" },
      { label: "surogate engine", href: "https://github.com/invergent-ai/surogate" },
      { label: "surogate.ai", href: "https://surogate.ai" },
      { label: "the speech models", href: "/work/romanian-speech" },
    ],
    walk: {
      title: "the stack, from the gpu to the person. the team's part first, then mine",
      steps: [
        {
          name: "train",
          body: "a c++ and cuda engine trains small expert models: lora and qlora, grpo and dpo, distillation. flavius burca wrote it, and its speed numbers are the team's.",
          mine: "jackrabbit, then jackalope: a terminal console for training runs, with live graphs, pause and resume, run compare, alerts, and a model browser that says what fits on your card.",
        },
        {
          name: "serve",
          body: "the same engine serves models over an openai-compatible api, in gguf, nvfp4 or fp8, and serves the speech models next to them.",
          mine: "my romanian recogniser and the three voices, wired into serving with pinned revisions.",
        },
        {
          name: "run",
          body: "surogates is the runtime. each session is an event log in postgres, so it survives a crash; code runs in sandbox pods; every tool call passes a policy check before it runs. the design is flavius's.",
          mine: "agents that write first: a follow-up walks a person through a program with time zones, no messages at night, fallbacks and an escalation queue. scheduled work that keeps local time across daylight saving and skips a run that would overlap.",
        },
        {
          name: "answer",
          body: "people reach an agent through the web chat, the phone, whatsapp, telegram, slack, discord, teams, a website widget, or any app that speaks the openai api.",
          mine: "the phone channel: livekit sip, my romanian speech in and out, barge-in, a background soundscape, outbound calls and a busy line when it is full. discord and teams from zero, whatsapp flows, the telegram and slack upgrades, and an ai disclosure on every channel for the eu ai act, art. 50.",
        },
        {
          name: "rehearse",
          body: "before an agent goes live, autopilot plays the customer on each channel. read-only tools run for real; anything that would change something is faked at the proxy and written to the log.",
          mine: "built it, with fake local servers for slack, telegram, discord and teams so a rehearsal needs no real account.",
        },
        {
          name: "sell",
          body: "studio is the control plane: skills, knowledge, datasets, training, evals, serving, channels and billing in one place.",
          mine: "selling an agent through stripe connect, with token packs, allowances per person and a free plan. also the channels page, the follow-up screens and escalation inbox, the copilot's builder mode, a landing-page builder, and studio on a phone.",
        },
      ],
    },
    sections: [],
    mine: "the parts marked mine above, each merged as a pull request on the public repos. the engine and the runtime's core are flavius burca's; the rest of the team builds training, evals and benchmarks.",
    limits: [
      "a team project. the runtime's design is not mine.",
      "the model weights are invergent's, under cc-by-nc-4.0; commercial use goes through invergent.",
      "the engine's training and serving speeds belong to the team, so they stay off this page.",
    ],
    next: { label: "the speech models", href: "/work/romanian-speech" },
  },
];

export const getWork = (slug: string) => work.find((w) => w.slug === slug);
