import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { TopBar } from "../layout/Shell";
import { SCENES, EXPERIMENTS, type Scene, type SceneId } from "../content/world";
import { depthAt } from "../world/progress";
import { startFlock } from "../world/flock";
import { sprite, type Sheet } from "../world/sprite";
import { startCompanion } from "../world/companion";
import { startWater } from "../world/water";
import SHEETS from "../content/sprites.json";
import { startStories } from "../story/engine";
import { IpporuStory, type StoryData } from "../story/IpporuStory";
import { SpeechStory } from "../story/SpeechStory";
import { IpporuDemo, type DemoData } from "../demo/IpporuDemo";
import demo from "../../public/demo/all-japan-2024.json";
import "./sea.css";

const S = Object.fromEntries(SCENES.map((s) => [s.id, s])) as Record<SceneId, Scene>;
const metres = (m: number) => `${m > 0 ? "+" : m < 0 ? "−" : ""}${Math.abs(m).toLocaleString("en").replace(",", " ")} m`;

/** A painted plate behind a scene: its own upright picture on a phone, never a crop. */
export function Plate({ name, phone, alt = "" }: { name: string; phone?: string; alt?: string }) {
  return (
    <picture className="plate">
      {phone && <source media="(max-width: 720px)" srcSet={`/sea/${phone}.webp`} />}
      <img src={`/sea/${name}.webp`} alt={alt} width="2064" height="1152" decoding="async" />
    </picture>
  );
}

function Go({ href, children }: { href: string; children: ReactNode }) {
  return href.startsWith("/") ? <Link to={href}>{children}</Link> : <a href={href}>{children}</a>;
}

function Words({ s, at = 0, h1 = false }: { s: Scene; at?: number; h1?: boolean }) {
  const T = h1 ? "h1" : "h2";
  return (
    <>
      {s.tag && <p className="sea-tag"><b>{metres(s.m)}</b> {s.tag}</p>}
      <T>{s.title}</T>
      {s.line && <p className="sea-line">{s.line}</p>}
      {s.facts.length > 0 && (
        <dl className="sea-facts">
          {s.facts.map((f, i) => <div key={f.text} data-at={(at + 0.15 + i * 0.1).toFixed(2)}><dt>{f.k}</dt><dd>{f.text}</dd></div>)}
        </dl>
      )}
      {s.links.length > 0 && <p className="sea-links">{s.links.map((l) => <Go key={l.href} href={l.href}>{l.label}</Go>)}</p>}
    </>
  );
}

/** A full-bleed scene: a plate, what lives on it, and its words, pinned for `beats` screens of scroll. */
function SeaScene({ s, plate, phone, pose, className = "", children, words }: { s: Scene; plate: string; phone?: string; pose?: string; className?: string; children?: ReactNode; words: ReactNode }) {
  return (
    <section id={s.id} data-scene data-m={s.m} data-name={s.name} data-pose={pose} className={`st sea-scene sea-${s.id} ${className}`}>
      <div className="st-stage">
        <Plate name={plate} phone={phone} />
        {children}
        <ol className="st-caps sea-caps">{words}</ol>
      </div>
    </section>
  );
}

const SHIPS = [
  { img: "ship-4", label: "follow-ups", x: 12, w: 9, d: 0.3 },
  { img: "ship-3", label: "calls", x: 30, w: 15, d: 0.4 },
  { img: "ship-1", label: "simulate", x: 50, w: 16, d: 0.9 },
  { img: "ship-2", label: "channels", x: 66, w: 10, d: 0.55 },
];
// the clouds of the high sky: where, how wide, how fast they rise past the camera
const CLOUDS = [
  { n: 1, x: 4, y: 20, w: 34, k: 40 }, { n: 2, x: 62, y: 12, w: 30, k: 25 }, { n: 4, x: 78, y: 46, w: 12, k: 60 },
  { n: 3, x: 26, y: 64, w: 40, k: 80 }, { n: 5, x: 6, y: 50, w: 8, k: 55 },
];
// the people in the lab: who, where they start on the floor (frame %), how far they walk, how long a round takes
const PEOPLE = [
  { n: 1, x: 18, span: 22, dur: 34, delay: -3 }, { n: 2, x: 52, span: 16, dur: 28, delay: -17 },
  { n: 3, x: 70, span: 12, dur: 26, delay: -8 }, { n: 4, x: 34, span: 26, dur: 40, delay: -25 }, { n: 5, x: 8, span: 18, dur: 31, delay: -12 },
];
const SH = SHEETS as Record<string, Sheet>;

/** A sheet's room in the layout before it loads: its frame's ratio (the frames come in as the thing is reached). */
const firstFrame = (s: Sheet): CSSProperties => ({ aspectRatio: `${s.w} / ${s.h}` });

