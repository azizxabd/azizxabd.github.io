# azizxabd.github.io

Personal portfolio — static site for GitHub Pages. No build step, no framework:
push to `main` and it's live.

## Editing content

**Everything lives in [`data/site.js`](data/site.js).** You don't need to touch
the HTML, CSS or JS to:

| Change | Where in `site.js` |
| --- | --- |
| Hero headline, intro, buttons | `hero` |
| Add / remove / reorder a project | `projects` (order in the list = order on the page) |
| Promote a project to a big card | set `tier: 'featured'` (or `'more'` / `'archive'`) |
| Give a project its own page | add `case: { role, period, body: [...] }` → `project.html?id=<id>` |
| Experience rows | `experience` |
| Toolkit | `toolkit` |
| Education | `education` |
| Publications, awards | `recognition` |
| Section headings, 404 text | `labels` |
| Accent colour, light/dark default | `theme` |
| Reorder or hide sections | `sections` |
| Email, résumé, socials | `person`, `socials` |

Inline formatting in any text: `*accent*`, `~muted~`, `` `code` ``, and `\n` for a line break.

### Case-study blocks

`case.body` is a list of blocks, rendered in order:

```js
{ type: 'text',  heading: 'Problem', text: ['Paragraph one.', 'Paragraph two.'] }
{ type: 'list',  heading: 'What I did', items: ['…', '…'] }
{ type: 'image', src: 'assets/img/…', alt: '…', caption: '…' }
{ type: 'stats', items: [{ value: '15 Hz', label: 'update rate', accent: true }] }
{ type: 'quote', text: '…' }
{ type: 'art',   art: 'lidar' }   // flow | lidar | variance | terrain
```

Projects can also carry `links: [{ label: 'Paper', url: '…' }]` and `tags: [...]`.

## Structure

```
index.html        home page shell
project.html      case-study page shell (reads ?id=)
data/site.js      ← all content
css/styles.css    design tokens (top of file) + components
js/art.js         generated line-art (terrain, optical flow, LiDAR, variance)
js/app.js         renders pages from data/site.js
assets/           images, icons, docs (put your CV at assets/docs/Abdul_Aziz_CV.pdf)
```

## Adding images (keep the site fast)

Phone photos and screenshots are often 1–3 MB. Before referencing a new image,
make a web copy:

```bash
pip install pillow
python tools/optimize_images.py assets/img/projects/MyShot.png
```

That writes `MyShot.webp` (max 1400 px wide, usually 30–200 KB) next to it.
Use the `.webp` path in `data/site.js`. Images below the fold load lazily, so
visitors only download what they scroll to.

To add a new kind of drawing, add a function to `window.ART` in `js/art.js`
and reference it as `visual: { art: 'yourName' }`.

## Run locally

```bash
python -m http.server 5173
```

Then open http://localhost:5173.
