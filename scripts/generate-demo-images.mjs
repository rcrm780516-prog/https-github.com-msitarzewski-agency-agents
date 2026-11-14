#!/usr/bin/env node
/**
 * Genera la imaginería editorial del sitio: composiciones botánicas abstractas
 * construidas con los mismos tokens de color del design system.
 *
 * Por qué arte original y no fotografía de stock:
 * - No se puede presentar una foto de archivo como si fueran las instalaciones
 *   o el equipo de GEMMAE (regla 69 del brief: no inventar).
 * - El stock genérico de "doctora sonriendo" resta credibilidad en salud.
 * - Esto es 100% original, sin licencias, y se regenera a cualquier resolución.
 *
 * Cuando GEMMAE entregue fotografía real, se sustituyen los archivos de
 * public/images/demo/ por las fotos y no hay que tocar ningún componente.
 *
 * Uso: node scripts/generate-demo-images.mjs
 */
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const OUT = path.resolve('public/images/demo');

/** Paleta: los mismos valores que src/styles/tokens.css */
const C = {
  sand50: '#FDFCFA',
  sand100: '#F8F5F0',
  sand200: '#F1ECE4',
  sand300: '#E5DDD1',
  sand400: '#D3C8B8',
  brand50: '#F2F6F3',
  brand100: '#E3EDE6',
  brand200: '#C9DACF',
  brand300: '#A6C1B0',
  brand500: '#5F8871',
  brand600: '#3F6350',
  brand700: '#33513F',
  brand900: '#1F3228',
  teal100: '#E2EDED',
  teal600: '#2F5D5D',
  clay: '#D9C3B0',
  blush: '#E8D5CE',
};

/** Grano de papel: evita que los degradados se vean plásticos. */
const grain = (opacity = 0.055) => `
  <filter id="grain">
    <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" seed="7" result="n"/>
    <feColorMatrix type="saturate" values="0" in="n" result="g"/>
    <feComponentTransfer in="g" result="g2">
      <feFuncA type="linear" slope="${opacity}"/>
    </feComponentTransfer>
    <feComposite operator="over" in="g2" in2="SourceGraphic"/>
  </filter>`;

const softBlur = (id, dev) => `<filter id="${id}"><feGaussianBlur stdDeviation="${dev}"/></filter>`;

/**
 * Rama de eucalipto: tallo bezier con hojas elípticas alternadas.
 * Devuelve un <g> que se puede rotar y posicionar.
 */
function branch({ x, y, length, rot = 0, scale = 1, color, leaf, opacity = 1, leaves = 9 }) {
  const stem = `M 0 0 C ${length * 0.22} ${-length * 0.1}, ${length * 0.55} ${-length * 0.16}, ${length} ${-length * 0.08}`;
  let out = `<path d="${stem}" fill="none" stroke="${color}" stroke-width="${2.2 / scale}" stroke-linecap="round" opacity="0.75"/>`;
  for (let i = 1; i <= leaves; i++) {
    const t = i / (leaves + 1);
    // Punto sobre la curva (aprox. cúbica de Bézier)
    const px = 3 * (1 - t) ** 2 * t * (length * 0.22) + 3 * (1 - t) * t ** 2 * (length * 0.55) + t ** 3 * length;
    const py = 3 * (1 - t) ** 2 * t * (-length * 0.1) + 3 * (1 - t) * t ** 2 * (-length * 0.16) + t ** 3 * (-length * 0.08);
    const rx = length * 0.085 * (1 - t * 0.35);
    const ry = length * 0.052 * (1 - t * 0.35);
    const up = i % 2 === 0;
    const ang = up ? -46 : 42;
    const off = up ? -ry * 1.5 : ry * 1.5;
    out += `<ellipse cx="${px}" cy="${py + off}" rx="${rx}" ry="${ry}" fill="${leaf}" opacity="${up ? 0.92 : 0.78}" transform="rotate(${ang} ${px} ${py + off})"/>`;
  }
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${scale})" opacity="${opacity}">${out}</g>`;
}

