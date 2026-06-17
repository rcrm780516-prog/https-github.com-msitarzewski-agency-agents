#!/usr/bin/env python3
"""
Spa de Occidente Catalog - Dark Luxury Edition v2
- Dark charcoal backgrounds, warm cream text, gold accents, brand blue preserved
- ALL embedded images (photos, logos) re-inserted at original quality — NEVER modified
- Website URL in each page footer replaced with www.spadeoccidente.com
Usage: python3 redesign_catalog_dark.py input.pdf output.pdf
"""

import sys
import re
import os
import io
import fitz
from PIL import Image, ImageDraw, ImageFont
import numpy as np

# ── Dark Luxury palette ───────────────────────────────────────────────────────
BG_DARK   = (18,  18,  30)
BG_DARK2  = (28,  28,  45)
CREAM     = (240, 228, 205)
CREAM_MID = (190, 178, 158)
GOLD_MID  = (190, 150,  72)
GOLD_DARK = (120,  92,  40)

NEW_URL = "www.spadeoccidente.com"
OLD_URL_RE = re.compile(r'www\.[a-zA-Z0-9._-]+\.(com|mx|net|org|com\.mx)', re.IGNORECASE)

# System fonts available on Ubuntu Actions runner, in preference order
FONT_PATHS = [
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
    "/usr/share/fonts/truetype/ubuntu/Ubuntu-R.ttf",
    "/usr/share/fonts/truetype/freefont/FreeSans.ttf",
]


# ── Color transformation ──────────────────────────────────────────────────────

def transform_dark_luxury(img):
    """
    Transform a PIL RGB image to the dark luxury palette.
    Only design elements (white bg, gray, black text) are changed.
    Coloured pixels (product photos, brand blue) are intentionally excluded
    by the high-saturation threshold, so photos remain natural-looking.
    However, this function is applied to the BACKGROUND render only —
    original photo images are re-stamped on top afterwards.
    """
    arr = np.array(img, dtype=np.float32)
    r, g, b = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]
    rn, gn, bn = r / 255.0, g / 255.0, b / 255.0

    lum = 0.299 * rn + 0.587 * gn + 0.114 * bn

    maxc = np.maximum(np.maximum(rn, gn), bn)
    minc = np.minimum(np.minimum(rn, gn), bn)
    safe_max = np.where(maxc == 0, 1.0, maxc)
    sat = (maxc - minc) / safe_max

    # Preserve Spa de Occidente brand blue pixels
    blue_keep = (bn > rn) & (bn > gn) & (sat > 0.10)

    out = arr.copy()

    # 1. Near-white (backgrounds) → deep dark charcoal
    m1 = (lum > 0.94) & (sat < 0.10) & ~blue_keep
    out[m1, 0] = BG_DARK[0]; out[m1, 1] = BG_DARK[1]; out[m1, 2] = BG_DARK[2]

    # 2. Light gray (off-white elements) → dark gradient
    m2 = (lum > 0.78) & (lum <= 0.94) & (sat < 0.07) & ~blue_keep
    t2 = np.clip((lum[m2] - 0.78) / 0.16, 0.0, 1.0)
    out[m2, 0] = np.clip(BG_DARK[0] + t2 * 12, 0, 255)
    out[m2, 1] = np.clip(BG_DARK[1] + t2 * 12, 0, 255)
    out[m2, 2] = np.clip(BG_DARK[2] + t2 * 17, 0, 255)

    # 3. Pure black → warm cream (primary text readability)
    m3 = (lum < 0.05) & (sat < 0.18) & ~blue_keep
    out[m3, 0] = CREAM[0]; out[m3, 1] = CREAM[1]; out[m3, 2] = CREAM[2]

    # 4. Dark gray → cream gradient (anti-aliased text edges)
    m4 = (lum >= 0.05) & (lum < 0.22) & (sat < 0.14) & ~blue_keep
    t4 = np.clip((lum[m4] - 0.05) / 0.17, 0.0, 1.0)
    out[m4, 0] = np.clip(CREAM[0] - t4 * (CREAM[0] - CREAM_MID[0]), 0, 255)
    out[m4, 1] = np.clip(CREAM[1] - t4 * (CREAM[1] - CREAM_MID[1]), 0, 255)
    out[m4, 2] = np.clip(CREAM[2] - t4 * (CREAM[2] - CREAM_MID[2]), 0, 255)

    # 5. Nearly-neutral mid-tones → gold (design borders/lines only, sat < 0.04)
    m5 = (lum >= 0.22) & (lum < 0.78) & (sat < 0.04) & ~blue_keep
    t5 = np.clip((lum[m5] - 0.22) / 0.56, 0.0, 1.0)
    out[m5, 0] = np.clip(GOLD_DARK[0] + t5 * (GOLD_MID[0] - GOLD_DARK[0]), 0, 255)
    out[m5, 1] = np.clip(GOLD_DARK[1] + t5 * (GOLD_MID[1] - GOLD_DARK[1]), 0, 255)
    out[m5, 2] = np.clip(GOLD_DARK[2] + t5 * (GOLD_MID[2] - GOLD_DARK[2]), 0, 255)

    return Image.fromarray(out.astype(np.uint8), 'RGB')


# ── URL replacement in PIL image ──────────────────────────────────────────────

def load_font(size):
    for fp in FONT_PATHS:
        if os.path.exists(fp):
            try:
                return ImageFont.truetype(fp, size)
            except Exception:
                pass
    return ImageFont.load_default()


