# Carpeta de video

Coloca aquí el video final de la intro: **`intro.webm`** (con canal alfa / transparencia).

## Cómo generarlo desde tu .mp4 con fondo verde

Desde la raíz del proyecto:

```bash
./scripts/convert-intro.sh ruta/a/tu-video-verde.mp4
```

Esto crea automáticamente `assets/video/intro.webm`.

Si el verde no se elimina perfecto, ajusta el tono y la tolerancia:

```bash
# ./scripts/convert-intro.sh <archivo> <colorHex> <similarity> <blend>
./scripts/convert-intro.sh tu-video-verde.mp4 0x00B140 0.18 0.12
```

> El sitio funciona aunque este archivo no exista todavía: simplemente
> omite la animación de intro y muestra el contenido directamente.
