/* =========================================================
   main.js
   =========================================================
   TABLE OF CONTENTS
   1.  CONFIG  — edit your data here
   2.  Boot / Preloader
   3.  Theme Toggle
   4.  Network Particle Background
   5.  Header Scroll-Spy
   6.  Terminal Tech Stack
   7.  Experience Timeline (scroll progress)
   8.  Projects Carousel + Filter
   9.  Marquee Clone (seamless reviews loop)
   10. Contact Form
   11. Scroll Reveal
   12. Footer year
   ========================================================= */


/* ─────────────────────────────────────────
   1. CONFIG — EDIT YOUR DATA HERE
───────────────────────────────────────── */

/**
 * Tech stack shown in the terminal on the About section.
 * Add / remove categories and items freely.
 * The 'icon' field is optional — use an emoji or leave as ''.
 */
const TECH_STACK = {
  'Robotics & Simulation': [
    { name: 'ROS / ROS2',      icon: '🤖' },
    { name: 'Gazebo',          icon: '🌐' },
    { name: 'RViz',            icon: '📡' },
    { name: 'SLAM',            icon: '🗺️' },
    { name: 'Motion Planning', icon: '🛣️' },
  ],
  'Perception & ML': [
    { name: 'OpenCV',        icon: '👁️' },
    { name: 'PyTorch',       icon: '🔥' },
    { name: 'TensorFlow',    icon: '🧠' },
    { name: 'YOLO',          icon: '⚡' },
    { name: 'Sensor Fusion', icon: '📷' },
  ],
  'Programming & Systems': [
    { name: 'Python', icon: '🐍' },
    { name: 'C++',    icon: '⚙️' },
    { name: 'C#',     icon: '#️⃣' },
    { name: 'Linux',  icon: '🐧' },
    { name: 'Git',    icon: '🌿' },
  ],
  'Hardware & CAD': [
    { name: 'Arduino',         icon: '🔌' },
    { name: 'Raspberry Pi',    icon: '🍓' },
    { name: 'STM32 / CAN Bus', icon: '📶' },
    { name: 'SolidWorks',      icon: '🔧' },
    { name: 'Fusion 360',      icon: '🧩' },
  ],
};

/**
 * Contact form submission.
 * Option A (default): shows a static success message — good for demo.
 * Option B: Formspree — replace YOUR_FORM_ID with the id from formspree.io.
 * Option C: EmailJS  — fill in the three IDs from your EmailJS dashboard.
 */
const CONTACT_CONFIG = {
  // 'static' | 'formspree' | 'emailjs'
  mode: 'static',

  // Formspree
  formspreeId: 'YOUR_FORM_ID',

  // EmailJS
  emailjsPublicKey:  'YOUR_PUBLIC_KEY',
  emailjsServiceId:  'YOUR_SERVICE_ID',
  emailjsTemplateId: 'YOUR_TEMPLATE_ID',
};


/* ─────────────────────────────────────────
   2. BOOT / PRELOADER
───────────────────────────────────────── */
(function boot() {
  const bar    = document.getElementById('pl-bar');
  const status = document.getElementById('pl-status');
  const loader = document.getElementById('preloader');
  const app    = document.getElementById('app');

  function setProgress(pct, label) {
    bar.style.width    = pct + '%';
    status.textContent = label;
  }

  setProgress(20, 'Initialising…');

  // Run all modules
  initTheme();
  initNetwork();
  initScrollSpy();
  initTerminal();
  initTimeline();
  initProjects();
  initMarquee();
  initContact();
  initReveal();
  initFooterYear();

  setProgress(100, 'Ready');

  // Reveal app after two animation frames (guarantees layout is painted)
  requestAnimationFrame(() => requestAnimationFrame(() => {
    app.classList.add('ready');
    loader.classList.add('done');
    setTimeout(() => loader.remove(), 600);
  }));
})();


