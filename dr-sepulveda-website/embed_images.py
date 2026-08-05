#!/usr/bin/env python3
"""
embed_images.py — Dr. Víctor Sepúlveda
Incrusta las fotografías en index.html y genera index-final.html.

USO:
  1. Coloca tus fotos en esta misma carpeta con los nombres indicados abajo.
  2. Ejecuta:  python embed_images.py
  3. Se genera index-final.html listo para subir a Hostinger.

FOTOS REQUERIDAS (puedes usar .jpg, .jpeg, .png o .webp):
  logo          → logo del doctor (aparece en el encabezado del sitio)
  foto_1        → Foto en traje quirúrgico azul (portada / inicio del sitio)
  foto_2        → Foto en bata blanca (sección "Acerca del Doctor")
  foto_3        → Cirugía 3 (tarjeta de servicio — Prótesis de rodilla y cadera)
  foto_4        → Cirugía 4 (tarjeta de servicio — Artroscopia)
  foto_5        → Cirugía 5 (tarjeta de servicio — Fracturas y traumatología)
  foto_6        → Cirugía 6 (tarjeta de servicio — Lesiones deportivas)
  foto_7        → Cirugía 7 (galería — imagen principal, grande)
  foto_8        → Cirugía 8 (galería — imagen pequeña 1)
  foto_9        → Cirugía 9 (galería — imagen pequeña 2)
"""

import os
import sys
import base64
import io

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

PHOTOS = [
    ("logo",   "LOGO",       600),
    ("foto_1", "CIRUGIA_1",  800),
    ("foto_2", "CIRUGIA_2",  700),
    ("foto_3", "CIRUGIA_3",  700),
    ("foto_4", "CIRUGIA_4",  700),
    ("foto_5", "CIRUGIA_5",  700),
    ("foto_6", "CIRUGIA_6",  700),
    ("foto_7", "CIRUGIA_7",  900),
    ("foto_8", "CIRUGIA_8",  700),
    ("foto_9", "CIRUGIA_9",  700),
]

QUALITY = 82
EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"]


def find_photo(base_name):
    for ext in EXTENSIONS:
        path = os.path.join(SCRIPT_DIR, base_name + ext)
        if os.path.isfile(path):
            return path
    return None


def encode_photo(path, max_width):
    try:
        from PIL import Image
        img = Image.open(path).convert("RGB")
        w, h = img.size
        if w > max_width:
            h = round(h * max_width / w)
            w = max_width
            img = img.resize((w, h), Image.LANCZOS)
        buf = io.BytesIO()
        img.save(buf, format="JPEG", quality=QUALITY, optimize=True)
        data = buf.getvalue()
        size_kb = len(data) // 1024
        return "data:image/jpeg;base64," + base64.b64encode(data).decode(), size_kb
    except ImportError:
        # Fallback: encode without resizing
        with open(path, "rb") as f:
            raw = f.read()
        ext = os.path.splitext(path)[1].lower()
        mime = "image/jpeg" if ext in (".jpg", ".jpeg") else (
               "image/png" if ext == ".png" else "image/webp")
        size_kb = len(raw) // 1024
        return "data:" + mime + ";base64," + base64.b64encode(raw).decode(), size_kb


def main():
    index_path = os.path.join(SCRIPT_DIR, "index.html")
    if not os.path.isfile(index_path):
        print("ERROR: No se encontró index.html en esta carpeta.")
        sys.exit(1)

    with open(index_path, "r", encoding="utf-8") as f:
        html = f.read()

    print("=" * 54)
    print("  Dr. Víctor Sepúlveda — Incrustar fotografías")
    print("=" * 54)

    for base_name, key, max_width in PHOTOS:
        placeholder = "__B64_LOGO__" if key == "LOGO" else f"__B64_FOTO_{key}__"
        photo_path = find_photo(base_name)

        if photo_path is None:
            print(f"  ⚠  {base_name:<10} — no encontrado (placeholder queda vacío)")
            continue

        data_uri, size_kb = encode_photo(photo_path, max_width)
        before = len(html)
        html = html.replace(placeholder, data_uri)
        replaced = len(html) != before
        status = "incrustado" if replaced else "placeholder no encontrado en HTML"
        print(f"  ✓  {base_name:<10} {os.path.basename(photo_path):<28} {size_kb:>4} KB  {status}")

    out_path = os.path.join(SCRIPT_DIR, "index-final.html")
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(html)

    print()
    print(f"  ✓ Generado: index-final.html  ({os.path.getsize(out_path) // 1024} KB)")
    print()
    print("  Paso siguiente:")
    print("  → Renombra index-final.html a index.html")
    print("  → Sube todos los archivos a Hostinger › public_html")
    print("=" * 54)


if __name__ == "__main__":
    main()
