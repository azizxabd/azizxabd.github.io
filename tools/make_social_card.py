"""Draw the 1200x630 link-preview image (LinkedIn, Slack, iMessage, X).

Usage (needs Pillow):
    python tools/make_social_card.py

Writes assets/img/misc/social-card.png in the site's colours, with the same
wireframe terrain as the home page. Edit NAME / ROLE / HEADLINE below and re-run
if your headline changes.
"""
import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

NAME = 'Abdul Aziz'
ROLE = 'ROBOTICS ENGINEER  ·  PERCEPTION & CONTROL  ·  BOSTON'
HEADLINE = ['Robots that know', 'where they are.']
SITE = 'azizxabd.github.io'

BG, INK, TEXT, MUTED, ACCENT = (12, 18, 16), (220, 232, 225), (232, 238, 234), (157, 170, 163), (245, 213, 71)
W, H, SCALE = 1200, 630, 2  # draw at 2x, then downsample for smooth lines
OUT = Path(__file__).resolve().parent.parent / 'assets' / 'img' / 'misc' / 'social-card.png'
FONTS = Path('C:/Windows/Fonts')  # Segoe UI on Windows; falls back to Pillow's default elsewhere


def font(name, size):
    try:
        return ImageFont.truetype(str(FONTS / name), size * SCALE)
    except OSError:
        return ImageFont.load_default(size * SCALE)


def terrain(draw):
    # Same height field and camera as js/art.js, fitted to a 1200x630 frame.
    cx, cy, f, cam_h = 760, 300, 640, 3.4

    def h(x, z):
        return (0.9 * math.sin(x * 0.22 + z * 0.13) + 0.6 * math.sin(x * 0.09 - z * 0.27)
                + 0.35 * math.sin(x * 0.5 + z * 0.41) + ((z - 28) * 0.16 if z > 28 else 0))

    def proj(x, y, z):
        return ((cx + x * f / z) * SCALE, (cy + (cam_h - y) * f / z) * SCALE)

    rows, z = [], 3.2
    while z < 90:
        rows.append(z)
        z *= 1.065
    for i, z in enumerate(rows):
        a = 0.30 - 0.23 * i / len(rows)
        colour = tuple(round(BG[k] + (INK[k] - BG[k]) * a) for k in range(3))
        xlim = min(70, 700 * z / f + 1)
        pts = [proj(x / 10, h(x / 10, z), z) for x in range(int(-xlim * 10), int(xlim * 10) + 1, 8)]
        draw.line(pts, fill=colour, width=SCALE)
    trail, zz = [], 3.4
    while zz <= 34:
        tx = 2.6 * math.sin(zz * 0.21) + 1.4 * math.sin(zz * 0.07) + 1.5
        trail.append(proj(tx, h(tx, zz) + 0.04, zz))
        zz += 0.2
    draw.line(trail, fill=ACCENT, width=3 * SCALE, joint='curve')
    ex, ey = trail[-1]
    r = 6 * SCALE
    draw.ellipse((ex - r, ey - r, ex + r, ey + r), fill=ACCENT)


def main():
    img = Image.new('RGB', (W * SCALE, H * SCALE), BG)
    d = ImageDraw.Draw(img)
    terrain(d)
    # soft fade behind the text so it stays readable
    fade = Image.new('L', (W * SCALE, H * SCALE), 0)
    fd = ImageDraw.Draw(fade)
    for x in range(0, 760 * SCALE):
        fd.line([(x, 0), (x, H * SCALE)], fill=int(235 * max(0, 1 - x / (760 * SCALE)) ** 0.8))
    img.paste(Image.new('RGB', img.size, BG), (0, 0), fade)
    d = ImageDraw.Draw(img)
    m = 72 * SCALE
    d.text((m, 64 * SCALE), NAME, font=font('seguisb.ttf', 30), fill=TEXT)
    d.text((m, 168 * SCALE), ROLE, font=font('consola.ttf', 18), fill=MUTED)
    y = 214 * SCALE
    for line in HEADLINE:
        d.text((m, y), line, font=font('segoeuisl.ttf', 86), fill=TEXT)
        y += 100 * SCALE
    d.text((m, 540 * SCALE), SITE, font=font('consola.ttf', 20), fill=ACCENT)
    img.resize((W, H), Image.LANCZOS).save(OUT, optimize=True)
    print('wrote', OUT)


if __name__ == '__main__':
    main()
