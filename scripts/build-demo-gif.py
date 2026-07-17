from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"
OUT = ASSETS / "nexus-ai-demo.gif"
POSTER = ASSETS / "nexus-ai-demo-poster.png"

SIZE = (1280, 720)
BG = (244, 248, 243)
INK = (21, 34, 29)
MUTED = (91, 111, 101)
GREEN = (42, 111, 92)
TEAL = (46, 143, 145)
GOLD = (184, 132, 44)
CLAY = (197, 111, 79)


def font(name, size):
    font_dir = Path("C:/Windows/Fonts")
    choices = {
        "regular": ["Inter-Regular.ttf", "arial.ttf", "segoeui.ttf"],
        "bold": ["Inter-Bold.ttf", "arialbd.ttf", "segoeuib.ttf"],
        "black": ["arialbd.ttf", "segoeuib.ttf"],
    }
    for candidate in choices[name]:
        path = font_dir / candidate
        if path.exists():
            return ImageFont.truetype(str(path), size)
    return ImageFont.load_default()


F_TITLE = font("black", 62)
F_H1 = font("black", 44)
F_H2 = font("bold", 28)
F_BODY = font("regular", 24)
F_SMALL = font("bold", 16)
F_TAG = font("bold", 15)


def rounded(draw, box, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def resize_cover(image, box_size):
    src_w, src_h = image.size
    box_w, box_h = box_size
    scale = max(box_w / src_w, box_h / src_h)
    new_size = (int(src_w * scale), int(src_h * scale))
    resized = image.resize(new_size, Image.Resampling.LANCZOS)
    left = max(0, (new_size[0] - box_w) // 2)
    top = max(0, (new_size[1] - box_h) // 2)
    return resized.crop((left, top, left + box_w, top + box_h))


def screenshot_panel(source, crop, target_size):
    image = Image.open(ASSETS / source).convert("RGB").crop(crop)
    panel = resize_cover(image, target_size)
    return panel


def draw_header(draw):
    rounded(draw, (44, 34, 104, 94), 16, GREEN)
    draw.text((59, 51), "NX", fill=(255, 255, 255), font=F_H2)
    draw.text((122, 40), "NEXUS AI", fill=INK, font=F_H2)
    draw.text((122, 72), "Career command center for college students", fill=MUTED, font=F_TAG)


def draw_browser_frame(canvas, image, x, y, w, h):
    draw = ImageDraw.Draw(canvas)
    rounded(draw, (x, y, x + w, y + h), 20, (255, 255, 255), (216, 228, 220), 2)
    draw.rectangle((x, y, x + w, y + 38), fill=(238, 245, 239))
    for index, color in enumerate([(197, 111, 79), (184, 132, 44), (46, 143, 145)]):
        draw.ellipse((x + 18 + index * 20, y + 14, x + 30 + index * 20, y + 26), fill=color)
    screenshot = image.resize((w - 28, h - 54), Image.Resampling.LANCZOS)
    canvas.paste(screenshot, (x + 14, y + 44))


def draw_tags(draw, tags, start_x, y):
    x = start_x
    for label, color in tags:
        text_box = draw.textbbox((0, 0), label, font=F_TAG)
        width = text_box[2] - text_box[0] + 24
        rounded(draw, (x, y, x + width, y + 34), 17, color)
        draw.text((x + 12, y + 9), label, fill=(255, 255, 255), font=F_TAG)
        x += width + 10


def slide(title, eyebrow, body, source, crop, tags, accent=GREEN):
    canvas = Image.new("RGB", SIZE, BG)
    draw = ImageDraw.Draw(canvas)
    draw_header(draw)

    draw.text((56, 150), eyebrow.upper(), fill=accent, font=F_SMALL)
    draw.text((56, 178), title, fill=INK, font=F_H1)

    y = 250
    for line in body:
        draw.text((58, y), line, fill=MUTED, font=F_BODY)
        y += 36

    draw_tags(draw, tags, 58, 392)

    panel = screenshot_panel(source, crop, (706, 520))
    draw_browser_frame(canvas, panel, 520, 124, 704, 538)

    draw.line((58, 475, 360, 475), fill=accent, width=7)
    draw.line((58, 498, 290, 498), fill=GOLD, width=7)
    draw.line((58, 521, 430, 521), fill=TEAL, width=7)
    return canvas


def cover_slide():
    canvas = Image.new("RGB", SIZE, BG)
    draw = ImageDraw.Draw(canvas)
    draw_header(draw)

    draw.text((56, 155), "CAREER OPERATING SYSTEM", fill=GOLD, font=F_SMALL)
    draw.text((54, 194), "Nexus AI", fill=INK, font=F_TITLE)
    draw.text((58, 278), "Connect applications, projects,", fill=MUTED, font=F_BODY)
    draw.text((58, 314), "certifications, networking, and goals.", fill=MUTED, font=F_BODY)
    draw_tags(draw, [("Deployed backend", GREEN), ("Resume coach", TEAL), ("93/100 readiness", GOLD)], 58, 390)

    panel = screenshot_panel("nexus-dashboard.png", (0, 0, 2880, 2250), (720, 520))
    draw_browser_frame(canvas, panel, 500, 124, 724, 538)
    return canvas


slides = [
    cover_slide(),
    slide(
        "Dashboard",
        "Readiness signals",
        ["A single workspace turns scattered", "career prep into weekly priorities."],
        "nexus-dashboard.png",
        (0, 450, 2880, 3000),
        [("AI Coach", GREEN), ("Weekly plan", GOLD), ("Pipeline analytics", TEAL)],
        GREEN,
    ),
    slide(
        "Resume Coach",
        "Portfolio proof",
        ["Resume notes become measurable", "project stories and skill evidence."],
        "nexus-resume-coach.png",
        (0, 850, 2880, 3300),
        [("88/100 strength", GREEN), ("Public proof", TEAL), ("Skill alignment", GOLD)],
        TEAL,
    ),
    slide(
        "Case Study",
        "Product thinking",
        ["The app explains the problem,", "system design, evidence, and roadmap."],
        "nexus-case-study.png",
        (0, 450, 2880, 3000),
        [("Problem", CLAY), ("System design", GREEN), ("Next version", GOLD)],
        CLAY,
    ),
]


frames = []
durations = []
for index, slide_image in enumerate(slides):
    frames.append(slide_image)
    durations.append(1500)

    if index < len(slides) - 1:
        next_slide = slides[index + 1]
        for step in range(1, 7):
            frames.append(Image.blend(slide_image, next_slide, step / 7))
            durations.append(70)

slides[0].save(POSTER, quality=95)
frames[0].save(
    OUT,
    save_all=True,
    append_images=frames[1:],
    duration=durations,
    loop=0,
    optimize=True,
)

print(f"Wrote {OUT}")
print(f"Wrote {POSTER}")
