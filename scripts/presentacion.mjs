/**
 * Modo presentación: deja el sitio como si ya estuviera publicado.
 *
 * Principio: NO se inventa ningún dato. Lo que GEMMAE aún no ha confirmado
 * simplemente no se muestra, igual que un sitio recién publicado que todavía
 * no ha cargado cierta información. Un teléfono que no existe no se sustituye
 * por uno falso: se oculta la fila entera.
 *
 * Se aplica sobre el HTML ya construido, para no sembrar condicionales de
 * presentación por todos los componentes del sitio real.
 */
import * as cheerio from 'cheerio';

const MARCA = 'POR CONFIRMAR';

/** Título neutro para las fichas de especialista mientras no haya nombres. */
const TITULO_MEDICO = 'Especialista en Ginecología y Obstetricia';

/** Quita de un texto la frase que contiene el marcador. */
function limpiarTexto(texto) {
  const frases = texto.split(/(?<=[.!?])\s+/);
  const limpias = frases.filter((f) => !f.includes(MARCA));
  return limpias.join(' ').replace(/\s{2,}/g, ' ').trim();
}

/**
 * Unidades que se eliminan completas si contienen el marcador.
 * El orden importa: de lo más específico a lo más general.
 */
const UNIDADES = [
  '.chip--tbc',
  '.byline__block',
  'details.faq__item',
  '.data-list__row',
  '.map-frame',
  'li',
];

