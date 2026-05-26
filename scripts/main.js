/* ─────────────────────────────────────────────────────────────
   Sambusa City — vanilla JS
   IntersectionObserver reveals + mobile nav toggle + nav scroll
   ───────────────────────────────────────────────────────────── */

/* ── Nav: add `.is-scrolled` once user has scrolled past 8px so
   nav transitions from transparent over dark hero to opaque cream. */
(function navScroll() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  const onScroll = () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ── Mobile menu open / close ───────────────────────────── */
(function mobMenu() {
  const burger = document.getElementById('navBurger');
  const menu   = document.getElementById('mobMenu');
  if (!burger || !menu) return;
  const close  = menu.querySelector('[data-mob-close]');
  const setOpen = (open) => {
    menu.classList.toggle('is-open', open);
    burger.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Stäng meny' : 'Öppna meny');
    document.body.style.overflow = open ? 'hidden' : '';
  };
  burger.addEventListener('click', () => setOpen(!menu.classList.contains('is-open')));
  close && close.addEventListener('click', () => setOpen(false));
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });
})();

/* ── Scroll-reveal: add `.is-in` once-only as elements enter.
   Targets `.reveal`; respects reduced-motion via CSS fallback. */
(function reveal() {
  const targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;
  if (!('IntersectionObserver' in window)) {
    targets.forEach(el => el.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  targets.forEach(el => io.observe(el));
})();

/* ── Menu page: sticky tabs ↔ active state on scroll ─── */
(function menuTabs() {
  const tabs = document.querySelectorAll('.menu-tabs a');
  if (!tabs.length) return;
  const sections = [...tabs].map(t => document.querySelector(t.getAttribute('href'))).filter(Boolean);
  if (!sections.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = '#' + entry.target.id;
        tabs.forEach(t => t.classList.toggle('is-active', t.getAttribute('href') === id));
      }
    });
  }, { rootMargin: '-30% 0px -60% 0px' });
  sections.forEach(s => io.observe(s));
})();

/* ── Form-status: tiny mailto fallback for forms with
   data-mailto="…" — keeps the page from POSTing nowhere. */
document.querySelectorAll('form[data-mailto]').forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const to = form.dataset.mailto;
    const subject = form.dataset.subject || 'Förfrågan från sambusacity.se';
    const lines = [];
    form.querySelectorAll('input, select, textarea').forEach(el => {
      if (el.type === 'submit' || el.type === 'button') return;
      const label = el.dataset.label || el.name || el.id;
      const val = el.type === 'checkbox' ? (el.checked ? 'Ja' : 'Nej') : el.value;
      if (val) lines.push(`${label}: ${val}`);
    });
    const body = lines.join('\n');
    const status = form.querySelector('.form__status');
    if (status) status.textContent = 'Öppnar mejl…';
    window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
});

/* ── Footer year (in case anyone uses <span id="year">) ── */
const y = document.getElementById('year');
if (y) y.textContent = String(new Date().getFullYear());
