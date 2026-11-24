import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Shell } from "../layout/Shell";
import { cv, type CvVersion } from "../content/cv";
import "./cv.css";

export function CvPage() {
  const [params, setParams] = useSearchParams();
  // /cv/ is prerendered as the research cv; the query applies once mounted, so hydration matches
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const v: CvVersion = mounted && params.get("v") === "builder" ? "builder" : "research";
  const print = params.get("print") === "1";
  const c = cv[v];
  const sheet = (
    <article className="sheet">
      <header>
        <h1>{c.contact.name}</h1>
        <p className="role">{c.role}</p>
        <p className="contact">
          <a href={`mailto:${c.contact.email}`}>{c.contact.email}</a><i>|</i><a href={`https://${c.contact.site}`}>{c.contact.site}</a><i>|</i><span>{c.contact.place}</span>
        </p>
        <p className="contact">
          <a href={`https://${c.contact.linkedin}`}>{c.contact.linkedin}</a><i>|</i><a href={`https://${c.contact.github}`}>{c.contact.github}</a><i>|</i><a href={`https://${c.contact.hf}`}>{c.contact.hf}</a>
        </p>
      </header>
      <section>
        <h2>Profile</h2>
        <p className="profile">{c.profile}</p>
      </section>
      {c.sections.map((s) => (
        <section key={s.heading}>
          <h2>{s.heading}</h2>
          {s.items.map((it) => (
            <div className="item" key={it.org + (it.role ?? "")}>
              {it.org && (
                <div className="top">
                  <span><b>{it.org}</b>{it.role && <> · <em>{it.role}</em></>}{it.note && <small> · {it.note}</small>}</span>
                  {it.when && <span className="when">{it.when}</span>}
                </div>
              )}
              {it.bullets && <ul>{it.bullets.map(([k, t]) => <li key={t}>{k && <b>{k}: </b>}{t}</li>)}</ul>}
            </div>
          ))}
          {s.earlier && <p className="line"><b>Earlier:</b> {s.earlier}</p>}
        </section>
      ))}
      <section>
        <h2>Skills</h2>
        {c.skills.map(([k, t]) => <p className="line" key={k}><b>{k}:</b> {t}</p>)}
      </section>
      <section>
        <h2>Education and more</h2>
        {c.more.map(([k, t]) => <p className="line" key={k}><b>{k}:</b> {t}</p>)}
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
