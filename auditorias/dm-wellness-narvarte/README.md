# Auditoría Digital 360° — DM Wellness Beauty and Nutrition

Auditoría de marketing digital y análisis competitivo para una clínica de medicina
estética, nutrición y spa ubicada en Calle Dr. José María Vértiz 995, Narvarte,
Benito Juárez, CDMX (C.P. 03023).

## Archivos

| Archivo | Descripción |
|---|---|
| `Auditoria-DM-Wellness-Narvarte.pdf` | **Versión completa** — 31 páginas |
| `Auditoria-DM-Wellness-Narvarte-Ejecutiva.pdf` | **Versión ejecutiva** — 16 páginas, mismo contenido condensado |
| `auditoria.html` | Fuente de la versión completa (A4, se imprime con Chromium headless) |
| `auditoria-ejecutiva.html` | Fuente de la versión ejecutiva |
| `Informe-Meta-DM-Wellness-Septiembre-2026.pdf` | **Informe mensual de Meta Ads** — septiembre 2026, 10 páginas |
| `informe-meta-septiembre.html` | Fuente del informe mensual |

Ambas versiones comparten hallazgos, cifras y recomendaciones. La ejecutiva fusiona
secciones y recorta la prosa explicativa, el calendario editorial de 4 semanas y el
detalle de los guiones; conserva íntegras las tablas de datos, el mapa competitivo,
los 34 hallazgos, el plan de 90 días y el modelo de proyección.

## Regenerar el PDF

```bash
chromium --headless --no-pdf-header-footer \
  --print-to-pdf=Auditoria-DM-Wellness-Narvarte.pdf auditoria.html

chromium --headless --no-pdf-header-footer \
  --print-to-pdf=Auditoria-DM-Wellness-Narvarte-Ejecutiva.pdf auditoria-ejecutiva.html
```

Cada `<section class="page">` está calibrada para ocupar exactamente 297 mm de alto,
por lo que la numeración manual del pie coincide con la paginación del PDF. Las clases
`t1` a `t4` aplican compresión tipográfica progresiva a las páginas más densas.

## Alcance

- **Instagram** `@dm_wbn2` — perfil y 12 reels con métricas reales (27/08/2026)
- **Facebook** — no accesible durante el levantamiento; se entrega protocolo de
  verificación de 12 puntos
- **Sitio web** — inexistente
- **Google Business Profile** — inexistente
- **Competencia** — benchmark cuantitativo contra `@skintopia_mx` y mapa competitivo
  unificado de la zona Narvarte / Vértiz Narvarte / Benito Juárez, con reseñas de Google
  de once competidores y los negocios de estética del propio inmueble

La edición actual consolida **tres auditorías independientes** hechas sobre los mismos
perfiles (sección 02): las convergencias, las dos contradicciones resueltas y las
afirmaciones que se descartan por falta de sustento.

Las cifras del informe están etiquetadas como **medidas**, **inferidas** o
**proyectadas**; las proyecciones incluyen sus supuestos y no son promesas de resultado.


## Informe mensual de Meta Ads

Datos extraídos directamente de la cuenta publicitaria (`2059690118000351`) el 30/09/2026
vía el conector de Meta Ads. Cubre la Campaña de Endolift del 11 al 30 de septiembre.

Cifras verificadas del mes: $1,517.04 MXN de inversión · 11,915 impresiones ·
5,309 de alcance · 583 clics · 214 clics en el enlace · **134 conversaciones iniciadas**
a **$11.32** cada una.

El informe distingue explícitamente lo **medido** (todo lo anterior, más los desgloses
por día, edad y ubicación) de lo **modelado** (las proyecciones de citas y pacientes,
que parten de supuestos declarados). La campaña mide mensajes, no citas: esa brecha
es el eje del plan de acción.
