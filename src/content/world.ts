// The home page: one dive from the sky to the sea floor, one idea a scene. Every number has a source in sources.ts, the model cards or
// the agent reports of 2026-11-24 (superworkspace, kendo_world, surogate cards, invergent-ai/surogates) and
// docs/research/hf-inventory.md + products-inventory.md (433 accounts: ipporu production read 2026-11-24).
// Few words a scene: the detail lives in the two stories (stories.ts), the project pages and the cv.
export type Fact = { k?: string; text: string };
export type Icon = "hf" | "github" | "x" | "ipporu" | "superstarling" | "mail" | "cv" | "play" | "linkedin" | "web";
export type Link = { label: string; href: string; icon?: Icon };
export type SceneId = "sky" | "ships" | "harbour" | "surface" | "whales" | "bench" | "lab" | "garden";
export type Shot = { src: string; alt: string };
/** built: one plain line on how it is engineered, so the card says what it does, what it proved, and how it is made. */
export type Scene = { id: SceneId; m: number; name: string; tag?: string; icon?: Icon; title: string; line?: string; facts: Fact[]; links: Link[]; built?: string; shots?: Shot[] };

export const EMAIL = "madalintat@gmail.com";

export const SCENES: Scene[] = [
  {
    id: "sky", m: 3000, name: "sky",
    tag: "applied ai researcher · builder · romania",
    title: "mădălin tatarciuc",
    line: "i train small ai models that do one job well, and build the products around them.",
    facts: [], links: [],
  },
  {
    id: "harbour", m: 0, name: "the harbour", icon: "ipporu",
    tag: "ipporu · product and research, built alone",
    title: "ipporu: the home of kendo, and the models that watch it",
    line: "every kendoka gets a record and a film room. underneath, video models i trained to watch a match the way a referee does: the strike, the flags, the ippon.",
    facts: [
      { k: "433", text: "kendoka with an account" },
      { k: "1,746", text: "following ipporu on instagram" },
    ],
    built: "i built the site and every kendoka's record, and trained the video models that run under it.",
    shots: [{ src: "/work/shots/ipporu-home.webp", alt: "ipporu.com, the home of kendo" }, { src: "/work/shots/ipporu-record.webp", alt: "a kendoka's page on ipporu: every match and who scored each ippon" }],
    links: [{ label: "how the models work", href: "/work/ipporu", icon: "play" }, { label: "ipporu.com", href: "https://ipporu.com", icon: "ipporu" }],
  },
  {
    id: "ships", m: 0, name: "the fleet", icon: "github",
    tag: "surogate · my job at invergent",
    title: "surogate: ai agents, from the gpu to the phone call",
    line: "invergent's open source stack for ai agents a company runs itself: it trains and serves the models, and runs the agents on top. i started on the gpus, with a training dashboard and the romanian speech models, then built where an agent meets a customer: phone calls in romanian, discord, teams, whatsapp and a website chat, and a simulator where an ai plays the customer before the agent goes live.",
    facts: [
      { k: "training", text: "a terminal dashboard to launch, watch and compare runs on cloud gpus" },
      { k: "phone", text: "agents that answer and make calls in romanian, hearing with my speech model" },
      { k: "channels", text: "discord, teams, whatsapp, telegram and a website widget" },
      { k: "simulate", text: "an ai plays the customer on every channel; a person can step in" },
    ],
    built: "the studio pages that set all of it up, the docs for it, and superstar: the team's own workspace where people and agents run growth together.",
    links: [
      { label: "invergent-ai/surogates", href: "https://github.com/invergent-ai/surogates", icon: "github" },
      { label: "surogate.ai", href: "https://surogate.ai" },
    ],
  },
  { id: "surface", m: -50, name: "under", title: "under the surface", facts: [], links: [] },
  {
    id: "whales", m: -1000, name: "the whales", icon: "hf",
    tag: "hugging face · trained at invergent",
    title: "romanian speech that runs on a laptop",
    line: "jackrabbit hears romanian better than whisper large-v3 at 14 times smaller; amami speaks it in three voices, in real time on a macbook air. trained from data to release, every eval public.",
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
    built: "data cleaning, training and evals on 5090 gpus; streaming inference on a cpu; the voices behind surogates' phone agents.",
  },
  {
    id: "bench", m: -1000, name: "the whales", icon: "hf",
    tag: "hugging face · small models, one job each",
    title: "small models, one job each",
    line: "a wake word in 44k parameters, a 2b model that reads ledgers, an atlas that explains any idea offline. each small enough for a phone or a cpu.",
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
    tag: "superstarling inc · my company",
    title: "superstarling: an ai team for your business and your life",
    line: "one ai team for the shop and for your own week. you ask once, \u201cget the night balm launch ready for thursday\u201d, and ten specialist agents write, design, plan and publish it on your pages and calendar. nothing goes out until you say yes.",
    facts: [
      { k: "you ask", text: "one sentence; starling splits it across the team" },
      { k: "they make", text: "the posts, the emails, the pages and the plan for the week" },
      { k: "you say yes", text: "nothing is published or sent before you approve it" },
    ],
    built: "i designed and built all of it: the app, the agents, and the service that publishes for you.",
    shots: [{ src: "/work/shots/superstarling-app.webp", alt: "superstarling's home: what needs you, drafts to approve, what goes out today" }, { src: "/work/shots/superstarling-shop-done.webp", alt: "sol's shop after one ask: the launch drafted, a sunday off" }],
    links: [{ label: "the project", href: "/work/superstarling", icon: "superstarling" }],
  },
  {
    id: "garden", m: 380, name: "the orchard",
    title: "write to me",
    line: "for a remote role in applied ai, or just to talk models, kendo, chess or a good river to fish.",
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
