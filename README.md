# Sky Solutions MX — Sitio web

Sitio web corporativo de **Sky Solutions MX**, empresa de mantenimiento de
fachadas en altura (reparación, pintura, limpieza de cristales e iluminación
externa) para edificios y hoteles en **Cancún y la Riviera Maya**, ejecutado
por rapelistas profesionales.

Sitio **estático** (HTML + CSS + JavaScript, sin dependencias ni build),
**bilingüe ES/EN**, con una **animación de intro** en la que un rapelista
limpia la "espuma de jabón" de la pantalla revelando el contenido.

---

## Estructura

```
index.html                  # Página principal (bilingüe vía data-i18n)
assets/
  css/styles.css            # Estilos y animaciones
  js/i18n.js                # Diccionarios de traducción ES/EN
  js/main.js                # Intro, idioma, navegación, scroll, formulario
  video/intro.webm          # ⬅ Video de intro (lo generas tú, ver abajo)
  img/                      # Imágenes (logos, fotos de proyectos)
scripts/
  convert-intro.sh          # Convierte tu .mp4 con fondo verde → .webm alfa
```

---

## Puesta en marcha (local)

No requiere build. Solo sirve la carpeta con cualquier servidor estático:

```bash
# Opción 1: Python
python3 -m http.server 8080

# Opción 2: Node
npx serve .
```

Luego abre <http://localhost:8080>.

> Abrir `index.html` con doble clic (protocolo `file://`) también funciona,
> pero algunos navegadores limitan la reproducción del video; se recomienda
> usar un servidor local.

---

## El video de la intro (chroma key en el navegador)

El video del rapelista (`assets/video/intro_src.mp4`, con fondo verde) **ya está
integrado**. El fondo verde se elimina **en tiempo real con JavaScript Canvas**
(`assets/js/intro.js`) — no requiere conversión a WebM-alpha y funciona en todos
los navegadores modernos, **incluido Safari/iOS**.

### Cómo funciona la animación

1. Al cargar, una capa de **espuma de jabón** cubre la pantalla y el contenido se
   ve borroso "a través del cristal".
2. El video del rapelista se procesa frame a frame en un `<canvas>`, eliminando
   los píxeles verdes (croma) para que solo se vea la persona.
3. Conforme avanza el video, la espuma se va "limpiando" y el contenido se enfoca.
4. Al terminar el video (el rapelista desciende por sus cuerdas), el overlay se
   desvanece.

### Ajustar el chroma key

Si quieres afinar la eliminación del verde, edita las constantes al inicio de
`assets/js/intro.js`:

```js
const KEY_R = 76, KEY_G = 135, KEY_B = 87; // color verde del fondo (muestreado)
const THRESHOLD = 72;   // qué tan estricto: súbelo si queda borde verde
const SPILL     = 0.55; // corrección de derrame verde en los bordes
```

> Para reemplazar el video, sustituye `assets/video/intro_src.mp4` por tu nuevo
> archivo. Si el nuevo fondo verde tiene otro tono, vuelve a muestrear el color y
> ajusta `KEY_R/G/B`.

**Fallbacks automáticos** (la intro se omite y se muestra el contenido):
- Usuarios con `prefers-reduced-motion`.
- Si el video falla, no carga, o el autoplay está bloqueado.
- Si el usuario hace clic en **"Saltar intro"** o presiona `Esc`.

> Nota: `scripts/convert-intro.sh` (conversión a WebM-alpha con ffmpeg) se conserva
> como alternativa, pero **no es necesario**: el método Canvas es el que está activo.

---

## Idioma (ES / EN)

- El selector **ES/EN** del header cambia el idioma y lo recuerda
  (`localStorage`).
- En la primera visita se detecta el idioma del navegador (default español).
- Los textos viven en `assets/js/i18n.js`. Para editar un texto, busca su clave
  y cámbiala en ambos idiomas.

---

## Formulario de contacto

Por defecto el formulario abre el cliente de correo del visitante (`mailto:`).
Para recibir los mensajes de forma profesional, conéctalo a un servicio:

1. Crea un formulario en [Formspree](https://formspree.io),
   [Netlify Forms](https://docs.netlify.com/forms/setup/) o tu backend.
2. En `assets/js/main.js`, define la constante:
   ```js
   const FORM_ENDPOINT = "https://formspree.io/f/tu-id";
   ```

---

## Datos de contacto ya integrados

- **Teléfono / WhatsApp:** +52 998 110 7776
- **Facebook:** https://www.facebook.com/SkySolutionsCancun
- **Instagram:** https://www.instagram.com/skysolutionsmx/
- **Botón flotante de WhatsApp** activo en todas las páginas
- **Mapa de Google** embebido en la sección de contacto (búsqueda "Sky Solutions
  MX Cancún"). Para fijar la ubicación exacta, reemplaza la URL del `iframe` en
  `index.html` por el enlace "Insertar mapa" de tu ficha de Google Maps.

## Galería

Las imágenes de la galería son **placeholders**. Coloca tus fotos reales en
`assets/img/gallery/` y reemplaza los bloques `.gallery-ph` por etiquetas
`<img>` en la sección `#galeria` de `index.html`.

## Antes de publicar (checklist)

- [x] Video de intro integrado (chroma key por canvas).
- [x] Teléfono / WhatsApp reales (+52 998 110 7776).
- [x] Redes sociales (Facebook + Instagram) y botón flotante de WhatsApp.
- [ ] Confirmar el **correo electrónico** real (actualmente
      `contacto@skysolutionmx.com`, placeholder).
- [ ] Conectar el formulario (`FORM_ENDPOINT` en `assets/js/main.js`).
- [ ] Subir **fotos reales** a `assets/img/gallery/`.
- [ ] Reemplazar logos/testimonios de **clientes** por los reales.
- [ ] Ajustar la cifra de **+500 trabajos** del hero si se desea.
- [ ] Fijar la ubicación exacta en el **mapa de Google**.
- [ ] Verificar textos en ambos idiomas (ES/EN).

---

## Despliegue

Al ser estático, puedes publicarlo en:

- **Netlify** / **Vercel** / **Cloudflare Pages**: arrastra la carpeta o
  conecta el repo.
- **GitHub Pages**: sirve la rama directamente.
- **Hosting tradicional**: sube los archivos por FTP a la raíz pública.
