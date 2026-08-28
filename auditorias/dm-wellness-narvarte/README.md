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
