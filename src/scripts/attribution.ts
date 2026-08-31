/**
 * Atribucion + medicion. Nucleo del ecosistema: cada clic de contacto sale del
 * sitio sabiendo de donde vino el usuario.
 *
 * Decision deliberada: los UTM NO se reescriben en los enlaces internos.
 * Propagarlos por la URL rompe la sesion en GA4 (cada pagina parece una entrada
 * de campana nueva) y genera URLs duplicadas para el rastreo. En su lugar se
 * guardan en sessionStorage al aterrizar y se adjuntan al momento de la
 * conversion: WhatsApp, formulario y eventos.
 */

export interface Attribution {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
  gclid: string;
  fbclid: string;
  landing_page: string;
  referrer: string;
  first_seen: string;
}

const KEY = 'gemmae_attr';
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;

function safeGet(): Partial<Attribution> {
  try {
    return JSON.parse(sessionStorage.getItem(KEY) || localStorage.getItem(KEY) || '{}');
  } catch {
    return {};
  }
}

function safeSet(data: Partial<Attribution>) {
  const json = JSON.stringify(data);
  try {
    sessionStorage.setItem(KEY, json);
    // Copia de 30 dias para atribuir visitas de retorno (ciclo de decision
    // largo en salud: rara vez se agenda en la primera visita).
    localStorage.setItem(KEY, json);
  } catch {
    /* modo privado o almacenamiento bloqueado: seguimos sin persistencia */
  }
}

function capture(): Partial<Attribution> {
  const params = new URLSearchParams(location.search);
  const stored = safeGet();
  const incoming: Partial<Attribution> = {};

  for (const k of UTM_KEYS) {
    const v = params.get(k);
    if (v) incoming[k] = v.slice(0, 120);
  }
  const gclid = params.get('gclid');
  const fbclid = params.get('fbclid');
  if (gclid) incoming.gclid = gclid.slice(0, 200);
  if (fbclid) incoming.fbclid = fbclid.slice(0, 200);

  // Una campana nueva sustituye a la anterior (modelo last non-direct click).
  const hasNew = Object.keys(incoming).length > 0;
  const data: Partial<Attribution> = hasNew ? incoming : stored;

  if (!data.landing_page) data.landing_page = location.pathname;
  if (!data.referrer) data.referrer = document.referrer || 'direct';
  if (!data.first_seen) data.first_seen = new Date().toISOString();

  safeSet(data);
  return data;
}

const attribution = capture();

/** Etiqueta corta y legible que viaja dentro del mensaje de WhatsApp. */
function attributionTag(ctx: Record<string, string | undefined>): string {
  const bits: string[] = [];
  const src = attribution.utm_source || (attribution.gclid ? 'google-ads' : '') || '';
  const camp = attribution.utm_campaign || '';
  if (ctx.service) bits.push(`serv:${ctx.service}`);
  if (ctx.location) bits.push(`sede:${ctx.location}`);
  if (ctx.doctor) bits.push(`med:${ctx.doctor}`);
  if (src) bits.push(`src:${src}`);
  if (camp) bits.push(`camp:${camp}`);
  bits.push(`pag:${location.pathname}`);
  return bits.length ? ` [${bits.join(' | ')}]` : '';
}

/** Enriquece un enlace wa.me con el contexto de la pagina y la campana. */
function enrichWhatsApp(link: HTMLAnchorElement) {
  try {
    const url = new URL(link.href);
    if (!/wa\.me|api\.whatsapp\.com/.test(url.hostname)) return;
    const base = url.searchParams.get('text') || 'Hola GEMMAE';
    if (base.includes(' [')) return; // ya enriquecido
    const tag = attributionTag({
      service: link.dataset.service,
      location: link.dataset.location,
      doctor: link.dataset.doctor,
    });
    url.searchParams.set('text', `${base}${tag}`);
    link.href = url.toString();
  } catch {
    /* href no valido: se deja tal cual */
  }
}

/** Envia el evento a GTM (dataLayer) y a gtag si esta presente. */
function track(event: string, params: Record<string, unknown> = {}) {
  const payload = {
    event,
    ...params,
    utm_source: attribution.utm_source || '',
    utm_medium: attribution.utm_medium || '',
    utm_campaign: attribution.utm_campaign || '',
    landing_page: attribution.landing_page || '',
    page_path: location.pathname,
  };
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
  if (typeof window.gtag === 'function') {
    window.gtag('event', event, payload);
  }
  if (typeof window.fbq === 'function' && (event === 'click_whatsapp' || event === 'form_submit')) {
    window.fbq('trackCustom', event, payload as Record<string, string>);
  }
}

/** API publica usada por el resto de scripts y por integraciones futuras. */
window.gemmae = {
  track,
  attribution: () => ({ ...attribution }),
  enrichWhatsApp,
};

// Enriquecimiento inmediato: el usuario puede hacer clic antes de interactuar.
document.querySelectorAll<HTMLAnchorElement>('a[data-wa]').forEach(enrichWhatsApp);

// Un solo listener delegado para toda la medicion de clics.
document.addEventListener(
  'click',
  (e) => {
    const el = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-event]');
    if (!el) return;
    if (el instanceof HTMLAnchorElement && el.hasAttribute('data-wa')) enrichWhatsApp(el);
    track(el.dataset.event!, {
      service: el.dataset.service || '',
      location: el.dataset.location || '',
      doctor: el.dataset.doctor || '',
      source: el.dataset.source || 'inline',
      link_text: (el.textContent || '').trim().slice(0, 60),
    });
  },
  { capture: true }
);

export { attribution, track };
