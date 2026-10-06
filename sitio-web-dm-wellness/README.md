# Sitio web · DM Wellness Beauty and Nutrition

Cuatro archivos. Sin build, sin dependencias, sin carpetas. Se arrastran a
Hostinger y el sitio funciona.

| Archivo | Qué es | Peso |
|---|---|---|
| `index.html` | Todo el sitio: HTML, CSS, JavaScript, el logotipo, las doce fotos, el encabezado y el favicon, todo incrustado | 527 KB |
| `robots.txt` | Indica a Google qué rastrear y dónde está el sitemap | 1 KB |
| `sitemap.xml` | Mapa del sitio para Search Console | 1 KB |
| `README.md` | Este documento. No se sube | — |

Las imágenes van incrustadas como `data:`: cuatro en el CSS (las dos del
encabezado y las dos del logotipo) y doce como `<img>` en el cuerpo, así que no
hay que subir ningún archivo de imagen ni preocuparse por rutas rotas. El
archivo pesa 527 KB porque las fotos viajan dentro; a cambio no hay una sola petición extra ni una ruta que se pueda romper.
El precio de esa decisión es que el navegador descarga esos 472 KB antes de
pintar nada. Si algún día pesa el tiempo de carga, la salida es sacar las fotos
a archivos sueltos y perder la portabilidad de un solo archivo.

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

La imagen va al 92% de opacidad en tema claro y al 100% en tema oscuro; lo que
regula cuánto se ve es el velo, no la opacidad.

Contraste medido sobre el fondo real, con el texto oculto:

| | Escritorio claro | Escritorio oscuro | Móvil claro | Móvil oscuro |
|---|---|---|---|---|
| Antetítulo, peor punto | 6.1:1 | 6.0:1 | 5.7:1 | 5.0:1 |
| Titular, peor punto | 12.8:1 | 15.1:1 | 12.3:1 | 12.9:1 |
| Párrafo, peor punto | 6.8:1 | 9.4:1 | 8.4:1 | 9.6:1 |

En móvil el velo es más cerrado a propósito: el texto arranca casi pegado al
borde superior, así que la seda se queda como textura. Con un velo más abierto
el antetítulo cae a 2.1:1 y deja de ser legible.

El mínimo WCAG AA para texto normal es 4.5:1. **Si cambias la imagen hay que
volver a medir**, no basta con mirarla: una foto más oscura en la zona del texto
rompe el contraste sin que se note a simple vista.

### Cambiar la imagen del encabezado

1. Recorta a 1400 px de ancho y guarda como WebP calidad 70.
2. Conviértela a base64 (`base64 -w0 imagen.webp`, o cualquier conversor en línea).
3. En `index.html`, busca `url("data:image/webp;base64,` y sustituye la cadena
   larga que sigue. Hay dos: la primera es la de escritorio, la segunda la de móvil.

---

## Las fotos de la clínica

Las doce fotos, recortadas y convertidas a WebP, incrustadas en `index.html`.
Dónde quedó cada una y por qué:

| Sección | Fotos | Criterio |
|---|---|---|
| Tarjetas de línea | Inyectable de perfil · báscula de bioimpedancia · ritual facial | Una por servicio. Cada foto ilustra lo que su propia tarjeta promete: la de nutrición muestra literalmente la «medición real de composición corporal» |
| Tira bajo las tarjetas | Paciente hombre · inyectable periocular · segundo paciente hombre | Medicina estética en proceso. Alternadas hombre-mujer-hombre para que no se lean como la misma foto repetida |
| Aparatología, banner | Cabina corporal con luz LED | Es la única horizontal del lote, así que es la única que funciona a todo lo ancho |
| Aparatología, tira | Láser facial · cápsula LED · maderoterapia | Rostro, equipo corporal y terapia manual: la amplitud de la cabina en una sola fila |
| Tu primera visita | Toma de presión en consulta | Es la prueba visual de que la visita empieza con una valoración, no con una venta |
| Por qué DM Wellness | Procedimiento con los certificados al fondo | La foto de credibilidad de la página: equipo, certificación visible y manos trabajando |

Las fotos de aparatología llevan texto alternativo **genérico**, no nombran el
equipo. Poner una foto bajo el rótulo «Venus Legacy» sin confirmar que ese es el
aparato de la foto sería una afirmación falsa. Si la clínica confirma qué equipo
aparece en cada toma, se puede emparejar una foto con cada ficha.

