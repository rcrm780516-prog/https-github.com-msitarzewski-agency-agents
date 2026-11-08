#!/usr/bin/env bash
# Genera SOLO las tres paginas de destino dentro de sitio-publicar/.
# Es un paso aparte: no toca construir-sitio.sh ni ningun archivo existente.
set -euo pipefail
cd "$(dirname "$0")"
if [ ! -d sitio-publicar ]; then
  echo "Falta sitio-publicar/. Corre primero ./construir-sitio.sh" >&2
  exit 1
fi
python3 paginas-destino/construir.py