/** Arco editorial: el "portal" que estructura la composición del hero. */
function arch({ x, y, w, h, fill, opacity = 1, stroke = null, strokeWidth = 1.6 }) {
  const r = w / 2;
  const d = `M ${x} ${y + h} L ${x} ${y + r} A ${r} ${r} 0 0 1 ${x + w} ${y + r} L ${x + w} ${y + h} Z`;
  const strokeAttrs = stroke ? ` stroke="${stroke}" stroke-width="${strokeWidth}"` : '';
  return `<path d="${d}" fill="${fill}"${strokeAttrs} opacity="${opacity}"/>`;
}

/* ------------------------------------------------------------------ */
/* Composiciones                                                       */
/* ------------------------------------------------------------------ */

/** Hero vertical 4:5 — arco, rama principal y campos de color suaves. */
function heroSvg(w = 1440, h = 1800) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="0.4" y2="1">
        <stop offset="0%" stop-color="${C.sand100}"/>
        <stop offset="55%" stop-color="${C.brand50}"/>
        <stop offset="100%" stop-color="${C.sand200}"/>
      </linearGradient>
      <linearGradient id="archg" x1="0" y1="0" x2="0.3" y2="1">
        <stop offset="0%" stop-color="${C.brand100}"/>
        <stop offset="100%" stop-color="${C.sand100}"/>
      </linearGradient>
      <radialGradient id="glow" cx="0.72" cy="0.18" r="0.6">
        <stop offset="0%" stop-color="${C.brand200}" stop-opacity="0.85"/>
        <stop offset="100%" stop-color="${C.brand200}" stop-opacity="0"/>
      </radialGradient>
      ${softBlur('b1', 60)}
      ${grain(0.05)}
    </defs>
    <g filter="url(#grain)">
      <rect width="${w}" height="${h}" fill="url(#bg)"/>
      <rect width="${w}" height="${h}" fill="url(#glow)"/>
      <circle cx="${w * 0.2}" cy="${h * 0.86}" r="${w * 0.38}" fill="${C.blush}" opacity="0.3" filter="url(#b1)"/>
      ${arch({ x: w * 0.16, y: h * 0.14, w: w * 0.68, h: h * 0.72, fill: 'url(#archg)' })}
      <!-- línea fina que acompaña el arco -->
      ${arch({ x: w * 0.16 + 26, y: h * 0.14 + 26, w: w * 0.68 - 52, h: h * 0.72 - 26, fill: 'none', stroke: C.brand300, opacity: 0.55 })}
      ${branch({ x: w * 0.3, y: h * 0.62, length: w * 0.52, rot: -24, scale: 1, color: C.brand500, leaf: C.brand300, leaves: 11 })}
      ${branch({ x: w * 0.26, y: h * 0.72, length: w * 0.36, rot: -6, scale: 0.9, color: C.brand500, leaf: C.brand200, opacity: 0.85, leaves: 8 })}
      ${branch({ x: w * 0.62, y: h * 0.8, length: w * 0.3, rot: -58, scale: 0.8, color: C.brand600, leaf: C.brand300, opacity: 0.7, leaves: 7 })}
      <circle cx="${w * 0.78}" cy="${h * 0.26}" r="${w * 0.055}" fill="${C.clay}" opacity="0.5"/>
    </g>
  </svg>`;
}

/**
 * Composición horizontal reutilizable. `variant` cambia la estructura para que
 * cada sede y cada artículo tengan una imagen distinta, no la misma repetida.
 */
function sceneSvg({ w = 1600, h = 1067, variant = 0, accent = C.brand300, base = C.sand100, accent2 = C.clay }) {
  const layouts = [
    // 0 — arco a la derecha, ramas cruzando por la izquierda
    `${arch({ x: w * 0.56, y: h * 0.12, w: w * 0.34, h: h * 0.82, fill: 'url(#g2)' })}
     ${branch({ x: w * 0.06, y: h * 0.62, length: w * 0.42, rot: -16, color: C.brand500, leaf: accent, leaves: 10 })}
     ${branch({ x: w * 0.1, y: h * 0.78, length: w * 0.28, rot: -4, scale: 0.85, color: C.brand500, leaf: accent, opacity: 0.8, leaves: 7 })}
     <circle cx="${w * 0.24}" cy="${h * 0.24}" r="${h * 0.1}" fill="${accent2}" opacity="0.42"/>`,
    // 1 — bandas horizontales con rama superior
    `<rect x="0" y="${h * 0.58}" width="${w}" height="${h * 0.42}" fill="${accent}" opacity="0.26"/>
     <rect x="0" y="${h * 0.72}" width="${w}" height="${h * 0.28}" fill="${accent}" opacity="0.3"/>
     ${branch({ x: w * 0.12, y: h * 0.44, length: w * 0.46, rot: -10, color: C.brand600, leaf: accent, leaves: 11 })}
     <circle cx="${w * 0.8}" cy="${h * 0.3}" r="${h * 0.14}" fill="${accent2}" opacity="0.4"/>`,
    // 2 — círculo grande centrado, ramas en abanico
    `<circle cx="${w * 0.5}" cy="${h * 0.52}" r="${h * 0.38}" fill="url(#g2)"/>
     <circle cx="${w * 0.5}" cy="${h * 0.52}" r="${h * 0.38}" fill="none" stroke="${C.brand300}" stroke-width="1.6" opacity="0.6"/>
     ${branch({ x: w * 0.3, y: h * 0.66, length: w * 0.3, rot: -28, scale: 0.9, color: C.brand500, leaf: accent, leaves: 9 })}
     ${branch({ x: w * 0.52, y: h * 0.72, length: w * 0.26, rot: -52, scale: 0.8, color: C.brand600, leaf: accent, opacity: 0.8, leaves: 8 })}`,
    // 3 — diagonal con dos campos de color
    `<path d="M 0 ${h} L ${w * 0.72} 0 L ${w} 0 L ${w} ${h} Z" fill="${accent}" opacity="0.3"/>
     <path d="M ${w * 0.86} 0 L ${w} 0 L ${w} ${h} L ${w * 0.6} ${h} Z" fill="${accent2}" opacity="0.26"/>
     ${branch({ x: w * 0.08, y: h * 0.56, length: w * 0.38, rot: -18, color: C.brand500, leaf: accent, leaves: 10 })}`,
    // 4 — tres arcos pequeños, ritmo editorial
    `${arch({ x: w * 0.1, y: h * 0.24, w: w * 0.2, h: h * 0.64, fill: 'url(#g2)' })}
     ${arch({ x: w * 0.38, y: h * 0.16, w: w * 0.22, h: h * 0.72, fill: accent, opacity: 0.4 })}
     ${arch({ x: w * 0.68, y: h * 0.3, w: w * 0.18, h: h * 0.58, fill: accent2, opacity: 0.36 })}
     ${branch({ x: w * 0.16, y: h * 0.84, length: w * 0.3, rot: -8, scale: 0.8, color: C.brand600, leaf: accent, leaves: 8 })}`,
    // 5 — rama protagonista sobre fondo liso
    `<rect x="${w * 0.06}" y="${h * 0.08}" width="${w * 0.88}" height="${h * 0.84}" fill="none" stroke="${C.brand300}" stroke-width="1.6" opacity="0.5"/>
     ${branch({ x: w * 0.14, y: h * 0.58, length: w * 0.56, rot: -12, color: C.brand500, leaf: accent, leaves: 13 })}
     ${branch({ x: w * 0.2, y: h * 0.76, length: w * 0.34, rot: 2, scale: 0.85, color: C.brand600, leaf: accent, opacity: 0.75, leaves: 9 })}`,
  ];

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <defs>
      <linearGradient id="bg2" x1="0" y1="0" x2="0.6" y2="1">
        <stop offset="0%" stop-color="${base}"/>
        <stop offset="100%" stop-color="${C.sand200}"/>
      </linearGradient>
      <linearGradient id="g2" x1="0" y1="0" x2="0.4" y2="1">
        <stop offset="0%" stop-color="${C.brand100}"/>
        <stop offset="100%" stop-color="${C.sand50}"/>
      </linearGradient>
      ${softBlur('b2', 40)}
      ${grain(0.045)}
    </defs>
    <g filter="url(#grain)">
      <rect width="${w}" height="${h}" fill="url(#bg2)"/>
      <circle cx="${w * 0.84}" cy="${h * 0.12}" r="${h * 0.3}" fill="${C.brand100}" opacity="0.6" filter="url(#b2)"/>
      ${layouts[variant % layouts.length]}
    </g>
  </svg>`;
}

