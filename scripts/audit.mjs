#!/usr/bin/env node
/**
 * Auditoría automática del build (checklist de la sección 60 del brief).
 * Revisa el HTML ya generado en dist/ — no el código fuente — para detectar
 * lo que realmente vería Google: title, description, H1, canonical, schema,
 * Open Graph, imágenes, CTAs, accesibilidad básica y NAP consistente.
 *
 * Uso: npm run build && npm run audit:seo
 */
import { readdir, readFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const DIST = path.resolve('dist');
const errors = [];
const warnings = [];
const info = [];

const err = (page, msg) => errors.push(`${page} → ${msg}`);
const warn = (page, msg) => warnings.push(`${page} → ${msg}`);

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

const attr = (html, re) => (html.match(re) || [])[1];
const count = (html, re) => (html.match(re) || []).length;

async function main() {
  if (!existsSync(DIST)) {
    console.error('No existe dist/. Ejecuta primero: npm run build');
    process.exit(1);
  }

  const files = await walk(DIST);
  const titles = new Map();
  const descriptions = new Map();
  let indexables = 0;

  for (const file of files) {
    const page = '/' + path.relative(DIST, file).replace(/index\.html$/, '').replace(/\\/g, '/');
    const html = await readFile(file, 'utf8');
    const noindex = /name="robots" content="noindex/.test(html);
    if (!noindex) indexables++;

    // --- SEO base ---
    const title = attr(html, /<title>([^<]*)<\/title>/);
    if (!title) err(page, 'sin <title>');
    else {
      if (title.length > 62) warn(page, `title de ${title.length} caracteres (se truncará en Google)`);
      if (!noindex) {
        if (titles.has(title)) err(page, `title duplicado con ${titles.get(title)}`);
        else titles.set(title, page);
      }
    }

    const desc = attr(html, /<meta name="description" content="([^"]*)"/);
    if (!desc) err(page, 'sin meta description');
    else {
      if (desc.length < 70) warn(page, `meta description corta (${desc.length})`);
      if (desc.length > 165) warn(page, `meta description larga (${desc.length})`);
      if (!noindex) {
        if (descriptions.has(desc)) err(page, `meta description duplicada con ${descriptions.get(desc)}`);
        else descriptions.set(desc, page);
      }
    }

    const h1s = count(html, /<h1[\s>]/g);
    if (h1s === 0) err(page, 'sin H1');
    if (h1s > 1) err(page, `${h1s} etiquetas H1 (debe haber exactamente una)`);

    if (!/rel="canonical"/.test(html)) err(page, 'sin canonical');
    if (!/<html lang="es"/.test(html)) err(page, 'sin atributo lang en <html>');

    // --- Datos estructurados ---
    const ld = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    if (!ld && !noindex) err(page, 'sin JSON-LD');
    else {
      try {
        const parsed = JSON.parse(ld[1]);
        const graph = parsed['@graph'] || [];
        const json = JSON.stringify(graph);
        if (json.includes('POR CONFIRMAR')) err(page, 'JSON-LD contiene marcadores [POR CONFIRMAR]');
        if (!graph.length) warn(page, 'JSON-LD vacío');
      } catch {
        err(page, 'JSON-LD inválido');
      }
    }

    // --- Open Graph ---
    for (const prop of ['og:title', 'og:description', 'og:image', 'og:url', 'og:type']) {
      if (!html.includes(`property="${prop}"`)) err(page, `sin ${prop}`);
    }

    // --- Imágenes ---
    const imgs = html.match(/<img\b[^>]*>/g) || [];
    for (const img of imgs) {
      if (!/\balt=/.test(img)) err(page, 'imagen sin atributo alt');
      if (!/\bwidth=/.test(img) || !/\bheight=/.test(img))
        warn(page, 'imagen sin width/height (riesgo de CLS)');
    }

    // --- CRO: toda página indexable necesita salida ---
    if (!noindex) {
      if (!/wa\.me/.test(html)) err(page, 'sin CTA de WhatsApp');
      if (!/href="\/contacto\//.test(html)) err(page, 'sin CTA de agenda');
      if (!/href="\/ubicaciones\//.test(html)) warn(page, 'sin enlace a ubicaciones');
      const internos = count(html, /href="\/[^"]*"/g);
      if (internos < 15) warn(page, `pocos enlaces internos (${internos})`);
    }

    // --- Accesibilidad básica ---
    if (!/class="skip-link"/.test(html)) warn(page, 'sin enlace de salto al contenido');
    // Nombre accesible: texto visible o aria-label. Un botón de solo icono sin
    // ninguno de los dos es inutilizable con lector de pantalla.
    const botonesSinNombre = [...html.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/g)].filter(
      ([, atributos, contenido]) =>
        !/aria-label=/.test(atributos) &&
        contenido.replace(/<[^>]*>/g, '').replace(/&[a-z]+;/g, '').trim() === ''
    );
    if (botonesSinNombre.length) err(page, `${botonesSinNombre.length} botón(es) de solo icono sin aria-label`);
  }

  // --- Sitemap y robots ---
  const sitemapFile = path.join(DIST, 'sitemap-0.xml');
  if (!existsSync(sitemapFile)) err('/', 'no se generó sitemap-0.xml');
  else {
    const xml = await readFile(sitemapFile, 'utf8');
    const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    info.push(`Sitemap: ${urls.length} URLs`);
    for (const url of urls) {
      const rel = url.replace(/^https?:\/\/[^/]+/, '');
      const f = path.join(DIST, rel, 'index.html');
      if (!existsSync(f) && !existsSync(path.join(DIST, rel))) err(rel, 'URL en sitemap sin archivo generado');
      else {
        const html = await readFile(existsSync(f) ? f : path.join(DIST, rel), 'utf8');
        if (/content="noindex/.test(html)) err(rel, 'página noindex incluida en el sitemap');
      }
    }
    if (urls.length !== indexables) {
      info.push(`Páginas indexables: ${indexables} · en sitemap: ${urls.length}`);
    }
  }

  if (!existsSync(path.join(DIST, 'robots.txt'))) err('/', 'sin robots.txt');
  if (!existsSync(path.join(DIST, '.htaccess'))) err('/', 'sin .htaccess (configuración Hostinger)');
  if (!existsSync(path.join(DIST, '404.html'))) err('/', 'sin página 404');
  if (!existsSync(path.join(DIST, 'search-index.json'))) err('/', 'sin índice de búsqueda');

  // --- Peso de los assets ---
  const assetsDir = path.join(DIST, '_astro');
  if (existsSync(assetsDir)) {
    let js = 0;
    let css = 0;
    for (const f of await readdir(assetsDir)) {
      const { size } = await stat(path.join(assetsDir, f));
      if (f.endsWith('.js')) js += size;
      if (f.endsWith('.css')) css += size;
    }
    info.push(`JS total: ${(js / 1024).toFixed(1)} KB · CSS total: ${(css / 1024).toFixed(1)} KB`);
    if (js > 120 * 1024) warn('/', `JS por encima del presupuesto (${(js / 1024).toFixed(0)} KB > 120 KB)`);
  }

  // --- Reporte ---
  console.log(`\n=== AUDITORÍA GEMMAE — ${files.length} páginas ===\n`);
  for (const i of info) console.log(`  · ${i}`);
  if (warnings.length) {
    console.log(`\n  AVISOS (${warnings.length}):`);
    for (const w of [...new Set(warnings)]) console.log(`   ! ${w}`);
  }
  if (errors.length) {
    console.log(`\n  ERRORES (${errors.length}):`);
    for (const e of [...new Set(errors)]) console.log(`   x ${e}`);
    console.log('\nAuditoría FALLIDA\n');
    process.exit(1);
  }
  console.log('\nAuditoría OK: sin errores bloqueantes.\n');
}

main();
