// The worker runs first only for video paths (wrangler.jsonc run_worker_first); every other request is a plain static asset.
import { withRange } from "./range";

type Env = { ASSETS: { fetch(req: Request): Promise<Response> } };

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const range = req.headers.get("range");
    const asset = await env.ASSETS.fetch(new Request(req.url, { method: req.method, headers: { accept: req.headers.get("accept") ?? "*/*" } }));
    return new URL(req.url).pathname.endsWith(".mp4") ? withRange(asset, range) : asset;
  },
};
