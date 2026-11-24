import type { CSSProperties } from "react";
import "./story.css";
import { IPPORU } from "../content/stories";
import type { DemoData } from "../demo/IpporuDemo";

type Layers = { wave: number[]; cracks: [number, number][]; maai: [number, number][]; foot: [number, "aka" | "shiro", string][] };
export type StoryData = DemoData & { layers: Layers };

// the timeline: 10 units a second, one lane per model
const X = (t: number) => (t * 10).toFixed(1);
const W = 790;
const LANE = { sound: 0, track: 1, feet: 2, flags: 3, strike: 4, ippon: 5 } as const;
const LH = 34, TOP = 6;
const y0 = (l: keyof typeof LANE) => TOP + LANE[l] * LH;
const beat = (id: string) => IPPORU.findIndex((b) => b.id === id);
const at = (b: number, len = 0.55) => ({ "data-at": (b + 0.08).toFixed(2), "data-to": (b + 0.08 + len).toFixed(2) });

function Timeline({ d }: { d: StoryData }) {
  const L = d.layers;
  const maxW = Math.max(...L.wave);
  const wave = "M0 " + (y0("sound") + 26) + L.wave.map((v, i) => ` L${(i / 2).toFixed(1)} ${(y0("sound") + 26 - (v / maxW) * 22).toFixed(1)}`).join("");
  const maai = L.maai.map(([t, v], i) => `${i ? "L" : "M"}${X(t)} ${(y0("track") + 28 - Math.min(1, v / 3) * 24).toFixed(1)}`).join(" ");
  const strikes = d.events.filter((e) => e.kind === "strike");
  const flags = d.events.filter((e) => e.kind === "flag");
  const ippon = d.events.filter((e) => e.kind === "ippon");
  return (
    <svg className="ip-time" viewBox={`-74 0 ${W + 80} ${TOP + 6 * LH + 8}`} role="img" aria-label="the match timeline, one lane per model">
      {(Object.keys(LANE) as (keyof typeof LANE)[]).map((l) => (
        <g key={l} className="lane" data-lane={l}>
          <line x1="0" x2={W} y1={y0(l) + 28} y2={y0(l) + 28} />
          <text x="-10" y={y0(l) + 24} textAnchor="end">{l}</text>
        </g>
      ))}
      <g className="ly ly-sound" {...at(beat("sound"), 0.7)}>
        <path className="draw" pathLength={1} d={wave} />
        {L.cracks.map(([t, db]) => <line key={t} className="crack" x1={X(t)} x2={X(t)} y1={y0("sound") + 28} y2={y0("sound") + 28 - Math.min(26, db / 2.6)} />)}
      </g>
      <g className="ly ly-track" {...at(beat("track"), 0.7)}>
        <path className="draw" pathLength={1} d={maai} />
      </g>
      <g className="ly ly-feet" {...at(beat("sides"))}>
        {L.foot.map(([t, side, kind]) => <circle key={t + side} className={`mk ${side}`} cx={X(t)} cy={y0("feet") + 20} r={kind === "fumikomi" ? 5 : 3} />)}
      </g>
      <g className="ly ly-flags" {...at(beat("flags"))}>
        {flags.map((e) => <rect key={e.t} className="mk shiro" x={Number(X(e.t)) - 5} y={y0("flags") + 10} width="10" height="16" />)}
      </g>
      <g className="ly ly-strike" {...at(beat("strike"))}>
        {strikes.map((e) => <circle key={e.t} className={`mk ${e.kind === "strike" ? e.side : ""}`} cx={X(e.t)} cy={y0("strike") + 20} r="6" />)}
      </g>
      <g className="ly ly-ippon" {...at(beat("ippon"))}>
        {ippon.map((e) => (
          <g key={e.t} className={`ip ${e.kind === "ippon" ? e.side : ""}`}>
            <line x1={X(e.t)} x2={X(e.t)} y1={y0("sound")} y2={y0("ippon") + 28} />
            <circle cx={X(e.t)} cy={y0("ippon") + 18} r="9" />
          </g>
        ))}
      </g>
    </svg>
  );
}

/** The engine, one model per beat on one match, pinned while you scroll. */
export function IpporuStory({ data }: { data: StoryData }) {
  return (
    <section className="st ip-story" aria-label="the ipporu engine, model by model">
      <div className="st-stage">
        <i className="st-bar" aria-hidden="true" />
        <ol className="st-caps">
          {IPPORU.map((b, i) => (
            <li key={b.id} data-beat={i}>
              <p className="st-step">{i ? `model ${i}` : "the match"}</p>
              <h3>{b.title}</h3>
              <p>{b.line}</p>
              {b.num && <p className="st-num"><b data-num data-at={i + 0.15} data-to={i + 0.7}>{b.num}</b> {b.of}</p>}
              {b.link && <a href={b.link.href}>{b.link.label}</a>}
            </li>
          ))}
        </ol>
        <div className="st-screen">
          <figure className="ip-frame">
            <img src="/demo/all-japan-2024.jpg" alt="the match: two kendoka in the first round of the all japan championships 2024" width="960" height="540" />
            <figcaption>
              <span className="tag" data-at={beat("sides") + 0.1}><i className="dot aka" />aka</span>
              <span className="tag" data-at={beat("sides") + 0.1}><i className="dot shiro" />shiro</span>
            </figcaption>
          </figure>
          <Timeline d={data} />
          <div className="ip-who" data-at={beat("who") + 0.1} style={{ "--a": 57, "--b": 58 } as CSSProperties}>
            <p><span>my model</span><i /><b>57%</b></p>
            <p><span>always aka</span><i /><b>58%</b></p>
          </div>
        </div>
      </div>
    </section>
  );
}
