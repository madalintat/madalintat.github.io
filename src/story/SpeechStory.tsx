import { useRef, useState, type CSSProperties } from "react";
import { SPEECH } from "../content/stories";
import waves from "../content/voicewaves.json";
import { PlayIcon, PauseIcon } from "../components/icons";
import "./story.css";

const VOICES = [
  // per-voice wer read back by whisper large-v3, from the amami card
  { name: "doina", wer: "2.65%" },
  { name: "tudor", wer: "1.75%" },
  { name: "radu", wer: "1.66%" },
] as const;
// fleurs romanian, word error rate, from the jackrabbit card: lower is better
const BOARD = [
  { name: "jackrabbit 110m", wer: 5.69, mine: true },
  { name: "canary 1b v2", wer: 5.95 },
  { name: "whisper large-v3", wer: 8.42 },
];
const beat = (id: string) => SPEECH.findIndex((b) => b.id === id);

const path = (w: number[], h = 40) =>
  "M0 " + h + w.map((v, i) => ` L${i * 2} ${(h - (v / 100) * h).toFixed(1)} L${i * 2 + 1} ${(h + (v / 100) * h).toFixed(1)}`).join("");

function Voice({ name, wer, at }: { name: (typeof VOICES)[number]["name"]; wer: string; at: number }) {
  const a = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(0);
  const w = (waves as Record<string, number[]>)[name];
  const toggle = () => {
    const el = a.current!;
    document.querySelectorAll("audio").forEach((o) => o !== el && o.pause());
    if (el.paused) el.play().catch(() => {}); else el.pause();
  };
  return (
    <div className={`sp-voice${playing ? " playing" : ""}`} data-at={at} style={{ "--t": t } as CSSProperties}>
      <button type="button" onClick={toggle} aria-label={`${playing ? "pause" : "play"} ${name}`}>{playing ? <PauseIcon /> : <PlayIcon />}</button>
      <b>{name}</b>
      <svg viewBox={`0 0 ${w.length * 2} 80`} preserveAspectRatio="none" aria-hidden="true"><path d={path(w)} /></svg>
      <span>{wer}</span>
      <audio ref={a} preload="none" src={`/voices/${name}.mp3`}
        onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => { setPlaying(false); setT(0); }}
        onTimeUpdate={(e) => setT(e.currentTarget.currentTime / (e.currentTarget.duration || 1))} />
    </div>
  );
}

/** Romanian speech, one model per beat, then the loop they make. */
export function SpeechStory() {
  const doina = (waves as Record<string, number[]>).doina;
  return (
    <section className="st sp-story" aria-label="romanian speech, model by model">
      <div className="st-stage">
        <i className="st-bar" aria-hidden="true" />
        <ol className="st-caps">
          {SPEECH.map((b, i) => (
            <li key={b.id} data-beat={i}>
              <p className="st-step">{b.id === "loop" ? "all together" : `model ${i + 1}`}</p>
              <h3>{b.title}</h3>
              <p>{b.line}</p>
              {b.num && <p className="st-num"><b data-num data-at={i + 0.15} data-to={i + 0.7}>{b.num}</b> {b.of}</p>}
              {b.link && <a href={b.link.href}>{b.link.label}</a>}
            </li>
          ))}
        </ol>
        <div className="st-screen sp-screen">
          {/* hearing: the wave comes in, the board says how it compares */}
          <div className="sp-panel sp-hear" data-at={beat("asr") + 0.05}>
            <svg className="sp-wave" viewBox={`0 0 ${doina.length * 2} 80`} preserveAspectRatio="none" aria-hidden="true">
              <path className="draw" pathLength={1} d={path(doina)} data-at={beat("asr") + 0.05} data-to={beat("asr") + 0.6} />
            </svg>
            <ul className="sp-board" aria-label="word error rate on fleurs romanian, lower is better">
              {BOARD.map((r) => (
                <li key={r.name} className={r.mine ? "mine" : ""} style={{ "--w": r.wer / 9 } as CSSProperties}>
                  <span>{r.name}</span><i /><b>{r.wer.toFixed(2)}%</b>
                </li>
              ))}
            </ul>
          </div>
          {/* while you speak: the same wave in 32 ms packets, each written as it lands */}
          <div className="sp-panel sp-stream" data-at={beat("stream") + 0.05} aria-hidden="true">
            <div className="sp-packets">
              {Array.from({ length: 48 }, (_, i) => <i key={i} data-at={(beat("stream") + 0.05 + (i / 48) * 0.6).toFixed(3)} style={{ "--amp": Math.max(0.08, doina[Math.floor((i / 48) * doina.length)] / 100) } as CSSProperties} />)}
            </div>
            <p className="sp-lat"><span>last word</span><i data-at={beat("stream") + 0.66} data-to={beat("stream") + 0.9} /><span>final text</span></p>
          </div>
          {/* three voices */}
          <div className="sp-panel sp-voices" data-at={beat("voices") + 0.05}>
            {VOICES.map((v, i) => <Voice key={v.name} name={v.name} wer={v.wer} at={beat("voices") + 0.1 + i * 0.12} />)}
          </div>
          {/* together: hear, think, speak */}
          <ol className="sp-panel sp-loop" data-at={beat("loop") + 0.05}>
            {["you speak", "jackrabbit hears", "an agent answers", "amami speaks"].map((s, i) => (
              <li key={s} data-at={(beat("loop") + 0.1 + i * 0.15).toFixed(2)}>{s}</li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
