import "./chain.css";

// A left-to-right chain of named steps, drawn in tokens. `ships` marks the steps on the path that ships.
export type Step = { name: string; note?: string; ships?: boolean };

export function Chain({ title, steps }: { title: string; steps: Step[] }) {
  return (
    <figure className="chain">
      <ol>
        {steps.map((s) => (
          <li key={s.name} className={s.ships ? "ships" : undefined}>
            <b>{s.name}</b>
            {s.note && <span>{s.note}</span>}
          </li>
        ))}
      </ol>
      <figcaption>{title}</figcaption>
    </figure>
  );
}

export const FIGURES: Record<string, { title: string; steps: Step[] }> = {
  ipporu: {
    title: "the ipporu engine, one match at a time. the marked steps ship today",
    steps: [
      { name: "tracker", note: "the two kendoka", ships: true },
      { name: "pose", note: "per frame" },
      { name: "strike finder", note: "crack + clip model" },
      { name: "flag reader", note: "the referees' flags", ships: true },
      { name: "ippon", note: "flags + tasuki decide who", ships: true },
      { name: "who struck", note: "at chance on clean labels" },
      { name: "shinai fit", note: "keypoints" },
      { name: "ribbon", note: "the replay", ships: true },
    ],
  },
  speech: {
    title: "both directions run on a CPU",
    steps: [
      { name: "audio", ships: true },
      { name: "parakeet 110M", note: "fine-tuned for romanian", ships: true },
      { name: "ctc + 4-gram", note: "or cached streaming", ships: true },
      { name: "text", ships: true },
      { name: "magpie 357M", note: "doina, tudor, radu", ships: true },
      { name: "speech", ships: true },
    ],
  },
  surogates: {
    title: "the surogate loop. every step ships",
    steps: [
      { name: "sessions", note: "become datasets", ships: true },
      { name: "train", note: "small experts, on the engine", ships: true },
      { name: "serve", note: "the models, and speech", ships: true },
      { name: "surogates", note: "runs the agents", ships: true },
      { name: "nine channels", note: "a phone call to web chat", ships: true },
      { name: "studio", note: "sets up, bills, watches", ships: true },
    ],
  },
};
