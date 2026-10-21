"""
Builds the downloadable hamper catalogue (public/downloads/gharelu-diwali-hampers.pdf)
in the same design as the Rakhi hampers catalogue: 1414x2000 px pages (Canva
size), Cooper Black titles, DejaVu Sans text, and the cookie + GHARELU.BAKE
logo cut straight out of the Rakhi PDF. Names, prices, weights and contents
come from src/data/corporateGifts.json, so the PDF always matches the site.

    python scripts/build-hamper-catalogue.py

Needs Pillow, reportlab and pypdf. Fonts: Cooper Black (Windows) and DejaVu Sans
(bundled with matplotlib).
"""
import colorsys
import io
import json
import os

import pypdf
from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont, ImageOps
from reportlab.lib.utils import ImageReader
from reportlab.pdfgen import canvas

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLIC = os.path.join(ROOT, "public")
OUT = os.path.join(PUBLIC, "downloads", "gharelu-diwali-hampers.pdf")
# The Rakhi catalogue supplies the cookie, logo and footer artwork.
RAKHI_PDF = os.path.join(os.path.dirname(ROOT), "rakhi-hampers.pdf")

W, H = 1414, 2000
GOLD = (255, 194, 0)
TITLE_SHADOW = (122, 40, 16)
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)

WHATSAPP = "8556800788"
TAGLINE = "Har Rishte Ke Liye, Ek Gharelu Tohfa."
ADDRESS = ["UNIT: 38, Ground Floor, Orbit Signature walk,", "VIP Road, Zirakpur, Punjab, India - 140603"]
COVER_PHOTO = "/images/hampers/evergreen-1.jpg"
ORDER = ["luxe-hamper", "classic-hamper-pro", "signature-hamper-pro", "luxe-hamper-pro"]
# One-line blurbs for the price list page (the Rakhi page has one per hamper).
BLURBS = {
    "luxe-hamper": "Generously sized jars of our finest eggless bakes.",
    "classic-hamper-pro": "A delightful assortment of 6 handcrafted eggless bakes.",
    "signature-hamper-pro": "Four glass jars of festive favourites, made for small families.",
    "luxe-hamper-pro": "Gourmet eggless bakes, spiced dry fruits and fine chocolates.",
}

COOPER = "C:/Windows/Fonts/COOPBL.TTF"
DEJAVU_DIR = os.path.join(os.path.dirname(os.__file__), "site-packages", "matplotlib", "mpl-data", "fonts", "ttf")
SANS = os.path.join(DEJAVU_DIR, "DejaVuSans.ttf")
SANS_BOLD = os.path.join(DEJAVU_DIR, "DejaVuSans-Bold.ttf")


def font_for_width(path, text, width):
    """Font size at which `text` is `width` px wide (sizes were measured off the Rakhi pages)."""
    ref = ImageFont.truetype(path, 100).getlength(text)
    return ImageFont.truetype(path, max(8, round(100 * width / ref)))


# Sizes calibrated against the Rakhi catalogue.
F_TITLE = font_for_width(COOPER, "CLASSIC HAMPER", 945)
F_NUM = ImageFont.truetype(COOPER, 38)
F_PILL1 = font_for_width(SANS_BOLD, "WHAT'S INSIDE: 750g", 250)
F_PILL2 = font_for_width(SANS_BOLD, "Premium Rakhi • Sindhoor • Rice", 319)
F_ITEM = font_for_width(SANS, "01 Choco Chip Cookies", 278)
F_PRICE = font_for_width(SANS_BOLD, "₹1,090/-", 238)
F_LABEL = font_for_width(SANS, "CLASSIC  HAMPER", 161)
F_TAG = font_for_width(SANS, "Made for the sibling who deserves more than a WhatsApp message.", 769)
F_COVER_TITLE = font_for_width(COOPER, "HAMPERS", 534)
F_COVER_SMALL = font_for_width(SANS, "RAKSHABANDHAN COLLECTION", 282)
F_COVER_SUB = font_for_width(SANS, "SWEET TREATS. SIBLING CHAOS. A RAKHI WORTH REMEMBERING.", 748)
F_COVER_LINE = font_for_width(SANS, "Freshly Baked • Thoughtfully packed • 100% eggless", 602)
F_HEAD = font_for_width(SANS, "CONNECTION.", 328)
F_HEAD_SUB = font_for_width(SANS, "A little something for every kind of sibling.", 364)
F_ROW_NAME = font_for_width(SANS_BOLD, "SIGNATURE", 230)
F_ROW_PRICE = font_for_width(SANS_BOLD, "₹1,090/-", 234)
F_ROW_DESC = font_for_width(SANS, "Simple, nostalgic & full of bakery favourites.", 518)
F_ADDR = font_for_width(SANS, "UNIT: 38, Ground Floor, Orbit Signature walk,", 458)
F_WA = font_for_width(SANS_BOLD, "WHATSAPP:", 136)


