import { useRef, useState, type KeyboardEvent } from "react";
import type { Work } from "../content/types";
import "./walk.css";

type Walk = NonNullable<Work["walk"]>;

// One step at a time: numbered tabs, one panel. Every panel is in the html, so without js the first one shows
// and the rest are still there for search and screen readers.
export function Walk({ id, walk }: { id: string; walk: Walk }) {
  const [on, setOn] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const n = walk.steps.length;
  const pick = (i: number) => { const k = (i + n) % n; setOn(k); tabs.current[k]?.focus(); };
  const keys = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") pick(on + 1);
    else if (e.key === "ArrowLeft") pick(on - 1);
    else if (e.key === "Home") pick(0);
    else if (e.key === "End") pick(n - 1);
    else return;
    e.preventDefault();
  };

  return (
    <figure className="walk">
      <figcaption>{walk.title}</figcaption>
      <div className="walk-tabs" role="tablist" aria-label={walk.title} onKeyDown={keys}>
        {walk.steps.map((s, i) => (
          <button
            key={s.name}
            ref={(el) => { tabs.current[i] = el; }}
            type="button"
            role="tab"
            id={`${id}-tab-${i}`}
            aria-controls={`${id}-step-${i}`}
            aria-selected={i === on}
            tabIndex={i === on ? 0 : -1}
            className={i < on ? "done" : undefined}
            onClick={() => setOn(i)}
          >
            <i>{String(i + 1).padStart(2, "0")}</i>{s.name}
          </button>
        ))}
      </div>
      {walk.steps.map((s, i) => (
        <div key={s.name} className={`walk-step${s.shot ? " has-shot" : ""}`} role="tabpanel" id={`${id}-step-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={i !== on}>
          <div className="walk-text">
            <p>{s.body}</p>
            {s.mine && <p className="walk-mine"><b>mine</b>{s.mine}</p>}
            {i < n - 1 && <button type="button" className="walk-next" onClick={() => pick(i + 1)}>{walk.steps[i + 1].name} →</button>}
          </div>
          {s.shot && <img src={s.shot.src} alt={s.shot.alt} width={s.shot.w} height={s.shot.h} loading="lazy" decoding="async" />}
        </div>
      ))}
    </figure>
  );
}

export function Crew({ crew }: { crew: NonNullable<Work["crew"]> }) {
  return (
    <ul className="crew">
      {crew.map((c) => (
        <li key={c.name}>
          <img src={c.face} alt="" width={64} height={64} loading="lazy" decoding="async" />
          <b>{c.name}</b>
          <span>{c.role}</span>
        </li>
      ))}
    </ul>
  );
}
