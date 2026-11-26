import { Link, useParams } from "react-router-dom";
import { getWork } from "../content/work";
import { sources } from "../content/sources";
import { Shell } from "../layout/Shell";
import { Film } from "../components/Film";
import { Chain, FIGURES } from "../figures/Chain";
import { NotFound } from "./NotFound";
import { Crew, Walk } from "../components/Walk";
import type { Work } from "../content/types";
import { IpporuDemo, type DemoData } from "../demo/IpporuDemo";
import demo from "../../public/demo/all-japan-2024.json";
import "./work.css";

function Hero({ w }: { w: Work }) {
  if (w.hero.kind === "film") return <div className="hero-film"><Film src={w.hero.src} poster={w.hero.poster!} alt={w.hero.alt} /></div>;
  if (w.hero.kind === "image") return <img className="hero-image" src={w.hero.src} alt={w.hero.alt} />;
  return null;
}

export function WorkPage() {
  const { slug = "" } = useParams();
  const w = getWork(slug);
  if (!w) return <NotFound />;

  const used = [...new Set(w.numbers.map((n) => n.source))];
  const foot = (id: string) => used.indexOf(id) + 1;
  const chain = FIGURES[w.hero.kind === "figure" ? w.hero.src : w.slug];
  const film = w.hero.kind === "film";
  const numbers = (
    <dl className="numbers">
      {w.numbers.map((n) => (
        <div key={n.label}>
          <dt>{n.value}<sup>{foot(n.source)}</sup></dt>
          <dd><b>{n.label}</b><span>{n.condition}</span></dd>
        </div>
      ))}
    </dl>
  );

  return (
    <Shell>
      <article className={`work work-${w.slug}`}>
        <header className={`work-head${w.hero.kind === "figure" ? " solo" : ""}`}>
          <div>
            <h1>{w.title}</h1>
            <p className="line">{w.line}</p>
            {w.links.length > 0 && (
              <p className="links">
                {w.links.map((l) =>
                  l.href.startsWith("/") ? <Link key={l.href} to={l.href}>{l.label}</Link> : <a key={l.href} href={l.href}>{l.label}</a>,
                )}
              </p>
            )}
            {film && numbers}
          </div>
          <Hero w={w} />
        </header>

        {!film && numbers}

        {w.slug === "ipporu" && <IpporuDemo src="/demo/all-japan-2024.mp4" poster="/demo/all-japan-2024.jpg" data={demo as unknown as DemoData} />}

        <section>
          <h2>how it works</h2>
          {chain && <Chain title={chain.title} steps={chain.steps} />}
          {w.walk && <Walk id={w.slug} walk={w.walk} />}
          {w.sections.map((s) => (
            <div key={s.heading} className="part">
              <h3>{s.heading}</h3>
              <p>{s.body}</p>
            </div>
          ))}
        </section>

        {w.crew && (
          <section>
            <h2>the team inside it</h2>
            <Crew crew={w.crew} />
          </section>
        )}

        <section>
          <h2>what i did</h2>
          <p>{w.mine}</p>
        </section>

        <section>
          <h2>limits</h2>
          <ul className="limits">{w.limits.map((l) => <li key={l}>{l}</li>)}</ul>
        </section>

        <footer className="work-foot">
          <Link className="next" to={w.next.href}>{w.next.label} →</Link>
          <ol className="sources">
            {used.map((id) => {
              const s = sources.find((x) => x.id === id)!;
              return <li key={id}>{s.href ? <a href={s.href}>{s.text}</a> : s.text}, {s.date}</li>;
            })}
          </ol>
        </footer>
      </article>
    </Shell>
  );
}
