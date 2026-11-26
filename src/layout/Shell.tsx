import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { EMAIL } from "../content/world";
import { getWork } from "../content/work";
import "./shell.css";

// the work menu, in the order the home page tells it
const MENU = (["ipporu", "superstarling", "surogates", "romanian-speech"] as const).map((slug) => getWork(slug)!);

/** "work" opens a short list of every project page; outside click, Escape or a navigation closes it. */
function WorkMenu() {
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const { pathname, hash } = useLocation();
  useEffect(() => setOpen(false), [pathname, hash]);
  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => { if (!box.current?.contains(e.target as Node)) setOpen(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); box.current?.querySelector("button")?.focus(); } };
    document.addEventListener("pointerdown", away);
    document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("pointerdown", away); document.removeEventListener("keydown", esc); };
  }, [open]);

  return (
    <div className="menu" ref={box}>
      <button type="button" className="menu-btn" aria-expanded={open} aria-controls="work-menu" onClick={() => setOpen(!open)}>
        work<svg viewBox="0 0 10 6" width="10" height="6" aria-hidden="true"><path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.4" /></svg>
      </button>
      <div className="menu-panel" id="work-menu" hidden={!open}>
        <ul>
          {MENU.map((w) => (
            <li key={w.slug}>
              <Link to={`/work/${w.slug}`} aria-current={pathname.startsWith(`/work/${w.slug}`) ? "page" : undefined}>
                <b>{w.title}</b><span>{w.stat}</span>
              </Link>
            </li>
          ))}
        </ul>
        <Link className="menu-all" to="/#sky">all of it, on the sea →</Link>
      </div>
    </div>
  );
}

/** On the home page the name is already the hero, so the bar is only the links, on one solid chip. */
export function TopBar({ home = false }: { home?: boolean }) {
  return (
    <header className={home ? "bar bar-home" : "bar"}>
      {!home && <Link className="who" to="/">mădălin tatarciuc</Link>}
      <nav>
        <WorkMenu />
        <Link to="/notes">notes</Link>
        <Link to="/cv">cv</Link>
      </nav>
      <a className="mail" href={`mailto:${EMAIL}`}>email</a>
    </header>
  );
}

// Every page but home: the bar, then the page.
export function Shell({ children }: { children: ReactNode }) {
  return (
    <>
      <TopBar />
      <main className="page">{children}</main>
    </>
  );
}