La foto de la cápsula LED está recortada alta a propósito, para que domine el
equipo y no el cuerpo de la paciente. Es una clínica médica, no un catálogo.

### Consentimiento

**Todas las fotos muestran pacientes identificables.** Antes de publicar hace
falta consentimiento informado por escrito y específico para uso publicitario en
el sitio web, de cada persona que aparece, archivado. Un permiso verbal o uno
genérico de «uso de imagen» no cubre esto.

### La etiqueta del producto

En la foto de medicina estética se alcanza a leer la marca del inyectable en el
frasco. La publicidad de productos de prescripción dirigida al público general
está restringida en México. No es una infracción evidente — es una foto clínica,
no un anuncio del producto — pero conviene que lo valide el responsable
sanitario. Si prefieren evitarlo, hay un recorte más cerrado que deja el frasco
fuera de cuadro.

### Añadir o cambiar una foto

1. Recorta al formato que usa su hueco: 1:1 para las tarjetas de línea, 4:5 para
   las demás.
2. Redimensiona a 640 px de ancho (tarjetas) o 700 px (el resto) y guarda como
   WebP calidad 62.
3. Conviértela a base64 (`base64 -w0 foto.webp`) y sustituye la cadena del
   `<img>` correspondiente en `index.html`, que se localiza por su texto `alt`.

### Lo que todavía no hay

**Para la ficha de Google** (mínimo 25, y las primeras pesan más): fachada desde
la banqueta, entrada con el número visible, recepción, cada cabina ordenada,
cada equipo con su nombre, el personal con bata.

**Para el encabezado:** sigue siendo una textura abstracta. El formato que más
convierte en este sector es el retrato de la especialista a cámara, horizontal,
con espacio libre a la izquierda para el texto. Ninguna de las ocho fotos
actuales sirve para eso.

---

## El logotipo

Va incrustado **sin fondo**: le quité el blanco del original con desmatizado por
canal, no con un recorte duro, así que los bordes del trazo conservan su
antialias y la marca se apoya limpia sobre cualquier color.

### Dos versiones, por tamaño

El logotipo original es un lockup circular con el texto «WELLNESS BEAUTY AND
NUTRITION» curvado por dentro del aro. Esas 26 letras miden, en el archivo
original, unos 30 px cada una sobre un lienzo de 1254 px. A 38 px de alto se
convierten en ruido y ensucian toda la marca — se ve como una mancha de color,
no como un logotipo.

Por eso hay dos versiones:

| Dónde | Versión | Tamaño |
|---|---|---|
| Encabezado | Reducida: aro, monograma y hoja, sin el texto curvo | 52 × 41 px |
| Pie de página | Completa, con el texto curvo legible | 92 px |
| Favicon | Reducida, PNG de 64 colores con alfa | 96 px (2.1 KB) |
| Sello sobre fotos | Reducida, en blanco | 56 × 45 px; 80 × 64 en el banner |

La versión reducida no se dibujó a mano: se obtuvo etiquetando los componentes
conexos del trazo y descartando los de menos de 1500 px de área. El aro
(22 977 px), el monograma con su línea (76 872 px) y los cuatro pétalos
(3 217 a 6 170 px) se quedan; las 26 letras, todas por debajo de 472 px, se van.
Es reproducible y no toca un solo píxel del trazo que se conserva.

### Por qué el sello va en blanco

Medí las cuatro esquinas de cada foto donde podría ir. Con el morado de la marca
el contraste iba de 1.3:1 a 2.5:1 — es decir, invisible. En blanco va de 2.9:1 a
15.6:1, y la sombra suave que lleva encima separa el trazo del fondo en el único
caso que se queda corto.

### El filtro de tema oscuro

El trazo del logotipo promedia `#A502C6`. Sobre el fondo del encabezado en
oscuro da 3.04:1, justo en el mínimo de 3:1 que pide la norma para gráficos.
Lleva `filter: brightness(1.2)`, que lo sube a 4.13:1.

**No más que eso.** A 1.38 el canal azul se satura en 255 mientras el rojo
todavía sube, el tono se corre a un magenta neón que no es el color de marca, y
el trazo fino se empasta. Ese era, junto con el tamaño, el motivo de que la
marca se viera como una plasta.

El data URI de cada versión aparece **una sola vez**, en el CSS, y los cuatro
sellos y las dos marcas lo referencian desde ahí.