def rakhi_pages():
    reader = pypdf.PdfReader(RAKHI_PDF)
    return [p.images[0].image.convert("RGB") for p in reader.pages]


def load_photo(path):
    return ImageOps.exif_transpose(Image.open(os.path.join(PUBLIC, path.lstrip("/")))).convert("RGB")


def cover_fit(im, w, h):
    scale = max(w / im.width, h / im.height)
    im = im.resize((round(im.width * scale), round(im.height * scale)), Image.LANCZOS)
    left, top = (im.width - w) // 2, (im.height - h) // 2
    return im.crop((left, top, left + w, top + h))


def darken(im, top=0.0, left=0.0, right=0.0):
    """Fades the top, left and right edges of `im` towards black so white text stays readable."""
    w, h = im.size
    col = Image.new("L", (1, h))
    col.putdata([int(255 * min(max(0.0, 1 - y / (h * 0.6)) * top, 0.85)) for y in range(h)])
    mask = col.resize((w, h))
    if left:
        row = Image.new("L", (w, 1))
        row.putdata([int(255 * min(max(0.0, 1 - x / (w * 0.7)) * left, 0.85)) for x in range(w)])
        mask = ImageChops.lighter(mask, row.resize((w, h)))
    if right:
        row = Image.new("L", (w, 1))
        row.putdata([int(255 * min(max(0.0, (x / w - 0.62) / 0.38) * right, 0.85)) for x in range(w)])
        mask = ImageChops.lighter(mask, row.resize((w, h)))
    return Image.composite(Image.new("RGB", im.size, BLACK), im, mask)


def overlay(img, box, fill, radius=0):
    """Draws a translucent rounded rectangle (RGBA fill) onto `img`."""
    layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    ImageDraw.Draw(layer).rounded_rectangle(box, radius=radius, fill=fill)
    img.paste(Image.alpha_composite(img.convert("RGBA"), layer).convert("RGB"))


def cookie_cutout(page, box, bg, photo_bottom):
    """Cookie + crumbs from a Rakhi page as RGBA: below `photo_bottom` anything unlike the
    pink background, above it (over the photo) the saturated orange/brown pixels."""
    x0, y0, x1, y1 = box
    reg = page.crop(box)
    out = Image.new("RGBA", reg.size, (0, 0, 0, 0))
    src, dst = reg.load(), out.load()
    for y in range(reg.height):
        for x in range(reg.width):
            r, g, b = src[x, y]
            if y0 + y >= photo_bottom:
                if abs(r - bg[0]) + abs(g - bg[1]) + abs(b - bg[2]) > 45:
                    dst[x, y] = (r, g, b, 255)
            else:
                h, s, v = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
                if 0.04 < h < 0.12 and s > 0.45 and v > 0.28:
                    dst[x, y] = (r, g, b, 255)
    return out


def black_on_transparent(im):
    """Keeps only the dark logo pixels so its slightly different pink never shows as a patch."""
    alpha = im.convert("L").point(lambda v: 255 if v < 90 else 0 if v > 200 else int(255 * (200 - v) / 110))
    out = Image.new("RGBA", im.size, (0, 0, 0, 0))
    out.putalpha(alpha)
    return out


class Assets:
    def __init__(self):
        pages = rakhi_pages()
        p2, p1, p8 = pages[1], pages[0], pages[7]
        self.pink = p2.getpixel((20, 20))
        self.price_pink = p8.getpixel((80, 300))
        # Inner pages: cookie sits bottom-left of the footer band (crumbs rise into the photo).
        # Frame lines (x=56, y=1945) and the logo's edge are excluded from the cut.
        self.cookie = cookie_cutout(p2, (62, 1380, 345, 1930), self.pink, 1522)
        self.logo = p2.crop((360, 1560, 1100, 1800))        # GHARELU. BAKE on pink
        # Cover: cookie bottom-right, WhatsApp icon + number bottom-left.
        self.cover_cookie = cookie_cutout(p1, (1100, 1500, 1414, 2000), p1.getpixel((20, 20)), 1576)
        self.cover_logo = p1.crop((370, 1590, 1110, 1850))
        self.cover_wa = p1.crop((10, 1740, 340, 1860))
        # Price list page logo (black on pink).
        self.price_logo = black_on_transparent(p8.crop((490, 1410, 930, 1570)))


