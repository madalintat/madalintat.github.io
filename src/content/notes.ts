import { marked } from "marked";

export type Note = { slug: string; title: string; date: string; summary: string; html: string };

const files = import.meta.glob("../../content/notes/*.md", { query: "?raw", import: "default", eager: true }) as Record<string, string>;

function parse(path: string, raw: string): Note {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error(`${path}: no front matter`);
  const meta = Object.fromEntries(m[1].split("\n").map((l) => { const i = l.indexOf(":"); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; }));
  return {
    slug: path.split("/").pop()!.replace(/\.md$/, ""),
    title: meta.title, date: meta.date, summary: meta.summary,
    html: marked.parse(m[2], { async: false }) as string,
  };
}

export const notes: Note[] = Object.entries(files).map(([p, raw]) => parse(p, raw)).sort((a, b) => b.date.localeCompare(a.date));
export const getNote = (slug: string) => notes.find((n) => n.slug === slug);
