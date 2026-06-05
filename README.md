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

## El video de la intro (chroma key)

Tienes un `.mp4` con **fondo verde** del rapelista limpiando. Para usarlo en el
sitio hay que convertirlo a **WebM con canal alfa** (transparencia):

```bash
./scripts/convert-intro.sh ruta/a/tu-video-verde.mp4
```

Esto genera `assets/video/intro.webm`. Requiere [ffmpeg](https://ffmpeg.org).

Si el verde no se elimina bien, ajusta el tono y la tolerancia:

```bash
# ./scripts/convert-intro.sh <archivo> <colorHex> <similarity> <blend>
./scripts/convert-intro.sh tu-video-verde.mp4 0x00B140 0.18 0.12
```

### Cómo funciona la animación

1. Al cargar, una capa de **espuma** cubre la pantalla y el contenido se ve
   borroso "a través del cristal".
2. El video del rapelista (ya transparente) se reproduce encima.
3. Conforme avanza el video, la espuma se va "limpiando" y el contenido se
   enfoca.
4. Al terminar el video (el rapelista desciende por sus cuerdas), el overlay se
   desvanece.

**Fallbacks automáticos** (la intro se omite y se muestra el contenido):
- Navegadores Safari/iOS (soporte limitado de WebM-alpha).
- Usuarios con `prefers-reduced-motion`.
- Si el video falla, no carga, o el autoplay está bloqueado.
- Si el usuario hace clic en **"Saltar intro"** o presiona `Esc`.

> Nota: WebM con alfa no funciona en Safari/iOS. Si necesitas la intro también
> ahí, habría que añadir una versión `.mov` (HEVC con alfa) como segunda fuente.
> Avísame y lo agregamos.

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

## Antes de publicar (checklist)

- [ ] Generar `assets/video/intro.webm` desde el `.mp4`.
- [ ] Actualizar **teléfono, WhatsApp y correo** reales. Busca en `index.html`
      los atributos `data-contact="phone"`, `data-contact="email"`,
      `data-contact="whatsapp"` y los enlaces `tel:` / `mailto:` / `wa.me`.
- [ ] Conectar el formulario (`FORM_ENDPOINT`).
- [ ] Reemplazar fotos/proyectos reales en `assets/img/`.
- [ ] Ajustar las cifras del hero (`+12 años`, `+500 trabajos`, etc.).
- [ ] Verificar textos de ambos idiomas.

---

## Despliegue

Al ser estático, puedes publicarlo en:

- **Netlify** / **Vercel** / **Cloudflare Pages**: arrastra la carpeta o
  conecta el repo.
- **GitHub Pages**: sirve la rama directamente.
- **Hosting tradicional**: sube los archivos por FTP a la raíz pública.
