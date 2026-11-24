// The home page: one world from the sky to the core. Every fact here has a source in sources.ts or the agent
// reports of 2026-11-24 (superworkspace, kendo_world, surogate cards, invergent-ai/surogates).
export type Fact = { k?: string; text: string };
export type Layer = {
  id: "sky" | "flock" | "rooftops" | "city" | "street" | "engine" | "bedrock" | "core";
  m: number; // metres on the gauge
  name: string; // the gauge label
  tag?: string;
  title: string;
  line?: string;
  facts: Fact[];
  links: { label: string; href: string }[];
};

export const EMAIL = "madalintat@gmail.com";

// notebook headings in ~/kendo_world/platform/research/tracking/notebook.md, 2026-11-24
export const EXPERIMENTS = [
  ...Array.from({ length: 66 }, (_, i) => i + 1),
  68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 81, 82, 84, 85, 86, 87, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98,
  100, 101, 102, 105,
];

export const LAYERS: Layer[] = [
  {
    id: "sky", m: 3000, name: "sky",
    tag: "applied ai researcher at invergent · bucharest · remote",
    title: "mădălin tatarciuc",
    line: "i train models and build the product around them. speech, video, agents.",
    facts: [
      { k: "5.69%", text: "wer, romanian, on a cpu" },
      { k: "3 voices", text: "one checkpoint" },
      { k: "152 of 182", text: "kendo strikes found" },
      { k: "e1 to e105", text: "one notebook" },
    ],
    links: [],
  },
  {
    id: "flock", m: 1200, name: "the flock",
    tag: "superstarling · mine, from an empty repo",
    title: "superstarling",
    line: "a workspace where ten agents do the work and nothing goes out until you say yes.",
    facts: [
      { k: "pages", text: "31 block types, comments, history, a slash menu" },
      { k: "tables", text: "table, board, list, calendar and timeline views, a page per row" },
      { k: "crew", text: "starling leads nine agents: writer, planner, visuals, publisher, sales, bookkeeper, inbox, research, life" },
      { k: "approval", text: "every tool declares if it's risky. risky ones wait for your yes" },
      { k: "sales", text: "a contact moves up only when something happens. overdue invoices get a reminder drafted" },
      { k: "publish", text: "articles land as pull requests on your site's repo, designs export as png" },
      { k: "runtime", text: "my own agent loop with step, time and credit budgets. about 80 tools over mcp" },
      { k: "server", text: "node 24 and sqlite, no framework. live sync, presence, conflicts that ask whose text stays" },
    ],
    links: [{ label: "the project", href: "/work/superstarling" }],
  },
  {
    id: "rooftops", m: 300, name: "rooftops",
    tag: "romanian speech · invergent · public on hugging face",
    title: "romanian speech",
    line: "recognition and three voices. no graphics card needed.",
    facts: [
      { k: "5.69%", text: "wer on fleurs. canary 1b v2 gets 5.95%, whisper large-v3 8.42%" },
      { k: "2.07%", text: "wer on common voice 21" },
      { k: "0.72 s", text: "from the end of a sentence to its final text, streaming" },
      { k: "2.02%", text: "wer of the three voices, read back by whisper large-v3" },
      { k: "no pytorch", text: "gguf on cpu, cuda and metal. about real time on an 8 gb m3" },
      { k: "615", text: "downloads of the voices last month" },
    ],
    links: [
      { label: "jackrabbit-110m-ro", href: "https://huggingface.co/surogate/jackrabbit-110m-ro" },
      { label: "streaming", href: "https://huggingface.co/surogate/jackrabbit-110m-ro-streaming" },
      { label: "amami-357m-ro", href: "https://huggingface.co/surogate/amami-357m-ro" },
    ],
  },
  { id: "city", m: 120, name: "the city", title: "bucharest, 02:14", facts: [], links: [] },
  {
    id: "street", m: 0, name: "street level",
    tag: "ipporu · kendo · built alone",
    title: "ipporu",
    line: "every kendoka's record, and an engine that reads a match from video.",
    facts: [
      { k: "record", text: "139k kendoka, 186k matches, ippon by ippon, with a rating" },
      { k: "scouting", text: "an opponent's strike map. the draw simulated 2,000 times" },
      { k: "ippon lab", text: "upload a match, get every strike, the flags, each ippon in five parts" },
      { k: "live", text: "draws, scoring from a phone, a board for the hall tv" },
      { k: "coach", text: "an agent that answers from your own matches, in 7 languages" },
    ],
    links: [{ label: "ipporu.com", href: "https://ipporu.com" }, { label: "the project", href: "/work/ipporu" }],
  },
  {
    id: "engine", m: -40, name: "engine room",
    tag: "surogates · invergent's public agent runtime",
    title: "surogates",
    line: "the parts of the runtime i built.",
    facts: [
      { k: "phone", text: "calls to agents over sip, on my romanian speech models, with barge-in" },
      { k: "simulate", text: "fake whatsapp, telegram, slack, teams, discord and phone to test agents before they talk to anyone" },
      { k: "channels", text: "discord, teams, a website widget, any agent as an openai-compatible endpoint" },
      { k: "follow-ups", text: "an agent walks a person through a protocol and escalates to the team" },
      { k: "commerce", text: "accounts, allowances and credits on every channel" },
      { k: "governance", text: "per-agent policy and the eu ai act disclosure" },
    ],
    links: [{ label: "invergent-ai/surogates", href: "https://github.com/invergent-ai/surogates" }],
  },
  {
    id: "bedrock", m: -120, name: "bedrock",
    tag: "how i measure",
    title: "e1 to e105",
    line: "every change to the kendo engine gets a notebook entry: the question, the run, the read.",
    facts: [
      { k: "76% → 57%", text: "who struck, once the labels came from the flags. always guessing aka gets 58%. i took the 76% back" },
      { k: "passed", text: "tracker, flag reader, ippon from flags and tasuki" },
      { k: "not yet", text: "who struck, target, the shinai tip" },
    ],
    links: [
      { label: "when my labels fooled me", href: "/notes/when-my-labels-fooled-me" },
      { label: "a ps3 eye driver on apple silicon", href: "/notes/ps3-eye-driver-on-apple-silicon" },
    ],
  },
  {
    id: "core", m: -400, name: "core",
    tag: "eu citizen · remote, cet · b2b or employment",
    title: "write to me",
    facts: [],
    links: [
      { label: EMAIL, href: `mailto:${EMAIL}` },
      { label: "cv, research", href: "/cv" },
      { label: "cv, builder", href: "/cv?v=builder" },
      { label: "github", href: "https://github.com/madalintat" },
      { label: "hugging face", href: "https://huggingface.co/cetusian" },
      { label: "linkedin", href: "https://www.linkedin.com/in/madalin-tatarciuc" },
      { label: "x", href: "https://x.com/cetusian" },
    ],
  },
];

// the ipporu engine, link by link, with each step's best honest number
export const CHAIN: { name: string; note: string; ships: boolean }[] = [
  { name: "tracker", note: "0 swaps on 7 test matches", ships: true },
  { name: "aka / shiro", note: "read from the tasuki", ships: true },
  { name: "crack", note: "14 of 15 hits within 80 ms", ships: true },
  { name: "strike", note: "152 of 182 found, 32% of calls wrong", ships: true },
  { name: "flags", note: "99 of 103 calls", ships: true },
  { name: "ippon", note: "177 matches agree with the record", ships: true },
  { name: "who struck", note: "57% on clean labels. not solved", ships: false },
];
