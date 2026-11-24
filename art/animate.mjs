// node art/animate.mjs <pose> "<what moves>" [--secs 4] [--model google/veo-3.1-lite] [--end <pose2>] [--as <name>]
// Turns a keyed-out pose (art/scratch/<pose>-1.png, on chroma green) into a short clip that starts on that drawing
// and ends on it again (or on --end's drawing, for a move from one pose to the next), so a loop closes on itself.
// Saves art/scratch/<pose>[-to-<end>].mp4 and logs the cost in art/SPEND.md, like generate.mjs does for stills.
import { readFileSync, writeFileSync, appendFileSync, existsSync } from "node:fs";

const argv = process.argv.slice(2);
const pose = argv[0], what = argv[1];
const opt = (k, d) => { const i = argv.indexOf(`--${k}`); return i > 0 ? argv[i + 1] : d; };
const secs = Number(opt("secs", 4)), model = opt("model", "google/veo-3.1-lite"), end = opt("end", pose);
if (!pose || !what) { console.error('usage: node art/animate.mjs <pose> "<what moves>" [--secs 4] [--end pose2]'); process.exit(1); }

const env = existsSync(".env.local") ? readFileSync(".env.local", "utf8") : "";
const KEY = process.env.OPENROUTER_API_KEY || env.match(/OPENROUTER_API_KEY=(.+)/)?.[1]?.trim();
if (!KEY) { console.error("no OPENROUTER_API_KEY"); process.exit(1); }
const H = { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" };
const frame = (p, t) => ({ type: "image_url", image_url: { url: `data:image/png;base64,${readFileSync(`art/scratch/${p}-1.png`).toString("base64")}` }, frame_type: t });

const prompt = `${what} Flat mid-century screen print illustration, the drawing's own style and colours kept exactly, no outlines added. `
  + "The camera never moves and never zooms. The background stays one flat, even chroma green (#00FF00) the whole time, "
  + "nothing else appears, no shadow, no text. Smooth, natural, gentle motion that ends exactly where it began.";
const body = { model, prompt, duration: secs, resolution: "720p", aspect_ratio: "16:9", generate_audio: false,
  frame_images: [frame(pose, "first_frame"), frame(end, "last_frame")] };

const sub = await (await fetch("https://openrouter.ai/api/v1/videos", { method: "POST", headers: H, body: JSON.stringify(body) })).json();
if (!sub.polling_url) { console.error(JSON.stringify(sub)); process.exit(1); }
console.error(`submitted ${sub.id}`);
let r;
for (;;) {
  await new Promise((ok) => setTimeout(ok, 15000));
  r = await (await fetch(sub.polling_url, { headers: H })).json();
  if (r.status === "completed") break;
  if (["failed", "cancelled", "expired"].includes(r.status)) { console.error(`${r.status}: ${JSON.stringify(r.error)}`); process.exit(1); }
}
const name = opt("as", end === pose ? pose : `${pose}-to-${end}`); // --as: a reaction, same pose at both ends
const out = `art/scratch/${name}.mp4`;
writeFileSync(out, Buffer.from(await (await fetch(`https://openrouter.ai/api/v1/videos/${sub.id}/content?index=0`, { headers: H })).arrayBuffer()));
const cost = Number(r.usage?.cost ?? 0);
appendFileSync("art/SPEND.md", `| ${name}.mp4 | ${pose}${end !== pose ? " → " + end : ""}, ${model}, ${secs}s | $${cost.toFixed(4)} | review |\n`);
const total = [...readFileSync("art/SPEND.md", "utf8").matchAll(/\| \$([\d.]+) \|/g)].reduce((a, m) => a + Number(m[1]), 0);
console.log(`${out}  $${cost.toFixed(4)}  total $${total.toFixed(2)}`);
