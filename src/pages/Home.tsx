import { Link } from "react-router-dom";
import { work } from "../content/work";
import { notes } from "../content/notes";
import { Film } from "../components/Film";
import { PROFILES } from "../layout/Shell";
import "./home.css";

export function Home() {
  const ipporu = work[0];
  return (
    <main className="home">
      <section>
        <h1>mădălin tatarciuc</h1>
        <p className="handle">cetusian</p>
        <p className="lede">applied ai researcher at invergent. i take a model from data to a shipped product, alone, and compete for romania's national kendo team.</p>

        <h2>work</h2>
        <ul className="rows">
          {work.map((w) => (
            <li key={w.slug}>
              <Link to={`/work/${w.slug}`}>
                <b>{w.title}</b>
                <span>{w.line}</span>
                <em>{w.stat}</em>
              </Link>
            </li>
          ))}
        </ul>

        {notes.length > 0 && (
          <>
            <h2>notes</h2>
            <ul className="rows">
              {notes.slice(0, 3).map((n) => (
                <li key={n.slug}>
                  <Link to={`/notes/${n.slug}`}>
                    <b>{n.title}</b>
                    <em>{n.date.slice(0, 7)}</em>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}

        <p className="start">
          start here: <Link to="/work/ipporu">ipporu</Link>, {notes[0] ? <Link to={`/notes/${notes[0].slug}`}>one note</Link> : "one note"}, <Link to="/cv">the cv</Link>
        </p>

        <nav className="profiles">
          {PROFILES.map((p) => (
            <a key={p.label} href={p.href}>{p.label}</a>
          ))}
        </nav>
      </section>

      <aside>
        <Film src={ipporu.hero.src} poster={ipporu.hero.poster!} alt={ipporu.hero.alt} />
        <p className="caption">ipporu, the launch film. <Link to="/work/ipporu">how it works</Link></p>
      </aside>
    </main>
  );
}
