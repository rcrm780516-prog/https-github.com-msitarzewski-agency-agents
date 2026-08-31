# DESPLIEGUE EN HOSTINGER — GEMMAE

El sitio compila a **HTML estático**. En Hostinger no hace falta Node en el
servidor, ni Docker, ni servicios de pago: se sube una carpeta y funciona.
El único componente dinámico es un archivo PHP (el endpoint del formulario),
que Hostinger ejecuta de forma nativa.

---

## 1. Compilar

Requisito local: **Node 18.20+ o 20.3+ o 22+**.

```bash
npm install          # solo la primera vez
cp .env.example .env # completar valores (ver CONFIGURATION.md)
npm run build        # genera dist/
npm run audit:seo    # auditoría: title, H1, canonical, schema, CTAs, sitemap
```

El build tarda ~3 segundos. Si `audit:seo` marca errores, **no subas**: los
errores son fallas reales de SEO o accesibilidad, no advertencias de estilo.

Para revisar antes de subir:

```bash
npm run preview      # sirve dist/ en http://localhost:4321
```

---

## 2. Qué se sube

**Todo el contenido de `dist/`**, no la carpeta en sí.

```
dist/
├── .htaccess                ← importante: es un archivo oculto, verifica que suba
├── index.html
├── 404.html
├── robots.txt
├── sitemap-index.xml
├── sitemap-0.xml
├── search-index.json
├── favicon.svg, icon-*.png, apple-touch-icon.png, site.webmanifest
├── _astro/                  ← CSS y JS con hash
├── api/                     ← endpoint PHP del formulario
├── images/
└── (una carpeta por página: ginecologia/, embarazo/, ubicaciones/toluca/, …)
```

**No** se sube: `node_modules/`, `src/`, `.env`, `package.json`,
`astro.config.mjs`. Si por comodidad se sube el repositorio completo, el
`.htaccess` ya bloquea el acceso web a esos archivos, pero lo limpio es subir
solo `dist/`.

---

## 3. Dónde se coloca

En hPanel → **Administrador de archivos** (o por SFTP):

```
/home/uXXXXXXX/domains/gemmaeginecologos.com/public_html/
```

El contenido de `dist/` va **directamente dentro de `public_html/`**:
`public_html/index.html` debe existir, no `public_html/dist/index.html`.

### Opción A — hPanel (rápida)
1. Comprimir el **contenido** de `dist/` en un ZIP (entrar a la carpeta,
   seleccionar todo, comprimir — no comprimir la carpeta `dist`).
2. Administrador de archivos → `public_html` → Subir → seleccionar el ZIP.
3. Clic derecho sobre el ZIP → **Extraer**.
4. Borrar el ZIP.
5. Activar "Mostrar archivos ocultos" y confirmar que **`.htaccess` está ahí**.

### Opción B — SFTP (recomendada para actualizaciones)
Datos en hPanel → Archivos → Cuentas FTP.

```bash
# Con lftp (sube solo lo que cambió y borra lo que sobra)
lftp -u USUARIO,CONTRASEÑA sftp://TU_HOST -e "
  mirror -R --delete --verbose --exclude api/config.php dist/ /public_html/;
  bye"
```

> `--exclude api/config.php` es indispensable: ese archivo vive solo en el
> servidor y contiene credenciales. Sin esa exclusión, un despliegue lo borra.

### Opción C — Git (Hostinger Business y superiores)
hPanel → Avanzado → **Git**: conectar el repositorio y definir
`public_html` como directorio de despliegue. Como Hostinger no ejecuta el
build, hay que versionar `dist/` en una rama dedicada (por ejemplo `deploy`)
o compilar en CI y publicar esa rama.

---

## 4. Dominio y SSL

1. hPanel → **Dominios** → apuntar el dominio a la cuenta (nameservers de
   Hostinger o registro A a la IP del hosting).
