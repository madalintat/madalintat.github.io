import { describe, expect, it } from "vitest";
import { withRange } from "./range";

const file = () => new Response(new Uint8Array(Array.from({ length: 100 }, (_, i) => i)), { headers: { "content-type": "video/mp4" } });
const bytes = async (r: Response) => [...new Uint8Array(await r.arrayBuffer())];

describe("withRange: a video that can seek", () => {
  it("answers a byte range with 206 and only those bytes", async () => {
    const r = await withRange(file(), "bytes=10-19");
    expect(r.status).toBe(206);
    expect(r.headers.get("content-range")).toBe("bytes 10-19/100");
    expect(r.headers.get("content-length")).toBe("10");
    expect(r.headers.get("content-type")).toBe("video/mp4");
    expect(await bytes(r)).toEqual([10, 11, 12, 13, 14, 15, 16, 17, 18, 19]);
  });

  it("reads an open range to the end and a suffix range from the end", async () => {
    expect(await bytes(await withRange(file(), "bytes=95-"))).toEqual([95, 96, 97, 98, 99]);
    expect(await bytes(await withRange(file(), "bytes=-3"))).toEqual([97, 98, 99]);
  });

  it("clamps an end past the file", async () => {
    const r = await withRange(file(), "bytes=98-500");
    expect(r.headers.get("content-range")).toBe("bytes 98-99/100");
  });

  it("refuses a start past the file with 416", async () => {
    const r = await withRange(file(), "bytes=100-");
    expect(r.status).toBe(416);
    expect(r.headers.get("content-range")).toBe("bytes */100");
  });

  it("serves the whole file, saying ranges work, when no range is asked", async () => {
    const r = await withRange(file(), null);
    expect(r.status).toBe(200);
    expect(r.headers.get("accept-ranges")).toBe("bytes");
    expect((await bytes(r)).length).toBe(100);
  });

  it("passes a failed asset through untouched", async () => {
    const r = await withRange(new Response("gone", { status: 404 }), "bytes=0-1");
    expect(r.status).toBe(404);
  });
});
