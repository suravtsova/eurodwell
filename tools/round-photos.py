"""Обрезает фото сотрудников в круг.

Берёт каждый файл из photos/ (jpg, jpeg, png, webp — любой размер и пропорции),
вырезает квадрат по центру, делает круг 300×300 с тонкой серой рамкой и
сохраняет в dist/assets/photos/<имя файла>.png.

Круг «зашит» в PNG, потому что Outlook не поддерживает border-radius.
Запуск: python3 tools/round-photos.py   (нужен Pillow: pip install pillow)
"""
from pathlib import Path

from PIL import Image, ImageDraw, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "photos"
OUT = ROOT / "dist" / "assets" / "photos"
SIZE = 300
SCALE = 4  # рисуем крупнее и уменьшаем — так края круга гладкие
RING = (60, 60, 60, 255)

OUT.mkdir(parents=True, exist_ok=True)

for src in sorted(SRC.iterdir()):
    if src.suffix.lower() not in {".jpg", ".jpeg", ".png", ".webp"}:
        continue
    img = ImageOps.exif_transpose(Image.open(src)).convert("RGB")
    side = min(img.size)
    left, top = (img.width - side) // 2, (img.height - side) // 2
    img = img.crop((left, top, left + side, top + side)).resize((SIZE, SIZE), Image.LANCZOS)

    big = SIZE * SCALE
    mask = Image.new("L", (big, big), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, big - 1, big - 1), fill=255)
    out = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    out.paste(img, (0, 0), mask.resize((SIZE, SIZE), Image.LANCZOS))

    ring = Image.new("RGBA", (big, big), (0, 0, 0, 0))
    ImageDraw.Draw(ring).ellipse((4, 4, big - 5, big - 5), outline=RING, width=2 * SCALE)
    out = Image.alpha_composite(out, ring.resize((SIZE, SIZE), Image.LANCZOS))

    dest = OUT / f"{src.stem}.png"
    out.save(dest, optimize=True)
    print(f"✔ {dest.relative_to(ROOT)}")