2. hPanel → **SSL** → instalar el certificado gratuito (Let's Encrypt).
   Suele tardar unos minutos.
3. Esperar a que el certificado esté **activo** antes de forzar HTTPS: el
   `.htaccess` ya lo fuerza, y hacerlo sin certificado deja el sitio inaccesible.
4. Verificar la versión canónica: el `.htaccess` redirige `www` → sin `www`.
   Si se prefiere con `www`, invertir esa regla **y** actualizar
   `PUBLIC_SITE_URL` antes de recompilar. Las dos cosas, o habrá canonical
   apuntando a un dominio que redirige.

---

## 5. Variables de entorno

En Hostinger no se configuran variables de entorno para un sitio estático:
los valores se **inyectan en el build**. El flujo es:

1. Editar `.env` en local.
2. `npm run build`.
3. Subir `dist/`.

Lo único que vive en el servidor es `public_html/api/config.php`
(credenciales del webhook). Crearlo una vez:

1. Copiar `api/config.example.php` a `api/config.php`.
2. Completar `webhook_url`, `webhook_token`, `notify_email`.
3. Permisos `600` o `640`.
4. Verificar que `https://tudominio.com/api/config.php` devuelve **403**
   (lo bloquea el `.htaccess`).

---

## 6. Sitemap y robots

Se generan en cada build con el dominio de `PUBLIC_SITE_URL`:

- `https://tudominio.com/sitemap-index.xml`
- `https://tudominio.com/robots.txt`

Tras el primer despliegue:
1. Google Search Console → añadir la propiedad de dominio.
2. Verificar por registro DNS TXT (hPanel → DNS).
3. Sitemaps → enviar `sitemap-index.xml`.
4. Inspeccionar la home y solicitar indexación.
5. Repetir la inspección con `/ubicaciones/toluca/`, `/ubicaciones/metepec/` y
   `/ubicaciones/zinacantepec/`: son las páginas que sostienen el SEO local.

---

## 7. Redirecciones

Ver `REDIRECTS.md`. Las reglas se añaden al `.htaccess`, en el bloque marcado
para ello. Al reemplazar un sitio existente, esto es lo primero que hay que
resolver: perder las URLs antiguas es perder el posicionamiento acumulado.

---

## 8. Caché y compresión

Ya vienen configuradas en `.htaccess`:

- HTML: `max-age=0, must-revalidate` → un despliegue se ve de inmediato.
- CSS/JS/fuentes: `max-age=31536000, immutable` → seguro porque los nombres
  llevan hash; un cambio genera un nombre nuevo.
- Imágenes: 6 meses.
- Compresión Brotli y gzip por tipo de contenido.

Si Hostinger tiene activado **LiteSpeed Cache**, purgar la caché desde hPanel
después de cada despliegue.

---

## 9. Actualizar el sitio

**Cambios de contenido** (artículo, servicio, sede, médico): editar el archivo
en `src/content/`, `npm run build`, subir `dist/`. No se toca ningún componente.

**Cambios de configuración** (teléfono, IDs de analítica): editar `.env`,
recompilar, subir.

Rutina recomendada para cada publicación:

```bash
npm run build && npm run audit:seo && npm run preview
# revisar, y solo entonces subir dist/
```

---

## 10. Verificación posterior al despliegue

```bash
# Reemplaza el dominio
D=https://gemmaeginecologos.com

curl -sI $D | head -1                       # 200
curl -sI http://$D | grep -i location       # redirige a https
curl -sI $D/ginecologia | grep -i location  # redirige a /ginecologia/
curl -s $D/robots.txt | tail -1             # línea Sitemap correcta
curl -sI $D/api/config.php | head -1        # 403
curl -sI $D/no-existe/ | head -1            # 404 con la página personalizada
curl -sI $D/_astro/ | head -1               # 403 (listado desactivado)
```

Además, a mano:
- [ ] Los tres CTA de la barra móvil funcionan en un teléfono real.
- [ ] El enlace de WhatsApp abre la app con el mensaje precargado.
- [ ] El formulario envía y redirige a `/gracias/`.
- [ ] Llega el lead al webhook (o al correo de respaldo).
- [ ] PageSpeed Insights sobre la home y sobre `/ubicaciones/toluca/`.
- [ ] Prueba de resultados enriquecidos de Google sobre una sede y un artículo.

---

## 11. Problemas frecuentes

| Síntoma | Causa | Solución |
|---|---|---|
| Todo devuelve 404 salvo la home | El contenido quedó en `public_html/dist/` | Mover el contenido un nivel arriba |
| Las reglas de HTTPS no aplican | `.htaccess` no se subió (archivo oculto) | Activar "mostrar ocultos" y volver a subir |
| El formulario devuelve 405 | Se abrió `lead.php` por GET | Es correcto: solo acepta POST |
| El formulario devuelve 403 | `Origin` no coincide | Verificar que se envía desde el mismo dominio |
| El lead no llega | `config.php` sin crear o webhook caído | Revisar `gemmae-leads.log` fuera de `public_html` |
| El sitio se ve sin estilos | Se subió `src/` en vez de `dist/` | Subir el build |
| Cambios que no se ven | Caché de LiteSpeed | Purgar caché en hPanel |
