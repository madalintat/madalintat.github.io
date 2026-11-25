import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { TopBar } from "../layout/Shell";
import { Card, IconFor } from "../components/Card";
import { SCENES, type Icon, type Scene, type SceneId } from "../content/world";
import { startFlock } from "../world/flock";
import { sprite, preload, type Sheet } from "../world/sprite";
import { startCompanion } from "../world/companion";
import { startWater } from "../world/water";
import SHEETS from "../content/sprites.json";
import { startStories } from "../story/engine";
import { IpporuStory } from "../story/IpporuStory";
import { SpeechStory } from "../story/SpeechStory";
import "./sea.css";

const S = Object.fromEntries(SCENES.map((s) => [s.id, s])) as Record<SceneId, Scene>;

/** A painted plate behind a scene: its own upright picture on a phone, never a crop. Loaded as its scene nears. */
// the plates are cached for a week (public/_headers): a new paint of one gets a new address, so no phone keeps the old
const PLATE = (name: string) => `/sea/${name}.webp?v=2`;
function Plate({ name, phone }: { name: string; phone?: string }) {
  return (
    <picture className="plate">
      {phone && <source media="(max-width: 720px)" srcSet={PLATE(phone)} />}
      <img src={PLATE(name)} alt="" width="2064" height="1152" decoding="async" loading="lazy" />
    </picture>
  );
}

/** A full-bleed scene: a plate, what lives on it, and its words, pinned for `beats` screens of scroll. */
function SeaScene({ s, plate, phone, pose, children, words }: { s: Scene; plate: string; phone?: string; pose?: string; children?: ReactNode; words: ReactNode }) {
  return (
    <section id={s.id} data-scene data-m={s.m} data-name={s.name} data-pose={pose} className={`st sea-scene sea-${s.id}`}>
      <div className="st-stage">
        <Plate name={plate} phone={phone} />
        {children}
        <ol className="st-caps sea-caps">{words}</ol>
      </div>
    </section>
  );
}

const SHIPS = [
  { img: "ship-4", label: "follow-ups", x: 6, px: 35, w: 9, d: 0.3 },
  { img: "ship-3", label: "calls", x: 19, px: 43, w: 15, d: 0.4 },
  { img: "ship-1", label: "simulate", x: 31, px: 70, w: 16, d: 0.9 },
  { img: "ship-2", label: "channels", x: 59, px: 77, w: 10, d: 0.55 },
];
// the clouds of the high sky: where, how wide, how fast they rise past the camera
const CLOUDS = [
  { n: 1, x: 4, y: 20, w: 34, k: 40 }, { n: 2, x: 62, y: 12, w: 30, k: 25 }, { n: 4, x: 78, y: 46, w: 12, k: 60 },
  { n: 3, x: 26, y: 64, w: 40, k: 80 }, { n: 5, x: 6, y: 50, w: 8, k: 55 },
];
// what is on this page, in one glance under the name: each line jumps to its chapter (a beat inside a pinned story
// is one screen of scroll from the story's top)
const INDEX: { to: string; beat?: number; icon: Icon; name: string; what: string }[] = [
  { to: "sky", beat: 2, icon: "ipporu", name: "ipporu", what: "where kendoka learn and improve, on video models i trained" },
  { to: "ships", icon: "github", name: "surogate", what: "my job at invergent: ai agents that take calls in romanian" },
  { to: "whales", icon: "hf", name: "speech models", what: "romanian speech recognition, better than whisper at 14x smaller" },
  { to: "lab", icon: "superstarling", name: "superstarling", what: "my company: an ai team i use myself, turning into a product" },
];
function go(id: string, beat = 0) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  scrollTo({ top: el.getBoundingClientRect().top + scrollY + beat * innerHeight + 2, behavior: reduce ? "auto" : "smooth" });
}

// fireflies over the orchard: where (% of the scene), when they start, how slow they drift. Fixed, not random, so the
// prerendered page and the live one agree.
const FLIES = Array.from({ length: 26 }, (_, i) => ({ x: (i * 37 + 11) % 97, y: 30 + ((i * 53) % 60), d: -((i * 7) % 13), s: 9 + ((i * 5) % 8) }));

