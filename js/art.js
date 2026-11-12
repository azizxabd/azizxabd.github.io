/* Generated line art. Each function returns an <svg> string.
   Colours come from CSS classes (.ink-*, .acc-*) so they follow the theme
   and accent automatically. Add a new drawing by adding a function to ART. */
(function () {
  'use strict';

  function rng(seed) {
    return function () {
      seed = (seed + 0x6d2b79f5) | 0;
      var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function f1(n) { return Math.round(n * 10) / 10; }
  function path(d, cls, extra) { return '<path d="' + d + '" class="' + cls + '"' + (extra || '') + '/>'; }
  function svg(viewBox, body, attrs) {
    return '<svg viewBox="' + viewBox + '" aria-hidden="true" focusable="false"' + (attrs || '') + '>' + body + '</svg>';
  }

  /* Hero: wireframe terrain with an accent trail */
  function terrain() {
    var cx = 720, cy = 430, f = 900, camH = 3.4;
    function h(x, z) {
      return 0.9 * Math.sin(x * 0.22 + z * 0.13) + 0.6 * Math.sin(x * 0.09 - z * 0.27) +
        0.35 * Math.sin(x * 0.5 + z * 0.41) + (z > 28 ? (z - 28) * 0.16 : 0);
    }
    function proj(x, y, z) { return [cx + (x * f) / z, cy + ((camH - y) * f) / z]; }
    var bands = ['', '', '', '', ''], rows = [];
    for (var z = 3.2; z < 90; z *= 1.065) rows.push(z);
    rows.forEach(function (z, i) {
      var b = Math.min(4, Math.floor((i / rows.length) * 5)), d = '';
      // Only generate points that land inside the 1440-wide view (plus one step).
      var xlim = Math.min(70, (760 * z) / f + 0.8);
      var x0 = -70 + 0.8 * Math.floor((70 - xlim) / 0.8);
      for (var x = x0; x <= xlim; x += 0.8) {
        var p = proj(x, h(x, z), z);
        d += (d ? 'L' : 'M') + f1(p[0]) + ' ' + f1(p[1]);
      }
      bands[b] += d;
    });
    var trail = '', ex = 0, ey = 0;
    for (var zz = 3.4; zz <= 34; zz += 0.2) {
      var tx = 2.6 * Math.sin(zz * 0.21) + 1.4 * Math.sin(zz * 0.07) + 1.5;
      var tp = proj(tx, h(tx, zz) + 0.04, zz);
      trail += (trail ? 'L' : 'M') + f1(tp[0]) + ' ' + f1(tp[1]);
      ex = f1(tp[0]); ey = f1(tp[1]);
    }
    var widths = [1.4, 1.2, 1, 1, 1], ops = [0.3, 0.24, 0.18, 0.12, 0.07], body = '';
    for (var k = 4; k >= 0; k--) {
      body += path(bands[k], 'ink-s', ' stroke-opacity="' + ops[k] + '" stroke-width="' + widths[k] + '"');
    }
    body += path(trail, 'acc-s trail', ' stroke-width="3"');
    body += '<circle cx="' + ex + '" cy="' + ey + '" r="6" class="acc-f"/>';
    body += '<circle cx="' + ex + '" cy="' + ey + '" r="18" class="acc-s pulse" stroke-opacity="0.4"/>';
    return svg('0 0 1440 900', body, ' preserveAspectRatio="xMidYMax slice" class="art art-terrain"');
  }

  /* Optical-flow field radiating from a focus of expansion */
  function flow() {
    var r = rng(7), fl = '', fd = '', fh = '';
    for (var i = 0; i < 460; i++) {
      var px = r() * 1200, py = r() * 760, dx = px - 620, dy = py - 360;
      if (Math.sqrt(dx * dx + dy * dy) < 50) continue;
      var k = 0.11 * (0.55 + r() * 0.7);
      fl += 'M' + f1(px) + ' ' + f1(py) + 'L' + f1(px + dx * k) + ' ' + f1(py + dy * k);
      var dot = 'M' + f1(px) + ' ' + f1(py) + 'h0.01';
      if (r() < 0.1) fh += dot; else fd += dot;
    }
    return svg('0 0 1200 760',
      path(fl, 'ink-s', ' stroke-opacity="0.22" stroke-width="1.4"') +
      path(fd, 'ink-s', ' stroke-opacity="0.55" stroke-width="3.2"') +
      path(fh, 'acc-s', ' stroke-width="5"') +
      '<circle cx="620" cy="360" r="5" class="text-f"/>' +
      '<circle cx="620" cy="360" r="26" class="text-s" stroke-opacity="0.3"/>',
      ' class="art"');
  }

  /* LiDAR rings, top-down with tilt, with occluded shadows */
  function lidar() {
    var occ = [{ a: 38, w: 16, ring: 8 }, { a: 150, w: 22, ring: 13 }, { a: 232, w: 12, ring: 5 }, { a: 318, w: 26, ring: 17 }, { a: 95, w: 9, ring: 20 }];
    var near = '', far = '', hit = '';
    for (var ring = 0; ring < 26; ring++) {
      for (var a = 0; a < 360; a += 2.5) {
        var blocked = false, isHit = false;
        for (var o = 0; o < occ.length; o++) {
          var diff = Math.abs(((a - occ[o].a + 540) % 360) - 180);
          if (diff < occ[o].w / 2) {
            if (ring > occ[o].ring) blocked = true;
            if (ring === occ[o].ring) isHit = true;
          }
        }
        if (blocked) continue;
        var rad = (a * Math.PI) / 180;
        var rr = (34 + ring * 13) * (1 + 0.035 * Math.sin(4 * rad + ring * 0.5));
        var pt = 'M' + f1(600 + Math.cos(rad) * rr * 1.25) + ' ' + f1(376 + Math.sin(rad) * rr * 0.62) + 'h0.01';
        if (isHit) hit += pt; else if (ring < 12) near += pt; else far += pt;
      }
    }
    return svg('0 0 1200 760',
      path(far, 'ink-s', ' stroke-opacity="0.2" stroke-width="2.4"') +
      path(near, 'ink-s', ' stroke-opacity="0.5" stroke-width="2.4"') +
      path(hit, 'acc-s', ' stroke-width="4"') +
      '<rect x="588" y="368" width="24" height="16" rx="3" class="text-f"/>',
      ' class="art"');
  }

  /* Two Gaussians of equal area — wide baseline vs. narrow result */
  function variance(opts) {
    opts = opts || {};
    var wide = opts.wide || { label: 'baseline', sigma: 146.8 };
    var narrow = opts.narrow || { label: 'ours', sigma: 26.9 };
    function gauss(sig, peak) {
      var d = 'M80 640';
      for (var x = 80; x <= 1120; x += 4) {
        var u = (x - 600) / sig;
        d += 'L' + x + ' ' + f1(640 - peak * Math.exp(-0.5 * u * u));
      }
      return d + 'L1120 640Z';
    }
    var widePeak = 84, narrowPeak = Math.min(560, (widePeak * wide.sigma) / narrow.sigma);
    function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
    return svg('0 0 1200 760',
      '<line x1="80" y1="640" x2="1120" y2="640" class="line-s" stroke-width="1.5"/>' +
      path(gauss(wide.sigma * 1.6, widePeak), 'ink-s ink-f', ' fill-opacity="0.06" stroke-opacity="0.35" stroke-width="2"') +
      path(gauss(narrow.sigma * 1.6, narrowPeak), 'acc-s acc-f', ' fill-opacity="0.16" stroke-width="3"') +
      '<text x="940" y="600" class="mono-t muted-f">' + esc(wide.label) + '</text>' +
      '<text x="660" y="' + f1(640 - narrowPeak - 2) + '" class="mono-t acc-f">' + esc(narrow.label) + '</text>',
      ' class="art"');
  }

  /* Teleop, top-down: the handle's path (dashed) wanders outside the
     workspace box; the arm (accent) follows with a clamped P-controller
     whose speed tapers to zero near the walls. */
  function teleop() {
    var cx = 600, cy = 380, bw = 340, bh = 250, margin = 110;
    var hand = '', arm = '', px = cx, py = cy, hx = cx, hy = cy;
    var k = 0.09, vmax = 7;
    function taper(p, v, c, half) {
      var dist = v > 0 ? c + half - p : p - (c - half);
      if (dist <= 0) return 0;
      return dist < margin ? v * (dist / margin) : v;
    }
    var N = 1400;
    for (var i = 0; i <= N; i++) {
      var t = (i / N) * Math.PI * 4;
      hx = cx + 360 * Math.sin(0.7 * t + 0.5) + 90 * Math.sin(2.3 * t + 1.2);
      hy = cy + 210 * Math.sin(1.1 * t) + 80 * Math.sin(2.9 * t + 0.7);
      if (i === 0) { px = hx; py = hy; px = Math.max(cx - bw + 20, Math.min(cx + bw - 20, px)); py = Math.max(cy - bh + 20, Math.min(cy + bh - 20, py)); }
      var vx = Math.max(-vmax, Math.min(vmax, k * (hx - px)));
      var vy = Math.max(-vmax, Math.min(vmax, k * (hy - py)));
      px += taper(px, vx, cx, bw); py += taper(py, vy, cy, bh);
      hand += (hand ? 'L' : 'M') + f1(hx) + ' ' + f1(hy);
      arm += (arm ? 'L' : 'M') + f1(px) + ' ' + f1(py);
    }
    return svg('0 0 1200 760',
      '<rect x="' + (cx - bw) + '" y="' + (cy - bh) + '" width="' + bw * 2 + '" height="' + bh * 2 + '" rx="6" class="ink-s" fill="none" stroke-opacity="0.35" stroke-width="1.5"/>' +
      '<rect x="' + (cx - bw + margin) + '" y="' + (cy - bh + margin) + '" width="' + (bw - margin) * 2 + '" height="' + (bh - margin) * 2 + '" rx="4" class="ink-s" fill="none" stroke-opacity="0.12" stroke-width="1" stroke-dasharray="4 8"/>' +
      path(hand, 'ink-s', ' stroke-opacity="0.5" stroke-width="2.4" stroke-dasharray="0.1 9"') +
      path(arm, 'acc-s', ' stroke-width="3"') +
      '<circle cx="' + f1(hx) + '" cy="' + f1(hy) + '" r="6" class="text-f"/>' +
      '<circle cx="' + f1(px) + '" cy="' + f1(py) + '" r="7" class="acc-f"/>' +
      '<circle cx="' + f1(px) + '" cy="' + f1(py) + '" r="22" class="acc-s" stroke-opacity="0.4"/>' +
      '<text x="' + (cx - bw) + '" y="' + (cy - bh - 18) + '" class="mono-t muted-f">workspace ±15 cm</text>' +
      '<text x="' + (cx + bw) + '" y="' + (cy + bh + 40) + '" text-anchor="end" class="mono-t muted-f">- - handle   ── arm</text>',
      ' class="art"');
  }

  /* ── Small thumbnails (640×360) for archive cards ─────────────────── */
  function thumb(body) { return svg('0 0 640 360', body, ' class="art"'); }
  function rect(x, y, w, h, cls, extra) {
    return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="none" class="' + cls + '"' + (extra || '') + '/>';
  }
  function label(x, y, t, cls) { return '<text x="' + x + '" y="' + y + '" font-size="14" class="mono-t ' + (cls || 'muted-f') + '">' + t + '</text>'; }

  // Object detection: a street in perspective with bounding boxes
  function detect() {
    var b = '', vx = 320, vy = 120;
    [-520, -260, 0, 260, 520].forEach(function (x, i) {
      b += path('M' + (320 + x) + ' 360L' + vx + ' ' + vy, 'ink-s', ' stroke-opacity="' + (i === 2 ? 0.25 : 0.14) + '" stroke-width="1.4"' + (i === 2 ? ' stroke-dasharray="10 12"' : ''));
    });
    for (var k = 0; k < 7; k++) { var y = vy + Math.pow(k / 6, 2) * 240; b += path('M0 ' + f1(y) + 'L640 ' + f1(y), 'ink-s', ' stroke-opacity="0.05"'); }
    b += rect(86, 200, 150, 104, 'ink-s', ' stroke-opacity="0.5" stroke-width="2" rx="3"') + label(86, 192, 'car 0.94');
    b += rect(402, 152, 52, 110, 'ink-s', ' stroke-opacity="0.5" stroke-width="2" rx="3"') + label(402, 144, 'person 0.95');
    b += rect(268, 168, 104, 76, 'acc-s', ' stroke-width="2.5" rx="3"') + label(268, 160, 'car 0.98', 'acc-f');
    return thumb(b);
  }

  // Document scanner: a skewed page warped flat by a 4-point transform
  function scan() {
    var q = [[70, 92], [260, 62], [292, 286], [96, 312]], d = 'M' + q.map(function (p) { return p.join(' '); }).join('L') + 'Z';
    var b = path(d, 'ink-s', ' stroke-opacity="0.45" stroke-width="2"');
    q.forEach(function (p) { b += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="6" class="acc-f"/>'; });
    b += path('M318 186L360 186M350 176L362 186L350 196', 'ink-s', ' stroke-opacity="0.5" stroke-width="2"');
    b += rect(392, 62, 186, 250, 'acc-s', ' stroke-width="2.5" rx="4"');
    for (var i = 0; i < 9; i++) b += path('M414 ' + (96 + i * 22) + 'L' + (556 - (i % 3) * 26) + ' ' + (96 + i * 22), 'ink-s', ' stroke-opacity="0.3" stroke-width="3"');
    for (var j = 0; j < 7; j++) {
      var t = (j + 1) / 8;
      var a = [q[0][0] + (q[3][0] - q[0][0]) * t, q[0][1] + (q[3][1] - q[0][1]) * t], c = [q[1][0] + (q[2][0] - q[1][0]) * t, q[1][1] + (q[2][1] - q[1][1]) * t];
      b += path('M' + f1(a[0] + 18) + ' ' + f1(a[1]) + 'L' + f1(c[0] - 24) + ' ' + f1(c[1]), 'ink-s', ' stroke-opacity="0.18" stroke-width="3"');
    }
    return thumb(b);
  }

  // Object measurement: dimension lines around a part
  function measure() {
    var b = '<circle cx="300" cy="190" r="92" class="ink-s" stroke-opacity="0.45" stroke-width="2"/>' +
      '<circle cx="300" cy="190" r="34" class="ink-s" stroke-opacity="0.3" stroke-width="2"/>';
    for (var i = 0; i < 24; i++) {
      var a = i / 24 * Math.PI * 2, r1 = 92, r2 = 106;
      b += path('M' + f1(300 + Math.cos(a) * r1) + ' ' + f1(190 + Math.sin(a) * r1) + 'L' + f1(300 + Math.cos(a) * r2) + ' ' + f1(190 + Math.sin(a) * r2), 'ink-s', ' stroke-opacity="0.45" stroke-width="5"');
    }
    b += path('M194 318L406 318M194 306L194 330M406 306L406 330', 'acc-s', ' stroke-width="2"') + label(262, 346, '212.0 mm', 'acc-f');
    b += path('M452 84L452 296M440 84L464 84M440 296L464 296', 'ink-s', ' stroke-opacity="0.5" stroke-width="2"') + label(472, 196, '212.4');
    b += path('M194 84L194 300M406 84L406 300', 'ink-s', ' stroke-opacity="0.12" stroke-dasharray="4 6"');
    return thumb(b);
  }

  // N-queens: one valid 8-queen solution, with one queen's lines of attack
  function queens() {
    var s = 38, x0 = 168, y0 = 28, sol = [0, 4, 7, 5, 2, 6, 1, 3], b = '';
    for (var r = 0; r < 8; r++) for (var c = 0; c < 8; c++) {
      if ((r + c) % 2) b += '<rect x="' + (x0 + c * s) + '" y="' + (y0 + r * s) + '" width="' + s + '" height="' + s + '" class="ink-f" fill-opacity="0.07"/>';
    }
    b += rect(x0, y0, s * 8, s * 8, 'ink-s', ' stroke-opacity="0.35" stroke-width="1.5"');
    var qr = 3, qc = sol[3], cx = x0 + qc * s + s / 2, cy = y0 + qr * s + s / 2;
    b += path('M' + x0 + ' ' + cy + 'L' + (x0 + 8 * s) + ' ' + cy + 'M' + cx + ' ' + y0 + 'L' + cx + ' ' + (y0 + 8 * s) +
      'M' + (cx - 3 * s) + ' ' + (cy - 3 * s) + 'L' + (cx + 3 * s) + ' ' + (cy + 3 * s) + 'M' + (cx - 3 * s) + ' ' + (cy + 3 * s) + 'L' + (cx + 4 * s) + ' ' + (cy - 4 * s), 'acc-s', ' stroke-opacity="0.35" stroke-width="1.5"');
    sol.forEach(function (c, r) {
      b += '<circle cx="' + (x0 + c * s + s / 2) + '" cy="' + (y0 + r * s + s / 2) + '" r="10" class="' + (r === qr ? 'acc-f' : 'text-f') + '"' + (r === qr ? '' : ' fill-opacity="0.75"') + '/>';
    });
    return thumb(b);
  }

  // PCB: a microcontroller with traces running to edge pads, one bus highlighted
  function board() {
    var b = rect(60, 40, 520, 280, 'ink-s', ' stroke-opacity="0.35" stroke-width="2" rx="14"') +
      rect(270, 130, 100, 100, 'text-s', ' stroke-opacity="0.6" stroke-width="2" rx="4"');
    for (var i = 0; i < 6; i++) {
      var y = 142 + i * 15, x = 142 + i * 15;
      b += path('M270 ' + y + 'L' + (200 - i * 8) + ' ' + y + 'L' + (200 - i * 8) + ' ' + (64 + i * 4) + 'L' + (90 + i * 22) + ' ' + (64 + i * 4), 'ink-s', ' stroke-opacity="0.3" stroke-width="2"');
      b += path('M' + (x + 128) + ' 230L' + (x + 128) + ' ' + (270 + i * 6) + 'L' + (120 + i * 40) + ' ' + (270 + i * 6) + 'L' + (120 + i * 40) + ' 300', 'ink-s', ' stroke-opacity="0.22" stroke-width="2"');
      b += '<circle cx="' + (120 + i * 40) + '" cy="300" r="5" class="ink-s" stroke-opacity="0.4" stroke-width="2"/>';
    }
    b += path('M370 160L470 160L470 110L560 110M370 175L485 175L485 125L560 125', 'acc-s', ' stroke-width="2.5"');
    b += label(486, 98, 'CAN', 'acc-f');
    return thumb(b);
  }

  // Telemetry: a flight altitude trace above a ground station sending pulses
  function radio() {
    var d = '';
    for (var x = 0; x <= 600; x += 6) { var t = x / 600, y = 300 - 250 * Math.sin(Math.PI * Math.pow(t, 0.8)) * (1 - 0.15 * t); d += (d ? 'L' : 'M') + (20 + x) + ' ' + f1(y); }
    var b = path('M20 300L620 300', 'line-s', ' stroke-width="1.5"') + path(d, 'acc-s', ' stroke-width="2.5"');
    b += '<circle cx="80" cy="300" r="6" class="text-f"/>';
    [40, 80, 120].forEach(function (r, i) { b += path('M' + (80 - r * 0.7) + ' ' + (300 - r * 0.7) + 'A' + r + ' ' + r + ' 0 0 1 ' + (80 + r * 0.7) + ' ' + (300 - r * 0.7), 'ink-s', ' stroke-opacity="' + (0.45 - i * 0.12) + '" stroke-width="2"'); });
    b += label(380, 40, 'apogee', 'acc-f') + label(96, 330, 'ground station');
    return thumb(b);
  }

  // Web platform: a browser window wireframe
  function web() {
    var b = rect(70, 30, 500, 300, 'ink-s', ' stroke-opacity="0.4" stroke-width="2" rx="12"') + path('M70 70L570 70', 'ink-s', ' stroke-opacity="0.3" stroke-width="2"');
    [96, 116, 136].forEach(function (x) { b += '<circle cx="' + x + '" cy="50" r="5" class="ink-s" stroke-opacity="0.45" stroke-width="2"/>'; });
    b += path('M106 112L330 112M106 136L270 136', 'text-s', ' stroke-opacity="0.55" stroke-width="8"');
    b += rect(106, 158, 112, 36, 'acc-s', ' stroke-width="2.5" rx="18"');
    [106, 260, 414].forEach(function (x) { b += rect(x, 222, 128, 82, 'ink-s', ' stroke-opacity="0.3" stroke-width="2" rx="8"') + path('M' + (x + 16) + ' 282L' + (x + 90) + ' 282', 'ink-s', ' stroke-opacity="0.3" stroke-width="5"'); });
    return thumb(b);
  }

  /* Placeholder for projects without a photo: a LiDAR-style dot scan in
     the same style as the NURover card. `seed` (any string, e.g. the project
     id) moves the "obstacles", so each project gets its own pattern.
     `small: true` draws bigger dots for little thumbnails. */
  function dots(opts) {
    opts = opts || {};
    var str = String(opts.seed || 'x'), hsh = 2166136261;
    for (var c = 0; c < str.length; c++) { hsh ^= str.charCodeAt(c); hsh = Math.imul(hsh, 16777619); }
    var r = rng(hsh), occ = [], n = 4 + Math.floor(r() * 3);
    for (var o = 0; o < n; o++) occ.push({ a: r() * 360, w: 9 + r() * 20, ring: 4 + Math.floor(r() * 16) });
    var W = 1200, H = 675, cx = W / 2, cy = H / 2, sw = opts.small ? 5 : 2.6;
    var rings = opts.small ? 18 : 24, gap = opts.small ? 19 : 12.5, step = opts.small ? 4 : 2.5;
    var near = '', far = '', hit = '';
    for (var ring = 0; ring < rings; ring++) {
      for (var a = 0; a < 360; a += step) {
        var blocked = false, isHit = false;
        for (var k = 0; k < occ.length; k++) {
          var diff = Math.abs(((a - occ[k].a + 540) % 360) - 180);
          if (diff < occ[k].w / 2) {
            if (ring > occ[k].ring) blocked = true;
            if (ring === occ[k].ring) isHit = true;
          }
        }
        if (blocked) continue;
        var rad = (a * Math.PI) / 180;
        var rr = (30 + ring * gap) * (1 + 0.035 * Math.sin(4 * rad + ring * 0.5));
        var pt = 'M' + f1(cx + Math.cos(rad) * rr * 1.25) + ' ' + f1(cy + Math.sin(rad) * rr * 0.62) + 'h0.01';
        if (isHit) hit += pt; else if (ring < rings / 2) near += pt; else far += pt;
      }
    }
    return svg('0 0 ' + W + ' ' + H,
      path(far, 'ink-s', ' stroke-opacity="0.2" stroke-width="' + sw + '"') +
      path(near, 'ink-s', ' stroke-opacity="0.5" stroke-width="' + sw + '"') +
      path(hit, 'acc-s', ' stroke-width="' + sw * 1.6 + '"') +
      '<rect x="' + (cx - 12) + '" y="' + (cy - 8) + '" width="24" height="16" rx="3" class="text-f"/>',
      ' preserveAspectRatio="xMidYMid slice" class="art"');
  }

  // AI assistant: a conversation, with a mood trace underneath
  function chat() {
    function bubble(x, y, w, h, cls, op, tailLeft) {
      var t = tailLeft ? 'M' + (x + 18) + ' ' + (y + h) + 'L' + (x + 10) + ' ' + (y + h + 14) + 'L' + (x + 34) + ' ' + (y + h)
        : 'M' + (x + w - 34) + ' ' + (y + h) + 'L' + (x + w - 10) + ' ' + (y + h + 14) + 'L' + (x + w - 18) + ' ' + (y + h);
      return rect(x, y, w, h, cls, ' stroke-opacity="' + op + '" stroke-width="2" rx="14"') + path(t, cls, ' stroke-opacity="' + op + '" stroke-width="2"');
    }
    var b = bubble(80, 40, 250, 56, 'ink-s', 0.45, true) + path('M102 62L290 62M102 76L240 76', 'ink-s', ' stroke-opacity="0.3" stroke-width="4"');
    b += bubble(300, 118, 260, 56, 'acc-s', 1, false) + path('M322 140L530 140M322 154L470 154', 'acc-s', ' stroke-opacity="0.55" stroke-width="4"');
    b += bubble(80, 196, 170, 40, 'ink-s', 0.45, true);
    [112, 132, 152].forEach(function (x) { b += '<circle cx="' + x + '" cy="216" r="4" class="text-f" fill-opacity="0.6"/>'; });
    var d = '';
    for (var x = 0; x <= 480; x += 8) d += (d ? 'L' : 'M') + (80 + x) + ' ' + f1(312 - 18 * Math.sin(x / 48) - 10 * Math.sin(x / 19) - x * 0.04);
    b += path('M80 330L560 330', 'line-s', ' stroke-width="1.5"') + path(d, 'ink-s', ' stroke-opacity="0.5" stroke-width="2"');
    b += label(470, 352, 'mood');
    return thumb(b);
  }

  // IK solver: a planar arm reaching along a helical target path, with ghost poses
  function arm() {
    var base = [130, 320], L = [150, 120, 80];
    function fk(q) {
      var x = base[0], y = base[1], a = 0, pts = [[x, y]];
      for (var i = 0; i < 3; i++) { a += q[i]; x += L[i] * Math.cos(a); y -= L[i] * Math.sin(a); pts.push([x, y]); }
      return pts;
    }
    function draw(q, cls, op, w) {
      var p = fk(q), d = 'M' + p.map(function (v) { return f1(v[0]) + ' ' + f1(v[1]); }).join('L');
      var s = path(d, cls, ' stroke-opacity="' + op + '" stroke-width="' + w + '"');
      p.slice(0, 3).forEach(function (v) { s += '<circle cx="' + f1(v[0]) + '" cy="' + f1(v[1]) + '" r="' + (w * 2.2) + '" class="' + cls + '" stroke-opacity="' + op + '" stroke-width="2"/>'; });
      return { svg: s, tip: p[3] };
    }
    var helix = '';
    for (var t = 0; t <= 1; t += 0.01) {
      var x = 380 + t * 170 + 40 * Math.cos(t * Math.PI * 6), y = 230 - t * 120 + 18 * Math.sin(t * Math.PI * 6);
      helix += (helix ? 'L' : 'M') + f1(x) + ' ' + f1(y);
    }
    var b = path('M70 320L250 320', 'line-s', ' stroke-width="2"') + path(helix, 'acc-s', ' stroke-opacity="0.7" stroke-width="2.5"');
    b += draw([1.25, -0.95, -0.55], 'ink-s', 0.18, 2).svg + draw([1.05, -0.75, -0.35], 'ink-s', 0.28, 2).svg;
    var cur = draw([0.82, -0.52, -0.2], 'text-s', 0.85, 3);
    b += cur.svg + '<circle cx="' + f1(cur.tip[0]) + '" cy="' + f1(cur.tip[1]) + '" r="7" class="acc-f"/>';
    b += '<circle cx="' + f1(cur.tip[0]) + '" cy="' + f1(cur.tip[1]) + '" r="18" class="acc-s" stroke-opacity="0.4"/>';
    b += label(400, 336, 'J(q)⁺ · Δx');
    return thumb(b);
  }

  // SLAM: a trajectory with keyframes through a sparse map of landmarks
  function slam() {
    var r = rng(11), lm = '', hot = '';
    var traj = [[70, 290], [170, 270], [250, 210], [300, 130], [390, 90], [480, 110], [540, 180], [570, 260]];
    var d = 'M' + traj.map(function (p) { return p.join(' '); }).join('L');
    for (var i = 0; i < 160; i++) {
      var seg = traj[Math.floor(r() * (traj.length - 1))], side = (r() - 0.5) * 2;
      var x = seg[0] + (r() - 0.5) * 90, y = seg[1] + side * (40 + r() * 40);
      var dot = 'M' + f1(x) + ' ' + f1(y) + 'h0.01';
      if (r() < 0.12) hot += dot; else lm += dot;
    }
    var b = path(lm, 'ink-s', ' stroke-opacity="0.45" stroke-width="4"') + path(hot, 'acc-s', ' stroke-width="5"');
    b += path(d, 'acc-s', ' stroke-width="2.5"');
    traj.forEach(function (p, k) {
      if (k % 2) return;
      b += path('M' + p[0] + ' ' + (p[1] - 9) + 'L' + (p[0] + 8) + ' ' + (p[1] + 6) + 'L' + (p[0] - 8) + ' ' + (p[1] + 6) + 'Z', 'text-s', ' stroke-opacity="0.8" stroke-width="2"');
    });
    b += label(470, 336, '15 Hz · CPU');
    return thumb(b);
  }

  // RCM mechanism: every pose of the tool passes through one fixed pivot
  function rcm() {
    var px = 320, py = 250, b = '';
    [-0.55, -0.28, 0, 0.28, 0.55].forEach(function (a, i) {
      var dx = Math.sin(a), dy = -Math.cos(a), x1 = px + dx * 210, y1 = py + dy * 210, x2 = px - dx * 70, y2 = py - dy * 70;
      var on = i === 3;
      b += path('M' + f1(x1) + ' ' + f1(y1) + 'L' + f1(x2) + ' ' + f1(y2), on ? 'text-s' : 'ink-s', ' stroke-opacity="' + (on ? 0.85 : 0.34) + '" stroke-width="' + (on ? 3 : 2) + '"');
      if (on) {
        // parallelogram linkage holding the active pose
        var ox = x1 - 110, oy = y1 + 40;
        b += path('M' + f1(ox) + ' ' + f1(oy) + 'L' + f1(x1) + ' ' + f1(y1) + 'M' + f1(ox) + ' ' + f1(oy) + 'L' + f1(ox + dx * -150) + ' ' + f1(oy - dy * -150) + 'L' + f1(x1 + dx * -150) + ' ' + f1(y1 - dy * -150),
          'ink-s', ' stroke-opacity="0.5" stroke-width="2"');
        b += '<circle cx="' + f1(ox) + '" cy="' + f1(oy) + '" r="5" class="ink-s" stroke-opacity="0.6" stroke-width="2"/>';
      }
    });
    b += '<ellipse cx="' + px + '" cy="' + (py + 6) + '" rx="64" ry="14" fill="none" class="ink-s" stroke-opacity="0.35" stroke-width="2"/>';
    b += '<circle cx="' + px + '" cy="' + py + '" r="7" class="acc-f"/><circle cx="' + px + '" cy="' + py + '" r="22" class="acc-s" stroke-opacity="0.45"/>';
    b += label(px + 34, py + 44, 'fixed pivot', 'acc-f');
    return thumb(b);
  }

  window.ART = {
    dots: dots,
    terrain: terrain, flow: flow, lidar: lidar, variance: variance, teleop: teleop,
    detect: detect, scan: scan, measure: measure, queens: queens, board: board, radio: radio, web: web, chat: chat,
    arm: arm, slam: slam, rcm: rcm,
  };
})();
