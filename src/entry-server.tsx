import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { App } from "./App";
import { work } from "./content/work";
import { notes } from "./content/notes";

export const SITE = "https://madalintat.github.io";
type Meta = { title: string; description: string };

const HOME: Meta = { title: "mădălin tatarciuc", description: "applied ai researcher. romanian speech on a cpu, a video engine for kendo, an agent workspace built from zero." };

export function routes(): Record<string, Meta> {
  const r: Record<string, Meta> = { "/": HOME };
  for (const w of work) r[`/work/${w.slug}/`] = { title: `${w.title} · mădălin tatarciuc`, description: w.line };
  r["/notes/"] = { title: "notes · mădălin tatarciuc", description: "what i measured, and what broke." };
  for (const n of notes) r[`/notes/${n.slug}/`] = { title: `${n.title} · mădălin tatarciuc`, description: n.summary };
  r["/cv/"] = { title: "cv · mădălin tatarciuc", description: "applied ai research engineer. research and builder versions, with pdfs." };
  return r;
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

export function head(url: string, m: Meta) {
  return [
    `<title>${esc(m.title)}</title>`,
    `<meta name="description" content="${esc(m.description)}" />`,
    `<link rel="canonical" href="${SITE}${url}" />`,
    `<meta property="og:title" content="${esc(m.title)}" />`,
    `<meta property="og:description" content="${esc(m.description)}" />`,
    `<meta property="og:image" content="${SITE}/og.png" />`,
    `<meta property="og:url" content="${SITE}${url}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="theme-color" content="#07090f" />`,
  ].join("\n    ");
}

export function render(url: string) {
  return renderToString(<StaticRouter location={url}><App /></StaticRouter>);
}