// the lab's people are superstarling's own agents at work around the room: two talking by the window, three over a
// sketch, two at the whiteboard sticking up the week's plan, and me with Quinn and Nash, showing them my laptop.
// Where each stands (and how near, so how big) is in sea.css, in % of the painting.
const GROUPS = ["agents-talk-1", "agents-board", "agents-talk-2", "me-with-agents"].map((name) => ({ name }));
const SH = SHEETS as Record<string, Sheet>;

/** A sheet's room in the layout before it loads: its frame's ratio (the frames come in as the thing is reached). */
const firstFrame = (s: Sheet): CSSProperties => ({ aspectRatio: `${s.w} / ${s.h}` });

/** A living thing: a sprite sheet, alive once the page runs (sprite.ts). every: reactions it plays on its own, one
    after another, one every so many ms. */
function Sprite({ name, className = "", every }: { name: string; className?: string; every?: [string[], number] }) {
  const ref = useRef<HTMLDivElement>(null), s = SH[name];
  useEffect(() => {
    if (!ref.current || !s) return;
    const el = ref.current, sp = sprite(el, s);
    const rs = (every?.[0] ?? []).map((n) => SH[n]).filter(Boolean);
    if (!rs.length) return () => sp.stop();
    // the reactions load and play only while the sprite is near the screen
    let i = 0, id = 0;
    const io = new IntersectionObserver(([e]) => {
      clearInterval(id);
      if (e.isIntersecting) { preload(...rs); id = window.setInterval(() => sp.react(rs[i++ % rs.length]), every![1]); }
    }, { rootMargin: "50%" });
    io.observe(el);
    return () => { sp.stop(); io.disconnect(); clearInterval(id); };
  }, [s, every]);
  return s ? <div ref={ref} className={`sprite ${className}`} aria-hidden="true" style={firstFrame(s)} /> : null;
}
// the pair in the dojo, one clip with both of them so every strike lands: aka's men, then shiro's kote
const BOUT: [string[], number] = [["kendo-pair-men", "kendo-pair-kote"], 6500];

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

/** On a phone I stand at the bottom of the screen. A scene's closed sheet lifts me to stand on it; a story's words that
    reach down to me make me step out until they are gone, so I never cover what is being read. */
type Box = { top: number; bottom: number; left: number; right: number };
/** Two boxes share some of the screen (a box with no height, a word not laid out, shares none). */
export const overlaps = (a: Box, b: Box) => a.bottom > a.top && a.top < b.bottom && a.bottom > b.top && a.left < b.right && a.right > b.left;
function placeMe(me: HTMLElement, phone: boolean) {
  let lift = 0;
  const held = document.querySelector<HTMLElement>('.st[data-stage="held"]');
  const card = phone ? held?.querySelector<HTMLElement>(".st-caps li.on .card") : null;
  if (card) lift = card.offsetHeight;
  // the figure fills the middle of its frame: only that part has to stay clear of what is being read, which is any
  // story's words and charts on screen, also a story's still sliding in (a hidden beat's are see-through, so skipped)
  const b = me.querySelector(".me-sprite")!.getBoundingClientRect();
  const box = { top: b.top + b.height * 0.2, bottom: b.bottom - b.height * 0.2, left: b.left + b.width * 0.2, right: b.right - b.width * 0.2 };
  const read = [...document.querySelectorAll<HTMLElement>(".st-caps li.on > :not(.card)"), ...document.querySelectorAll<HTMLElement>(".st-screen > *")];
  const crowded = !card && read.some((w) => overlaps(w.getBoundingClientRect(), box) && Number(getComputedStyle(w).opacity) > 0.1);
  me.style.setProperty("--lift", `${lift}px`);
  me.classList.toggle("yield", crowded);
}

