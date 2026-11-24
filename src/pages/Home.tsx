import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { TopBar } from "../layout/Shell";
import { LAYERS, CHAIN, EXPERIMENTS, type Layer } from "../content/world";
import { sceneProgress, depthAt } from "../world/progress";
import { startWorld } from "../world/canvas";
import { IpporuDemo, type DemoData } from "../demo/IpporuDemo";
import demo from "../../public/demo/all-japan-2024.json";
import "./home.css";

// how long each scene holds the screen while it forms, in screen heights
const HOLD: Record<Layer["id"], number> = { sky: 1, flock: 2.6, rooftops: 2.3, city: 2.2, street: 2, engine: 2.4, bedrock: 2.2, core: 1 };
const BLOCKS = ["text", "heading", "sub", "bullet", "number", "todo", "quote", "callout", "code", "toggle", "divider", "page", "image", "file", "embed", "table", "chart", "button", "post", "email", "article", "calendar", "plan", "team", "design", "note", "card", "frame", "arrow", "link", "gallery"];
const VOICES = ["doina", "tudor", "radu"];
const at = (v: number) => ({ "--at": v.toFixed(3) }) as CSSProperties;

// a voice from the model card: one button, a line that fills while it speaks
function Voice({ name, style }: { name: string; style: CSSProperties }) {
  const a = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(0);
  const toggle = () => {
    const el = a.current!;
    document.querySelectorAll("audio").forEach((o) => o !== el && o.pause());
    if (el.paused) el.play().catch(() => {}); else el.pause();
  };
  return (
    <div className={`voice f${playing ? " on" : ""}`} style={style}>
      <button type="button" onClick={toggle} aria-label={`${playing ? "pause" : "play"} ${name}`}>{playing ? "❚❚" : "▶"}</button>
      <span>{name}</span>
      <i style={{ "--t": t } as CSSProperties} />
      <audio ref={a} preload="none" src={`/voices/${name}.mp3`}
        onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => { setPlaying(false); setT(0); }}
        onTimeUpdate={(e) => setT(e.currentTarget.currentTime / (e.currentTarget.duration || 1))} />
    </div>
  );
}

function Go({ href, children }: { href: string; children: ReactNode }) {
  return href.startsWith("/") ? <Link to={href}>{children}</Link> : <a href={href}>{children}</a>;
}

function Facts({ l, from = 0.08, to = 0.7 }: { l: Layer; from?: number; to?: number }) {
  const n = l.facts.length;
  return (
    <dl className="facts">
      {l.facts.map((f, i) => (
        <div key={f.text} className="f" style={at(from + ((to - from) * i) / Math.max(1, n - 1))}>
          {f.k && <dt>{f.k}</dt>}
          <dd>{f.text}</dd>
        </div>
      ))}
    </dl>
  );
}

function Links({ l, a = 0.8 }: { l: Layer; a?: number }) {
  if (!l.links.length) return null;
  return <p className="links f" style={at(a)}>{l.links.map((x) => <Go key={x.href} href={x.href}>{x.label}</Go>)}</p>;
}

function Head({ l, h1 = false }: { l: Layer; h1?: boolean }) {
  const T = h1 ? "h1" : "h2";
  return (
    <>
      {l.tag && <p className="tag f" style={at(0)}><b>{l.m > 0 ? "+" : l.m < 0 ? "−" : ""}{Math.abs(l.m).toLocaleString("en").replace(",", " ")} m</b> {l.tag}</p>}
      <T className="f" style={at(0.02)}>{l.title}</T>
      {l.line && <p className="line f" style={at(0.05)}>{l.line}</p>}
    </>
  );
}

function Scene({ l, children }: { l: Layer; children: ReactNode }) {
  return (
    <section id={l.id} data-scene data-m={l.m} data-name={l.name} className={`scene scene-${l.id}`} style={{ "--hold": HOLD[l.id] } as CSSProperties}>
      <div className="stage">{children}</div>
    </section>
  );
}

const L = Object.fromEntries(LAYERS.map((l) => [l.id, l])) as Record<Layer["id"], Layer>;

