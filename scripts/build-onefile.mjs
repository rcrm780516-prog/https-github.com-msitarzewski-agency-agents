#!/usr/bin/env node
/**
 * Empaqueta TODO el sitio en un único archivo .html.
 *
 * Para qué: que alguien abra un solo archivo con doble clic y navegue el sitio
 * completo —las 41 páginas, con imágenes— sin servidor, sin internet y sin
 * descomprimir nada. Es la forma de enseñar el sitio antes de publicarlo.
 *
 * Cómo funciona: el HTML de cada página se guarda dentro del archivo y un
 * enrutador reemplaza el contenido al hacer clic, en lugar de cargar otro
 * documento. Las imágenes van incrustadas en base64 y el CSS en línea, así que
 * no queda ninguna referencia externa.
 *
 * Uso:
 *   PUBLIC_DEMO=true npx astro build
 *   node scripts/build-demo.mjs --presentacion --absolutas --salida=demo-hosting
 *   node scripts/build-onefile.mjs
 */
import { readdir, readFile, writeFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';
import sharp from 'sharp';

const ORIGEN = path.resolve('demo-hosting');
const SALIDA = path.resolve('GEMMAE-sitio-completo.html');

/** Ancho máximo de las imágenes incrustadas: equilibra nitidez y peso. */
const ANCHO_MAX = 1280;
const CALIDAD = 72;

async function recorrer(dir) {
  const salida = [];
  for (const entrada of await readdir(dir, { withFileTypes: true })) {
    const completa = path.join(dir, entrada.name);
    if (entrada.isDirectory()) salida.push(...(await recorrer(completa)));
    else salida.push(completa);
  }
  return salida;
}

/** Ruta del sitio a partir del archivo: demo-hosting/vph/index.html → /vph/ */
function rutaDe(archivo) {
  const rel = path.relative(ORIGEN, archivo).split(path.sep).join('/');
  if (rel === 'index.html') return '/';
  if (rel === '404.html') return '/404/';
  return '/' + rel.replace(/index\.html$/, '');
}

const cacheImagenes = new Map();

/** Convierte una imagen del sitio en data URI, redimensionada. */
async function incrustarImagen(rutaWeb) {
  if (cacheImagenes.has(rutaWeb)) return cacheImagenes.get(rutaWeb);
  const archivo = path.join(ORIGEN, rutaWeb.replace(/^\//, ''));
  if (!existsSync(archivo)) {
    cacheImagenes.set(rutaWeb, null);
    return null;
  }
  try {
    const meta = await sharp(archivo).metadata();
    let img = sharp(archivo);
    if ((meta.width || 0) > ANCHO_MAX) img = img.resize({ width: ANCHO_MAX });
    // PNG con transparencia (el logotipo) se mantiene como PNG
    const esPng = /\.png$/i.test(archivo) && meta.hasAlpha;
    const buf = esPng
      ? await img.png({ compressionLevel: 9, palette: true }).toBuffer()
      : await img.jpeg({ quality: CALIDAD, mozjpeg: true }).toBuffer();
    const uri = `data:image/${esPng ? 'png' : 'jpeg'};base64,${buf.toString('base64')}`;
    cacheImagenes.set(rutaWeb, uri);
    return uri;
  } catch {
    cacheImagenes.set(rutaWeb, null);
    return null;
  }
}

/** Sustituye cada src que apunte al sitio por su data URI. */
async function incrustarImagenesEn($) {
  const nodos = $('img[src^="/"]').toArray();
  for (const nodo of nodos) {
    const $img = $(nodo);
    const src = $img.attr('src');
    const uri = await incrustarImagen(src);
    if (uri) $img.attr('src', uri);
    else $img.remove();
  }
}

async function main() {
  if (!existsSync(ORIGEN)) {
    console.error('Falta demo-hosting/. Ejecuta antes:');
    console.error('  PUBLIC_DEMO=true npx astro build');
    console.error('  node scripts/build-demo.mjs --presentacion --absolutas --salida=demo-hosting');
    process.exit(1);
  }

  const archivos = (await recorrer(ORIGEN)).filter((f) => f.endsWith('.html'));

  // --- 1. Contenido de cada página ---
  const paginas = {};
  for (const archivo of archivos) {
    const ruta = rutaDe(archivo);
    const $ = cheerio.load(await readFile(archivo, 'utf8'));
    await incrustarImagenesEn($);
    paginas[ruta] = {
      titulo: $('title').text(),
      main: $('#main').html() || '',
      // Los CTA flotantes cambian por sede: viajan con la página
      flotante: $.html($('.wa-float')) || '',
      barra: $.html($('.mobile-bar')) || '',
    };
  }

  // --- 2. Armazón a partir de la portada ---
  const $ = cheerio.load(await readFile(path.join(ORIGEN, 'index.html'), 'utf8'));
  await incrustarImagenesEn($);

  // CSS en línea
  for (const nodo of $('link[rel="stylesheet"][href^="/"]').toArray()) {
    const href = $(nodo).attr('href');
    const archivoCss = path.join(ORIGEN, href.replace(/^\//, ''));
    if (existsSync(archivoCss)) {
      $(nodo).replaceWith(`<style>${await readFile(archivoCss, 'utf8')}</style>`);
    } else $(nodo).remove();
  }

  // Los scripts del sitio se sustituyen por el enrutador de este archivo:
  // los suyos se enlazan una sola vez y quedarían obsoletos al cambiar de página.
  $('script[src^="/"]').remove();
  $('script:not([type])').each((_, el) => {
    if (($(el).html() || '').includes('classList.add')) $(el).remove();
  });
  $('script[type="module"]').remove();
  $('link[rel="manifest"], link[rel="sitemap"], link[rel="icon"], link[rel="apple-touch-icon"]').remove();

  // Huecos que rellena el enrutador
  $('#main').empty().append('<!--CONTENIDO-->');
  $('.wa-float').replaceWith('<div id="hueco-flotante"></div>');
  $('.mobile-bar').replaceWith('<div id="hueco-barra"></div>');

  // --- 3. Índice del buscador ---
  let indice = '[]';
  const archivoIndice = path.join(ORIGEN, 'search-index.json');
  if (existsSync(archivoIndice)) indice = await readFile(archivoIndice, 'utf8');

  // --- 4. Datos + enrutador ---
  const json = (valor) => JSON.stringify(valor).replace(/<\/script/gi, '<\\/script');

  const runtime = `
<script id="gemmae-paginas" type="application/json">${json(paginas)}</script>
<script id="gemmae-indice" type="application/json">${indice.replace(/<\/script/gi, '<\\/script')}</script>
<script>
(function () {
  var PAGINAS = JSON.parse(document.getElementById('gemmae-paginas').textContent);
  var INDICE = JSON.parse(document.getElementById('gemmae-indice').textContent);
  var main = document.getElementById('main');
  var huecoFlotante = document.getElementById('hueco-flotante');
  var huecoBarra = document.getElementById('hueco-barra');

  function normaliza(r) {
    if (!r) return '/';
    r = r.split('#')[0].split('?')[0];
    if (!r.startsWith('/')) r = '/' + r;
    if (!r.endsWith('/')) r += '/';
    return r === '//' ? '/' : r;
  }

  // ---- Widgets: se vuelven a enlazar tras cada cambio de página ----
  function activarReveal() {
    var els = main.querySelectorAll('[data-reveal]');
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (e) { e.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    els.forEach(function (e) { io.observe(e); });
  }

  function activarTabs() {
    main.querySelectorAll('[data-location-finder]').forEach(function (raiz) {
      var tabs = [].slice.call(raiz.querySelectorAll('[data-location-tab]'));
      var paneles = [].slice.call(raiz.querySelectorAll('[data-location-panel]'));
      tabs.forEach(function (tab, i) {
        tab.onclick = function () {
          var id = tab.getAttribute('data-location-tab');
          tabs.forEach(function (t) {
            var on = t === tab;
            t.setAttribute('aria-selected', String(on));
            t.tabIndex = on ? 0 : -1;
          });
          paneles.forEach(function (p) {
            p.hidden = p.getAttribute('data-location-panel') !== id;
          });
        };
        tab.onkeydown = function (e) {
          var k = ['ArrowRight', 'ArrowLeft', 'Home', 'End'].indexOf(e.key);
          if (k < 0) return;
          e.preventDefault();
          var n = e.key === 'ArrowRight' ? (i + 1) % tabs.length
                : e.key === 'ArrowLeft' ? (i - 1 + tabs.length) % tabs.length
                : e.key === 'Home' ? 0 : tabs.length - 1;
          tabs[n].focus(); tabs[n].click();
        };
      });
    });
  }

  function activarGuia() {
    main.querySelectorAll('[data-guide]').forEach(function (raiz) {
      var datos = raiz.querySelector('[data-guide-data]');
      var panel = raiz.querySelector('#guide-panel');
      var texto = raiz.querySelector('[data-guide-text]');
      var enlace = raiz.querySelector('[data-guide-service]');
      if (!datos || !panel || !texto) return;
      var items = [];
      try { items = JSON.parse(datos.textContent || '[]'); } catch (e) { return; }
      raiz.querySelectorAll('[data-guide-option]').forEach(function (b) {
        b.onclick = function () {
          var item = items.filter(function (i) { return i.id === b.getAttribute('data-guide-option'); })[0];
          if (!item) return;
          raiz.querySelectorAll('[data-guide-option]').forEach(function (o) {
            o.setAttribute('aria-pressed', String(o === b));
          });
          texto.textContent = item.text;
          panel.hidden = false;
          if (enlace) { enlace.href = '/' + item.service + '/'; enlace.hidden = false; }
          panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        };
      });
    });
  }

  function activarMapas() {
    document.querySelectorAll('[data-map-load]').forEach(function (boton) {
      boton.onclick = function () {
        var src = boton.getAttribute('data-src');
        var cont = boton.closest('[data-map]');
        if (!src || !cont) return;
        var f = document.createElement('iframe');
        f.src = src; f.loading = 'lazy'; f.title = 'Mapa';
        f.referrerPolicy = 'no-referrer-when-downgrade'; f.allowFullscreen = true;
        cont.replaceChildren(f);
      };
    });
  }

  function marcarMenu(ruta) {
    document.querySelectorAll('.nav__link').forEach(function (a) {
      var href = normaliza(a.getAttribute('href'));
      var activo = href !== '/' && (ruta === href || ruta.indexOf(href) === 0);
      if (activo) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
  }

  // ---- Navegación ----
  function ir(ruta, conHistorial) {
    ruta = normaliza(ruta);
    var pagina = PAGINAS[ruta] || PAGINAS['/404/'];
    if (!pagina) return false;
    main.innerHTML = pagina.main;
    huecoFlotante.innerHTML = pagina.flotante || '';
    huecoBarra.innerHTML = pagina.barra || '';
    document.title = pagina.titulo;
    marcarMenu(ruta);
    activarReveal(); activarTabs(); activarGuia(); activarMapas();
    window.scrollTo(0, 0);
    if (conHistorial) history.pushState({ ruta: ruta }, '', '#' + ruta);
    var menu = document.getElementById('mobile-menu');
    if (menu) { menu.hidden = true; document.documentElement.style.overflow = ''; }
    var overlay = document.getElementById('search-overlay');
    if (overlay) overlay.hidden = true;
    return true;
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a') : null;
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (a.target === '_blank' || /^(https?:|tel:|mailto:|#)/.test(href)) return;
    if (!href.startsWith('/')) return;
    if (ir(href, true)) e.preventDefault();
  });

  window.addEventListener('popstate', function () {
    ir((location.hash || '#/').slice(1), false);
  });

  // ---- Menú móvil y submenú de sedes ----
  var abrir = document.querySelector('[data-menu-open]');
  var cerrar = document.querySelector('[data-menu-close]');
  var menu = document.getElementById('mobile-menu');
  if (abrir && menu) {
    abrir.onclick = function () { menu.hidden = false; document.documentElement.style.overflow = 'hidden'; };
  }
  if (cerrar && menu) {
    cerrar.onclick = function () { menu.hidden = true; document.documentElement.style.overflow = ''; };
  }
  document.querySelectorAll('[data-sub-toggle]').forEach(function (t) {
    var sub = t.parentElement && t.parentElement.querySelector('[data-sub]');
    if (!sub) return;
    t.addEventListener('click', function (e) {
      if (window.matchMedia('(hover: none)').matches && !sub.classList.contains('is-open')) {
        e.preventDefault(); e.stopPropagation();
        sub.classList.add('is-open');
      }
    });
  });

  // ---- Encabezado con sombra ----
  var header = document.getElementById('site-header');
  if (header) {
    var alScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 8); };
    alScroll(); window.addEventListener('scroll', alScroll, { passive: true });
  }

  // ---- Buscador ----
  var quitaAcentos = function (s) {
    return s.toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').trim();
  };
  var indice = INDICE.map(function (i) {
    return { t: i.t, d: i.d, u: i.u, g: i.g, k: quitaAcentos(i.t + ' ' + i.d + ' ' + i.k) };
  });
  function buscar(q) {
    q = quitaAcentos(q);
    if (q.length < 2) return [];
    return indice.map(function (i) {
      var t = quitaAcentos(i.t), p = 0;
      if (t === q) p = 100; else if (t.indexOf(q) === 0) p = 80;
      else if (t.indexOf(q) >= 0) p = 60; else if (i.k.indexOf(q) >= 0) p = 30;
      return { i: i, p: p };
    }).filter(function (r) { return r.p > 0; })
      .sort(function (a, b) { return b.p - a.p; })
      .slice(0, 8).map(function (r) { return r.i; });
  }
  document.addEventListener('input', function (e) {
    var input = e.target.closest ? e.target.closest('[data-search-input]') : null;
    if (!input) return;
    var caja = input.closest('[data-search]');
    var res = caja && caja.querySelector('[data-search-results]');
    if (!res) return;
    var encontrados = buscar(input.value);
    if (!input.value.trim() || input.value.trim().length < 2) { res.hidden = true; return; }
    res.hidden = false;
    if (!encontrados.length) {
      res.innerHTML = '<p class="search__empty">Sin resultados.</p>';
      return;
    }
    var grupos = {};
    encontrados.forEach(function (i) { (grupos[i.g] = grupos[i.g] || []).push(i); });
    var html = '';
    Object.keys(grupos).forEach(function (g) {
      html += '<p class="search__group-title">' + g + '</p>';
      grupos[g].forEach(function (i) {
        html += '<a class="search__item" href="' + i.u + '"><span class="search__item-title">' +
                i.t + '</span><span class="search__item-desc">' + i.d + '</span></a>';
      });
    });
    res.innerHTML = html;
  });
  var abreBusqueda = document.querySelector('[data-search-open]');
  var overlay = document.getElementById('search-overlay');
  if (abreBusqueda && overlay) {
    abreBusqueda.addEventListener('click', function (e) {
      e.preventDefault(); overlay.hidden = false;
      var i = overlay.querySelector('input'); if (i) i.focus();
    });
    var cerrarB = overlay.querySelector('[data-search-close]');
    if (cerrarB) cerrarB.onclick = function () { overlay.hidden = true; };
  }

  // ---- Formulario: confirma sin enviar ----
  document.addEventListener('submit', function (e) {
    var f = e.target;
    if (!f.hasAttribute || !f.hasAttribute('data-lead-form')) return;
    e.preventDefault();
    var s = f.querySelector('[data-form-status]');
    if (s) {
      s.hidden = false; s.setAttribute('data-state', 'success');
      s.textContent = 'Gracias, recibimos tu solicitud. Te contactaremos para confirmar tu cita.';
    }
    f.reset();
  }, true);

  // ---- Arranque ----
  var inicial = (location.hash || '').slice(1) || '/';
  ir(inicial, false);
})();
</script>`;

  let html = $.html();
  html = html.replace('<!--CONTENIDO-->', '');
  html = html.replace('</body>', runtime + '</body>');

  await writeFile(SALIDA, html);
  const { size } = await stat(SALIDA);
  console.log(`Archivo único generado: ${SALIDA}`);
  console.log(`  ${Object.keys(paginas).length} páginas · ${cacheImagenes.size} imágenes incrustadas`);
  console.log(`  ${(size / 1024 / 1024).toFixed(1)} MB`);
}

main();