export function Home() {
  const flock = useRef<HTMLCanvasElement>(null), gulls = useRef<HTMLCanvasElement>(null), me = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stopStories = startStories();
    const stopFlock = flock.current ? startFlock(flock.current) : () => {};
    const stopGulls = gulls.current ? startFlock(gulls.current, { count: 26, ink: "#f7f5f0", far: "rgba(247,245,240,.6)" }) : () => {};
    const comp = me.current ? startCompanion(me.current, SH) : null;
    // my pose: read off what is under the middle of the screen
    const posed = [...document.querySelectorAll<HTMLElement>("[data-pose]")].filter((e) => e !== me.current);
    let raf = 0;
    const tick = () => {
      raf = 0;
      const phone = innerWidth <= 720;
      let at: HTMLElement | undefined;
      for (const e of posed) { const r = e.getBoundingClientRect(); if (r.top <= innerHeight / 2 && r.bottom > innerHeight / 2) at = e; }
      if (at && comp) { const list = at.dataset.pose!.split(","); comp.set(list[Math.min(list.length - 1, Number(at.dataset.cur ?? 0))]); }
      if (me.current) placeMe(me.current, phone);
    };
    const ask = () => { if (!raf) raf = requestAnimationFrame(tick); };
    tick();
    addEventListener("scroll", ask, { passive: true });
    addEventListener("resize", ask);
    // a scene can change its beat a frame after the scroll that caused it (the engine wakes it as it comes into
    // view): read the pose again whenever a beat changes, not only on scroll
    const beats = new MutationObserver(ask);
    for (const e of posed) beats.observe(e, { attributes: true, attributeFilter: ["data-cur", "data-stage"] });
    return () => { stopStories(); stopFlock(); stopGulls(); comp?.stop(); cancelAnimationFrame(raf); beats.disconnect(); removeEventListener("scroll", ask); removeEventListener("resize", ask); };
  }, []);

  return (
    <div className="sea">
      <TopBar home />

      {/* me, going down the page with the reader */}
      <div className="me" ref={me} data-pose="me-float">
        <div className="me-tilt">{SH["me-float"] && <div className="sprite me-sprite" role="img" aria-label="mădălin, drawn as a character; touch him" style={firstFrame(SH["me-float"])} />}</div>
      </div>

      {/* the sky: the name alone up high, then the camera comes down onto the dojo by the sea */}
      <section id="sky" data-scene data-m={S.sky.m} data-name="sky,the dojo,the dojo" data-pose="me-float,hidden,hidden" className="st sea-scene sea-sky">
        <div className="st-stage">
          <div className="cam" data-at="0.1" data-to="1">
            <div className="high">
              {CLOUDS.map((c) => <img key={c.n} className="cloud" src={`/sea/cloud-${c.n}.webp`} alt="" style={{ left: `${c.x}%`, top: `${c.y}%`, width: `${c.w}%`, "--k": c.k } as CSSProperties} />)}
              <canvas ref={flock} className="flock" aria-hidden="true" />
            </div>
            <div className="low">
              {/* the harbour, then through the dojo's open doors: the scroll zooms in on them and the inside takes over */}
              <div className="zoom" data-at="1.2" data-to="2">
                <Plate name="harbour" phone="harbour-phone" />
                <Water mode="surface" horizon={[0.8, 0.78]} />
              </div>
              <div className="inside" data-at="1.5" data-to="1.88">
                <Plate name="dojo-inside" phone="dojo-inside-phone" />
                <Sprite name="kendo-pair-loop" className="court" every={BOUT} />
              </div>
            </div>
          </div>
          <ol className="st-caps sea-caps">
            <li data-beat={0} className="hero">
              <p className="hero-kind">{S.sky.tag}</p>
              <h1>{S.sky.title}</h1>
              <p className="sea-line">{S.sky.line}</p>
              <nav className="hero-index" aria-label="what is on this page">
                {INDEX.map((x) => (
                  <a key={x.to} href={`#${x.to}`} onClick={(e) => { e.preventDefault(); go(x.to, x.beat); }}>
                    <IconFor i={x.icon} /><b>{x.name}</b><span>{x.what}</span>
                  </a>
                ))}
              </nav>
              <i className="cue" aria-hidden="true" />
            </li>
            <li data-beat={1} className="quiet" aria-hidden="true" />
            <li data-beat={2}><Card s={S.harbour} at={2} /></li>
          </ol>
        </div>
      </section>

      {/* ipporu, model by model: I come off the court in armour, take it off piece by piece, and film the match the
          models read */}
      <div className="sea-under" data-name="the dojo" data-pose="me-kendo>me-record" style={{ "--plate": `url(${PLATE("harbour")})` } as CSSProperties}>
        <IpporuStory />
      </div>

      {/* night into the morning sea: the do and the tare come off, I change, leave the gear and step into the boat */}
      <div className="sea-fade to-day" data-pose="hidden" aria-hidden="true" />

      {/* the seaside: rowing out past the fleet, then in */}
      <SeaScene s={S.ships} plate="sky" phone="sky-phone" pose="me-boat-cap,me-boat-ready"
        words={<>
          <li data-beat={0}><Card s={S.ships} /></li>
          <li data-beat={1}><p className="sea-tag"><b>0 m</b> the surface</p><h2>and then, in.</h2></li>
        </>}>
        <Water mode="surface" />
        <canvas ref={gulls} className="gulls" aria-hidden="true" />
        <div className="fleet" aria-hidden="true">
          {SHIPS.map((sh) => (
            <figure key={sh.img} className="ship" style={{ "--x": sh.x, "--px": sh.px, "--w": sh.w, "--d": sh.d } as CSSProperties}>
              <img src={`/sea/${sh.img}.webp`} alt="" />
              <figcaption data-at="0.3">{sh.label}</figcaption>
            </figure>
          ))}
        </div>
      </SeaScene>

      {/* through the surface */}
      <section id="surface" data-scene data-m={S.surface.m} data-name={S.surface.name} data-pose="me-dive" className="sea-pass" aria-label={S.surface.title}>
        <Plate name="surface" />
      </section>

      {/* the whales: romanian speech; me with them, diving */}
      <SeaScene s={S.whales} plate="deep-water" phone="deep-water-phone" pose="me-scuba"
        words={<><li data-beat={0}><Card s={S.whales} /></li><li data-beat={1}><Card s={S.bench} at={1} /></li></>}>
        <div className="pod">
          {["doina", "tudor", "radu"].map((w) => <div key={w} className={`swim swim-${w}`}><Sprite name={`whale-${w}`} /></div>)}
        </div>
      </SeaScene>
      <div className="sea-under deep" data-name="the whales" data-pose="me-scuba" style={{ "--plate": `url(${PLATE("deep-water")})` } as CSSProperties}>
        <SpeechStory />
      </div>

      {/* up from the deep into the lab: the sea goes on behind its window */}
      <div className="sea-fade to-lab" data-pose="hidden" aria-hidden="true" />

      {/* the lab: superstarling, its agents at work and talking, me among them; the sea outside the window */}
      <SeaScene s={S.lab} plate="lab-v3" phone="lab-v3-phone" pose="hidden"
        words={<>
          <li data-beat={0}><Card s={S.lab} /></li>
        </>}>
        <div className="frame">
          <div className="window">
            <div className="far far-whale"><Sprite name="whale-tudor" /></div>
            <div className="far far-jelly"><Sprite name="jelly" /></div>
            <img className="far far-lantern" src="/sea/lantern.webp" alt="" />
          </div>
          {GROUPS.map((g) => <div key={g.name} className={`group ${g.name}`}><Sprite name={g.name} /></div>)}
        </div>
      </SeaScene>

      {/* out of the lab at dusk, the laptop under my arm, the long way home to the garden */}
      <div className="sea-fade to-garden" data-pose="hidden" aria-hidden="true">
        <i className="path" />
        <div className="walker"><Sprite name="me-walk-home" /></div>
      </div>

      {/* the garden that glows: me in a hammock, and the way to write */}
      <SeaScene s={S.garden} plate="orchard" phone="orchard-phone" pose="hidden" words={<li data-beat={0}><Card s={S.garden} /></li>}>
        {/* the hammock is slung between the two apple trees of the painting itself, so it is placed on the painting */}
        <div className="frame"><div className="hammock"><Sprite name="me-hammock-orchard" /></div></div>
        <div className="flies" aria-hidden="true">
          {FLIES.map((f, i) => <i key={i} style={{ left: `${f.x}%`, top: `${f.y}%`, animationDelay: `${f.d}s, ${f.d / 2}s`, animationDuration: `${f.s}s, ${f.s / 3}s` }} />)}
        </div>
      </SeaScene>
    </div>
  );
}