export function Home() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const alt = useRef<HTMLSpanElement>(null), pin = useRef<HTMLElement>(null), name = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const stopWorld = canvas.current ? startWorld(canvas.current) : () => {};
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scenes = [...document.querySelectorAll<HTMLElement>("[data-scene]")];
    const forms = [...document.querySelectorAll<HTMLElement>("[data-form]")];
    let raf = 0;
    const tick = () => {
      raf = 0;
      const sy = scrollY, vh = innerHeight;
      if (!reduce) {
        for (const s of scenes) s.style.setProperty("--p", sceneProgress(s.offsetTop, s.offsetHeight, vh, sy).toFixed(3));
        for (const f of forms) { const top = f.getBoundingClientRect().top; f.style.setProperty("--p", Math.min(1, Math.max(0, (vh - top) / (vh * 0.75))).toFixed(3)); }
      }
      const marks = scenes.map((s) => [s.offsetTop + s.offsetHeight / 2, Number(s.dataset.m)] as [number, number]);
      const mid = sy + vh / 2, m = depthAt(marks, mid);
      if (alt.current) alt.current.textContent = `${m > 0 ? "+" : m < 0 ? "−" : ""}${Math.abs(m).toLocaleString("en").replace(",", " ")} m`;
      if (pin.current) pin.current.style.setProperty("--g", String(Math.min(1, sy / Math.max(1, document.documentElement.scrollHeight - vh))));
      if (name.current) { let cur = scenes[0]; for (const s of scenes) if (s.offsetTop <= mid) cur = s; name.current.textContent = cur.dataset.name ?? ""; }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(tick); };
    tick();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => { stopWorld(); removeEventListener("scroll", onScroll); removeEventListener("resize", onScroll); cancelAnimationFrame(raf); };
  }, []);

  return (
    <div className="world">
      <canvas ref={canvas} className="world-canvas" aria-hidden="true" />
      <TopBar />
      <div className="gauge" aria-hidden="true">
        <span className="val" ref={alt}>+3 000 m</span>
        <span className="rail" ref={pin}><i /></span>
        <span className="name" ref={name}>sky</span>
      </div>

      <Scene l={L.sky}>
        <Head l={L.sky} h1 />
        <dl className="proof">
          {L.sky.facts.map((f) => <div key={f.text}><dt>{f.k}</dt><dd>{f.text}</dd></div>)}
        </dl>
      </Scene>

      <Scene l={L.flock}>
        <div className="split">
          <div><Head l={L.flock} /><Facts l={L.flock} /><Links l={L.flock} /></div>
          <ol className="blocks" aria-label="the 31 block types">
            {BLOCKS.map((b, i) => <li key={b} className="f" style={at(0.04 + (i / BLOCKS.length) * 0.6)}>{b}</li>)}
          </ol>
        </div>
      </Scene>

      <Scene l={L.rooftops}>
        <div className="split">
          <div><Head l={L.rooftops} /><Facts l={L.rooftops} /><Links l={L.rooftops} /></div>
          <div className="speech">
            <svg className="wave f" style={at(0.05)} viewBox="0 0 400 80" preserveAspectRatio="none" aria-hidden="true">
              <path pathLength={1} d={wave()} />
            </svg>
            {VOICES.map((v, i) => (
              <Voice key={v} name={v} style={at(0.45 + i * 0.12)} />
            ))}
            <p className="credit f" style={at(0.8)}>the public samples from the amami-357m-ro model card</p>
          </div>
        </div>
      </Scene>

      <Scene l={L.city}>
        <p className="tag caption">{L.city.title}</p>
      </Scene>

      <Scene l={L.street}>
        <Head l={L.street} /><Facts l={L.street} /><Links l={L.street} />
      </Scene>

      <section className="under" data-form aria-label="the ipporu engine">
        <p className="tag">under the dojo floor</p>
        <h2>the engine, link by link</h2>
        <ol className="links-chain">
          {CHAIN.map((c, i) => (
            <li key={c.name} className={`f${c.ships ? " ships" : ""}`} style={at(i / CHAIN.length)}>
              <b>{c.name}</b><span>{c.note}</span>
            </li>
          ))}
        </ol>
        <IpporuDemo src="/demo/all-japan-2024.mp4" poster="/demo/all-japan-2024.jpg" data={demo as DemoData} />
      </section>

      <Scene l={L.engine}>
        <Head l={L.engine} />
        <ul className="pipes">
          {L.engine.facts.map((f, i) => (
            <li key={f.text} className="f" style={at(0.08 + i * 0.12)}>
              <i aria-hidden="true" /><b>{f.k}</b><span>{f.text}</span>
            </li>
          ))}
        </ul>
        <Links l={L.engine} a={0.85} />
      </Scene>

      <Scene l={L.bedrock}>
        <div className="split">
          <div><Head l={L.bedrock} /><Facts l={L.bedrock} from={0.4} to={0.7} /><Links l={L.bedrock} /></div>
          <ol className="core-sample" aria-label={`${EXPERIMENTS.length} notebook entries, e1 to e105`}>
            {Array.from({ length: 105 }, (_, i) => i + 1).map((n) => (
              <li key={n} className={`f${EXPERIMENTS.includes(n) ? " on" : ""}${n === 101 ? " hit" : ""}`} style={at((n / 105) * 0.6)} title={`e${n}`} />
            ))}
          </ol>
        </div>
      </Scene>

      <Scene l={L.core}>
        <Head l={L.core} />
        <p className="links big">{L.core.links.map((x) => <Go key={x.href} href={x.href}>{x.label}</Go>)}</p>
      </Scene>
    </div>
  );
}

// a speech-like waveform: bursts of syllables with pauses between words
function wave() {
  let d = "M0 40", s = 3;
  const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
  for (let x = 0; x < 400; x += 2) {
    const word = Math.sin(x * 0.045) > -0.35 ? 1 : 0.08;
    const amp = word * (8 + r() * 28) * Math.abs(Math.sin(x * 0.31));
    d += ` L${x} ${40 + (x % 4 ? amp : -amp)}`;
  }
  return d;
}
