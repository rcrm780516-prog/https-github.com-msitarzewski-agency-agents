#!/usr/bin/env python3
"""
Spa de Occidente Catalog - Dark Luxury Edition
Dark charcoal backgrounds, warm cream text, gold accents, brand blue preserved.
Usage: python3 redesign_catalog_dark.py input.pdf output.pdf
"""

import sys
import fitz
from PIL import Image
import io
import numpy as np

# Dark Luxury Palette
BG_DARK     = (18,  18,  30)   # Deep navy-charcoal background
BG_DARK2    = (28,  28,  45)   # Slightly lighter dark (for off-white areas)
CREAM       = (240, 228, 205)  # Warm cream — primary text color
CREAM_MID   = (190, 178, 158)  # Mid cream — anti-aliased text edges
GOLD_MID    = (190, 150,  72)  # Rich gold — design line accents
GOLD_DARK   = (120,  92,  40)  # Dark gold — deeper accent elements


def transform_dark_luxury(img_data):
    """
    Transform a page rendered as RGB image to the dark luxury palette.

    Layer order (masks are mutually exclusive within their luminance band):
      1. Near-white  → dark charcoal background
      2. Light gray  → deeper dark (muted off-white elements)
      3. Pure black  → warm cream (text readability)
      4. Dark gray   → cream gradient (anti-aliased text edges)
      5. Mid neutral → gold accent (thin borders/lines, sat extremely low)
      6. Blues       → kept as-is (Spa de Occidente brand accent)
      7. Everything else (photos, colors) → kept as-is
    """
    img = Image.open(io.BytesIO(img_data)).convert('RGB')
    arr = np.array(img, dtype=np.float32)

    r, g, b = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]
    rn, gn, bn = r / 255.0, g / 255.0, b / 255.0

    lum = 0.299 * rn + 0.587 * gn + 0.114 * bn

    maxc = np.maximum(np.maximum(rn, gn), bn)
    minc = np.minimum(np.minimum(rn, gn), bn)
    safe_max = np.where(maxc == 0, 1.0, maxc)
    sat = (maxc - minc) / safe_max

    # Detect blue accents (Spa de Occidente brand blue — preserve intact)
    blue_keep = (bn > rn) & (bn > gn) & (sat > 0.10)

    out = arr.copy()

    # ── 1. Near-white → deep dark charcoal ───────────────────────────────────
    m1 = (lum > 0.94) & (sat < 0.10) & ~blue_keep
    out[m1, 0] = BG_DARK[0]
    out[m1, 1] = BG_DARK[1]
    out[m1, 2] = BG_DARK[2]

    # ── 2. Light gray (off-white elements, subtle shading) → darker dark ─────
    m2 = (lum > 0.78) & (lum <= 0.94) & (sat < 0.07) & ~blue_keep
    t2 = np.clip((lum[m2] - 0.78) / 0.16, 0.0, 1.0)
    out[m2, 0] = np.clip(BG_DARK[0] + t2 * 12, 0, 255)
    out[m2, 1] = np.clip(BG_DARK[1] + t2 * 12, 0, 255)
    out[m2, 2] = np.clip(BG_DARK[2] + t2 * 17, 0, 255)

    # ── 3. Pure black → warm cream (primary text) ────────────────────────────
    m3 = (lum < 0.05) & (sat < 0.18) & ~blue_keep
    out[m3, 0] = CREAM[0]
    out[m3, 1] = CREAM[1]
    out[m3, 2] = CREAM[2]

    # ── 4. Dark gray → cream gradient (anti-aliased text edges) ──────────────
    m4 = (lum >= 0.05) & (lum < 0.22) & (sat < 0.14) & ~blue_keep
    t4 = np.clip((lum[m4] - 0.05) / 0.17, 0.0, 1.0)
    out[m4, 0] = np.clip(CREAM[0] - t4 * (CREAM[0] - CREAM_MID[0]), 0, 255)
    out[m4, 1] = np.clip(CREAM[1] - t4 * (CREAM[1] - CREAM_MID[1]), 0, 255)
    out[m4, 2] = np.clip(CREAM[2] - t4 * (CREAM[2] - CREAM_MID[2]), 0, 255)

    # ── 5. Mid neutral → gold accent (extremely low sat = design lines only) ──
    # sat < 0.04 targets only near-perfectly neutral elements (thin lines,
    # hairline borders) while leaving product photo pixels untouched.
    m5 = (lum >= 0.22) & (lum < 0.78) & (sat < 0.04) & ~blue_keep
    t5 = np.clip((lum[m5] - 0.22) / 0.56, 0.0, 1.0)
    out[m5, 0] = np.clip(GOLD_DARK[0] + t5 * (GOLD_MID[0] - GOLD_DARK[0]), 0, 255)
    out[m5, 1] = np.clip(GOLD_DARK[1] + t5 * (GOLD_MID[1] - GOLD_DARK[1]), 0, 255)
    out[m5, 2] = np.clip(GOLD_DARK[2] + t5 * (GOLD_MID[2] - GOLD_DARK[2]), 0, 255)

    result = Image.fromarray(out.astype(np.uint8), 'RGB')
    buf = io.BytesIO()
    result.save(buf, format='PNG')
    return buf.getvalue()


def process_pdf(input_path, output_path):
    doc = fitz.open(input_path)
    new_doc = fitz.open()
    total = len(doc)
    print(f"Processing {total} pages...")

    for i in range(total):
        page = doc[i]
        sys.stdout.write(f"\rPage {i + 1}/{total}...")
        sys.stdout.flush()

        new_page = new_doc.new_page(width=page.rect.width, height=page.rect.height)
        mat = fitz.Matrix(2, 2)
        pix = page.get_pixmap(matrix=mat, clip=page.rect, colorspace=fitz.csRGB)
        transformed = transform_dark_luxury(pix.tobytes("png"))
        new_page.insert_image(new_page.rect, stream=transformed)

    print(f"\nSaving to {output_path}...")
    new_doc.save(output_path, garbage=4, deflate=True)
    new_doc.close()
    doc.close()
    print("Done! Dark luxury redesign complete.")


if __name__ == '__main__':
    if len(sys.argv) != 3:
        print("Usage: python3 redesign_catalog_dark.py input.pdf output.pdf")
        sys.exit(1)

    print(f"Dark luxury redesign: {sys.argv[1]} -> {sys.argv[2]}")
    process_pdf(sys.argv[1], sys.argv[2])
