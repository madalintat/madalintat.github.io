"""Smooth the flat tonal steps a generated water painting puts between depth zones.

Each row's median colour is compared with a smooth gradient through all rows; the row is shifted by the difference.
The steps go; everything drawn across them (light shafts, fish, particles) stays where it was. Each row's tone is first
filtered down the picture, so a row's own noise is never copied into the correction; two passes.
(Per-strip corrections were tried: they leave blocks in the shafts and smear the surface's waves.)
    uv run --with numpy --with pillow art/deband.py in.webp out.webp [sky]
With sky (a fraction of the height, 0.4): only a sky is smoothed. Rows below it are left alone (the correction fades
out over the last tenth), and a pixel is corrected only as far as its colour is the sky's, so a hill, a tree or a lit
window that reaches up into the sky keeps its own tone.
"""
import sys
import numpy as np
from PIL import Image

src, dst = sys.argv[1], sys.argv[2]
sky = float(sys.argv[3]) if len(sys.argv) > 3 else None
im = np.asarray(Image.open(src).convert("RGB")).astype(np.float32)
h = im.shape[0]
sigma = h / 14                                   # wide enough to bridge a step, narrow enough to keep the depth fall-off
x = np.arange(-3 * int(sigma), 3 * int(sigma) + 1)
k = np.exp(-(x ** 2) / (2 * sigma ** 2)); k /= k.sum()
def steps(p, n=15):
    """the row profile with its row-to-row noise (waves, a shaft's edge) filtered out: only real steps are left"""
    q = np.pad(p, ((n // 2, n // 2), (0, 0)), mode="edge")
    return np.stack([np.median(q[i:i + n], axis=0) for i in range(len(p))])
for _ in range(2):
    row = steps(np.median(im, axis=1))           # (h, 3): the background tone of each row, the shafts mostly ignored
    pad = np.pad(row, ((len(x) // 2, len(x) // 2), (0, 0)), mode="edge")
    smooth = np.stack([np.convolve(pad[:, c], k, mode="valid") for c in range(3)], axis=1)
    fix = np.broadcast_to((smooth - row)[:, None, :], im.shape).copy()
    if sky is not None:
        ys = np.arange(h) / h
        fix *= np.clip((sky - ys) / (sky * 0.1), 0, 1)[:, None, None]
        near = np.linalg.norm(im - row[:, None, :], axis=2)
        fix *= np.exp(-(near ** 2) / (2 * 28.0 ** 2))[:, :, None]
    im = np.clip(im + fix, 0, 255)
Image.fromarray(im.astype(np.uint8)).save(dst, quality=86, method=6)
print(dst)