/** A living thing: a sprite sheet, alive once the page runs (sprite.ts). every: a reaction it plays on its own now and then. */
function Sprite({ name, className = "", every }: { name: string; className?: string; every?: [string, number] }) {
  const ref = useRef<HTMLDivElement>(null), s = SH[name];
  useEffect(() => {
    if (!ref.current || !s) return;
    const sp = sprite(ref.current, s);
    const r = every && SH[every[0]], id = r ? window.setInterval(() => sp.react(r), every![1]) : 0;
    return () => { sp.stop(); clearInterval(id); };
  }, [s, every]);
  return s ? <div ref={ref} className={`sprite ${className}`} aria-hidden="true" style={firstFrame(s)} /> : null;
}
const OPP_STRIKE: [string, number] = ["kendo-opponent-strike", 9000];

/** The water over a plate: rippling under its horizon (surface), or light from above (caustics). */
function Water({ mode, horizon = [0.707, 0.735] }: { mode: "surface" | "caustics"; horizon?: [number, number] }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const img = c.parentElement!.querySelector<HTMLImageElement>(".plate img");
    if (mode === "surface" && img) return startWater(c, { mode, img, horizon: () => (innerWidth <= 720 ? horizon[1] : horizon[0]) });
    if (mode === "caustics") return startWater(c, { mode });
  }, [mode, horizon]);
  return <canvas ref={ref} className={`water ${mode}`} aria-hidden="true" />;
}

