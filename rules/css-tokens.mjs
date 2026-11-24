/**
 * No `var(--x)` that nothing defines.
 *
 * An undefined custom property is dropped silently and the element inherits
 * whatever was above it, so `catalogue/rules/sweep.mjs`, which reads computed
 * style, cannot see it. `--step-micro` was used thirteen times and defined
 * nowhere before this existed.
 *
 *     node rules/css-tokens.mjs
 */
import { readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";
import { pathToFileURL } from "node:url";

const SRC = new URL("../src/", import.meta.url).pathname;

// Set from JavaScript, with setProperty or a style prop, so no stylesheet declares them.
// set from js or a react style prop: --t/--beats (story engine), --x --px --w --d (a ship's place, a phone's), --lift (how high a phone's sheet lifts me), --i (a whale), --plate, --g (the gauge), --who-aka --who-base (the who-struck bars), --amp (a packet)
const FROM_JS = new Set(["--t", "--beats", "--x", "--px", "--w", "--d", "--lift", "--plate", "--g", "--amp", "--k"]);

function* sheets(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const at = join(dir, entry.name);
    if (entry.isDirectory()) yield* sheets(at);
    else if (entry.name.endsWith(".css")) yield at;
  }
}

// [name, ["file:line", …]] for every var(--name) that no stylesheet defines. Comments are blanked first, so a
// token named in one ("--x: was 4px") doesn't count as defined.
export function undefinedTokens(list) {
  const defined = new Set(FROM_JS), used = new Map();
  for (const { file, css: raw } of list) {
    const css = raw.replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, " "));
    for (const [, name] of css.matchAll(/(--[\w-]+)\s*:/g)) defined.add(name);
    css.split("\n").forEach((line, index) => {
      for (const [, name] of line.matchAll(/var\(\s*(--[\w-]+)/g)) {
        if (!used.has(name)) used.set(name, []);
        used.get(name).push(`${file}:${index + 1}`);
      }
    });
  }
  return [...used].filter(([name]) => !defined.has(name));
}

if (import.meta.url !== pathToFileURL(process.argv[1]).href) { /* imported by a test */ } else {
const list = [...sheets(SRC)].map((file) => ({ file: relative(SRC, file), css: readFileSync(file, "utf8") }));
const missing = undefinedTokens(list);
if (missing.length) {
  console.error("css: used and defined nowhere —\n");
  for (const [name, where] of missing) {
    console.error(`  ${name}\n    ${where.join("\n    ")}`);
  }
  console.error(
    "\nEvery one of these is a declaration the browser throws away, leaving the\n" +
      "element with whatever it inherited. Define it in styles/tokens.css, point\n" +
      "it at the token that was meant, or delete the declaration.\n",
  );
  process.exit(1);
}
console.log(`css ok: ${new Set(list.flatMap(({ css }) => [...css.matchAll(/var\(\s*(--[\w-]+)/g)].map((m) => m[1]))).size} custom properties used, all defined`);
}
