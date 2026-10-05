# Sitio web · DM Wellness Beauty and Nutrition

Sitio de una sola página, sin dependencias ni build. Todo vive en `index.html`:
HTML, CSS y JavaScript en un solo archivo de ~46 KB. Se sube a cualquier hosting
y funciona.

## Arquitectura de contenido

La estructura sale directamente de la auditoría: **la gente busca por problema, no
por aparato**. Por eso el héroe abre con un selector de motivos de consulta
—papada, flacidez, manchas, líneas de expresión, volumen, peso, tensión— y cada
uno revela el tratamiento, las sesiones y la recuperación, con un enlace a
WhatsApp que ya lleva el mensaje escrito.

Las tres líneas de negocio tienen color propio para que se distingan de un vistazo:
orquídea (estética), verde (nutrición), arcilla (spa).

## Datos de contacto cableados

| Dato | Valor |
|---|---|
| WhatsApp | +52 55 3496 0420 → `wa.me/525534960420` |
| Dirección | Calle Doctor Vértiz 995, Narvarte Oriente, Benito Juárez, CDMX, 03023 |
| Instagram | [@dmwellness.mx](https://www.instagram.com/dmwellness.mx/) |
| Facebook | [facebook.com/dminbc](https://www.facebook.com/dminbc) |
| COFEPRIS | 2409145036X00027 |

El botón flotante de WhatsApp aparece en toda la página y en móvil se reduce a un
círculo. Cada CTA manda un mensaje distinto, así que al llegar ya se sabe de qué
sección vino la persona.


## Archivos del proyecto

| Archivo | Qué es | ¿Obligatorio? |
|---|---|---|
| `index.html` | El sitio completo: HTML, CSS y JS en un archivo | Sí |
| `aviso-de-privacidad.html` | Aviso de privacidad (plantilla LFPDPPP) | Sí, por ley |
| `404.html` | Página de error con rutas de regreso | Sí |
| `robots.txt` | Indica a los buscadores qué rastrear | Sí |
| `sitemap.xml` | Mapa del sitio para Google Search Console | Sí |
| `favicon.svg` | Icono vectorial (navegadores modernos) | Sí |
| `favicon.ico` | Icono de respaldo (navegadores antiguos) | Sí |
| `apple-touch-icon.png` | Icono 180×180 para iOS | Recomendado |
| `icon-192.png` · `icon-512.png` | Iconos para Android e instalación | Recomendado |
| `icon-512-maskable.png` | Icono adaptable de Android | Recomendado |
| `site.webmanifest` | Permite instalar el sitio como app | Recomendado |
| `og-image.png` | Imagen 1200×630 al compartir en redes | Sí |
| `.htaccess` | Config. Apache: HTTPS, caché, seguridad | Solo cPanel/Apache |
| `_headers` · `_redirects` | Equivalente para Netlify y Cloudflare Pages | Solo esos hosts |

Todo pesa junto menos de 300 KB. No hay build, ni `node_modules`, ni dependencias.

### Qué archivo de configuración usar

Depende del hosting. **Sube solo el que corresponda** y borra los otros:

- **cPanel, hosting compartido, servidor propio con Apache** → `.htaccess`
- **Netlify, Cloudflare Pages** → `_headers` y `_redirects`
- **Vercel** → ninguno de los dos; se configura con `vercel.json`
- **GitHub Pages** → ninguno; no admite encabezados personalizados

### Cómo subirlo

Arrastra el contenido de la carpeta a la raíz pública del hosting
(`public_html/`, `www/` o equivalente). No va en una subcarpeta: los enlaces
internos usan rutas absolutas (`/favicon.svg`, `/aviso-de-privacidad.html`).

### Después de publicar

1. **Buscar y reemplazar `dmwellness.mx`** por el dominio real en `index.html`,
   `sitemap.xml`, `robots.txt` y `aviso-de-privacidad.html`.
2. **Dar de alta el sitio en Google Search Console** y enviar el sitemap.
3. **Completar el aviso de privacidad** y pasarlo por revisión legal.
4. Verificar con [PageSpeed Insights](https://pagespeed.web.dev/) y el
   [Test de Resultados Enriquecidos](https://search.google.com/test/rich-results)
   de Google, que valida el marcado `MedicalClinic`.

## Pendientes antes de publicar

1. **Horario real.** Está puesto Lun–Vie 10:00–19:00 y Sáb 10:00–15:00 como
   supuesto. Corregir en dos lugares: la sección `#ubicacion` y el bloque JSON-LD
   del `<head>`.
2. **Nombre y cédula del médico responsable.** Añadir en la sección «Por qué DM
   Wellness» y en el pie. Es de los argumentos que más convierten en este sector.
3. **Logotipo real.** El monograma es un SVG provisional. Sustituir en las dos
   apariciones de `class="mark"` (encabezado y pie) por el archivo de marca.
4. **Fotografías.** El sitio funciona sin ellas, pero conviene la sesión que ya
   recomendaba la auditoría: fachada, recepción, cada cabina, cada equipo y el
   personal con bata.
5. **Dominio.** Reemplazar `https://dmwellness.mx/` en `<link rel="canonical">`,
   en las etiquetas Open Graph y en el JSON-LD.

## Integraciones que se activan al desplegar

Las tres necesitan un dominio real; en la vista previa no cargan.

### Mapa de Google

Sustituir el bloque `.map` de la sección `#ubicacion` por:

```html
<iframe
  src="https://www.google.com/maps/embed/v1/place?key=TU_API_KEY&q=Calle+Doctor+Vertiz+995,Narvarte+Oriente,CDMX"
  width="100%" height="320" style="border:0;border-radius:10px"
  loading="lazy" referrerpolicy="no-referrer-when-downgrade"
  title="Ubicación de DM Wellness"></iframe>
```

### Plugin de página de Facebook

Va dentro de `#fb-widget`, sustituyendo el párrafo descriptivo. No requiere token:

```html
<div id="fb-root"></div>
<script async defer crossorigin="anonymous"
  src="https://connect.facebook.net/es_LA/sdk.js#xfbml=1&version=v21.0"></script>
<div class="fb-page" data-href="https://www.facebook.com/dminbc"
     data-tabs="timeline" data-width="400" data-height="420"
     data-small-header="false" data-adapt-container-width="true"
     data-hide-cover="false" data-show-facepile="true"></div>
```

### Feed de Instagram

Las seis miniaturas de `.ig-grid` son marcadores. Instagram ya no permite
incrustar un feed sin token, así que hay dos caminos:

- **Servicio de terceros** (Behold, SnapWidget, Elfsight): pegan un script y
  resuelven el token. Es lo más rápido.
- **Instagram Basic Display API**: token propio, sin costo mensual, pero hay que
  renovarlo cada 60 días.

En ambos casos el contenedor a reemplazar es `<div class="ig-grid">`. El contador
de seguidores (6,800) y de publicaciones (181) está escrito a mano en
`#ig-widget`; actualizarlo cuando se revise el sitio.

## SEO ya incluido

- **JSON-LD `MedicalClinic`** con NAP completo, horarios, servicios y perfiles
  sociales. Es lo que permite a Google entender el negocio.
- **Meta description, canonical, Open Graph** y etiquetas geográficas de CDMX.
- **Vocabulario orientado a búsqueda**: el texto usa «papada», «flacidez»,
  «manchas», «limpieza facial profunda» y «Narvarte» en lugar de los nombres
  comerciales de los equipos. Esa decisión viene del análisis de demanda.

> El sitio **no sustituye la ficha de Google Business Profile**. Siguen siendo
> dos activos distintos y la ficha es la que desbloquea el mapa, las reseñas y
> las búsquedas «cerca de mí».

## Cumplimiento

Incluido en el pie y en las secciones de tratamiento: aviso COFEPRIS visible,
«los resultados varían según cada paciente» y «todo procedimiento requiere
valoración médica previa». No hay imágenes de antes y después ni promesas de
resultado garantizado, en línea con las políticas de publicidad de Meta y con el
criterio sanitario.

Falta añadir el **aviso de privacidad** (obligatorio por la LFPDPPP si se
capturan datos) cuando se agregue cualquier formulario.

## Desarrollo

```bash
python3 -m http.server 8000   # y abrir http://localhost:8000
```

No hay build, ni dependencias, ni paso de compilación. Para regenerar los
iconos y la imagen de redes a partir del SVG basta con cualquier conversor;
los que vienen incluidos se generaron desde `favicon.svg`.
