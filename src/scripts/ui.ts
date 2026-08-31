/** Interacciones de interfaz: header, menu movil, overlay de busqueda, reveal. */

// --- Header: sombra al hacer scroll ---
const header = document.getElementById('site-header');
if (header) {
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

// --- Menu movil ---
const menu = document.getElementById('mobile-menu');
const openBtn = document.querySelector<HTMLButtonElement>('[data-menu-open]');
const closeBtn = document.querySelector<HTMLButtonElement>('[data-menu-close]');

function setMenu(open: boolean) {
  if (!menu || !openBtn) return;
  menu.hidden = !open;
  openBtn.setAttribute('aria-expanded', String(open));
  document.documentElement.style.overflow = open ? 'hidden' : '';
  if (open) menu.querySelector<HTMLAnchorElement>('a, button')?.focus();
  else openBtn.focus();
}

openBtn?.addEventListener('click', () => setMenu(true));
closeBtn?.addEventListener('click', () => setMenu(false));
menu?.addEventListener('click', (e) => {
  if ((e.target as HTMLElement).closest('a')) setMenu(false);
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && menu && !menu.hidden) setMenu(false);
});

// --- Reveal al hacer scroll (respeta prefers-reduced-motion via CSS) ---
const revealables = document.querySelectorAll<HTMLElement>('[data-reveal]');
if (revealables.length) {
  if (!('IntersectionObserver' in window)) {
    revealables.forEach((el) => el.classList.add('is-visible'));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 }
    );
    revealables.forEach((el) => io.observe(el));
  }
}

// --- Overlay de busqueda desde el header ---
const searchTrigger = document.querySelector<HTMLAnchorElement>('[data-search-open]');
const overlay = document.getElementById('search-overlay');
if (searchTrigger && overlay) {
  const input = overlay.querySelector<HTMLInputElement>('input');
  const close = () => {
    overlay.hidden = true;
    document.documentElement.style.overflow = '';
    searchTrigger.focus();
  };
  searchTrigger.addEventListener('click', (e) => {
    e.preventDefault(); // sin JS el enlace lleva a /buscar/
    overlay.hidden = false;
    document.documentElement.style.overflow = 'hidden';
    input?.focus();
  });
  overlay.querySelector('[data-search-close]')?.addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !overlay.hidden) close();
    // Atajo "/" para abrir el buscador en desktop
    if (e.key === '/' && overlay.hidden && !/input|textarea|select/i.test((e.target as HTMLElement).tagName)) {
      e.preventDefault();
      searchTrigger.click();
    }
  });
}
