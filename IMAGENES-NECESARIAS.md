# IMÁGENES DEL SITIO — inventario y prompts

Qué imagen va en cada lugar, con qué medidas, y el prompt listo para pegar.

Hoy el sitio usa ilustraciones editoriales originales que generé con la paleta
de la marca. Funcionan y se ven bien, pero una fotografía real convierte más:
la paciente quiere ver dónde va a entrar.

---

## Lo primero: qué puede hacer la IA y qué no

**Sí puede** (y se puede publicar): ambientes genéricos sin personas
identificables, bodegones, detalles, texturas, composiciones abstractas.

**No debe usarse en producción:**

| Imagen | Por qué |
|---|---|
| Fotos de las cinco sedes | Una recepción generada por IA en la página de Metepec **le dice a la paciente que así se ve el consultorio**. Cuando llegue y no coincida, la confianza se rompe justo antes de la consulta. |
| Retratos de los médicos | Un rostro inventado junto a una cédula profesional es un problema serio en publicidad médica, no solo de credibilidad. |
| Fotos "de pacientes" | Aunque sean IA, insinúan testimonios reales. |

Para el **demo del doctor** sí puedes usar IA en todo: es una presentación, no
el sitio publicado. Solo hay que sustituir sedes y médicos antes de publicar.

---

## Formato de entrega

- **JPG**, calidad alta, sin comprimir previamente (el sitio genera WebP/AVIF
  y los tamaños responsive en el build).
- Lado largo mínimo **1600 px**; para el hero, **1800 px**.
- Sin texto, sin logotipos, sin marcas de agua incrustadas.
- Mándamelas como estén y yo las conecto: no hay que renombrar nada.

---

## Bloque de estilo — pégalo en TODOS los prompts

Copia este párrafo al final de cada prompt. Es lo que mantiene las imágenes
coherentes entre sí y con la marca:

```
Estilo: fotografía editorial premium de clínica de salud femenina, estética de
revista de wellness. Luz natural suave y difusa, ambiente cálido y sereno.
Paleta estricta: blanco cálido #FFFCFD, marfil rosado #FDF6F9, rosa suave
#FFE0EE, con acentos de rosa magenta #F02880 usados con moderación, y gris
cálido #808080 en detalles. Composición minimalista, mucho espacio vacío,
profundidad de campo suave. Fotorrealista, NO ilustración, NO render 3D.
Sin texto, sin letreros, sin logotipos, sin marcas de agua, sin rostros
reconocibles.
```

---

# PRIORIDAD 1 — lo que más impacta

## 1. Hero de la portada

- **Dónde:** portada, a la derecha del titular. Es lo primero que se ve.
- **Formato:** vertical **4:5** · mínimo 1440 × 1800 px
- **Archivo:** `hero.jpg`

```
Interior de un consultorio de ginecología privado y muy luminoso, visto en
composición vertical. Luz natural entrando por una ventana alta a la izquierda.
Una planta verde discreta, textiles en marfil, superficie de madera clara y un
detalle floral en rosa suave. Sensación de calma y cuidado, no de hospital.
Sin personas.

[pega aquí el bloque de estilo]
```

## 2. Las cinco sedes — FOTOGRAFÍA REAL

- **Dónde:** cabecera de cada página de sede, junto al mapa.
- **Formato:** horizontal **3:2** · mínimo 1600 × 1067 px
- **Archivos:** `sede-toluca.jpg`, `sede-auge.jpg`, `sede-metepec.jpg`,
  `sede-zinacantepec.jpg`, `sede-santa-fe.jpg`

**Esto no lo generes con IA.** Con un teléfono moderno basta. Qué tomar, en
orden de utilidad:

1. **La fachada o la entrada**, tal como la ve quien llega. Es lo que más
   reduce la ansiedad de "no sé si es aquí".
2. La recepción o sala de espera.
3. Un consultorio ordenado, sin pacientes ni expedientes visibles.

Consejos: de día, con luz natural, sin flash; horizontal; sin personas
identificables; ordena el encuadre antes de disparar (cables, papeles, botes).

Si aún no se pueden tomar, el demo usa la ilustración y nadie lo nota.

## 3. Equipo médico — FOTOGRAFÍA REAL

- **Dónde:** `/medicos/` y la ficha de cada especialista.
- **Formato:** vertical **4:5** · mínimo 800 × 1000 px
- **Archivos:** uno por médico, el nombre me lo das tú.

Retrato de medio cuerpo, fondo neutro claro, bata o vestimenta clínica, luz
suave y frontal, expresión cordial. Que las cinco sean del mismo estilo: una
sesión de una hora resuelve todo el equipo.

Es el activo pendiente con **más impacto en conversión**: los perfiles médicos
son lo más buscado y lo que más convierte en este sector.

---

# PRIORIDAD 2 — páginas de servicio

Horizontal **3:2**, mínimo 1600 × 1067 px. Van al inicio de cada página.

### `servicio-embarazo.jpg` — Embarazo y control prenatal

