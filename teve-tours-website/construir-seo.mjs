import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs'; import path from 'path';

const BASE = process.argv[2], SALIDA = process.argv[3], RUTAS = JSON.parse(fs.readFileSync(process.argv[4],'utf8'));
const b = await chromium.launch();
const ctx = await b.newContext({ viewport:{width:1280,height:900} });
// Google y Ads no responden aqui; se neutralizan para que no retrasen la
// captura. En el archivo guardado las etiquetas siguen intactas.
await ctx.route(/googletagmanager\.com|tacdn\.com|jscache\.com/, r => r.fulfill({status:200, body:''}));

fs.rmSync(SALIDA, {recursive:true, force:true});
const filas = [];
for (const r of RUTAS) {
  const p = await ctx.newPage();
  await p.goto(BASE + r.url, {waitUntil:'networkidle'});
  await p.waitForTimeout(700);
  const info = await p.evaluate(() => ({
    titulo: document.title,
    desc: (document.querySelector('meta[name=description]')||{}).content || '',
    canon: (document.querySelector('link[rel=canonical]')||{}).href || '',
    h1: (document.querySelector('.page-section:not([hidden]) h1, .page-section:not([hidden]) h2')||{}).textContent || '',
    hreflang: document.querySelectorAll('link[rel=alternate][hreflang]').length,
    lang: document.documentElement.lang
  }));
  // --- limpieza del duplicado + un H1 propio por pagina ---
  await p.evaluate(() => {
    // 1. Las secciones que NO son la pagina actual siguen en el HTML con todo
    //    su contenido, asi que las 21 paginas compartirian el mismo cuerpo y
    //    Google las tomaria por duplicadas. Se vacian los contenedores que el
    //    JavaScript vuelve a rellenar solo al cargar, asi que el visitante no
    //    nota nada y el rastreador ve unicamente el contenido de esta pagina.
    const GENERADOS = ['homeServicesGrid','homeToursGrid','servicesGridFull',
      'toursGridFull','destGrid','blogGrid','reviewsGrid','timBio','contactDirect'];
    document.querySelectorAll('.page-section:not(.active)').forEach(sec => {
      GENERADOS.forEach(id => {
        const el = sec.querySelector('#' + id);
        if (el) el.innerHTML = '';
      });
    });

    // 2. El <h1> del sitio es el titulo de la portada, y vive en una seccion
    //    oculta. En /services o /tours eso deja a la pagina sin un H1 que
    //    hable de ella. Se baja ese a <h2> y se sube a <h1> el titulo de la
    //    seccion activa. Las clases no cambian, asi que se ve igual.
    const cambiar = (el, etiqueta) => {
      const n = document.createElement(etiqueta);
      for (const a of el.attributes) n.setAttribute(a.name, a.value);
      n.innerHTML = el.innerHTML;
      el.replaceWith(n);
      return n;
    };
    const activa = document.querySelector('.page-section.active');
    if (activa && activa.id !== 'page-home') {
      const heroe = document.querySelector('#heroTitle');
      if (heroe && heroe.tagName === 'H1') cambiar(heroe, 'h2');
      // El primero <h2> con texto de la seccion, en orden del documento. No
      // sirve buscar solo "h2.sec-title": la pagina de Tim lleva su titulo en
      // #timTitulo y la de Contacto en .contact-head, y con ese selector se
      // colaba el titulo de las resenas o se quedaban sin H1.
      const titulo = [...activa.querySelectorAll('h2')]
        .find(h => h.textContent.trim().length > 0);
      if (titulo) cambiar(titulo, 'h1');
    }
  });

  let html = await p.content();
  // Marca para saber que este archivo salio del prerenderizado.
  html = html.replace('<head>', '<head>\n<!-- prerenderizado -->');
  const destino = r.url === '/' ? path.join(SALIDA,'index.html')
                                : path.join(SALIDA, r.url, 'index.html');
  fs.mkdirSync(path.dirname(destino), {recursive:true});
  fs.writeFileSync(destino, html);
  filas.push({...r, ...info, kb: Math.round(Buffer.byteLength(html)/1024)});
  await p.close();
}
await b.close();
console.log(`${filas.length} paginas generadas\n`);
for (const f of filas)
  console.log(`${f.url.padEnd(22)} [${f.lang}] ${String(f.kb).padStart(4)}KB  hreflang:${f.hreflang}  ${f.titulo.slice(0,58)}`);
fs.writeFileSync(process.argv[5], JSON.stringify(filas,null,1));
