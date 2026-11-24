// node art/review/serve.mjs → http://127.0.0.1:5190
// The owner's review of the sea's art before anything more is built. Serves the review page, art/scratch and
// public/sea (nothing else), and keeps each verdict in art/review/answers.json, which the next build reads.
import { createServer } from "node:http";
import { readFileSync, writeFileSync, existsSync, statSync } from "node:fs";
import { join, normalize, extname } from "node:path";

const ROOT = new URL("../..", import.meta.url).pathname;
const ANSWERS = join(ROOT, "art/review/answers.json");
const OPEN = ["art/review/", "art/scratch/", "public/sea/", "art/model-clips/"];
const TYPE = { ".html": "text/html; charset=utf-8", ".png": "image/png", ".webp": "image/webp", ".mp4": "video/mp4", ".json": "application/json", ".js": "text/javascript" };

createServer((req, res) => {
  const url = new URL(req.url, "http://x");
  if (url.pathname === "/answers") {
    if (req.method === "POST") {
      let body = "";
      req.on("data", (c) => (body += c));
      req.on("end", () => {
        const all = existsSync(ANSWERS) ? JSON.parse(readFileSync(ANSWERS, "utf8")) : {};
        const { id, verdict, note } = JSON.parse(body);
        all[id] = { verdict, note, at: new Date().toISOString() };
        writeFileSync(ANSWERS, JSON.stringify(all, null, 2));
        res.writeHead(200, { "Content-Type": "application/json" }).end("{}");
      });
      return;
    }
    return res.writeHead(200, { "Content-Type": "application/json" }).end(existsSync(ANSWERS) ? readFileSync(ANSWERS) : "{}");
  }
  const rel = url.pathname === "/" ? "art/review/index.html" : normalize(decodeURIComponent(url.pathname)).replace(/^\/+/, "");
  const file = join(ROOT, rel);
  if (!OPEN.some((d) => rel.startsWith(d)) || !existsSync(file) || !statSync(file).isFile()) return res.writeHead(404).end("not here");
  res.writeHead(200, { "Content-Type": TYPE[extname(file)] ?? "application/octet-stream", "Cache-Control": "no-store" }).end(readFileSync(file));
}).listen(5190, "127.0.0.1", () => console.log("review on http://127.0.0.1:5190"));
