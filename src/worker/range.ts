// Cloudflare's static assets answer every request with the whole file (200), even when the browser asks for a byte range.
// A <video> that never gets a 206 cannot seek, so clicking a moment does nothing. This turns the asset into the range asked for.
export async function withRange(res: Response, range: string | null): Promise<Response> {
  if (!res.ok) return res;
  const headers = new Headers(res.headers);
  headers.set("accept-ranges", "bytes");
  const m = range?.match(/^bytes=(\d*)-(\d*)$/);
  if (!m || (!m[1] && !m[2])) return new Response(res.body, { status: res.status, headers });

  const body = await res.arrayBuffer();
  const size = body.byteLength;
  const start = m[1] ? Number(m[1]) : Math.max(0, size - Number(m[2]));
  const end = m[1] && m[2] ? Math.min(Number(m[2]), size - 1) : size - 1;
  if (start >= size || start > end) {
    headers.set("content-range", `bytes */${size}`);
    return new Response(null, { status: 416, headers });
  }
  headers.set("content-range", `bytes ${start}-${end}/${size}`);
  headers.set("content-length", String(end - start + 1));
  return new Response(body.slice(start, end + 1), { status: 206, headers });
}