def new_page(bg):
    return Image.new("RGB", (W, H), bg)


def frame(img, box):
    ImageDraw.Draw(img).rectangle(box, outline=(90, 90, 90), width=2)


def pill_text(d, h):
    weight = (h.get("weight") or "").replace(" ", "")
    d.text((150, 277), f"WHAT'S INSIDE: {weight}" if weight else "WHAT'S INSIDE", font=F_PILL1, fill=WHITE, anchor="lm")
    extra = f"{h['cookies']} pieces • " if h.get("cookies") else ""
    d.text((154, 308), f"{extra}100% eggless", font=F_PILL2, fill=WHITE, anchor="lm")


def title_block(img, h, n):
    overlay(img, (97, 254, 615, 333), (255, 255, 255, 84), 40)
    d = ImageDraw.Draw(img)
    d.text((92, 118), f"{n:02d}", font=F_NUM, fill=GOLD, anchor="lm")
    name = h["name"].upper()
    d.text((148, 215), name, font=F_TITLE, fill=TITLE_SHADOW, anchor="ls")
    d.text((145, 212), name, font=F_TITLE, fill=GOLD, anchor="ls")
    pill_text(d, h)


def price_text(h):
    return f"₹{h['price']:,}/-" if h.get("price") is not None else "Price on request"


def inner_footer(img, assets, photo_bottom=1522):
    d = ImageDraw.Draw(img)
    d.rectangle((57, photo_bottom, 1359, 1944), fill=assets.pink)
    img.paste(assets.logo, (360, 1560))
    d.rectangle((360, 1830, 1200, 1880), fill=assets.pink)
    d.text((368, 1856), TAGLINE, font=F_TAG, fill=BLACK, anchor="lm")
    img.paste(assets.cookie, (62, 1380), assets.cookie)
    frame(img, (56, 45, 1359, 1945))


def hamper_main(assets, h, n):
    img = new_page(assets.pink)
    photo = darken(cover_fit(load_photo(h["images"][0]), 1302, 1476), top=0.6, left=0.55, right=0.5)
    img.paste(photo, (57, 46))
    title_block(img, h, n)
    d = ImageDraw.Draw(img)
    for i, item in enumerate(h.get("includes") or h.get("items") or []):
        d.text((121, 407 + 64 * i), f"{i + 1:02d} {item}", font=F_ITEM, fill=WHITE, anchor="lm")
    d.text((1348, 900), price_text(h), font=F_PRICE, fill=WHITE, anchor="rm")
    d.text((1117, 960), h["name"].upper().replace(" ", "  "), font=F_LABEL, fill=WHITE, anchor="lm")
    inner_footer(img, assets)
    return img


def hamper_gallery(assets, h, n):
    img = new_page(assets.pink)
    imgs = h["images"]
    bg = cover_fit(load_photo(imgs[0]), 1302, 1476).filter(ImageFilter.GaussianBlur(6))
    img.paste(darken(bg, top=0.6), (57, 46))
    title_block(img, h, n)
    d = ImageDraw.Draw(img)
    d.text((144, 398), price_text(h), font=F_PRICE, fill=WHITE, anchor="lm")
    overlay(img, (108, 546, 1304, 1372), (255, 255, 255, 96), 36)
    for i, idx in enumerate((1, 2)):
        pic = cover_fit(load_photo(imgs[min(idx, len(imgs) - 1)]), 432, 650)
        mask = Image.new("L", pic.size, 0)
        ImageDraw.Draw(mask).rounded_rectangle((0, 0, pic.width - 1, pic.height - 1), radius=26, fill=255)
        img.paste(pic, (190 + i * 572, 620), mask)
    inner_footer(img, assets)
    return img


