import { useEffect, useRef, useState } from "react";
import { lastBefore, type DemoEvent } from "./events";
import "./demo.css";

export type DemoData = { title: string; sub: string; source: string; heldOut: boolean; dur: number; events: DemoEvent[] };
type Kind = DemoEvent["kind"];

export const clock = (t: number) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`;

const describe = (e: DemoEvent) =>
  e.kind === "strike" ? `strike by ${e.side}, ${Math.round((e.conf ?? 0) * 100)}% sure`
  : e.kind === "ippon" ? `ippon: ${e.waza} by ${e.side}`
  : `flag: ${e.colour}`;

const LAYERS: { kind: Kind; label: string }[] = [
  { kind: "strike", label: "strikes" },
  { kind: "ippon", label: "ippon" },
  { kind: "flag", label: "flags" },
];

export function IpporuDemo({ src, poster, data }: { src: string; poster: string; data: DemoData }) {
  const video = useRef<HTMLVideoElement>(null);
  const [now, setNow] = useState(0);
  const [failed, setFailed] = useState(false);
  const [on, setOn] = useState<Record<Kind, boolean>>({ strike: true, ippon: true, flag: true });

  const shown = data.events.filter((e) => on[e.kind]);
  const current = lastBefore(shown, now);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    const tick = () => setNow(v.currentTime);
    v.addEventListener("timeupdate", tick);
    return () => v.removeEventListener("timeupdate", tick);
  }, []);

  const jump = (t: number) => {
    const v = video.current;
    if (!v || failed) return;
    v.currentTime = Math.max(0, t - 1.5); // land just before the moment, so you see it happen
    v.play().catch(() => {});
  };

  return (
    <section className="demo" id="demo" aria-label="the ipporu engine on a match">
      <header>
        <h2>the engine on a match</h2>
        <p>{data.title}, {data.sub}. every mark below came out of the engine, not from me.</p>
      </header>

      <div className="stage">
        {failed ? (
          <img src={poster} alt="the match, at the first ippon" />
        ) : (
          <video ref={video} src={src} poster={poster} controls muted playsInline preload="metadata" onError={() => setFailed(true)} />
        )}
      </div>
      <p className={`now ${current?.kind ?? ""} ${current?.side ?? ""}`} aria-live="polite">
        {current ? `${clock(current.t)}  ${describe(current)}` : "play it, or pick a moment below"}
      </p>
      {failed && <p className="note">the video did not load. the events below still hold.</p>}

      <div className="track" aria-hidden="true">
        {shown.map((e, i) => (
          <span key={i} className={`mark ${e.kind} ${e.side ?? ""}`} style={{ left: `${(e.t / data.dur) * 100}%` }} />
        ))}
        <span className="head" style={{ left: `${(now / data.dur) * 100}%` }} />
      </div>

      <div className="layers" role="group" aria-label="show">
        {LAYERS.map((l) => (
          <button key={l.kind} type="button" aria-pressed={on[l.kind]} onClick={() => setOn({ ...on, [l.kind]: !on[l.kind] })}>
            {l.label}
          </button>
        ))}
      </div>

      <ol className="events">
        {data.events.map((e, i) => (
          <li key={i} className={`ev ${e.kind} ${e.side ?? ""}${on[e.kind] ? "" : " off"}${current === e ? " is-now" : ""}`}>
            <button type="button" onClick={() => jump(e.t)} aria-label={`jump to ${describe(e)} at ${clock(e.t)}`}>
              <time>{clock(e.t)}</time>
              <span>{describe(e)}</span>
            </button>
          </li>
        ))}
      </ol>

      <p className="credit">
        footage: <a href={data.source}>all japan kendo championships 2024, public stream</a>; name bar cropped. engine output: ipporu.
        {!data.heldOut && " this is not a held-out match: it appears in the tracking experiments."}
      </p>
    </section>
  );
}
