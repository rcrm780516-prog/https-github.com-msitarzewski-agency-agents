import { site } from '../config/site';

/** Normaliza cualquier ruta a la forma /ruta/ (trailingSlash: always). */
export function path(input: string): string {
  if (!input) return '/';
  if (/^https?:\/\//.test(input)) return input;
  let p = input.startsWith('/') ? input : `/${input}`;
  if (!p.endsWith('/') && !p.includes('.') && !p.includes('#')) p = `${p}/`;
  return p;
}

/** URL absoluta para canonical, OG y JSON-LD. */
export function absolute(input: string): string {
  return new URL(path(input), site.url).href;
}

/** Rutas canonicas por tipo de contenido: un solo lugar que cambiar. */
export const routes = {
  home: '/',
  servicios: '/servicios/',
  servicio: (slug: string) => `/${slug}/`,
  medicos: '/medicos/',
  medico: (slug: string) => `/medicos/${slug}/`,
  ubicaciones: '/ubicaciones/',
  ubicacion: (slug: string) => `/ubicaciones/${slug}/`,
  blog: '/blog/',
  articulo: (slug: string) => `/blog/${slug}/`,
  blogCategoria: (slug: string) => `/blog/categoria/${slug}/`,
  faq: '/preguntas-frecuentes/',
  contacto: '/contacto/',
  buscar: '/buscar/',
  privacidad: '/aviso-de-privacidad/',
  terminos: '/terminos-y-condiciones/',
} as const;

/** true si `current` corresponde a `href` (para aria-current). */
export function isActive(current: string, href: string): boolean {
  const c = path(current);
  const h = path(href);
  if (h === '/') return c === '/';
  return c === h || c.startsWith(h);
}