def cover(assets, hampers):
    img = new_page(assets.pink)
    photo = darken(cover_fit(load_photo(COVER_PHOTO), 1272, 1542), top=0.55)
    img.paste(photo, (82, 34))
    d = ImageDraw.Draw(img)
    d.text((706, 100), "DIWALI COLLECTION", font=F_COVER_SMALL, fill=WHITE, anchor="mm")
    for text, y in (("DIWALI", 200), ("HAMPERS", 310)):
        d.text((711, y + 3), text, font=F_COVER_TITLE, fill=TITLE_SHADOW, anchor="mm")
        d.text((708, y), text, font=F_COVER_TITLE, fill=GOLD, anchor="mm")
    d.text((718, 400), TAGLINE.upper(), font=F_COVER_SUB, fill=WHITE, anchor="mm")
    overlay(img, (130, 528, 1340, 608), (0, 0, 0, 120), 40)
    d.text((734, 568), "Freshly Baked • Thoughtfully packed • 100% eggless", font=F_COVER_LINE, fill=WHITE, anchor="mm")
    d.rectangle((0, 1576, W, H), fill=assets.pink)
    img.paste(assets.cover_logo, (370, 1590))
    img.paste(assets.cover_wa, (10, 1740))
    d.text((718, 1900), TAGLINE, font=F_TAG, fill=BLACK, anchor="mm")
    img.paste(assets.cover_cookie, (1100, 1500), assets.cover_cookie)
    return img


def price_list(assets, hampers):
    img = new_page(assets.price_pink)
    d = ImageDraw.Draw(img)
    d.rectangle((76, 64, 1334, 1884), outline=(90, 90, 90), width=2)
    for text, y in (("DIWALI.", 274), ("HAMPERS.", 344), ("GIFTING.", 418)):
        d.text((136, y), text, font=F_HEAD, fill=(20, 20, 20), anchor="lm")
    d.text((136, 510), TAGLINE, font=F_HEAD_SUB, fill=(20, 20, 20), anchor="lm")

    top, pitch = 622, 158
    d.rectangle((142, top, 1272, top + pitch * len(hampers)), outline=(60, 60, 60), width=2)
    for i, h in enumerate(hampers):
        y = top + pitch * i
        if i:
            d.line((142, y, 1272, y), fill=(60, 60, 60), width=2)
        d.text((162, y + 58), h["name"].upper().replace(" HAMPER", ""), font=F_ROW_NAME, fill=(20, 20, 20), anchor="lm")
        d.text((1250, y + 58), price_text(h), font=F_ROW_PRICE, fill=(20, 20, 20), anchor="rm")
        d.line((142, y + 92, 1272, y + 92), fill=(60, 60, 60), width=1)
        d.text((162, y + 126), BLURBS.get(h["id"], ""), font=F_ROW_DESC, fill=(30, 30, 30), anchor="lm")

    img.paste(assets.price_logo, (490, 1410), assets.price_logo)
    for text, y in zip(ADDRESS, (1636, 1666)):
        d.text((707, y), text, font=F_ADDR, fill=BLACK, anchor="mm")
    d.text((707, 1784), "WHATSAPP:", font=F_WA, fill=BLACK, anchor="mm")
    d.text((707, 1812), WHATSAPP, font=F_WA, fill=BLACK, anchor="mm")
    return img


def main():
    data = json.load(open(os.path.join(ROOT, "src", "data", "corporateGifts.json"), encoding="utf-8"))
    hampers = sorted((h for h in data if h["id"] in ORDER), key=lambda h: ORDER.index(h["id"]))
    assets = Assets()

    pages = [cover(assets, hampers)]
    for n, h in enumerate(hampers, 1):
        pages += [hamper_main(assets, h, n), hamper_gallery(assets, h, n)]
    pages.append(price_list(assets, hampers))

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    c = canvas.Canvas(OUT, pagesize=(288, 432))
    c.setTitle("Gharelu.Bake · Diwali Hampers")
    c.setAuthor("Gharelu.Bake")
    for page in pages:
        buf = io.BytesIO()
        page.save(buf, "JPEG", quality=90)
        buf.seek(0)
        c.drawImage(ImageReader(buf), 0, 0, 288, 432)
        c.showPage()
    c.save()
    print(f"{len(hampers)} hampers, {len(pages)} pages, {os.path.getsize(OUT) // 1024} KB -> {OUT}")


if __name__ == "__main__":
    main()
