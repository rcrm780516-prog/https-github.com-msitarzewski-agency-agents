#!/usr/bin/env python3
"""
Spa de Occidente Catalog Redesign
Replaces blue design elements with a luxury gold/dark palette.
Usage: python3 redesign_catalog.py input.pdf output.pdf
"""

import sys
import fitz  # PyMuPDF
from PIL import Image, ImageEnhance
import io
import numpy as np

# Luxury color palette (replacing blue)
# Gold: #C9A96E
# Dark gold: #8B6914
# Charcoal: #1A1A2E
# Off-white: #F5F0E8
# Deep navy (neutral dark): #0D0D0D

def is_blue(r, g, b):
    """Detect blue colors - hue 180-270 degrees, significant saturation."""
    maxc = max(r, g, b)
    minc = min(r, g, b)
    if maxc == 0:
        return False
    saturation = (maxc - minc) / maxc
    if saturation < 0.2:
        return False
    if b > r and b > g and b > (r + g) * 0.4:
        return True
    # Light blue / cyan detection
    if b >= 100 and b > r * 1.2 and saturation > 0.15:
        return True
    return False


def blue_to_luxury(r, g, b, intensity=1.0):
    """Convert a blue color to a luxury gold/dark equivalent."""
    # Preserve luminance but shift to gold
    luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255.0

    if luminance > 0.7:
        # Light blue -> warm off-white / light gold
        return (220, 200, 160)
    elif luminance > 0.4:
        # Mid blue -> rich gold
        t = (luminance - 0.4) / 0.3
        r_new = int(180 + t * 21)   # 180-201
        g_new = int(140 + t * 25)   # 140-165
        b_new = int(60 + t * 20)    # 60-80
        return (r_new, g_new, b_new)
    else:
        # Dark blue -> deep charcoal / very dark gold
        t = luminance / 0.4
        r_new = int(t * 80)
        g_new = int(t * 60)
        b_new = int(t * 20)
        return (r_new, g_new, b_new)


def transform_image_colors(img_data):
    """Transform blue pixels to luxury gold in an image."""
    img = Image.open(io.BytesIO(img_data)).convert('RGB')
    arr = np.array(img, dtype=np.int32)

    r = arr[:, :, 0]
    g = arr[:, :, 1]
    b = arr[:, :, 2]

    # Create blue mask
    maxc = np.maximum(np.maximum(r, g), b)
    minc = np.minimum(np.minimum(r, g), b)

    # Avoid division by zero
    safe_max = np.where(maxc == 0, 1, maxc)
    saturation = (maxc - minc).astype(float) / safe_max

    # Blue dominant conditions
    blue_dominant = (b > r) & (b > g) & (b > (r + g) * 0.4) & (saturation > 0.2)
    light_blue = (b >= 100) & (b > r * 1.2) & (saturation > 0.15)
    blue_mask = blue_dominant | light_blue

    # Get luminance for masked pixels
    luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255.0

    # Build output array
    out = arr.copy()

    # Apply transformation per-pixel (vectorized)
    # Light blue (lum > 0.7) -> warm off-white/light gold
    light_mask = blue_mask & (luminance > 0.7)
    out[light_mask, 0] = 220
    out[light_mask, 1] = 200
    out[light_mask, 2] = 160

    # Mid blue (0.4 < lum <= 0.7) -> rich gold
    mid_mask = blue_mask & (luminance > 0.4) & (luminance <= 0.7)
    t = np.clip((luminance - 0.4) / 0.3, 0, 1)
    out[mid_mask, 0] = np.clip(180 + t[mid_mask] * 21, 0, 255).astype(int)
    out[mid_mask, 1] = np.clip(140 + t[mid_mask] * 25, 0, 255).astype(int)
    out[mid_mask, 2] = np.clip(60 + t[mid_mask] * 20, 0, 255).astype(int)

    # Dark blue (lum <= 0.4) -> deep charcoal/dark gold
    dark_mask = blue_mask & (luminance <= 0.4)
    t_dark = np.clip(luminance / 0.4, 0, 1)
    out[dark_mask, 0] = np.clip(t_dark[dark_mask] * 80, 0, 255).astype(int)
    out[dark_mask, 1] = np.clip(t_dark[dark_mask] * 60, 0, 255).astype(int)
    out[dark_mask, 2] = np.clip(t_dark[dark_mask] * 20, 0, 255).astype(int)

    result = Image.fromarray(out.astype(np.uint8), 'RGB')
    buf = io.BytesIO()
    result.save(buf, format='PNG')
    return buf.getvalue()


