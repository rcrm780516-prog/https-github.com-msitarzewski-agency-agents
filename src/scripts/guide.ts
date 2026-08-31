/**
 * Widget de orientacion. Solo muestra texto informativo asociado a la opcion
 * elegida: no evalua sintomas, no puntua riesgo y no emite diagnostico.
 */
interface Opcion { id: string; label: string; text: string; service: string }

document.querySelectorAll<HTMLElement>('[data-guide]').forEach((root) => {
  const dataEl = root.querySelector<HTMLScriptElement>('[data-guide-data]');
  const panel = root.querySelector<HTMLElement>('#guide-panel');
  const textEl = root.querySelector<HTMLElement>('[data-guide-text]');
  const serviceLink = root.querySelector<HTMLAnchorElement>('[data-guide-service]');
  if (!dataEl || !panel || !textEl) return;

  let items: Opcion[] = [];
  try {
    items = JSON.parse(dataEl.textContent || '[]');
  } catch {
    return;
  }

  root.querySelectorAll<HTMLButtonElement>('[data-guide-option]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.guideOption!;
      const item = items.find((i) => i.id === id);
      if (!item) return;

      root.querySelectorAll<HTMLButtonElement>('[data-guide-option]').forEach((b) => {
        b.setAttribute('aria-pressed', String(b === btn));
      });

      textEl.textContent = item.text;
      panel.hidden = false;

      if (serviceLink) {
        serviceLink.href = `/${item.service}/`;
        serviceLink.hidden = false;
        serviceLink.textContent = 'Ver información del servicio';
        serviceLink.dataset.service = item.service;
      }

      window.gemmae?.track('guide_select', { topic: id, service: item.service });
      panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  });
});
