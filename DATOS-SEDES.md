# DATOS DE LAS CINCO SEDES — para completar

Este archivo concentra lo único que falta para publicar el sitio indexable.
Corrige lo que esté mal y completa lo vacío; con eso se carga todo en minutos.

## Por qué no se llenó automáticamente

Google bloquea la lectura automatizada de las fichas de negocio desde un
servidor (muestra el CAPTCHA de "tráfico inusual"). Lo que aparece abajo viene
de **directorios de terceros**, no de las fichas oficiales, y en algunos casos
las fuentes se contradicen o tienen más de un año de antigüedad.

**Nada de esto está publicado en el sitio todavía.** Una dirección equivocada
en los datos estructurados le enseña a Google un NAP falso y cuesta más
trabajo corregirlo que dejarlo pendiente.

La fuente ideal es el panel de Google Business: copiar y pegar de ahí garantiza
que el sitio y la ficha digan exactamente lo mismo, que es lo que Google premia.

---

## 1. Horario (el mismo en las cinco, según me indicaste)

| Día | Horario |
|---|---|
| Lunes a viernes | **[COMPLETAR]** |
| Sábado | **[COMPLETAR]** |
| Domingo | **[COMPLETAR]** |

No encontré horario confirmado en ninguna fuente, ni siquiera en la ficha de
Toluca. Es el dato que más piden las pacientes antes de llamar.

---

## 2. Sedes

### Toluca — ficha de Google: "Gemmae tollocan"

| Campo | Valor encontrado | Estado |
|---|---|---|
| Calle y número | Tenancingo 110, primer piso, consultorio 3 | ⚠️ verificar |
| Colonia | Sor Juana Inés de la Cruz | ⚠️ verificar |
| CP | **[COMPLETAR]** | falta |
| Teléfono | 722 175 6692 | ⚠️ verificar |
| WhatsApp | **[COMPLETAR]** | falta |

### Auge (Toluca) — ficha de Google: "GEMMAE Ginecólogos"

| Campo | Valor encontrado | Estado |
|---|---|---|
| Calle y número | Paseo Tollocan 2533, tercer piso, consultorio 302 | ⚠️ verificar |
| Colonia | Santa María Totoltepec | ⚠️ verificar |
| CP | 50246 | ⚠️ verificar |
| Teléfono | 729 103 5618 | ⚠️ verificar |
| WhatsApp | **[COMPLETAR]** | falta |

> **Posible cruce de nombres.** La ficha llamada *"Gemmae tollocan"* la asigné a
> la sede Toluca, pero la unidad que está sobre **Paseo Tollocan** es Auge.
> Es probable que las dos fichas estén intercambiadas respecto a como quedaron
> en el sitio. Confírmame cuál es cuál.

### Metepec — ficha de Google: "Gemmae Metepec"

| Campo | Valor encontrado | Estado |
|---|---|---|
| Calle y número | Melchor Ocampo 139 | ⚠️ verificar |
| Colonia | Espíritu Santo | ⚠️ verificar |
| CP | **[COMPLETAR]** | falta |
| Teléfono | **[COMPLETAR]** | falta |
| WhatsApp | **[COMPLETAR]** | falta |

> Una fuente la nombra "Gemmae San Patricio". Si la sede tiene ese nombre
> comercial, conviene usarlo también en el sitio.

### Zinacantepec — ficha de Google: "GEMMAE ginecólogos zinacantepec"

| Campo | Valor encontrado | Estado |
|---|---|---|
| Calle y número | Av. 16 de Septiembre 307, Plaza Paloma, interior 7 | ⚠️ verificar |
| Colonia | Vista Nevado I | ⚠️ verificar |
| CP | 51354 | ⚠️ verificar |
| Teléfono | 729 738 2883 | ⚠️ verificar |
| WhatsApp | **[COMPLETAR]** | falta |

### Santa Fé (Cuajimalpa, CDMX) — ficha de Google: "Gemmae Santa Fe"

| Campo | Valor encontrado | Estado |
|---|---|---|
| Calle y número | — | **falta** |
| Colonia | — | **falta** |
| CP | — | **falta** |
| Teléfono | — | **falta** |
| WhatsApp | — | **falta** |

> Esta sede **no aparece en ningún directorio**. Es normal en una sede reciente,
> y además es una señal: si no está en directorios, tampoco tiene las citas
> locales que ayudan a posicionar. Vale la pena darla de alta en Doctoralia y
> directorios médicos de CDMX.

---

## 3. Contacto general

| Campo | Valor | Estado |
|---|---|---|
| WhatsApp central | **[COMPLETAR]** | falta |
| ¿Un WhatsApp por sede o uno solo? | **[COMPLETAR]** | falta |
| Correo de contacto | **[COMPLETAR]** | falta |
| Tiempo de respuesta que se promete | **[COMPLETAR]** | falta |

---

## 4. Advertencia de NAP

El nombre que usa el sitio y el de la ficha de Google no coinciden en dos sedes:

| Sitio | Google |
|---|---|
| GEMMAE Toluca | Gemmae tollocan |
| GEMMAE Auge | GEMMAE Ginecólogos |

Google usa la coincidencia exacta de **nombre, dirección y teléfono** como señal
de confianza para el paquete local. Conviene alinear un lado u otro: o se
renombran las fichas, o el sitio adopta el nombre de las fichas.

---

## 5. Cómo se carga

Cada sede es un archivo en `src/content/ubicaciones/`. Al completar esta tabla
se editan los campos `address`, `phone`, `whatsapp`, `hours` y `hoursSchema`,
se recompila y los datos entran automáticamente al texto visible, al schema
`MedicalClinic` y al sitemap. No hay que tocar ningún componente.