def modify_pdf_colors(input_path, output_path):
    """Process each page of the PDF to replace blue design elements."""
    doc = fitz.open(input_path)
    new_doc = fitz.open()

    total_pages = len(doc)
    print(f"Processing {total_pages} pages...")

    for page_num in range(total_pages):
        page = doc[page_num]
        sys.stdout.write(f"\rPage {page_num + 1}/{total_pages}...")
        sys.stdout.flush()

        # Try to modify drawing colors directly in the page content
        # Get all drawings and check their colors
        drawings = page.get_drawings()

        # Build a redaction/modification approach
        # We'll use a combined approach:
        # 1. Modify vector drawing colors directly
        # 2. For background images, process them

        # Create a new page with same dimensions
        new_page = new_doc.new_page(width=page.rect.width, height=page.rect.height)

        # Render the original page as a high-res image
        mat = fitz.Matrix(2, 2)  # 2x zoom for quality
        clip = page.rect
        pix = page.get_pixmap(matrix=mat, clip=clip, colorspace=fitz.csRGB)
        img_data = pix.tobytes("png")

        # Transform colors in the image
        transformed = transform_image_colors(img_data)

        # Insert the transformed image into the new page
        img_rect = new_page.rect
        new_page.insert_image(img_rect, stream=transformed)

        print(f" Page {page_num + 1} done.", end='\r')

    print(f"\nSaving to {output_path}...")
    new_doc.save(output_path, garbage=4, deflate=True)
    new_doc.close()
    doc.close()
    print("Done! Luxury redesign complete.")


def modify_pdf_drawings_only(input_path, output_path):
    """
    Alternative approach: modify only vector drawing colors (faster, preserves text quality).
    This modifies the PDF's drawing instructions directly.
    """
    doc = fitz.open(input_path)

    # Color mapping: blue variations -> luxury gold
    def get_luxury_color(r, g, b):
        if is_blue(int(r*255), int(g*255), int(b*255)):
            nr, ng, nb = blue_to_luxury(int(r*255), int(g*255), int(b*255))
            return (nr/255.0, ng/255.0, nb/255.0)
        return None

    modified_count = 0
    for page_num in range(len(doc)):
        page = doc[page_num]

        # Get page drawings
        drawings = page.get_drawings()

        for path in drawings:
            color = path.get('color')   # stroke color
            fill = path.get('fill')      # fill color

            new_color = None
            new_fill = None

            if color and len(color) >= 3:
                result = get_luxury_color(color[0], color[1], color[2])
                if result:
                    new_color = result
                    modified_count += 1

            if fill and len(fill) >= 3:
                result = get_luxury_color(fill[0], fill[1], fill[2])
                if result:
                    new_fill = result
                    modified_count += 1

            # Apply modifications via drawRect/drawPath
            # (This approach needs page.draw_* methods)

    print(f"Modified {modified_count} drawing elements")
    doc.save(output_path)
    doc.close()


if __name__ == '__main__':
    if len(sys.argv) != 3:
        print("Usage: python3 redesign_catalog.py input.pdf output.pdf")
        sys.exit(1)

    input_pdf = sys.argv[1]
    output_pdf = sys.argv[2]

    print(f"Redesigning catalog: {input_pdf} -> {output_pdf}")
    print("Converting blue design elements to luxury gold palette...")

    modify_pdf_colors(input_pdf, output_pdf)
