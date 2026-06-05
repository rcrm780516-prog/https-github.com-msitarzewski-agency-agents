#!/usr/bin/env bash
# ============================================================
# Sky Solutions MX — Conversión del video de intro
# Convierte el .mp4 con FONDO VERDE (chroma) a un .webm con
# CANAL ALFA (transparencia) que usa el sitio en la animación.
#
# Requisitos: ffmpeg  (https://ffmpeg.org)
#   macOS:   brew install ffmpeg
#   Ubuntu:  sudo apt install ffmpeg
#
# Uso:
#   ./scripts/convert-intro.sh ruta/a/tu-video-verde.mp4
#   ./scripts/convert-intro.sh ruta/a/tu-video-verde.mp4 0x00B140 0.12 0.10
#
# Argumentos:
#   $1  archivo de entrada .mp4 (obligatorio)
#   $2  color del fondo verde en hex 0xRRGGBB (default 0x00B140)
#   $3  similarity / tolerancia del chroma 0..1 (default 0.12)
#   $4  blend / suavizado de bordes 0..1 (default 0.10)
#
# Salida: assets/video/intro.webm
# ============================================================
set -euo pipefail

INPUT="${1:-}"
KEYCOLOR="${2:-0x00B140}"     # verde típico de croma; ajústalo a tu tono
SIMILARITY="${3:-0.12}"
BLEND="${4:-0.10}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUT_DIR="$SCRIPT_DIR/../assets/video"
OUTPUT="$OUT_DIR/intro.webm"

if [[ -z "$INPUT" ]]; then
  echo "✖ Falta el archivo de entrada."
  echo "  Uso: ./scripts/convert-intro.sh tu-video-verde.mp4 [0xRRGGBB] [similarity] [blend]"
  exit 1
fi
if [[ ! -f "$INPUT" ]]; then
  echo "✖ No se encontró el archivo: $INPUT"
  exit 1
fi
if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "✖ ffmpeg no está instalado. Instálalo y vuelve a intentar."
  exit 1
fi

mkdir -p "$OUT_DIR"

echo "▶ Convirtiendo:"
echo "    entrada : $INPUT"
echo "    croma   : $KEYCOLOR (similarity=$SIMILARITY, blend=$BLEND)"
echo "    salida  : $OUTPUT"
echo ""

# chromakey elimina el verde -> alfa. format=yuva420p preserva el canal alfa.
# VP9 con -auto-alt-ref 0 es obligatorio para conservar transparencia.
ffmpeg -y -i "$INPUT" \
  -vf "chromakey=${KEYCOLOR}:${SIMILARITY}:${BLEND},format=yuva420p" \
  -c:v libvpx-vp9 -b:v 0 -crf 30 -pix_fmt yuva420p \
  -auto-alt-ref 0 \
  -an \
  "$OUTPUT"

echo ""
echo "✓ Listo: $OUTPUT"
echo "  Abre index.html y verás la intro con el rapelista incrustado."
echo ""
echo "  ¿El verde no se eliminó bien? Ajusta los parámetros, p. ej.:"
echo "    ./scripts/convert-intro.sh \"$INPUT\" 0x00B140 0.18 0.12"
