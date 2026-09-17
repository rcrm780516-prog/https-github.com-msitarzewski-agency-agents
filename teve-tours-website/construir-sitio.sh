#!/usr/bin/env bash
# ============================================================================
# Genera el sitio listo para subir, con una página real por cada dirección.
#
#     ./construir-sitio.sh            -> queda en  sitio-publicar/
#
# Por qué existe: index.html es una sola página que arma su contenido con
# JavaScript. Para un visitante da igual, pero un buscador que no ejecuta ese
# JavaScript veía las 21 direcciones idénticas, sin H1 y con el canonical
# apuntando siempre a la portada, así que indexaba una sola.
#
# Este script abre cada dirección en un navegador de verdad, deja que el sitio
# se arme, y guarda el resultado como archivo. Cada página queda con su título,
# su descripción, su canonical, sus hreflang, su H1 y su texto ya escritos.
# ============================================================================
set -euo pipefail
cd "$(dirname "$0")"
SALIDA="sitio-publicar"
PUERTO=8791

# La versión de version.txt se estampa en la dirección de teve-config.js y
# teve-fotos.js. Sin esto el navegador se queda con su copia guardada: sirve el
# HTML nuevo con los datos viejos, y el resultado es un menú con un hueco en
# blanco o un precio que ya cambiamos. Al cambiar la versión cambia la
# dirección, y no le queda más remedio que pedirlos otra vez.
VERSION=$(grep -m1 '^Version:' version.txt | awk '{print $2}')
[ -n "$VERSION" ] || { echo "version.txt no dice ninguna versión"; exit 1; }
echo "0/4  estampando la versión $VERSION en los archivos…"
python3 - "$VERSION" <<'PY'
import io, re, sys
v = sys.argv[1]
p = 'index.html'
s = io.open(p, encoding='utf-8').read()
for f in ('teve-config.js', 'teve-fotos.js'):
    s = re.sub(r'<script src="/%s(?:\?v=[^"]*)?"></script>' % re.escape(f),
               '<script src="/%s?v=%s"></script>' % (f, v), s)
io.open(p, 'w', encoding='utf-8').write(s)
PY

echo "1/4  arrancando servidor local…"
node servidor-local.mjs . $PUERTO >/dev/null 2>&1 &
SRV=$!
trap 'kill $SRV 2>/dev/null || true' EXIT
sleep 2

echo "2/4  leyendo las rutas del config…"
node listar-rutas.mjs | python3 -c "import sys,json; print(json.dumps(json.load(sys.stdin)['rutas']))" > /tmp/teve-rutas.json

echo "3/4  prerenderizando…"
node construir-seo.mjs "http://localhost:$PUERTO" "$SALIDA" /tmp/teve-rutas.json /tmp/teve-informe.json

echo "4/4  copiando lo demás…"
cp teve-config.js teve-fotos.js robots.txt sitemap.xml version.txt .htaccess "$SALIDA/"
cp -r img "$SALIDA/"

echo
echo "Listo: $SALIDA/  ($(du -sh "$SALIDA" | cut -f1), $(find "$SALIDA" -type f | wc -l) archivos)"
echo "Sube TODO su contenido a public_html."