/** Marco de retrato: deja claro que la fotografía del médico está pendiente. */
function portraitSvg({ w = 800, h = 1000, caption = 'Fotografía pendiente' }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <defs>
      <linearGradient id="pg" x1="0" y1="0" x2="0.4" y2="1">
        <stop offset="0%" stop-color="${C.brand100}"/>
        <stop offset="100%" stop-color="${C.sand200}"/>
      </linearGradient>
      ${grain(0.05)}
    </defs>
    <g filter="url(#grain)">
      <rect width="${w}" height="${h}" fill="url(#pg)"/>
      ${arch({ x: w * 0.18, y: h * 0.16, w: w * 0.64, h: h * 0.7, fill: C.sand50, opacity: 0.75 })}
      <circle cx="${w * 0.5}" cy="${h * 0.42}" r="${w * 0.14}" fill="${C.brand200}" opacity="0.75"/>
      <path d="M ${w * 0.26} ${h * 0.84} C ${w * 0.3} ${h * 0.62}, ${w * 0.7} ${h * 0.62}, ${w * 0.74} ${h * 0.84} Z" fill="${C.brand200}" opacity="0.75"/>
      ${branch({ x: w * 0.1, y: h * 0.92, length: w * 0.34, rot: -14, scale: 0.7, color: C.brand500, leaf: C.brand300, opacity: 0.8, leaves: 7 })}
      ${caption ? `<text x="${w * 0.5}" y="${h * 0.95}" text-anchor="middle" font-family="Georgia, serif" font-size="${w * 0.045}" fill="${C.brand600}" opacity="0.8">${caption}</text>` : ''}
    </g>
  </svg>`;
}

/* ------------------------------------------------------------------ */

const jobs = [
  { file: 'hero.jpg', svg: heroSvg(1440, 1800) },
  { file: 'sede-toluca.jpg', svg: sceneSvg({ variant: 0, accent: C.brand300, accent2: C.clay }) },
  { file: 'sede-metepec.jpg', svg: sceneSvg({ variant: 4, accent: C.brand200, accent2: C.blush }) },
  { file: 'sede-zinacantepec.jpg', svg: sceneSvg({ variant: 2, accent: C.brand300, accent2: C.teal100 }) },
  { file: 'confianza.jpg', svg: sceneSvg({ w: 1920, h: 1080, variant: 5, accent: C.brand300, accent2: C.clay }) },
  { file: 'embarazo.jpg', svg: sceneSvg({ variant: 1, accent: C.blush, accent2: C.brand200 }) },
  { file: 'blog-vph.jpg', svg: sceneSvg({ variant: 3, accent: C.teal100, accent2: C.brand300 }) },
  { file: 'blog-embarazo.jpg', svg: sceneSvg({ variant: 1, accent: C.blush, accent2: C.brand300 }) },
  { file: 'blog-menopausia.jpg', svg: sceneSvg({ variant: 4, accent: C.clay, accent2: C.brand200 }) },
  { file: 'blog-ginecologia.jpg', svg: sceneSvg({ variant: 5, accent: C.brand300, accent2: C.blush }) },
  { file: 'blog-prevencion.jpg', svg: sceneSvg({ variant: 2, accent: C.brand200, accent2: C.teal100 }) },
  { file: 'medico-01.jpg', svg: portraitSvg({}) },
  { file: 'medico-02.jpg', svg: portraitSvg({}) },
  { file: 'medico-03.jpg', svg: portraitSvg({}) },
  // Variantes sin leyenda, para el modo presentación
  { file: 'medico-01-limpio.jpg', svg: portraitSvg({ caption: '' }) },
  { file: 'medico-02-limpio.jpg', svg: portraitSvg({ caption: '' }) },
  { file: 'medico-03-limpio.jpg', svg: portraitSvg({ caption: '' }) },
];

await mkdir(OUT, { recursive: true });

for (const job of jobs) {
  await sharp(Buffer.from(job.svg))
    .jpeg({ quality: 86, mozjpeg: true, chromaSubsampling: '4:4:4' })
    .toFile(path.join(OUT, job.file));
}

console.log(`${jobs.length} imágenes generadas en ${OUT}`);
