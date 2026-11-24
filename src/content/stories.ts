// The two model-by-model stories. Every number here is in sources.ts (ipporu-engine, the speech cards) and in the
// labels note; the stories only say them shorter. lowercase, the cetusian voice.

export type Beat = { id: string; title: string; line: string; num?: string; of?: string; link?: { label: string; href: string } };
/** One model of the engine: its clip on the same match, and three plain lines on what it is, how it learned, how good it is.
    gate: the bar it was set before it ran, and whether it passed. */
export type ModelBeat = Beat & { clip: string; kind: string; learned: string; score: string; gate: { bar: string; met: boolean | null } };

// ipporu: the engine model by model, each on the same all japan 2024 match, drawn with its own real output. Every
// kendo word is said plainly the first time; the numbers are the notebook's (art/model-clips/models.json).
export const IPPORU: ModelBeat[] = [
  { id: "track", title: "the tracker: who is who", clip: "tracker",
    line: "keeps both fighters' identities through every clash, when they lock together and when referees walk in front. it also measures maai, the distance between them, which decides who can reach whom.",
    num: "0", of: "identity swaps on 7 test matches",
    kind: "sam 2.1 masks with a memory, plus a gallery of each fighter's own crops to find them again",
    learned: "nothing trained: the gallery is built from the match itself while it tracks",
    score: "7 of 7 test matches, every ippon on the right fighter. close range read right 23 of 23 times; middle versus far range is not reliable yet",
    gate: { bar: "every ippon on the right fighter, no swaps", met: true } },
  { id: "sides", title: "aka and shiro: red and white", clip: "sides",
    line: "in a match one fighter wears a red ribbon on the back (aka) and one a white one (shiro). the engine reads the ribbon to know which tracked fighter is which colour.",
    kind: "a colour rule on each fighter's upper body, held over half-second stretches",
    learned: "no training: thresholds set by eye on marked clips",
    score: "0 wrong colours in about 45 calls on 12 new matches. it can only call when the ribbon is in view: most of a match",
    gate: { bar: "a rule: no number set before", met: null } },
  { id: "shinai", title: "the shinai: the bamboo sword", clip: "shinai-keypoints",
    line: "finds three points on each fighter's bamboo sword every frame: the grip, the guard and the tip. that is what draws the ribbon of a strike.",
    kind: "a resnet-34 that sees the frame plus both fighters' masks, and marks grip, guard and tip",
    learned: "7,916 frames from 415 videos, labelled automatically by a larger teacher model under strict filters; no hand labels",
    score: "agrees with its teacher 89% of the time on 33 new videos. against my own marks the tip is still hard in a fast swing",
    gate: { bar: "80% of clear-frame tips within 15 px", met: false } },
  { id: "sound", title: "the crack of bamboo", clip: "shinai-sound",
    line: "a strike that lands makes a sharp crack. this hears it in the hall's noise and says when, to the hundredth of a second.",
    num: "14", of: "of 15 hits heard within 80 ms",
    kind: "a rule on the 2 to 8 khz band of the audio, against the hall's own level",
    learned: "no training: tuned on half of 30 hall clips, tested on the other half",
    score: "14 of 15 hits heard in the hall, 81% of what it hears are real cracks. 12 ms delay, hundreds of times faster than real time on one laptop core",
    gate: { bar: "a rule: no pass line written", met: null } },
  { id: "flags", title: "the referees' flags", clip: "flag-reader",
    line: "three referees each raise a red or white flag for a point. two of the same colour is an ippon. this reads every raised flag.",
    num: "99", of: "of 103 flag calls found",
    kind: "a resnet-18 on the crop above each raised hand; pose finds the hands",
    learned: "1,603 raised-hand crops from about 200 match videos, each labelled by eye; one gpu run on modal",
    score: "99 of 103 calls found in the engine. red is right 95% of the time, white 89%",
    gate: { bar: "a call filter checked on 40 ippon: 26 of 28 real kept, 0 of 12 false", met: true } },
  { id: "strike", title: "the strike", clip: "strike",
    line: "not every crack is a strike: blocks crack too. this decides which ones were real strikes. it still calls a third of them wrong.",
    num: "152", of: "of 182 strikes found",
    kind: "a small linear model on sound, pose and dinov2 video features, 400 kb",
    learned: "2,066 cracks from 8 whole matches, every one marked strike or not by eye",
    score: "152 of 182 strikes found with each match held out; 32% of its calls wrong",
    gate: { bar: "90% found and under 1 in 4 wrong", met: false } },
  { id: "ippon", title: "ippon: the point", clip: "ippon",
    line: "an ippon is a clean, scored strike. the engine joins the flags, the strike just before them and the ribbon colour into one call, with no guessing.",
    num: "177", of: "matches agree with the official record",
    kind: "a rule that joins three models; no weights of its own",
    learned: "nothing trained",
    score: "on 177 matches the count and side agree with the record. which target was hit (head, wrist or body) is not solved yet",
    gate: { bar: "a rule: no number set before", met: null } },
  { id: "who", title: "who struck, not solved", clip: "who-struck",
    line: "when no flag goes up, who attacked? my model says 47 of 83 right; always answering aka says 48. so the engine ships it as unsure.",
    link: { label: "how my labels fooled me", href: "/notes/when-my-labels-fooled-me/" },
    kind: "a linear head on frozen v-jepa 2 video features of each fighter",
    learned: "196 labels over 43 matches; the clean test uses only labels that came from the flags",
    score: "47 of 83 on clean labels, the same as always saying aka. research only, not in the engine",
    gate: { bar: "85% right, set before it ran", met: false } },
];

// the shinai ribbon next to the system it learns from: rhizomatiks' fencing visualized (research note rhizomatiks.md).
// their pictures are not ours to show: their rig is told in numbers, with a link to their page.
export const FENCING = {
  them: { name: "rhizomatiks, fencing visualized", year: "2013 to 2021", href: "https://research.rhizomatiks.com/s/works/fencing_tracking/en.html",
    rows: ["24 4k cameras and a lidar around the piste", "200,000 hand-labelled images and a million rendered ones", "markers on the blade until 2016, a venue built for it"] },
  us: { name: "ipporu, the shinai ribbon", year: "2026",
    rows: ["one ordinary broadcast video", "7,916 labels made by a teacher model, no hand labelling", "any match already on youtube"] },
};

// romanian speech: the models one at a time, then the loop they make together
export const SPEECH: Beat[] = [
  { id: "asr", title: "hearing", line: "jackrabbit turns romanian speech into text, small enough for a cpu.", num: "5.69%", of: "wer on fleurs. whisper large-v3: 8.42%" },
  { id: "stream", title: "while you speak", line: "the streaming one writes as you talk, in 32 ms packets, then reads the whole sentence again when you pause.", num: "0.72", of: "s from your last word to the final text" },
  { id: "voices", title: "three voices", line: "amami speaks romanian in three voices from one model. tap a whale.", num: "2.02%", of: "wer when whisper reads them back" },
];
