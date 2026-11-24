import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { TopBar } from "../layout/Shell";
import { SCENES, EXPERIMENTS, type Scene, type SceneId } from "../content/world";
import { depthAt } from "../world/progress";
import { startFlock } from "../world/flock";
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
function SeaScene({ s, plate, phone, className = "", children, words }: { s: Scene; plate: string; phone?: string; className?: string; children?: ReactNode; words: ReactNode }) {
  return (
    <section id={s.id} data-scene data-m={s.m} data-name={s.name} className={`st sea-scene sea-${s.id} ${className}`}>
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

export function Home() {
  const flock = useRef<HTMLCanvasElement>(null);
  const alt = useRef<HTMLSpanElement>(null), rail = useRef<HTMLElement>(null), name = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const stopStories = startStories();
    const stopFlock = flock.current ? startFlock(flock.current) : () => {};
    // the depth gauge: metres between the scenes' middles, the scene under the middle of the screen
    const scenes = [...document.querySelectorAll<HTMLElement>("[data-scene]")];
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
    };
    const ask = () => { if (!raf) raf = requestAnimationFrame(tick); };
    tick();
    addEventListener("scroll", ask, { passive: true });
    addEventListener("resize", ask);
    return () => { stopStories(); stopFlock(); cancelAnimationFrame(raf); removeEventListener("scroll", ask); removeEventListener("resize", ask); };
  }, []);

  return (
    <div className="sea">
      <TopBar />
      <div className="gauge" aria-hidden="true">
        <span className="val" ref={alt}>+3 000 m</span>
        <span className="rail" ref={rail}><i /></span>
        <span className="name" ref={name}>sky</span>
      </div>

      {/* the sky: who, and the fleet on the horizon */}
      <SeaScene s={S.sky} plate="sky" phone="sky-phone" className="sea-sky"
        words={<>
          <li data-beat={0}><Words s={S.sky} at={-1} h1 /></li>
          <li data-beat={1}><Words s={S.ships} at={1} /></li>
        </>}>
        <canvas ref={flock} className="flock" aria-hidden="true" />
        <div className="fleet" aria-hidden="true">
          {SHIPS.map((sh) => (
            <figure key={sh.img} className="ship" style={{ "--x": sh.x, "--w": sh.w, "--d": sh.d } as CSSProperties}>
              <img src={`/sea/${sh.img}.webp`} alt="" />
              <figcaption data-at="1.2">{sh.label}</figcaption>
            </figure>
          ))}
        </div>
      </SeaScene>

      {/* the harbour: ipporu, then its engine model by model, then all of it on one match */}
      <SeaScene s={S.harbour} plate="harbour" phone="harbour-phone" className="sea-harbour"
        words={<li data-beat={0}><Words s={S.harbour} /></li>} />
      <div className="sea-under" style={{ "--plate": "url(/sea/harbour.webp)" } as CSSProperties}>
        <IpporuStory data={demo as unknown as StoryData} />
        <section className="together" aria-label="the ipporu engine, all together">
          <p className="st-step">all together</p>
          <h2>every model, on the same match</h2>
          <IpporuDemo src="/demo/all-japan-2024.mp4" poster="/demo/all-japan-2024.jpg" data={demo as DemoData} />
        </section>
      </div>

      {/* under the surface */}
      <SeaScene s={S.surface} plate="surface" className="sea-surface" words={<li data-beat={0}><Words s={S.surface} /></li>} />

      {/* the whales: romanian speech */}
      <SeaScene s={S.whales} plate="deep-water" phone="deep-water-phone" className="sea-whales"
        words={<li data-beat={0}><Words s={S.whales} /></li>}>
        <div className="pod" aria-hidden="true">
          {["doina", "tudor", "radu"].map((w, i) => <img key={w} className={`whale whale-${w}`} src={`/sea/whale-${w}.webp`} alt="" style={{ "--i": i } as CSSProperties} />)}
        </div>
      </SeaScene>
      <div className="sea-under deep" style={{ "--plate": "url(/sea/deep-water.webp)" } as CSSProperties}>
        <SpeechStory />
      </div>

      {/* the deep: superstarling */}
      <SeaScene s={S.deep} plate="deep-water" phone="deep-water-phone" className="sea-deep"
        words={<li data-beat={0}><Words s={S.deep} /></li>}>
        <img className="sphere" src="/sea/bathysphere.webp" alt="" aria-hidden="true" />
        <div className="glow" aria-hidden="true">
          {["jelly-1", "angler", "jelly-2", "lantern", "comb", "jelly-3"].map((n) => <img key={n} className={`critter ${n}`} src={`/sea/${n}.webp`} alt="" />)}
        </div>
      </SeaScene>

      {/* the trench: the notebook, one layer glowing */}
      <SeaScene s={S.trench} plate="trench" className="sea-trench"
        words={<li data-beat={0}><Words s={S.trench} /></li>}>
        <ol className="strata" aria-label={`${EXPERIMENTS.length} notebook entries, e1 to e105`}>
          {Array.from({ length: 105 }, (_, i) => i + 1).map((n) => (
            <li key={n} className={`${EXPERIMENTS.includes(n) ? "on" : ""}${n === 101 ? " hit" : ""}`} title={`e${n}`} />
          ))}
        </ol>
      </SeaScene>

      {/* the floor: write to me */}
      <SeaScene s={S.floor} plate="floor" className="sea-floor" words={<li data-beat={0}><Words s={S.floor} /></li>} />
    </div>
  );
}
