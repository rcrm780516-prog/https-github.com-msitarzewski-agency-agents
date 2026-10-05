# Sitio web · DM Wellness Beauty and Nutrition

Cuatro archivos. Sin build, sin dependencias, sin carpetas. Se arrastran a
Hostinger y el sitio funciona.

| Archivo | Qué es | Peso |
|---|---|---|
| `index.html` | Todo el sitio: HTML, CSS, JavaScript, las dos imágenes del encabezado y el favicon, incrustados | 93 KB |
| `robots.txt` | Indica a Google qué rastrear y dónde está el sitemap | 1 KB |
| `sitemap.xml` | Mapa del sitio para Search Console | 1 KB |
| `README.md` | Este documento. No se sube | — |

Las imágenes van incrustadas como `data:` dentro del CSS, así que no hay que
subir ningún archivo de imagen ni preocuparse por rutas rotas.

---

## Cómo subirlo a Hostinger

1. Entra a **hPanel → Archivos → Administrador de archivos**.
2. Abre la carpeta **`public_html`**. Si trae un `index.html` o `default.php`
   de ejemplo, bórralo.
3. Sube **`index.html`**, **`robots.txt`** y **`sitemap.xml`** ahí dentro.
   No en una subcarpeta: los enlaces internos usan rutas absolutas.
4. En **hPanel → Rendimiento → SSL**, activa el certificado y enciende
   **«Forzar HTTPS»**.
5. En **hPanel → Rendimiento → Caché**, deja la caché activada.

Listo. Con eso el sitio ya está en línea.

### Antes de dar por terminado

Busca y reemplaza **`dmwellness.mx`** por tu dominio real. Aparece en:

- `index.html` → etiqueta `canonical`, las etiquetas Open Graph y los dos
  bloques de datos estructurados
- `robots.txt` → la línea `Sitemap:`
- `sitemap.xml` → la etiqueta `<loc>`

---

## Opcional: `.htaccess`

Hostinger ya fuerza HTTPS desde el panel, así que esto no es obligatorio. Si
quieres encabezados de seguridad y caché más agresiva, crea un archivo llamado
`.htaccess` en `public_html` con esto:

```apache
Options -Indexes
DirectoryIndex index.html

<IfModule mod_headers.c>
  Header always set X-Content-Type-Options "nosniff"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set X-Frame-Options "SAMEORIGIN"
  Header always set Permissions-Policy "geolocation=(), microphone=(), camera=(), payment=()"
</IfModule>

<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css text/xml application/javascript
</IfModule>

<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/html "access plus 0 seconds"
  ExpiresByType image/webp "access plus 1 year"
</IfModule>
```

---

## Qué falta completar en `index.html`

| # | Qué | Dónde |
|---|---|---|
| 1 | **Horario real** — ahora dice Lun–Vie 10:00–19:00 y Sáb 10:00–15:00 como supuesto | Sección «Ubicación» y el bloque `openingHoursSpecification` del `<head>` |
| 2 | **Nombre y cédula del médico** — es de los argumentos que más convierten | Sección «Por qué DM Wellness» y el pie |
| 3 | **Razón social y correo de contacto** | Aviso de privacidad, campos entre corchetes |
| 4 | **Logotipo real** — el monograma es un SVG provisional | Las dos apariciones de `class="mark"` |
| 5 | **Revisión legal** del aviso de privacidad | Antes de publicar |

---

## Arquitectura del contenido

El encabezado no abre con un catálogo de servicios sino con un **selector de
problemas**: papada, flacidez, manchas, líneas de expresión, volumen, peso y
tensión. Eliges lo que te molesta y aparece el tratamiento, las sesiones, la
recuperación y un botón a WhatsApp con el mensaje ya escrito.

Esa decisión viene del análisis de demanda: la gente busca **el problema**, no
el nombre del aparato. «Papada» tiene mucho más mercado que «Endolift», aunque
sea el mismo tratamiento. Por eso el texto de todo el sitio usa el vocabulario
de búsqueda y deja los nombres de los equipos para la sección de aparatología,
donde sí suman como prueba.

Las tres líneas de negocio tienen color propio para distinguirse de un vistazo:
orquídea para estética, verde para nutrición, arcilla para spa.

---

## Datos cableados

