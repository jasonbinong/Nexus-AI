from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"
OUT = ASSETS / "nexus-ai-demo.gif"
POSTER = ASSETS / "nexus-ai-demo-poster.png"

SIZE = (1280, 720)
BG = (244, 248, 243)
PANEL = (255, 255, 252)
INK = (21, 34, 29)
MUTED = (91, 111, 101)
LINE = (214, 226, 218)
GREEN = (42, 111, 92)
TEAL = (46, 143, 145)
GOLD = (184, 132, 44)
CLAY = (197, 111, 79)
SOFT = (232, 241, 233)
DARK = (18, 35, 31)


def font(weight, size):
    font_dir = Path("C:/Windows/Fonts")
    candidates = {
        "regular": ["Inter-Regular.ttf", "segoeui.ttf", "arial.ttf"],
        "bold": ["Inter-Bold.ttf", "segoeuib.ttf", "arialbd.ttf"],
        "black": ["Inter-Black.ttf", "arialbd.ttf", "segoeuib.ttf"],
    }
    for name in candidates[weight]:
        path = font_dir / name
        if path.exists():
            return ImageFont.truetype(str(path), size)
    return ImageFont.load_default()


F_LOGO = font("black", 26)
F_TITLE = font("black", 56)
F_H1 = font("black", 42)
F_H2 = font("bold", 25)
F_BODY = font("regular", 22)
F_SMALL = font("bold", 15)
F_TINY = font("regular", 13)
F_NUM = font("black", 54)
F_SCORE = font("black", 42)


