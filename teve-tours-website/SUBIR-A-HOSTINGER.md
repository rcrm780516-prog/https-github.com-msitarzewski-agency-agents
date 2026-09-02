# Cómo subir el sitio a Hostinger

Guía paso a paso. No necesitas saber programar.

---

## Qué archivos vas a subir

```
public_html/
├── index.html          ← el sitio completo
├── teve-config.js      ← EL EMBEBEDOR: logo, imágenes, teléfonos, precios
├── robots.txt          ← indica a Google qué rastrear
├── sitemap.xml         ← mapa del sitio para Google
├── .htaccess           ← HTTPS, www y las rutas /tours, /servicios...
└── img/                ← aquí van tu logotipo y tus fotos
    └── LEEME.txt          (medidas y nombres recomendados)
```

---

## PASO 1 — Personaliza antes de subir

Abre **`teve-config.js`** con el Bloc de notas (Windows) o TextEdit (Mac).
Es el único archivo que necesitas tocar.

**Lo mínimo indispensable — cambia estas 3 cosas:**

```javascript
whatsapp: "5219987351905",         // ← ya está el número real de TEVE
email: "reservas@tevetours.com",   // ← tu correo real
telefonos: [ ... ]                 // ← tus teléfonos reales
```

> **El número de WhatsApp va sin `+`, sin espacios y sin guiones.**
> Para México es `52` + `1` + lada + número.
> Ejemplo: el celular 998 123 4567 se escribe `5219981234567`.

**Para poner el logotipo:**

1. Guarda tu logo como `logo.png` dentro de la carpeta `img/`
2. En `teve-config.js` cambia:
   ```javascript
   logo: "img/logo.png",
   logoBlanco: "img/logo-blanco.png",
   ```

**Para poner fotos:** igual — súbelas a `img/` y escribe la ruta en el campo
`imagen` de cada servicio, tour o destino.

> Las imágenes que dejes en `""` se ven como un degradado animado azul de la
> marca. El sitio nunca se ve roto, así que puedes ir subiendo fotos con calma.

---

## PASO 2 — Sube los archivos a Hostinger

### Opción A — Administrador de archivos (la más fácil)

1. Entra a **hpanel.hostinger.com** con tu cuenta.
2. Menú lateral → **Archivos** → **Administrador de archivos**.
3. Abre la carpeta **`public_html`**.
4. Si hay un `index.html` o `default.php` viejo, **bórralo o renómbralo**
   (por ejemplo a `index-viejo.html`) para que no estorbe.
5. Botón **Subir archivos** (icono de la flecha hacia arriba, arriba a la derecha).
6. Sube: `index.html`, `teve-config.js`, `robots.txt`, `sitemap.xml` y `.htaccess`.
7. Crea la carpeta **`img`** y sube ahí tu logotipo y tus fotos.

> **Si no ves el archivo `.htaccess` después de subirlo:** está oculto.
> Activa el interruptor **"Mostrar archivos ocultos"** en el menú de
> configuración (⚙️) del administrador de archivos.

### Opción B — FTP (para subir muchas fotos de golpe)

1. En hPanel: **Archivos** → **Cuentas FTP**. Anota host, usuario y contraseña.
2. Descarga **FileZilla** (gratis): https://filezilla-project.org
3. Conéctate con esos datos, puerto **21**.
4. En el panel derecho entra a `public_html` y arrastra ahí todos los archivos.

---

## PASO 3 — Comprueba que funciona

Abre en el navegador, uno por uno:

- `https://www.tevetours.com` → debe cargar la portada
- `https://www.tevetours.com/tours` → debe abrir la sección de tours
- `https://www.tevetours.com/robots.txt` → debe mostrar texto
- `https://www.tevetours.com/sitemap.xml` → debe mostrar la lista de páginas

**Prueba el WhatsApp:** haz clic en el botón verde flotante. Debe abrir un chat
con tu número y un mensaje ya escrito. Si abre un número equivocado, revisa el
campo `whatsapp` en `teve-config.js`.

> **Si ves el sitio viejo:** es la caché. Presiona `Ctrl + F5`
> (o `Cmd + Shift + R` en Mac). Si sigue igual, en hPanel busca
> **Rendimiento → Caché** y pulsa **Purgar caché**.

---

## PASO 4 — Activa el certificado SSL (candado verde)

1. hPanel → **Seguridad** → **SSL**.
2. Si dice "Instalar SSL", pulsa el botón. Es gratis y tarda unos minutos.
3. Activa también **"Forzar HTTPS"**.