| Dato | Valor |
|---|---|
| WhatsApp | +52 55 3496 0420 → `wa.me/525534960420` |
| Dirección | Calle Doctor Vértiz 995, Narvarte Oriente, Benito Juárez, CDMX, 03023 |
| Instagram | [@dmwellness.mx](https://www.instagram.com/dmwellness.mx/) |
| Facebook | [facebook.com/dminbc](https://www.facebook.com/dminbc) |
| COFEPRIS | 2409145036X00027 |

El botón flotante de WhatsApp aparece en toda la página y en móvil se reduce a
un círculo. Cada llamado a la acción manda un mensaje distinto, así que al
llegar la conversación ya se sabe de qué sección vino la persona.

---

## SEO incluido

- **Datos estructurados `MedicalClinic`**: dirección completa, teléfono,
  coordenadas, horarios, servicios, colonias atendidas y perfiles sociales.
- **Datos estructurados `FAQPage`** con las siete preguntas visibles en la
  página. Puede hacer que el resultado se expanda en Google.
- Meta description, canonical, Open Graph, Twitter Card y etiquetas geográficas.
- Un solo `<h1>`, jerarquía limpia de encabezados, HTML semántico.
- Vocabulario orientado a búsqueda: «papada», «flacidez», «manchas», «limpieza
  facial profunda», «Narvarte».

**Validar después de publicar** con el
[Test de Resultados Enriquecidos](https://search.google.com/test/rich-results):
debe detectar `MedicalClinic` **y** `FAQPage`.

**No se incluye `AggregateRating`.** Marcar calificaciones que no existen viola
las directrices de Google y puede costar una penalización manual. Cuando haya
reseñas reales se agrega.

> El sitio **no sustituye la ficha de Google Business Profile**. Son dos activos
> distintos, y la ficha es la que desbloquea el mapa, las reseñas y las
> búsquedas «cerca de mí». Para una clínica local esa ficha pesa más que el
> sitio.

---

## El fondo del encabezado

Es una **textura abstracta**, no una fotografía de la clínica. La distinción
importa: un negocio de salud no debe mostrar interiores, equipos ni personal
generados por inteligencia artificial, porque una paciente que llega esperando
lo que vio en la foto y encuentra otra cosa pierde la confianza. Las texturas no
afirman ser un lugar concreto, así que son seguras.

La legibilidad del texto se controla con dos capas: la imagen va en
`.hero::before` con la opacidad del token `--hero-img-op`, y encima
`.hero::after` aplica el velo `--hero-scrim`. Ambos cambian según el tema claro
u oscuro.

Contraste medido sobre el fondo real, con el texto oculto:

| | Escritorio | Móvil |
|---|---|---|
| Titular, peor punto | 10.6:1 | 12.1:1 |
| Párrafo, peor punto | 6.7:1 | 8.3:1 |

El mínimo WCAG AA para texto normal es 4.5:1. **Si cambias la imagen hay que
volver a medir**, no basta con mirarla: una foto más oscura en la zona del texto
rompe el contraste sin que se note a simple vista.

### Cambiar la imagen del encabezado

1. Recorta a 1400 px de ancho y guarda como WebP calidad 70.
2. Conviértela a base64 (`base64 -w0 imagen.webp`, o cualquier conversor en línea).
3. En `index.html`, busca `url("data:image/webp;base64,` y sustituye la cadena
   larga que sigue. Hay dos: la primera es la de escritorio, la segunda la de móvil.

---

## Lo que sigue faltando: fotografía real

El fondo resuelve la estética, pero no sustituye una sesión de fotos. El formato
que más convierte en este sector es **el especialista a cámara**, y eso no lo da
ninguna textura.

**Para el encabezado:** retrato de la médica, de pie, mirada a cámara, con bata,
en la clínica. Horizontal, con espacio libre a la izquierda para el texto.

**Para la ficha de Google** (mínimo 25, y las primeras pesan más): fachada desde
la banqueta, entrada con el número visible, recepción, cada cabina ordenada,
cada equipo con su nombre, el personal con bata.

**Para el sitio y redes:** verticales de cada tratamiento en proceso, el área de
nutrición con la báscula de composición corporal, la zona de spa.

**Consentimiento:** cualquier toma donde aparezca una paciente necesita
consentimiento informado por escrito y específico para uso publicitario.
Archívalo.

---

## Cumplimiento

Incluido: aviso COFEPRIS visible, «los resultados varían según cada paciente»,
«todo procedimiento requiere valoración médica previa» y el aviso de privacidad
completo como sección de la página.

No hay imágenes de antes y después ni promesas de resultado garantizado, en
línea con las políticas de publicidad de Meta y con el criterio sanitario.

---

## Probar en local

```bash
python3 -m http.server 8000   # y abrir http://localhost:8000
```