/* ─────────────────────────────────────────
   3. THEME TOGGLE
───────────────────────────────────────── */
function initTheme() {
  const HTML = document.documentElement;
  const btn  = document.getElementById('theme-btn');

  function apply(theme) {
    HTML.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch (_) {}
  }

  // Read saved preference (already applied by inline <script> in <head>)
  const saved = localStorage.getItem('theme');
  const sys   = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  apply(saved === 'dark' || saved === 'light' ? saved : sys);

  btn.addEventListener('click', () => {
    apply(HTML.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });
}


/* ─────────────────────────────────────────
   4. NETWORK PARTICLE BACKGROUND
───────────────────────────────────────── */
function initNetwork() {
  const cvs = document.getElementById('net-bg');
  if (!cvs) return;
  const ctx = cvs.getContext('2d');

  let W, H, pts = [], raf = null;
  const DIST   = 200;
  const SPEED  = 0.3;
  const DENSITY = 0.00008;
  const mouse  = { x: -9999, y: -9999 };

  /** Read particle colour from the CSS token --net (R,G,B) */
  function getNetColor() {
    return getComputedStyle(document.documentElement)
      .getPropertyValue('--net').trim() || '168,162,158';
  }
  let netColor = getNetColor();

  function resize() {
    W = cvs.width  = innerWidth;
    H = cvs.height = innerHeight;
  }

  function init() {
    pts = [];
    const n = Math.max(50, Math.floor(W * H * DENSITY));
    for (let i = 0; i < n; i++) {
      pts.push({
        x:  Math.random() * W,
        y:  Math.random() * H,
        vx: (Math.random() - .5) * SPEED * 2,
        vy: (Math.random() - .5) * SPEED * 2,
      });
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    const d2max = DIST * DIST;

    for (let i = 0; i < pts.length; i++) {
      const a = pts[i];

      // Mouse repel
      const mx = a.x - mouse.x, my = a.y - mouse.y;
      const md = mx * mx + my * my;
      if (md < 90000 && md > 0) {
        const f = (300 - Math.sqrt(md)) / 300 * .03;
        a.vx += (mx / Math.sqrt(md)) * f;
        a.vy += (my / Math.sqrt(md)) * f;
      }

      // Damping + min speed
      a.vx *= .993; a.vy *= .993;
      const sp = Math.sqrt(a.vx * a.vx + a.vy * a.vy);
      if (sp < .15 && sp > 0) { a.vx = a.vx / sp * .15; a.vy = a.vy / sp * .15; }

      // Move + bounce
      a.x += a.vx; a.y += a.vy;
      if (a.x <= 0) { a.x = 0; a.vx =  Math.abs(a.vx); }
      else if (a.x >= W) { a.x = W; a.vx = -Math.abs(a.vx); }
      if (a.y <= 0) { a.y = 0; a.vy =  Math.abs(a.vy); }
      else if (a.y >= H) { a.y = H; a.vy = -Math.abs(a.vy); }

      // Lines to neighbours
      for (let j = i + 1; j < pts.length; j++) {
        const b = pts[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < d2max) {
          const t = 1 - Math.sqrt(d2) / DIST;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${netColor},${t * .25})`;
          ctx.lineWidth   = .7 * t;
          ctx.stroke();
        }
      }

      // Dot
      ctx.beginPath();
      ctx.arc(a.x, a.y, 1.8, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${netColor},.6)`;
      ctx.fill();
    }

    raf = requestAnimationFrame(loop);
  }

  function start() { if (!raf) raf = requestAnimationFrame(loop); }
  function stop()  { if (raf)  { cancelAnimationFrame(raf); raf = null; } }

  resize(); init(); netColor = getNetColor(); start();

  window.addEventListener('resize',   () => { resize(); init(); }, { passive: true });
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
  window.addEventListener('mouseout',  () => { mouse.x = -9999; mouse.y = -9999; });
  document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());

  // Refresh colour when theme changes
  new MutationObserver(() => { netColor = getNetColor(); })
    .observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
}


/* ─────────────────────────────────────────
   5. HEADER SCROLL-SPY
───────────────────────────────────────── */
function initScrollSpy() {
  const links = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
  const secs  = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);

  function detect() {
    const hh = 80, vh = innerHeight;
    let best = -1, bestScore = -Infinity;
    secs.forEach((s, i) => {
      const r = s.getBoundingClientRect();
      if (r.bottom <= hh || r.top >= vh) return;
      const score = r.top <= hh + 100
        ? 3000 - Math.abs(r.top - hh - 100)
        : 1000 - Math.abs(r.top - hh - 100);
      if (score > bestScore) { bestScore = score; best = i; }
    });
    links.forEach((a, i) => a.classList.toggle('active', i === best));
  }

  links.forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + scrollY - 64, behavior: 'smooth' });
      history.pushState(null, '', a.getAttribute('href'));
    });
  });

  window.addEventListener('scroll', detect, { passive: true });
  detect();
}


