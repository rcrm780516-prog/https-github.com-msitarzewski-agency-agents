# DATOS DE LAS CINCO SEDES

Direcciones y teléfonos **cargados** desde las fichas de Google Business.
Quedan dos datos pendientes, marcados abajo.

---

## Cargado y publicado

| Sede | Ficha de Google | Dirección | Teléfono |
|---|---|---|---|
| Toluca (matriz) | GEMMAE Ginecólogos | Prolongación Tenancingo 110, Sor Juana Inés de la Cruz, 50040 Toluca de Lerdo | 722 175 6692 |
| Auge | Gemmae Tollocan | Av. Paseo Tollocan 2533-MZ 019, Delegación Santa María Totoltepec, 50246 Toluca | 729 103 5618 |
| Metepec | Gemmae Metepec | Priv. Melchor Ocampo 139, esquina Pedro Ascencio, Médica San Patricio, 52140 Metepec | 729 922 9098 |
| Zinacantepec | GEMMAE Ginecólogos Zinacantepec | Av. 16 de Septiembre 307, Plaza Paloma, San Miguel Zinacantepec, 51354 | 729 738 2883 |
| Santa Fé | Gemmae Santa Fe | Prol. Paseo de la Reforma 19, Santa Fe, Paseo de las Lomas, Cuajimalpa de Morelos, 01330 CDMX | 55 1306 6623 |

El schema `MedicalClinic` de cada página declara el nombre de la **ficha de
Google** en `name` y el comercial en `alternateName`, para que el NAP coincida
exactamente con lo que Google ya tiene registrado.

El teléfono de la matriz quedó como contacto general del sitio (cabecera, pie y
página de contacto). Se cambia en `.env` con `PUBLIC_PHONE`.

---

## Resuelto — WhatsApp

Cada sede usa como WhatsApp su propio número telefónico. Todos los CTA del
contenido de una sede (encabezado, columna lateral, barra móvil, botón
flotante y bloque de cierre) marcan el número de esa sede; el menú y el pie
usan el de la matriz, por ser elementos globales.

## Resuelto — Correo

Omitido por decisión de GEMMAE. La fila desaparece del pie, de la página de
contacto y del schema. Para reactivarlo basta definir `PUBLIC_EMAIL` en `.env`.

## Resuelto — Horario por clínica

| Sede | Horario cargado |
|---|---|
| Toluca (matriz) | 9:00 a 20:00 h |
| Auge (Tollocan) | 10:00 a 19:00 h |
| Metepec | 9:00 a 16:00 h |
| Zinacantepec | 16:00 a 20:00 h |
| Santa Fé | 16:00 a 21:00 h |

Entran al texto visible y al `openingHours` del schema de cada sede.

> **Un supuesto que conviene confirmar:** los horarios se cargaron como
> **lunes a viernes**, porque no se indicaron días. Si alguna clínica abre
> sábado, hay que añadirlo: para una paciente que busca el sábado, un horario
> incompleto en Google y en el sitio es una cita perdida.

---

## Discrepancias detectadas

**Zinacantepec.** El resumen de IA de Google muestra "16 de Septiembre No. 4,
Plaza Paloma Int. 7, Col. Iturbide Guerrero", pero la ficha dice **No. 307**,
CP 51354. Se cargó la versión de la ficha, que es la que manda para el NAP.
Si la correcta es la otra, hay que corregir **la ficha primero** y luego el sitio.

**Auge / Tollocan.** Facebook la nombra "Unidad AUGE" y añade *tercer piso,
consultorio 302*; la ficha de Google no menciona el piso. Conviene añadirlo en
Google: reduce llamadas de pacientes que no encuentran el consultorio.

**Nombres cruzados.** La ficha "Gemmae Tollocan" corresponde a la unidad AUGE
y "GEMMAE Ginecólogos" a la matriz de Toluca. Ya quedó corregido en el sitio.

**Recomendación de NAP.** Las fichas usan cuatro nombres distintos (GEMMAE
Ginecólogos, Gemmae Tollocan, Gemmae Metepec, GEMMAE Ginecólogos Zinacantepec,
Gemmae Santa Fe). Unificarlas con el patrón "GEMMAE Ginecólogos — <Sede>"
fortalece la marca y facilita que Google entienda que son la misma red.
