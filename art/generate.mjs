// node art/generate.mjs <plate> [--ref art/plates/x.png ...] [--note "extra direction"]
// One image per call from STYLE.md + the plate's brief. Saves art/scratch/<plate>-<n>.png and logs the cost to SPEND.md.
// Key: OPENROUTER_API_KEY from the environment or from .env.local in the repo root.
import { readFileSync, writeFileSync, existsSync, appendFileSync, readdirSync } from "node:fs";

const ROOT = new URL("../", import.meta.url).pathname;
const MODEL = "google/gemini-nano-banana-2.1";
const env = existsSync(ROOT + ".env.local") ? readFileSync(ROOT + ".env.local", "utf8") : "";
const KEY = process.env.OPENROUTER_API_KEY || env.match(/^OPENROUTER_API_KEY=(.+)$/m)?.[1]?.trim();
if (!KEY) { console.error("no OPENROUTER_API_KEY (environment or .env.local)"); process.exit(1); }

const [name, ...rest] = process.argv.slice(2);
const plates = JSON.parse(readFileSync(ROOT + "art/plates.json", "utf8"));
const plate = plates[name];
if (!plate) { console.error(`unknown plate: ${name}. known: ${Object.keys(plates).join(", ")}`); process.exit(1); }
const refs = [], notes = [];
for (let i = 0; i < rest.length; i++) { if (rest[i] === "--ref") refs.push(rest[++i]); if (rest[i] === "--note") notes.push(rest[++i]); }

const style = readFileSync(ROOT + "art/STYLE.md", "utf8");
const text = `Draw one finished illustration, ${plate.aspect}.\n\nTHE STYLE (follow every rule):\n${style}\n\nTHE PLATE:\n${plate.brief}\n${notes.join("\n")}${refs.length ? "\n\nThe attached image(s) are kept plates from the same world: match their style, palette, grain and light exactly." : ""}`;
const mime = (r) => (r.endsWith(".png") ? "png" : r.endsWith(".jpg") ? "jpeg" : "webp");
const content = [{ type: "text", text }, ...refs.map((r) => ({ type: "image_url", image_url: { url: `data:image/${mime(r)};base64,${readFileSync(ROOT + r).toString("base64")}` } }))];

const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
  method: "POST",
  headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json", "X-Title": "madalintat.github.io art" },
  body: JSON.stringify({ model: MODEL, modalities: ["image", "text"], image_config: { aspect_ratio: plate.aspect }, usage: { include: true }, messages: [{ role: "user", content }] }),
});
const data = await res.json();
if (!res.ok) { console.error(res.status, JSON.stringify(data).slice(0, 400)); process.exit(1); }
const url = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
if (!url) { console.error("no image in the answer:", JSON.stringify(data).slice(0, 400)); process.exit(1); }
const n = readdirSync(ROOT + "art/scratch").filter((f) => f.startsWith(name + "-")).length + 1;
const file = `art/scratch/${name}-${n}.png`;
writeFileSync(ROOT + file, Buffer.from(url.split(",")[1], "base64"));
const cost = data.usage?.cost ?? 0;
const log = ROOT + "art/SPEND.md";
if (!existsSync(log)) writeFileSync(log, `# spend on the sea\n\nEvery image generated for the site, in order, rejects included. Model: \`${MODEL}\` on OpenRouter. Budget $10.\n\n| request | refs | cost | kept or rejected |\n|---|---|---|---|\n`);
appendFileSync(log, `| ${file.replace("art/scratch/", "")} | ${refs.map((r) => r.split("/").pop()).join(", ") || "none"} | $${cost.toFixed(4)} | review |\n`);
const total = [...readFileSync(log, "utf8").matchAll(/\| \$(\d+\.\d+) \|/g)].reduce((s, m) => s + Number(m[1]), 0);
console.log(`${file}  $${cost.toFixed(4)}  total $${total.toFixed(2)}`);
