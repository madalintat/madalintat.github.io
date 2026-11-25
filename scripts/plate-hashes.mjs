// The plates are fixed pictures in public/sea, cached for a week: each is addressed by a hash of its bytes, so a
// repainted plate (a scroll's calligraphy, a corrected scene) reaches returning visitors at once. Sprites get the same
// from art/sprites.mjs; this covers every other webp there.
import { createHash } from "node:crypto";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";

const sprites = JSON.parse(readFileSync("src/content/sprites.json", "utf8"));
const out = {};
for (const f of readdirSync("public/sea").filter((f) => f.endsWith(".webp")).sort()) {
  const name = f.slice(0, -5);
  if (sprites[name]) continue;
  out[name] = createHash("sha1").update(readFileSync(`public/sea/${f}`)).digest("hex").slice(0, 8);
}
const next = JSON.stringify(out, null, 1) + "\n";
let prev = "";
try { prev = readFileSync("src/content/plates.json", "utf8"); } catch {}
if (next !== prev) writeFileSync("src/content/plates.json", next);
console.log(`plates: ${Object.keys(out).length} hashed`);
