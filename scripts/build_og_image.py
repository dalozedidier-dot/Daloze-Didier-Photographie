from pathlib import Path
from PIL import Image, ImageDraw, ImageEnhance, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "Félins" / "2.jpg"
OUTPUT = ROOT / "assets" / "og-image.jpg"
SIZE = (1200, 630)


def font(path, size):
    try:
        return ImageFont.truetype(path, size=size)
    except OSError:
        return ImageFont.load_default()


image = Image.open(SOURCE).convert("RGB")
image = ImageOps.fit(image, SIZE, method=Image.Resampling.LANCZOS, centering=(0.58, 0.5))
image = ImageEnhance.Contrast(image).enhance(1.03)

# Assombrit progressivement la partie gauche pour garder la photographie visible
# tout en assurant la lisibilité de la carte lors d'un partage.
overlay = Image.new("RGBA", SIZE, (0, 0, 0, 0))
pixels = overlay.load()
for x in range(SIZE[0]):
    t = x / SIZE[0]
    alpha = int(225 * max(0, 1 - (t / 0.74)) ** 1.35)
    for y in range(SIZE[1]):
        pixels[x, y] = (8, 8, 8, alpha)

image = Image.alpha_composite(image.convert("RGBA"), overlay)
draw = ImageDraw.Draw(image)

serif = "/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf"
serif_bold = "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf"
sans = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
sans_bold = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"

gold = (214, 183, 128, 255)
cream = (244, 240, 232, 255)
muted = (205, 199, 188, 255)

x = 70
draw.text((x, 72), "DIDIER DALOZE", font=font(sans_bold, 25), fill=cream)
draw.text((x, 111), "P H O T O G R A P H I E", font=font(sans, 17), fill=gold)
draw.line((x, 156, 435, 156), fill=gold, width=2)

draw.text((x, 198), "Regarder plus", font=font(serif, 66), fill=cream)
draw.text((x, 270), "longtemps.", font=font(serif, 66), fill=cream)

draw.text(
    (x, 505),
    "Photographie animalière · paysages · Belgique",
    font=font(sans, 20),
    fill=muted,
)

OUTPUT.parent.mkdir(parents=True, exist_ok=True)
image.convert("RGB").save(OUTPUT, "JPEG", quality=91, optimize=True, progressive=True)
print(f"Open Graph image generated: {OUTPUT} ({SIZE[0]}x{SIZE[1]})")
