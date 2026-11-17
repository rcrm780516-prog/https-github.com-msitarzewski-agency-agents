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

## PENDIENTE 1 — Horario

| Día | Horario |
|---|---|
| Lunes a viernes | **[COMPLETAR]** |
| Sábado | **[COMPLETAR]** |
| Domingo | **[COMPLETAR]** |

Me indicaste que es el mismo en las cinco, pero no venía en la extracción de
las fichas. Es el dato que más se consulta antes de llamar, y sin él el schema
sale sin `openingHours`, que es uno de los campos que Google usa para el
paquete local.

## PENDIENTE 2 — WhatsApp

| Campo | Valor |
|---|---|
| ¿Un WhatsApp central o uno por sede? | **[COMPLETAR]** |
| Número(s) | **[COMPLETAR]** |

Es el CTA principal de todo el sitio: hoy los botones renderizan pero el enlace
no lleva número.

## PENDIENTE 3 — Correo de contacto

| Campo | Valor |
|---|---|
| Correo | **[COMPLETAR]** |

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
