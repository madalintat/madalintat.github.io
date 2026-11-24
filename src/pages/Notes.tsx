import { Link, useParams } from "react-router-dom";
import { Shell } from "../layout/Shell";
import { notes, getNote } from "../content/notes";
import { NotFound } from "./NotFound";
import "./notes.css";

export function NotesPage() {
  return (
    <Shell>
      <p className="tag">notes</p>
      <h1 className="page-title">what i measured, and what broke</h1>
      <ol className="note-list">
        {notes.map((n) => (
          <li key={n.slug}>
            <Link to={`/notes/${n.slug}`}>
              <time>{n.date}</time>
              <b>{n.title}</b>
              <span>{n.summary}</span>
            </Link>
          </li>
        ))}
      </ol>
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
        <p className="tag"><Link to="/notes">notes</Link> · <time>{n.date}</time></p>
        <h1 className="page-title">{n.title}</h1>
        <div className="prose" dangerouslySetInnerHTML={{ __html: n.html }} />
      </article>
    </Shell>
  );
}
