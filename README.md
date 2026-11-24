# madalintat.github.io

my site. one page you scroll from the sky to the underground: each layer is something i built, with the numbers and the links. plus a page per project, notes, and the cv in two versions.

```
npm run dev      # vite on localhost
npm run build    # tokens check, types, client and ssr builds, every route prerendered, then the dist tests
npm run check    # tokens, slop scan, copy (voicecheck), links, tests. run after build
npm run sweep    # ego-browser at 390/820/1280/1600, needs `npx vite preview --port 4179`
node scripts/cv-pdf.mjs   # prints both cv pdfs to public/cv
```

where things live:

- `src/content/world.ts` the layers of the home page, their facts and links
- `src/content/work.ts` and `sources.ts` the project pages and where every number comes from
- `src/content/cv.ts` both cvs, one source for the page and the pdfs
- `content/notes/*.md` notes, front matter plus markdown
- `src/world/canvas.ts` the sky, the flock, the city, the ground
- `public/demo/` the ipporu match and its events, made by `scripts/demo-data.mjs`

deploys with github actions on push to `main` (`.github/workflows/pages.yml`).
