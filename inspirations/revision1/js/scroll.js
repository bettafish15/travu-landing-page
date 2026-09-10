/* Trà Vũ — revision1 motion layer.
   Adds .reveal/.is-visible classes for scroll-in transitions (CSS lives in
   css/scroll.css under "Motion"). No-JS and reduced-motion users simply get
   the static page — nothing is hidden until this script tags it. */
(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;

  // Hero: split the title into .char spans for the ink-soak entrance.
  // The original text stays as the h1's aria-label.
  const title = document.querySelector('.hero-title');
  if (title) {
    const text = title.textContent;
    title.setAttribute('aria-label', text);
    title.textContent = '';
    title.classList.add('hero-title--ink');
    const chars = document.createElement('span');
    chars.setAttribute('aria-hidden', 'true');
    let i = 0;
    for (const ch of text) {
      if (ch.trim() === '') {
        chars.appendChild(document.createTextNode(ch));
        continue;
      }
      const s = document.createElement('span');
      s.className = 'char';
      s.textContent = ch;
      s.style.setProperty('--char-i', i++);
      chars.appendChild(s);
    }
    title.appendChild(chars);
  }

  // Hero: pointer parallax — painting follows the hand, leaves counter-drift.
  const hero = document.querySelector('.hero');
  if (hero && window.matchMedia('(pointer: fine)').matches) {
    let raf = 0;
    hero.addEventListener('mousemove', (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const r = hero.getBoundingClientRect();
        hero.style.setProperty('--mx', ((e.clientX / r.width) - 0.5) * 2);
        hero.style.setProperty('--my', (((e.clientY - r.top) / r.height) - 0.5) * 2);
      });
    });
    hero.addEventListener('mouseleave', () => {
      hero.style.setProperty('--mx', 0);
      hero.style.setProperty('--my', 0);
    });
  }

  // [selector, extra reveal modifier]
  const GROUPS = [
    ['.spine-track, .axis-badge', 'reveal--bead'],
    ['.pour-photo', 'reveal--fade'],           // keeps its interlock transform
    [
      [
        '.epigraph', '.serving-lead', '.serving-head', '.label-block',
        '.intro-title', '.intro-media', '.intro-body',
        '.credential-body', '.credential-frame',
        '.philosophy-frame', '.philosophy-couplet', '.philosophy-body', '.philosophy-band',
        '.journey-title', '.journey-sub', '.journey-lead', '.trail-step', '.journey-art',
        '.philosophy2-title', '.stanza', '.philosophy2-close', '.philosophy2-sig',
        '.process-logo', '.process-title', '.process-sub', '.process-leadwrap',
        '.process-art', '.process-intro', '.rite-step',
        '.services-art', '.services-title', '.services-sub', '.services-row', '.services-note',
        '.contact-title', '.contact-services li', '.contact-wish', '.contact-rule',
        '.qr-tile', '.contact-list p', '.contact-art',
      ].join(', '),
      '',
    ],
  ];

  const staggerIndex = new Map(); // parent -> running count
  const tagged = new Set();

  for (const [selector, modifier] of GROUPS) {
    document.querySelectorAll(selector).forEach((el) => {
      if (tagged.has(el)) return;
      tagged.add(el);
      el.classList.add('reveal');
      if (modifier) el.classList.add(modifier);
      const parent = el.parentElement;
      const i = staggerIndex.get(parent) || 0;
      staggerIndex.set(parent, i + 1);
      el.style.setProperty('--reveal-i', Math.min(i, 6));
    });
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      io.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  tagged.forEach((el) => io.observe(el));
})();
