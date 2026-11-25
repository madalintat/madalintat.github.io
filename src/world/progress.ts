// How far a pinned scene has formed: 0 when its sticky stage first holds the screen, 1 when it lets go.
export function sceneProgress(top: number, height: number, vh: number, scrollY: number): number {
  const run = height - vh;
  if (run <= 0) return 1;
  return Math.min(1, Math.max(0, (scrollY - top) / run));
}

