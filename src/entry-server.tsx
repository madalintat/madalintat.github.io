import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { App } from "./App";
import { work } from "./content/work";
import { notes } from "./content/notes";
import { SCENES, EMAIL } from "./content/world";
export { SCENES };

export const SITE = "https://cetusian.com";
type Meta = { title: string; description: string };

const HOME: Meta = { title: "mădălin tatarciuc · applied ai researcher and builder", description: "i train small ai models and ship the products around them: ipporu, an ai that reads kendo; romanian speech models that beat whisper large-v3 at 14 times smaller; superstarling, an ai team for your business." };

export function routes(): Record<string, Meta> {
  const r: Record<string, Meta> = { "/": HOME };
  for (const w of work) r[`/work/${w.slug}/`] = { title: `${w.title} · mădălin tatarciuc`, description: w.line };
  r["/notes/"] = { title: "notes · mădălin tatarciuc", description: "what i measured, and what broke." };
  for (const n of notes) r[`/notes/${n.slug}/`] = { title: `${n.title} · mădălin tatarciuc`, description: n.summary };
  r["/cv/"] = { title: "cv · mădălin tatarciuc", description: "applied ai research engineer. research and builder versions, with pdfs." };
  return r;
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

const SAME = ["https://github.com/madalintat", "https://huggingface.co/cetusian", "https://www.linkedin.com/in/madalin-tatarciuc", "https://x.com/cetusian"];
// who this is and what he made, for search engines and ai answer engines: one graph, on every page
function graph() {
  const me = { "@type": "Person", "@id": `${SITE}/#me`, name: "Mădălin Tatarciuc", alternateName: "Madalin Tatarciuc", url: SITE, email: `mailto:${EMAIL}`,
    jobTitle: "Applied AI researcher and builder", nationality: "Romanian", homeLocation: { "@type": "Country", name: "Romania" }, sameAs: SAME,
    knowsAbout: ["speech recognition", "text to speech", "computer vision", "video models", "small language models", "AI agents", "model evaluation", "full stack engineering", "product design", "growth"] };
  const made = SCENES.filter((s) => s.line && s.id !== "sky" && s.id !== "garden" && s.id !== "notebook").map((s) => ({
    "@type": s.id === "harbour" || s.id === "lab" ? "SoftwareApplication" : "CreativeWork", name: s.title, description: s.line,
    ...(s.id === "harbour" || s.id === "lab" ? { applicationCategory: s.id === "harbour" ? "SportsApplication" : "BusinessApplication" } : {}),
    url: s.links.find((l) => l.href.startsWith("http"))?.href ?? `${SITE}/`, creator: { "@id": `${SITE}/#me` } }));
  return JSON.stringify({ "@context": "https://schema.org", "@graph": [me, { "@type": "WebSite", "@id": `${SITE}/#site`, url: SITE, name: "Mădălin Tatarciuc", author: { "@id": `${SITE}/#me` } }, ...made] }).replace(/</g, "\\u003c");
}

/** The same facts as the page, as plain text for ai assistants (llmstxt.org). */
export function llms() {
  const out = ["# Mădălin Tatarciuc", "", "> Applied AI researcher and builder from Romania. He trains small, specialized AI models and engineers, ships and grows the products around them.", ""];
  for (const s of SCENES) {
    if (s.id === "sky" || s.id === "surface") continue;
    out.push(`## ${s.title}`, "");
    if (s.tag) out.push(`_${s.tag}_`, "");
    if (s.line) out.push(s.line, "");
    for (const f of s.facts) out.push(`- ${f.k ? `**${f.k}**: ` : ""}${f.text}`);
    if (s.built) out.push(`- **how it is built**: ${s.built}`);
    for (const l of s.links) out.push(`- [${l.label}](${l.href.startsWith("/") ? SITE + l.href : l.href})`);
    out.push("");
  }
  out.push("## Pages", "", `- [Work](${SITE}/work/)`, `- [Notes](${SITE}/notes/)`, `- [CV](${SITE}/cv/)`, "");
  return out.join("\n");
}

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
    `<meta property="og:type" content="${url === "/" ? "profile" : "article"}" />`,
    `<meta property="og:site_name" content="Mădălin Tatarciuc" />`,
    `<meta property="og:image:alt" content="Mădălin Tatarciuc, applied ai researcher and builder" />`,
    `<meta name="twitter:title" content="${esc(m.title)}" />`,
    `<meta name="twitter:description" content="${esc(m.description)}" />`,
    `<meta name="twitter:creator" content="@cetusian" />`,
    `<meta name="author" content="Mădălin Tatarciuc" />`,
    `<link rel="alternate" type="text/plain" href="${SITE}/llms.txt" title="llms.txt" />`,
    `<script type="application/ld+json">${graph()}</script>`,
  ].join("\n    ");
}

export function render(url: string) {
  return renderToString(<StaticRouter location={url}><App /></StaticRouter>);
}
