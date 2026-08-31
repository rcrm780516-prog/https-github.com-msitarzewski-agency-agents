/**
 * Buscador global. Sin dependencias: descarga un indice estatico una sola vez
 * (en el primer foco) y puntua coincidencias en memoria.
 * Normaliza acentos para que "vph" y "colposcopia" funcionen igual que
 * "menopausia" escrito sin tilde.
 */
interface Item { t: string; d: string; u: string; g: string; k: string }

const norm = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

let index: Item[] | null = null;
let loading: Promise<Item[]> | null = null;

async function loadIndex(): Promise<Item[]> {
  if (index) return index;
  if (!loading) {
    loading = fetch('/search-index.json')
      .then((r) => r.json())
      .then((data: Item[]) => {
        index = data.map((i) => ({ ...i, k: norm(`${i.t} ${i.d} ${i.k}`) }));
        return index;
      })
      .catch(() => []);
  }
  return loading;
}

function score(item: Item, q: string): number {
  const title = norm(item.t);
  if (title === q) return 100;
  if (title.startsWith(q)) return 80;
  if (title.includes(q)) return 60;
  if (item.k.includes(` ${q}`)) return 40;
  if (item.k.includes(q)) return 25;
  return 0;
}

function search(items: Item[], query: string, limit = 8): Item[] {
  const q = norm(query);
  if (q.length < 2) return [];
  const terms = q.split(/\s+/).filter(Boolean);
  return items
    .map((item) => ({
      item,
      s: terms.reduce((acc, t) => acc + score(item, t), 0),
    }))
    .filter((r) => r.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map((r) => r.item);
}

function render(container: HTMLElement, results: Item[], query: string) {
  if (!query || query.length < 2) {
    container.hidden = true;
    container.innerHTML = '';
    return;
  }
  container.hidden = false;
  if (!results.length) {
    container.innerHTML = `<p class="search__empty">No encontramos resultados para <strong>${
      query.replace(/[<>&]/g, '')
    }</strong>.<br>Escríbenos por WhatsApp y te orientamos.</p>`;
    return;
  }
  const groups = new Map<string, Item[]>();
  for (const r of results) {
    if (!groups.has(r.g)) groups.set(r.g, []);
    groups.get(r.g)!.push(r);
  }
  let html = '';
  for (const [group, items] of groups) {
    html += `<p class="search__group-title">${group}</p>`;
    for (const i of items) {
      html += `<a class="search__item" href="${i.u}" role="option">
        <span class="search__item-title">${i.t}</span>
        <span class="search__item-desc">${i.d}</span>
      </a>`;
    }
  }
  container.innerHTML = html;
}

function wire(root: HTMLElement) {
  const input = root.querySelector<HTMLInputElement>('[data-search-input]');
  const results = root.querySelector<HTMLElement>('[data-search-results]');
  if (!input || !results) return;

  let active = -1;

  const update = async () => {
    const items = await loadIndex();
    const found = search(items, input.value);
    active = -1;
    render(results, found, input.value.trim());
    input.setAttribute('aria-expanded', String(!results.hidden));
  };

  input.addEventListener('focus', () => void loadIndex(), { once: true });
  input.addEventListener('input', () => void update());

  input.addEventListener('keydown', (e) => {
    const options = Array.from(results.querySelectorAll<HTMLAnchorElement>('.search__item'));
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      if (!options.length) return;
      e.preventDefault();
      active = e.key === 'ArrowDown'
        ? (active + 1) % options.length
        : (active - 1 + options.length) % options.length;
      options.forEach((o, i) => o.classList.toggle('is-active', i === active));
      options[active]?.scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter' && active >= 0) {
      e.preventDefault();
      options[active]?.click();
    } else if (e.key === 'Escape') {
      results.hidden = true;
      input.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('click', (e) => {
    if (!root.contains(e.target as Node)) {
      results.hidden = true;
      input.setAttribute('aria-expanded', 'false');
    }
  });

  // Prellenado desde /buscar/?q= (usado por el SearchAction del schema)
  const q = new URLSearchParams(location.search).get('q');
  if (q && root.hasAttribute('data-search-autofill')) {
    input.value = q;
    void update();
  }
}

document.querySelectorAll<HTMLElement>('[data-search]').forEach(wire);
