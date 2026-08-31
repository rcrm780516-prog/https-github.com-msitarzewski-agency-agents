# GEMMAE Ginecólogos — Sitio oficial

Centro digital del ecosistema GEMMAE: sitio estático en Astro, optimizado para
SEO local, conversión a WhatsApp y despliegue en Hostinger sin infraestructura
adicional.

```bash
npm install
cp .env.example .env      # completar (ver CONFIGURATION.md)
npm run dev               # http://localhost:4321
npm run build             # → dist/
npm run audit:seo         # auditoría SEO / CRO / accesibilidad del build
npm run preview           # sirve dist/
```

## Documentación

| Archivo | Contenido |
|---|---|
| [`ARQUITECTURA.md`](./ARQUITECTURA.md) | Análisis, decisiones técnicas y estrategia |
| [`CONFIGURATION.md`](./CONFIGURATION.md) | Variables, IDs, eventos, integraciones |
| [`CONTENT_NEEDED.md`](./CONTENT_NEEDED.md) | Información que falta de GEMMAE |
| [`DEPLOYMENT-HOSTINGER.md`](./DEPLOYMENT-HOSTINGER.md) | Compilar, subir, dominio, SSL, caché |
| [`REDIRECTS.md`](./REDIRECTS.md) | Redirecciones 301 si se reemplaza un sitio |

## Stack

| Capa | Decisión | Por qué |
|---|---|---|
| Framework | **Astro 7 (SSG)** | HTML estático puro: Hostinger lo sirve sin Node. Cero JS por defecto. |
| Estilos | **CSS propio con tokens** | ~28 KB totales. Sin framework de utilidades ni build extra. |
| JS | **TypeScript vanilla** | ~11 KB, casi todo inline. Sin React ni hidratación. |
| Contenido | **Content Collections** (Markdown + JSON) | Editable sin tocar componentes; migrable a CMS. |
| Búsqueda | **Índice JSON estático + cliente** | Instantánea, sin backend ni servicio de pago. |
| Formulario | **PHP nativo** (`public/api/lead.php`) | Hostinger ejecuta PHP; oculta el webhook y valida en servidor. |
| Imágenes | **sharp** en build | WebP/AVIF y responsive sin servicio externo. |

## Estructura

```
src/
├── config/site.ts        Fuente única de verdad: dominio, contacto, IDs
├── content.config.ts     Esquemas (zod) de las colecciones
├── content/
│   ├── servicios/        11 servicios (.md)
│   ├── ubicaciones/      3 sedes (.md)
│   ├── medicos/          3 plantillas (draft: no indexadas)
│   └── blog/             5 artículos (.md)
├── data/                 faqs.json · reviews.json · orientacion.json
├── lib/                  urls · whatsapp · schema (JSON-LD) · content (queries)
├── components/           28 componentes reutilizables
├── layouts/BaseLayout    <head> completo, header, footer, CTAs persistentes
├── pages/                Rutas (estáticas y dinámicas)
├── scripts/              attribution · ui · search · form · guide · tabs
└── styles/               tokens · base · components
public/
├── .htaccess             HTTPS, caché, compresión, CSP, seguridad
├── api/lead.php          Endpoint de leads (webhook n8n / CRM)
└── fonts/                Tipografías autoalojadas (opcional)
scripts/audit.mjs         Auditoría automática del build
```

## Rutas

```
/                                    /servicios/
/ginecologia/                        /medicos/  ·  /medicos/{slug}/
/obstetricia/                        /ubicaciones/
/embarazo/                           /ubicaciones/toluca/
/embarazo-alto-riesgo/               /ubicaciones/metepec/
/fertilidad/                         /ubicaciones/zinacantepec/
/menopausia/                         /blog/  ·  /blog/{slug}/
/ginecologia-adolescente/            /blog/categoria/{categoria}/
/salud-femenina/                     /preguntas-frecuentes/
/colposcopia/                        /contacto/  ·  /gracias/
/vph/                                /buscar/  ·  /404
/ultrasonido/                        /aviso-de-privacidad/  ·  /terminos-y-condiciones/
```

## Estado actual

- **39 páginas** compiladas · **31** indexables en el sitemap
- Auditoría automática: sin errores
- JS: 2.4 KB externos + ~8 KB inline · CSS: 28 KB
- Sin datos inventados: lo pendiente aparece como `[POR CONFIRMAR]`

## Añadir contenido

**Un artículo:** crear `src/content/blog/mi-articulo.md` con el frontmatter que
define `src/content.config.ts`. Entra solo al blog, a su categoría, al sitemap
y al buscador.

**Un servicio:** crear `src/content/servicios/mi-servicio.md`. Genera la página
`/mi-servicio/`, aparece en `/servicios/`, en las sedes que lo declaren y en el
buscador.

**Una sede:** crear `src/content/ubicaciones/mi-sede.md` y añadir su id en los
servicios que la ofrezcan.

**Un médico:** copiar una plantilla de `src/content/medicos/`, completar y
poner `draft: false`.

En los cuatro casos: no se toca ningún componente. El build valida el
frontmatter y falla si falta un campo obligatorio o si el `title` o la
`description` se salen de los límites de longitud recomendados.
