import type { Source } from "./types";

// Every number on the site points at one of these. A number without a row here fails content.test.ts.
export const sources: Source[] = [
  { id: "ipporu-site", text: "ipporu.com, page description", href: "https://ipporu.com", date: "2026-11-24" },
  { id: "ipporu-engine", text: "ipporu engine state, ippon against the record (E75, E79)", path: "~/kendo_world/platform/docs/ENGINE_STATE_2026-11-20.md", date: "2026-11-20" },
  { id: "ipporu-strikes", text: "ipporu video products, strikes row (E69, 11-05)", path: "~/kendo_world/docs/VIDEO_PRODUCTS.md:79", date: "2026-11-05" },
  { id: "ipporu-e101", text: "ipporu tracking notebook, E101 full run (11-11)", path: "~/kendo_world/platform/research/tracking/notebook.md", date: "2026-11-11" },
  { id: "ipporu-notebook", text: "ipporu tracking notebook, experiment headings", path: "~/kendo_world/platform/research/tracking/notebook.md", date: "2026-11-24" },
  { id: "jackrabbit-card", text: "jackrabbit-110m-ro model card", href: "https://huggingface.co/surogate/jackrabbit-110m-ro", date: "2026-09-25" },
  { id: "streaming-card", text: "jackrabbit-110m-ro-streaming model card", href: "https://huggingface.co/surogate/jackrabbit-110m-ro-streaming", date: "2026-11-24" },
  { id: "amami-card", text: "amami-357m-ro model card", href: "https://huggingface.co/surogate/amami-357m-ro", date: "2026-11-24" },
  { id: "amami-downloads", text: "hugging face api, amami-357m-ro downloads", href: "https://huggingface.co/api/models/surogate/amami-357m-ro", date: "2026-11-24" },
  { id: "superstarling-readme", text: "superstarling readme", path: "~/superworkspace/README.md", date: "2026-11-23" },
  { id: "superstarling-code", text: "superstarling mcp endpoint", path: "~/superworkspace/apps/server/mcp", date: "2026-11-24" },
  { id: "superstarling-agents", text: "superstarling agent briefs, one file per member", path: "~/superworkspace/catalogue/agents", date: "2026-11-26" },
  { id: "superstarling-tests", text: "superstarling test files, server, web and browser service", path: "~/superworkspace", date: "2026-11-26" },
  { id: "surogates-code", text: "invergent-ai/surogates, the channels and the fake chat servers", href: "https://github.com/invergent-ai/surogates", date: "2026-11-26" },
  { id: "surogates-prs", text: "invergent-ai/surogates, my merged pull requests", href: "https://github.com/invergent-ai/surogates/pulls?q=is%3Apr+is%3Amerged+author%3Amadalintat", date: "2026-11-24" },
];
