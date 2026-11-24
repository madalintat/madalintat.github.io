// The home page: one dive from the sky to the sea floor, one idea a scene. Every number has a source in sources.ts, the model cards or
// the agent reports of 2026-11-24 (superworkspace, kendo_world, surogate cards, invergent-ai/surogates).
// Few words a scene: the detail lives in the two stories (stories.ts), the project pages and the cv.
export type Fact = { k?: string; text: string };
export type Link = { label: string; href: string };
export type SceneId = "sky" | "ships" | "harbour" | "surface" | "whales" | "lab" | "notebook" | "garden";
export type Scene = { id: SceneId; m: number; name: string; tag?: string; title: string; line?: string; facts: Fact[]; links: Link[] };

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
    tag: "applied ai researcher · invergent · bucharest · remote",
    title: "mădălin tatarciuc",
    line: "i train models and build the product around them.",
    facts: [], links: [],
  },
  {
    id: "harbour", m: 0, name: "the harbour",
    tag: "ipporu · mine, alone, live",
    title: "ipporu",
    line: "the home of kendo, and video models that read a match the way a referee does.",
    facts: [
      { k: "139k", text: "kendoka in the record, 186k matches" },
      { k: "7", text: "languages the coach agent speaks" },
    ],
    links: [{ label: "ipporu.com", href: "https://ipporu.com" }, { label: "the project", href: "/work/ipporu" }],
  },
  {
    id: "ships", m: 0, name: "the fleet",
    tag: "surogates · invergent's open agent runtime",
    title: "a fleet of agents",
    line: "each ship is a part i built.",
    facts: [
      { k: "calls", text: "phone calls to agents, on my romanian speech" },
      { k: "simulate", text: "a fake whatsapp, slack and phone to test an agent first" },
      { k: "channels", text: "discord, teams, a website widget, an openai endpoint" },
      { k: "follow-ups", text: "an agent walks a person through a protocol" },
    ],
    links: [{ label: "invergent-ai/surogates", href: "https://github.com/invergent-ai/surogates" }],
  },
  { id: "surface", m: -50, name: "under", title: "under the surface", facts: [], links: [] },
  {
    id: "whales", m: -1000, name: "the whales",
    tag: "romanian speech · invergent · on hugging face",
    title: "the whales sing in romanian",
    line: "recognition and three voices i trained. no graphics card needed.",
    facts: [],
    links: [
      { label: "jackrabbit-110m-ro", href: "https://huggingface.co/surogate/jackrabbit-110m-ro" },
      { label: "streaming", href: "https://huggingface.co/surogate/jackrabbit-110m-ro-streaming" },
      { label: "amami-357m-ro", href: "https://huggingface.co/surogate/amami-357m-ro" },
    ],
  },
  {
    id: "lab", m: -4000, name: "the lab",
    tag: "superstarling · mine, from an empty repo",
    title: "a lab that runs itself",
    line: "a workspace where ten agents do the work, and nothing goes out until you say yes.",
    facts: [
      { k: "10", text: "agents, led by starling" },
      { k: "31", text: "block types in the pages" },
      { k: "1,200+", text: "server tests" },
    ],
    links: [{ label: "the project", href: "/work/superstarling" }],
  },
  {
    id: "notebook", m: -4000, name: "the lab",
    tag: "the notebook",
    title: "e1 to e105",
    line: "every experiment in one notebook, each with a gate it has to pass.",
    facts: [{ k: "76% → 57%", text: "who struck, once the labels came from the flags. i took the 76% back" }],
    links: [{ label: "when my labels fooled me", href: "/notes/when-my-labels-fooled-me/" }, { label: "all notes", href: "/notes/" }],
  },
  {
    id: "garden", m: -10994, name: "the floor",
    title: "write to me",
    line: "open to remote work in applied ai: speech, video, agents.",
    facts: [],
    links: [
      { label: EMAIL, href: `mailto:${EMAIL}` },
      { label: "cv, research", href: "/cv/" },
      { label: "cv, builder", href: "/cv?v=builder" },
      { label: "github", href: "https://github.com/madalintat" },
      { label: "hugging face", href: "https://huggingface.co/cetusian" },
      { label: "linkedin", href: "https://www.linkedin.com/in/madalin-tatarciuc" },
      { label: "x", href: "https://x.com/cetusian" },
    ],
  },
];
