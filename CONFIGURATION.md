# CONFIGURACIÓN — GEMMAE Ginecólogos

Todo lo que se configura sin tocar componentes. Dos lugares y nada más:

| Qué | Dónde | Se versiona |
|---|---|---|
| Dominio, contacto, IDs de analítica, redes | `.env` (copiar de `.env.example`) | No |
| Textos por defecto, navegación, cumplimiento | `src/config/site.ts` | Sí |
| Credenciales del webhook de leads | `public/api/config.php` (en el servidor) | **Nunca** |

Todo valor pendiente aparece como `[POR CONFIRMAR]` y el sitio lo trata como
tal: no se publica en datos estructurados, no se convierte en enlace y se
muestra en gris para que sea evidente en revisión.

---

## 1. Dominio

| Variable | Valor | Estado |
|---|---|---|
| `PUBLIC_SITE_URL` | `https://gemmaeginecologos.com` | **[POR CONFIRMAR]** dominio definitivo |
| Versión canónica | sin `www` (definido en `.htaccess`) | Cambiar ambas cosas a la vez si se prefiere con `www` |

Afecta a: canonical, `sitemap-index.xml`, `robots.txt`, Open Graph y JSON-LD.

---

## 2. Contacto

| Variable | Formato | Valor |
|---|---|---|
| `PUBLIC_WHATSAPP` | solo dígitos, con lada país: `52XXXXXXXXXX` | **[POR CONFIRMAR]** |
| `PUBLIC_WHATSAPP_DISPLAY` | legible: `+52 722 000 0000` | **[POR CONFIRMAR]** |
| `PUBLIC_PHONE` | legible: `722 000 0000` | **[POR CONFIRMAR]** |
| `PUBLIC_PHONE_HREF` | dígitos para `tel:` | **[POR CONFIRMAR]** |
| `PUBLIC_EMAIL` | correo de contacto | **[POR CONFIRMAR]** |

> Si `PUBLIC_WHATSAPP` está vacío, los botones siguen renderizando pero el
> enlace no lleva número. Es el primer dato a completar.

### ¿Un WhatsApp por sede o uno central?
Cada sede admite su propio número en `src/content/ubicaciones/<sede>.md`
(campo `whatsapp`). Si se deja vacío, usa el central. **[POR CONFIRMAR]**
si GEMMAE quiere un solo número (recomendado para un futuro agente IA) o uno
por sede.

---

## 3. Analítica y publicidad

Cada script se inyecta **solo** si su ID está definido. Sin IDs, el sitio no
carga terceros ni deja cookies.

| Variable | Para qué | Valor |
|---|---|---|
| `PUBLIC_GTM_ID` | Google Tag Manager (contenedor recomendado) | **[POR CONFIRMAR]** `GTM-XXXXXXX` |
| `PUBLIC_GA4_ID` | GA4 directo (solo si no se usa GTM) | **[POR CONFIRMAR]** `G-XXXXXXXXXX` |
| `PUBLIC_META_PIXEL_ID` | Meta Pixel | **[POR CONFIRMAR]** |
| `PUBLIC_GOOGLE_ADS_ID` | Google Ads | **[POR CONFIRMAR]** `AW-XXXXXXXXX` |
| `PUBLIC_GOOGLE_ADS_LABEL` | etiqueta de conversión de contacto | **[POR CONFIRMAR]** |

### Eventos que el sitio ya emite al `dataLayer`

`view_service`, `view_doctor`, `view_location`, `click_whatsapp`, `click_call`,
`click_map`, `guide_select`, `appointment_start`, `form_start`, `form_submit`,
`form_error`.

Cada evento incluye: `service`, `location`, `doctor`, `source`, `utm_source`,
`utm_medium`, `utm_campaign`, `landing_page`, `page_path`.

En GTM basta crear un *Custom Event trigger* con el nombre del evento y mapear
las variables del `dataLayer`. No hace falta tocar el código del sitio.

---

## 4. Formulario y CRM