export function aplicarPresentacion(html) {
  const $ = cheerio.load(html, null, false);

  // 0. <title> y metas sociales: es lo primero que se ve en la pestaña
  const limpiarMeta = (t) => {
    let out = t.replace(new RegExp(`\\[${MARCA}\\]\\s*`, 'g'), '').trim();
    if (/^Nombre\b/.test(out)) out = `${TITULO_MEDICO} ${out.replace(/^Nombre\s*/, '')}`.trim();
    return out.replace(/\s{2,}/g, ' ');
  };
  $('title').each((_, el) => {
    const $el = $(el);
    if ($el.text().includes(MARCA)) $el.text(limpiarMeta($el.text()));
  });
  $('meta').each((_, el) => {
    const $el = $(el);
    const c = $el.attr('content') || '';
    if (c.includes(MARCA)) $el.attr('content', limpiarMeta(c));
  });

  // 1. Fichas de especialista: sin nombres reales, título neutro.
  //    No es un dato inventado: es la especialidad de la clínica, sin atribuir
  //    identidad, formación ni cédula a ninguna persona.
  $('.doctor-card__meta').remove();
  $('.card__title a, h1').each((_, el) => {
    const $el = $(el);
    if ($el.text().includes(MARCA) && $el.text().includes('especialista')) {
      $el.text(TITULO_MEDICO);
    }
  });
  // Retratos sin la leyenda "Fotografía pendiente"
  $('img[src*="/medico-"]').each((_, el) => {
    const $el = $(el);
    const src = $el.attr('src') || '';
    if (!src.includes('-limpio')) $el.attr('src', src.replace(/\.jpg$/, '-limpio.jpg'));
    const alt = $el.attr('alt') || '';
    if (alt.includes(MARCA) || alt.includes('pendiente')) $el.attr('alt', TITULO_MEDICO);
  });

  // 1b. Etiquetas de estado interno: no van en una presentación
  $('.chip--tbc').remove();

  // 2. Unidades completas que quedan sin sentido sin el dato
  for (const sel of UNIDADES) {
    $(sel).each((_, el) => {
      const $el = $(el);
      if ($el.text().includes(MARCA)) $el.remove();
    });
  }

  // 3. Texto suelto: se retira solo la frase afectada
  $('p, span, h2, h3, dd, td').each((_, el) => {
    const $el = $(el);
    if (!$el.text().includes(MARCA)) return;
    if ($el.children().length === 0) {
      const limpio = limpiarTexto($el.text());
      if (limpio) $el.text(limpio);
      else $el.remove();
      return;
    }
    // Con hijos: se limpian los nodos de texto directos...
    $el.contents().each((_, nodo) => {
      if (nodo.type === 'text' && nodo.data.includes(MARCA)) {
        nodo.data = limpiarTexto(nodo.data);
      }
    });
    // ...y si el marcador vivía dentro de un hijo (p. ej. <strong>), el
    // párrafo entero deja de tener sentido: se elimina.
    if ($el.text().includes(MARCA) || !$el.text().trim()) $el.remove();
  });

  // 4. Secciones que se quedaron vacías tras la limpieza
  $('.data-list, .chip-row, ul').each((_, el) => {
    const $el = $(el);
    if ($el.children().length === 0) $el.remove();
  });

  // Una tarjeta que se quedó solo con su título no debe mostrarse vacía.
  // Si conserva algo accionable (un botón, un enlace), se mantiene con su título.
  $('.guide-widget').each((_, el) => {
    const $el = $(el);
    if ($el.find('p, li, a, button, img, form, input, .btn').length === 0) $el.remove();
  });
  $('.faq').each((_, el) => {
    const $el = $(el);
    if ($el.children().length === 0) {
      $el.closest('section').remove();
    }
  });

  // 4b. "Datos de contacto" que se quedó solo con las zonas de cobertura:
  //     el encabezado ya no describe lo que hay debajo.
  $('h2').each((_, el) => {
    const $el = $(el);
    if ($el.text().trim() !== 'Datos de contacto') return;
    const $lista = $el.nextAll('.data-list').first();
    const etiquetas = $lista.find('.data-list__label').map((_, l) => $(l).text()).get();
    const tieneContacto = etiquetas.some((t) => /Dirección|Teléfono|Horario/.test(t));
    if (!tieneContacto) {
      if (etiquetas.length) $el.text('Ubicación y contacto');
      else { $lista.remove(); $el.remove(); }
    }
  });

  // 5. Bloques de aviso que hablan del estado del proyecto, no de la clínica
  $('.disclaimer').each((_, el) => {
    const $el = $(el);
    const t = $el.text();
    if (t.includes('Componente listo') || t.includes('Perfil en preparación') || t.includes('pendiente de redacción')) {
      $el.remove();
    }
  });
  $('.guide-widget').each((_, el) => {
    const $el = $(el);
    if ($el.text().includes('Perfiles en preparación')) $el.remove();
  });
  // El bloque de reseñas vacío no aporta nada en una presentación
  $('section').each((_, el) => {
    const $el = $(el);
    if ($el.text().includes('Carga las reseñas') || $el.text().includes('reseñas reales y testimonios autorizados')) {
      $el.remove();
    }
  });

  // 6. Avisos de "modo demo" en el formulario
  $('p').each((_, el) => {
    const $el = $(el);
    if ($el.text().includes('Tiempo de respuesta')) {
      const limpio = $el.text().replace(/Tiempo de respuesta:.*$/, '').trim();
      if (limpio) $el.text(limpio);
      else $el.remove();
    }
  });

  // 6b. Encabezados que se quedaron sin nada debajo: se mira hasta el
  //     siguiente encabezado del mismo nivel o superior.
  $('h2, h3').each((_, el) => {
    const $el = $(el);
    const $sig = $el.next();
    // Lo que sigue a un encabezado debe ser su contenido. Si no hay nada, o si
    // es otro encabezado o un aviso que no le pertenece, quedó huérfano.
    const huerfano =
      $sig.length === 0 ||
      $sig.is('h2, h3, aside, .disclaimer') ||
      $sig.text().trim() === '';
    if (huerfano) $el.remove();
  });

  // 7. Secciones que quedaron sin contenido tras la limpieza (p. ej. reseñas):
  //    un encabezado suelto delata que falta algo.
  $('section').each((_, el) => {
    const $el = $(el);
    const tieneContenido =
      $el.find('p, li, img, details, .card, .btn, form, iframe, .timeline, input').length > 0;
    if (!tieneContenido) $el.remove();
  });

  return $.html();
}

/** Comprueba que no quedó ningún marcador visible. */
export function quedanMarcadores(html) {
  const $ = cheerio.load(html);
  $('script, style').remove();
  return $.text().includes(MARCA);
}