export function Home() {
  const flock = useRef<HTMLCanvasElement>(null), me = useRef<HTMLDivElement>(null);
  const alt = useRef<HTMLSpanElement>(null), rail = useRef<HTMLElement>(null), name = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const stopStories = startStories();
    const stopFlock = flock.current ? startFlock(flock.current) : () => {};
    const comp = me.current ? startCompanion(me.current, SH) : null;
    // the depth gauge and my pose: both read off what is under the middle of the screen
    const scenes = [...document.querySelectorAll<HTMLElement>("[data-scene]")];
    const posed = [...document.querySelectorAll<HTMLElement>("[data-pose]")].filter((e) => e !== me.current);
    let raf = 0;
    const tick = () => {
      raf = 0;
      const mid = scrollY + innerHeight / 2;
      const marks = scenes.map((s) => [s.offsetTop + s.offsetHeight / 2, Number(s.dataset.m)] as [number, number]);
      if (alt.current) alt.current.textContent = metres(depthAt(marks, mid));
      if (rail.current) rail.current.style.setProperty("--g", String(Math.min(1, scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight))));
      let cur = scenes[0];
      for (const s of scenes) if (s.offsetTop <= mid) cur = s;
      if (name.current && cur) name.current.textContent = cur.dataset.name ?? "";
      let at: HTMLElement | undefined;
      for (const e of posed) { const r = e.getBoundingClientRect(); if (r.top <= innerHeight / 2 && r.bottom > innerHeight / 2) at = e; }
      if (at && comp) { const list = at.dataset.pose!.split(","); comp.set(list[Math.min(list.length - 1, Number(at.dataset.cur ?? 0))]); }
    };
    const ask = () => { if (!raf) raf = requestAnimationFrame(tick); };
    tick();
    addEventListener("scroll", ask, { passive: true });
    addEventListener("resize", ask);
    return () => { stopStories(); stopFlock(); comp?.stop(); cancelAnimationFrame(raf); removeEventListener("scroll", ask); removeEventListener("resize", ask); };
  }, []);

  return (
    <div className="sea">
      <TopBar />
      <div className="gauge" aria-hidden="true">
        <span className="val" ref={alt}>+3 000 m</span>
        <span className="rail" ref={rail}><i /></span>
        <span className="name" ref={name}>sky</span>
      </div>

      {/* me, going down the page with the reader */}
      <div className="me" ref={me} data-pose="me-float">
        <div className="me-tilt">{SH["me-float"] && <div className="sprite me-sprite" role="img" aria-label="mădălin, drawn as a character; touch him" style={firstFrame(SH["me-float"])} />}</div>
      </div>

      {/* the sky: the name alone up high, then the camera comes down onto the dojo by the sea */}
      <section id="sky" data-scene data-m={S.sky.m} data-name="sky" data-pose="me-float,me-kendo" className="st sea-scene sea-sky">
        <div className="st-stage">
          <div className="cam" data-at="0.1" data-to="1">
            <div className="high">
              {CLOUDS.map((c) => <img key={c.n} className="cloud" src={`/sea/cloud-${c.n}.webp`} alt="" style={{ left: `${c.x}%`, top: `${c.y}%`, width: `${c.w}%`, "--k": c.k } as CSSProperties} />)}
              <canvas ref={flock} className="flock" aria-hidden="true" />
            </div>
            <div className="low">
              <Plate name="harbour" phone="harbour-phone" />
              <Water mode="surface" horizon={[0.8, 0.78]} />
              <Sprite name="kendo-opponent" className="opponent" every={OPP_STRIKE} />
            </div>
          </div>
          <ol className="st-caps sea-caps">
            <li data-beat={0} className="hero">
              <p className="sea-tag">{S.sky.tag}</p>
              <h1>{S.sky.title}</h1>
              <p className="sea-line">{S.sky.line}</p>
              <p className="down" aria-hidden="true"><span>into the sea</span><i /></p>
            </li>
            <li data-beat={1}><Words s={S.harbour} at={1} /></li>
          </ol>
        </div>
      </section>

      {/* ipporu, model by model, then all of it on one match: me on the side, filming */}
      <div className="sea-under" data-pose="me-record" style={{ "--plate": "url(/sea/harbour.webp)" } as CSSProperties}>
        <IpporuStory data={demo as unknown as StoryData} />
        <section className="together" aria-label="the ipporu engine, all together">
          <p className="st-step">all together</p>
          <h2>every model, on the same match</h2>
          <IpporuDemo src="/demo/all-japan-2024.mp4" poster="/demo/all-japan-2024.jpg" data={demo as DemoData} />
        </section>
      </div>

      {/* the seaside: rowing out past the fleet, then in */}
      <SeaScene s={S.ships} plate="sky" phone="sky-phone" pose="me-boat,me-dive" className="sea-ships"
        words={<>
          <li data-beat={0}><Words s={S.ships} /></li>
          <li data-beat={1}><p className="sea-tag"><b>0 m</b> the surface</p><h2>and then, in.</h2></li>
        </>}>
        <Water mode="surface" />
        <div className="fleet" aria-hidden="true">
          {SHIPS.map((sh) => (
            <figure key={sh.img} className="ship" style={{ "--x": sh.x, "--w": sh.w, "--d": sh.d } as CSSProperties}>
              <img src={`/sea/${sh.img}.webp`} alt="" />
              <figcaption data-at="0.3">{sh.label}</figcaption>
            </figure>
          ))}
        </div>
      </SeaScene>

      {/* through the surface */}
      <section id="surface" data-scene data-m={S.surface.m} data-name={S.surface.name} data-pose="me-dive" className="sea-pass" aria-label={S.surface.title}>
        <Plate name="surface" />
        <Water mode="caustics" />
      </section>

      {/* the whales: romanian speech; me with them, diving */}
      <SeaScene s={S.whales} plate="deep-water" phone="deep-water-phone" pose="me-scuba" className="sea-whales"
        words={<li data-beat={0}><Words s={S.whales} /></li>}>
        <Water mode="caustics" />
        <div className="pod">
          {["doina", "tudor", "radu"].map((w) => <div key={w} className={`swim swim-${w}`}><Sprite name={`whale-${w}`} /></div>)}
        </div>
      </SeaScene>
      <div className="sea-under deep" data-pose="me-scuba" style={{ "--plate": "url(/sea/deep-water.webp)" } as CSSProperties}>
        <SpeechStory />
      </div>

      {/* the lab: superstarling, people at work, the sea outside the window; then the notebook; me at my laptop */}
      <SeaScene s={S.lab} plate="lab" phone="lab-phone" pose="me-laptop" className="sea-lab"
        words={<>
          <li data-beat={0}><Words s={S.lab} /></li>
          <li data-beat={1}><Words s={S.notebook} at={1} />
            <ol className="strata" aria-label={`${EXPERIMENTS.length} notebook entries, e1 to e105`}>
              {Array.from({ length: 105 }, (_, i) => i + 1).map((n) => (
                <li key={n} className={`${EXPERIMENTS.includes(n) ? "on" : ""}${n === 101 ? " hit" : ""}`} title={`e${n}`} />
              ))}
            </ol>
          </li>
        </>}>
        <div className="frame">
          <div className="window">
            <div className="far far-whale"><Sprite name="whale-tudor" /></div>
            <div className="far far-jelly"><Sprite name="jelly" /></div>
            <img className="far far-lantern" src="/sea/lantern.webp" alt="" />
          </div>
          {PEOPLE.map((p) => (
            <span key={p.n} className="person" style={{ left: `${p.x}%`, "--span": p.span, animationDuration: `${p.dur}s`, animationDelay: `${p.delay}s` } as CSSProperties}>
              <Sprite name={`person${p.n}`} />
            </span>
          ))}
        </div>
      </SeaScene>

      {/* the garden that glows: me in a hammock, and the way to write */}
      <SeaScene s={S.garden} plate="garden" phone="garden-phone" pose="me-hammock" className="sea-garden" words={<li data-beat={0}><Words s={S.garden} /></li>}>
        <Water mode="caustics" />
        <div className="glow" aria-hidden="true">
          <div className="drift d1"><Sprite name="jelly" /></div>
          <div className="drift d2"><Sprite name="jelly" /></div>
        </div>
      </SeaScene>
    </div>
  );
}
