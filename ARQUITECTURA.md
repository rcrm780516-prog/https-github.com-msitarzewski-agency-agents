# ARQUITECTURA Y ESTRATEGIA — GEMMAE

## Nota previa: el proyecto de referencia

El brief indica que se proporcionó el código fuente de un sitio competidor.
**No está en este repositorio**: se revisó el historial completo (`git log
--all`) y las dos ramas existentes, y solo contienen `CLAUDE.md`.

En lugar de detener el desarrollo, se construyó sobre los patrones que se
repiten en el vertical de clínicas ginecológicas en México y sobre los errores
que se repiten en él. Si el código de referencia se aporta después, el análisis
comparativo puede hacerse sin rehacer nada: la arquitectura es la misma.

---

## FASE 1–2 — Qué falla en los sitios de este sector

Patrones observables en la mayoría de sitios de clínicas ginecológicas del
Valle de Toluca y de México en general:

| Problema frecuente | Consecuencia | Cómo lo resuelve GEMMAE |
|---|---|---|
| **Slider en el hero** | LCP de 3–5 s, mensaje diluido, el usuario no lee ninguna diapositiva | Hero de texto, sin carrusel. El LCP es el título: se pinta con el HTML |
| **Una sola página para todas las sedes** | Imposible posicionar "ginecólogo en Metepec"; el 100% del tráfico local compite en una URL | Una landing por sede, con contenido propio y schema `MedicalClinic` |
| **Contenido de sede duplicado** (buscar/reemplazar de ciudad) | Google lo detecta como thin content y no rankea ninguna | Intro, coberturas y FAQ distintos por sede, escritos para cada municipio |
| **Servicios en una sola página con acordeones** | Una URL para 10 intenciones de búsqueda distintas | Una URL por servicio, con la intención real detrás de cada una |
| **Médicos sin cédula ni certificaciones** | Cero señales E-E-A-T en un nicho YMYL, donde Google es más exigente | Estructura de perfil con cédula, formación y certificaciones; sin datos, la página no se indexa |
| **WhatsApp sin contexto** | El lead llega como "Hola" y no se sabe de qué campaña ni de qué página vino | Cada enlace lleva servicio, sede y campaña dentro del mensaje |
| **Formularios que piden síntomas** | Riesgo legal (datos sensibles) y fricción alta | Solo nombre, WhatsApp, motivo general y sede |
| **Testimonios inventados** | Riesgo regulatorio y pérdida de confianza si se detecta | Componente listo, vacío hasta tener reseñas reales autorizadas |
| **Blog sin autor ni revisión** | Sin autoridad médica en contenido de salud | Estructura `author` / `reviewedBy` / `medicalSpecialty` preparada |
| **WordPress con 30 plugins** | 3–6 MB por página, mantenimiento constante, superficie de ataque | Estático: sin base de datos, sin plugins, sin panel que actualizar |
| **Sin medición de micro-conversiones** | Se optimiza a ciegas: no se sabe qué página genera contactos | 11 eventos con contexto de servicio, sede, médico y campaña |

---

## FASE 3 — Arquitectura

### Por qué Astro estático y no Next.js

Para Hostinger la comparación no está reñida:

| | Astro SSG | Next.js |
|---|---|---|
| Salida | HTML plano | Requiere Node en el servidor (o `export`, que anula sus ventajas) |
| En hosting compartido | Subir una carpeta | Node.js en VPS, PM2, proxy inverso, mantenimiento |
| JS enviado al navegador | ~11 KB | 80–120 KB mínimo (runtime de React) |
| Coste operativo | El del hosting | VPS + tiempo de administración |

Este sitio no tiene estado de sesión, ni panel, ni carrito, ni contenido por
usuario: es un sitio de contenido con formularios. El SSR no aporta nada y sí
cuesta. **La complejidad que no aporta valor, se elimina** (regla 2 del brief).

React tampoco entra: los cuatro componentes interactivos (buscador, tabs de
sede, widget de orientación, formulario) suman ~11 KB en TypeScript vanilla.
Con React serían ~90 KB para el mismo comportamiento.

### El sitio como centro de gravedad

```
Google / Maps / Ads / Meta / Doctoralia / Instagram
        │  (UTM, gclid, fbclid)
        ▼
   Landing específica  ──►  captura la atribución en sessionStorage
        │                   (no se reescriben los enlaces internos:
        │                    romperían la sesión en GA4)
        ▼
   Confianza: servicio · médico · sede · FAQ
        ▼
   Conversión ── WhatsApp (mensaje con servicio + sede + campaña)
             └─ Formulario ──► lead.php ──► webhook n8n ──► CRM
        ▼
   Evento medido con contexto completo
```

### Red semántica

La relación se declara **una sola vez** y el resto se deriva por consulta:

```
Médico ──declara──► servicios y sedes
                          │
Servicio ──declara──► sedes donde se ofrece
                          │
Artículo ──declara──► servicios relacionados
                          ▼
        Sede: "qué médicos y servicios tengo" (derivado)
```

Así, añadir un médico enlaza automáticamente su ficha desde sus servicios y
sus sedes. No hay listas que mantener sincronizadas a mano, que es donde estos
sitios se degradan a los seis meses.

### Datos estructurados

Un solo bloque JSON-LD por página con `@graph` y nodos referenciados por `@id`:

- `MedicalBusiness` (organización, referenciada desde el resto)
- `WebSite` con `SearchAction`
- `MedicalClinic` por sede, con `parentOrganization`
- `Physician` por médico, con `worksFor` y `workLocation`
- `MedicalWebPage` en servicios, con `about` según el tipo real
- `Article` en el blog, con `author` / `reviewedBy`
- `FAQPage` y `BreadcrumbList` donde corresponde

