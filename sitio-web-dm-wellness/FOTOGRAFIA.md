# Fotografía del sitio

## Regla que no conviene romper

Una clínica de salud **no debe mostrar interiores, equipos, personal ni pacientes
generados por IA**. Si alguien llega esperando lo que vio en la foto y encuentra
otra cosa, el problema no es estético: es de confianza, y en un negocio de salud
eso se paga caro.

Lo que sí es legítimo generar con IA: **texturas, fondos abstractos y detalles
atmosféricos** que no afirman ser un lugar concreto.

## Orden de preferencia para el héroe

| Opción | Calidad | Cuándo usarla |
|---|---|---|
| 1. Retrato real de la médica en la clínica | La mejor | En cuanto hagan la sesión de fotos |
| 2. Degradado actual (sin foto) | Buena | Ahora mismo — ya funciona |
| 3. Textura abstracta generada con IA | Aceptable | Si quieren más atmósfera ya |

La opción 1 no es preferencia estética: el análisis de contenido mostró que el
formato que más convierte en este sector es **el especialista a cámara**. Un
retrato real de quien atiende vale más que cualquier imagen generada.

---

## Prompt A · Textura abstracta (recomendado para usar ya)

Pégalo tal cual en ChatGPT pidiendo una imagen:

```
Crea una imagen horizontal 16:9 de altísima calidad para el fondo del encabezado
de un sitio web de una clínica de medicina estética.

Composición: una textura abstracta de seda o satén muy suave, con pliegues
amplios y ondulados que recorren el encuadre en diagonal de izquierda a derecha.
Nada de objetos reconocibles, nada de personas, ningún texto.

Color: blancos cálidos y rosa muy pálido en los dos tercios izquierdos,
transitando a magenta profundo y ciruela oscuro en la esquina superior derecha.
La paleta debe sentirse femenina pero sobria, nunca estridente.

Luz: suave, difusa, lateral, como luz de ventana al amanecer. Sombras largas y
delicadas en los pliegues. Alto rango dinámico, sin zonas quemadas.

Zona de respiro: los dos tercios izquierdos deben quedar claros, limpios y de
bajo contraste, porque encima se colocará texto oscuro. Toda la variación
cromática va al tercio derecho.

Estilo: fotografía editorial de producto de lujo, lente macro, profundidad de
campo reducida, grano fino de película. Sin viñeteado marcado.

Evita: logotipos, texto, rostros, manos, instrumental médico, botellas de
producto, flores reconocibles, marcas de agua, bordes duros, saturación excesiva.
```

## Prompt B · Detalle botánico atmosférico (alternativa)

```
Crea una imagen horizontal 16:9 de altísima calidad para el fondo del encabezado
de un sitio web de bienestar y medicina estética.

Sujeto: macrofotografía de pétalos de loto blanco con bordes teñidos de magenta,
fotografiados de muy cerca y ligeramente desenfocados, flotando sobre una
superficie de agua perfectamente quieta que refleja la luz.

Color: blanco cálido, rosa pálido y acentos de magenta profundo. Fondo que se
desvanece a ciruela oscuro en la esquina superior derecha.

Luz: natural y difusa, con un brillo tenue sobre el agua. Atmósfera serena y
silenciosa, de spa de alta gama.

Zona de respiro: los dos tercios izquierdos deben quedar claros y de bajo
contraste para que encima se lea texto oscuro.

Estilo: fotografía editorial, lente macro, profundidad de campo muy reducida,
grano fino. Realista, no ilustración.

Evita: texto, personas, manos, instrumental médico, logotipos, marcas de agua,
colores saturados, composición simétrica centrada.
```

## Si generan la imagen

1. Pide el resultado en **la máxima resolución** y recórtalo a **2400 × 1400 px**.
2. Conviértelo a **WebP** con calidad 80 (debe pesar menos de 250 KB).
3. Guárdalo como `hero.webp` en la raíz del sitio.
4. Añade al `<style>`:

```css
.hero::after{
  content:"";position:absolute;inset:0;z-index:-1;
  background:url("/hero.webp") center/cover no-repeat;
  opacity:.55;
}
@media (prefers-color-scheme: dark){ .hero::after{ opacity:.3 } }
```

El `opacity` es lo que mantiene el texto legible. Si la imagen queda muy
presente, bájalo; nunca lo subas al punto de que el titular pierda contraste.

---

## Sesión de fotos real: lista de tomas

Esta es la que de verdad mueve la aguja. Un fotógrafo medio día basta.

**Para el héroe**
- Retrato de la médica, de pie, mirada a cámara, en la clínica, con bata.
  Horizontal, con espacio libre a la izquierda para el texto.

**Para la ficha de Google** (mínimo 25, y las primeras importan más)
- Fachada del edificio desde la banqueta, para que la encuentren.
- Entrada y número visible.
- Recepción.
- Cada cabina, vacía y ordenada.
- Cada equipo con nombre: Endolift Mónaco, Venus Legacy, Dermapen.
- El personal completo, con bata.
- Detalle de manos trabajando, sin rostro de paciente.

**Para el sitio y redes**
- Verticales de cada tratamiento en proceso (sin antes y después).
- Área de nutrición con báscula de composición corporal.
- Zona de spa.

**Consentimiento**: cualquier toma donde aparezca una paciente necesita
consentimiento informado por escrito y específico para uso publicitario. Archívalo.
