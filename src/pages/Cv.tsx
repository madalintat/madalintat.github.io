import { useSearchParams } from "react-router-dom";
import { Shell } from "../layout/Shell";
import { cv, type CvVersion } from "../content/cv";
import "./cv.css";

export function CvPage() {
  const [params, setParams] = useSearchParams();
  const v: CvVersion = params.get("v") === "builder" ? "builder" : "research";
  const print = params.get("print") === "1";
  const c = cv[v];
  const sheet = (
    <article className="sheet">
      <header>
        <div>
          <h1>{c.contact.name}</h1>
          <p className="role">{c.role}</p>
        </div>
        <p className="contact">
          <a href={`mailto:${c.contact.email}`}>{c.contact.email}</a><br />
          <a href={`https://${c.contact.site}`}>{c.contact.site}</a> · <a href={`https://${c.contact.linkedin}`}>linkedin</a><br />
          <a href={`https://${c.contact.github}`}>{c.contact.github}</a> · <a href="https://huggingface.co/cetusian">{c.contact.hf}</a><br />
          {c.contact.terms}
        </p>
      </header>
      <p className="summary">{c.summary}</p>
      {c.sections.map((s) => (
        <section key={s.heading}>
          <h2>{s.heading}</h2>
          {s.items.map((it) => (
            <div className="item" key={it.title}>
              <div className="top"><b>{it.title}</b>{it.when && <span className="when">{it.when}</span>}</div>
              {it.sub && <p className="sub">{it.sub}</p>}
              {it.bullets && <ul>{it.bullets.map((b) => <li key={b}>{b}</li>)}</ul>}
            </div>
          ))}
        </section>
      ))}
      <section className="skills">
        <h2>Skills</h2>
        {c.skills.map(([k, t]) => <p key={k}><b>{k}</b> {t}</p>)}
      </section>
    </article>
  );
  if (print) return <div className="cv-print">{sheet}</div>;
  return (
    <Shell>
      <div className="cv-tools">
        <div className="switch" role="group" aria-label="version">
          {(["research", "builder"] as CvVersion[]).map((x) => (
            <button key={x} type="button" aria-pressed={x === v} onClick={() => setParams(x === "builder" ? { v: x } : {})}>{x}</button>
          ))}
        </div>
        <p className="pdfs">
          <a href="/cv/madalin-tatarciuc-research.pdf">research pdf</a>
          <a href="/cv/madalin-tatarciuc-builder.pdf">builder pdf</a>
        </p>
      </div>
      {sheet}
    </Shell>
  );
}
