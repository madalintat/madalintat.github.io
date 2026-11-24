// The two model-by-model stories. Every number here is in sources.ts (ipporu-engine, the speech cards) and in the
// labels note; the stories only say them shorter. lowercase, the cetusian voice.

export type Beat = { id: string; title: string; line: string; num?: string; of?: string; link?: { label: string; href: string } };

// ipporu: one match, one model at a time, on the match's own timeline
export const IPPORU: Beat[] = [
  { id: "match", title: "one match, no marks", line: "all japan 2024, 79 seconds of video. nobody marked anything. watch what each model adds." },
  { id: "track", title: "the tracker", line: "keeps both fighters through every clash. the line is the distance between them.", num: "0", of: "swaps on 7 test matches" },
  { id: "sides", title: "aka and shiro", line: "the red or white tasuki on each back says which fighter is which." },
  { id: "sound", title: "the shinai's sound", line: "hears every crack of bamboo, and when it landed.", num: "14", of: "of 15 hits heard within 80 ms" },
  { id: "flags", title: "the flags", line: "reads the three referees' flags, a model i trained.", num: "99", of: "of 103 calls right" },
  { id: "strike", title: "the strike", line: "finds the moment a strike lands. it still calls a third of them wrong.", num: "152", of: "of 182 strikes found" },
  { id: "ippon", title: "ippon", line: "the flags plus the strike just before them. no guessing.", num: "177", of: "matches agree with the record" },
  { id: "who", title: "who struck, not solved", line: "for strikes nobody flags, my model is at 57%. always saying aka gets 58%. so it ships as unsure.", link: { label: "the note", href: "/notes/when-my-labels-fooled-me/" } },
];

// romanian speech: the models one at a time, then the loop they make together
export const SPEECH: Beat[] = [
  { id: "asr", title: "hearing", line: "jackrabbit turns romanian speech into text, on a laptop cpu.", num: "5.69%", of: "wer on fleurs. whisper large-v3: 8.42%" },
  { id: "stream", title: "while you speak", line: "the streaming one writes as you talk, in 32 ms packets, then reads the whole sentence again when you pause.", num: "0.72", of: "s from your last word to the final text" },
  { id: "voices", title: "three voices", line: "amami speaks romanian in three voices from one model. tap a whale.", num: "2.02%", of: "wer when whisper reads them back" },
  { id: "loop", title: "together", line: "hear, think, speak. it is the loop the phone agents in surogates run on.", link: { label: "the models on hugging face", href: "https://huggingface.co/surogate/jackrabbit-110m-ro" } },
];