/* ─────────────────────────────────────────
   6. TERMINAL TECH STACK
───────────────────────────────────────── */
function initTerminal() {
  const out = document.getElementById('ts-out');
  if (!out) return;

  // Build line objects from TECH_STACK config
  const lines = [];
  lines.push({ type: 'bracket', text: '{' });

  const entries = Object.entries(TECH_STACK);
  entries.forEach(([cat, items], ci) => {
    lines.push({ type: 'cat', text: `  "${cat}": [` });
    items.forEach((item, ii) => {
      lines.push({ type: 'tech', name: item.name, icon: item.icon, last: ii === items.length - 1 });
    });
    lines.push({ type: 'bracket', text: ci < entries.length - 1 ? '  ],' : '  ]' });
  });
  lines.push({ type: 'bracket', text: '}' });

  // Render lines with staggered animation
  lines.forEach((ln, i) => {
    const el = document.createElement('div');
    el.style.animationDelay = (i * 40) + 'ms';

    if (ln.type === 'tech') {
      el.className = 'ts-line ts-tech';
      const label = `"${ln.name}"${ln.last ? '' : ','}`;
      el.innerHTML = `
        <div class="ts-logo">${ln.icon || '●'}</div>
        <span>${label}</span>`;
    } else {
      el.className = `ts-line ${ln.type === 'cat' ? 'ts-cat' : 'ts-bracket'}`;
      el.textContent = ln.text;
    }
    out.appendChild(el);
  });
}


/* ─────────────────────────────────────────
   7. EXPERIENCE TIMELINE (scroll progress)
───────────────────────────────────────── */
function initTimeline() {
  const tl    = document.querySelector('.timeline');
  if (!tl) return;
  const items = Array.from(document.querySelectorAll('.t-item'));
  const dots  = items.map(it => it.querySelector('.t-dot'));

  function update() {
    if (!dots[0]) return;
    const trigger   = innerHeight * 0.35;
    const firstDotY = dots[0].getBoundingClientRect().top + dots[0].offsetHeight / 2;
    const full      = tl.getBoundingClientRect().bottom - firstDotY - 10;

    let h = Math.max(0, Math.min(trigger - firstDotY, full));
    tl.style.setProperty('--prog', h + 'px');

    const tip = firstDotY + h;
    dots.forEach((dot, i) => {
      const cy   = dot.getBoundingClientRect().top + dot.offsetHeight / 2;
      const item = items[i];
      item.classList.remove('past', 'active', 'future');
      if      (tip >= cy + 5)  item.classList.add('past');
      else if (tip >= cy - 15) item.classList.add('active');
      else                     item.classList.add('future');
    });
  }

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update, { passive: true });
  update();
}


/* ─────────────────────────────────────────
   8. PROJECTS CAROUSEL + FILTER
───────────────────────────────────────── */
function initProjects() {
  const track   = document.getElementById('proj-track');
  if (!track) return;
  const prevBtn = document.getElementById('proj-prev');
  const nextBtn = document.getElementById('proj-next');
  const filters = Array.from(document.querySelectorAll('.proj-filter'));
  const all     = Array.from(track.querySelectorAll('.proj-card'));
  let autoTimer = null;

  /** Visible cards (not filtered out) */
  function getCards() { return all.filter(c => !c.dataset.hidden); }

  /** Index of the card closest to the track centre */
  function activeIdx() {
    const cards = getCards();
    if (!cards.length) return 0;
    const cx = track.getBoundingClientRect().left + track.clientWidth / 2;
    let best = 0, bestDist = Infinity;
    cards.forEach((c, i) => {
      const d = Math.abs(c.getBoundingClientRect().left + c.clientWidth / 2 - cx);
      if (d < bestDist) { bestDist = d; best = i; }
    });
    return best;
  }

  /** Smooth-scroll the track to card at index i */
  function scrollTo(i, smooth = true) {
    const cards = getCards();
    if (!cards.length) return;
    const card = cards[Math.max(0, Math.min(i, cards.length - 1))];
    const target = card.offsetLeft - (track.clientWidth - card.clientWidth) / 2;

    if (!smooth) { track.scrollLeft = target; return; }

    const start = track.scrollLeft, dist = target - start;
    const dur   = Math.min(600, Math.max(300, Math.abs(dist) * .4));
    let t0      = null;

    function ease(t) { return t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t+2,3)/2; }
    function step(ts) {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / dur, 1);
      track.scrollLeft = start + dist * ease(p);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /** Number visible cards */
  function numberCards() {
    getCards().forEach((c, i) => {
      let badge = c.querySelector('.proj-num');
      if (!badge) { badge = document.createElement('span'); badge.className = 'proj-num'; c.querySelector('.proj-media')?.appendChild(badge); }
      badge.textContent = '#' + (i + 1);
    });
  }

  /** Autoplay */
  function schedule() {
    clearTimeout(autoTimer);
    autoTimer = setTimeout(() => {
      const cards = getCards();
      const next  = activeIdx() + 1;
      scrollTo(next >= cards.length ? 0 : next);
      schedule();
    }, 7000);
  }

  // Controls
  prevBtn.addEventListener('click', () => { const c = getCards(); scrollTo(activeIdx() <= 0 ? c.length - 1 : activeIdx() - 1); schedule(); });
  nextBtn.addEventListener('click', () => { const c = getCards(); scrollTo(activeIdx() >= c.length - 1 ? 0 : activeIdx() + 1); schedule(); });

  // Pause autoplay on hover / touch
  track.addEventListener('mouseenter', () => clearTimeout(autoTimer));
  track.addEventListener('mouseleave', schedule);
  track.addEventListener('touchstart', () => clearTimeout(autoTimer), { passive: true });
  track.addEventListener('touchend',   () => setTimeout(schedule, 2500), { passive: true });

  // Filter
  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.f;
      all.forEach(c => {
        if (f === 'all' || c.dataset.cat === f) delete c.dataset.hidden;
        else c.dataset.hidden = 'true';
      });
      track.scrollLeft = 0;
      numberCards();
      schedule();
    });
  });

  numberCards();
  schedule();
}


