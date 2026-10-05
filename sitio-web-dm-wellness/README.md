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

No hay build, ni dependencias, ni paso de compilación.