def replace_url_in_image(img, url_spans, page_rect, zoom):
    """
    Cover old URL text in the image with the dark background color,
    then draw the new URL in cream at the same location.
    """
    if not url_spans:
        return img
    draw = ImageDraw.Draw(img)
    w_scale = img.width / page_rect.width
    h_scale = img.height / page_rect.height

    for span in url_spans:
        bbox = span["bbox"]
        x0 = bbox.x0 * w_scale
        y0 = bbox.y0 * h_scale
        x1 = bbox.x1 * w_scale
        y1 = bbox.y1 * h_scale
        height_px = max(y1 - y0, 1)

        # Erase old URL (add a small vertical margin)
        draw.rectangle([x0 - 4, y0 - 4, x1 + 4, y1 + 4], fill=BG_DARK)

        # Draw new URL
        font_size = max(8, int(height_px * 0.85))
        font = load_font(font_size)
        draw.text((x0, y0), NEW_URL, fill=CREAM, font=font)

    return img


# ── URL search in PDF page ────────────────────────────────────────────────────

def find_url_spans(page):
    """Return list of URL span dicts found in this page."""
    found = []
    try:
        for block in page.get_text("dict")["blocks"]:
            if block.get("type") != 0:
                continue
            for line in block["lines"]:
                for span in line["spans"]:
                    text = span.get("text", "").strip()
                    if OLD_URL_RE.search(text):
                        found.append({
                            "bbox": fitz.Rect(span["bbox"]),
                            "text": text,
                            "size": span.get("size", 10),
                        })
    except Exception as e:
        print(f"\n  [warn] URL search: {e}")
    return found


# ── Per-page processing ───────────────────────────────────────────────────────

def process_page(doc, page_idx, new_doc, zoom=2):
    page = doc[page_idx]
    mat = fitz.Matrix(zoom, zoom)

    # ── 1. Collect embedded image info (position + xref) before rendering ─────
    #    This gives us the PDF-space bounding box of every raster image on the page.
    try:
        image_info_list = page.get_image_info(xrefs=True)
    except Exception:
        image_info_list = []

    # ── 2. Render the full page as a raster image ─────────────────────────────
    pix = page.get_pixmap(matrix=mat, clip=page.rect, colorspace=fitz.csRGB)
    render_img = Image.open(io.BytesIO(pix.tobytes("png"))).convert("RGB")

    # ── 3. Apply dark luxury color transform ──────────────────────────────────
    dark_img = transform_dark_luxury(render_img)

    # ── 4. Replace old URL with new URL in the image ──────────────────────────
    url_spans = find_url_spans(page)
    dark_img = replace_url_in_image(dark_img, url_spans, page.rect, zoom)

    # ── 5. Convert back to PNG bytes ──────────────────────────────────────────
    buf = io.BytesIO()
    dark_img.save(buf, format="PNG")
    background_bytes = buf.getvalue()

    # ── 6. Create new output page ─────────────────────────────────────────────
    new_page = new_doc.new_page(width=page.rect.width, height=page.rect.height)

    # ── 7. Insert transformed background ─────────────────────────────────────
    new_page.insert_image(new_page.rect, stream=background_bytes)

    # ── 8. RE-STAMP ORIGINAL IMAGES (photos, logos, etc.) ────────────────────
    #    Each original raster image is extracted from the source PDF and inserted
    #    at its exact original position on top of the dark background.
    #    This COMPLETELY overrides whatever color transform was applied to that area,
    #    ensuring photos are 100% pixel-perfect originals.
    for img_info in image_info_list:
        xref = img_info.get("xref", 0)
        if xref <= 0:
            continue
        bbox = fitz.Rect(img_info.get("bbox", (0, 0, 0, 0)))
        if bbox.is_empty or bbox.width < 2 or bbox.height < 2:
            continue
        try:
            img_dict = doc.extract_image(xref)
            img_bytes = img_dict["image"]

            smask_xref = img_info.get("smask", 0)
            if smask_xref > 0:
                try:
                    mask_bytes = doc.extract_image(smask_xref)["image"]
                    new_page.insert_image(bbox, stream=img_bytes, mask=mask_bytes,
                                          keep_proportion=False)
                except Exception:
                    new_page.insert_image(bbox, stream=img_bytes, keep_proportion=False)
            else:
                new_page.insert_image(bbox, stream=img_bytes, keep_proportion=False)

        except Exception as e:
            print(f"\n  [warn] xref={xref} skip: {e}")

    return url_spans


# ── Main ──────────────────────────────────────────────────────────────────────

def process_pdf(input_path, output_path):
    doc = fitz.open(input_path)
    new_doc = fitz.open()
    total = len(doc)
    found_any_url = []

    print(f"Processing {total} pages...")
    for i in range(total):
        sys.stdout.write(f"\r  Page {i+1}/{total}...")
        sys.stdout.flush()
        spans = process_page(doc, i, new_doc)
        if spans:
            found_any_url.extend([(i+1, s["text"]) for s in spans])

    if found_any_url:
        print(f"\n  URLs replaced: {found_any_url[:5]}")
    else:
        print("\n  [warn] No URL found in footer — nothing replaced.")

    print(f"Saving to {output_path}...")
    new_doc.save(output_path, garbage=4, deflate=True)
    new_doc.close()
    doc.close()
    print("Done! Dark luxury v2 complete.")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python3 redesign_catalog_dark.py input.pdf output.pdf")
        sys.exit(1)
    print(f"Dark luxury redesign v2: {sys.argv[1]} → {sys.argv[2]}")
    process_pdf(sys.argv[1], sys.argv[2])
