import type { APIRoute } from 'astro';
import { site } from '../config/site';

/**
 * robots.txt generado en build para que el host del sitemap siga al dominio
 * configurado (staging vs produccion) sin editar archivos a mano.
 */
export const GET: APIRoute = () => {
  const body = `# GEMMAE Ginecólogos
User-agent: *
Allow: /

# Páginas sin valor de búsqueda
Disallow: /gracias/
Disallow: /buscar/
Disallow: /*?q=

# Recursos que sí deben rastrearse
Allow: /_astro/
Allow: /images/

Sitemap: ${site.url}/sitemap-index.xml
`;
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