**Lo único que el logotipo sí necesita como archivo suelto:** la propiedad
`logo` del `schema.org`. Google tiene que poder rastrear esa imagen para usarla
en el panel de conocimiento, y un `data:` no se rastrea. Cuando tengan dominio,
subir `logo.png` a la raíz y añadir `"logo": "https://dmwellness.mx/logo.png"`
al bloque `MedicalClinic` es el único caso en que vale la pena romper la regla
de los cuatro archivos.

---

## Los widgets de redes

### Facebook: ya está puesto y es el oficial

La sección «Síguenos» carga la **página de Facebook real** con el Page Plugin
oficial de Meta, en un `iframe` apuntando a `facebook.com/dminbc`. No necesita
token, ni app de desarrollador, ni cuenta de empresa: solo que la página esté
publicada y sea pública. Se carga en diferido (`loading="lazy"`), así que no
pesa hasta que el visitante llega a esa altura.

**No pude verificarlo en vivo.** El entorno donde construí el sitio tiene
bloqueado el acceso a los dominios de Meta, así que en mis capturas esa zona
sale vacía. Al subirlo al dominio debe cargar. Si no carga, las dos causas
posibles son que la página no sea pública o que una extensión del navegador
esté bloqueando el contenido de Facebook — por eso dejé un mensaje de respaldo
detrás del iframe que lo explica, y el botón que abre la página directamente.

### Instagram: Meta ya no da un widget de perfil

Esto hay que decirlo claro, porque es la pregunta que siempre vuelve: **Meta
eliminó el widget gratuito de feed de Instagram.** La API Basic Display, que era
la forma gratuita de leer el perfil, se apagó en diciembre de 2024. Hoy solo
existen tres caminos:

| Camino | Qué muestra | Qué cuesta |
|---|---|---|
| **Publicaciones oficiales incrustadas** | Las publicaciones que ustedes elijan, con el marco real de Instagram | Gratis. Hay que pegar las URLs y cambiarlas cuando quieran rotar el contenido |
| **Instagram Graph API** | El feed completo, al día | Cuenta de empresa, app de Meta, token que caduca cada 60 días y **un servidor** que lo renueve. Imposible desde un archivo estático sin exponer el token |
| **Servicio de terceros** (LightWidget, Behold, SnapWidget, Elfsight) | El feed completo, al día | Ellos guardan el token. Capa gratuita con su marca, o de pago para quitarla. Añade una dependencia externa |

Dejé montado el **primer camino**, que es el único gratuito, oficial y sin
dependencias. Lo único que falta son las URLs.

### Cómo activar las publicaciones de Instagram

1. Abre `index.html` y busca `var IG_POSTS`. Está casi al final, dentro del
   `<script>`, con un comentario que lo señala.
2. En Instagram, abre cada publicación que quieras mostrar, usa **Copiar enlace**
   y pega la URL entre comillas, separadas por coma:

```js
var IG_POSTS = [
  "https://www.instagram.com/p/C8QhQXKx1Qh/",
  "https://www.instagram.com/p/C9AbCdEfGhI/",
  "https://www.instagram.com/reel/C9XyZwVuTsR/",
  "https://www.instagram.com/p/C9MnOpQrStU/"
];
```

3. Guarda y sube el archivo. Nada más.

Funcionan igual los posts y los reels. Dos, cuatro o seis se ven bien; la
cuadrícula es de dos columnas en escritorio y una en móvil.

**Mientras la lista esté vacía** el hueco no se queda feo: se rellena con seis
fotos de la clínica que ya están en la página, enlazadas al perfil. No se
descarga un solo byte extra — el JavaScript reutiliza las imágenes que el
navegador ya tiene. En cuanto pongas una sola URL, esa cuadrícula desaparece y
entran las publicaciones reales.

### Lo que quité

Los contadores de «6,800 seguidores · 181 publicaciones». Un número de
seguidores escrito a mano en el código envejece mal: en un mes está equivocado y
nadie se acuerda de actualizarlo. Las publicaciones incrustadas traen sus cifras
reales y al día.

### Privacidad

Los componentes de Meta reciben la IP del visitante y pueden instalar cookies en
cuanto se cargan. Añadí el párrafo correspondiente al punto 7 del aviso de
privacidad. Si más adelante quieren que nada de Meta se cargue hasta que el
visitante lo pida, se puede poner un botón de «cargar publicaciones» delante;
dilo y lo cambio.

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
