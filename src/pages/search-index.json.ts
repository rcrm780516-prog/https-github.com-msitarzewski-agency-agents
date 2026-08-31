import type { APIRoute } from 'astro';
import {
  getServicios,
  getUbicaciones,
  getMedicos,
  getArticulos,
  categoriaLabel,
} from '../lib/content';
import { routes } from '../lib/urls';

/**
 * Indice de busqueda generado en build.
 * Es un JSON plano y pequeno: el buscador funciona 100% en el cliente,
 * sin backend, sin servicio externo y sin coste (requisito Hostinger).
 */
export const GET: APIRoute = async () => {
  const [servicios, ubicaciones, medicos, articulos] = await Promise.all([
    getServicios(),
    getUbicaciones(),
    getMedicos(false),
    getArticulos(),
  ]);

  const items = [
    ...servicios.map((s) => ({
      t: s.data.name,
      d: s.data.excerpt,
      u: routes.servicio(s.id),
      g: 'Servicios',
      k: [...s.data.searchTerms, s.data.name, ...s.data.related.map((r) => r.id)].join(' '),
    })),
    ...ubicaciones.map((u) => ({
      t: u.data.name,
      d: `${u.data.city}, ${u.data.state}`,
      u: routes.ubicacion(u.id),
      g: 'Ubicaciones',
      k: [...u.data.searchTerms, ...u.data.coverage, u.data.city].join(' '),
    })),
    ...medicos.map((m) => ({
      t: [m.data.honorific, m.data.name].filter(Boolean).join(' '),
      d: m.data.specialty,
      u: routes.medico(m.id),
      g: 'Médicos',
      k: [...m.data.searchTerms, m.data.specialty, ...m.data.subspecialties].join(' '),
    })),
    ...articulos.map((a) => ({
      t: a.data.title,
      d: categoriaLabel(a.data.category),
      u: routes.articulo(a.id),
      g: 'Artículos',
      k: [...a.data.searchTerms, a.data.excerpt, categoriaLabel(a.data.category)].join(' '),
    })),
  ];

  return new Response(JSON.stringify(items), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