Sin esto, Chrome marca el sitio como "No seguro" y Google lo penaliza.

---

## PASO 5 — Dale de alta el sitio en Google

1. Entra a **https://search.google.com/search-console**
2. Agrega la propiedad `https://www.tevetours.com`
3. Verifica el dominio (Hostinger permite hacerlo por registro DNS TXT desde
   hPanel → **Dominios** → **Zona DNS**).
4. Menú **Sitemaps** → escribe `sitemap.xml` → **Enviar**.
5. Registra también el negocio en **Google Business Profile**
   (https://business.google.com) — para búsquedas locales tipo
   *"transporte privado Cancún"* esto pesa más que la propia página.

---

## Cómo cambiar algo más adelante

| Quiero cambiar... | Abro... | Y edito... |
|---|---|---|
| Teléfono, WhatsApp o correo | `teve-config.js` | sección `contacto` |
| Logotipo | `teve-config.js` | sección `marca` → `logo` |
| Precios de los tours | `teve-config.js` | sección `tours` → `precio` |
| Fotos | subo a `img/` | y pongo la ruta en `imagen` |
| Agregar un tour nuevo | `teve-config.js` | copio un bloque de `tours` y lo pego |
| Textos de Google | `teve-config.js` | sección `seo` |
| Redes sociales | `teve-config.js` | sección `redes` |

Después de editar, vuelve a subir **solo** `teve-config.js` al administrador de
archivos, sobrescribiendo el anterior. Los cambios se ven de inmediato.

> **Consejo:** antes de editar, guarda una copia de `teve-config.js` en tu
> computadora. Si algo se rompe, vuelves a subir la copia buena.

---

## Si la página se ve en blanco

Casi siempre es un error de escritura en `teve-config.js`. Revisa que:

- Cada línea termine con **coma** `,` (menos la última de cada bloque)
- Los textos vayan entre **comillas dobles** `"así"`
- No hayas borrado una llave `{` `}` o un corchete `[` `]`
- Si tu texto lleva comillas dobles adentro, usa comillas simples afuera

Para encontrar el error exacto: abre la página, presiona **F12**, pestaña
**Console**. El mensaje en rojo dice el número de línea con el problema.

---

## Checklist antes de dar por terminado

- [ ] Número de WhatsApp real y probado
- [ ] Correo electrónico real
- [ ] Teléfonos reales
- [ ] Logotipo subido y visible arriba a la izquierda
- [ ] Foto de portada subida
- [ ] Precios de tours revisados y actualizados
- [ ] Redes sociales enlazadas (o vacías si no hay)
- [ ] SSL activo (candado verde en el navegador)
- [ ] `sitemap.xml` enviado a Google Search Console
- [ ] Probado en el celular

---

## El sitio en tres idiomas

La versión original es el **inglés** y vive en la raíz. El español y el
portugués viven bajo su propio prefijo:

| Idioma | Portada | Ejemplo de página interna |
|---|---|---|
| Inglés (original) | `tevetours.com/` | `tevetours.com/tours` |
| Español | `tevetours.com/es/` | `tevetours.com/es/tours` |
| Portugués | `tevetours.com/pt/` | `tevetours.com/pt/passeios` |

**No hay que crear carpetas `es/` ni `pt/` en el servidor.** El `.htaccess`
se encarga de que esas direcciones sirvan el mismo `index.html`, y el sitio
detecta el idioma solo. Por eso el `.htaccess` es obligatorio.

Un visitante de Brasil que entre a `tevetours.com` ve el portugués
automáticamente; uno de Reino Unido ve el inglés. Quien cambie de idioma a
mano queda recordado en su navegador.

Para editar un texto, búscalo dentro de `textos:` en `teve-config.js` y
cámbialo en los tres bloques (`en:`, `es:`, `pt:`). Las fotos y los precios
NO se repiten: viven una sola vez en la PARTE A del archivo.

### Después de subir, en Google Search Console

1. Manda el sitemap: `https://www.tevetours.com/sitemap.xml`
   Trae las 21 direcciones (7 páginas × 3 idiomas) con sus etiquetas
   `hreflang`, que es como Google sabe qué versión servir a cada país.
2. En **Configuración → Segmentación internacional** no fijes un país:
   el sitio apunta a Reino Unido, Australia, Estados Unidos y Canadá a la
   vez, y fijar México los perjudicaría.
