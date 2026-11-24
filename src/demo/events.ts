// The ipporu engine's output for one match (platform/replay/studio/lib.json), turned into clip-time events.
export type LibMatch = {
  id: string;
  name: string;
  sub: string;
  win: [number, number];
  strikes: [number, 0 | 1, number][];
  ips: { t: number; who: string; waza: string; letter: string }[];
  flags: [number, string][];
};

export type DemoEvent = {
  kind: "strike" | "ippon" | "flag";
  t: number;
  side?: "aka" | "shiro";
  conf?: number;
  waza?: string;
  letter?: string;
  colour?: string;
};

const ORDER = { strike: 0, ippon: 1, flag: 2 } as const;

export function toClipEvents(m: LibMatch): DemoEvent[] {
  const [a, b] = m.win;
  const inside = (t: number) => t >= a && t <= b;
  const out: DemoEvent[] = [
    ...m.strikes.filter(([t]) => inside(t)).map(([t, s, conf]): DemoEvent => ({ kind: "strike", t: t - a, side: s === 0 ? "aka" : "shiro", conf })),
    ...m.ips.filter((i) => inside(i.t)).map((i): DemoEvent => ({ kind: "ippon", t: i.t - a, side: i.who === "aka" ? "aka" : "shiro", waza: i.waza, letter: i.letter })),
    ...m.flags.filter(([t]) => inside(t)).map(([t, colour]): DemoEvent => ({ kind: "flag", t: t - a, colour })),
  ];
  return out.sort((x, y) => x.t - y.t || ORDER[x.kind] - ORDER[y.kind]);
}

// The label on the video: the latest event at or before t, held for `hold` seconds. Never one that has not happened.
export function lastBefore(events: DemoEvent[], t: number, hold = 2): DemoEvent | undefined {
  let best: DemoEvent | undefined;
  for (const e of events) if (e.t <= t && t - e.t <= hold) best = e;
  return best;
}
