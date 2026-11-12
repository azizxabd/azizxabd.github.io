"""Make web-sized WebP copies of the site's images.

Usage (needs Pillow: `pip install pillow`):
    python tools/optimize_images.py                 # every image under assets/img (except icons/techstack)
    python tools/optimize_images.py path/to/a.png   # just these files

For each image `foo.png` it writes `foo.webp` next to it, scaled down to at most
MAX_WIDTH pixels wide. Reference the .webp in data/site.js. Already-converted
files are skipped unless the original is newer.
"""
import sys
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent / 'assets' / 'img'
SKIP_DIRS = {'icons', 'techstack', 'misc'}
EXTS = {'.png', '.jpg', '.jpeg'}
MAX_WIDTH = 1400          # wide enough for full-width case-study images on retina
MAX_WIDTH_BY_DIR = {'me': 900}
QUALITY = 78


def convert(src: Path) -> None:
    out = src.with_suffix('.webp')
    if out.exists() and out.stat().st_mtime >= src.stat().st_mtime:
        print(f'skip  {src.relative_to(ROOT)}')
        return
    limit = MAX_WIDTH_BY_DIR.get(src.parent.name, MAX_WIDTH)
    with Image.open(src) as im:
        im = ImageOps.exif_transpose(im)           # respect camera rotation
        if im.mode not in ('RGB', 'RGBA'):
            im = im.convert('RGBA' if 'A' in im.getbands() else 'RGB')
        if im.width > limit:
            im = im.resize((limit, round(im.height * limit / im.width)), Image.LANCZOS)
        im.save(out, 'WEBP', quality=QUALITY, method=6)
    before, after = src.stat().st_size, out.stat().st_size
    print(f'{before // 1024:>6} KB -> {after // 1024:>4} KB  {out.relative_to(ROOT)}')


def main() -> None:
    files = [Path(a).resolve() for a in sys.argv[1:]] or [
        p for p in ROOT.rglob('*')
        if p.suffix.lower() in EXTS and not (SKIP_DIRS & set(p.relative_to(ROOT).parts))
    ]
    for f in sorted(files):
        convert(f)


if __name__ == '__main__':
    main()
