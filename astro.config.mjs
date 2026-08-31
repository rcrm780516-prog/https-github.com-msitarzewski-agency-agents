// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import fs from 'node:fs';
import path from 'node:path';

// El dominio se define en una sola variable de entorno para que el mismo build
// sirva para staging y produccion en Hostinger.
const SITE = process.env.PUBLIC_SITE_URL || 'https://gemmaeginecologos.com';

/**
 * Perfiles medicos marcados como draft: son plantillas sin datos reales.
 * Se leen aqui (el filtro del sitemap es sincrono) para excluirlos del
 * sitemap; las paginas ademas salen con noindex desde su plantilla.
 */
function draftDoctorPaths() {
  const dir = path.resolve('./src/content/medicos');
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => /\.mdx?$/.test(f))
    .filter((f) => /^draft:\s*true\s*$/m.test(fs.readFileSync(path.join(dir, f), 'utf8')))
    .map((f) => `/medicos/${f.replace(/\.mdx?$/, '')}/`);
}

// Páginas legales: hoy son placeholders con noindex. Cuando el área legal
// entregue el texto definitivo, quitar el `noindex` de la página y estas dos
// rutas de aquí para que entren al sitemap.
const EXCLUDED = [
  '/gracias/',
  '/buscar/',
  '/404',
  '/aviso-de-privacidad/',
  '/terminos-y-condiciones/',
  ...draftDoctorPaths(),
];

export default defineConfig({
  site: SITE,
  // trailingSlash + build.format 'directory' => URLs /ginecologia/ servidas por
  // Apache (Hostinger) sin reglas extra: cada ruta es una carpeta con index.html.
  trailingSlash: 'always',
  build: {
    format: 'directory',
    inlineStylesheets: 'auto',
  },
  output: 'static',
  compressHTML: true,
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !EXCLUDED.some((excluded) => page.includes(excluded)),
      changefreq: 'weekly',
      lastmod: new Date(),
      serialize(item) {
        // Prioridades: home > ubicaciones/servicios > resto.
        const url = item.url;
        if (url.replace(SITE, '') === '/') item.priority = 1.0;
        else if (url.includes('/ubicaciones/')) item.priority = 0.9;
        else if (url.includes('/medicos/')) item.priority = 0.8;
        else if (url.includes('/blog/')) item.priority = 0.6;
        else item.priority = 0.8;
        return item;
      },
    }),
  ],
  image: {
    // sharp local: no dependemos de ningun servicio externo de imagenes.
    responsiveStyles: true,
    layout: 'constrained',
  },
  vite: {
    build: {
      cssMinify: 'lightningcss',
    },
  },
});
