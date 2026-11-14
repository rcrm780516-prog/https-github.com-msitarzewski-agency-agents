#!/usr/bin/env node
/**
 * Empaqueta el build como demo offline para presentar a cliente.
 *
 * El sitio real usa rutas absolutas (/ginecologia/), que solo funcionan servidas
 * por un servidor web. Para que el director pueda abrir el demo con doble clic
 * desde su escritorio, este script reescribe cada enlace y cada recurso a una
 * ruta relativa con index.html explícito, y añade un aviso de vista previa.
 *
 * El contenido es el del sitio real: no se recorta ni se maqueta aparte.
 *
 * Uso:
 *   PUBLIC_DEMO=true npx astro build
 *   node scripts/build-demo.mjs
 */
import { readdir, readFile, writeFile, mkdir, copyFile, rm, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const DIST = path.resolve('dist');
const OUT = path.resolve('demo');

/** Aviso de vista previa: fija expectativas sin arruinar la primera impresión. */
const BANNER = `
<div id="demo-bar" role="note">
  <span><strong>Vista previa</strong> · Imágenes ilustrativas y datos marcados como [POR CONFIRMAR] pendientes de GEMMAE</span>
  <button type="button" id="demo-bar-close" aria-label="Ocultar aviso">&times;</button>
</div>
<style>
  #demo-bar{display:flex;align-items:center;justify-content:center;gap:1rem;
    background:#1F3228;color:#CBD5CC;font:500 0.78rem/1.4 system-ui,-apple-system,"Segoe UI",sans-serif;
    padding:0.55rem 1rem;text-align:center;position:relative;z-index:80}
  #demo-bar strong{color:#fff;font-weight:600}
  #demo-bar button{background:transparent;border:0;color:#8FA595;font-size:1.1rem;
    line-height:1;cursor:pointer;padding:0 .25rem}
  #demo-bar button:hover{color:#fff}
  @media (max-width:640px){#demo-bar{font-size:0.7rem;padding:0.5rem 0.75rem}}
</style>
<script>
  document.getElementById('demo-bar-close')?.addEventListener('click',function(){
    document.getElementById('demo-bar').remove();
  });
  // En el demo no hay servidor: el formulario confirma sin enviar nada.
  document.addEventListener('submit',function(e){
    var f=e.target;
    if(!f.hasAttribute('data-lead-form'))return;
    e.preventDefault();e.stopImmediatePropagation();
    var s=f.querySelector('[data-form-status]');
    if(s){s.hidden=false;s.setAttribute('data-state','success');
      s.textContent='Modo demo: el formulario no envía datos. En el sitio publicado, esta solicitud llega por WhatsApp y al CRM.';}
  },true);
</script>`;

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

/** Convierte una ruta absoluta del sitio en relativa al archivo que la usa. */
function toRelative(url, depth) {
  const prefix = depth === 0 ? './' : '../'.repeat(depth);
  if (url === '/') return `${prefix}index.html`;
  const clean = url.replace(/^\//, '');
  // Un enlace a carpeta (/ginecologia/) necesita index.html explícito en file://
  if (clean.endsWith('/')) return `${prefix}${clean}index.html`;
  return `${prefix}${clean}`;
}

async function main() {
  if (!existsSync(DIST)) {
    console.error('No existe dist/. Ejecuta primero: PUBLIC_DEMO=true npx astro build');
    process.exit(1);
  }

  await rm(OUT, { recursive: true, force: true });
  await mkdir(OUT, { recursive: true });

  const files = await walk(DIST);
  let paginas = 0;
  let enlaces = 0;

  for (const file of files) {
    const rel = path.relative(DIST, file);
    const dest = path.join(OUT, rel);
    await mkdir(path.dirname(dest), { recursive: true });

    if (!file.endsWith('.html')) {
      await copyFile(file, dest);
      continue;
    }

    let html = await readFile(file, 'utf8');
    const depth = rel.split(path.sep).length - 1;

    // Enlaces y recursos: de absolutos a relativos
    html = html.replace(/(href|src|action)="(\/[^"#?]*?)"/g, (m, attr, url) => {
      // El sitemap y robots no se navegan en el demo
      if (url.startsWith('//')) return m;
      enlaces++;
      return `${attr}="${toRelative(url, depth)}"`;
    });

    // El buscador pide un JSON por fetch: bajo file:// el navegador lo bloquea
    html = html.replace(/fetch\("\/search-index\.json"\)/g, `fetch("${'../'.repeat(depth) || './'}search-index.json")`);

    // Bajo file:// el navegador bloquea los módulos externos por CORS y no
    // puede resolver el manifest: se retiran para que la consola quede limpia.
    // Solo aportan prefetch e instalación PWA, irrelevantes en un demo local.
    html = html.replace(/<script type="module" src="[^"]*"><\/script>/g, '');
    html = html.replace(/<link rel="manifest"[^>]*>/g, '');
    html = html.replace(/<link rel="sitemap"[^>]*>/g, '');

    // Aviso de vista previa justo después de <body>
    html = html.replace(/<body([^>]*)>/, `<body$1>${BANNER}`);

    await writeFile(dest, html);
    paginas++;
  }

  const total = (await walk(OUT)).length;
  let bytes = 0;
  for (const f of await walk(OUT)) bytes += (await stat(f)).size;

  console.log(`Demo generado en ${OUT}`);
  console.log(`  ${paginas} páginas · ${total} archivos · ${(bytes / 1024 / 1024).toFixed(1)} MB`);
  console.log(`  ${enlaces} rutas reescritas a relativas`);
  console.log(`  Abrir: ${path.join(OUT, 'index.html')}`);
}

main();
