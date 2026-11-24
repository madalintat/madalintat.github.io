import type { Source } from "./types";

// Every number on the site points at one of these. A number without a row here fails content.test.ts.
export const sources: Source[] = [
  { id: "ipporu-site", text: "ipporu.com, page description", href: "https://ipporu.com", date: "2026-11-24" },
  { id: "ipporu-git", text: "ipporu repository, commits without merges since 2026-10-08", path: "~/kendo_world", date: "2026-11-24" },
  { id: "ipporu-strikes", text: "ipporu video products, strikes row (E69, 11-05)", path: "~/kendo_world/docs/VIDEO_PRODUCTS.md:79", date: "2026-11-05" },
  { id: "ipporu-e101", text: "ipporu tracking notebook, E101 full run (11-11)", path: "~/kendo_world/platform/research/tracking/notebook.md", date: "2026-11-11" },
  { id: "ipporu-notebook", text: "ipporu tracking notebook, experiment headings", path: "~/kendo_world/platform/research/tracking/notebook.md", date: "2026-11-24" },
  { id: "jackrabbit-card", text: "jackrabbit-110m-ro model card", href: "https://huggingface.co/surogate/jackrabbit-110m-ro", date: "2026-09-15" },
  { id: "amami-card", text: "amami-357m-ro model card", href: "https://huggingface.co/surogate/amami-357m-ro", date: "2026-09-18" },
  { id: "amami-downloads", text: "hugging face api, amami-357m-ro downloads", href: "https://huggingface.co/api/models/surogate/amami-357m-ro", date: "2026-11-24" },
  { id: "superstarling-readme", text: "superstarling readme", path: "~/superworkspace/README.md", date: "2026-11-23" },
  { id: "superstarling-git", text: "superstarling repository, commits without merges since 2026-11-11", path: "~/superworkspace", date: "2026-11-24" },
  { id: "surogates-git", text: "invergent-ai/surogates, my commits without merges", href: "https://github.com/invergent-ai/surogates", date: "2026-11-24" },
];
