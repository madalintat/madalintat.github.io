import { useEffect, useRef, useState } from "react";
import { ChevronUp } from "lucide-react";
import { Sheet } from "../components/Sheet";
import "./story.css";
import { FENCING, IPPORU, type ModelBeat } from "../content/stories";
import { IconFor } from "../components/Card";

/* The engine, one model per beat, pinned while you scroll. Each beat shows its own clip: that model's real output drawn
   on the same all japan 2024 match. Left: what it does in plain words, then what it is, how it learned, how good it
   is, and the bar it was set. After the shinai: its ribbon next to the fencing system it learns from.
   Only the clip on screen plays, and only while the story is in view; the others wait, paused, with their posters. */

type Ribbon = { id: "ribbon" };
type Step = ModelBeat | Ribbon;
const STEPS: Step[] = IPPORU.flatMap((b): Step[] => (b.id === "shinai" ? [b, { id: "ribbon" }] : [b]));
const clipOf = (s: Step) => ("clip" in s ? s.clip : "shinai-ribbon");

function Gate({ g }: { g: ModelBeat["gate"] }) {
  const word = g.met === true ? "passed" : g.met === false ? "not yet" : "no bar";
  return <p className={`ip-gate ${g.met === true ? "yes" : g.met === false ? "no" : "none"}`}><b>{word}</b><span>{g.bar}</span></p>;
}

function Facts({ b }: { b: ModelBeat }) {
  return (
    <dl className="ip-facts">
      <div><dt>what it is</dt><dd>{b.kind}</dd></div>
      <div><dt>how it learned</dt><dd>{b.learned}</dd></div>
      <div><dt>how good</dt><dd>{b.score}</dd></div>
    </dl>
  );
}

function ModelCaption({ b, n }: { b: ModelBeat; n: number }) {
  const [open, setOpen] = useState(false);
  const mark = <p className="st-model"><IconFor i="ipporu" /><span>{String(n).padStart(2, "0")}</span><b>{b.model}</b></p>;
  return (
    <>
      {mark}
      <h3>{b.title}</h3>
      <p>{b.line}</p>
      {b.num && <p className="st-num"><b>{b.num}</b> {b.of}</p>}
      {/* a desktop shows the three rows; a phone keeps the beat to its title, line, number and bar, and opens the rows
          as a sheet when asked */}
      <Facts b={b} />
      <Gate g={b.gate} />
      <button type="button" className="ip-more" aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(true)}>
        <span>how it was made</span><ChevronUp size={15} strokeWidth={1.8} aria-hidden="true" />
      </button>
      <Sheet open={open} onClose={() => setOpen(false)} label={`${b.model}: how it was made`}>
        <div className="ip-sheet">
          {mark}
          <h3>{b.title}</h3>
          <p className="ip-sheet-line">{b.line}</p>
          <Facts b={b} />
          <Gate g={b.gate} />
        </div>
      </Sheet>
    </>
  );
}

function RibbonCaption() {
  const side = (x: { name: string; year: string; rows: string[] }, us = false) => (
    <div className={us ? "us" : ""}>
      <p className="ip-vs-name">{x.name}<span>{x.year}</span></p>
      <div className="ip-vs-rows">{x.rows.map((r) => <p key={r}>{r}</p>)}</div>
    </div>
  );
  return (
    <>
      <p className="st-model"><IconFor i="ipporu" /><span>the shinai, drawn</span><b>shinai ribbon</b></p>
      <h3>a ribbon on every strike, like fencing on tv</h3>
      <p>the grip, guard and tip points become a ribbon that follows the sword, and a flash where it lands. the idea comes from fencing; the way to get there is new.</p>
      <div className="ip-vs">{side(FENCING.them)}{side(FENCING.us, true)}</div>
      <a href={FENCING.them.href}>see the fencing system</a>
    </>
  );
}

export function IpporuStory() {
  const root = useRef<HTMLElement>(null);
  // play the clip of the beat on screen, pause the rest
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let near = false;
    const vids = [...el.querySelectorAll<HTMLVideoElement>(".ip-clips video")];
    const sync = () => {
      const cur = Number(el.dataset.cur ?? 0);
      vids.forEach((v, i) => {
        if (near && i === cur && !reduce) { if (v.preload !== "auto") v.preload = "auto"; v.play().catch(() => {}); } else v.pause();
      });
    };
    // nothing loads or plays until the story is on screen, and everything stops once it is passed
    // the other clips' posters load as the story comes near, not with the page
    const io = new IntersectionObserver(([e]) => {
      near = e.isIntersecting;
      if (near) for (const v of vids) if (!v.getAttribute("poster")) v.poster = v.dataset.poster!;
      sync();
    }, { rootMargin: "100%" });
    io.observe(el);
    const mo = new MutationObserver(sync);
    mo.observe(el, { attributes: true, attributeFilter: ["data-cur"] });
    return () => { mo.disconnect(); io.disconnect(); };
  }, []);
  let n = 0;
  return (
    <section ref={root} className="st ip-story" aria-label="the ipporu engine, model by model">
      <div className="st-stage">
        <i className="st-bar" aria-hidden="true" />
        <ol className="st-caps">
          {STEPS.map((s, i) => (
            <li key={s.id} data-beat={i}>{"clip" in s ? <ModelCaption b={s} n={++n} /> : <RibbonCaption />}</li>
          ))}
        </ol>
        <div className="st-screen ip-clips">
          {STEPS.map((s, i) => (
            <figure key={s.id} className="ip-clip" data-i={i}>
              <video muted loop playsInline preload="none" poster={i === 0 ? `/models/${clipOf(s)}.jpg` : undefined} data-poster={`/models/${clipOf(s)}.jpg`} width={1128} height={520}
                aria-label={"clip" in s ? `${s.title}, its output on the match` : "the shinai ribbon on an 8-dan ippon"}>
                <source src={`/models/${clipOf(s)}.webm`} type="video/webm" />
                <source src={`/models/${clipOf(s)}.mp4`} type="video/mp4" />
              </video>
            </figure>
          ))}
          <p className="ip-credit">footage: all japan kendo federation public streams, name bars cropped. every overlay is the engine's own output.</p>
        </div>
      </div>
    </section>
  );
}
