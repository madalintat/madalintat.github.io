import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { lastBefore, stepMoment, waveBars, type DemoEvent } from "./events";
import { PauseIcon, PlayIcon } from "../components/icons";
import "./demo.css";

type Layers = { wave: number[]; cracks: [number, number][]; maai: [number, number][]; foot: [number, string, string][] };
export type DemoData = { title: string; sub: string; source: string; heldOut: boolean; dur: number; events: DemoEvent[]; layers?: Layers };
type Lane = "sound" | "maai" | "foot" | "strike" | "flag" | "ippon";

export const clock = (t: number) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`;

const describe = (e: DemoEvent) =>
  e.kind === "strike" ? `strike by ${e.side}, ${Math.round((e.conf ?? 0) * 100)}% sure`
  : e.kind === "ippon" ? `ippon: ${e.waza} by ${e.side}`
  : `flag: ${e.colour}`;

// one row per model in the chain, top to bottom in the order the engine runs them
const LANES: { id: Lane; name: string; note: string }[] = [
  { id: "sound", name: "sound", note: "loudness and cracks" },
  { id: "maai", name: "tracker", note: "the gap between them" },
  { id: "foot", name: "pose", note: "a stamp in, a step back" },
  { id: "strike", name: "strike finder", note: "brighter is surer" },
  { id: "flag", name: "flag reader", note: "the referees' flags" },
  { id: "ippon", name: "ippon", note: "flags and tasuki say who" },
];

const LEAD = 1.5; // land just before a moment, so you see it happen

export function IpporuDemo({ src, poster, data }: { src: string; poster: string; data: DemoData }) {
  const video = useRef<HTMLVideoElement>(null);
  const tracks = useRef<HTMLDivElement>(null);
  const [now, setNow] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const [hover, setHover] = useState<number | null>(null);
  const [picked, setPicked] = useState<DemoEvent | null>(null);
  const { dur, events, layers } = data;
  const at = (t: number) => `${Math.min(100, Math.max(0, (t / dur) * 100))}%`;

  const current = lastBefore(events, now);
  const ippon = lastBefore(events.filter((e) => e.kind === "ippon"), now, 3);
  const ippons = events.filter((e) => e.kind === "ippon");

  // the playhead follows the video every frame while it plays, not just on the 4 Hz timeupdate
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    let raf = 0;
    const loop = () => { setNow(v.currentTime); raf = requestAnimationFrame(loop); };
    const on = () => { setPlaying(true); cancelAnimationFrame(raf); raf = requestAnimationFrame(loop); };
    const off = () => { setPlaying(false); cancelAnimationFrame(raf); setNow(v.currentTime); };
    const seeked = () => setNow(v.currentTime);
    v.addEventListener("play", on);
    v.addEventListener("pause", off);
    v.addEventListener("ended", off);
    v.addEventListener("seeked", seeked);
    return () => { cancelAnimationFrame(raf); v.removeEventListener("play", on); v.removeEventListener("pause", off); v.removeEventListener("ended", off); v.removeEventListener("seeked", seeked); };
  }, []);

  const seek = useCallback((t: number, play = false) => {
    const v = video.current;
    const to = Math.max(0, Math.min(dur, t));
    setNow(to);
    if (!v || failed) return;
    v.currentTime = to;
    if (play) v.play().catch(() => {});
  }, [dur, failed]);

  const go = (e: DemoEvent | undefined) => { if (!e) return; setPicked(e); seek(e.t - LEAD, true); };
  const toggle = () => {
    const v = video.current;
    if (!v || failed) return;
    if (v.paused) v.play().catch(() => {}); else v.pause();
  };

  const timeAt = (x: number) => {
    const r = tracks.current!.getBoundingClientRect();
    return ((x - r.left) / r.width) * dur;
  };
  const down = (e: PointerEvent<HTMLDivElement>) => { e.currentTarget.setPointerCapture(e.pointerId); setPicked(null); seek(timeAt(e.clientX)); };
  const move = (e: PointerEvent<HTMLDivElement>) => {
    const t = timeAt(e.clientX);
    setHover(t);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) seek(t);
  };

  const keys = (e: KeyboardEvent) => {
    if (e.key === " " && (e.target as HTMLElement).closest("button, summary, a")) return; // the control's own click handles it
    const from = picked?.t ?? now;
    if (e.key === " " || e.key === "k") toggle();
    else if (e.key === "ArrowRight" && e.shiftKey) go(stepMoment(events, from, 1));
    else if (e.key === "ArrowLeft" && e.shiftKey) go(stepMoment(events, from, -1));
    else if (e.key === "ArrowRight") { setPicked(null); seek(now + 2); }
    else if (e.key === "ArrowLeft") { setPicked(null); seek(now - 2); }
    else return;
    e.preventDefault();
  };

  const lit = (id: Lane) => current?.kind === id || (id === "foot" && layers?.foot.some(([t]) => now >= t && now - t < 0.8));
  const maaiTop = layers ? Math.max(...layers.maai.map(([, v]) => v)) : 1;
  const crackTop = layers ? Math.max(...layers.cracks.map(([, d]) => d)) : 1;

  return (
    <section className="demo" id="demo" aria-label="the ipporu engine on a match" onKeyDown={keys}>
      <header className="demo-head">
        <h2>the engine on one match</h2>
        <p>{data.title}, {data.sub}. each row under the video is one model in the chain, and every mark on it is that model's call, not mine. press play, pick an ippon, or drag along the rows.</p>
      </header>

      <div className={`rp-stage${playing ? " is-playing" : ""}`}>
        {failed ? (
          <img src={poster} alt="the match, at the first ippon" />
        ) : (
          <video ref={video} src={src} poster={poster} muted playsInline preload="auto" onClick={toggle} onError={() => setFailed(true)} aria-label={`${data.title}, ${data.sub}`} />
        )}
        <p className={`rp-call ${current?.kind ?? "idle"} ${current?.side ?? ""}`} aria-live="polite">
          {current ? <><time>{clock(current.t)}</time> {describe(current)}</> : "the engine's call shows here"}
        </p>
        {ippon && (
          <p className={`rp-ippon ${ippon.side}`} key={ippon.t} aria-hidden="true">
            <b>ippon</b><span>{ippon.waza}, {ippon.side}</span>
          </p>
        )}
        {!playing && !failed && (
          <button type="button" className="rp-big" onClick={toggle} aria-label="play the match"><PlayIcon /></button>
        )}
      </div>
      {failed && <p className="demo-note">the video did not load. the calls below still hold.</p>}

      <div className="rp-bar">
        <button type="button" className="rp-play" onClick={toggle} aria-label={playing ? "pause" : "play"} disabled={failed}>
          {playing ? <PauseIcon /> : <PlayIcon />}
        </button>
        <span className="rp-time"><b>{clock(now)}</b> / {clock(dur)}</span>
        <span className="rp-step">
          <button type="button" onClick={() => go(stepMoment(events, picked?.t ?? now, -1))} aria-label="previous call">‹ call</button>
          <button type="button" onClick={() => go(stepMoment(events, picked?.t ?? now, 1))} aria-label="next call">call ›</button>
        </span>
        <span className="rp-moments">
          {ippons.map((e, i) => (
            <button key={e.t} type="button" className={picked === e ? "is-on" : undefined} onClick={() => go(e)}>
              ippon {i + 1} <time>{clock(e.t)}</time> {e.waza}
            </button>
          ))}
        </span>
      </div>

      {layers && (
        <div className="rp-lanes">
          <ul className="rp-names">
            {LANES.map((l) => (
              <li key={l.id} className={lit(l.id) ? "lit" : undefined}><b>{l.name}</b><span>{l.note}</span></li>
            ))}
          </ul>
          <div
            ref={tracks}
            className="rp-tracks"
            role="slider"
            tabIndex={0}
            aria-label="the match timeline"
            aria-valuemin={0}
            aria-valuemax={dur}
            aria-valuenow={Math.round(now)}
            aria-valuetext={`${clock(now)} of ${clock(dur)}`}
            onPointerDown={down}
            onPointerMove={move}
            onPointerLeave={() => setHover(null)}
          >
            <div className="lane sound">
              <svg viewBox={`0 0 ${layers.wave.length} 1`} preserveAspectRatio="none" aria-hidden="true"><path d={waveBars(layers.wave)} /></svg>
              {layers.cracks.map(([t, d]) => <i key={t} className="crack" style={{ left: at(t), opacity: 0.25 + 0.75 * (d / crackTop) }} />)}
            </div>
            <div className="lane maai">
              <svg viewBox={`0 0 ${dur} 1`} preserveAspectRatio="none" aria-hidden="true">
                <polyline points={layers.maai.map(([t, v]) => `${t},${(1 - v / maaiTop) * 0.8 + 0.1}`).join(" ")} />
              </svg>
            </div>
            <div className="lane foot">
              {layers.foot.map(([t, side, kind], i) => <i key={i} className={`step ${side} ${kind}`} style={{ left: at(t) }} title={`${clock(t)} ${kind}, ${side}`} />)}
            </div>
            {(["strike", "flag", "ippon"] as const).map((kind) => (
              <div key={kind} className={`lane ${kind}`}>
                {events.filter((e) => e.kind === kind).map((e) => (
                  <i key={e.t} className={`mark ${e.side ?? ""}`} style={{ left: at(e.t), opacity: kind === "strike" ? 0.35 + 0.65 * (e.conf ?? 0) : undefined }}>
                    {kind === "ippon" && e.letter}
                  </i>
                ))}
              </div>
            ))}
            <span className="ahead" style={{ left: at(now) }} />
            <span className="head" style={{ left: at(now) }} />
            {hover !== null && <span className="ghost" style={{ left: at(hover) }}><time>{clock(Math.max(0, hover))}</time></span>}
          </div>
        </div>
      )}

      <details className="rp-list">
        <summary>every call, as a list</summary>
        <ol className="events">
          {events.map((e, i) => (
            <li key={i} className={`ev ${e.kind} ${e.side ?? ""}${current === e ? " is-now" : ""}`}>
              <button type="button" onClick={() => go(e)}>
                <time>{clock(e.t)}</time>
                <span>{describe(e)}</span>
              </button>
            </li>
          ))}
        </ol>
      </details>

      <p className="demo-credit">
        footage: <a href={data.source}>all japan kendo championships 2024, public stream</a>; name bar cropped. engine output: ipporu. keys: space plays, ← → move 2 s, shift ← → jump call to call.
        {!data.heldOut && " this is not a held-out match: it appears in the tracking experiments."}
      </p>
    </section>
  );
}