| Variable | Valor |
|---|---|
| `PUBLIC_FORM_ENDPOINT` | `/api/lead.php` (por defecto) |

En el servidor, copiar `public/api/config.example.php` a
`public/api/config.php` y completar:

- `webhook_url` — **[POR CONFIRMAR]** URL del webhook de n8n / CRM
- `webhook_token` — **[POR CONFIRMAR]** token compartido (cabecera `X-Gemmae-Token`)
- `notify_email` — **[POR CONFIRMAR]** correo de respaldo
- `log_file` — ruta fuera de `public_html` (por defecto ya lo está)

Payload que recibe el webhook:

```json
{
  "event": "lead_created",
  "name": "", "phone": "", "service": "", "location": "", "doctor": "",
  "contact_preference": "whatsapp", "message": "",
  "utm_source": "", "utm_medium": "", "utm_campaign": "",
  "utm_content": "", "utm_term": "",
  "landing_page": "", "page": "", "referrer": "",
  "created_at": "ISO-8601", "ip_hash": "sha256 truncado"
}
```

La IP nunca se envía en claro: se transmite un hash truncado, suficiente para
detectar abuso y compatible con la LFPDPPP.

---

## 5. Redes y perfiles

| Variable | Valor |
|---|---|
| `PUBLIC_INSTAGRAM` | **[POR CONFIRMAR]** |
| `PUBLIC_FACEBOOK` | **[POR CONFIRMAR]** |
| `PUBLIC_TIKTOK` | **[POR CONFIRMAR]** |
| `PUBLIC_YOUTUBE` | **[POR CONFIRMAR]** |
| `PUBLIC_DOCTORALIA` | **[POR CONFIRMAR]** |
| `PUBLIC_GOOGLE_BUSINESS` | **[POR CONFIRMAR]** URL del perfil de Google |

Alimentan el `sameAs` del schema `MedicalBusiness` (señal de entidad para
Google) y los iconos del pie. Si están vacías, no se renderizan.

---

## 6. Sedes

Se editan en `src/content/ubicaciones/{toluca,metepec,zinacantepec}.md`.

Pendiente en las tres: `address` (calle, colonia, CP), `phone`, `hours`,
`hoursSchema`, `geo` (lat/lng), `mapEmbed`, `mapLink`, `googleBusinessUrl`,
`directions`, `parking`.

**Regla NAP:** nombre, dirección y teléfono deben coincidir **carácter por
carácter** con Google Business Profile, Doctoralia y redes. Una inconsistencia
diluye la señal local.

`hoursSchema` usa el formato de schema.org, por ejemplo:
`["Mo-Fr 09:00-19:00", "Sa 09:00-14:00"]`.

`mapEmbed` es la URL del iframe de Google Maps (Compartir → Insertar un mapa →
copiar solo el `src`).

---

## 7. Médicos

Se editan en `src/content/medicos/*.md`. Hoy son tres plantillas con
`draft: true`, lo que significa: se construyen para revisión pero **no se
indexan ni entran al sitemap ni aparecen en el listado público**.

Para publicar un perfil: completar todos los campos y cambiar `draft: false`
y `seo.noindex: false`.

---

## 8. Datos regulatorios (`src/config/site.ts`)

| Campo | Valor |
|---|---|
| `legalName` | **[POR CONFIRMAR]** razón social |
| `compliance.responsableSanitario` | **[POR CONFIRMAR]** |
| `compliance.cofeprisAviso` | **[POR CONFIRMAR]** aviso de funcionamiento / permiso de publicidad |
| `compliance.privacyContactEmail` | **[POR CONFIRMAR]** contacto para derechos ARCO |

---

## 9. Reseñas

`src/data/reviews.json` está vacío a propósito. Formato:

```json
[{ "quote": "…", "author": "A. M.", "source": "Google", "rating": 5, "date": "2026-01" }]
```

Solo reseñas reales y con autorización. El sitio **no** emite
`AggregateRating`: publicar estrellas sin origen verificable incumple las
políticas de Google y las de publicidad médica en México.
