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
| Calimaya | **[POR CONFIRMAR]** | Av. Calimaya km 2.5, Plaza Calimaya, Torre 2, planta alta, local 17, Calimaya, 52220 | **[POR CONFIRMAR]** |

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
| Calimaya | **[POR CONFIRMAR]** |

Entran al texto visible y al `openingHours` del schema de cada sede.

### Pendiente — la sede de Calimaya

Entró al sitio con la dirección que proporcionó GEMMAE y con las coordenadas
que venían en el enlace de mapa de su Facebook (19.19301, -99.58456). Faltan
tres datos y cada uno cuesta citas:

| Dato | Efecto mientras falte |
|---|---|
| **Teléfono** | La fila desaparece de la página y los botones de WhatsApp y de llamada marcan el número de la matriz. Una paciente de Calimaya que quiera llamar a su sede acaba en Toluca. |
| **Horario** | La fila desaparece. Google no puede mostrar "abierto ahora" para esta unidad, que es el filtro con el que se busca una consulta el mismo día. |
| **Ficha de Google Business** | Sin ficha, la sede no aparece en el mapa ni en "ginecólogo cerca de mí". Es el dato con más impacto de los tres: el sitio ya está listo para enlazarla en cuanto exista. |

También falta el nombre de la colonia o fraccionamiento, si la dirección
oficial lo lleva: hoy el NAP se publica con la referencia de Plaza Calimaya,
que es lo que GEMMAE entregó.

Servicios cargados, según lo indicado por GEMMAE: consulta ginecológica,
revisión preventiva con papanicolau, consulta y control de embarazo, y
ultrasonido ginecológico y obstétrico. **No** se ofrecen en esta unidad
colposcopia, VPH, fertilidad, menopausia, ginecología adolescente, obstetricia
ni ultrasonido estructural o genético, y el sitio lo dice de forma explícita en
la página y en su FAQ.

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

**Santa Fé.** La unidad de Cuajimalpa salió del sitio por indicación de GEMMAE
y su lugar lo ocupa Calimaya. Con ello la red queda completa en el Valle de
Toluca, lo que simplifica el SEO local: ya no hay que competir en dos mercados
distintos (Valle de Toluca y poniente de CDMX) con un solo dominio.

**Recomendación de NAP.** Las fichas usan nombres distintos (GEMMAE
Ginecólogos, Gemmae Tollocan, Gemmae Metepec, GEMMAE Ginecólogos
Zinacantepec). Unificarlas con el patrón "GEMMAE Ginecólogos — <Sede>"
fortalece la marca y facilita que Google entienda que son la misma red.
