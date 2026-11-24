// The home page: one dive from the sky to the sea floor, one idea a scene. Every number has a source in sources.ts, the model cards or
// the agent reports of 2026-11-24 (superworkspace, kendo_world, surogate cards, invergent-ai/surogates) and
// docs/research/hf-inventory.md + products-inventory.md (433 accounts: ipporu production read 2026-11-24).
// Few words a scene: the detail lives in the two stories (stories.ts), the project pages and the cv.
export type Fact = { k?: string; text: string };
export type Icon = "hf" | "github" | "x" | "ipporu" | "superstarling" | "mail" | "cv" | "play" | "linkedin" | "web";
export type Link = { label: string; href: string; icon?: Icon };
export type SceneId = "sky" | "ships" | "harbour" | "surface" | "whales" | "bench" | "lab" | "notebook" | "garden";
export type Scene = { id: SceneId; m: number; name: string; tag?: string; icon?: Icon; title: string; line?: string; facts: Fact[]; links: Link[] };

export const EMAIL = "madalintat@gmail.com";

// notebook headings in ~/kendo_world/platform/research/tracking/notebook.md, 2026-11-24
export const EXPERIMENTS = [
  ...Array.from({ length: 66 }, (_, i) => i + 1),
  68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 81, 82, 84, 85, 86, 87, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98,
  100, 101, 102, 105,
];

export const SCENES: Scene[] = [
  {
    id: "sky", m: 3000, name: "sky",
    tag: "applied ai researcher · builder · romania",
    title: "mădălin tatarciuc",
    line: "i train models and build the product around them.",
    facts: [], links: [],
  },
  {
    id: "harbour", m: 0, name: "the harbour", icon: "ipporu",
    tag: "ipporu · a product i built alone",
    title: "ipporu",
    line: "the home of kendo. every match and every fighter on record, and video models that read a match the way a referee does.",
    facts: [
      { k: "433", text: "accounts, 321 of them in launch week" },
      { k: "139k", text: "kendoka on record" },
      { k: "186k", text: "matches on record" },
    ],
    links: [{ label: "ipporu.com", href: "https://ipporu.com", icon: "ipporu" }, { label: "how the models work", href: "/work/ipporu", icon: "play" }],
  },
  {
    id: "ships", m: 0, name: "the fleet", icon: "github",
    tag: "surogates · open source at invergent",
    title: "surogates",
    line: "invergent's open runtime for ai agents. i built the parts that put an agent in front of real people.",
    facts: [
      { k: "336", text: "files i created, across 11 parts" },
      { k: "phone", text: "agents answer real calls, on my romanian speech" },
      { k: "simulators", text: "a fake whatsapp, slack and phone to test an agent first" },
      { k: "channels", text: "discord, teams, a website widget, an openai endpoint" },
    ],
    links: [{ label: "invergent-ai/surogates", href: "https://github.com/invergent-ai/surogates", icon: "github" }],
  },
  { id: "surface", m: -50, name: "under", title: "under the surface", facts: [], links: [] },
  {
    id: "whales", m: -1000, name: "the whales", icon: "hf",
    tag: "hugging face · trained at invergent",
    title: "romanian speech models",
    line: "speech to text and text to speech for romanian. small enough to run on a laptop, every eval published.",
    facts: [
      { k: "5.69%", text: "word error rate on fleurs. whisper large-v3: 8.42%" },
      { k: "3 voices", text: "2.02% word error rate when read back" },
      { k: "real time", text: "amami speaking on a macbook air m3" },
    ],
    links: [
      { label: "jackrabbit", href: "https://huggingface.co/surogate/jackrabbit-110m-ro", icon: "hf" },
      { label: "streaming", href: "https://huggingface.co/surogate/jackrabbit-110m-ro-streaming", icon: "hf" },
      { label: "amami voices", href: "https://huggingface.co/surogate/amami-357m-ro", icon: "hf" },
      { label: "every eval", href: "https://huggingface.co/datasets/surogate/surogate-speech-evals", icon: "hf" },
    ],
  },
  {
    id: "bench", m: -1000, name: "the whales", icon: "hf",
    tag: "hugging face · small models, one job each",
    title: "and the small ones",
    line: "models i trained to do one thing well, on a phone or a cpu.",
    facts: [
      { k: "44k", text: "parameters in earshot, a wake word. 98.4% recall, no false wakes in 1.8 h" },
      { k: "14 of 14", text: "real ledgers read right by libra, a 2b model" },
      { k: "0.8b", text: "pocket atlas explains any idea, offline" },
      { k: "400k", text: "rows of chess training data, open" },
    ],
    links: [
      { label: "earshot", href: "https://huggingface.co/cetusian/earshot-wake", icon: "hf" },
      { label: "libra", href: "https://huggingface.co/surogate/Qwen3.5-2B-Libra-YTD", icon: "hf" },
      { label: "pocket atlas", href: "https://huggingface.co/cetusian/pocket-atlas-0.8b", icon: "hf" },
      { label: "chess data", href: "https://huggingface.co/datasets/cetusian/chess-sft-mix-200k", icon: "hf" },
    ],
  },
  {
    id: "lab", m: -4000, name: "the lab", icon: "superstarling",
    tag: "superstarling · built from an empty repo",
    title: "superstarling",
    line: "a workspace where ten ai agents do the work, and nothing goes out until you say yes.",
    facts: [
      { k: "10", text: "agents, led by starling" },
      { k: "1,200+", text: "server tests" },
      { k: "20", text: "characters in its style bible, drawn for every season" },
    ],
    links: [{ label: "the project", href: "/work/superstarling", icon: "superstarling" }],
  },
  {
    id: "notebook", m: -4000, name: "the lab",
    tag: "research notebook",
    title: "105 experiments, each with a gate",
    line: "every experiment is written down before it runs, with the number it has to beat. when a result is wrong, i take it back.",
    facts: [{ k: "76% → 57%", text: "who struck, once the labels came from the referees' flags. i took the 76% back" }],
    links: [{ label: "when my labels fooled me", href: "/notes/when-my-labels-fooled-me/", icon: "cv" }, { label: "all notes", href: "/notes/" }],
  },
  {
    id: "garden", m: -10994, name: "the floor",
    title: "write to me",
    line: "open to remote roles in applied ai: speech, video and agents.",
    facts: [],
    links: [
      { label: EMAIL, href: `mailto:${EMAIL}`, icon: "mail" },
      { label: "cv, research", href: "/cv/", icon: "cv" },
      { label: "cv, builder", href: "/cv?v=builder", icon: "cv" },
      { label: "github", href: "https://github.com/madalintat", icon: "github" },
      { label: "hugging face", href: "https://huggingface.co/cetusian", icon: "hf" },
      { label: "linkedin", href: "https://www.linkedin.com/in/madalin-tatarciuc", icon: "linkedin" },
      { label: "x", href: "https://x.com/cetusian", icon: "x" },
    ],
  },
];
