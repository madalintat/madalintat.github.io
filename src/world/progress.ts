// How far a pinned scene has formed: 0 when its sticky stage first holds the screen, 1 when it lets go.
export function sceneProgress(top: number, height: number, vh: number, scrollY: number): number {
  const run = height - vh;
  if (run <= 0) return 1;
  return Math.min(1, Math.max(0, (scrollY - top) / run));
}

// Metres on the gauge: straight lines between [documentY, metres] marks, held flat past either end.
export function depthAt(marks: [number, number][], y: number): number {
  if (y <= marks[0][0]) return marks[0][1];
  for (let i = 1; i < marks.length; i++) {
    const [a, ma] = marks[i - 1], [b, mb] = marks[i];
    if (y < b) return Math.round(ma + ((mb - ma) * (y - a)) / (b - a));
  }
  return marks[marks.length - 1][1];
}
