import { getCollection, type CollectionEntry } from 'astro:content';

export type Servicio = CollectionEntry<'servicios'>;
export type Ubicacion = CollectionEntry<'ubicaciones'>;
export type Medico = CollectionEntry<'medicos'>;
export type Articulo = CollectionEntry<'blog'>;

const isProd = import.meta.env.PROD;

/** Servicios ordenados. */
export async function getServicios(): Promise<Servicio[]> {
  const all = await getCollection('servicios');
  return all.sort((a, b) => a.data.order - b.data.order);
}

export async function getServiciosDestacados(): Promise<Servicio[]> {
  return (await getServicios()).filter((s) => s.data.featured);
}

export async function getUbicaciones(): Promise<Ubicacion[]> {
  const all = await getCollection('ubicaciones');
  return all.sort((a, b) => a.data.order - b.data.order);
}

/**
 * Medicos publicables. Los perfiles marcados como draft son plantillas sin
 * datos reales: se construyen para revision pero no se listan en produccion.
 */
export async function getMedicos(includeDrafts = !isProd): Promise<Medico[]> {
  const all = await getCollection('medicos');
  return all
    .filter((m) => includeDrafts || !m.data.draft)
    .sort((a, b) => a.data.order - b.data.order);
}

/** Todos los perfiles, incluidas plantillas: usado por getStaticPaths. */
export async function getMedicosAll(): Promise<Medico[]> {
  return (await getCollection('medicos')).sort((a, b) => a.data.order - b.data.order);
}

export async function getArticulos(): Promise<Articulo[]> {
  const all = await getCollection('blog');
  return all
    .filter((a) => !a.data.draft)
    .sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf());
}

/** Medicos que atienden en una sede. La relacion se declara en el medico. */
export async function getMedicosPorUbicacion(ubicacionId: string): Promise<Medico[]> {
  const medicos = await getMedicos();
  return medicos.filter((m) => m.data.locations.some((l) => l.id === ubicacionId));
}

/** Medicos que ofrecen un servicio. */
export async function getMedicosPorServicio(servicioId: string): Promise<Medico[]> {
  const medicos = await getMedicos();
  return medicos.filter((m) => m.data.services.some((s) => s.id === servicioId));
}

/** Sedes donde se ofrece un servicio. */
export async function getUbicacionesPorServicio(servicio: Servicio): Promise<Ubicacion[]> {
  const ubicaciones = await getUbicaciones();
  const ids = servicio.data.locations.map((l) => l.id);
  return ubicaciones.filter((u) => ids.includes(u.id));
}

/** Servicios ofrecidos en una sede. */
export async function getServiciosPorUbicacion(ubicacion: Ubicacion): Promise<Servicio[]> {
  const servicios = await getServicios();
  const ids = ubicacion.data.services.map((s) => s.id);
  return servicios.filter((s) => ids.includes(s.id));
}

/** Articulos relacionados con un servicio (relacion declarada en el articulo). */
export async function getArticulosPorServicio(servicioId: string, limit = 3): Promise<Articulo[]> {
  const articulos = await getArticulos();
  return articulos
    .filter((a) => a.data.relatedServices.some((s) => s.id === servicioId))
    .slice(0, limit);
}

export async function getServiciosPorIds(ids: string[]): Promise<Servicio[]> {
  const servicios = await getServicios();
  return ids.map((id) => servicios.find((s) => s.id === id)).filter((s): s is Servicio => Boolean(s));
}

export async function getUbicacionesPorIds(ids: string[]): Promise<Ubicacion[]> {
  const ubicaciones = await getUbicaciones();
  return ids.map((id) => ubicaciones.find((u) => u.id === id)).filter((u): u is Ubicacion => Boolean(u));
}

/** Categorias de blog con su etiqueta visible. */
export const blogCategorias = [
  { slug: 'ginecologia', label: 'Ginecología' },
  { slug: 'embarazo', label: 'Embarazo' },
  { slug: 'fertilidad', label: 'Fertilidad' },
  { slug: 'menopausia', label: 'Menopausia' },
  { slug: 'vph', label: 'VPH' },
  { slug: 'salud-preventiva', label: 'Salud preventiva' },
  { slug: 'adolescencia', label: 'Adolescencia' },
] as const;

export function categoriaLabel(slug: string): string {
  return blogCategorias.find((c) => c.slug === slug)?.label ?? slug;
}

/** Fecha larga en espanol para bylines y schema. */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export function isoDate(date: Date): string {
  return date.toISOString().split('T')[0]!;
}
