/* A scene's words as one solid card: what kind of thing it is (with its real mark), a plain title, one sentence that says
   what it does, the numbers as tiles, and the links as buttons with their own icons. Readable over any painting. */
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Sheet } from "./Sheet";
import { Link } from "react-router-dom";
import { siGithub, siHuggingface, siX } from "simple-icons";
import { ArrowUpRight, ChevronUp, FileText, Globe, Link2, Mail, Play, Wrench, X } from "lucide-react";
import type { Icon, Scene, Shot } from "../content/world";

const brand = (path: string) => <svg viewBox="0 0 24 24" aria-hidden="true" className="ico"><path d={path} fill="currentColor" /></svg>;
const mark = (src: string) => <img src={src} alt="" aria-hidden="true" className="ico" width={18} height={18} />;
export const lu = { size: 16, strokeWidth: 1.8, "aria-hidden": true, className: "ico" } as const;

export function IconFor({ i }: { i: Icon }): ReactNode {
  switch (i) {
    case "hf": return brand(siHuggingface.path);
    case "github": return brand(siGithub.path);
    case "x": return brand(siX.path);
    case "ipporu": return mark("/logos/ipporu.svg");
    case "superstarling": return mark("/logos/superstarling.svg");
    case "mail": return <Mail {...lu} />;
    case "cv": return <FileText {...lu} />;
    case "play": return <Play {...lu} />;
    case "linkedin": return <Link2 {...lu} />;
    default: return <Globe {...lu} />;
  }
}

function Go({ href, className, children }: { href: string; className?: string; children: ReactNode }) {
  return href.startsWith("/") ? <Link to={href} className={className}>{children}</Link> : <a href={href} className={className}>{children}</a>;
}

/** A product screen, full size, over the page: closes on its button, on Escape (the dialog's own) and on a click
    outside the picture. A real <dialog>, so focus stays inside it and returns to the thumbnail after. */
function Viewer({ shot, onClose }: { shot: Shot | null; onClose: () => void }) {
  const d = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const el = d.current;
    if (!el) return;
    if (shot && !el.open) el.showModal();
    if (!shot && el.open) el.close();
  }, [shot]);
  return (
    <dialog ref={d} className="viewer" onClose={onClose} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }} aria-label={shot?.alt}>
      {shot && (
        <figure>
          <img src={shot.src} alt={shot.alt} />
          <figcaption>{shot.alt}</figcaption>
        </figure>
      )}
      <button type="button" className="viewer-close" onClick={onClose} aria-label="close"><X size={20} strokeWidth={1.8} aria-hidden="true" /></button>
    </dialog>
  );
}

/** The parts of a card under its title: the numbers, the screens, how it is built, the links. */
function More({ s, at, onShot }: { s: Scene; at?: number; onShot: (x: Shot) => void }) {
  return (
    <div className="card-more">
      {s.facts.length > 0 && (
        <dl className="card-stats">
          {s.facts.map((f, i) => <div key={f.text} data-at={at == null ? undefined : (at + 0.15 + i * 0.1).toFixed(2)}><dt>{f.k}</dt><dd>{f.text}</dd></div>)}
        </dl>
      )}
      {s.shots && s.shots.length > 0 && (
        <p className="card-shots">
          {s.shots.map((x) => (
            <a key={x.src} href={x.src} title={x.alt} onClick={(e) => { e.preventDefault(); onShot(x); }}>
              <img src={x.src} alt={x.alt} loading="lazy" decoding="async" width={1000} height={580} />
            </a>
          ))}
        </p>
      )}
      {s.built && <p className="card-built"><Wrench {...lu} size={14} /><span>{s.built}</span></p>}
      {s.links.length > 0 && (
        <p className="card-links">
          {s.links.map((l, i) => (
            <Go key={l.href} href={l.href} className={i === 0 ? "btn main" : "btn"}>
              {l.icon && <IconFor i={l.icon} />}<span>{l.label}</span>{!l.href.startsWith("/") && !l.href.startsWith("mailto:") && <ArrowUpRight {...lu} size={14} />}
            </Go>
          ))}
        </p>
      )}
    </div>
  );
}

const Kind = ({ s }: { s: Scene }) => s.tag ? <p className="card-kind">{s.icon && <IconFor i={s.icon} />}<span>{s.tag}</span></p> : null;

/** at: the beat this card belongs to, so its tiles come in one after another as it is reached.
    On a desktop the card is whole. On a phone it waits at the bottom of the screen as its name and a line; a tap on it
    (or on "more") opens the whole card as a sheet over the page. */
export function Card({ s, at = 0 }: { s: Scene; at?: number }) {
  const [open, setOpen] = useState(false);
  const [shot, setShot] = useState<Shot | null>(null);
  const more = s.facts.length > 0 || s.links.length > 0 || !!s.built;
  return (
    <div className={`card${s.shots?.length ? " wide" : ""}${more ? " has-more" : ""}`}
      onClick={(e) => {
        // a tap anywhere on the closed card opens it, except on its own links and buttons (and not from inside the
        // sheet, whose events still bubble here through the portal)
        if (!more || !matchMedia("(max-width: 720px)").matches || !e.currentTarget.contains(e.target as Node) || (e.target as HTMLElement).closest("a, button")) return;
        setOpen(true);
      }}>
      <div className="card-head">
        <Kind s={s} />
        {more && (
          <button type="button" className="card-toggle" aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(true)}>
            <span>more</span><ChevronUp {...lu} size={15} />
          </button>
        )}
      </div>
      <h2>{s.title}</h2>
      {s.line && <p className="card-line">{s.line}</p>}
      {more && <More s={s} at={at} onShot={setShot} />}
      <Sheet open={open} onClose={() => setOpen(false)} label={s.title}>
        <div className="card in-sheet">
          <Kind s={s} />
          <h2>{s.title}</h2>
          {s.line && <p className="card-line">{s.line}</p>}
          <More s={s} onShot={setShot} />
        </div>
      </Sheet>
      <Viewer shot={shot} onClose={() => setShot(null)} />
    </div>
  );
}
