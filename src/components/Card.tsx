/* A scene's words as one solid card: what kind of thing it is (with its real mark), a plain title, one sentence that says
   what it does, the numbers as tiles, and the links as buttons with their own icons. Readable over any painting. */
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { siGithub, siHuggingface, siX } from "simple-icons";
import { ArrowUpRight, ChevronUp, FileText, Globe, Link2, Mail, Play } from "lucide-react";
import type { Icon, Scene } from "../content/world";

const brand = (path: string) => <svg viewBox="0 0 24 24" aria-hidden="true" className="ico"><path d={path} fill="currentColor" /></svg>;
const mark = (src: string) => <img src={src} alt="" aria-hidden="true" className="ico" width={18} height={18} />;
const lu = { size: 16, strokeWidth: 1.8, "aria-hidden": true, className: "ico" } as const;

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

/** at: the beat this card belongs to, so its tiles come in one after another as it is reached.
    On a phone the card is a bottom sheet: the name and one line, and a tap or a swipe up opens the numbers and links. */
export function Card({ s, at = 0, startOpen = false }: { s: Scene; at?: number; startOpen?: boolean }) {
  const [open, setOpenState] = useState(startOpen);
  // a sheet the reader opened covers the bottom of the screen: the page steps the character out of its way
  const setOpen = (v: boolean) => { setOpenState(v); document.documentElement.classList.toggle("sheet-open", v); };
  const y0 = useRef<number | null>(null), me = useRef<HTMLDivElement>(null);
  // once its beat scrolls away, an opened sheet closes and hands the screen back
  useEffect(() => {
    if (!open || startOpen) return;
    const check = () => {
      const el = me.current, r = el?.getBoundingClientRect();
      if (!el || !r || r.bottom < 0 || r.top > innerHeight || !el.closest("li")?.classList.contains("on")) setOpen(false);
    };
    addEventListener("scroll", check, { passive: true });
    return () => { removeEventListener("scroll", check); document.documentElement.classList.remove("sheet-open"); };
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps
  const more = s.facts.length > 0 || s.links.length > 0;
  return (
    <div ref={me} className={`card${open ? " open" : ""}`}
      onPointerDown={(e) => { y0.current = e.clientY; }}
      onPointerUp={(e) => { if (y0.current === null) return; const d = e.clientY - y0.current; y0.current = null; if (d < -28) setOpen(true); else if (d > 28) setOpen(false); }}>
      <div className="card-head" onClick={(e) => { if (more && !(e.target as HTMLElement).closest("button")) setOpen(!open); }}>
        {s.tag && <p className="card-kind">{s.icon && <IconFor i={s.icon} />}<span>{s.tag}</span></p>}
        {more && (
          <button type="button" className="card-toggle" aria-expanded={open} aria-label={open ? "show less" : "show more"} onClick={() => setOpen(!open)}>
            <ChevronUp {...lu} />
          </button>
        )}
      </div>
      <h2>{s.title}</h2>
      {s.line && <p className="card-line">{s.line}</p>}
      {more && (
        <div className="card-more">
          {s.facts.length > 0 && (
            <dl className="card-stats">
              {s.facts.map((f, i) => <div key={f.text} data-at={(at + 0.15 + i * 0.1).toFixed(2)}><dt>{f.k}</dt><dd>{f.text}</dd></div>)}
            </dl>
          )}
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
      )}
    </div>
  );
}
