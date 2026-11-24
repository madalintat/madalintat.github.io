import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Rss } from "lucide-react";
import { Shell } from "../layout/Shell";
import { notes, getNote, type Note } from "../content/notes";
import { NotFound } from "./NotFound";
import { IconFor, lu as ic } from "../components/Card";
import "./notes.css";

// what the notes are about, said once at the top so a reader knows what to expect before the first post
const TOPICS = ["models", "building", "kendo", "chess", "fishing", "transylvania", "hardware", "life"];

const when = (d: string) => new Date(d + "T12:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }).toLowerCase();

function Meta({ n }: { n: Note }) {
  return <p className="post-meta"><time dateTime={n.date}>{when(n.date)}</time><span>{n.minutes} min read</span>{n.tags.map((t) => <span key={t} className="post-tag">{t}</span>)}</p>;
}

export function NotesPage() {
  const [first, ...rest] = notes;
  return (
    <Shell>
      <header className="blog-head">
        <p className="tag">notes</p>
        <h1 className="page-title">notes, about anything</h1>
        <p className="blog-lede">what i'm building and training, and everything around it: kendo, chess, fishing in transylvania, old hardware brought back to life, and life itself. written when there's something worth saying.</p>
        <p className="blog-topics" aria-label="what the notes cover">{TOPICS.map((t) => <span key={t}>{t}</span>)}</p>
      </header>
      {first ? (
        <>
          <Link className="post-feature" to={`/notes/${first.slug}`}>
            <Meta n={first} />
            <b>{first.title}</b>
            <span>{first.summary}</span>
          </Link>
          {rest.length > 0 && (
            <ol className="note-list">
              {rest.map((n) => (
                <li key={n.slug}><Link to={`/notes/${n.slug}`}><Meta n={n} /><b>{n.title}</b><span>{n.summary}</span></Link></li>
              ))}
            </ol>
          )}
        </>
      ) : (
        <section className="blog-empty" aria-label="no notes yet">
          <h2 className="blog-empty-title">first notes on their way</h2>
          <p className="blog-empty-line">about whatever is on my mind: a model that worked, a match, a river. follow along and the first one reaches you the day it is out.</p>
          <p className="blog-follow">
            <a className="btn main" href="/notes/rss.xml"><Rss {...ic} />rss feed</a>
            <a className="btn" href="https://x.com/cetusian"><IconFor i="x" />@cetusian</a>
          </p>
        </section>
      )}
    </Shell>
  );
}

export function NotePage() {
  const { slug = "" } = useParams();
  const n = getNote(slug);
  if (!n) return <NotFound />;
  return (
    <Shell>
      <article className="note">
        <Link className="post-back" to="/notes"><ArrowLeft {...ic} />notes</Link>
        <h1 className="page-title">{n.title}</h1>
        <p className="post-summary">{n.summary}</p>
        <Meta n={n} />
        <div className="prose" dangerouslySetInnerHTML={{ __html: n.html }} />
        <footer className="post-foot">
          <Link to="/notes"><ArrowLeft {...ic} />all notes</Link>
          <a href="/notes/rss.xml"><Rss {...ic} />rss</a>
        </footer>
      </article>
    </Shell>
  );
}