/* ─────────────────────────────────────────
   9. MARQUEE CLONE — seamless loop
───────────────────────────────────────── */
function initMarquee() {
  ['mg1', 'mg2'].forEach(id => {
    const g = document.getElementById(id);
    if (!g) return;
    const clone = g.cloneNode(true);
    clone.removeAttribute('id');
    clone.setAttribute('aria-hidden', 'true');
    g.parentElement.appendChild(clone);
  });
}


/* ─────────────────────────────────────────
   10. CONTACT FORM
───────────────────────────────────────── */
function initContact() {
  const form  = document.getElementById('contact-form');
  if (!form) return;

  const fields = {
    name:    document.getElementById('tf-name'),
    email:   document.getElementById('tf-email'),
    subject: document.getElementById('tf-subject'),
    message: document.getElementById('tf-message'),
  };
  const statusEl = document.getElementById('tf-status');
  const submitBtn = form.querySelector('.tf-submit');

  // Clear invalid state on input
  Object.values(fields).forEach(el => {
    el.addEventListener('input', () => el.classList.remove('invalid'));
  });

  function showStatus(msg, ok) {
    statusEl.textContent = msg;
    statusEl.className   = 'tf-status ' + (ok ? 'tf-ok' : 'tf-err');
    statusEl.style.display = 'block';
    if (ok) setTimeout(() => { statusEl.style.display = 'none'; }, 8000);
  }

  function validate() {
    let ok = true;
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!fields.name.value.trim())               { fields.name.classList.add('invalid');    ok = false; }
    if (!emailRx.test(fields.email.value.trim())) { fields.email.classList.add('invalid');  ok = false; }
    if (!fields.subject.value.trim())             { fields.subject.classList.add('invalid'); ok = false; }
    if (!fields.message.value.trim())             { fields.message.classList.add('invalid'); ok = false; }
    return ok;
  }

  async function sendFormspree(data) {
    const res = await fetch(`https://formspree.io/f/${CONTACT_CONFIG.formspreeId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Formspree error ' + res.status);
  }

  async function sendEmailJS(data) {
    if (!window.emailjs) throw new Error('EmailJS not loaded');
    window.emailjs.init(CONTACT_CONFIG.emailjsPublicKey);
    await window.emailjs.send(CONTACT_CONFIG.emailjsServiceId, CONTACT_CONFIG.emailjsTemplateId, {
      from_name:  data.name,
      from_email: data.email,
      subject:    data.subject,
      message:    data.message,
    });
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!validate()) return;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    const data = {
      name:    fields.name.value.trim(),
      email:   fields.email.value.trim(),
      subject: fields.subject.value.trim(),
      message: fields.message.value.trim(),
    };

    try {
      if      (CONTACT_CONFIG.mode === 'formspree') await sendFormspree(data);
      else if (CONTACT_CONFIG.mode === 'emailjs')   await sendEmailJS(data);
      // 'static' mode just shows success immediately

      showStatus("✓ Message sent! I'll get back to you soon.", true);
      form.reset();
      submitBtn.textContent = '✓ Sent!';
      setTimeout(() => { submitBtn.textContent = 'Send Message →'; }, 3000);
    } catch (err) {
      console.error('Contact form error:', err);
      showStatus('Something went wrong. Please email me directly.', false);
      submitBtn.textContent = 'Send Message →';
    } finally {
      submitBtn.disabled = false;
    }
  });
}


/* ─────────────────────────────────────────
   11. SCROLL REVEAL
───────────────────────────────────────── */
function initReveal() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('show'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });

  document.querySelectorAll(
    '.extra-block, .journey-card, .rev-card, .proj-card, .summary-card, .stat-card'
  ).forEach(el => { el.classList.add('reveal'); io.observe(el); });
}


/* ─────────────────────────────────────────
   12. FOOTER YEAR
───────────────────────────────────────── */
function initFooterYear() {
  const el = document.getElementById('yr');
  if (el) el.textContent = new Date().getFullYear();
}