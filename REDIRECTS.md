# REDIRECCIONES 301 — GEMMAE

Si este sitio reemplaza uno existente, **esto es lo primero que hay que
resolver**. Cada URL antigua que quede sin redirigir pierde el posicionamiento
que había acumulado y devuelve 404 a quien llegue desde Google o desde un
enlace publicado.

---

## Procedimiento

### 1. Inventariar las URLs del sitio anterior

Antes de apagarlo:

- Google Search Console → Páginas → exportar las URLs indexadas.
- Google Analytics → páginas con tráfico de los últimos 12 meses.
- `sitemap.xml` del sitio actual.
- Screaming Frog (versión gratuita, hasta 500 URLs) o `wget --spider -r`.
- Enlaces entrantes: Search Console → Enlaces → páginas más enlazadas.

### 2. Mapear cada URL a su equivalente

Regla: **redirigir a la página más equivalente**, no a la home. Una redirección
masiva a la home Google la interpreta como *soft 404* y no transfiere valor.

### 3. Escribir las reglas en `.htaccess`

Se añaden dentro del bloque `<IfModule mod_rewrite.c>`, **después** de las
reglas de HTTPS y `www` y **antes** de las de bloqueo de archivos.

---

## Tabla de mapeo

Completar antes del lanzamiento. **[POR CONFIRMAR]** el sitio anterior y su
estructura de URLs.

| URL antigua | URL nueva | Tipo | Estado |
|---|---|---|---|
| `/servicios/ginecologia.html` | `/ginecologia/` | 301 | ejemplo |
| `/nosotros` | `/medicos/` | 301 | ejemplo |
| `/sucursales` | `/ubicaciones/` | 301 | ejemplo |
| `/sucursal-toluca` | `/ubicaciones/toluca/` | 301 | ejemplo |
| `/blog/?p=123` | `/blog/<slug>/` | 301 | ejemplo |
| `/contacto.php` | `/contacto/` | 301 | ejemplo |

---

## Sintaxis para `.htaccess`

```apache
# --- Redirecciones 301 del sitio anterior ---

# URL exacta
Redirect 301 /servicios/ginecologia.html /ginecologia/

# Con RewriteRule (permite patrones)
RewriteRule ^servicios/ginecologia\.html$ /ginecologia/ [R=301,L]

# Carpeta completa a una sola página
RewriteRule ^sucursales/?.*$ /ubicaciones/ [R=301,L]

# Conservando parte de la ruta
RewriteRule ^blog/([0-9]{4})/([0-9]{2})/(.+)$ /blog/$3/ [R=301,L]

# Con parámetros (query string): hay que evaluar QUERY_STRING
RewriteCond %{QUERY_STRING} ^p=123$
RewriteRule ^blog/?$ /blog/prueba-de-vph-positiva-que-significa/? [R=301,L]
```

Notas:

- La `?` final descarta la query string original; sin ella se arrastra.
- `[R=301,L]` = permanente y última regla aplicable.
- Ordenar de lo más específico a lo más general.
- Evitar cadenas de redirección (A → B → C): apuntar siempre al destino final.

---

## Verificación

```bash
# Debe devolver 301 y el Location correcto
curl -sI https://gemmaeginecologos.com/URL-ANTIGUA | grep -E "HTTP|location"

# Detectar cadenas: -L sigue los saltos y muestra cuántos hubo
curl -sIL https://gemmaeginecologos.com/URL-ANTIGUA | grep -c HTTP
```

Después del lanzamiento:

- [ ] Search Console → Cobertura: vigilar los 404 durante 4 semanas.
- [ ] Reenviar el sitemap nuevo.
- [ ] **No** eliminar el dominio antiguo si es distinto: mantenerlo
      redirigiendo al menos 12 meses.

---

## Redirecciones internas ya activas

Estas ya están en el `.htaccess` y no hay que añadirlas:

| Regla | Efecto |
|---|---|
| HTTP → HTTPS | 301 |
| `www.dominio` → `dominio` | 301 |
| `/ruta/index.html` → `/ruta/` | 301, evita contenido duplicado |
| `/ruta` → `/ruta/` | 301 vía `DirectorySlash` |
