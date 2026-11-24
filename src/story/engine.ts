/* The stories: the grammar of superstarling's story.js (~/superworkspace/apps/site/scripts/story.js), kept small.

   A story is counted in beats. Anything inside it may say when it comes in: data-at="2.3" is a third of the way
   through the third beat. From then it carries .on (the stylesheet says what that looks like), and between data-at
   and data-to it is played through:
     data-type   its words type in (the box keeps their room from the start, so nothing under it moves)
     data-num    its number counts up to its own words ("152", "5.69%")
     data-to     --t runs 0 to 1 (a line draws, a bar fills)
   Two kinds:
     .st         pinned: the scroll is the clock, one screen of scroll a beat; [data-beat] captions change with it
     .st-play    played on the clock once half of it is on screen, data-beats long, held at its end
   With less motion asked for, every story is drawn at its end. One loop, only while a story is on screen. */
import { sceneProgress } from "../world/progress";

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));

type Part = { el: HTMLElement; at: number; to: number | null; text: string | null; num: number | null; unit: string; dec: number; on: boolean | null; t: number; n: string };

export function parts(root: HTMLElement): Part[] {
  return [...root.querySelectorAll<HTMLElement>("[data-at]")].map((el) => {
    const at = parseFloat(el.dataset.at!), to = el.dataset.to != null ? parseFloat(el.dataset.to) : null;
    const text = el.hasAttribute("data-type") ? el.textContent ?? "" : null;
    const said = el.hasAttribute("data-num") ? (el.textContent ?? "").trim() : "";
    const digits = said.match(/^[\d.,]+/)?.[0] ?? "";
    const num = said ? parseFloat(digits.replace(/,/g, "")) : null;
    const dec = digits.includes(".") ? digits.split(".")[1].length : 0;
    if (text != null) { el.setAttribute("aria-label", text.trim()); el.style.setProperty("--chars", String(text.length)); }
    return { el, at, to, text, num, unit: said.slice(digits.length), dec, on: null, t: -1, n: "" };
  });
}

export type { Part };
export function draw(list: Part[], u: number) {
  for (const p of list) {
    const on = u >= p.at;
    if (on !== p.on) { p.on = on; p.el.classList.toggle("on", on); }
    if (p.to == null) continue;
    const t = clamp((u - p.at) / (p.to - p.at));
    if (t === p.t) continue;
    p.t = t;
    if (p.text != null) {
      const s = p.text.slice(0, Math.round(t * p.text.length));
      if (s !== p.n) { p.n = s; p.el.textContent = s; }
      p.el.classList.toggle("typing", t > 0 && t < 1);
    } else if (p.num != null) {
      const s = (t * p.num).toLocaleString("en-GB", { minimumFractionDigits: p.dec, maximumFractionDigits: p.dec }) + p.unit;
      if (s !== p.n) { p.n = s; p.el.textContent = s; }
    } else p.el.style.setProperty("--t", t.toFixed(3));
  }
}

/** Starts every story on the page. Returns the cleanup. */
export function startStories(): () => void {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const offs: (() => void)[] = [];

  // pinned stories, driven by the scroll
  const pinned = [...document.querySelectorAll<HTMLElement>(".st")].map((root) => {
    const caps = [...root.querySelectorAll<HTMLElement>("[data-beat]")], beats = caps.length || 1;
    root.style.setProperty("--beats", String(beats));
    return { root, caps, beats, list: parts(root), bar: root.querySelector<HTMLElement>(".st-bar"), cur: -1, u: -1, seen: false, held: null as boolean | null };
  });
  const paint = (s: (typeof pinned)[number], force = false) => {
    let u = s.beats;
    if (!reduce) {
      const r = s.root.getBoundingClientRect();
      u = sceneProgress(r.top + scrollY, r.height, innerHeight, scrollY) * s.beats;
      // the stage holds the screen only between its top reaching the top and its bottom reaching the bottom; outside
      // that it scrolls like a page, and what was pinned to it (a phone's bottom sheet) has to step away first
      const held = r.top <= 1 && r.bottom >= innerHeight - 1;
      if (held !== s.held) { s.held = held; s.root.toggleAttribute("data-held", held); }
    }
    if (!force && Math.abs(u - s.u) < 0.0005) return;
    s.u = u;
    draw(s.list, u);
    const cur = Math.min(s.beats - 1, Math.floor(u));
    if (cur !== s.cur) { s.cur = cur; s.caps.forEach((c, i) => c.classList.toggle("on", i === cur)); s.root.dataset.cur = String(cur); }
    if (s.bar) s.bar.style.transform = `scaleX(${(u / s.beats).toFixed(4)})`;
  };
  if (pinned.length) {
    let ticking = 0;
    const frame = () => { ticking = 0; for (const s of pinned) if (s.seen || reduce) paint(s); };
    const ask = () => { if (!ticking) ticking = requestAnimationFrame(frame); };
    const io = new IntersectionObserver((es) => { for (const e of es) pinned.find((s) => s.root === e.target)!.seen = e.isIntersecting; ask(); }, { rootMargin: "200px 0px" });
    pinned.forEach((s) => io.observe(s.root));
    pinned.forEach((s) => paint(s, true));
    if (!reduce) addEventListener("scroll", ask, { passive: true });
    addEventListener("resize", ask);
    offs.push(() => { io.disconnect(); removeEventListener("scroll", ask); removeEventListener("resize", ask); cancelAnimationFrame(ticking); });
  }

  // stories on the clock: a beat a second (data-rate scales it) from when half of it is on screen
  for (const root of document.querySelectorAll<HTMLElement>(".st-play")) {
    const list = parts(root), beats = parseFloat(root.dataset.beats || "3"), rate = parseFloat(root.dataset.rate || "1");
    if (reduce) { draw(list, beats); continue; }
    draw(list, 0);
    let raf = 0, t0 = 0;
    const run = (now: number) => { const u = Math.min(beats, ((now - t0) / 1000) * rate); draw(list, u); raf = u < beats ? requestAnimationFrame(run) : 0; };
    const io = new IntersectionObserver(([e]) => {
      if (e.intersectionRatio >= 0.5 && !t0) { t0 = performance.now(); raf = requestAnimationFrame(run); }
      // played again once it has fully left the screen
      if (!e.isIntersecting && t0 && e.intersectionRatio === 0) { cancelAnimationFrame(raf); t0 = 0; draw(list, 0); }
    }, { threshold: [0, 0.5] });
    io.observe(root);
    offs.push(() => { io.disconnect(); cancelAnimationFrame(raf); });
  }
  return () => offs.forEach((f) => f());
}
