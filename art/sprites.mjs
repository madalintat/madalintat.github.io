// node art/sprites.mjs [name…]
// Every clip in art/scratch → a sheet in public/sea (art/sprite.sh) and its line in src/content/sprites.json, which
// the page imports: { name: { src, n, w, h, fps } }. With names, only those are (re)built.
import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";

const FPS = 10;
// how tall a frame is kept, by what it is: enough for a 2x phone at the size the page shows it, no more
// the chain from the armour to the scuba is drawn on the full video frame, so 300 tall is the size a phone shows it at
const height = (n) => /^me-(kendo|record|dressed|boat|dive|scuba)/.test(n) ? 300 : n.startsWith("me-hammock") ? 240 : n.startsWith("me-") ? 400 : n.startsWith("whale") ? 420 : n.startsWith("person") ? 240 : n.startsWith("kendo") ? 400 : n.startsWith("agents") ? 440 : 200;
const OUT = "src/content/sprites.json";
const all = existsSync(OUT) ? JSON.parse(readFileSync(OUT, "utf8")) : {};
const want = process.argv.slice(2);
const clips = readdirSync("art/scratch").filter((f) => f.endsWith(".mp4")).map((f) => f.slice(0, -4)).filter((n) => !want.length || want.includes(n));
for (const name of clips) {
  const line = execFileSync("./art/sprite.sh", [`art/scratch/${name}.mp4`, name, String(height(name)), String(FPS)], { encoding: "utf8" }).trim();
  const [n, w, h, , kb] = line.split(/\s+/);
  // /sea is cached for a week: a redrawn sheet gets a new address (its content's hash), so no phone keeps the old frames
  const v = createHash("sha1").update(readFileSync(`public/sea/${name}.webp`)).digest("hex").slice(0, 8);
  all[name] = { src: `/sea/${name}.webp?v=${v}`, n: Number(n), w: Number(w), h: Number(h), fps: FPS };
  console.log(`${name.padEnd(24)} ${n} frames ${w}x${h} ${kb}`);
}
writeFileSync(OUT, JSON.stringify(Object.fromEntries(Object.entries(all).sort()), null, 2) + "\n");
