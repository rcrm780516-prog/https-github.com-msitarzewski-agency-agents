/**
 * Tabs accesibles (WAI-ARIA): flechas para navegar, Home/End, foco gestionado.
 * Sin JS los paneles ocultos siguen accesibles desde su pagina propia.
 */
function initFinder(root: HTMLElement) {
  const tabs = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-location-tab]'));
  const panels = Array.from(root.querySelectorAll<HTMLElement>('[data-location-panel]'));
  if (!tabs.length) return;

  const activate = (id: string, focus = true) => {
    tabs.forEach((t) => {
      const on = t.dataset.locationTab === id;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      if (on && focus) t.focus();
    });
    panels.forEach((p) => {
      p.hidden = p.dataset.locationPanel !== id;
    });
    if (window.gemmae?.track) {
      window.gemmae.track('view_location', { location: id, source: 'location_finder' });
    }
  };

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => activate(tab.dataset.locationTab!, false));
    tab.addEventListener('keydown', (e) => {
      const keys = ['ArrowRight', 'ArrowLeft', 'Home', 'End'];
      if (!keys.includes(e.key)) return;
      e.preventDefault();
      const next =
        e.key === 'ArrowRight' ? (i + 1) % tabs.length
        : e.key === 'ArrowLeft' ? (i - 1 + tabs.length) % tabs.length
        : e.key === 'Home' ? 0
        : tabs.length - 1;
      activate(tabs[next]!.dataset.locationTab!);
    });
  });

  // Permite enlazar directo a una sede: /#ubicaciones con ?sede=metepec
  const preset = new URLSearchParams(location.search).get('sede');
  if (preset && tabs.some((t) => t.dataset.locationTab === preset)) activate(preset, false);
}

document.querySelectorAll<HTMLElement>('[data-location-finder]').forEach(initFinder);
