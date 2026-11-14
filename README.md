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

npm run demo:images       # regenera la imaginería editorial (public/images/demo/)
npm run demo              # demo/ navegable sin servidor, con barra de vista previa
npm run presentacion      # demo-presentacion/ como si ya estuviera publicado
npm run presentacion:hosting  # demo-hosting/ para subir a un subdominio
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

## Demo para cliente

`npm run demo` compila el sitio con `PUBLIC_DEMO=true` y lo empaqueta en `demo/`,
una carpeta que se abre con doble clic en `index.html` — sin servidor, sin
internet. Se usa para presentar el sitio antes de tener dominio.

Qué cambia el modo demo, y **solo** el modo demo:

| | Producción | Demo |
|---|---|---|
| Huecos de imagen | marcador `[POR CONFIRMAR]` | imaginería editorial de `public/images/demo/` |
| Perfiles médicos en borrador | ocultos | visibles, etiquetados "perfil por completar" |
| Enlaces | absolutos (`/ginecologia/`) | relativos (`../ginecologia/index.html`) |
| Formulario | envía al endpoint | confirma sin enviar |
| Aviso de vista previa | no | barra superior |

### Modo presentación

`npm run presentacion` va un paso más allá: deja el sitio como si ya estuviera
publicado. Retira la barra de vista previa y **oculta** todo campo sin dato
confirmado en lugar de imprimir el marcador — un teléfono que no existe no se
sustituye por uno falso, se quita la fila entera. Lo aplica
`scripts/presentacion.mjs` sobre el HTML ya construido, para no sembrar
condicionales de presentación por los componentes del sitio real.

El script verifica al final que no quede ningún marcador visible y avisa si
alguno sobrevivió. Las páginas llevan `noindex`: es una vista previa en un
dominio provisional y no debe competir con el sitio definitivo en Google.

Las fichas de especialista se titulan "Especialista en Ginecología y
Obstetricia" mientras no haya nombres reales: es la especialidad de la clínica,
no una identidad inventada.

El build de producción (`npm run build`, sin la bandera) no contiene ninguna
referencia a `/images/demo/` ni `noindex`: se verifica con `npm run audit:seo`.

Cuando GEMMAE entregue fotografía real, se sustituyen los archivos de
`public/images/demo/` y no hay que tocar ningún componente.

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
