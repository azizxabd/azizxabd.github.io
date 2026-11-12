/* Renders the portfolio from window.SITE (data/site.js).
   You shouldn't need to edit this file to change content. */
(function () {
  'use strict';

  var S = window.SITE;
  var ART = window.ART;
  var root = document.getElementById('app');
  if (!S || !root) return;

  /* ── helpers ─────────────────────────────────────────────────────── */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  // *accent*  ~muted~  `code`  \n → <br>
  function rich(s) {
    return esc(s)
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*([^*]+)\*/g, '<span class="acc-t">$1</span>')
      .replace(/~([^~]+)~/g, '<span class="muted-t">$1</span>')
      .replace(/\n/g, '<br>');
  }
  function isExternal(url) { return /^https?:\/\//.test(url || ''); }
  function linkAttrs(url) {
    return 'href="' + esc(url) + '"' + (isExternal(url) ? ' target="_blank" rel="noopener"' : '');
  }
  function projectUrl(p) {
    if (p.case) return 'project.html?id=' + encodeURIComponent(p.id);
    return p.link || '';
  }
  function visual(v) {
    if (!v) return '';
    if (v.image) return '<img src="' + esc(v.image) + '" alt="' + esc(v.alt || '') + '" loading="lazy" decoding="async">';
    if (v.art && ART[v.art]) return ART[v.art](v);
    return '';
  }
  function stats(list, cls) {
    if (!list || !list.length) return '';
    return '<div class="stats ' + (cls || '') + '">' + list.map(function (s) {
      return '<div class="stat"><div class="stat-v' + (s.accent ? ' acc-t' : '') + '">' + esc(s.value) +
        '</div><div class="stat-l">' + esc(s.label) + '</div></div>';
    }).join('') + '</div>';
  }
  function tags(list) {
    if (!list || !list.length) return '';
    return '<ul class="tags">' + list.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>';
  }
  var L = Object.assign({
    more: 'More work', archive: 'Archive', education: 'Education', recognition: 'Recognition', toolkit: 'Toolkit',
    caseCta: 'Open case study →', notFound: 'That project isn’t here.',
  }, S.labels || {});

  function byTier(t) { return S.projects.filter(function (p) { return p.tier === t; }); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }

  /* ── theme ───────────────────────────────────────────────────────── */
  var html = document.documentElement;
  if (S.theme && S.theme.accent) html.style.setProperty('--accent', S.theme.accent);

  function currentTheme() {
    var t = html.getAttribute('data-theme');
    if (t) return t;
    return matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  function toggleTheme() {
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
  }

  /* ── shared chrome ───────────────────────────────────────────────── */
  function header(home) {
    var base = home ? '' : 'index.html';
    var nav = S.nav.map(function (n) {
      var href = n.href.charAt(0) === '#' ? base + n.href : n.href;
      return '<a class="nav-link" ' + linkAttrs(href) + '>' + esc(n.label) + '</a>';
    }).join('');
    var resume = S.person.resume
      ? '<a class="btn btn-sm btn-light" ' + linkAttrs(S.person.resume) + '>Résumé</a>' : '';
    return '<header class="site-header">' +
      '<a class="brand" href="' + (home ? '#top' : 'index.html') + '">' + esc(S.person.name) + '</a>' +
      '<nav aria-label="Primary">' + nav +
      '<button class="theme-btn" type="button" aria-label="Toggle light and dark theme">' +
      '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>' +
      '</button>' + resume + '</nav></header>';
  }

  function contact() {
    var c = S.contact || {};
    var socials = S.socials.map(function (s) {
      return '<a class="btn btn-ghost" ' + linkAttrs(s.url) + '>' + esc(s.label) + '</a>';
    }).join('');
    return '<footer id="contact" class="contact wrap">' +
      '<h2 class="contact-title reveal">' + rich(c.title || 'Get in touch.') + '</h2>' +
      '<div class="btn-row reveal">' +
      '<a class="btn btn-light" href="mailto:' + esc(S.person.email) + '">' + esc(S.person.email) + '</a>' +
      socials + '</div>' +
      '<div class="footnote"><span>© ' + new Date().getFullYear() + ' ' + esc(S.person.name) + '</span>' +
      '<span>' + esc(S.person.availability || '') + '</span></div>' +
      '</footer>';
  }

  /* ── home sections ───────────────────────────────────────────────── */
  var SECTIONS = {
    hero: function () {
      var h = S.hero;
      var ctas = (h.ctas || []).map(function (c) {
        return '<a class="btn ' + (c.style === 'accent' ? 'btn-accent' : 'btn-ghost') + '" ' + linkAttrs(c.href) + '>' + esc(c.label) + '</a>';
      }).join('');
      return '<section class="hero" id="top">' + ART.terrain() +
        '<div class="hero-inner wrap">' + header(true) +
        '<div class="hero-copy">' +
        '<p class="eyebrow">' + esc(h.eyebrow) + '</p>' +
        '<h1 class="hero-title">' + rich(h.title) + '</h1>' +
        '<p class="hero-lede">' + rich(h.lede) + '</p>' +
        '<div class="btn-row">' + ctas + '</div>' +
        '</div></div></section>';
    },

    statement: function () {
      return '<section class="statement wrap"><p class="reveal">' + rich(S.statement) + '</p></section>';
    },

    featured: function () {
      var items = byTier('featured');
      if (!items.length) return '';
      return '<section id="work" class="featured wrap" aria-label="Selected work">' + items.map(function (p, i) {
        var url = projectUrl(p);
        var tag = url ? 'a' : 'div';
        var cta = p.case ? L.caseCta : url ? 'View project ↗' : '';
        return '<' + tag + ' class="feature reveal"' + (url ? ' ' + linkAttrs(url) : '') + '>' +
          '<div class="feature-copy">' +
          '<span class="kicker">' + pad(i + 1) + ' — ' + esc(p.kicker) + '</span>' +
          '<h2 class="feature-title">' + rich(p.title) + '</h2>' +
          '<p class="feature-sum">' + rich(p.summary) + '</p>' +
          stats(p.stats, 'feature-stats') +
          (cta ? '<span class="pill">' + cta + '</span>' : '') +
          '</div>' +
          '<div class="feature-visual">' + visual(p.visual) + '</div>' +
          '</' + tag + '>';
      }).join('') + '</section>';
    },

    more: function () {
      var items = byTier('more');
      if (!items.length) return '';
      return '<section class="more wrap"><h2 class="section-label">' + esc(L.more) + '</h2><div class="card-grid">' +
        items.map(function (p) {
          var url = projectUrl(p);
          var tag = url ? 'a' : 'div';
          return '<' + tag + ' class="card reveal"' + (url ? ' ' + linkAttrs(url) : '') + '>' +
            '<span class="kicker kicker-sm">' + esc(p.kicker) + '</span>' +
            '<span class="card-title">' + rich(p.title) + '</span>' +
            (p.highlight ? '<span class="card-hi acc-t">' + esc(p.highlight) + '</span>' : '') +
            '</' + tag + '>';
        }).join('') + '</div></section>';
    },

    archive: function () {
      var items = byTier('archive');
      if (!items.length) return '';
      var cats = [];
      items.forEach(function (p) { if (p.category && cats.indexOf(p.category) < 0) cats.push(p.category); });
      var chips = ['All'].concat(cats).map(function (c, i) {
        return '<button type="button" class="chip" data-cat="' + esc(c) + '" aria-pressed="' + (i === 0) + '">' + esc(c) + '</button>';
      }).join('');
      var cards = items.map(function (p) {
        var url = projectUrl(p);
        var tag = url ? 'a' : 'div';
        var thumb = p.image
          ? '<img src="' + esc(p.image) + '" alt="" loading="lazy" decoding="async">'
          : '<span class="thumb-ph">' + esc((p.category || '').toUpperCase()) + '</span>';
        return '<' + tag + ' class="arch reveal" data-cat="' + esc(p.category || '') + '"' + (url ? ' ' + linkAttrs(url) : '') + '>' +
          '<div class="arch-thumb">' + thumb + '</div>' +
          '<div class="arch-body"><span class="kicker kicker-sm">' + esc(p.category || '') + '</span>' +
          '<span class="arch-title">' + rich(p.title) + '</span>' +
          '<span class="arch-sum">' + rich(p.summary || '') + '</span>' +
          (url ? '<span class="arch-link">' + (p.case ? 'Case study →' : 'View ↗') + '</span>' : '') +
          '</div></' + tag + '>';
      }).join('');
      return '<section class="archive wrap" id="archive"><div class="archive-head">' +
        '<h2 class="section-label">' + esc(L.archive) + '</h2><div class="chips" role="group" aria-label="Filter projects">' + chips + '</div></div>' +
        '<div class="arch-grid">' + cards + '</div></section>';
    },

    about: function () {
      var a = S.about || {};
      var p = S.person.portrait;
      var portrait = p && p.src
        ? '<figure class="portrait reveal"><img src="' + esc(p.src) + '" alt="' + esc(p.alt || S.person.name) + '" loading="lazy" decoding="async">' +
          (a.portraitCaption ? '<figcaption>' + esc(a.portraitCaption) + '</figcaption>' : '') + '</figure>'
        : '';
      var rows = (S.experience || []).map(function (e) {
        var meta = [e.role, e.place, e.period].filter(Boolean).map(esc).join(' · ');
        var inner = '<span class="xp-org">' + esc(e.org) + '</span><span class="xp-meta">' + meta + '</span>';
        if (!e.points || !e.points.length) return '<div class="xp-row">' + inner + '</div>';
        return '<details class="xp"><summary class="xp-row">' + inner + '<span class="xp-plus" aria-hidden="true"></span></summary>' +
          '<ul class="xp-points">' + e.points.map(function (pt) { return '<li>' + rich(pt) + '</li>'; }).join('') + '</ul></details>';
      }).join('');
      return '<section id="about" class="about wrap">' + portrait +
        '<div class="about-copy"><p class="about-text reveal">' + rich(a.text) + '</p>' +
        (rows ? '<div class="xp-list reveal">' + rows + '</div>' : '') + '</div></section>';
    },

    education: function () {
      var e = S.education;
      if (!e || !e.length) return '';
      return '<section class="recognition wrap"><h2 class="section-label">' + esc(L.education) + '</h2><div class="rec-list">' +
        e.map(function (x) {
          return '<div class="rec edu reveal">' +
            '<span class="kicker kicker-sm">' + esc(x.degree) + '</span>' +
            '<span class="rec-title">' + esc(x.school) +
            (x.detail ? '<span class="edu-detail">' + rich(x.detail) + '</span>' : '') + '</span>' +
            '<span class="rec-meta">' + [x.place, x.period].filter(Boolean).map(esc).join(' · ') + '</span>' +
            '</div>';
        }).join('') + '</div></section>';
    },

    recognition: function () {
      var r = S.recognition;
      if (!r || !r.length) return '';
      return '<section class="recognition wrap"><h2 class="section-label">' + esc(L.recognition) + '</h2><div class="rec-list">' +
        r.map(function (x) {
          var tag = x.link ? 'a' : 'div';
          return '<' + tag + ' class="rec reveal"' + (x.link ? ' ' + linkAttrs(x.link) : '') + '>' +
            '<span class="kicker kicker-sm">' + esc(x.kind) + '</span>' +
            '<span class="rec-title">' + rich(x.title) + (x.link ? ' <span class="acc-t">↗</span>' : '') + '</span>' +
            '<span class="rec-meta">' + [x.org, x.date].filter(Boolean).map(esc).join(' · ') + '</span>' +
            '</' + tag + '>';
        }).join('') + '</div></section>';
    },

    toolkit: function () {
      var t = S.toolkit;
      if (!t) return '';
      var groups = Object.keys(t).map(function (k) {
        return '<div class="tk-group reveal"><h3 class="kicker kicker-sm">' + esc(k) + '</h3><ul>' +
          t[k].map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div>';
      }).join('');
      return '<section class="toolkit wrap"><h2 class="section-label">' + esc(L.toolkit) + '</h2><div class="tk-grid">' + groups + '</div></section>';
    },

    contact: contact,
  };

  /* ── case-study page ─────────────────────────────────────────────── */
  var BLOCKS = {
    text: function (b) {
      return (b.heading ? '<h2 class="cs-h">' + esc(b.heading) + '</h2>' : '') +
        [].concat(b.text || []).map(function (t) { return '<p class="cs-p">' + rich(t) + '</p>'; }).join('');
    },
    list: function (b) {
      return (b.heading ? '<h2 class="cs-h">' + esc(b.heading) + '</h2>' : '') +
        '<ul class="cs-list">' + b.items.map(function (t) { return '<li>' + rich(t) + '</li>'; }).join('') + '</ul>';
    },
    image: function (b) {
      return '<figure class="cs-fig"><img src="' + esc(b.src) + '" alt="' + esc(b.alt || '') + '" loading="lazy" decoding="async">' +
        (b.caption ? '<figcaption>' + rich(b.caption) + '</figcaption>' : '') + '</figure>';
    },
    stats: function (b) { return stats(b.items, 'cs-stats'); },
    quote: function (b) { return '<blockquote class="cs-quote">' + rich(b.text) + '</blockquote>'; },
    art: function (b) { return '<div class="cs-visual">' + visual(b) + '</div>'; },
  };

  function casePage() {
    var id = new URLSearchParams(location.search).get('id');
    var p = S.projects.filter(function (x) { return x.id === id; })[0];
    if (!p) {
      document.title = 'Not found — ' + S.person.name;
      return '<div class="wrap">' + header(false) + '<section class="cs-head"><p class="eyebrow">404</p>' +
        '<h1 class="cs-title">' + rich(L.notFound) + '</h1><div class="btn-row"><a class="btn btn-accent" href="index.html#work">Back to work</a></div></section></div>';
    }
    document.title = p.title.replace(/[*~]/g, '') + ' — ' + S.person.name;
    var c = p.case || {};
    var meta = [c.role, c.period].filter(Boolean).map(esc).join(' · ');
    var links = (p.links || []).concat(p.link ? [{ label: 'View project', url: p.link }] : []);
    var linkHtml = links.map(function (l) { return '<a class="btn btn-ghost" ' + linkAttrs(l.url) + '>' + esc(l.label) + ' ↗</a>'; }).join('');
    var body = (c.body || []).map(function (b) { return BLOCKS[b.type] ? '<div class="cs-block reveal">' + BLOCKS[b.type](b) + '</div>' : ''; }).join('');

    var withCase = S.projects.filter(function (x) { return x.case; });
    var next = withCase[(withCase.indexOf(p) + 1) % withCase.length];
    var nextHtml = next && next !== p
      ? '<a class="cs-next reveal" href="project.html?id=' + encodeURIComponent(next.id) + '"><span class="kicker">Next — ' + esc(next.kicker) + '</span>' +
        '<span class="cs-next-title">' + rich(next.title) + '</span><span class="pill">Open →</span></a>'
      : '';

    return '<div class="wrap">' + header(false) +
      '<article class="cs">' +
      '<a class="back" href="index.html#work">← All work</a>' +
      '<header class="cs-head"><p class="eyebrow">' + esc(p.kicker) + (meta ? ' — ' + meta : '') + '</p>' +
      '<h1 class="cs-title">' + rich(p.title) + '</h1>' +
      (p.summary ? '<p class="cs-lede">' + rich(p.summary) + '</p>' : '') +
      stats(p.stats, 'cs-stats') + tags(p.tags) +
      (linkHtml ? '<div class="btn-row">' + linkHtml + '</div>' : '') + '</header>' +
      (p.visual ? '<div class="cs-visual reveal">' + visual(p.visual) + '</div>' : '') +
      (body ? '<div class="cs-body">' + body + '</div>' : '') +
      '</article>' + nextHtml + '</div>' + contact();
  }

  /* ── mount ───────────────────────────────────────────────────────── */
  var page = document.body.getAttribute('data-page');
  if (page === 'project') {
    root.innerHTML = casePage();
  } else {
    var order = S.sections || Object.keys(SECTIONS);
    var main = order.map(function (name) { return SECTIONS[name] ? SECTIONS[name]() : ''; }).join('');
    // The header lives inside the hero; if the hero is removed, add it on its own.
    if (order.indexOf('hero') < 0) main = '<div class="wrap">' + header(true) + '</div>' + main;
    root.innerHTML = main;
  }

  /* ── behaviour ───────────────────────────────────────────────────── */
  document.querySelectorAll('.theme-btn').forEach(function (b) { b.addEventListener('click', toggleTheme); });

  // Archive filter
  var chips = document.querySelectorAll('.chip');
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var cat = chip.getAttribute('data-cat');
      chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c === chip)); });
      document.querySelectorAll('.arch').forEach(function (card) {
        card.hidden = !(cat === 'All' || card.getAttribute('data-cat') === cat);
      });
    });
  });

  // Hide images that fail to load (e.g. a typo in a path) instead of showing a broken icon
  document.querySelectorAll('#app img').forEach(function (img) {
    img.addEventListener('error', function () {
      var box = img.closest('figure, .arch-thumb');
      if (box) box.classList.add('img-missing');
      img.remove();
    });
  });

  // Scroll reveal
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    html.classList.add('js-reveal');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
    reveals.forEach(function (el) { io.observe(el); });
  }

  // Jump to hash after render (content didn't exist at load time)
  if (location.hash) {
    var target = document.getElementById(location.hash.slice(1));
    if (target) target.scrollIntoView();
  }
})();