**Regla implementada en código** (`src/lib/schema.ts`): ningún valor
`[POR CONFIRMAR]`, vacío o nulo llega al JSON-LD. Publicar un teléfono o una
dirección placeholder en datos estructurados es peor que omitirlos: Google los
toma como NAP real y contamina el perfil local. La auditoría falla si detecta
un marcador dentro del JSON-LD.

### Rendimiento

| Presupuesto | Valor actual |
|---|---|
| JS | 2.4 KB externos + ~8 KB inline |
| CSS | 28 KB (un archivo, mayormente inlineado) |
| Peticiones a terceros | 0 si no hay IDs de analítica configurados |
| Fuentes | Pila de sistema por defecto; autoalojadas opcionales |
| Imágenes | WebP/AVIF generados en build; `width`/`height` siempre presentes |

Decisiones que sostienen los Core Web Vitals: sin slider, sin video, sin
parallax, sin librerías de animación (solo `IntersectionObserver` + CSS), sin
iframes de mapa hasta que hay una sede real que mostrar, y `font-display: swap`.

### Accesibilidad (WCAG 2.1 AA)

Contraste verificado en los tokens, objetivos táctiles de 48 px, focus visible
en todo elemento interactivo, `skip-link`, tabs con patrón ARIA completo
(flechas, Home/End, foco gestionado), formulario con errores asociados por
`aria-describedby`, `prefers-reduced-motion` respetado y —lo más importante—
**el contenido nunca depende de JavaScript para ser visible**: las animaciones
de entrada se activan solo si hay JS (guard `.js`).

### Seguridad

CSP declarada en `.htaccess` con lista de dominios permitidos, HSTS,
`X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`. El endpoint
PHP valida en servidor (no solo en cliente), aplica honeypot, tiempo mínimo de
llenado, comprobación de origen y rate limiting por IP, y **nunca almacena la
IP en claro**: guarda un hash truncado. Las credenciales del webhook viven en
un archivo fuera del repositorio y bloqueado por `.htaccess`.

---

## Estrategia SEO

### Local (prioridad 1)

Tres landings de sede compiten por "ginecólogo en {ciudad}", cada una con:
contenido propio sobre el municipio, NAP visible, horarios, cómo llegar,
servicios reales de esa sede, médicos de esa sede, FAQ propias y
`MedicalClinic` con `areaServed`.

Las zonas cercanas (Lerma, San Mateo Atenco, Almoloya) se cubren con el campo
`coverage` de la sede más próxima, **no con páginas nuevas**: crear una URL por
localidad sería exactamente la granja de páginas que el brief prohíbe.

### Contenido (prioridad 2)

Cada artículo enlaza a su servicio, el servicio a sus sedes, la sede a sus
médicos. El recorrido `artículo → servicio → sede → WhatsApp` está construido
en las plantillas, no depende de que alguien recuerde poner el enlace.

### Destinos de campaña

| Campaña | Destino |
|---|---|
| "Ginecólogo Toluca" | `/ubicaciones/toluca/` |
| "Ginecólogo Metepec" | `/ubicaciones/metepec/` |
| "Control prenatal" | `/embarazo/` |
| "Colposcopia" | `/colposcopia/` |
| "VPH" | `/vph/` |
| Marca | `/` |

Ninguna campaña a la home salvo la de marca.

---

## Cumplimiento (publicidad médica en México)

Implementado en el contenido y en el código:

- Sin "100% seguro", "garantizado", "sin riesgos" ni promesas de resultado.
  Donde el tema lo pedía, se dice lo contrario de forma explícita: *"Ningún
  estudio o tratamiento puede garantizar un embarazo"*.
- El widget de orientación **no diagnostica**: muestra texto informativo por
  opción, sin lógica de triage ni puntuación de riesgo, con aviso visible.
- Disclaimer médico en toda página de contenido clínico.
- El formulario no pide información médica sensible.
- Espacios reservados para responsable sanitario, cédulas y avisos
  regulatorios, marcados como pendientes.
- Sin testimonios ni calificaciones fabricadas; sin `AggregateRating`.

---

## Preparado para lo que viene

**Agente IA en WhatsApp.** Cada mensaje llega con `serv:`, `sede:`, `med:`,
`src:`, `camp:` y la página de origen. El agente puede calificar sin preguntar
lo que ya se sabe.

**CRM.** El contrato del payload de `lead_created` está definido y
documentado; solo falta apuntar el webhook.

**CMS.** Las colecciones son Markdown con esquema tipado. La migración a
Decap, Sanity o Strapi cambia el `loader`, no las plantillas.

**Crecimiento.** Añadir un médico, una sede, un servicio o un artículo es
crear un archivo. Ningún componente se modifica.

---

## Deuda consciente

Decisiones tomadas a propósito, para que quien continúe no las descubra por
sorpresa:

1. **Sin CMS visual todavía.** Editar contenido requiere Git o el editor de
   archivos del hosting. Se recomienda añadir Decap CMS (gratuito, funciona
   sobre archivos estáticos) cuando GEMMAE quiera autonomía editorial.
2. **Sin i18n.** No hay demanda que lo justifique hoy.
3. **Búsqueda por coincidencia de texto**, no semántica. Con más de ~500
   contenidos convendrá revisar el enfoque.
4. **`.htaccess` con CSP fija.** Añadir una herramienta de terceros exige
   añadir su dominio ahí.
5. **Sin banner de cookies.** No hace falta mientras no haya IDs de analítica
   configurados. En cuanto se activen GA4 o Meta Pixel, hay que añadirlo junto
   con el aviso de privacidad definitivo.
