// Prints both CVs from the /cv page with headless Chrome, and fails unless each is exactly one A4 page.
// BASE=http://localhost:5180 node scripts/cv-pdf.mjs   (default: vite preview of dist/ on :4179)
import { execFileSync, spawn } from "node:child_process";
import { readFileSync, mkdirSync, copyFileSync, existsSync } from "node:fs";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const OUT = ["public/cv", "dist/cv"];
let base = process.env.BASE, server;
if (!base) {
  server = spawn("npx", ["vite", "preview", "--port", "4179", "--strictPort"], { stdio: "ignore" });
  base = "http://localhost:4179";
  await new Promise((r) => setTimeout(r, 2500));
}

export const pages = (pdf) => (pdf.toString("latin1").match(/\/Type\s*\/Page[^s]/g) ?? []).length;

try {
  mkdirSync(OUT[0], { recursive: true });
  for (const v of ["research", "builder"]) {
    const file = `${OUT[0]}/madalin-tatarciuc-${v}.pdf`;
    execFileSync(CHROME, ["--headless=new", "--disable-gpu", "--no-pdf-header-footer", "--virtual-time-budget=8000", `--print-to-pdf=${file}`, `${base}/cv?v=${v}&print=1`], { stdio: "ignore" });
    const n = pages(readFileSync(file));
    if (n !== 1) throw new Error(`${file}: ${n} pages, want 1`);
    if (existsSync("dist")) { mkdirSync(OUT[1], { recursive: true }); copyFileSync(file, `${OUT[1]}/madalin-tatarciuc-${v}.pdf`); }
    console.log(`${file}: 1 page`);
  }
} finally {
  server?.kill();
}