```
Detalle cálido y sereno relacionado con el embarazo: unas manos sosteniendo
con delicadeza una manta de bebé doblada sobre una superficie de madera clara,
junto a una rama con hojas verdes. Encuadre cercano, sin rostros.

[bloque de estilo]
```

### `servicio-ultrasonido-especializado.jpg` — Ultrasonido estructural y genético

```
Equipo de ultrasonido moderno en un consultorio luminoso y ordenado, pantalla
apagada, camilla con sábana blanca impecable, muebles de madera clara y un
detalle en rosa suave. Transmite tecnología y limpieza, sin frialdad
hospitalaria. Sin personas.

[bloque de estilo]
```

### `servicio-ultrasonido.jpg` — Ultrasonido general

```
Detalle cercano de una sala de ultrasonido: gel, transductor apoyado en su
soporte y una toalla blanca doblada sobre una mesa clara. Luz lateral suave.
Encuadre muy limpio, sin personas.

[bloque de estilo]
```

### `servicio-menopausia.jpg` — Menopausia

```
Bodegón luminoso que evoque una nueva etapa con plenitud: una taza de té de
hierbas humeante junto a un libro cerrado y una rama de eucalipto, sobre lino
color marfil, con luz de ventana. Sereno y cálido, nada melancólico.

[bloque de estilo]
```

### `servicio-fertilidad.jpg` — Fertilidad

```
Composición delicada y esperanzadora: un brote verde pequeño en una maceta de
cerámica clara sobre una mesa de madera, con luz natural lateral y mucho
espacio vacío alrededor. Metáfora sutil, sin bebés ni pruebas de embarazo.

[bloque de estilo]
```

### `servicio-ginecologia.jpg` — Ginecología

```
Consultorio de ginecología visto en plano general: escritorio ordenado, dos
sillas enfrentadas que sugieren conversación, una planta y un ventanal con luz
suave. Transmite consulta tranquila y con tiempo. Sin personas.

[bloque de estilo]
```

### `servicio-colposcopia.jpg` — Colposcopia · `servicio-vph.jpg` — VPH

```
Detalle de consultorio con instrumental clínico limpio y ordenado sobre campo
estéril blanco, en un espacio luminoso con un acento de color rosa suave.
Transmite precisión y pulcritud, sin resultar intimidante. Sin personas.

[bloque de estilo]
```

> Genera **dos variantes** de este prompt (cambia el encuadre o el ángulo) para
> que colposcopia y VPH no repitan la misma imagen.

### Resto de servicios (opcional)

`servicio-obstetricia.jpg`, `servicio-embarazo-alto-riesgo.jpg`,
`servicio-salud-femenina.jpg`, `servicio-ginecologia-adolescente.jpg`.
Si no se generan, se quedan con la ilustración editorial y el sitio sigue
completo.

---

# PRIORIDAD 3 — blog y redes

## Portadas del blog

Horizontal **3:2**, mínimo 1600 × 1067 px. Una por categoría, se reutiliza en
todos los artículos de esa categoría.

| Archivo | Categoría | Sujeto del prompt |
|---|---|---|
| `blog-ginecologia.jpg` | Ginecología | Calendario de pared minimalista junto a una rama verde, luz de ventana |
| `blog-embarazo.jpg` | Embarazo | Libreta abierta con bolígrafo y taza, sobre mesa clara, ambiente de planeación serena |
| `blog-menopausia.jpg` | Menopausia | Mujer madura de espaldas frente a una ventana luminosa, sin rostro visible |
| `blog-vph.jpg` | VPH | Bodegón clínico abstracto: cristalería de laboratorio limpia con luz suave |
| `blog-prevencion.jpg` | Salud preventiva | Calendario y una pequeña planta sobre escritorio claro, idea de cita periódica |

Prompt base, cambiando el sujeto:

```
[sujeto de la tabla]. Composición horizontal con mucho aire, enfoque selectivo,
sensación editorial y tranquila.

[bloque de estilo]
```

## Imagen para redes sociales (Open Graph)

- **Dónde:** la miniatura cuando se comparte el enlace en WhatsApp, Facebook
  o Instagram. **Es la primera impresión en campañas.**
- **Formato:** **1200 × 630 px** exactos
- **Archivo:** `gemmae-og.jpg`

Hoy hay una versión generada con el logotipo y el lema. Si quieren una con
fotografía, usa el prompt del hero en formato horizontal y **déjame a mí poner
encima el logotipo y el texto**: si la IA escribe el texto, saldrá deformado.

---

## Resumen

| Prioridad | Imágenes | Quién las hace |
|---|---|---|
| 1 | Hero portada | IA |
| 1 | 5 sedes | **Fotografía real** |
| 1 | Retratos del equipo | **Fotografía real** |
| 2 | 8 servicios principales | IA |
| 3 | 5 portadas de blog | IA |
| 3 | 1 imagen social | IA + logotipo que pongo yo |

**Con el hero y las ocho de servicios el sitio ya cambia de nivel.** Las sedes
y los médicos son las que de verdad mueven la conversión, y esas tienen que ser
reales.
