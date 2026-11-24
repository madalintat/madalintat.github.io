import { marked } from "marked";

/** A post: its own front matter (title, date, summary, optional tags and draft) and its body as html.
    A draft is written and kept in the repo but never listed, rendered or put in the sitemap or feed. */
export type Note = { slug: string; title: string; date: string; summary: string; tags: string[]; draft: boolean; minutes: number; html: string };

const files = import.meta.glob("../../content/notes/*.md", { query: "?raw", import: "default", eager: true }) as Record<string, string>;

export function parse(path: string, raw: string): Note {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error(`${path}: no front matter`);
  const meta = Object.fromEntries(m[1].split("\n").map((l) => { const i = l.indexOf(":"); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; }));
  return {
    slug: path.split("/").pop()!.replace(/\.md$/, ""),
    title: meta.title, date: meta.date, summary: meta.summary,
    tags: meta.tags ? meta.tags.split(",").map((t: string) => t.trim()).filter(Boolean) : [],
    draft: meta.draft === "true",
    // a reading time at 230 words a minute, never under one
    minutes: Math.max(1, Math.round(m[2].split(/\s+/).filter(Boolean).length / 230)),
    html: marked.parse(m[2], { async: false }) as string,
  };
}

const all = Object.entries(files).map(([p, raw]) => parse(p, raw)).sort((a, b) => b.date.localeCompare(a.date));
/** The published posts, newest first. */
export const notes: Note[] = all.filter((n) => !n.draft);
export const drafts: Note[] = all.filter((n) => n.draft);
export const getNote = (slug: string) => notes.find((n) => n.slug === slug);