def rounded(draw, box, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def text(draw, xy, value, fill=INK, font_obj=F_BODY):
    draw.text(xy, value, fill=fill, font=font_obj)


def centered_text(draw, box, value, fill=INK, font_obj=F_BODY):
    left, top, right, bottom = box
    bbox = draw.textbbox((0, 0), value, font=font_obj)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    x = left + ((right - left) - tw) / 2
    y = top + ((bottom - top) - th) / 2 - 1
    draw.text((x, y), value, fill=fill, font=font_obj)


def draw_header(draw):
    rounded(draw, (44, 34, 104, 94), 16, GREEN)
    text(draw, (59, 50), "NX", (255, 255, 255), F_LOGO)
    text(draw, (122, 40), "NEXUS AI", INK, F_H2)
    text(draw, (122, 72), "Career command center for college students", MUTED, F_SMALL)


def draw_tag(draw, x, y, label, color):
    w = draw.textbbox((0, 0), label, font=F_SMALL)[2] + 26
    rounded(draw, (x, y, x + w, y + 32), 16, color)
    text(draw, (x + 13, y + 8), label, (255, 255, 255), F_SMALL)
    return x + w + 10


def draw_sidebar(draw, x, y, h):
    rounded(draw, (x, y, x + 66, y + h), 22, DARK)
    rounded(draw, (x + 13, y + 18, x + 53, y + 58), 12, GREEN)
    centered_text(draw, (x + 13, y + 18, x + 53, y + 58), "NX", (255, 255, 255), F_TINY)
    nav_colors = [(230, 244, 232), (48, 74, 67), (48, 74, 67), (48, 74, 67), (48, 74, 67)]
    for index, fill in enumerate(nav_colors):
        yy = y + 94 + index * 54
        rounded(draw, (x + 18, yy, x + 48, yy + 30), 10, fill)
        if index:
            draw.ellipse((x + 29, yy + 11, x + 37, yy + 19), fill=(166, 190, 181))


def draw_window(draw, x, y, w, h):
    rounded(draw, (x, y, x + w, y + h), 24, PANEL, LINE, 2)
    rounded(draw, (x, y, x + w, y + 44), 24, (238, 245, 239), LINE, 1)
    draw.rectangle((x, y + 26, x + w, y + 44), fill=(238, 245, 239))
    for index, color in enumerate([CLAY, GOLD, TEAL]):
        draw.ellipse((x + 22 + index * 22, y + 16, x + 34 + index * 22, y + 28), fill=color)


def progress(draw, x, y, w, pct, color):
    rounded(draw, (x, y, x + w, y + 10), 5, (225, 232, 228))
    rounded(draw, (x, y, x + int(w * pct), y + 10), 5, color)


def metric_card(draw, x, y, title, value, color):
    rounded(draw, (x, y, x + 150, y + 92), 14, PANEL, LINE, 1)
    text(draw, (x + 16, y + 16), title, MUTED, F_TINY)
    text(draw, (x + 16, y + 42), value, INK, F_H2)
    progress(draw, x + 16, y + 74, 118, 0.72, color)


def card(draw, box, title, eyebrow=None):
    rounded(draw, box, 18, PANEL, LINE, 2)
    x1, y1, _, _ = box
    if eyebrow:
        text(draw, (x1 + 22, y1 + 18), eyebrow.upper(), GOLD, F_SMALL)
        text(draw, (x1 + 22, y1 + 42), title, INK, F_H2)
    else:
        text(draw, (x1 + 22, y1 + 22), title, INK, F_H2)


def draw_score_ring(draw, cx, cy, score):
    radius = 58
    draw.ellipse((cx - radius, cy - radius, cx + radius, cy + radius), outline=(219, 230, 222), width=14)
    draw.arc((cx - radius, cy - radius, cx + radius, cy + radius), -90, 245, fill=GREEN, width=14)
    centered_text(draw, (cx - 40, cy - 35, cx + 40, cy + 18), score, INK, F_SCORE)
    centered_text(draw, (cx - 34, cy + 18, cx + 34, cy + 42), "score", MUTED, F_TINY)


def shell_slide():
    canvas = Image.new("RGB", SIZE, BG)
    draw = ImageDraw.Draw(canvas)
    draw_header(draw)

    text(draw, (56, 150), "CAREER OPERATING SYSTEM", GOLD, F_SMALL)
    text(draw, (54, 190), "Nexus AI", INK, F_TITLE)
    text(draw, (58, 280), "One workspace for applications,", MUTED, F_BODY)
    text(draw, (58, 316), "projects, networking, resumes,", MUTED, F_BODY)
    text(draw, (58, 352), "interviews, skills, and goals.", MUTED, F_BODY)
    x = 58
    for label, color in [("Applications", GREEN), ("Skills", TEAL), ("Goals", GOLD)]:
        x = draw_tag(draw, x, 424, label, color)

    draw_window(draw, 520, 116, 690, 520)
    text(draw, (594, 178), "Career Workspace", INK, F_H1)
    text(draw, (594, 228), "Everything that matters, connected.", MUTED, F_BODY)

    nodes = {
        "You": (872, 414, GREEN),
        "Apps": (736, 324, TEAL),
        "Resume": (1008, 324, GOLD),
        "Network": (736, 520, GREEN),
        "Goals": (1008, 520, CLAY),
    }
    for a, b in [("You", "Apps"), ("You", "Resume"), ("You", "Network"), ("You", "Goals")]:
        draw.line((nodes[a][0], nodes[a][1], nodes[b][0], nodes[b][1]), fill=(141, 170, 158), width=4)
    for label, (cx, cy, color) in nodes.items():
        radius = 38 if label == "You" else 32
        draw.ellipse((cx - radius, cy - radius, cx + radius, cy + radius), fill=SOFT if label != "You" else color, outline=color, width=4)
        centered_text(draw, (cx - radius, cy - radius, cx + radius, cy + radius), label, (255, 255, 255) if label == "You" else INK, F_TINY if label != "You" else F_SMALL)
    return canvas


def dashboard_slide():
    canvas = Image.new("RGB", SIZE, BG)
    draw = ImageDraw.Draw(canvas)
    draw_header(draw)
    text(draw, (56, 150), "READINESS DASHBOARD", GREEN, F_SMALL)
    text(draw, (54, 188), "From tracking", INK, F_H1)
    text(draw, (54, 238), "to next steps", INK, F_H1)
    text(draw, (58, 326), "Nexus turns your saved career data", MUTED, F_BODY)
    text(draw, (58, 362), "into a readiness score and plan.", MUTED, F_BODY)

    draw_window(draw, 502, 112, 724, 540)
    card(draw, (532, 174, 1188, 330), "Recruiter-ready system", "Career readiness")
    draw_score_ring(draw, 1100, 252, "93")
    text(draw, (560, 246), "Your proof, pipeline, and follow-up system", MUTED, F_BODY)
    text(draw, (560, 282), "are strong enough for serious outreach.", MUTED, F_BODY)
    metric_card(draw, 532, 356, "Applications", "4", GREEN)
    metric_card(draw, 700, 356, "Projects", "4", TEAL)
    metric_card(draw, 868, 356, "Network", "3", GOLD)
    metric_card(draw, 1036, 356, "Coverage", "25%", CLAY)
    card(draw, (532, 462, 852, 634), "AI Coach")
    for i, item in enumerate(["Pipeline move", "Portfolio proof", "Interview readiness"]):
        text(draw, (558, 532 + i * 32), item, INK if i == 0 else MUTED, F_SMALL)
    card(draw, (882, 462, 1188, 634), "Weekly Career Plan")
    for i, item in enumerate(["Resolve overdue items", "Add applications", "Network outreach"]):
        text(draw, (908, 532 + i * 32), item, INK if i == 0 else MUTED, F_SMALL)
    return canvas


def resume_slide():
    canvas = Image.new("RGB", SIZE, BG)
    draw = ImageDraw.Draw(canvas)
    draw_header(draw)
    text(draw, (56, 150), "RESUME COACH", TEAL, F_SMALL)
    text(draw, (54, 188), "Turn work", INK, F_H1)
    text(draw, (54, 238), "into evidence", INK, F_H1)
    text(draw, (58, 326), "Draft bullets, check skill alignment,", MUTED, F_BODY)
    text(draw, (58, 362), "and connect claims to public proof.", MUTED, F_BODY)

    draw_window(draw, 502, 112, 724, 540)
    card(draw, (532, 176, 842, 620), "Resume Vault")
    text(draw, (562, 260), "Nexus AI | JavaScript, Python,", INK, F_SMALL)
    text(draw, (562, 292), "FastAPI, SQLite", INK, F_SMALL)
    bullets = [
        "Built a full-stack career OS",
        "Designed readiness scoring",
        "Deployed backend on Render",
    ]
    for i, bullet in enumerate(bullets):
        text(draw, (562, 350 + i * 48), f"- {bullet}", MUTED, F_SMALL)
    rounded(draw, (562, 536, 812, 586), 8, DARK)
    text(draw, (636, 552), "SAVE NOTES", (255, 255, 255), F_SMALL)

    card(draw, (872, 176, 1188, 620), "Resume Coach")
    coach = [
        ("Resume strength", "88/100", GREEN),
        ("Public proof", "4 project links", TEAL),
        ("Skill alignment", "AI Data Analyst", GOLD),
        ("Next edit", "Add metrics", CLAY),
    ]
    for i, (label, value, color) in enumerate(coach):
        y = 260 + i * 76
        rounded(draw, (902, y, 1158, y + 54), 10, SOFT)
        draw.rectangle((902, y, 909, y + 54), fill=color)
        text(draw, (926, y + 9), label, INK, F_SMALL)
        text(draw, (1062, y + 9), value, MUTED, F_TINY)
    return canvas


def case_slide():
    canvas = Image.new("RGB", SIZE, BG)
    draw = ImageDraw.Draw(canvas)
    draw_header(draw)
    text(draw, (56, 150), "PRODUCT CASE STUDY", CLAY, F_SMALL)
    text(draw, (54, 188), "Explain the product", INK, F_H1)
    text(draw, (58, 260), "The app documents the problem,", MUTED, F_BODY)
    text(draw, (58, 296), "system design, evidence, and roadmap.", MUTED, F_BODY)

    draw_window(draw, 502, 112, 724, 540)
    card(draw, (532, 176, 1188, 310), "Career prep should be trackable", "Problem")
    text(draw, (560, 248), "Students use disconnected tools for applications,", MUTED, F_SMALL)
    text(draw, (560, 276), "projects, networking, resume drafts, and goals.", MUTED, F_SMALL)

    card(draw, (532, 338, 840, 620), "System Design")
    for i, row in enumerate(["Frontend dashboard", "FastAPI backend", "SQLite workspace", "Coaching logic"]):
        y = 414 + i * 42
        rounded(draw, (560, y, 812, y + 30), 8, SOFT)
        text(draw, (576, y + 7), row, INK, F_TINY)

    card(draw, (878, 338, 1188, 620), "Roadmap")
    for i, row in enumerate(["Authentication", "PostgreSQL", "True AI feedback", "Mentor sharing"]):
        y = 414 + i * 42
        rounded(draw, (906, y, 1160, y + 30), 8, SOFT)
        text(draw, (922, y + 7), row, INK, F_TINY)
    return canvas


slides = [shell_slide(), dashboard_slide(), resume_slide(), case_slide()]
frames = []
durations = []

for index, slide in enumerate(slides):
    frames.append(slide)
    durations.append(20000)
    if index < len(slides) - 1:
        next_slide = slides[index + 1]
        for step in range(1, 7):
            frames.append(Image.blend(slide, next_slide, step / 7))
            durations.append(70)

slides[0].save(POSTER, quality=95)
frames[0].save(OUT, save_all=True, append_images=frames[1:], duration=durations, loop=0, optimize=True)

print(f"Wrote {OUT}")
print(f"Wrote {POSTER}")
