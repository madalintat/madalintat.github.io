/* Sprites: the living things of the sea (the character, the whales, the kendoka, the lab's people, the jellies), each
   a short clip cut into a sheet of frames, 8 to a row (art/sprite.sh). An element shows one frame by moving its
   background, sized in % so the element can be any size at the sheet's ratio. Every sprite on the page shares one
   loop, which skips the ones off screen and writes a frame only when it changes. A sprite loops; it can play a
   reaction once (a wave, a strike) and goes back to its loop. With less motion asked for, each shows its first frame. */

export type Sheet = { src: string; n: number; w: number; h: number; fps: number };
const COLS = 8;

/** The frame at time t (ms) of n frames at fps: looping, or, played once, held on its last. */
export function frameAt(t: number, fps: number, n: number, once = false): number {
  const f = Math.floor((t * fps) / 1000 + 1e-6);
  return once ? Math.min(n - 1, f) : f % n;
}

/** Where a frame sits in the sheet: [column, row]. */
export function cellAt(f: number, cols = COLS): [number, number] {
  return [f % cols, Math.floor(f / cols)];
}

type Live = { el: HTMLElement; loop: Sheet; cur: Sheet; t0: number; once: boolean; f: number; seen: boolean; then?: () => void };
const live = new Set<Live>();
let raf = 0;
const reduce = () => typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

function show(s: Live, sheet: Sheet, f: number) {
  const rows = Math.ceil(sheet.n / COLS), [c, r] = cellAt(f);
  if (s.el.dataset.src !== sheet.src) {
    s.el.dataset.src = sheet.src;
    s.el.style.backgroundImage = `url(${sheet.src})`;
    s.el.style.backgroundSize = `${COLS * 100}% ${rows * 100}%`;
  }
  s.el.style.backgroundPosition = `${(c / (COLS - 1)) * 100}% ${rows > 1 ? (r / (rows - 1)) * 100 : 0}%`;
}

function tick(now: number) {
  raf = 0;
  let any = false;
  const still = reduce();
  for (const s of live) {
    if (!s.seen) continue;
    if (still) { if (s.f !== 0) { s.f = 0; show(s, s.cur, 0); } continue; } // less motion: the first frame, once in sight
    any = true;
    let f = frameAt(now - s.t0, s.cur.fps, s.cur.n, s.once);
    if (s.once && f === s.cur.n - 1 && now - s.t0 > (s.cur.n * 1000) / s.cur.fps) {
      // the reaction is over: back to the loop, from its start
      const then = s.then; s.then = undefined;
      s.cur = s.loop; s.once = false; s.t0 = now; f = 0;
      then?.();
    }
    if (f !== s.f || s.el.dataset.src !== s.cur.src) { s.f = f; show(s, s.cur, f); }
  }
  if (any && !document.hidden) raf = requestAnimationFrame(tick);
}
const wake = () => { if (!raf) raf = requestAnimationFrame(tick); };

const io = typeof IntersectionObserver !== "undefined"
  ? new IntersectionObserver((es) => { for (const e of es) for (const s of live) if (s.el === e.target) s.seen = e.isIntersecting; wake(); }, { rootMargin: "200px" })
  : null;
if (typeof document !== "undefined") document.addEventListener("visibilitychange", wake);

export type Sprite = { react(sheet: Sheet, then?: () => void): void; swap(sheet: Sheet): void; stop(): void; el: HTMLElement };

/** Starts a sprite on an element. Preload what a reaction will need with preload(). */
export function sprite(el: HTMLElement, loop: Sheet): Sprite {
  el.style.aspectRatio = `${loop.w} / ${loop.h}`;
  el.style.backgroundRepeat = "no-repeat";
  // the sheet is attached only once the element comes near the screen, so a scene's life loads as it is reached
  const s: Live = { el, loop, cur: loop, t0: performance.now(), once: false, f: -1, seen: !io };
  live.add(s); io?.observe(el); wake();
  return {
    el,
    react(sheet, then) { const prev = s.then; s.then = undefined; prev?.(); if (reduce()) { then?.(); return; } s.cur = sheet; s.once = true; s.t0 = performance.now(); s.then = then; wake(); },
    swap(sheet) { const prev = s.then; s.then = undefined; s.loop = sheet; s.cur = sheet; s.once = false; s.t0 = performance.now(); el.style.aspectRatio = `${sheet.w} / ${sheet.h}`; s.f = -1; wake(); prev?.(); },
    stop() { live.delete(s); io?.unobserve(el); },
  };
}

const loaded = new Set<string>();
export function preload(...sheets: Sheet[]) {
  for (const s of sheets) if (!loaded.has(s.src)) { loaded.add(s.src); const i = new Image(); i.decoding = "async"; i.src = s.src; }
}
